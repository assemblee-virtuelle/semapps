import { ServiceSchema } from 'moleculer';
import { isObject, arrayOf } from '../utils.ts';

/**
 * @description MoleculerJS mixin to be applied on the ControlledContainerMixin within a Semapps project.
 * Provides resource dereferencing after ldp.resource.get execution using after.get hook.
 *
 * Calls `ldp.resource.get` recursively on all properties defined in schema and adds them to the result.
 * The default json context is applied when fetching, so use the corresponding default context's property name.
 * The final result is framed using the jsonContext provided in the get request (if present).
 *
 * This is not very efficient. At some time, this might be refactored to utilize a custom SPARQL query.
 *
 * Example moleculer service:
 * ```javascript
 * module.exports = {
 * name: 'resources',
 * mixins: [ControlledContainerMixin, DereferenceMixin],
 * settings: {
 *   path: '/resources',
 *   dereferencePlan: [
 *     {
 *       property: "publicKey"
 *     },
 *     {
 *       property: "schema:member",
 *       nested: [
 *         { property: "schema:affiliation" }
 *       ]
 *     },
 *   ]
 *  }
 * }
 * ```
 * @type {import('moleculer').ServiceSchema}
 */

const Schema = {
  dependencies: ['ldp.resource'],
  methods: {
    /**
     * Get a property from main data. This is a wrapper around ldp.resource.get to allow us to pass in the property to the API
     * @param ctx - moleculer context
     * @param mainData - The main data to get the property from
     * @param property - The property to get from mainData. It must be a property of mainData
     * @returns { Promise } The result of the get operation as a JSON object with @context removed from the result
     */
    async getWithoutContext(ctx, reference) {
      // If ref not defined or if it's a resolved object with no id (created by blank nodes)...
      if (typeof reference !== 'string' && !reference?.['@id'] && !reference?.id) return reference;

      const resourceUri = reference['@id'] || reference.id || reference;

      // Get the resource.
      try {
        let result = await ctx.call('ldp.resource.get', {
          resourceUri
        });
        // Delete the context from the result
        delete result['@context'];
        return result;
      } catch (e) {
        if (e.code === 403 || e.code === 404) {
          return resourceUri;
        } else {
          throw e;
        }
      }
    },

    /**
     * Dereferences properties from mainData according to propertiesSchema.
     * @param {object} ctx - moleculer context
     * @param {object | object[]} mainData - The main data to dereference. Can be an array or an object.
     * @param {object | object[] } propertiesSchema - The properties schema to dereference the mainData with.
     * @returns { Promise } Resolves to the dereferenced data
     */
    async dereference(ctx, mainData, propertiesSchema) {
      if (Array.isArray(mainData)) {
        // Dereference all elements recursively (in parallel).
        return Promise.all(mainData.map(dataEl => this.dereference(ctx, dataEl, propertiesSchema)));
      } else if (isObject(mainData)) {
        let resultData = { ...mainData };

        // Dereference each property in schema.
        await Promise.all(
          arrayOf(propertiesSchema).map(async ({ property, nested }) => {
            // Check if property to dereference is present in retrieved object.
            if (!mainData[property]) return;

            // Resolve all references of that property.
            const dereferenced = await Promise.all(
              arrayOf(mainData[property]).map(async reference => {
                const dereferencedObj = await this.getWithoutContext(ctx, reference);

                // If there is a nested dereference schema
                if (nested && dereferencedObj !== undefined) {
                  return await this.dereference(ctx, dereferencedObj, nested);
                } else {
                  return dereferencedObj;
                }
              })
            );

            if (dereferenced.length === 1) {
              // eslint-disable-next-line prefer-destructuring
              resultData[property] = dereferenced[0];
            } else {
              resultData[property] = dereferenced;
            }
          })
        );

        return resultData;
      } else {
        return mainData;
      }
    },

    /**
     * Dereference a json-ld object according to the service's dereferencePlan.
     * @param {object} ctx - moleculer context
     * @param {any} result - the result of the `get` operation.
     * @returns { Promise<any> } - The dereferenced object.
     */
    async handleAfterGet(ctx, result) {
      if (!this.settings.dereferencePlan) return result;

      const dereferenced = await this.dereference(ctx, result, this.settings.dereferencePlan);
      // Apply framing, if jsonContext if present, since dereferenced properties might not yet be framed correctly.
      const { resourceUri, jsonContext } = ctx.params;
      if (jsonContext) {
        return await ctx.call('jsonld.parser.frame', {
          input: result,
          frame: {
            '@context': jsonContext,
            '@id': resourceUri
          }
        });
      } else {
        return dereferenced;
      }
    }
  },
  hooks: {
    after: {
      get: ['handleAfterGet']
    }
  }
} satisfies Partial<ServiceSchema>;

export default Schema;
