import CONFIG from './config';

const resourcesTypes = {
  projects: {
    name: 'Projets',
    ontology: 'http://virtual-assembly.org/pair#',
    class: 'Project',
    container: `${CONFIG.MIDDLEWARE_URL}ldp/pair:Project`,
    readOnly: false,
    fields: [
      {
        type: 'pair:preferedLabel',
        label: 'Titre',
        datatype: 'string'
      },
      {
        type: 'pair:comment',
        label: 'Commentaire',
        datatype: 'string'
      },
      {
        type: 'pair:description',
        label: 'Description',
        datatype: 'text'
      },
      {
        type: 'pair:aboutPage',
        label: 'Site web',
        datatype: 'url'
      }
    ]
  },
  users: {
    name: 'Utilisateurs',
    ontology: 'http://xmlns.com/foaf/0.1/',
    class: 'Person',
    container: `${CONFIG.MIDDLEWARE_URL}users`,
    readOnly: true,
    fields: [
      {
        type: 'foaf:name',
        label: 'Nom',
        datatype: 'string'
      },
      {
        type: 'foaf:familyName',
        label: 'Nom de famille',
        datatype: 'string'
      },
      {
        type: 'foaf:email',
        label: 'Adresse email',
        datatype: 'email'
      },
      {
        type: 'foaf:homepage',
        label: 'Site web',
        datatype: 'url'
      }
    ]
  }
};

export default resourcesTypes;
