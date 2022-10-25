const urlJoin = require('url-join');
const { MoleculerError } = require('moleculer').Errors;
const fetch = require('node-fetch');
const { ACTOR_TYPES, ACTIVITY_TYPES, PUBLIC_URI } = require('@semapps/activitypub');
const { MIME_TYPES } = require('@semapps/mime-types');

const { createFragmentURL, getContainerFromUri, isMirror } = require('@semapps/ldp/utils');

const { defaultToArray } = require('@semapps/activitypub/utils');

const regexPrefix = new RegExp('^@prefix ([\\w-]*: +<.*>) .', 'gm');

module.exports = {
  name: 'mirror',
  settings: {
    baseUrl: null,
    graphName: 'http://semapps.org/mirror',
    servers: [],
    acceptFollowers: true,
    actor: {
      username: 'relay',
      name: 'Relay actor for Mirror service'
    }
  },
  dependencies: [
    'triplestore',
    'webfinger',
    'activitypub',
    'activitypub.follow',
    'void',
    'auth.account',
    'ldp.container',
    'ldp.registry'
  ],

  async started() {
    this.excludedContainers = {};

    // Ensure services have been started
    // await this.broker.waitForServices(['ldp.container', 'ldp.registry', 'auth.account', 'activitypub.follow']);

    const containers = await this.broker.call('ldp.registry.list');

    let actorContainer;
    Object.values(containers).forEach(c => {
      if (c.excludeFromMirror) this.excludedContainers[c.path] = true;
      // we take the first container that accepts the type 'Application'
      if (c.acceptedTypes && !actorContainer && defaultToArray(c.acceptedTypes).includes('Application'))
        actorContainer = c.path;
    });

    if (!actorContainer) {
      const errorMsg =
        "MirrorService cannot start. You must configure at least one container that accepts the type 'Application'. see acceptedTypes in your containers.js config file";
      throw new Error(errorMsg);
    }

    const services = await this.broker.call('$node.services');

    if (services.map(s => s.name).filter(s => s.startsWith('webacl')).length) {
      this.hasWebacl = true;
      await this.broker.waitForServices(['webacl']);
    }

    const actorSettings = this.settings.actor;

    const actorExist = await this.broker.call('auth.account.usernameExists', { username: actorSettings.username });

    this.logger.info('actorExist ' + actorExist);

    const uri = urlJoin(this.settings.baseUrl, actorContainer, actorSettings.username);
    this.relayActorUri = uri;

    // creating the local actor 'relay'
    if (!actorExist) {
      this.logger.info(`MirrorService > Actor "${actorSettings.name}" does not exist yet, creating it...`);

      await this.broker.call(
        'auth.account.create',
        {
          username: actorSettings.username,
          webId: uri
        },
        { meta: { isSystemCall: true } }
      );

      await this.broker.call('ldp.container.post', {
        containerUri: getContainerFromUri(uri),
        slug: actorSettings.username,
        resource: {
          '@context': 'https://www.w3.org/ns/activitystreams',
          type: ACTOR_TYPES.APPLICATION,
          preferredUsername: actorSettings.username,
          name: actorSettings.name
        },
        contentType: MIME_TYPES.JSON,
        webId: 'system'
      });
    }

    // wait until the outbox and followers collection are created, and keep their uri, for later use
    const actor = await this.broker.call('activitypub.actor.awaitCreateComplete', {
      actorUri: uri
    });
    this.relayOutboxUri = actor.outbox;
    this.relayFollowersUri = actor.followers;

    // check if has followers (initialize value)
    if (this.settings.acceptFollowers) this.hasFollowers = await this.checkHasFollowers();

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

        const alreadyFollowing = await ctx.call('activitypub.follow.isFollowing', {
          follower: this.relayActorUri,
          following: remoteRelayActorUri
        });

        if (alreadyFollowing) {
          this.logger.info('Already mirrored and following: ' + serverUrl);
          return remoteRelayActorUri;
        }

        // if not, we will now mirror and then follow the relay actor

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
        const firstServer = json['@graph'][0];
        if (!firstServer || firstServer['@id'] !== createFragmentURL('', serverUrl))
          throw new MoleculerError(
            'The VOID answer does not contain valid information for ' + serverUrl,
            400,
            'INVALID'
          );

        // We mirror only the first server, meaning, not the mirrored data of the remote server.
        // If A mirrors B, and B also contains a mirror of C, then when A mirrors B,
        // A will only mirror what is proper to B, not the mirrored data of C

        const partitions = firstServer['void:classPartition'];

        if (partitions) {
          for (const p of defaultToArray(partitions)) {
            // we skip empty containers
            if (p['void:entities'] === '0') continue;

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

        const followActivity = await ctx.call('activitypub.outbox.post', {
          collectionUri: this.relayOutboxUri,
          '@context': 'https://www.w3.org/ns/activitystreams',
          actor: this.relayActorUri,
          type: ACTIVITY_TYPES.FOLLOW,
          object: remoteRelayActorUri,
          to: [remoteRelayActorUri]
        });

        return remoteRelayActorUri;
      }
    }
  },
  events: {
    async 'activitypub.inbox.received'(ctx) {
      if (this.inboxReceived) {
        if (ctx.params.recipients.includes(this.relayActorUri)) {
          await this.inboxReceived(ctx);
        }
      }
    },
    'activitypub.follow.added'(ctx) {
      if (ctx.params.following === this.relayActorUri && this.settings.acceptFollowers) {
        this.hasFollowers = true;
      }
    },
    async 'activitypub.follow.removed'(ctx) {
      if (ctx.params.following === this.relayActorUri && this.settings.acceptFollowers) {
        this.hasFollowers = await this.checkHasFollowers();
      }
    },
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, newData } = ctx.params;
      if (
        this.hasFollowers &&
        !this.containerExcludedFromMirror(resourceUri) &&
        (await this.checkResourcePublic(resourceUri)) &&
        !isMirror(resourceUri, this.settings.baseUrl)
      ) {
        this.resourceCreated(resourceUri);
      }
    },
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri, newData, oldData } = ctx.params;
      if (
        this.hasFollowers &&
        !this.containerExcludedFromMirror(resourceUri) &&
        (await this.checkResourcePublic(resourceUri)) &&
        !isMirror(resourceUri, this.settings.baseUrl)
      ) {
        this.resourceUpdated(resourceUri);
      }
    },
    async 'ldp.container.patched'(ctx) {
      const { containerUri } = ctx.params;
      if (
        this.hasFollowers &&
        !this.containerExcludedFromMirror(containerUri) &&
        (await this.checkResourcePublic(containerUri)) &&
        !isMirror(containerUri, this.settings.baseUrl)
      ) {
        this.resourceUpdated(containerUri);
      }
    },
    async 'ldp.resource.deleted'(ctx) {
      const { resourceUri } = ctx.params;
      if (
        this.hasFollowers &&
        !this.containerExcludedFromMirror(resourceUri) &&
        !isMirror(resourceUri, this.settings.baseUrl)
      ) {
        this.resourceDeleted(resourceUri);
      }
    },
    async 'ldp.resource.deletedSingleMirror'(ctx) {
      const { resourceUri } = ctx.params;
      if (this.hasFollowers) {
        this.resourceDeleted(resourceUri);
      }
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

      if (this.hasWebacl && this.hasFollowers && !this.containerExcludedFromMirror(uri)) {
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
    async resourceCreated(resourceUri) {
      // each time a resource is created, it is also attached to a container,
      // which triggers an update activity on that container to be sent to all followers.
      // for the sake of non redundancy, we therefor do nothing when a create happens.
      // the container update will retrieve the new resource anyway
      // const AnnounceActivity = await this.broker.call('activitypub.outbox.post', {
      //   collectionUri: this.relayOutboxUri,
      //   '@context': 'https://www.w3.org/ns/activitystreams',
      //   actor: this.relayActorUri,
      //   type: ACTIVITY_TYPES.ANNOUNCE,
      //   object: {
      //     type: ACTIVITY_TYPES.CREATE,
      //     object: resourceUri
      //   },
      //   to: await this.getFollowers()
      // });
    },
    async resourceUpdated(resourceUri) {
      const AnnounceActivity = await this.broker.call('activitypub.outbox.post', {
        collectionUri: this.relayOutboxUri,
        '@context': 'https://www.w3.org/ns/activitystreams',
        actor: this.relayActorUri,
        type: ACTIVITY_TYPES.ANNOUNCE,
        object: {
          type: ACTIVITY_TYPES.UPDATE,
          object: resourceUri
        },
        to: await this.getFollowers()
      });
    },
    async resourceDeleted(resourceUri) {
      const AnnounceActivity = await this.broker.call('activitypub.outbox.post', {
        collectionUri: this.relayOutboxUri,
        '@context': 'https://www.w3.org/ns/activitystreams',
        actor: this.relayActorUri,
        type: ACTIVITY_TYPES.ANNOUNCE,
        object: {
          type: ACTIVITY_TYPES.DELETE,
          object: resourceUri
        },
        to: await this.getFollowers()
      });
    },
    async checkHasFollowers() {
      const res = await this.broker.call('activitypub.collection.isEmpty', {
        collectionUri: this.relayFollowersUri
      });
      return !res;
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
    },
    async getFollowers() {
      return [this.relayFollowersUri, PUBLIC_URI];
    },
    async inboxReceived(ctx) {
      const { activity } = ctx.params;

      if (activity.type === ACTIVITY_TYPES.ANNOUNCE) {
        // check that the sending actor is in our list of mirroredServers (security: if notm it is some spamming or malicious attempt)
        if (!this.mirroredServers.includes(activity.actor)) {
          console.log(this.mirroredServers);
          this.logger.warn('SECURITY ALERT : received announce from actor we are not following : ' + activity.actor);
          return;
        }
        switch (activity.object.type) {
          case ACTIVITY_TYPES.CREATE: {
            let newResource = await fetch(activity.object.object, { headers: { Accept: MIME_TYPES.JSON } });
            newResource = await newResource.json();
            await ctx.call('ldp.resource.create', { resource: newResource, contentType: MIME_TYPES.JSON });
            break;
          }
          case ACTIVITY_TYPES.UPDATE: {
            let newResource = await fetch(activity.object.object, { headers: { Accept: MIME_TYPES.JSON } });
            newResource = await newResource.json();
            await ctx.call('ldp.resource.put', { resource: newResource, contentType: MIME_TYPES.JSON });
            break;
          }
          case ACTIVITY_TYPES.DELETE: {
            await ctx.call('ldp.resource.delete', { resourceUri: activity.object.object });
            break;
          }
        }
      }
    }
  }
};
