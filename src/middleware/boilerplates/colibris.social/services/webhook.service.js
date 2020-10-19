const urlJoin = require('url-join');
const slugify = require('slugify');
const QueueService = require('moleculer-bull');
const { PUBLIC_URI, ACTIVITY_TYPES, ACTOR_TYPES, OBJECT_TYPES } = require('@semapps/activitypub');
const { WebhooksService } = require('@semapps/webhooks');
const CONFIG = require('../config');
const { groupsMapping, statusMapping, glThemesMapping, laFabriqueThemesMapping } = require('../constants');
const { convertWikiNames, convertWikiDate, getSlugFromUri, getDepartmentName } = require('../utils');

module.exports = {
  mixins: [WebhooksService, QueueService(CONFIG.QUEUE_SERVICE_URL)],
  settings: {
    containerUri: urlJoin(CONFIG.HOME_URL, 'webhooks'),
    usersContainer: urlJoin(CONFIG.HOME_URL, 'actors'),
    allowedActions: ['postProject', 'postNews', 'postLaFabriqueProject']
  },
  dependencies: ['activitypub.outbox', 'activitypub.actor'],
  actions: {
    async postProject(ctx) {
      const {
        data: { action, data }
      } = ctx.params;
      let actor = {},
        tags = [];

      if (!Object.keys(groupsMapping).includes(data.listeListeGl)) {
        console.log('Action is not linked with an existing group, skipping...');
        return;
      }

      const projectSlug = convertWikiNames(data.id_fiche);

      if (action !== 'delete') {
        // Tags
        tags.push(urlJoin(CONFIG.HOME_URL, 'status', slugify(statusMapping[data.listeListeEtat], { lower: true })));
        glThemesMapping[data.listeListeListeTheme2].forEach(theme =>
          tags.push(urlJoin(CONFIG.HOME_URL, 'themes', slugify(theme, { lower: true })))
        );

        // TODO convert HTML to Markdown ?
        const content =
          data.bf_objectifs +
          (data.bf_moyens ? '<h2>Moyens</h2>' + data.bf_moyens : '') +
          (data.bf_besoins ? '<h2>Besoins</h2>' + data.bf_besoins : '');

        actor = {
          '@context': [
            'https://www.w3.org/ns/activitystreams',
            {
              pair: 'http://virtual-assembly.org/ontologies/pair#'
            }
          ],
          '@type': [ACTOR_TYPES.GROUP, 'pair:Project'],
          // PAIR
          'pair:label': data.bf_titre,
          'pair:description': content,
          'pair:aboutPage': {
            '@id': `https://colibris.cc/groupeslocaux/?${data.id_fiche}/iframe&showActu=1`
          },
          'pair:involves': {
            '@id': urlJoin(this.settings.usersContainer, groupsMapping[data.listeListeGl])
          },
          // ActivityStreams
          name: data.bf_titre,
          content: content,
          image: data.imagebf_image ? 'https://colibris.cc/groupeslocaux/files/' + data.imagebf_image : undefined,
          location: {
            type: 'Place',
            name: data.bf_adresse1 || data.bf_ville,
            latitude: parseFloat(data.bf_latitude),
            longitude: parseFloat(data.bf_longitude)
          },
          tag: tags,
          url: data.bf_lien,
          published: convertWikiDate(data.date_creation_fiche),
          updated: convertWikiDate(data.date_maj_fiche)
        };
      }

      switch (action) {
        case 'add': {
          actor = await ctx.call('activitypub.actor.create', {
            slug: projectSlug,
            ...actor
          });
          console.log('Created actor with URI:', actor.id);
          break;
        }

        case 'edit': {
          actor = await ctx.call('activitypub.actor.update', {
            id: urlJoin(this.settings.usersContainer, projectSlug),
            ...actor
          });
          console.log('Updated actor with URI:', actor.id);
          break;
        }

        case 'delete': {
          actor.id = urlJoin(this.settings.usersContainer, projectSlug);
          await ctx.call('activitypub.actor.remove', {
            id: actor.id
          });
          console.log('Deleted actor with URI:', actor.id);
          break;
        }

        default: {
          throw new Error(`Unknown action ${action}`);
        }
      }

      return actor.id;
    },
    async postLaFabriqueProject(ctx) {
      let {
        data: { event_type: eventType, entity, files, nodePath },
        user
      } = ctx.params;
      let activity, existingProject;

      try {
        existingProject = await ctx.call('activitypub.object.get', { id: entity.uuid });
        // If the project was already deleted, consider it as non-existing
        if (existingProject.type === OBJECT_TYPES.TOMBSTONE) existingProject = undefined;
      } catch (e) {
        // Do nothing if project doesn't exist...
      }

      // If the project status is not valid, consider we want to delete it
      if (entity.field_validation.und[0].value !== 'valid') {
        eventType = 'delete';
      }

      if (!existingProject) {
        if (eventType === 'delete') {
          // Skip instead of deleting an unexisting project
          console.log(`Skipping project ${entity.title}...`);
          return;
        } else {
          // If no project exist yet, we have a creation
          eventType = 'insert';
        }
      }

      /*
       * INSERT OR UPDATE
       */
      if (eventType === 'insert' || eventType === 'update') {
        let tags = [];
        entity.field_proj_theme.und.forEach(theme => {
          laFabriqueThemesMapping[theme.tid].forEach(themeLabel =>
            tags.push(urlJoin(CONFIG.HOME_URL, 'themes', slugify(themeLabel, { lower: true })))
          );
        });

        let image;
        if (entity.field_proj_photos.und[0]) {
          image = {
            type: 'Image',
            url: files[entity.field_proj_photos.und[0].fid].absolute_url
          };
        }

        let location;
        if (
          entity.field_proj_adresse &&
          entity.field_proj_adresse.und[0] &&
          entity.field_proj_adresse.und[0].locality
        ) {
          const address = entity.field_proj_adresse.und[0];

          location = {
            type: 'Place',
            name: address.locality,
            latitude: entity.field_geodata.und[0].lat,
            longitude: entity.field_geodata.und[0].lon,
            'schema:address': {
              '@type': 'schema:PostalAddress',
              'schema:addressLocality': address.locality,
              'schema:addressCountry': address.country,
              'schema:addressRegion': address.country === 'FR' ? getDepartmentName(address.postal_code) : undefined,
              'schema:postalCode': address.postal_code,
              'schema:streetAddress': address.thoroughfare
            }
          };
        }

        const description = entity.field_accroche.und.length > 0 ? entity.field_accroche.und[0].value : undefined;
        // If node path is not present, guess it from the title
        const url =
          'https://colibris-lafabrique.org/' +
          (nodePath || 'les-projets/' + slugify(entity.title, { lower: true, remove: /[*+~.()'"!:@]/g }));

        const project = {
          type: 'pair:Project',
          // PAIR
          'pair:label': entity.title,
          'pair:description': description,
          'pair:interestOf': tags,
          'pair:aboutPage': url,
          'pair:involves': {
            '@id': user
          },
          // ActivityStreams
          name: entity.title,
          content: description,
          location,
          image,
          tag: tags,
          url,
          attributedTo: user,
          published: new Date(entity.created * 1000).toISOString(),
          updated: new Date(entity.changed * 1000).toISOString()
        };

        if (eventType === 'insert') {
          project.slug = entity.uuid;
        } else {
          project.id = existingProject.id;
        }

        activity = {
          '@context': [
            'https://www.w3.org/ns/activitystreams',
            {
              pair: 'http://virtual-assembly.org/ontologies/pair#'
            }
          ],
          type: eventType === 'insert' ? ACTIVITY_TYPES.CREATE : ACTIVITY_TYPES.UPDATE,
          actor: user,
          to: urlJoin(user, 'followers'),
          object: project
        };
        /*
         * DELETE
         */
      } else if (eventType === 'delete') {
        activity = {
          '@context': [
            'https://www.w3.org/ns/activitystreams',
            {
              pair: 'http://virtual-assembly.org/ontologies/pair#'
            }
          ],
          type: ACTIVITY_TYPES.DELETE,
          actor: user,
          to: urlJoin(user, 'followers'),
          object: existingProject.id
        };
      }

      const result = await ctx.call('activitypub.outbox.post', {
        username: getSlugFromUri(user),
        ...activity
      });

      console.log('New activity posted on URI:', result.id);

      return result.id;
    },
    async postNews(ctx) {
      const {
        data: { action, data }
      } = ctx.params;
      let activity, project;

      const projectUri = urlJoin(this.settings.usersContainer, convertWikiNames(data.listefiche14));
      const noteUri = urlJoin(CONFIG.HOME_URL, 'objects', convertWikiNames(data.id_fiche));

      try {
        project = await ctx.call('activitypub.actor.get', { id: projectUri });
      } catch (e) {
        console.log(`No project found with URI ${projectUri}, skipping...`);
        return;
      }

      if (action !== 'delete') {
        const image =
          action === 'add'
            ? data['imagebf_image']
              ? 'https://colibris.cc/groupeslocaux/files/' + data['imagebf_image']
              : undefined
            : data['filename-imagebf_image']
            ? 'https://colibris.cc/groupeslocaux/files/' + data.id_fiche + '_' + data['filename-imagebf_image']
            : undefined;

        activity = {
          '@context': 'https://www.w3.org/ns/activitystreams',
          type: action === 'edit' ? ACTIVITY_TYPES.UPDATE : ACTIVITY_TYPES.CREATE,
          to: [project.followers, PUBLIC_URI],
          actor: projectUri,
          object: {
            type: 'Note',
            attributedTo: projectUri,
            name: data.bf_titre,
            content: data.bf_contenu,
            image,
            published: convertWikiDate(data.date_creation_fiche),
            updated: convertWikiDate(data.date_maj_fiche)
          }
        };

        if (action === 'edit') {
          activity.object.id = noteUri;
        } else {
          activity.object.slug = convertWikiNames(data.id_fiche);
        }
      } else {
        activity = {
          '@context': 'https://www.w3.org/ns/activitystreams',
          type: ACTIVITY_TYPES.DELETE,
          to: [project.followers, PUBLIC_URI],
          actor: projectUri,
          object: urlJoin(CONFIG.HOME_URL, 'objects', convertWikiNames(data.id_fiche))
        };
      }

      activity = await ctx.call('activitypub.outbox.post', {
        username: convertWikiNames(data.listefiche14),
        ...activity
      });

      console.log('New activity posted on URI:', activity.id);

      return activity.id;
    }
  }
};
