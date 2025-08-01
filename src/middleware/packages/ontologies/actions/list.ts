const Schema = {
  visibility: 'public',
  cache: true,
  handler() {
    return Object.values(this.ontologies);
  }
};

export default Schema;
