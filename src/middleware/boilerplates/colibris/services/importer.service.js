const urlJoin = require('url-join');
const { ImporterService } = require('@semapps/importer');
const path = require('path');
const slugify = require('slugify');
const CONFIG = require('../config');

// Transform PascalCase to pascal-case
const pascalCaseToHyphens = str => str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

module.exports = {
  mixins: [ImporterService],
  settings: {
    importsDir: path.resolve(__dirname, '../imports'),
    allowedActions: ['createOrganization', 'createProject', 'createUser', 'followProject', 'postNews'],
    // Custom settings
    baseUri: CONFIG.HOME_URL,
    usersContainer: urlJoin(CONFIG.HOME_URL, 'actors')
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

      const themes = data.tag.map(tag => urlJoin(this.settings.baseUri, 'themes', slugify(tag.name, { lower: true })));
      const status = urlJoin(this.settings.baseUri, 'status', slugify(data.status, { lower: true }));

      await ctx.call('activitypub.actor.create', {
        slug: pascalCaseToHyphens(data.slug.substring(0, 36)),
        '@context': [
          'https://www.w3.org/ns/activitystreams',
          {
            pair: 'http://virtual-assembly.org/ontologies/pair#'
          }
        ],
        '@type': ['Group', 'pair:Project'],
        // PAIR
        'pair:label': data.name,
        'pair:description': data.content,
        'pair:aboutPage': `https://colibris.cc/groupeslocaux/?${data.slug}/iframe&showActu=1`,
        'pair:involves': urlJoin(this.settings.usersContainer, groupSlug),
        // ActivityStreams
        name: data.name,
        content: data.content,
        image: data.image,
        location: data.location,
        tag: [...themes, status],
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
        actor: urlJoin(this.settings.usersContainer, data.username),
        object: urlJoin(this.settings.usersContainer, pascalCaseToHyphens(data.following.substring(0, 36)))
      });

      console.log(`Actor ${data.username} follow ${data.following}`);
    },
    async postNews(ctx) {
      const { data } = ctx.params;

      const posterUri = urlJoin(this.settings.usersContainer, pascalCaseToHyphens(data.attributedTo.substring(0, 36)));

      const activity = await ctx.call('activitypub.outbox.post', {
        username: pascalCaseToHyphens(data.attributedTo.substring(0, 36)),
        slug: data.id,
        '@context': 'https://www.w3.org/ns/activitystreams',
        '@type': 'Note',
        to: [urlJoin(posterUri, 'followers')],
        name: data.name,
        content: data.content,
        image: data.image,
        attributedTo: posterUri,
        published: data.published,
        updated: data.updated
      });

      console.log(`Note "${data.name}" posted: ${activity.id}`);
    },
    async importAll(ctx) {
      await this.actions.import({
        action: 'createOrganization',
        fileName: 'groupes-locaux.json'
      });

      await this.actions.import({
        action: 'createProject',
        fileName: 'projets-pc.json',
        groupSlug: '60-pays-creillois'
      });

      await this.actions.import({
        action: 'createProject',
        fileName: 'projets-rcc.json',
        groupSlug: '60-compiegnois'
      });

      await this.actions.import({
        action: 'createUser',
        fileName: 'users.json'
      });

      await this.actions.import({
        action: 'followProject',
        fileName: 'followers.json'
      });

      await this.actions.import({
        action: 'postNews',
        fileName: 'actualites-pc.json'
      });

      await this.actions.import({
        action: 'postNews',
        fileName: 'actualites-rcc.json'
      });
    }
  }
};
