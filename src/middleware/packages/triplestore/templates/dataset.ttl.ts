export default `@prefix :      <http://base/#> .
@prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix tdb2:  <http://jena.apache.org/2016/tdb#> .
@prefix ja:    <http://jena.hpl.hp.com/2005/11/Assembler#> .
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix fuseki: <http://jena.apache.org/fuseki#> .

tdb2:DatasetTDB  rdfs:subClassOf  ja:RDFDataset .

ja:DatasetTxnMem  rdfs:subClassOf  ja:RDFDataset .

<http://jena.hpl.hp.com/2008/tdb#DatasetTDB>
        rdfs:subClassOf  ja:RDFDataset .

ja:ViewGraph  rdfs:subClassOf  ja:Model .

<http://jena.hpl.hp.com/2008/tdb#GraphTDB>
        rdfs:subClassOf  ja:Model .

tdb2:GraphTDB2  rdfs:subClassOf  ja:Model .

ja:MemoryDataset  rdfs:subClassOf  ja:RDFDataset .

ja:RDFDatasetZero  rdfs:subClassOf  ja:RDFDataset .

<http://jena.apache.org/text#TextDataset>
        rdfs:subClassOf  ja:RDFDataset .

:service_tdb_all  a                   fuseki:Service ;
        rdfs:label                    "TDB2 {dataset}" ;
        fuseki:dataset                :combinedDataset ;
        fuseki:name                   "{dataset}" ;
        fuseki:serviceQuery           "query" , "" , "sparql" ;
        fuseki:serviceReadGraphStore  "get" ;
        fuseki:serviceReadWriteGraphStore
                "data" ;
        fuseki:serviceUpdate          "" , "update" ;
        fuseki:serviceUpload          "upload" .

:tdb_dataset_readwrite
        a              tdb2:DatasetTDB2 ;
        tdb2:location  "/fuseki/databases/{dataset}" .

:baseModel rdf:type tdb2:GraphTDB ;
    tdb2:dataset :tdb_dataset_readwrite.

:mirrorModel rdf:type tdb2:GraphTDB ;
    tdb2:graphName <http://semapps.org/mirror> ;
    tdb2:dataset :tdb_dataset_readwrite.

:combinedDataset rdf:type ja:RDFDataset ;
   ja:defaultGraph :baseModel;
   ja:namedGraph 
        [ ja:graphName      <http://semapps.org/mirror> ;
          ja:graph          :mirrorModel ] ;
   .

tdb2:GraphTDB  rdfs:subClassOf  ja:Model .

ja:RDFDatasetOne  rdfs:subClassOf  ja:RDFDataset .

ja:RDFDatasetSink  rdfs:subClassOf  ja:RDFDataset .

tdb2:DatasetTDB2  rdfs:subClassOf  ja:RDFDataset .
`;
