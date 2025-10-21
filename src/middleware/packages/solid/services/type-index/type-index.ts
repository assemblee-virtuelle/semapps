import rdf from '@rdfjs/data-model';
import { arrayOf, getDatasetFromUri, getSlugFromUri, isWebId } from '@semapps/ldp';
import { solid, skos, apods } from '@semapps/ontologies';
import { ServiceSchema } from 'moleculer';
import PublicTypeIndexService from './public-type-index.ts';
import PrivateTypeIndexService from './private-type-index.ts';

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
        webId: { type: 'string' },
        isContainer: { type: 'boolean', default: true },
        isPrivate: { type: 'boolean', default: false }
      },
      async handler(ctx) {
        let { types, uri, webId, isContainer, isPrivate } = ctx.params;

        const expandedTypes: string[] = await ctx.call('jsonld.parser.expandTypes', { types });
        const oldExpandedTypes: string[] = await this.actions.getTypes({ uri, webId, isPrivate });

        const typeIndexUri = await ctx.call(`${isPrivate ? 'private' : 'public'}-type-index.getUri`, { webId });

        // Use a hash based on the URI (which should be unique !)
        const typeRegistrationUri = `${typeIndexUri}#${getSlugFromUri(uri)}`;

        if (oldExpandedTypes.length > 0) {
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
                webId
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
              webId
            },
            { parentCtx: ctx }
          );
        }

        // Invalidate the whole cache
        if (this.broker.cacher) await this.broker.cacher.clean(`type-index.**`);
      }
    },

    getTypes: {
      visibility: 'public',
      params: {
        uri: { type: 'string' },
        webId: { type: 'string', optional: true },
        isPrivate: { type: 'boolean', optional: true }
      },
      cache: true,
      async handler(ctx) {
        const { uri, webId, isPrivate } = ctx.params;

        // If isPrivate is not defined, search in both type indexes
        let typeIndexUris = [];
        if (isPrivate === false || isPrivate === undefined)
          typeIndexUris.push(await ctx.call(`public-type-index.getUri`, { webId }));
        if (isPrivate === true || isPrivate === undefined)
          typeIndexUris.push(await ctx.call(`private-type-index.getUri`, { webId }));

        const results = await ctx.call('triplestore.query', {
          query: `
            PREFIX solid: <http://www.w3.org/ns/solid/terms#>
            SELECT ?type
            WHERE {
              VALUES ?typeIndexUri { ${typeIndexUris.map(typeIndexUri => `<${typeIndexUri}>`).join(' ')} }
              VALUES ?instancePredicate { solid:instanceContainer solid:instance }
              GRAPH ?typeIndexUri {
                ?typeRegistrationUri a solid:TypeRegistration .
                ?typeRegistrationUri solid:forClass ?type .
                ?typeRegistrationUri ?instancePredicate <${uri}> .
              }
            }
          `,
          webId: 'system',
          dataset: isWebId(webId) ? getDatasetFromUri(webId) : undefined
        });

        return arrayOf(results).map((r: any) => r.type.value);
      }
    },

    getUris: {
      visibility: 'public',
      params: {
        type: { type: 'string' },
        webId: { type: 'string', optional: true },
        isContainer: { type: 'boolean', optional: true },
        isPrivate: { type: 'boolean', optional: true }
      },
      cache: true,
      async handler(ctx) {
        const { type, webId, isContainer, isPrivate } = ctx.params;

        const [expandedType] = (await ctx.call('jsonld.parser.expandTypes', { types: [type] })) as string[];

        // If isPrivate is not defined, search in both type indexes
        let typeIndexUris = [];
        if (isPrivate === false || isPrivate === undefined)
          typeIndexUris.push(await ctx.call(`public-type-index.getUri`, { webId }));
        if (isPrivate === true || isPrivate === undefined)
          typeIndexUris.push(await ctx.call(`private-type-index.getUri`, { webId }));

        // If isContainer is not defined, look for both containers and single resources
        let instancePredicates = [];
        if (isContainer === true || isContainer === undefined) instancePredicates.push('solid:instanceContainer');
        if (isContainer === false || isContainer === undefined) instancePredicates.push('solid:instance');

        const results = await ctx.call('triplestore.query', {
          query: `
            PREFIX solid: <http://www.w3.org/ns/solid/terms#>
            SELECT ?uri
            WHERE {
              VALUES ?typeIndexUri { ${typeIndexUris.map(uri => `<${uri}>`).join(' ')} }
              VALUES ?instancePredicate { ${instancePredicates.join(' ')} }
              GRAPH ?typeIndexUri {
                ?typeRegistrationUri a solid:TypeRegistration .
                ?typeRegistrationUri solid:forClass <${expandedType}> .
                ?typeRegistrationUri ?instancePredicate ?uri
              }
            }
          `,
          webId: 'system',
          dataset: isWebId(webId) ? getDatasetFromUri(webId) : undefined
        });

        return results.map((r: any) => r.uri.value);
      }
    }
  },
  events: {
    'ldp.container.created': {
      async handler(ctx) {
        const { containerUri, registration, webId } = ctx.params;

        if (registration && registration.acceptedTypes) {
          const serviceName = `${registration.typeIndex === 'private' ? 'private' : 'public'}-type-index`;

          await this.broker.waitForServices([serviceName]);
          await ctx.call(`${serviceName}.waitForCreation`, { webId });

          await this.actions.register(
            {
              types: arrayOf(registration.acceptedTypes),
              uri: containerUri,
              webId,
              isContainer: true,
              isPrivate: registration.typeIndex === 'private'
            },
            { parentCtx: ctx }
          );
        }
      }
    },
    'ldp.resource.created': {
      async handler(ctx) {
        const { resourceUri, registration, webId } = ctx.params;

        // When a controlled resource is created, we pass the registration as a parameter
        if (registration && registration.acceptedTypes) {
          const serviceName = `${registration.typeIndex === 'private' ? 'private' : 'public'}-type-index`;

          await this.broker.waitForServices([serviceName]);
          await ctx.call(`${serviceName}.waitForCreation`, { webId });

          await this.actions.register(
            {
              types: arrayOf(registration.acceptedTypes),
              uri: resourceUri,
              webId,
              isContainer: false,
              isPrivate: registration.typeIndex === 'private'
            },
            { parentCtx: ctx }
          );
        }
      }
    }
  }
} satisfies Partial<ServiceSchema>;

export default TypeIndexService;
