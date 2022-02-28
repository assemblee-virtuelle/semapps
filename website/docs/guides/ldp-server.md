---
title: Create your first LDP server
---
### Purpose

LDP means Linked Data Platform. It is a W3C Recommendation that defines a set of rules for HTTP operations on web resources to provide an architecture for read-write Linked Data on the web.

An LDP server is therefore useful for making HTTP requests to a semantic database (in which the Linked Data is stored) without operating directly on the database.

In this guide, you will :
- Create a **semapps instance** from a template using moleculer;
- Create a **Jena Fuseki instance** to store some data;
- **Add data** to your semantic data base **using your LDP server**.


### Prerequisites

You need to have [NodeJS](https://nodejs.org/en/) installed on your computer (**use NodeJS version 12**).

You also need [docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install/) installed on your machine.

## Setup a new Moleculer project

### Moleculer

[Moleculer](https://moleculer.services/) is a back-end framework that facilitates the development of microservices that run by messages (and on different servers). It uses Node.js.

The [moleculer-cli](https://github.com/moleculerjs/moleculer-cli) tool is a command line tool that allows you to initialize new projects from templates for instance.

First, you need to install the moleculer-cli tool globally. 
To do so, open a terminal and runs the following command:

```bash
npm install -g moleculer-cli
```

Then, initialize a new project based on a semapps template with this command:

```bash
moleculer init assemblee-virtuelle/semapps-template-ldp my-project
```

Choose `yes` to all questions (except maybe for webACL)
```
? Do you need a local instance of Jena Fuseki (with Docker)? Yes
? Do you need a read-only SPARQL endpoint? Yes
? Do you need webACL (WAC) service and Fuseki support? No
Create 'my-project' folder...
? Would you like to run 'npm install'? Yes

Running 'npm install'...
```

You can now go to the newly-created directory:

```bash
cd my-project
```

### Launch your local Jena Fuseki instance

Jena Fuseki is a semantic triple store. It is where your app's data will be stored.

In the "my-project" directory, runs the following command :
```bash
docker-compose up
```

:::note
If you get this error message:
```
ERROR: Couldn't connect to Docker daemon at http+docker://localhost - is it running?
If it's at a non-standard location, specify the URL with the DOCKER_HOST environment variable.
```
Run the following command ([taken from here](https://stackoverflow.com/questions/34532696/docker-compose-cant-connect-to-docker-daemon)):
```
sudo chown $USER /var/run/docker.sock
```
:::

Jena Fuseki is now available at the URL http://localhost:3030.

Please login - By default the login is `admin` and the password is also `admin`.

Please start by create a new dataset and name it `localData` (case sensitive), and choose a persistant storage.
Your triples will be stored there.

You should get something like this:

![](ldp_resources/jenafuseki_localData.jpg)

### Run Moleculer in dev mode

Now that your semantic data base is ready, you can **launch you LDP server**, which has been created when you've initialized your semapps instance.

To do so, open an other terminal and run the following command in your my-project directory:

```bash
npm run dev
```

If you have selected the `webAcl` option above, then you will need to configure the OIDC provider by entering these variables in the file `.env.local` at the root folder of your project.

```
SEMAPPS_OIDC_ISSUER=
SEMAPPS_OIDC_CLIENT_ID=
SEMAPPS_OIDC_CLIENT_SECRET=
SEMAPPS_OIDC_PUBLIC_KEY=
```

Your instance of SemApps is available at http://localhost:3000.

You should get something like this:

```
{"@context":"http://localhost:3000/context.json","id":"http://localhost:3000/","type":["ldp:Container","ldp:BasicContainer"],"ldp:contains":[]}
```

## Testing your LDP server

Now, it is time to test your LDP server, which means that you will try to update your data base by using this LDP server and not by using Jena Fuseki.

By default, the LDP service will create a LDP container in the `/users` path. Indeed, if you go to http://localhost:3000/users, you should see this LDP container:

```
{"@context":"http://localhost:3000/context.json","id":"http://localhost:3000/users","type":["ldp:Container","ldp:BasicContainer"],"ldp:contains":[]}
```

### Add data with the LDP server

Now, let's try to add a person to our database. Post an ActivityStreams Note to this LDP container with a tool like [Insomnia](https://insomnia.rest/), [Postman](https://www.postman.com/downloads/) or the [RESTClient add-on for Firefox](https://addons.mozilla.org/fr/firefox/addon/restclient/).

```
POST /users HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Accept: */*
Content-Length: 97

{
 "@context": "https://www.w3.org/ns/activitystreams",
  "type": "Person",
  "name": "Guillaume Cousin"
}
```

Retrieve the `/users` LDP container:

```
GET /users HTTP/1.1
Host: localhost:3000
Accept: application/ld+json
```

You should get this result:

```json
{
  "@context": "http://localhost:3000/context.json",
  "@id": "http://localhost:3000/users",
  "@type": [
    "ldp:Container",
    "ldp:BasicContainer"
  ],
  "ldp:contains": [
    {
      "@id": "http://localhost:3000/users/603288b18391d7738ebba0fe",
      "@type": "Person",
      "name": "Guillaume Cousin"
    }
  ]
}
```

If you had selected the `webAcl` option earlier when creating your project, then you will get instead `403 Forbidden` error.

This is normal because your dataset is protected and you must log-in before your can edit or add any data.

For that, you will have to configure an OIDC provider, add your user webId to the list of superAdmins (in `services/webacl.service.js`), and modify the ACLs of the users container. But this is out of scope of this tutorial.

For a shortcut, you can manually add a permission to the `users` container, so that `anonymous` users can add new users to it.

In order to achieve that, you have to connect to the web interface of fuseki a [http://localhost:3030](http://localhost:3030) and run this query on the `/localData/update` endpoint :

```
INSERT DATA {
  GRAPH <http://semapps.org/webacl> {
    <http://localhost:3000/_acl/users#Write> <http://www.w3.org/ns/auth/acl#agentClass> <http://xmlns.com/foaf/0.1/Agent> .
  }
}
```

You will then be allowed to run the `POST /users` query stated above.

Please note that you just opened a security hole in your instance by allowing any anonymous user with write access to the `users` container. After you performed your first test, you should remove the triple you just created in the webacl graph (use the snippet below), and configure properly your OIDC provider and superAdmins list.

```
DELETE DATA {
  GRAPH <http://semapps.org/webacl> {
    <http://localhost:3000/_acl/users#Write> <http://www.w3.org/ns/auth/acl#agentClass> <http://xmlns.com/foaf/0.1/Agent> .
  }
}
```

### Changes on Jena Fuseki

To test if our LDP server is really working, you should check if the data has been added to our Jena Fuseki instance.

Go to http://localhost:3030/dataset.html and make a SPARQL query to get all of your data. You should get the following result:

![](ldp_resources/query_result.jpg)

Guillaume Cousin has been added to the database : the LDP server works!
