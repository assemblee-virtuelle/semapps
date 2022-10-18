const compressImageAction = require('./actions/compressImage');
const uploadAction = require('./actions/upload');
const methods = require('./methods');

module.exports = {
  name: 'ldp.file',
  settings: {
    baseUrl: null,
  },
  actions: {
    compressImage: compressImageAction,
    upload: uploadAction
  },
  methods
};
