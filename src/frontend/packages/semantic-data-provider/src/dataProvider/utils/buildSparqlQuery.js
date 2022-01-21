import buildDereferenceQuery from './buildDereferenceQuery';
import getRdfPrefixes from './getRdfPrefixes';
import DataFactory from '@rdfjs/data-model';
import sparqljs from 'sparqljs';

// Regenerate a SPARQL query from a JSON object
var SparqlGenerator = require('sparqljs').Generator;
var generator = new SparqlGenerator({ /* prefixes, baseIRI, factory, sparqlStar */ });


const buildSparqlQuery = ({ containers, params: { filter }, dereference, ontologies }) => {

  // sparqljs init :
  let sparqljsParams = {
    "queryType": "CONSTRUCT",
    "template": [{
      "subject": DataFactory.variable('s1'),
      "predicate": DataFactory.variable('p1'),
      "object": DataFactory.variable('o1'),
    }],
    "where": [
      {
        "type": "bgp",
        "triples": [{
          "subject": DataFactory.variable('s1'),
          "predicate": DataFactory.variable('p1'),
          "object": DataFactory.variable('o1'),
        }]
      },{
        "type": "filter",
        "expression": {
          "type": "operation",
          "operator": "isiri",
          "args": [DataFactory.variable('s1')]
        }
      },{
        "type": "filter",
        "expression": {
          "type": "operation",
          "operator": "in",
          "args": [
            DataFactory.variable('containerUri'),
            [DataFactory.namedNode(containers[0])]
          ]
        }
      },{
        "type": "bgp",
        "triples": [{
          "subject": DataFactory.variable('containerUri'),
          "predicate": DataFactory.namedNode('http://www.w3.org/ns/ldp#contains'),
          "object": DataFactory.variable('s1'),
        }]
      }
    ],
    "type": "query",
    "prefixes": {}
  }

  // sparqljs prefixes :
  ontologies.map( ontologie => {
    sparqljsParams.prefixes = {
      ...sparqljsParams.prefixes,
      [ontologie.prefix]: ontologie.url
    }
  });
  
  // sparqljs dereference :
  const dereferenceQueryForSparqlJs = buildDereferenceQuery(dereference, true, ontologies);
  if (dereferenceQueryForSparqlJs && dereferenceQueryForSparqlJs.construct) {
    sparqljsParams.where = sparqljsParams.where.concat(dereferenceQueryForSparqlJs.where);
    sparqljsParams.template = sparqljsParams.template.concat(dereferenceQueryForSparqlJs.construct);
  }
  
  // sparqljs filters :
  if ( filter && Object.keys(filter).length > 0 ) {   
    
    const isSPARQLFilter = filter.sparqlWhere && Object.keys(filter.sparqlWhere).length > 0;
    const isQFilter = filter.q && filter.q.length > 0;

    // sparqljs filter sparql :
    if ( isSPARQLFilter ) {
      sparqljsParams.where.push(filter.sparqlWhere);
    }
    
    // sparqljs filter Q :
    if ( isQFilter ) {
      sparqljsParams.where.push({
        "type": "group",
        "patterns": [
          {
            "queryType": "SELECT",
            "variables": [DataFactory.variable('s1')],
            "where": [
              {
                "type": "bgp",
                "triples": [{
                  "subject": DataFactory.variable('s1'),
                  "predicate": DataFactory.variable('p1'),
                  "object": DataFactory.variable('o1'),
                }]
              },
                {
                    "type": "filter",
                    "expression": {
                        "type": "operation",
                        "operator": "regex",
                        "args": [
                          {
                            "type": "operation",
                            "operator": "lcase",
                            "args": [{
                              "type": "operation",
                              "operator": "str",
                              "args": [DataFactory.variable('o1')]
                            }]
                          },
                          DataFactory.literal(
                            filter.q.toLowerCase(),
                            "",
                            DataFactory.namedNode("http://www.w3.org/2001/XMLSchema#string")
                          )
                        ]
                    }
                },
                {
                  "type": "filter",
                  "expression": {
                    "type": "operation",
                    "operator": "notexists",
                    "args": [{
                      "type": "bgp",
                      "triples": [{
                        "subject": DataFactory.variable('s1'),
                        "predicate": DataFactory.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
                        "object": DataFactory.variable('o1')
                      }]
                    }]
                  }
                }
            ],
            "type": "query"
          }
        ]
      });
      
    // sparqljs filter <> Q :
    } else {
      
      Object.keys(filter).forEach(predicate => {
        if (filter[predicate] && predicate !== 'sparqlWhere') {
          let filterPrefix = null;
          let filterValue =null;
          let filterOntologie = null;
          let filterObjectValue = null;
          let filterPredicateValue = null;
          if ( predicate === 'a' ) {
            filterPrefix = filter[predicate].split(':')[0];
            filterValue = filter[predicate].split(':')[1];
            filterOntologie = ontologies.find( ontologie => ontologie.prefix === filterPrefix );
            filterPredicateValue = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
            filterObjectValue = filterOntologie.url + filterValue;
          } else {
            filterPrefix = predicate.split(':')[0];
            filterValue = predicate.split(':')[1];
            filterOntologie = ontologies.find( ontologie => ontologie.prefix === filterPrefix );
            filterPredicateValue = filterOntologie.url + filterValue;
            filterObjectValue = filter[predicate];
          }
          sparqljsParams.where.push({
            "type": "bgp",
            "triples": [{
              "subject": DataFactory.variable('s1'),
              "predicate": DataFactory.namedNode(filterPredicateValue),
              "object": DataFactory.namedNode(filterObjectValue)
            }]
          });
        }
      });
    }
    
  }
  
  const sparqljsQuery = generator.stringify(sparqljsParams);

  if (filter.q) { delete filter.q };

  return sparqljsQuery;
};

export default buildSparqlQuery;
