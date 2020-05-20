import { fetchUtils } from 'react-admin';

const resources = {
  Project: {
    types: ['pairv1:Project'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'ldp/object'
  },
  Organization: {
    types: ['pairv1:Organization'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'ldp/object'
  },
  Person: {
    types: ['pairv1:Person'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'ldp/object'
  },
  Concept: {
    types: ['skos:Concept'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'ldp/object'
  },
  Agent: {
    types: ['pairv1:Person', 'pairv1:Organization']
  },
  ProgrammingLanguage: {
    buildSparqlQuery: ({ params: { pagination, sort, filter }, ontologies }) => {
      return `
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        CONSTRUCT {
          ?s rdfs:label ?label
        }
        WHERE {
          ?s a <http://dbpedia.org/ontology/ProgrammingLanguage> .
          ?s rdfs:label ?label .
          FILTER ( lang(?label) = "fr" ) .
        }
      `;
    },
    customFetch: query => {
      const url = new URL('https://dbpedia.org/sparql');
      url.searchParams.append('query', query);
      url.searchParams.append('format', 'application/x-json+ld+ctx');
      return fetchUtils.fetchJson(url);
    }
  }
};

export default resources;
