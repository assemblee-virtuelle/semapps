const { ACTIVITY_TYPES, OBJECT_TYPES } = require('@semapps/activitypub');
const { isMirror } = require('@semapps/ldp');
const validRemoteRelayAction = require('./actions/validRemoteRelay');
const mirrorAction = require('./actions/mirror');

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
      for (let serverUrl of this.settings.servers) {
        // Do not await because we don't want to block the startup of the services.
        this.actions.mirror({ serverUrl })
          .then(actorUri => this.mirroredServers.push(actorUri))
          .catch(e => {
            this.logger.error('Mirroring failed for ' + serverUrl + ' : ' + e.message)
          });
      }
    }
  },
  actions: {
    validRemoteRelay: validRemoteRelayAction,
    mirror: mirrorAction
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
      await this.broker.call('activitypub.relay.postToFollowers', {
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
      await this.broker.call('activitypub.relay.postToFollowers', {
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
      await this.broker.call('activitypub.relay.postToFollowers', {
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
      await this.broker.call('activitypub.relay.postToFollowers', {
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
            <${containerUri}> <http://www.w3.org/ns/ldp#contains> ?object
          }
        `,
        webId: 'system'
      });
      return res.map(o => o.object.value);
    }
  }
};
