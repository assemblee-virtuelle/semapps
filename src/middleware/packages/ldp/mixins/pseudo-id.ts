import { ServiceSchema } from 'moleculer';

/**
 * MoleculerJS mixin to be applied on the ControlledContainerMixin.
 * Adds support for adding different subjects to the same resource/named graph than the resource URI itself.
 * For that, it uses a pseudo-id predicate.
 *
 * Attention: Only works with JSON-LD resources.
 *
 * @deprecated This is a temporary solution until we have a quad-store.
 *
 * @type {import('moleculer').ServiceSchema}
 */
const Schema = {
  dependencies: ['ldp.resource'],
  settings: {
    pseudoIdPredicate: 'urn:tmp:pseudoId'
  },
  methods: {
    replacePseudoIdWithId(obj) {
      if (Array.isArray(obj)) {
        return obj.map(this.replacePseudoIdWithId);
      }
      if (typeof obj !== 'object') {
        return obj;
      }
      const newObj = { ...obj };

      if (newObj[this.settings.pseudoIdPredicate]) {
        newObj.id = newObj[this.settings.pseudoIdPredicate];
        delete newObj[this.settings.pseudoIdPredicate];
      }

      for (const key in newObj) {
        if (Object.hasOwn(newObj, key)) {
          newObj[key] = this.replacePseudoIdWithId(newObj[key]);
        }
      }
      return newObj;
    },

    replaceIdWithPseudoId(obj, isRoot = false) {
      if (Array.isArray(obj)) {
        return obj.map(this.replaceIdWithPseudoId);
      }
      if (typeof obj !== 'object') {
        return obj;
      }
      const newObj = { ...obj };

      if (!isRoot && (newObj.id || newObj['@id'])) {
        newObj[this.settings.pseudoIdPredicate] = newObj['@id'] || newObj.id;
        delete newObj.id;
        delete newObj['@id'];
      }

      for (const key in newObj) {
        if (Object.hasOwn(newObj, key)) {
          newObj[key] = this.replaceIdWithPseudoId(newObj[key]);
        }
      }
      return newObj;
    },

    /**
     * Replace pseudo id with id field.
     * @param {object} ctx - moleculer context
     * @returns { Promise<any> } - The dereferenced object.
     */
    async handleAfterGet(ctx, result) {
      return this.replacePseudoIdWithId(result);
    },

    /**
     * Replace id with pseudo id field.
     */
    async handleBeforePost(ctx) {
      const { resource } = ctx.params;
      const newResource = this.replaceIdWithPseudoId(resource, true);
      ctx.params.resource = newResource;
    }
  },
  hooks: {
    before: {
      post: ['handleBeforePost'],
      put: ['handleBeforePost']
    },
    after: {
      get: ['handleAfterGet'],
      list: ['handleAfterGet']
    }
  }
} satisfies ServiceSchema;

export default Schema;
