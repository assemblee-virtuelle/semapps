---
title: init & configure your project
---



## Purpose

initialize and configure your semapps application

- create semantic data base
- create server
- create interface
- configure environment variables
- configure ontologies, context, resources, etc.

## summary

<table>
  <tr>
    <th>&nbsp;</th>
    <th><div>minimal&nbsp;stack</div><div>+simple</div><div>-automate</div></th>
    <th><div>make&nbsp;+&nbsp;docker</div><div>-simple</div><div>+automate</div></th>
    <th><div>semapps&nbsp;workbench</div><div>+simple</div><div>+automate</div></th>
  </tr>
  <tr>
    <td>init a Project</td>
    <td><a>lien</a></td>
    <td><a>lien</a></td>
    <td><a>lien</a></td>
  </tr>
</table>

## create semantic data base, server and interfaces
SemApps architecture is based on three layers
- **Triplestore / DB** : fuseki + jena
- **Middleware / server** : nodejs and moleculer micro-services
- **Interface / client** : you can develop in technology tou want but SemApps provide components tu easy build REACT-admin application ou application based on redux.

Interface layer depend on Middleware layer. Middleware Layer depend on Triplestore layer.

[create your application in minimal stack](./init_minimal#create)

[create your application in docker stack](./init_docker#create)

[create your application in semapps workbench stack](./init_docker#create)

## environnement configuration

three layers low-level configuration is based on environnement variables.
Most of them are required
- to connect layers betwen them
- provide security variables

CAUTION : security variables must never appear on public repository. Variables that connect layers are less critical but it is better to not publish on on public repository.

Variables list :

<table>
  <tr>
    <th>layer</th>
    <th>variable</th>
    <th>usage</th>
  </tr>
  <tr>
    <td>interface / client</td>
    <td>REACT_APP_MIDDLEWARE_URL</td>
    <td>server url. interface use it to connect to middleware</td>
  </tr>
  <tr>
    <td>interface / client</td>
    <td>PORT</td>
    <td>port used to acces to interface on a browser</td>
  </tr>
  <tr>
    <td>middlware / server</td>
    <td>SEMAPPS_HOME_URL</td>
    <td>middlware url. server have to know interface use it to connect whith middleware</td>
  </tr>
  <tr>
    <td>middlware / server</td>
    <td>SEMAPPS_SPARQL_ENDPOINT</td>
    <td>triplestore url. middleware use it to connect to triplestore </td>
  </tr>
  <tr>
    <td>middlware / server</td>
    <td>SEMAPPS_MAIN_DATASET</td>
    <td>triplestore url. middleware use it to select dataset used in triplestore</td>
  </tr>
  <tr>
    <td>middlware / server</td>
    <td>SEMAPPS_JENA_USER & SEMAPPS_JENA_PASSWORD</td>
    <td>triplestore url. middleware use it to connect to triplestore </td>
  </tr>
  <tr>
    <td>tripletore / db</td>
    <td>ADMIN_PASSWORD</td>
    <td>Fuseki provide admin default acount (login : admin) but you have to set its password  </td>
  </tr>
</table>

## server configuration
- /ontologies.json
  - usage : list of used ontologies (must be identical to the client)
  ```javascript  
  [
    {
      "prefix": "pair",// prefix à utiliser pour les classes et les properties pour les serialisation json-ld e les prefix sparql
      "owl": "http://virtual-assembly.org/ontologies/pair/ontology.ttl",// adresse qui fourni un fichier ttl ou rdf qui décrit l'ontologie
      "url": "http://virtual-assembly.org/ontologies/pair#"// namespace complet à utiliser pour le stockage sémantque
    }
  ]
  ```

## interface configuration
- /config/ontologies.json
  - usage : the list of ontologies used by the client. must be identical to the server. See /ontologies.json on the server below
- /config/ressources.json
  - the resources (container+class) used by the client
  ```javascript  
  [
    RessourceName: {
      types: ['prefix:Class'],// Class affect to this Ressource
      containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'containerName', // url of the container which manage this ressource
      slugField: '?'
    }
  ]
  ```
  - default value
  ```javascript  
  [
    User: {
      types: ['foaf:Person'],
      containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'persons',
      slugField: ['foaf:name', 'foaf:familyName']
    }
  ]
  ```
- /resources
  - usage : directory which contains the "screens" of the resources to display/modify. These screens are to be imported from App.js. See REACT-Admin.
