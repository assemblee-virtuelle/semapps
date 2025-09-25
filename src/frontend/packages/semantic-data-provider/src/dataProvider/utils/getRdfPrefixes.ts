const getRdfPrefixes = (ontologies: any) => {
  return Object.entries(ontologies)
    .map(([prefix, url]) => `PREFIX ${prefix}: <${url}>`)
    .join('\n');
};

export default getRdfPrefixes;
