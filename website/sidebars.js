module.exports = {
  guides: ['guides/ldp-server','guides/dms','guides/activitypub'],
  middleware: [
    'middleware/introduction',
    'middleware/core',
    {
      type: 'category',
      label: 'ActivityPub',
      link: {
        type: 'doc',
        id: 'middleware/activitypub/index'
      },
      items: [
        'middleware/activitypub/activities-handler',
        'middleware/activitypub/activity-mapping',
      ],
    },
    'middleware/auth',
    'middleware/backup',
    'middleware/signature',
    {
      type: 'category',
      label: 'Importer',
      link: {
        type: 'doc',
        id: 'middleware/importer/index'
      },
      items: [
        'middleware/importer/discourse',
        'middleware/importer/drupal',
        'middleware/importer/gogocarto',
        'middleware/importer/humhub',
        'middleware/importer/jotform',
        'middleware/importer/mobilizon',
        'middleware/importer/prestashop',
        'middleware/importer/yeswiki',
      ],
    },
    'middleware/inference',
    'middleware/jsonld',
    {
      type: 'category',
      label: 'LDP',
      link: {
        type: 'doc',
        id: 'middleware/ldp/index'
      },
      items: [
        'middleware/ldp/resource',
        'middleware/ldp/container',
        'middleware/ldp/document-tagger',
      ],
    },
    'middleware/migration',
    'middleware/mirror',
    {
      type: 'category',
      label: 'Notifications',
      link: {
        type: 'doc',
        id: 'middleware/notifications/index'
      },
      items: [
        'middleware/notifications/digest',
        'middleware/notifications/single-mail',
      ],
    },
    'middleware/sparql-endpoint',
    {
      type: 'category',
      label: 'Triplestore',
      link: {
        type: 'doc',
        id: 'middleware/triplestore/index'
      },
      items: [
        'middleware/triplestore/dataset',
      ],
    },
    'middleware/void',
    {
      type: 'category',
      label: 'WebACL',
      link: {
        type: 'doc',
        id: 'middleware/webacl/index'
      },
      items: [
        'middleware/webacl/resource',
        'middleware/webacl/group',
        'middleware/webacl/authorizer',
        'middleware/webacl/groups-manager',
      ],
    },
    'middleware/webfinger',
    'middleware/webhooks',
    'middleware/webid'
  ],
  frontend: [
    'frontend/introduction',
    {
      type: 'category',
      label: 'Semantic Data Provider',
      link: {
        type: 'doc',
        id: 'frontend/semantic-data-provider/index'
      },
      items: [
        'frontend/semantic-data-provider/data-servers',
        'frontend/semantic-data-provider/data-model',
      ],
    },
    'frontend/auth-provider',
    'frontend/activitypub-components',
    'frontend/date-components',
    'frontend/field-components',
    'frontend/geo-components',
    'frontend/input-components',
    'frontend/interop-components',
    'frontend/list-components',
    'frontend/markdown-components'
  ],
  triplestore: [
    'triplestore/introduction',
    'triplestore/migrating-datasets',
    'triplestore/compacting-datasets'
  ],
  contribute: {
    'SemApps core': ['contribute/code','contribute/coding-conventions'],
    Documentation: ['contribute/documentation','contribute/style-guide']
  }
};
