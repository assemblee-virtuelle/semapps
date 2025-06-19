// @ts-expect-error TS(7016): Could not find a declaration file for module 'spea... Remove this comment to see the full error message
import createSlug from 'speakingurl';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { uuidv4 as v4 } from 'uuid';
import urlJoin from 'url-join';
import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2769): No overload matches this call.
    containerUri: 'string',
    slug: { type: 'string', optional: true },
    isContainer: { type: 'boolean', default: false }
  },
  async handler(ctx) {
    let { containerUri, slug, isContainer } = ctx.params;
    let uuid;

    if (slug) {
      // Slugify the slug
      // @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
      slug = createSlug(slug, { lang: 'fr', custom: { '.': '.' } });
    } else {
      // @ts-expect-error TS(2552): Cannot find name 'uuidv4'. Did you mean 'uuid'?
      uuid = uuidv4();
    }

    // Do not use the root container URI if the resource is a container
    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    if ((!this.settings.resourcesWithContainerPath || !containerUri) && !isContainer) {
      // Use the root container URI
      // @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
      containerUri = this.settings.podProvider
        ? // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          await ctx.call('solid-storage.getUrl', { webId: urlJoin(this.settings.baseUrl, ctx.meta.dataset) })
        : // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          this.settings.baseUrl;
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
          // @ts-expect-error TS(2322): Type 'number' is not assignable to type 'never'.
          slug += counter;
        } else {
          // If no slug is declared, generate a new UUID
          // @ts-expect-error TS(2552): Cannot find name 'uuidv4'. Did you mean 'uuid'?
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
});

export default Schema;
