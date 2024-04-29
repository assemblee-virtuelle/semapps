const { MIME_TYPES } = require('@semapps/mime-types');
const { isObject, defaultToArray, arrayOf } = require('../utils');

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

module.exports = {
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

      // Call the ldp.resource.get method to get the resource
      let result = await ctx.call('ldp.resource.get', {
        resourceUri: reference['@id'] || reference.id || reference,
        accept: MIME_TYPES.JSON
      });
      // Delete the context from the result
      delete result['@context'];
      return result;
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
          defaultToArray(propertiesSchema).map(async ({ property, nested }) => {
            // Check if property to dereference is present in retrieved object.
            if (!mainData[property]) return;

            // There may be more than one reference in a property, so iterate over each
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
     * Dereference and return the result after get. This is called after the result has been resolve thanks to ldp service
     * @param {object} ctx - moleculer context
     * @param {any} result - the result of the operation. It can be any type
     * @returns { Promise<any> } - the result of the operation or an error if there was a problem with the result
     */
    async handleAfterGet(ctx, result) {
      const dereferenced = await this.dereference(ctx, result, this.settings.dereferencePlan || []);
      // Apply framing, if jsonContext if present, since dereferenced properties are not yet.
      const { jsonContext } = ctx.params;
      if (jsonContext) {
        return await ctx.call('jsonld.parser.frame', {
          input: result,
          frame: {
            '@context': jsonContext
          }
        });
      }
      return dereferenced;
    }
  },
  hooks: {
    after: {
      get: ['handleAfterGet']
    }
  }
};
