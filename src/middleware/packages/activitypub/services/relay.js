const urlJoin = require('url-join');
const { MoleculerError } = require('moleculer').Errors;
const fetch = require('node-fetch');
const { ACTIVITY_TYPES, ACTOR_TYPES, OBJECT_TYPES, PUBLIC_URI } = require('../constants');
const { MIME_TYPES } = require('@semapps/mime-types');

const { createFragmentURL, getContainerFromUri, isMirror } = require('@semapps/ldp/utils');

const { defaultToArray } = require('@semapps/activitypub/utils');

const regexPrefix = new RegExp('^@prefix ([\\w-]*: +<.*>) .', 'gm');

const RelayService = {
    name: 'activitypub.relay',
    settings: {
        baseUri: null,
        acceptFollowers: true,
        actor: {
            username: 'relay',
            name: 'Relay actor for Mirror and Inference service'
        }
    },
    dependencies: [
        'triplestore',
        'jsonld',
        'webfinger',
        'activitypub',
        'activitypub.follow',
        'auth.account',
        'ldp.container',
        'ldp.registry'
    ],

    async started() {

        // Ensure services have been started
        // await this.broker.waitForServices(['ldp.container', 'ldp.registry', 'auth.account', 'activitypub.follow']);

        const containers = await this.broker.call('ldp.registry.list');

        let actorContainer;
        Object.values(containers).forEach(c => {
            // we take the first container that accepts the type 'Application'
            if (c.acceptedTypes && !actorContainer && defaultToArray(c.acceptedTypes).includes('Application'))
                actorContainer = c.path;
        });

        if (!actorContainer) {
            const errorMsg =
                "RelayService cannot start. You must configure at least one container that accepts the type 'Application'. see acceptedTypes in your containers.js config file";
            throw new Error(errorMsg);
        }

        const services = await this.broker.call('$node.services');

        if (services.map(s => s.name).filter(s => s.startsWith('webacl')).length) {
            this.hasWebacl = true;
            await this.broker.waitForServices(['webacl']);
        }

        // check that an inference service is running
        if (services.map(s => s.name).filter(s => s.startsWith('inference')).length) {
            this.hasInferenceService = true;
        }

        const actorSettings = this.settings.actor;

        const actorExist = await this.broker.call('auth.account.usernameExists', { username: actorSettings.username });

        this.logger.info('actorExist ' + actorExist);

        const uri = urlJoin(this.settings.baseUri, actorContainer, actorSettings.username);
        this.relayActorUri = uri;

        // creating the local actor 'relay'
        if (!actorExist) {
            this.logger.info(`ActorService > Actor "${actorSettings.name}" does not exist yet, creating it...`);

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
        this.cacheRelayWebfingers = {};

        // check if has followers (initialize value)
        if (this.settings.acceptFollowers) this.hasFollowers = await this.checkHasFollowers();

    },
    actions: {
        postToFollowers: {
            visibility: 'public',
            params: {
                activity: { type: 'object', optional: false },
            },
            async handler(ctx) {
                if (!this.hasFollowers) return;
                const activity = await this.broker.call('activitypub.outbox.post', {
                    collectionUri: this.relayOutboxUri,
                    '@context': 'https://www.w3.org/ns/activitystreams',
                    actor: this.relayActorUri,
                    ...ctx.params.activity,
                    to: await this.getFollowers()
                });
                return activity;
            }
        },
        follow: {
            visibility: 'public',
            params: {
                remoteRelayActorUri: { type: 'string', optional: false },
            },
            async handler(ctx) {
                const followActivity = await ctx.call('activitypub.outbox.post', {
                    collectionUri: this.relayOutboxUri,
                    '@context': 'https://www.w3.org/ns/activitystreams',
                    actor: this.relayActorUri,
                    type: ACTIVITY_TYPES.FOLLOW,
                    object: ctx.params.remoteRelayActorUri,
                    to: [ctx.params.remoteRelayActorUri]
                });
                return followActivity;
            }
        },
        isFollowing: {
            visibility: 'public',
            params: {
                remoteRelayActorUri: { type: 'string', optional: false },
            },
            async handler(ctx) {
                const alreadyFollowing = await ctx.call('activitypub.follow.isFollowing', {
                    follower: this.relayActorUri,
                    following: ctx.params.remoteRelayActorUri
                });
                return alreadyFollowing;
            }
        },
        offerInference: {
            visibility: 'public',
            params: {
                subject: { type: 'string', optional: false },
                predicate: { type: 'string', optional: false },
                object: { type: 'string', optional: false },
                add: { type: 'boolean', optional: false },
            },
            async handler(ctx) {

                const serverDomainName = new URL(ctx.params.subject).host;
                let remoteRelayActorUri;
                if (this.cacheRelayWebfingers[serverDomainName]) {
                    remoteRelayActorUri = this.cacheRelayWebfingers[serverDomainName];
                } else {
                    remoteRelayActorUri = await ctx.call('webfinger.getRemoteUri', { account: 'relay@' + serverDomainName });
                    // TODO: deal with error
                    this.cacheRelayWebfingers[serverDomainName] = remoteRelayActorUri;
                }

                if (remoteRelayActorUri) {
                    const OfferActivity = await ctx.call('activitypub.outbox.post', {
                        collectionUri: this.relayOutboxUri,
                        '@context': 'https://www.w3.org/ns/activitystreams',
                        actor: this.relayActorUri,
                        type: ACTIVITY_TYPES.OFFER,
                        object: {
                            type: ctx.params.add ? ACTIVITY_TYPES.ADD : ACTIVITY_TYPES.REMOVE,
                            object: {
                                type: OBJECT_TYPES.RELATIONSHIP,
                                subject: ctx.params.subject,
                                relationship: ctx.params.predicate,
                                object: ctx.params.object,
                            }
                        },
                        to: [remoteRelayActorUri]
                    });
                }
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
    },
    methods: {
        async checkHasFollowers() {
            const res = await this.broker.call('activitypub.collection.isEmpty', {
                collectionUri: this.relayFollowersUri
            });
            return !res;
        },
        async getFollowers() {
            return [this.relayFollowersUri, PUBLIC_URI];
        },
        async inboxReceived(ctx) {
            const { activity } = ctx.params;
            let expanded_activity = await ctx.call('jsonld.expand', { input: activity });
            if (activity.type === ACTIVITY_TYPES.OFFER) {

                if (activity.object && (activity.object.type == ACTIVITY_TYPES.ADD || activity.object.type == ACTIVITY_TYPES.REMOVE)) {

                    if (activity.object.object.type == OBJECT_TYPES.RELATIONSHIP) {

                        if (!this.hasInferenceService) {
                            const services = await this.broker.call('$node.services');
                            // check that an inference service is running
                            if (services.map(s => s.name).filter(s => s.startsWith('inference')).length) {
                                this.hasInferenceService = true;
                            }
                            else {
                                this.logger.warn('received OFFER for inverse relationship but inference service is not running. aborting');
                                return;
                            }
                        }
                        let triple = expanded_activity[0]['https://www.w3.org/ns/activitystreams#object']?.[0]?.['https://www.w3.org/ns/activitystreams#object']?.[0];
                        if (triple) {
                            triple.subject = triple['https://www.w3.org/ns/activitystreams#subject']?.[0]?.['@id'];
                            triple.object = triple['https://www.w3.org/ns/activitystreams#object']?.[0]?.['@id'];
                            triple.relationship = triple['https://www.w3.org/ns/activitystreams#relationship']?.[0]?.['@id'];
                            if (isMirror(triple.subject, this.settings.baseUri)) {
                                this.logger.warn('Attempt at offering an inverse relationship on a mirrored resource. aborting');
                                return;
                            }
                            if (triple.subject && triple.relationship && triple.object) {
                                await ctx.call('inference.remote', {
                                    subject: triple.subject,
                                    predicate: triple.relationship,
                                    object: triple.object,
                                    add: activity.object.type == ACTIVITY_TYPES.ADD
                                });
                            }
                        }
                    }
                }
            } else if (activity.type === ACTIVITY_TYPES.ANNOUNCE) {
                // check that the sending actor is in our list of mirroredServers (security: if not it is some spamming or malicious attempt)
                // if (!this.mirroredServers.includes(activity.actor)) {
                //     console.log(this.mirroredServers);
                //     this.logger.warn('SECURITY ALERT : received announce from actor we are not following : ' + activity.actor);
                //     return;
                // }

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

module.exports = RelayService;