const Negotiator = require('negotiator');
const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES, TYPES_REPO } = require('./constants');

const negotiateType = function (incomingType) {
  const availableMediaTypes = [];
  const negotiatorType = incomingType;
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
  }
  throw new MoleculerError(`Type not supported : ${incomingType}`, 400, 'TYPE_NOT_SUPPORTED');
};

const negotiateTypeMime = function (incomingType) {
  return negotiateType(incomingType).mime;
};

const negotiateTypeN3 = function (incomingType) {
  return negotiateType(incomingType).N3Mapping;
};

const negotiateTypeFuseki = function (incomingType) {
  return negotiateType(incomingType).fusekiMapping;
};

// Return true if the provided `type` is accepted by the allowedTypes.
// Note that allowedTypes may include wild cards such as "image/*"
const isMimeTypeMatching = (type, types) => {
  const negotiator = new Negotiator({
    headers: {
      accept: Array.isArray(types) ? types.join(', ') : types
    }
  });

  const result = negotiator.mediaType([type]);

  return !!result;
};

module.exports = {
  MIME_TYPES,
  negotiateType,
  negotiateTypeMime,
  negotiateTypeN3,
  negotiateTypeFuseki,
  isMimeTypeMatching
};
