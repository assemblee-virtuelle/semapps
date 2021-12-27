import buildDereferenceQuery from './buildDereferenceQuery';
import getRdfPrefixes from './getRdfPrefixes';
import DataFactory from '@rdfjs/data-model';
import sparqljs from 'sparqljs';



// Parse a SPARQL query to a JSON object
var SparqlParser = require('sparqljs').Parser;
var parser = new SparqlParser();
/*
const sparql = '' +
'PREFIX ldp: <http://www.w3.org/ns/ldp#> ' +
'PREFIX petr: <https://data.petr-msb.data-players.com/ontology#> ' +
'PREFIX pair: <http://virtual-assembly.org/ontologies/pair#> ' +
'CONSTRUCT { ?s1 ?p1 ?o1. } ' +
'WHERE { ' +
'  ?s1 ?p1 ?o1. ' +
'  FILTER(ISIRI(?s1)) ' +
'  FILTER(?containerUri IN(<http://localhost:3000/spaces>)) ' +
'  ?containerUri ldp:contains ?s1. ' +
'  ?s1 ^pair:hasLocation [petr:hasEquipmentType <http://localhost:3000/equipment-types/mobile>] ' +
'} ';

console.log('parser.parse:', parser.parse(sparql));
*/

// Regenerate a SPARQL query from a JSON object
var SparqlGenerator = require('sparqljs').Generator;
var generator = new SparqlGenerator({ /* prefixes, baseIRI, factory, sparqlStar */ });



const buildSparqlQuery = ({ containers, params: { filter }, dereference, ontologies }) => {
  
  console.log('******************* buildSparqlQuery', containers, filter, dereference, ontologies);

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

  console.log('***** sparqljsParams-init', {...sparqljsParams});
  
  // sparqljs prefixes :
  ontologies.map( ontologie => {
    sparqljsParams.prefixes = {
      ...sparqljsParams.prefixes,
      [ontologie.prefix]: ontologie.url
    }
  });
  
  console.log('***** sparqljsParams-1', {...sparqljsParams});
    
  // sparqljs dereference :
  const dereferenceQuery = buildDereferenceQuery(dereference, ontologies);
  if (dereferenceQuery && dereferenceQuery.constructForSparqljs) {
    sparqljsParams.where = sparqljsParams.where.concat(dereferenceQuery.whereForSparqljs);
    sparqljsParams.template = sparqljsParams.template.concat(dereferenceQuery.constructForSparqljs);
  }
  
  console.log('***** sparqljsParams-2', {...sparqljsParams});
    
  // sparqljs filters :
  if ( filter && Object.keys(filter).length > 0 ) {   
    
    console.log('** FILTER-0', {...filter},  Object.keys(filter).join());
    
    const isSPARQLFilter = filter.sparqlWhere && Object.keys(filter.sparqlWhere).length > 0;
    const isQFilter = filter.q && filter.q.length > 0;

    // sparqljs filter sparql :
    if ( isSPARQLFilter ) {
      
      console.log('** FILTER-SPARQL');
      /* 
      Exemple : 
      http://localhost:5000/Organization?filter=%7B%22q%22%3A%20%22orga%22%2C%22sparqlWhere%22%3A%20%7B%0A%22type%22%3A%20%22bgp%22%2C%0A%22triples%22%3A%20%5B%7B%0A%22subject%22%3A%20%7B%0A%22termType%22%3A%20%22Variable%22%2C%0A%22value%22%3A%20%22s1%22%0A%7D%2C%0A%22predicate%22%3A%20%7B%0A%22termType%22%3A%20%22NameNode%22%2C%0A%22value%22%3A%20%22http%3A%2F%2Fvirtual-assembly.org%2Fontologies%2Fpair%23label%22%0A%7D%2C%0A%22object%22%3A%20%7B%0A%22termType%22%3A%20%22Literal%22%2C%0A%22value%22%3A%20%22orga2%22%0A%7D%0A%7D%5D%0A%7D%7D
      {
        "q": "orga",
        "sparqlWhere": {
          "type": "bgp",
          "triples": [{
              "subject": {"termType": "Variable","value": "s1"},
              "predicate": {"termType": "NameNode","value": "http://virtual-assembly.org/ontologies/pair#label"},
              "object": {"termType": "Literal","value": "orga2"}
          }]
        }
      }
      */
      sparqljsParams.where.push(filter.sparqlWhere);
    }
    
    // sparqljs filter Q :
    if ( isQFilter ) {
      
      console.log('** FILTER-Q');
      
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
      
      delete filter.q;
      
    // sparqljs filter <> Q :
    } else {
      
      console.log('** FILTER<>Q');
    
      Object.keys(filter).forEach(predicate => {
        if (filter[predicate] && predicate !== 'sparqlWhere') {
          let filterPrefix = null;
          let filterValue =null;
          let filterOntologie = null;
          let filterObjectValue = null;
          let filterPredicateValue = null;
          if ( predicate === 'a' ) {
            console.log('** FILTER<>Q-a');
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

          console.log('** FILTER-<>Q--->', predicate, filter[predicate], filterPrefix, filterValue, filterOntologie, filterObjectValue);
          
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
  
  console.log('***** sparqljsParams-final', {...sparqljsParams});
  
  const sparqljsQuery = generator.stringify(sparqljsParams);


  
  // OLD STUFF :
  
  console.log('******************* SEMAPPS buildSparqlQuery ***', containers, filter, dereference, ontologies);
  
  let searchWhereQuery = '',
    filterWhereQuery = '';

  if (filter) {
    if (filter.q && filter.q.length > 0) {
      searchWhereQuery += `
      {
        SELECT ?s1
        WHERE {
          ?s1 ?p1 ?o1 .
          FILTER regex(lcase(str(?o1)), "${filter.q.toLowerCase()}")
          FILTER NOT EXISTS {?s1 a ?o1}
        }
      }
      `;
      delete filter.q;
    }
    Object.keys(filter).forEach(predicate => {
      if (filter[predicate] && predicate != "sparqlWhere") {
        const object = filter[predicate].startsWith('http') ? `<${filter[predicate]}>` : filter[predicate];
        filterWhereQuery += `?s1 ${predicate} ${object} .`;
      }
    });
  }

//  const dereferenceQuery = buildDereferenceQuery(dereference);
  
  console.log('*** SEMAPPS buildSparqlQuery-params ***',
    '1:', dereferenceQuery.construct,
    '2:', filterWhereQuery,
    '3:', containers,
    '4:', searchWhereQuery,
    '5:', dereferenceQuery.where,
    '6:', dereferenceQuery.whereForSparqljs
  );
  
  const semappsQuery = `
  ${getRdfPrefixes(ontologies)}
  CONSTRUCT {
    ?s1 ?p2 ?o2 .
    ${dereferenceQuery.construct}
  }
  WHERE {
    ${filterWhereQuery}
    ?containerUri ldp:contains ?s1 .
    FILTER( ?containerUri IN (${containers.map(container => `<${container}>`).join(', ')}) ) .
    FILTER( (isIRI(?s1)) ) .
    ${searchWhereQuery}
    ${dereferenceQuery.where}
    ?s1 ?p2 ?o2 .
  }
  `;
  
  console.log('******************* SEMAPPS -> SPARQL.JS - return :', sparqljsQuery);
  console.log('******************* SEMAPPS buildSparqlQuery - return :', semappsQuery);
  
  return sparqljsQuery;
};

export default buildSparqlQuery;
