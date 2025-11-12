import rdf from '@rdfjs/data-model';
import { arrayOf, getSlugFromUri } from '@semapps/ldp';
import { solid, skos, apods } from '@semapps/ontologies';
import { ServiceSchema } from 'moleculer';
import PublicTypeIndexService from './public-type-index.ts';
import PrivateTypeIndexService from './private-type-index.ts';
import { TypeRegistration } from '../../types.ts';

const TypeIndexService = {
  name: 'type-index' as const,
  dependencies: ['ontologies', 'public-type-index', 'private-type-index'],
  created() {
    this.broker.createService(PublicTypeIndexService);
    this.broker.createService(PrivateTypeIndexService);
  },
  async started() {
    await this.broker.call('ontologies.register', solid);
    await this.broker.call('ontologies.register', skos);
    await this.broker.call('ontologies.register', apods);
  },
  actions: {
    register: {
      visibility: 'public',
      params: {
        types: { type: 'array' },
        uri: { type: 'string' },
        webId: { type: 'string', optional: true },
        isContainer: { type: 'boolean', default: true },
        isPrivate: { type: 'boolean', default: false }
      },
      async handler(ctx) {
        let { types, uri, isContainer, isPrivate } = ctx.params;
        const webId = ctx.params.webId || ctx.meta.webId;

        const existingRegistration: TypeRegistration = await this.actions.getByUri(
          { uri, isPrivate },
          { parentCtx: ctx }
        );

        const expandedTypes: string[] = await ctx.call('jsonld.parser.expandTypes', { types });

        const typeIndexUri = await ctx.call(`${isPrivate ? 'private' : 'public'}-type-index.getUri`, { webId });

        // Use a hash based on the URI (which should be unique !)
        const typeRegistrationUri = `${typeIndexUri}#${getSlugFromUri(uri)}`;

        if (existingRegistration) {
          const oldExpandedTypes = existingRegistration.types; // Types are already expanded
          const newExpandedTypes = expandedTypes.filter((t: any) => !oldExpandedTypes.includes(t));

          if (newExpandedTypes.length > 0) {
            for (const expandedType of newExpandedTypes) {
              this.logger.info(`Adding type ${expandedType} to type registration ${typeRegistrationUri}`);
              await this.actions.patch({
                resourceUri: typeIndexUri,
                triplesToAdd: expandedTypes.map(type =>
                  rdf.quad(
                    rdf.namedNode(typeRegistrationUri),
                    rdf.namedNode('http://www.w3.org/ns/solid/terms#forClass'),
                    rdf.namedNode(type)
                  )
                ),
                webId: 'system'
              });
            }
          } else {
            this.logger.info(`The URI ${uri} is already registered. Skipping...`);
          }
        } else {
          // Add the type registration
          await ctx.call(
            'ldp.resource.patch',
            {
              resourceUri: typeIndexUri,
              triplesToAdd: [
                rdf.quad(
                  rdf.namedNode(typeRegistrationUri),
                  rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
                  rdf.namedNode('http://www.w3.org/ns/solid/terms#TypeRegistration')
                ),
                rdf.quad(
                  rdf.namedNode(typeRegistrationUri),
                  rdf.namedNode(
                    isContainer
                      ? 'http://www.w3.org/ns/solid/terms#instanceContainer'
                      : 'http://www.w3.org/ns/solid/terms#instance'
                  ),
                  rdf.namedNode(uri)
                ),
                ...expandedTypes.map(type =>
                  rdf.quad(
                    rdf.namedNode(typeRegistrationUri),
                    rdf.namedNode('http://www.w3.org/ns/solid/terms#forClass'),
                    rdf.namedNode(type)
                  )
                )
              ],
              webId: 'system'
            },
            { parentCtx: ctx }
          );
        }
      }
    },

    getByUri: {
      visibility: 'public',
      params: {
        uri: { type: 'string' },
        isPrivate: { type: 'boolean', optional: true }
      },
      async handler(ctx) {
        const { uri, isPrivate } = ctx.params;

        // If isPrivate is not defined, search in both type indexes
        let typeIndexUris = [];
        if (isPrivate === false || isPrivate === undefined)
          typeIndexUris.push(await ctx.call(`public-type-index.getUri`));
        if (isPrivate === true || isPrivate === undefined)
          typeIndexUris.push(await ctx.call(`private-type-index.getUri`));

        const results = await ctx.call('triplestore.query', {
          query: `
            PREFIX solid: <http://www.w3.org/ns/solid/terms#>
            SELECT ?type ?indexType ?instancePredicate
            WHERE {
              VALUES ?typeIndexUri { ${typeIndexUris.map(typeIndexUri => `<${typeIndexUri}>`).join(' ')} }
              VALUES ?instancePredicate { solid:instanceContainer solid:instance }
              VALUES ?indexType { solid:ListedDocument solid:UnlistedDocument }
              GRAPH ?typeIndexUri {
                ?typeIndexUri a ?indexType .
                ?typeRegistrationUri a solid:TypeRegistration .
                ?typeRegistrationUri solid:forClass ?type .
                ?typeRegistrationUri ?instancePredicate <${uri}> .
              }
            }
          `,
          webId: 'system'
        });

        if (arrayOf(results).length > 0) {
          return {
            types: arrayOf(results).map((r: any) => r.type.value),
            uri,
            isPrivate: arrayOf(results)[0].indexType.value === 'http://www.w3.org/ns/solid/terms#UnlistedDocument',
            isContainer:
              arrayOf(results)[0].instancePredicate.value === 'http://www.w3.org/ns/solid/terms#instanceContainer'
          } as TypeRegistration;
        }
      }
    },

    getByType: {
      visibility: 'public',
      params: {
        type: { type: 'string' },
        isContainer: { type: 'boolean', optional: true },
        isPrivate: { type: 'boolean', optional: true }
      },
      async handler(ctx) {
        const { type, isContainer, isPrivate } = ctx.params;

        const [expandedType] = (await ctx.call('jsonld.parser.expandTypes', { types: [type] })) as string[];

        // If isPrivate is not defined, search in both type indexes
        let typeIndexUris = [];
        if (isPrivate === false || isPrivate === undefined)
          typeIndexUris.push(await ctx.call(`public-type-index.getUri`));
        if (isPrivate === true || isPrivate === undefined)
          typeIndexUris.push(await ctx.call(`private-type-index.getUri`));

        // If isContainer is not defined, look for both containers and single resources
        let instancePredicates = [];
        if (isContainer === true || isContainer === undefined) instancePredicates.push('solid:instanceContainer');
        if (isContainer === false || isContainer === undefined) instancePredicates.push('solid:instance');

        const results = await ctx.call('triplestore.query', {
          query: `
            PREFIX solid: <http://www.w3.org/ns/solid/terms#>
            SELECT ?uri ?type ?indexType ?instancePredicate
            WHERE {
              VALUES ?typeIndexUri { ${typeIndexUris.map(uri => `<${uri}>`).join(' ')} }
              VALUES ?instancePredicate { ${instancePredicates.join(' ')} }
              VALUES ?indexType { solid:ListedDocument solid:UnlistedDocument }
              GRAPH ?typeIndexUri {
                ?typeIndexUri a ?indexType .
                ?typeRegistrationUri a solid:TypeRegistration .
                ?typeRegistrationUri solid:forClass <${expandedType}>, ?type .
                ?typeRegistrationUri ?instancePredicate ?uri
              }
            }
          `,
          webId: 'system'
        });

        return {
          types: arrayOf(results).map((r: any) => r.type.value),
          uri: arrayOf(results)[0].uri.value,
          isPrivate: arrayOf(results)[0].indexType.value === 'http://www.w3.org/ns/solid/terms#UnlistedDocument',
          isContainer:
            arrayOf(results)[0].instancePredicate.value === 'http://www.w3.org/ns/solid/terms#instanceContainer'
        } as TypeRegistration;
      }
    }
  }
} satisfies Partial<ServiceSchema>;

export default TypeIndexService;
