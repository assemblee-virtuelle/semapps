const resources = {
  Actor: {
    types: ['as:Person', 'as:Organization']
  },
  Action: {
    types: ['as:Group'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'actors'
  },
  Device: {
    types: ['semapps:Device'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'push/devices'
  },
  HostingService: {
    types: ['oasis:HostingService'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'hosting-services'
  },
  Note: {
    types: ['as:Note'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'objects'
  },
  Notification: {
    types: ['semapps:PushNotification'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'push/notifications'
  },
  Project: {
    types: ['pair:Project'],
    query: {
      'pair:involves': process.env.REACT_APP_MIDDLEWARE_URL + 'actors/lafabrique'
    },
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'objects'
  },
  Subscriber: {
    containerUri: process.env.REACT_APP_MAILER_URL + 'actors'
  },
  Theme: {
    types: ['pair:Thema'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'themes'
  },

  /*
   * Not displayed
   */

  Tag: {
    types: ['pair:Thema', 'semapps:ProjectState']
  },
  HostingServiceType: {
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'hosting-services-types'
  },
  Oasis: {
    types: ['pair:Project'],
    query: {
      'pair:involves': process.env.REACT_APP_MIDDLEWARE_URL + 'actors/lafabrique',
      'pair:interestOf': process.env.REACT_APP_MIDDLEWARE_URL + 'themes/oasis'
    }
  }
};

export default resources;
