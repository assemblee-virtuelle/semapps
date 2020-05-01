import CONFIG from './config';

const resourcesTypes = {
  projects: {
    name: 'Projets',
    prefix: 'pairv1',
    ontology: 'http://virtual-assembly.org/pair#',
    class: 'Project',
    container: `${CONFIG.MIDDLEWARE_URL}ldp/object/`,
    readOnly: false,
    fields: [
      {
        type: 'pairv1:preferedLabel',
        label: 'Titre',
        datatype: 'string'
      },
      {
        type: 'pairv1:comment',
        label: 'Commentaire',
        datatype: 'string'
      },
      {
        type: 'pairv1:description',
        label: 'Description',
        datatype: 'text'
      },
      {
        type: 'pairv1:aboutPage',
        label: 'Site web',
        datatype: 'url'
      }
    ]
  },
  organizations: {
    name: 'Organisations',
    prefix: 'pairv1',
    ontology: 'http://virtual-assembly.org/pair#',
    class: 'Organization',
    container: `${CONFIG.MIDDLEWARE_URL}ldp/object/`,
    readOnly: false,
    fields: [
      {
        type: 'pairv1:preferedLabel',
        label: 'Titre',
        datatype: 'string'
      },
      {
        type: 'pairv1:comment',
        label: 'Commentaire',
        datatype: 'string'
      },
      {
        type: 'pairv1:description',
        label: 'Description',
        datatype: 'text'
      }
    ]
  },
  users: {
    name: 'Utilisateurs',
    ontology: 'http://xmlns.com/foaf/0.1/',
    class: 'Person',
    prefix: 'foaf',
    container: `${CONFIG.MIDDLEWARE_URL}users/`,
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
