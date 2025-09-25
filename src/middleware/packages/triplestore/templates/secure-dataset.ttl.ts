export default `# Licensed under the terms of http://www.apache.org/licenses/LICENSE-2.0

PREFIX :        <#>
PREFIX fuseki:  <http://jena.apache.org/fuseki#>
PREFIX rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs:    <http://www.w3.org/2000/01/rdf-schema#>
PREFIX tdb2:    <http://jena.apache.org/2016/tdb#>
PREFIX ja:      <http://jena.hpl.hp.com/2005/11/Assembler#>
PREFIX sec:     <http://apache.org/jena/permissions/Assembler#>
PREFIX sa:      <http://semapps.org/#>
## ---------------------------------------------------------------
## Updatable TDB2 dataset with all services enabled.

<#tdb_dataset_readwrite_acl> rdf:type      tdb2:DatasetTDB2 ;
    tdb2:location "/fuseki/databases/{dataset}Acl" ;
    ##tdb2:unionDefaultGraph true ;
    .

<#tdb_dataset_readwrite> rdf:type      tdb2:DatasetTDB2 ;
    tdb2:location "/fuseki/databases/{dataset}" ;
    ##tdb2:unionDefaultGraph true ;
    .

<#tdb_dataset_readwrite_mirror> rdf:type      tdb2:DatasetTDB2 ;
    tdb2:location "/fuseki/databases/{dataset}Mirror" ;
    .

sa:baseModel rdf:type tdb2:GraphTDB ;
    tdb2:dataset <#tdb_dataset_readwrite> .

sa:mirrorModel rdf:type tdb2:GraphTDB ;
    tdb2:dataset <#tdb_dataset_readwrite_mirror> .

[] ja:loadClass    "org.apache.jena.permissions.SecuredAssembler" .
sec:Model       rdfs:subClassOf  ja:NamedModel .
sec:evaluator   rdfs:domain sec:Model ;
                rdfs:range sec:Evaluator .

sa:securedModel rdf:type sec:Model ;
    sec:baseModel sa:baseModel ;
    ja:modelName "http://semapps.org/securedModel" ;
    sec:evaluatorImpl sa:secEvaluator .

sa:unprotectedDataset rdf:type ja:RDFDataset ;
   ja:defaultGraph sa:baseModel;
   ja:namedGraph 
        [ ja:graphName      <http://semapps.org/webacl> ;
          ja:graph          sa:baseACLModel ] ;
   .

sa:secEvaluator rdf:type sec:Evaluator ;
    sec:args [  
      rdf:_1 sa:baseModel ;
	    rdf:_2 sa:baseACLModel ;
	    rdf:_3 sa:unprotectedDataset ;
    ] ;
    sec:evaluatorClass "org.semapps.jena.permissions.ShiroEvaluator" .

sa:baseACLModel rdf:type tdb2:GraphTDB ;
    tdb2:graphName <http://semapps.org/webacl> ;
    tdb2:dataset <#tdb_dataset_readwrite_acl> .

sa:securedACLModel rdf:type sec:Model ;
    sec:baseModel sa:baseACLModel ;
    ja:modelName "http://semapps.org/securedWebacl" ;
    sec:evaluatorImpl sa:secACLEvaluator .

sa:secACLEvaluator rdf:type sec:Evaluator ;
    sec:args [ 
 	    rdf:_1 sa:baseModel ;
      rdf:_2 sa:baseACLModel ;
	    rdf:_3 sa:unprotectedDataset ;
    ] ;
    sec:evaluatorClass "org.semapps.jena.permissions.ShiroEvaluator" .


sa:securedDataset rdf:type ja:RDFDataset ;
   ja:defaultGraph sa:securedModel;
   ja:namedGraph 
        [ ja:graphName      <http://semapps.org/webacl> ;
          ja:graph          sa:securedACLModel ] ;
   ja:namedGraph 
        [ ja:graphName      <http://semapps.org/mirror> ;
          ja:graph          sa:mirrorModel ] ;
   .

<#service_tdb_all> rdf:type fuseki:Service ;
    rdfs:label                      "TDB2 {dataset} Secured" ;
    fuseki:name                     "{dataset}" ;
    fuseki:serviceQuery             "query" ;
    fuseki:serviceQuery             "sparql" ;
    fuseki:serviceUpdate            "update" ;
    fuseki:serviceUpload            "upload" ;
    fuseki:serviceReadWriteGraphStore      "data" ;
    # A separate read-only graph store endpoint:
    fuseki:serviceReadGraphStore       "get" ;
    fuseki:dataset          sa:securedDataset  ;
  
    .
`;
