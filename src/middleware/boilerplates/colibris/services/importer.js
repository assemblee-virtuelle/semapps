const { ImporterService: ImporterMixin } = require('@semapps/importer');
const slugify = require('slugify');

const ImporterService = {
  mixins: [ImporterMixin],
  settings: {
    allowedActions: ['createProject', 'createUser', 'followProject', 'postNews'],
    // To be set by user
    baseUri: null,
    baseDir: null,
    usersContainer: null
  },
  dependencies: ['ldp', 'activitypub.actor', 'activitypub.outbox'],
  actions: {
    async createProject(ctx) {
      const { data } = ctx.params;

      await ctx.call('activitypub.actor.create', {
        slug: data.slug.substring(0, 36),
        '@context': {
          '@vocab': 'https://www.w3.org/ns/activitystreams#',
          pair: 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': ['Organization', 'pair:Project'],
        // PAIR
        'pair:label': data.name,
        'pair:description': data.content,
        'pair:aboutPage': `https://colibris.cc/groupeslocaux/?${data.slug}/iframe&showActu=1`,
        // ActivityStreams
        name: data.name,
        content: data.content,
        image: data.image,
        location: data.location,
        tag: data.tag.map(tag => this.settings.baseUri + 'themes/' + slugify(tag.name, { lower: true })),
        url: data.url,
        published: data.published,
        updated: data.updated
      });

      console.log(`Project ${data.name} created`);
    },
    async createUser(ctx) {
      const { data } = ctx.params;

      await ctx.call('activitypub.actor.create', {
        slug: data.username,
        '@context': {
          '@vocab': 'https://www.w3.org/ns/activitystreams#',
          pair: 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': ['Person', 'pair:Person'],
        // PAIR
        'pair:label': data.name,
        'pair:e-mail': data.email,
        // ActivityStreams
        name: data.name,
        preferredUsername: data.username
      });

      console.log(`Actor ${data.username} created`);
    },
    async followProject(ctx) {
      const { data } = ctx.params;

      await ctx.call('activitypub.outbox.post', {
        username: data.username,
        '@context': 'https://www.w3.org/ns/activitystreams',
        '@type': 'Follow',
        actor: this.settings.usersContainer + data.username,
        object: this.settings.usersContainer + data.following,
      });

      console.log(`Actor ${data.username} follow ${data.following}`);
    },
    async postNews(ctx) {
      const { data } = ctx.params;

      const posterUri = this.settings.usersContainer + data.attributedTo.substring(0, 36);

      const activity = await ctx.call('activitypub.outbox.post', {
        username: data.attributedTo.substring(0, 36),
        slug: data.id,
        '@context': 'https://www.w3.org/ns/activitystreams',
        '@type': 'Note',
        to: [posterUri + '/followers'],
        name: data.name,
        content: data.content,
        image: data.image,
        attributedTo: posterUri,
        published: data.published,
        updated: data.updated
      });

      console.log(`Note "${data.name}" posted: ${activity['@id']}`);
    }
  }
};

module.exports = ImporterService;
