// @ts-expect-error TS(7016): Could not find a declaration file for module 'spea... Remove this comment to see the full error message
import createSlug from 'speakingurl';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidv4 } from 'uuid';
import urlJoin from 'url-join';
import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'Parameter... Remove this comment to see the full error message
    containerUri: 'string',
    slug: { type: 'string', optional: true },
    // @ts-expect-error TS(2322): Type '{ type: "boolean"; default: false; }' is not... Remove this comment to see the full error message
    isContainer: { type: 'boolean', default: false }
  },
  async handler(ctx) {
    let { containerUri, slug, isContainer } = ctx.params;
    let uuid;

    if (slug) {
      // Slugify the slug
      slug = createSlug(slug, { lang: 'fr', custom: { '.': '.' } });
    } else {
      uuid = uuidv4();
    }

    // Do not use the root container URI if the resource is a container
    if ((!this.settings.resourcesWithContainerPath || !containerUri) && !isContainer) {
      // Use the root container URI
      containerUri = this.settings.podProvider
        ? // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
          await ctx.call('solid-storage.getUrl', { webId: urlJoin(this.settings.baseUrl, ctx.meta.dataset) })
        : this.settings.baseUrl;
    }

    let resourceAlreadyExists = await ctx.call('ldp.resource.exist', {
      resourceUri: urlJoin(containerUri, slug || uuid),
      webId: 'system'
    });

    let counter = 0;
    if (resourceAlreadyExists) {
      if (isContainer) {
        throw new Error(
          `Invalid slug for container. A resource with URI ${urlJoin(containerUri, slug || uuid)} already exists`
        );
      }

      do {
        if (slug) {
          // If a slug is declared, add a number at the end
          counter += 1;
          slug += counter;
        } else {
          // If no slug is declared, generate a new UUID
          uuid = uuidv4();
        }
        resourceAlreadyExists = await ctx.call('ldp.resource.exist', {
          resourceUri: urlJoin(containerUri, slug || uuid),
          webId: 'system'
        });
      } while (resourceAlreadyExists);
    }

    return urlJoin(containerUri, slug || uuid);
  }
} satisfies ActionSchema;

export default Schema;
