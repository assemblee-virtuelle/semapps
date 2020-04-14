const Negotiator = require('negotiator');
const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES, TYPES_REPO } = require('./constants');

const negotiateType = function(incomingType) {
  let availableMediaTypes = [];
  let negotiatorType = incomingType;
  TYPES_REPO.forEach(trSupported => {
    trSupported.mimeFull.forEach(tr => availableMediaTypes.push(tr));
  });
  const negotiator = new Negotiator({
    headers: {
      accept: negotiatorType
    }
  });
  const rawNegotiatedAccept = negotiator.mediaType(availableMediaTypes);
  if (rawNegotiatedAccept !== undefined) {
    return TYPES_REPO.filter(tr => tr.mimeFull.includes(rawNegotiatedAccept))[0];
  } else {
    throw new MoleculerError('Type not supported : ' + incomingType, 400, 'TYPE_NOT_SUPPORTED');
  }
};

const negotiateTypeMime = function(incomingType) {
  return negotiateType(incomingType).mime;
};

const negotiateTypeN3 = function(incomingType) {
  return negotiateType(incomingType).N3Mapping;
};

const negotiateTypeFuseki = function(incomingType) {
  return negotiateType(incomingType).fusekiMapping;
};

module.exports = {
  MIME_TYPES,
  negotiateType,
  negotiateTypeMime,
  negotiateTypeN3,
  negotiateTypeFuseki
};
