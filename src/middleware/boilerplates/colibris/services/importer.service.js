const { ImporterService } = require('@semapps/importer');
const path = require('path');
const slugify = require('slugify');
const CONFIG = require('../config');

// Transform camelCase to camel-case
const camelCaseToHyphens = str => str.replace(/[A-Z]/g, s => "-" + s).toLowerCase();

module.exports = {
  mixins: [ImporterService],
  settings: {
    importsDir: path.resolve(__dirname, '../imports'),
    allowedActions: ['createOrganization', 'createProject', 'createUser', 'followProject', 'postNews'],
    // Custom settings
    baseUri: CONFIG.HOME_URL,
    usersContainer: CONFIG.HOME_URL + 'users/'
  },
  dependencies: ['ldp', 'activitypub.actor', 'activitypub.outbox'],
  actions: {
    async createOrganization(ctx) {
      const { data } = ctx.params;

      await ctx.call('activitypub.actor.create', {
        slug: data.slug,
        '@context': {
          as: 'https://www.w3.org/ns/activitystreams#',
          pair: 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': ['as:Organization', 'pair:Organization'],
        // PAIR
        'pair:label': data.name,
        // ActivityStreams
        'as:name': data.name,
        'as:preferredUsername': data.slug
      });

      console.log(`Organization ${data.slug} created`);
    },
    async createProject(ctx) {
      const { data, groupSlug } = ctx.params;

      if (!groupSlug) throw new Error('Missing groupSlug argument');

      await ctx.call('activitypub.actor.create', {
        slug: camelCaseToHyphens(data.slug.substring(0, 36)),
        '@context': {
          as: 'https://www.w3.org/ns/activitystreams#',
          pair: 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': ['as:Group', 'pair:Project'],
        // PAIR
        'pair:label': data.name,
        'pair:description': data.content,
        'pair:aboutPage': `https://colibris.cc/groupeslocaux/?${data.slug}/iframe&showActu=1`,
        'pair:involves': this.settings.usersContainer + groupSlug,
        // ActivityStreams
        'as:name': data.name,
        'as:content': data.content,
        'as:image': data.image,
        'as:location': data.location,
        'as:tag': data.tag.map(tag => this.settings.baseUri + 'themes/' + slugify(tag.name, { lower: true })),
        'as:url': data.url,
        'as:published': data.published,
        'as:updated': data.updated
      });

      console.log(`Project ${data.name} created`);
    },
    async createUser(ctx) {
      const { data } = ctx.params;

      await ctx.call('activitypub.actor.create', {
        slug: data.username,
        '@context': {
          as: 'https://www.w3.org/ns/activitystreams#',
          pair: 'http://virtual-assembly.org/ontologies/pair#'
        },
        '@type': ['as:Person', 'pair:Person'],
        // PAIR
        'pair:label': data.name,
        'pair:e-mail': data.email,
        // ActivityStreams
        'as:name': data.name,
        'as:preferredUsername': data.username
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
        object: this.settings.usersContainer + camelCaseToHyphens(data.following)
      });

      console.log(`Actor ${data.username} follow ${data.following}`);
    },
    async postNews(ctx) {
      const { data } = ctx.params;

      const posterUri = this.settings.usersContainer + camelCaseToHyphens(data.attributedTo.substring(0, 36));

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
