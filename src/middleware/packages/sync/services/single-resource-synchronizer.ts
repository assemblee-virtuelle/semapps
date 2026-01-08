// @ts-expect-error TS(7016): Could not find a declaration file for module 'mole... Remove this comment to see the full error message
import Schedule from 'moleculer-schedule';

const SingleResourceSynchronizerService = {
  name: 'single-resource-synchronizer' as const,
  mixins: [Schedule],
  methods: {
    async updateSingleMirroredResources() {
      const singles = await this.broker.call('triplestore.query', {
        query: `
            SELECT DISTINCT ?s 
            WHERE { 
              GRAPH ?g { 
                ?s <http://semapps.org/ns/core#singleMirroredResource> ?o 
              }
            }
          `
      });

      for (const resourceUri of singles.map((node: any) => node.s.value)) {
        try {
          await this.broker.call('ldp.remote.store', {
            resourceUri,
            keepInSync: true
          });
        } catch (e) {
          // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
          if (e.code === 403 || e.code === 404 || e.code === 401) {
            await this.broker.call('ldp.remote.delete', { resourceUri });
          } else {
            // Connection errors are not counted as errors that indicate the resource is gone.
            // Those error just indicate that the remote server is not responding. Can be temporary.
            this.logger.warn(`Failed to update single mirrored resource: ${resourceUri}`);
          }
        }
      }
    }
  },
  jobs: [
    {
      rule: '0 * * * *',
      handler: 'updateSingleMirroredResources'
    }
  ]
};

export default SingleResourceSynchronizerService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [SingleResourceSynchronizerService.name]: typeof SingleResourceSynchronizerService;
    }
  }
}
