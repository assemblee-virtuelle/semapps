const constants = require('./constants');
const Negotiator = require('negotiator');
const { MoleculerError } = require('moleculer').Errors;

const negociateType = function(incomingType) {
  let availableMediaTypes = [];
  let negotiatorType = incomingType;
  constants.TYPES_REPO.forEach(trSupported => {
    trSupported.mimeFull.forEach(tr => availableMediaTypes.push(tr));
  });
  const negotiator = new Negotiator({
    headers: {
      accept: negotiatorType
    }
  });
  const rawNegociatedAccept = negotiator.mediaType(availableMediaTypes);
  if (rawNegociatedAccept != undefined) {
    return constants.TYPES_REPO.filter(tr => tr.mimeFull.includes(rawNegociatedAccept))[0];
  } else {
    throw new MoleculerError('type not supported : ' + incomingType, 400, 'TYPE_NOT_SUPPORTED');
  }
};
const negociateTypeMime = function(incomingType) {
  return negociateType(incomingType).mime;
};
const negociateTypeN3 = function(incomingType) {
  return negociateType(incomingType).N3Mapping;
};
const negociateTypeFuseky = function(incomingType) {
  return negociateType(incomingType).fusekiMapping;
};

module.exports = {
  SUPPORTED_MIME_TYPES: constants.SUPPORTED_MIME_TYPES,
  negociateType,
  negociateTypeMime,
  negociateTypeN3,
  negociateTypeFuseky
};
