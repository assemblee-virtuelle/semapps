const urlJoin = require('url-join');
const { MoleculerError } = require('moleculer').Errors;
const fetch = require('node-fetch');
const { ACTOR_TYPES, ACTIVITY_TYPES, OBJECT_TYPES, PUBLIC_URI } = require('@semapps/activitypub');
const { MIME_TYPES } = require('@semapps/mime-types');

const { createFragmentURL, getContainerFromUri, isMirror } = require('@semapps/ldp/utils');

const { defaultToArray } = require('@semapps/activitypub/utils');

const regexPrefix = new RegExp('^@prefix ([\\w-]*: +<.*>) .', 'gm');

module.exports = {
  name: 'mirror',
  settings: {
    baseUrl: null,
    graphName: 'http://semapps.org/mirror',
    servers: []
  },
  dependencies: [
    'triplestore',
    'webfinger',
    'activitypub',
    'activitypub.relay',
    'void',
    'auth.account',
    'ldp.container',
    'ldp.registry'
  ],

  async started() {
    this.excludedContainers = {};

    const containers = await this.broker.call('ldp.registry.list');

    Object.values(containers).forEach(c => {
      if (c.excludeFromMirror) this.excludedContainers[c.path] = true;
    });

    const services = await this.broker.call('$node.services');
    if (services.map(s => s.name).filter(s => s.startsWith('webacl')).length) {
      this.hasWebacl = true;
      await this.broker.waitForServices(['webacl']);
    }

    // STARTING TO MIRROR ALL THE SERVERS

    this.mirroredServers = [];
    if (this.settings.servers.length > 0) {
      for (let server of this.settings.servers) {
        try {
          // we do not await because we don't want to bloc the startup of the services.
          const promise = this.actions.mirror({ serverUrl: server });
          promise
            .then(actorUri => {
              this.mirroredServers.push(actorUri);
            })
            .catch(e => this.logger.error('Mirroring failed for ' + server + ' : ' + e.message));
        } catch (e) {
          this.logger.error('Mirroring failed for ' + server + ' : ' + e.message);
        }
      }
    }
  },
  actions: {
    checkValidRemoteRelay: {
      visibility: 'public',
      params: {
        actor: { type: 'string', optional: false }
      },
      async handler(ctx) {
        // check that the sending actor is in our list of mirroredServers (security: if not it is some spamming or malicious attempt)
        if (!this.mirroredServers.includes(ctx.params.actor)) {
          this.logger.warn('SECURITY ALERT : received announce from actor we are not following : ' + ctx.params.actor);
          return false;
        }
        return true;
      }
    },
    mirror: {
      visibility: 'public',
      params: {
        serverUrl: { type: 'string', optional: false }
      },
      async handler(ctx) {
        let { serverUrl } = ctx.params;

        // check if the server is already followed, in which case, we already did the mirror, we can skip.

        const serverDomainName = new URL(serverUrl).host;
        const remoteRelayActorUri = await ctx.call('webfinger.getRemoteUri', { account: 'relay@' + serverDomainName });

        const alreadyFollowing = await ctx.call('activitypub.relay.isFollowing', {
          remoteRelayActorUri
        });

        if (alreadyFollowing) {
          this.logger.info('Already mirrored and following: ' + serverUrl);
          return remoteRelayActorUri;
        }

        // if not, we will now mirror and then follow the remote relay actor

        this.logger.info('Mirroring ' + serverUrl);

        const voidUrl = urlJoin(serverUrl, '/.well-known/void');

        const response = await fetch(voidUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/ld+json'
          }
        });

        if (!response.ok) throw new MoleculerError('No VOID endpoint on the server ' + serverUrl, 404, 'NOT_FOUND');

        const json = await response.json();
        let mapServers = {};
        for (let s of json['@graph']) {
          mapServers[s['@id']] = s;
        }
        const server = mapServers[createFragmentURL('', serverUrl)];
        if (!server)
          throw new MoleculerError(
            'The VOID answer does not contain valid information for ' + serverUrl,
            400,
            'INVALID'
          );

        // We mirror only the relevant server, meaning, not the mirrored data of the remote server.
        // If A mirrors B, and B also contains a mirror of C, then when A mirrors B,
        // A will only mirror what is proper to B, not the mirrored data of C

        const partitions = server['void:classPartition'];

        if (partitions) {
          for (const p of defaultToArray(partitions)) {
            // we skip empty containers and doNotMirror containers
            if (p['void:entities'] === '0' || p['semapps:doNotMirror']) continue;

            const rep = await fetch(p['void:uriSpace'], {
              method: 'GET',
              headers: {
                Accept: 'text/turtle'
              }
            });

            if (rep.ok) {
              let container = await rep.text();

              const prefixes = [...container.matchAll(regexPrefix)];

              let sparqlQuery = '';
              for (const pref of prefixes) {
                sparqlQuery += 'PREFIX ' + pref[1] + '\n';
              }
              sparqlQuery += `INSERT DATA { GRAPH <${this.settings.graphName}> { \n`;
              sparqlQuery += container.replace(regexPrefix, '');
              sparqlQuery += '} }';

              await ctx.call('triplestore.update', { query: sparqlQuery });
            }
          }
        }

        // unmarking any single mirrored resources that belong to this server we just mirrored
        // because we don't need to periodically watch them anymore
        let singles = await this.broker.call('triplestore.query', {
          query: `SELECT DISTINCT ?s WHERE { 
          GRAPH <${this.settings.graphName}> { 
          ?s <http://semapps.org/ns/core#singleMirroredResource> <${serverUrl}> } }`
        });

        for (const single of singles) {
          try {
            const resourceUri = single.s.value;
            await this.broker.call('triplestore.update', {
              webId: 'system',
              query: `DELETE WHERE { GRAPH <${this.settings.graphName}> { 
              <${resourceUri}> <http://semapps.org/ns/core#singleMirroredResource> ?q. } }`
            });
          } catch (e) {
            // fail silently
          }
        }

        this.logger.info('Mirroring done.');

        // now subscribing to the relay actor in order to receive updates (updateBot)

        this.logger.info('Following remote relay actor ' + remoteRelayActorUri);

        const activity = await ctx.call('activitypub.relay.follow', {
          remoteRelayActorUri
        });

        return remoteRelayActorUri;
      }
    }
  },
  events: {
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri } = ctx.params;
      if (
        !this.containerExcludedFromMirror(resourceUri) &&
        (await this.checkResourcePublic(resourceUri)) &&
        !isMirror(resourceUri, this.settings.baseUrl)
      ) {
        this.resourceUpdated(resourceUri);
      }
    },
    async 'ldp.resource.patched'(ctx) {
      const { resourceUri } = ctx.params;
      if (
        !this.containerExcludedFromMirror(resourceUri) &&
        (await this.checkResourcePublic(resourceUri)) &&
        !isMirror(resourceUri, this.settings.baseUrl)
      ) {
        this.resourceUpdated(resourceUri);
      }
    },
    async 'ldp.container.attached'(ctx) {
      const { containerUri, resourceUri, fromContainerPost } = ctx.params;
      if (fromContainerPost) {
        // we use the attached to container event to detect the creation of a new resource
        if (
          !this.containerExcludedFromMirror(containerUri) &&
          (await this.checkResourcePublic(resourceUri)) &&
          !isMirror(resourceUri, this.settings.baseUrl)
        ) {
          this.resourceCreated(containerUri, resourceUri);
        }
      } else if (
        !this.containerExcludedFromMirror(containerUri) &&
        (await this.checkResourcePublic(containerUri)) &&
        !isMirror(containerUri, this.settings.baseUrl)
      ) {
        this.resourceContainerUpdated(containerUri, resourceUri, true);
      }
    },
    async 'ldp.container.detached'(ctx) {
      const { containerUri, resourceUri } = ctx.params;
      if (
        !this.containerExcludedFromMirror(containerUri) &&
        (await this.checkResourcePublic(containerUri)) &&
        !isMirror(containerUri, this.settings.baseUrl)
      ) {
        this.resourceContainerUpdated(containerUri, resourceUri, false);
      }
    },
    async 'ldp.resource.deleted'(ctx) {
      const { resourceUri } = ctx.params;
      if (!this.containerExcludedFromMirror(resourceUri) && !isMirror(resourceUri, this.settings.baseUrl)) {
        this.resourceDeleted(resourceUri);
      }
    },
    async 'ldp.resource.deletedSingleMirror'(ctx) {
      const { resourceUri } = ctx.params;
      this.resourceDeleted(resourceUri);
    },
    async 'webacl.resource.created'(ctx) {
      // We don't need to do anything because the resource is not created yet.
    },
    async 'webacl.resource.updated'(ctx) {
      const {
        uri,
        isContainer,
        addPublicRead,
        removePublicRead,
        addDefaultPublicRead,
        removeDefaultPublicRead
      } = ctx.params;

      if (this.hasWebacl && !this.containerExcludedFromMirror(uri)) {
        if (addPublicRead) {
          // we do not send an activity for empty containers
          if (isContainer && (await ctx.call('ldp.container.isEmpty', { containerUri: uri }))) return;

          this.resourceCreated(uri);
        } else if (removePublicRead) {
          this.resourceDeleted(uri);
        }

        if (addDefaultPublicRead) {
          const resources = await this.listAllResourcesInSubContainer(uri);
          let containers = [];
          for (const res of resources) {
            if (!this.containerExcludedFromMirror(res)) {
              const isContainer = await ctx.call('ldp.container.exist', { containerUri: res });
              // we do not send an activity for empty containers, neither for resources that belong
              // to a container that we just sent an activity for. Because this activity about the container
              // will trigger on the mirroring side, a download and insert of all resources inside that container
              if (isContainer) {
                const empty = await ctx.call('ldp.container.isEmpty', { containerUri: res });
                if (empty) continue;
                containers.push(res);
              } else if (containers.some(c => res.startsWith(c))) continue;

              this.resourceCreated(res);
            }
          }
        } else if (removeDefaultPublicRead) {
          const resources = await this.listAllResourcesInSubContainer(uri);
          for (const res of resources) {
            if (!this.containerExcludedFromMirror(res)) {
              const isPublic = await this.checkResourcePublic(res);
              if (!isPublic) this.resourceDeleted(res);
            }
          }
        }
      }
    },
    async 'webacl.resource.deleted'(ctx) {
      // we don't do nothing because the resource will be deleted very soon afterwards, and ldp.resource.deleted will be emited
    },
    'ldp.registry.registered'(ctx) {
      const { container } = ctx.params;
      if (container.excludeFromMirror) this.excludedContainers[container.path] = true;
    }
  },
  methods: {
    containerExcludedFromMirror(resourceUri) {
      const path = new URL(resourceUri).pathname;
      for (const c of Object.keys(this.excludedContainers)) {
        if (path.startsWith(c)) return true;
      }
      return false;
    },
    async resourceCreated(containerUri, resourceUri) {
      const AnnounceActivity = await this.broker.call('activitypub.relay.postToFollowers', {
        activity: {
          type: ACTIVITY_TYPES.ANNOUNCE,
          object: {
            type: ACTIVITY_TYPES.CREATE,
            object: resourceUri,
            target: containerUri
          }
        }
      });
    },
    async resourceUpdated(resourceUri) {
      const AnnounceActivity = await this.broker.call('activitypub.relay.postToFollowers', {
        activity: {
          type: ACTIVITY_TYPES.ANNOUNCE,
          object: {
            type: ACTIVITY_TYPES.UPDATE,
            object: resourceUri
          }
        }
      });
    },
    async resourceDeleted(resourceUri) {
      const AnnounceActivity = await this.broker.call('activitypub.relay.postToFollowers', {
        activity: {
          type: ACTIVITY_TYPES.ANNOUNCE,
          object: {
            type: ACTIVITY_TYPES.DELETE,
            object: resourceUri
          }
        }
      });
    },
    async resourceContainerUpdated(containerUri, resourceUri, attach) {
      const AnnounceActivity = await this.broker.call('activitypub.relay.postToFollowers', {
        activity: {
          type: ACTIVITY_TYPES.ANNOUNCE,
          object: {
            type: attach ? ACTIVITY_TYPES.ADD : ACTIVITY_TYPES.REMOVE,
            object: {
              type: OBJECT_TYPES.RELATIONSHIP,
              subject: containerUri,
              relationship: 'http://www.w3.org/ns/ldp#contains',
              object: resourceUri
            }
          }
        }
      });
    },
    async checkResourcePublic(resourceUri) {
      if (!this.hasWebacl) return true;

      const perms = await this.broker.call('webacl.resource.hasRights', {
        resourceUri,
        rights: { read: true },
        webId: 'anon'
      });
      return perms.read;
    },
    async listAllResourcesInSubContainer(containerUri) {
      const res = await this.broker.call('triplestore.query', {
        query: `
          SELECT ?object
          WHERE {
            <${containerUri}> <http://www.w3.org/ns/ldp#contains>+ ?object
          }
        `,
        webId: 'system'
      });
      return res.map(o => o.object.value);
    }
  }
};
