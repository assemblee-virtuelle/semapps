const { MoleculerError } = require('moleculer').Errors;

/**
 * Throw an error if the value includes a bracket or a space
 */
const sanitizeSparqlUri = value => {
  if (value && (value.includes('>') || value.includes('<') || /\s/g.test(value))) {
    throw new MoleculerError('SPARQL injection detected', 400, 'SPARQL_INJECTION');
  } else {
    return value;
  }
};

/**
 * Throw an error if the value includes a quote
 */
const sanitizeSparqlString = value => {
  if (value && value.includes('"')) {
    throw new MoleculerError('SPARQL injection detected', 400, 'SPARQL_INJECTION');
  } else {
    return value;
  }
};

/**
 * Tagged template literal that can be used to check that all variables passed are either URIs or strings.
 * URIs are detected by looking if they are surrounded by brackets, and strings if they are surrounded by quotes
 */
const sanitizeSparqlQuery = (fragments, ...values) => {
  values.forEach((value, i) => {
    if (fragments[i].endsWith('<') && fragments[i + 1].startsWith('>')) {
      sanitizeSparqlUri(value);
    } else if (fragments[i].endsWith('"') && fragments[i + 1].startsWith('"')) {
      sanitizeSparqlString(value);
    }
  });

  // Transform the fragments and values into a concatenated string
  return values.reduce((acc, value, i) => `${acc}${fragments[i]}${value}`, '') + fragments.slice(-1);
};

export { sanitizeSparqlUri, sanitizeSparqlString, sanitizeSparqlQuery };
