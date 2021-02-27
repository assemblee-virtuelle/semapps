const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const { getSlugFromUri } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    const { containerUri, id, ...resource } = ctx.params;

    // PUT have to stay in same container and @id can't be different
    // TODO generate an error instead of overwriting the ID
    resource['@id'] = `${containerUri}/${id}`;
    if (ctx.meta.parser === 'file') {
      throw new MoleculerError(`PUT method is not supported for non-RDF resources`, 400, 'BAD_REQUEST');
    }

    try {
      await ctx.call('ldp.resource.put', {
        resource,
        contentType: ctx.meta.headers['content-type'],
        containerUri,
        slug: id,
        webId: ctx.meta.webId
      });
      ctx.meta.$statusCode = 204;
      ctx.meta.$responseHeaders = {
        Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
        'Content-Length': 0
      };
    } catch (e) {
      console.error(e);
      ctx.meta.$statusCode = e.code || 500;
      ctx.meta.$statusMessage = e.message;
    }
  },
  action: {
    visibility: 'public',
    params: {
      resource: { type: 'object' },
      webId: { type: 'string', optional: true },
      contentType: { type: 'string' },
      disassembly: {
        type: 'array',
        optional: true
      }
    },
    async handler(ctx) {
      const containerUri = ctx.params.containerUri;
      const { resource, contentType, webId, disassembly } = {
        ...(await ctx.call('ldp.container.getOptions', { uri: containerUri })),
        ...ctx.params
      };

      const resourceUri = resource.id || resource['@id'];

      // Save the current data, to be able to send it through the event
      // If the resource does not exist, it will throw a 404 error
      // If the new data are badly formatted, old data will be reinserted before throwing a 400 error
      const oldData = await ctx.call('ldp.resource.get', {
        resourceUri,
        accept: MIME_TYPES.JSON
      });

      // First delete the whole resource
      console.log('resourceUri PUT', resourceUri);
      await ctx.call('ldp.resource.delete', {
        resourceUri,
        webId
      });

      // if (disassembly && contentType == MIME_TYPES.JSON) {
      //   for (disassemblyItem of disassembly) {
      //     // console.log('disassembly',disassemblyItem);
      //
      //     if (resource[disassemblyItem.path]) {
      //       let rawDisassemblyValue = resource[disassemblyItem.path];
      //       if (!Array.isArray(rawDisassemblyValue)){
      //         rawDisassemblyValue=[rawDisassemblyValue];
      //       }
      //       const uriInserted=[];
      //       for (let disassemblyValue of rawDisassemblyValue){
      //         console.log('disassemblyValue',disassemblyValue);
      //         let {id,...usableValue}=disassemblyValue
      //         usableValue = {
      //           '@context': resource['@context'],
      //           ...usableValue,
      //         };
      //         console.log('POST',usableValue);
      //         disassemblyResourceUri = await ctx.call('ldp.resource.post', {
      //           containerUri: disassemblyItem.container,
      //           resource: usableValue,
      //           contentType: MIME_TYPES.JSON,
      //           accept: MIME_TYPES.JSON,
      //           webId: webId
      //         });
      //         console.log('resourceUri',disassemblyResourceUri);
      //         uriInserted.push(disassemblyResourceUri);
      //       }
      //
      //       resource[disassemblyItem.path] = uriInserted;
      //     }
      //   }
      // }

      let newData;
      try {
        // ... then insert back all the data
        console.log('resource[@id]', resource['@id']);
        newData = await ctx.call('ldp.resource.post', {
          resource,
          contentType,
          containerUri,
          webId,
          slug: getSlugFromUri(resource['@id'])
        });
      } catch (e) {
        // If the insertion of new data fails, inserts back old data
        console.log('POST FAILED', e, oldData['@id']);
        newData = await ctx.call('ldp.resource.post', {
          resource: oldData,
          contentType: MIME_TYPES.JSON,
          containerUri,
          webId,
          slug: getSlugFromUri(oldData['@id'])
        });

        // ... then rethrows an error
        throw new MoleculerError('Could not put resource: ' + e.message, 400, 'BAD_REQUEST');
      }

      // Get the new data, with the same formatting as the old data
      // const newData = await ctx.call(
      //   'ldp.resource.get',
      //   {
      //     resourceUri,
      //     accept: MIME_TYPES.JSON
      //   },
      //   { meta: { $cache: false } }
      // );

      ctx.emit('ldp.resource.updated', {
        resourceUri,
        oldData,
        newData,
        webId
      });

      return resourceUri;
    }
  }
};
