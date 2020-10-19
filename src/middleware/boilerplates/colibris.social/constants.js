const groupsMapping = {
  '60Creil': '60-pays-creillois'
};

const statusMapping = {
  1: 'En cours',
  2: 'En sommeil',
  3: 'Abandonnée',
  4: 'En réflexion'
};

const glThemesMapping = {
  1: ['Agriculture', 'Alimentation'],
  2: ['Culture', 'Social'],
  3: ['Démocratie', 'Gouvernance'],
  4: ['Énergie', 'Habitat'],
  5: ['Économie'],
  6: ['Éducation'],
  7: ['(R)évolution intérieure', 'Santé']
};

const laFabriqueThemesMapping = {
  101: ['Agriculture', 'Alimentation'],
  102: ['Arts', 'Culture'],
  103: ['Autre'],
  104: ['Bien-être'],
  105: ['Démocratie'],
  106: ['Économie locale'],
  107: ['Éducation'],
  108: ['Énergie'],
  109: ['Habitat', 'Oasis'],
  111: ['Transports']
};

module.exports = {
  groupsMapping,
  statusMapping,
  glThemesMapping,
  laFabriqueThemesMapping
};
