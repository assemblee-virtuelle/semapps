const resolvePrefix = (item, ontologies) => {
  if (item.startsWith('http://') || item.startsWith('https://')) {
    // Already resolved, return the URI
    return item;
  }
  if (item === 'a') {
    // Special case
    return 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
  }
  const [prefix, value] = item.split(':');
  if (value) {
    const ontology = ontologies.find(ontology => ontology.prefix === prefix);
    if (ontology) {
      return ontology.url + value;
    }
    throw new Error(`No ontology found with prefix ${prefix}`);
  } else {
    throw new Error(`The value "${item}" is not correct. It must include a prefix or be a full URI.`);
  }
};

export default resolvePrefix;
