const reduceImageAction = require('./actions/reduceImage');
const uploadAction = require('./actions/upload');
const methods = require('./methods');

module.exports = {
  name: 'ldp.file',
  settings: {
    baseUrl: null,
  },
  actions: {
    reduceImage: reduceImageAction,
    upload: uploadAction
  },
  methods
};
