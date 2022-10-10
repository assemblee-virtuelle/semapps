module.exports = {
  guides: ['guides/ldp-server','guides/dms','guides/activitypub'],
  middleware: [
    'middleware/introduction',
    'middleware/core',
    {
      type: 'category',
      label: 'ActivityPub',
      items: [
        'middleware/activitypub/index',
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
      items: [
        'middleware/importer/index',
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
    {
      type: 'category',
      label: 'LDP',
      items: [
        'middleware/ldp/index',
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
      items: [
        'middleware/notifications/index',
        'middleware/notifications/digest',
        'middleware/notifications/single-mail',
      ],
    },
    'middleware/sparql-endpoint',
    {
      type: 'category',
      label: 'Triplestore',
      items: [
        'middleware/triplestore/index',
        'middleware/triplestore/dataset',
      ],
    },
    'middleware/void',
    {
      type: 'category',
      label: 'WebACL',
      items: [
        'middleware/webacl/index',
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
  Frontend: [
    'frontend/introduction',
    {
      type: 'category',
      label: 'Semantic Data Provider',
      items: [
        'frontend/semantic-data-provider/index',
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
  contribute: {
    'SemApps core': ['contribute/code','contribute/coding-conventions'],
    Documentation: ['contribute/documentation','contribute/style-guide']
  }
};
