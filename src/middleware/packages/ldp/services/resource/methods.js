const rdfParser = require('rdf-parse').default;
const urlJoin = require('url-join');
const streamifyString = require('streamify-string');
const N3 = require('n3');
const { negotiateTypeN3, MIME_TYPES } = require('@semapps/mime-types');
const { getPrefixJSON, getPrefixRdf } = require('../../utils');

// TODO put each method in a different file (problems with "this" not working)
module.exports = {
  async findAvailableUri(ctx, preferredUri) {
    let resourcesStartingWithUri = await ctx.call('triplestore.query', {
      query: `
        ${getPrefixRdf(this.settings.ontologies)}
        SELECT distinct ?uri
        WHERE {
          ?uri ?predicate ?object.
          FILTER regex(str(?uri), "^${preferredUri}")
        }
      `,
      accept: MIME_TYPES.JSON
    });
    let counter = 0;
    if (resourcesStartingWithUri.length > 0) {
      // Parse the results
      resourcesStartingWithUri = resourcesStartingWithUri.map(r => r.uri.value);
      // If preferredUri is already used, start finding another available URI
      if (resourcesStartingWithUri.includes(preferredUri)) {
        do {
          counter++;
        } while (resourcesStartingWithUri.includes(preferredUri + counter));
      }
    }
    return preferredUri + (counter > 0 ? counter : '');
  },
  async jsonldToTriples(jsonLdObject, outputContentType) {
    return new Promise((resolve, reject) => {
      const textStream = streamifyString(JSON.stringify(jsonLdObject));
      const writer = new N3.Writer({
        prefixes: getPrefixJSON(this.settings.ontologies),
        format: negotiateTypeN3(outputContentType)
      });
      rdfParser
        .parse(textStream, {
          contentType: MIME_TYPES.JSON
        })
        .on('data', quad => {
          writer.addQuad(quad);
        })
        .on('error', error => console.error(error))
        .on('end', () => {
          writer.end((error, result) => {
            resolve(result);
          });
        });
    });
  },
  buildDeleteQueryFromResource(resource) {
    return new Promise((resolve, reject) => {
      let deleteSPARQL = '';
      let counter = 0;
      const text = typeof resource === 'string' || resource instanceof String ? resource : JSON.stringify(resource);
      const textStream = streamifyString(text);
      rdfParser
        .parse(textStream, {
          contentType: 'application/ld+json'
        })
        .on('data', quad => {
          deleteSPARQL = deleteSPARQL.concat(
            `DELETE WHERE  {<${quad.subject.value}> <${quad.predicate.value}> ?o};
            `
          );
          counter++;
        })
        .on('error', error => reject(error))
        .on('end', () => {
          resolve(deleteSPARQL);
        });
    });
  },
  async createDisassemblyAndUpdateResource(ctx, resource, contentType, disassembly, webId) {
    if (disassembly && contentType == MIME_TYPES.JSON) {
      for (const disassemblyItem of disassembly) {
        if (resource[disassemblyItem.path]) {
          let rawDisassemblyValue = resource[disassemblyItem.path];
          if (!Array.isArray(rawDisassemblyValue)) {
            rawDisassemblyValue = [rawDisassemblyValue];
          }
          const uriInserted = [];
          for (let disassemblyValue of rawDisassemblyValue) {
            // id is extract to not interfer whith @id if set
            let { id, ...usableValue } = disassemblyValue;
            usableValue = {
              '@context': resource['@context'],
              ...usableValue
            };

            disassemblyResourceUri = await ctx.call('ldp.resource.post', {
              containerUri: disassemblyItem.container,
              resource: usableValue,
              contentType: MIME_TYPES.JSON,
              accept: MIME_TYPES.JSON,
              webId: webId
            });
            uriInserted.push({ '@id': disassemblyResourceUri, '@type': '@id' });
          }
          resource[disassemblyItem.path] = uriInserted;
        }
      }
    }
    return resource;
  },
  async deleteDisassembly(ctx, resource, contentType, disassembly, webId) {
    if (disassembly) {
      for (disassemblyItem of disassembly) {
        if (resource[disassemblyItem.path]) {
          let rawDisassemblyValue = resource[disassemblyItem.path];
          if (!Array.isArray(rawDisassemblyValue)) {
            rawDisassemblyValue = [rawDisassemblyValue];
          }
          for (let disassemblyValue of rawDisassemblyValue) {
            const idToDelete = disassemblyValue['@id'] || disassemblyValue['id'] || disassemblyValue;
            await ctx.call('ldp.resource.delete', {
              resourceUri: idToDelete,
              webId: webId
            });
          }
        }
      }
    }
    // resource[disassemblyItem.path]==undefined;
    return resource;
  }
};
