// @ts-expect-error TS(7016): Could not find a declaration file for module 'node... Remove this comment to see the full error message
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import urlJoin from 'url-join';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'stri... Remove this comment to see the full error message
import format from 'string-template';
import { ServiceSchema, defineAction } from 'moleculer';

const delay = (t: any) => new Promise(resolve => setTimeout(resolve, t));

const DatasetService = {
  name: 'triplestore.dataset' as const,
  settings: {
    url: null,
    user: null,
    password: null,
    fusekiBase: null
  },
  started() {
    this.headers = {
      Authorization: `Basic ${Buffer.from(`${this.settings.user}:${this.settings.password}`).toString('base64')}`
    };
  },
  actions: {
    backup: defineAction({
      async handler(ctx) {
        const { dataset } = ctx.params;

        // Ask Fuseki to backup the given dataset
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        const response = await fetch(urlJoin(this.settings.url, '$/backup', dataset), {
          method: 'POST',
          headers: this.headers
        });

        // Wait for backup to complete
        const { taskId } = await response.json();
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        await this.actions.waitForTaskCompletion({ taskId }, { parentCtx: ctx });
      }
    }),

    create: defineAction({
      async handler(ctx) {
        const { dataset, secure } = ctx.params;
        if (!dataset) throw new Error('Unable to create dataset. The parameter dataset is missing');
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        const exist = await this.actions.exist({ dataset }, { parentCtx: ctx });
        if (!exist) {
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          this.logger.info(`Dataset ${dataset} doesn't exist. Creating it...`);
          let response;

          // @ts-expect-error TS(2339): Property 'endsWith' does not exist on type 'never'... Remove this comment to see the full error message
          if (dataset.endsWith('Acl') || dataset.endsWith('Mirror'))
            throw new Error(`Error when creating dataset ${dataset}. Its name cannot end with Acl or Mirror`);

          const templateFilePath = path.join(__dirname, '../templates', secure ? 'secure-dataset.ttl' : 'dataset.ttl');
          const template = await fs.promises.readFile(templateFilePath, 'utf8');
          const assembler = format(template, { dataset: dataset });
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          response = await fetch(urlJoin(this.settings.url, '$/datasets'), {
            method: 'POST',
            // @ts-expect-error TS(2698): Spread types may only be created from object types... Remove this comment to see the full error message
            headers: { ...this.headers, 'Content-Type': 'text/turtle' },
            body: assembler
          });

          if (response.status === 200) {
            // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
            await this.actions.waitForCreation({ dataset }, { parentCtx: ctx });
            // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
            this.logger.info(`Created ${secure ? 'secure' : 'unsecure'} dataset ${dataset}`);
          } else {
            // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
            this.logger.info(await response.text());
            throw new Error(`Error when creating ${secure ? 'secure' : 'unsecure'} dataset ${dataset}`);
          }
        }
      }
    }),

    exist: defineAction({
      async handler(ctx) {
        const { dataset } = ctx.params;
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        const response = await fetch(urlJoin(this.settings.url, '$/datasets/', dataset), {
          headers: this.headers
        });
        return response.status === 200;
      }
    }),

    list: defineAction({
      async handler() {
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        const response = await fetch(urlJoin(this.settings.url, '$/datasets'), {
          headers: this.headers
        });

        if (response.ok) {
          const json = await response.json();
          return json.datasets.map((dataset: any) => dataset['ds.name'].substring(1));
        }
        return [];
      }
    }),

    isSecure: defineAction({
      async handler(ctx): Promise<any> {
        const { dataset } = ctx.params;
        // Check if http://semapps.org/webacl graph exists
        return await ctx.call('triplestore.query', {
          query: `ASK WHERE { GRAPH <http://semapps.org/webacl> { ?s ?p ?o } }`,
          dataset,
          webId: 'system'
        });
      }
    }),

    waitForCreation: defineAction({
      async handler(ctx) {
        const { dataset } = ctx.params;
        let datasetExist;
        do {
          await delay(1000);
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          datasetExist = await this.actions.exist({ dataset }, { parentCtx: ctx });
        } while (!datasetExist);
      }
    }),

    waitForTaskCompletion: defineAction({
      async handler(ctx) {
        const { taskId } = ctx.params;
        let task;

        do {
          await delay(1000);

          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          const response = await fetch(urlJoin(this.settings.url, '$/tasks/', `${taskId}`), {
            method: 'GET',
            headers: this.headers
          });

          if (response.ok) {
            task = await response.json();
          }
        } while (!task || !task.finished);
      }
    }),

    delete: defineAction({
      params: {
        dataset: { type: 'string' },
        iKnowWhatImDoing: { type: 'boolean' }
      },
      async handler(ctx) {
        const { dataset, iKnowWhatImDoing } = ctx.params;
        if (!iKnowWhatImDoing) {
          throw new Error('Please confirm that you know what you are doing by setting `iKnowWhatImDoing` to `true`.');
        }
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        const isSecure = await this.actions.isSecure({ dataset });

        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        if (isSecure && !this.settings.fusekiBase)
          throw new Error(
            'Please provide the fusekiBase dir setting to the triplestore service, to delete a secure dataset.'
          );

        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        const response = await fetch(urlJoin(this.settings.url, '$/datasets', dataset), {
          method: 'DELETE',
          headers: this.headers
        });
        if (!response.ok) {
          throw new Error(`Failed to delete dataset ${dataset}: ${response.statusText}`);
        }

        // If this is a secure dataset, we need to delete stuff manually.
        if (isSecure) {
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          const dbDir = path.join(this.settings.fusekiBase, 'databases', dataset);
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          const dbAclDir = path.join(this.settings.fusekiBase, 'databases', `${dataset}Acl`);
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          const dbMirrorDir = path.join(this.settings.fusekiBase, 'databases', `${dataset}Mirror`);
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          const confFile = path.join(this.settings.fusekiBase, 'configuration', `${dataset}.ttl`);

          // Delete all, if present.
          await Promise.all([
            fs.promises.rm(dbDir, { recursive: true, force: true }),
            fs.promises.rm(dbAclDir, { recursive: true, force: true }),
            fs.promises.rm(dbMirrorDir, { recursive: true, force: true }),
            fs.promises.rm(confFile, { force: true })
          ]);
        }
      }
    })
  }
} satisfies ServiceSchema;

export default DatasetService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [DatasetService.name]: typeof DatasetService;
    }
  }
}
