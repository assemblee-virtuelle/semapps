module.exports = {
  visibility: 'public',
  handler() {
    return this.registeredContainers;
  }
};
