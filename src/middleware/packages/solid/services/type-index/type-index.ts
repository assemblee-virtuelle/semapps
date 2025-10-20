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
        containerUri: { type: 'string' },
        webId: { type: 'string' },
        isPrivate: { type: 'boolean', default: false }
      },
      async handler(ctx) {
        let { types, containerUri, webId, isPrivate } = ctx.params;

        const expandedTypes = await ctx.call('jsonld.parser.expandTypes', { types });
        const oldExpandedTypes = await this.actions.getTypes({ containerUri, webId });

        if (oldExpandedTypes.length > 0) {
          throw new Error('Not implemented');
          // const newExpandedTypes = expandedTypes.filter((t: any) => !oldExpandedTypes.includes(t));

          // if (newExpandedTypes.length > 0) {
          //   for (const expandedType of newExpandedTypes) {
          //     this.logger.info(`Adding type ${expandedType} to type registration ${existingRegistration.id}`);
          //     await this.actions.patch({
          //       resourceUri: existingRegistration.id,
          //       triplesToAdd: [
          //         rdf.quad(
          //           rdf.namedNode(existingRegistration.id),
          //           rdf.namedNode('http://www.w3.org/ns/solid/terms#forClass'),
          //           rdf.namedNode(expandedType)
          //         )
          //       ],
          //       webId
          //     });
          // }
          // } else {
          //   this.logger.info(`The container ${containerUri} is already registered. Skipping...`);
          // }
        } else {
          const typeIndexUri = await ctx.call(`${isPrivate ? 'private' : 'public'}-type-index.getUri`, { webId });

          // Generate a hash based on the container URI (which should be unique !)
          const typeRegistrationUri = `${typeIndexUri}#${getSlugFromUri(containerUri)}`;

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
                  rdf.namedNode('http://www.w3.org/ns/solid/terms#instanceContainer'),
                  rdf.namedNode(containerUri)
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
        containerUri: { type: 'string' },
        webId: { type: 'string', optional: true },
        isPrivate: { type: 'boolean', optional: true }
      },
      cache: true,
      async handler(ctx) {
        const { containerUri, webId, isPrivate } = ctx.params;

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
              VALUES ?typeIndexUri { ${typeIndexUris.map(uri => `<${uri}>`).join(' ')} }
              GRAPH ?typeIndexUri {
                ?typeRegistrationUri a solid:TypeRegistration .
                ?typeRegistrationUri solid:forClass ?type .
                ?typeRegistrationUri solid:instanceContainer <${containerUri}> .
              }
            }
          `,
          webId: 'system',
          dataset: isWebId(webId) ? getDatasetFromUri(webId) : undefined
        });

        return arrayOf(results).map((r: any) => r.type.value);
      }
    },

    getContainersUris: {
      visibility: 'public',
      params: {
        type: { type: 'string' },
        webId: { type: 'string', optional: true },
        isPrivate: { type: 'boolean', optional: true }
      },
      cache: true,
      async handler(ctx) {
        const { type, webId, isPrivate } = ctx.params;

        const [expandedType] = await ctx.call('jsonld.parser.expandTypes', { types: [type] });

        // If isPrivate is not defined, search in both type indexes
        let typeIndexUris = [];
        if (isPrivate === false || isPrivate === undefined)
          typeIndexUris.push(await ctx.call(`public-type-index.getUri`, { webId }));
        if (isPrivate === true || isPrivate === undefined)
          typeIndexUris.push(await ctx.call(`private-type-index.getUri`, { webId }));

        const results = await ctx.call('triplestore.query', {
          query: `
            PREFIX solid: <http://www.w3.org/ns/solid/terms#>
            SELECT ?containerUri
            WHERE {
              VALUES ?typeIndexUri { ${typeIndexUris.map(uri => `<${uri}>`).join(' ')} }
              GRAPH ?typeIndexUri {
                ?typeRegistrationUri a solid:TypeRegistration .
                ?typeRegistrationUri solid:forClass <${expandedType}> .
                ?typeRegistrationUri solid:instanceContainer ?containerUri
              }
            }
          `,
          webId: 'system',
          dataset: isWebId(webId) ? getDatasetFromUri(webId) : undefined
        });

        return results.map((r: any) => r.containerUri.value);
      }
    }
  },
  events: {
    'ldp.container.created': {
      async handler(ctx) {
        const { containerUri, options, webId } = ctx.params;

        const serviceName = `${options.typeIndex === 'private' ? 'private' : 'public'}-type-index`;

        await this.broker.waitForServices([serviceName]);
        await ctx.call(`${serviceName}.waitForCreation`, { webId });

        await this.actions.register(
          {
            types: arrayOf(options?.acceptedTypes),
            containerUri,
            webId,
            isPrivate: options.typeIndex === 'private'
          },
          { parentCtx: ctx }
        );
      }
    }
  }
} satisfies Partial<ServiceSchema>;

export default TypeIndexService;
