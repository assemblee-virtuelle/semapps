export default {
  dataModel: {
    types: ['pair:Folder'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'folders',
    slugField: 'pair:label'
  },
  translations: {
    fr: {
      name: 'Dossier |||| Dossiers'
    }
  }
};
