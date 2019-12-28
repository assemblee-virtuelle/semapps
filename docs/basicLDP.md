# Basic Container
Ces Containers sont tres smple mais leur syntaxe impose de modifier l'ontologie métier si ils sont utilisé pour contenir la relation entre 2 ressource. et sont donc a éviter pour ce cas la. Il font par contre de parfait container "généraux" manipuler des ressources.

## un BasicContainer par classe
Pour se rapprocher des API classiques REST il est interessant d'introduire la nature de la ressource dans le path. La nature d'une ressource en web sémantique est ``@type``.
Deux ontologies peuvent contenir la même classe mais elle ne sont pas forcement équivalente.

### Problématique des classes multiples
Une ressource peut avoir plusieurs types. Comment gérer ce cas? La même ressource serait retournée par ``/as:event`` et ``/schema:event``, ce qui n'est pas forcément un problème. Mais quel API utiliser en POST pour créer un objet dans ce cas là?

Solution:
Lors du POST, le client choisi le container "principal", et l'URI correspondra naturellement. S'il poste un événement dans ``as:event``, l'ID de la ressource sera ``as:event/{id}``. La ressource peut être définie par différents types sans que cela pose probleme. Les différents container de chaque ``@type`` fournirons la ressource.

### Contrôle de type
Le serveur doit contrôler que la ressource est bien du type du container si ce type sont précisé.

### Alias de path
Le service LDP doit être configurable pour pouvoir spécifier des alias pour éviter d'avoir à utiliser toujours des path automatiques type ``/{ontology}:class``.

Exemple de paramètre à passer au service LDP:
```js
{
  "https://www.w3.org/ns/activitystreams#Document": "/document",
  "https://www.w3.org/ns/activitystreams#Image": "/image",
  "http://www.w3.org/ns/ldp#BasicContainer": "/container"
}
```
Seuls les containers définis dans l'objet de mapping seront alors pris en compte.

### READ one
``GET /{ontology}:{class}/{resourceId}``

### READ many
``GET /{ontology}:{class}``
``GET /container/{containerId}`` (pour les containers persistés)
### CREATE one
``POST /{ontology}:{class}`` (ex : ``POST /pair:Organization``)
``POST /container/{containerId}`` (pour les containers persistés)
### UPDATE one
``PUT /{ontology}:{class}/{resourceId}``
``PATCH /{ontology}:{class}/{resourceId}``

### DELETE one
``DELETE /{ontology}:{class}/{resourceId}``

### SEARCH many
``GET /sparql + body avec la requete`` (comme jena mais en get et pas en post)
