module.exports = {
  visibility: 'public',
  cache: true,
  handler() {
    return Object.values(this.ontologies);
  }
};
