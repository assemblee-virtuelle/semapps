# test
## GET Class Container
http://localhost:3000/ldp/as:Note

Accept : application/ld+json, application/n-triples, text/turtle

## POST
http://localhost:3000/ldp/as:Note

Content-Type : application/ld+json

```javascript
{
 "@context": "https://www.w3.org/ns/activitystreams",
 "type": "Note",
 "name": "Hello World",
 "content": "Voilà mon premier message, très content de faire partie du fedivers !",
 "published": "2019-05-28T12:12:12Z"
}
```

uri dans le header de retour Location

## GET Resource
http://localhost:3000/ldp/as:Note/[identifier]

Accept : application/ld+json, application/n-triples, text/turtle

## DELETE Resource
http://localhost:3000/ldp/as:Note/[identifier]
