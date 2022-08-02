module.exports = {
  guides: ['guides/ldp-server','guides/dms','guides/activitypub'],
  middleware: [
    {
      type: 'category',
      label: 'ActivityPub',
      items: [
        'middleware/activitypub/index',
        'middleware/activitypub/activities-handler',
      ],
    },
    'middleware/auth',
    'middleware/backup',
    'middleware/fuseki-admin',
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
    'middleware/triplestore',
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
