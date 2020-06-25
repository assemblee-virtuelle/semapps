---
title: Create your first LDP server
---

## Setup a new Moleculer project

You will need to have [NodeJS](https://nodejs.org/en/) installed on your computer.

First install the [moleculer-cli](https://github.com/moleculerjs/moleculer-cli) tool globally.

```bash
npm install -g moleculer-cli
```

Then initialize a new project based on this template with this command:

```bash
moleculer init assemblee-virtuelle/semapps-template-ldp my-project
```

Choose `yes` to all questions
```
? Do you need a local instance of Jena Fuseki (with Docker)? Yes
? Do you need a read-only SPARQL endpoint? Yes
Create 'semapps' folder...
? Would you like to run 'npm install'? Yes
```

You can now go to the newly-created directory:

```bash
cd my-project
```

### Launch your local Jena Fuseki instance

Jena Fuseki is a semantic triple store. It is where your app's data will be stored.

You need [docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install/) installed on your machine.

```bash
docker-compose up
```

Jena Fuseki is now available at the URL http://localhost:3030.

Please login - By default the login is `admin` and the password is also `admin`.

Please start by create a new dataset and name it `localData` (case sensitive)
Your triples will be stored there.

### Run Moleculer in dev mode

```bash
npm run dev
```

Your instance of SemApps is available at http://localhost:3000

## Testing your LDP server

By default, the LDP service will create a LDP container in the `/resources path`.

Post an ActivityStreams Note to this LDP container with a tool like [Insomnia](https://insomnia.rest/), [Postman](https://www.postman.com/downloads/) or the [RESTClient add-on for Firefox](https://addons.mozilla.org/fr/firefox/addon/restclient/).

```
POST /resources HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Accept: */*
Content-Length: 97

{
 "@context": "https://www.w3.org/ns/activitystreams",
 "type": "Note",
 "name": "Hello World"
}
```

Retrieve the `/resources` LDP container:

```
GET /resources HTTP/1.1
Host: localhost:3000
Accept: application/ld+json
```

You should get this result:

```json
{
  "@context": {
    "ldp": "http://www.w3.org/ns/ldp#",
    "as": "https://www.w3.org/ns/activitystreams#"
  },
  "@id": "http://localhost:3000/resources",
  "@type": [
    "ldp:Container",
    "ldp:BasicContainer"
  ],
  "ldp:contains": [
    {
      "@id": "http://localhost:3000/resources/db78b000",
      "@type": "as:Note",
      "as:name": "Hello World"
    }
  ]
}
```
