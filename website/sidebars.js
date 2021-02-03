/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: {
    Guides: ['guides/ldp-server','guides/dms','guides/activitypub'],
    Packages: [
      'packages/activitypub',
      'packages/backup',
      'packages/connector',
      'packages/fuseki-admin',
      'packages/importer',
      'packages/inference',
      {
        type: 'category',
        label: 'LDP',
        items: [
          'packages/ldp/index',
          'packages/ldp/resource',
          'packages/ldp/container',
        ],
      },
      'packages/signature',
      'packages/triplestore',
      'packages/webfinger',
      'packages/webhooks',
      'packages/webid'
    ]
  },
  contribute: {
    'SemApps core': ['contribute/code','contribute/coding-conventions'],
    Documentation: ['contribute/documentation','contribute/style-guide']
  }
};
