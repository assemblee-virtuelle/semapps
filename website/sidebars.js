const divider = {
  type: 'html',
  value: '<hr style="margin: 7px 0 5px 0;" />',
  defaultStyle: true
};

module.exports = {
  guides: ['guides/ldp-server', 'guides/dms', 'guides/activitypub'],
  middleware: [
    'middleware/index',
    divider,
    'middleware/core',
    {
      type: 'category',
      label: 'ActivityPub',
      link: {
        type: 'doc',
        id: 'middleware/activitypub/index'
      },
      items: ['middleware/activitypub/activities-handler', 'middleware/activitypub/activity-mapping']
    },
    'middleware/auth',

    {
      type: 'category',
      label: 'Crypto',
      link: {
        type: 'doc',
        id: 'middleware/crypto/index'
      },
      items: [
        'middleware/crypto/keys',
        'middleware/crypto/signature',
        'middleware/crypto/proxy',
        'middleware/crypto/migration',
        'middleware/crypto/keypair'
      ]
    },
    {
      type: 'category',
      label: 'JSON-LD',
      link: {
        type: 'doc',
        id: 'middleware/jsonld/index'
      },
      items: ['middleware/jsonld/parser', 'middleware/jsonld/context']
    },
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
        'middleware/ldp/link-header',
        'middleware/ldp/registry',
        'middleware/ldp/controlled-container',
        'middleware/ldp/document-tagger',
        'middleware/ldp/image-processor'
      ]
    },
    'middleware/nodeinfo',
    'middleware/ontologies',
    {
      type: 'category',
      label: 'Solid',
      link: {
        type: 'doc',
        id: 'middleware/solid/index'
      },
      items: [
        'middleware/solid/pod',
        'middleware/solid/type-indexes',
        'middleware/solid/type-registrations',
        'middleware/solid/notifications-provider',
        'middleware/solid/notifications-listener'
      ]
    },
    'middleware/sparql-endpoint',
    {
      type: 'category',
      label: 'Triplestore',
      link: {
        type: 'doc',
        id: 'middleware/triplestore/index'
      },
      items: ['middleware/triplestore/dataset']
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
        'middleware/webacl/groups-manager'
      ]
    },
    'middleware/webfinger',
    'middleware/webid',
    divider,
    'middleware/backup',
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
        'middleware/importer/wordpress',
        'middleware/importer/yeswiki'
      ]
    },
    'middleware/inference',
    'middleware/migration',
    {
      type: 'category',
      label: 'Notifications',
      link: {
        type: 'doc',
        id: 'middleware/notifications/index'
      },
      items: ['middleware/notifications/digest', 'middleware/notifications/single-mail']
    },
    {
      type: 'category',
      label: 'Sync',
      link: {
        type: 'doc',
        id: 'middleware/sync/index'
      },
      items: [
        'middleware/sync/objects-watcher',
        'middleware/sync/aggregator',
        'middleware/sync/mirror',
        'middleware/sync/synchronizer'
      ]
    },
    'middleware/webhooks'
  ],
  frontend: [
    'frontend/index',
    {
      type: 'category',
      label: 'Semantic Data Provider',
      link: {
        type: 'doc',
        id: 'frontend/semantic-data-provider/index'
      },
      items: ['frontend/semantic-data-provider/data-servers', 'frontend/semantic-data-provider/data-model']
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
  triplestore: ['triplestore/index', 'triplestore/migrating-datasets', 'triplestore/compacting-datasets'],
  contribute: {
    'SemApps core': ['contribute/code', 'contribute/coding-conventions'],
    Documentation: ['contribute/documentation', 'contribute/style-guide']
  }
};
