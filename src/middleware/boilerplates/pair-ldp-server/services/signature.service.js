const path = require('path');
const { SignatureService } = require('@semapps/signature');

module.exports = {
  mixins: [SignatureService],
  settings: {
    actorsKeyPairsDir: path.resolve(__dirname, '../actors')
  }
};
