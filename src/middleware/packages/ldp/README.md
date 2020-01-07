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
  "id": "http://localhost:3000/subject/5d80b850",
  "type": "Create",
  "object": {
    "id": "http://localhost:3000/subject/5d80b851",
    "type": "Note",
    "content": "Voilà mon premier message, très content de faire partie du fedivers !",
    "name": "Hello World",
    "published": "2019-05-28T12:12:12Z"
  },
  "published": "2019-12-31T12:02:06.549Z"
}
```

uri dans le header de retour Location

## GET Subject
http://localhost:3000/ldp/as:Note/<identifier>
Accept : application/ld+json, application/n-triples, text/turtle

## DELETE Subject
http://localhost:3000/ldp/as:Note/<identifier>
