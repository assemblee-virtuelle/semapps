---
title: ACL implementation in Jena Fuseki
---

## Initial permissions mechanism

A class called `ShiroEvaluator` contains the logic of the permissions mechanism in Jena/Fuseki/Shiro

It is an implementation of [Jena permissions mechanism](https://jena.apache.org/documentation/permissions/)

Basically the HTTP SPARQL requests made on Jena endpoint should be Authenticated with the user admin, and a special header `X-SemappsUser` should contain a string representing the URI of the currently logged in user, or the value `system` if the query should bypass any ACL (the absence of such header is also considered as a `system` access level).

The `shiro.ini` file has been slightly modified in order to force Basic Authentication on all endpoints (it was previsouly too permissive)

The Jena storage backend is now TDB2 and the Jena version is 3.17 (latest as of february 2021).

The whole `localData` dataset is protected by the Jena permission mechanism that uses the class `ShiroEvaluator` to check ACLs.
See the configuration file in `configuration/localData.ttl` for more details.

To compile this class, please refer to [this README](https://github.com/assemblee-virtuelle/semapps/blob/master/src/jena/permissions/README.md)

## Dataset, Model and Graph

A short explanation on how the Dataset is configured and why.

See the file `src/jena/fuseki-docker/configuration/localData.ttl` to follow the names given here.

We will start from the top of the application stack: what the fuseki service exposes to the endpoints and web interface. In the localData file, we start to read from the end of the file and we go up.

* the fuseki service exposes a dataset called localData (and also another similar one called testData).
* this `localData` dataset is called `securedDataset` in the config file. it is composed of 2 graphs :
  * the `defaultGraph` which is accessible if no `GRAPH` keyword is used in the SPARQL.
  * a named graph called `<http://semapps.org/webacl>` which will contain all the webACL tuples.
* the fact that those 2 graphs are joined in the same `localData` dataset enables us to query on both graph in one request. This is specially useful when we will have to retrieve the list of users that belong to a group, if the group is outside of the scope of the webacl model (if it belongs to the application model, in the defaultGraph).

Exemple of queries to access both graphs. [doc about Datasets in Jena here](https://jena.apache.org/tutorials/sparql_datasets.html)

* a query of the form `SELECT * { ?s ?p ?o }` will return only the results of the defaultGraph, without the ACL tuples, or any other named graph.
* a query of the form `SELECT * FROM <http://semapps.org/webacl> { ?s ?p ?o }` will return all the ACL tuples, and only those. The ACL graph is behaving like it is the default graph in this case.
* a query of the form `SELECT * { { ?s ?p ?o } UNION { GRAPH ?g { ?s ?p ?o } } }` will return the union of the 2 graphs. we can see that `g` gets a value only for the ACL tuples, as the defaultGraph has no graph name.
* a query of the form `SELECT * { GRAPH ?g { ?s ?p ?o } }` will return only the ACL tuples because the default graph tuples do not have a graph name.
* similarly `SELECT * { GRAPH <http://semapps.org/webacl> { ?s ?p ?o } }` will only return the ACL tuples.
* `SELECT * FROM NAMED <http://semapps.org/webacl> { ?s ?p ?o } }` will return nothing because it says we should use the named graph `webacl` WITHOUT importing it inside the default graph. The query does not mention that we should find tuples in named graphs, but instead, in the default graph. therefor the result is empty.
* the correct way to use FROM NAMED is by specifying we want to search the named graphs : `SELECT * FROM NAMED <http://semapps.org/webacl> { GRAPH ?g { ?s ?p ?o } }`

We continue the explanation of the configuration file :
* each graph in our fuseki `localData` dataset is using a secured model to access the data. the defaultGraph uses `securedModel` and the ACL graph uses `securedACLModel`.
* a model is just a wrapper on a graph, it adds few methods for list manipulations, essentially. So here we have a fuseki `Dataset` called `localData` that unites 2 logical graphs (one being the defaultGraph and the other being called `http://semapps.org/webacl`). Each logical graph is managed under the hood by a secured model. Each secured model is based on a plain TDB graph. Finally a TDB graph needs a storage definition, where the tuples eventually go into the harddisk. The storage is called DatasetTDB2 (not to be confused with the high level Dataset we talked about earlier).
* The secured models get a name of their own, but this name is just used for internal things (and appears in the Java code of the evaluator), but you cannot query those graph names. the names of the 2  secured models are `http://semapps.org/securedModel` and `http://semapps.org/securedWebacl`. Each secured model is configured with a security evaluator which is the configuration for the instanciation of our `ShiroEvaluator` class. You can see that it gets 3 arguments when it is initialized. Those arguments are pointers to 2 graphs and one dataset used by the evaluator to make queries. The 2 graphs are the "plain TDB graph", unprotected, that contain the tuples of the defaultGraph and of the ACL graph (the defaultGraph will probably not be used from the evaluator, but i pass it nevertheless). The dataset that is passed as 3rd argument is a special dataset that we build here only for the sake of passing it to the evaluator. It is an unprotected dataset that is the UNION of the 2 graphs (defaultGraph and ACL graph) so we can query the ACL tuples, together with the group tuples that are stored in the defaultGraph. This unprotected dataset is not exposed to the fuseki endpoints and cannot be queried from anywhere else.
* finally we can see that the 2 plain TDB graphs that hold our tuples are stored in 2 separate locations on the disk. the tuples of the WebACL go to the database called `aclData` while the tuples of the defaultGraph go to the database `localData`. Initially I tried to have both graphs stored in the same database. When we remove the security layers (the secured models and their evaluators), Jena accepts to store the 2 graphs in the same database. But there is a bug related to the transaction that is not propagated down the chain of wrapping of models and graphs, and it breaks Jena. [this bug report sees to be of interest](https://issues.apache.org/jira/browse/JENA-1492) but it concerns the use of a reasoner, not of a security evaluator. The bug has been fixed 2 years ago, but I suspect the wrapping of models and graphs in the SecuredAssembler is not done well, and the transaction is not forwarded down the line. [Here is a SO post that confirms that several named graphs and a defaultGraph could all be stored on the same database/DatasetTDB](https://stackoverflow.com/questions/35428064/reasoning-with-fuseki-tdb-and-named-graphs). But in our case, there is this problem of `TransactionException: Not in a transaction` ! So for the moment, the 2 graphs are stored in 2 separate databases.
* please note that if you use additional named graphs in your system, they will be automatically created by Jena on the fly, and they will therefor be "in memory" graphs, hence, not persisted. Furthermore, they will not have any security or ACL enforcement mechanism. If you need to have some business related named graphs, you will have to add them in the localData.ttl configuration file, pretty much like the ACL graph has been added, and for the reason explained above, they will be stored in a separate database each. That does not prevent them from being accessed under the same `localData` endpoint !

If the end-user adds some ACL tuples in the defaultGraph (via the sparql endpoint offered by the middleware, or as admin in the web interface of jena) then those ACL tuples will just be useless. We never use the defaultGraph to read out ACLs. This way, there is no way to inject malicious ACL tuples in our permission system.

## Web interface for SPARQL queries

Fuseki offers a web interface to query your dataset [here](http://localhost:3030/dataset.html)

This interface is protected by the `admin` user and password. If you expose this web interface to a public IP, the password should be stong and the http connection should be secured with a TLS certificate.

The `localData` dataset is accessible there as if are a `system` user, and all the tuples can be queried and modified, both on the defaultGraph and on the ACL named graph `http://semapps.org/webacl`.

## Web ACL

The java class `ShiroEvaluator` is checking, for every SPARQL request, the subject of each tuple that the SPARQL engine has asked to receive from the underlying storage.
It also prevents a SemAppsUser from accessing the ACL graph.

Implementation of the [ Web ACL specs](https://github.com/solid/web-access-control-spec) in Java.

We chose to implement the algorithm with a succession of small steps and SPARQL queries.
Indeed, at any moment, the algorithm can stop if it finds a matching permission. There is no need then to continue processing all the other cases, and we save some processing time.
Implementing a big and unique SPARQL query that would contain all the cases would be unrealistic, and not efficient.

Having a fine-grained set of small SPARQL queries is more efficient also because we can chose to which graph each part should query. Most of the queries are done on the webACL graph. We use the defaultGraph only in 2 occasions: to fetch the group members and the containers.

The algorithm proceeds like follow:
* checks permissions on the Ressource itself
* checks permissions on the containers of that Ressource
* checks permissions on all the parent containers in a recursive way.

For each step, we have 2 cases:
* the user is anonymous, in which case we need to check for a `acl:AgentClass` with value `foaf:Agent`
* the user is a well known WEBID, in this case we need to check :
  * `acl:AgentClass` with value `foaf:Agent` (public access)
  * `acl:AgentClass` with value `acl:AuthenticatedAgent` (all knwon registered users access)
  * `acl:Agent` with the user's webID
  * `acl:agentGroup` with each of the groups the user belongs to (we retrieve the list separately, so we can reuse it later on, for the containers)

For the access Modes, here is the corresponding table between JENA access types and WebACL. `mode2` is an additional, complementary, optional mode that needs to be checked, in some cases.
JENA | WebACL mode1 | WebACL mode2
--- | --- | ---
Create | Append | Write
Read | Read | Write
Update | Write |
Delete | Write | 

The evaluator stores in a cache the access control result that it finds for each ressource. The cache is used for subsequent evaluate calls within the same transaction/SPARQL request. Then the cache is emptied before the next query. 

Blank nodes that are not part of a resource, meaning, orphan blanks nodes that linger at the root of the graph, can be created with Sparql, but cannot be retrieved afterwards. This is because the security mechanism cannot find the resource they belong to, and therefor, it denies access to it.

## Tests

Some unit tests have been setup up for the ACL mechanism. 

In order for the test to work properly, you need to first load 2 files into Jena `testData` dataset:
* file `src/middleware/tests/fusekiAcl/testData.ttl`
* file `src/middleware/tests/fusekiAcl/ACL_test_data.ttl`

use this command in order to load the testData file:
```
$FUSEKI_HOME/tdbloader --loc=$FUSEKI_BASE/databases/testData testData.ttl
```

For the file `ACL_test_data.ttl` the easiest is to go to the web interface of fuseki, enter your the username admin and password, got to the dataset `testData` and enter the endpoint `/testData/update`. Then copy paste the content of the ACL_test_data.ttl into the textarea for the query, and press the play button.

To run the tests, go to `src/middleware/tests/`.
launch the command
```
npm test -- --testPathPattern=src/middleware/tests/fusekiAcl
```

During the test, if you encounter problems with the running port of Fuseki or username and password, please change values in `src/middleware/tests/.env`

TODO: test membership of groups that are in the defaultGraph (with inference of `rdfs:subPropertyOf vcard:hasMember`).

## Middleware

The SemApps middleware should always connect to the SPARQL endpoint with a Basic Authorization header containing the `admin` user and its password. `Authorization: Basic `and the base64 encoded username and password.

If the middleware is doing a query on behalf of a semapps user, it should send the WebID URI of this user in the HTTP header `X-SemappsUser`. If no user is logged-in and the middleware is making a request as a public, anonymous user, then the `X-SemappsUser` header should be sent with the value `anon`.

If to the contrary, the middleware is modifying the ACLs, it should send no header, or a header with the X-SemappsUser set to `system`.

### Code guidelines

When coding in moleculer, it is important to always respect those rules:
* when calling the action directly from the same service `this.actions.nameOfAction(params)` it is important to add a second argument to pass the context `nameOfAction( params, { defaultCtx: ctx} );`
* when inside an action and calling another action (to another service), always use the form `ctx.call()` and not the form `this.broker.call()` as the later will lose the context.
* when you need to make a `system` call to the triplestore, you have to explicitly state it in the call, by adding an option in the 3rd arguments (2nd if using this.actions)) `{ meta: { webId:'system' } }` like this: `ctx.call('action.name',{ param }, { meta: { webId:'system' } })`
* when programming an action in moleculer, if you want to offer the user a parameter called `webId` in your `ctx.params`, then becareful of 2 points:
  * you don't need to set this param `webId: ctx.meta.webId` when you call your action from the "API action". Indeed, the webId will come automatically from the context meta.
  * in the moleculer action, you have to check if you received a webId from params, otherwise, use ctx.meta.webId. Something like `const webId = ctx.params.webId || ctx.meta.webId` and most importantly, in all your subsequent ctx.calls inside the action code, always pass this webId explicitly ! Or to other actions that take a webId in their params, or to actions that don't take a webId in their params and in this case by using the meta in 3rd argument : `ctx.call('an.action',{...myparams},{ meta: { webId} });`.

## APIs

### webacl.resource.hasRights

Checks if a user (or the logged-in user) has some rights on a resource.

This API is available as an action or via HTTP.

returns a JSON object containing some of the properties :
```
{
  read: boolean,
  write: boolean,
  append: boolean,
  control: boolean
}
```

* `GET /_rights/slug/of/container/or/resource` will return all the above properties
* `POST /_rights/slug/of/container/or/resource` without a JSON body with return all the above properties. with a JSON body of this form it will return only the rights you asked for:
```
{
  rights: {
    read: true,
    write: true,
    append: true,
    control: true
  }
}
```

### webacl.resource.getRights

If the user has Control permission on the resource, it will return all the permissions on that resource.

If the user doesn't have Control permission, it will return only the permissions related to the specific user that is doing the request.

This API is available as an action or via HTTP.

* `GET /_acl/slug/of/container/or/resource`

can have an `Accept` header set to `application/ld+json` or `text/turtle`. The default is the later one.

Will return the permissions grouped by the Authorization node they belong to.

Each resource can have up to 4 Authorization nodes : `#Read` `#Write` `#Append` `#Control`. Each one contains the Agents, AgentClass, and/or AgentGroup that have the permission on the resource. In turtle, the `#` appears as a semi-colon `:`.

Containers that define some default permissions for their contained resources will can have up to 4 additional Authorization nodes : `#DefaultRead` `#DefaultWrite` `#DefaultAppend` `#DefaultControl` that list the default permissions for that container.

If their exist some additional permissions on the resource/container, that are inherited from a parent container, they will be displayed too at the end of the file, with Authorization nodes that have an id/URI that is fully-qualified, meaning it contains the full URI of the parent container, followed by `#Default...`. Likewise, you can distinguish between the default permissions that concern the container you queried the ACL for, and the default permissions that are inherited.

An exemple:
The user `https://data.virtual-assembly.org/users/sebastien.rosset` is member of the group `http://localhost:3000/_groups/group4`.

The resource `http://localhost:3000/organizations/cheznous` is located, among others, in the container `http://localhost:3000/container28/` which itself is inside the parent container `http://localhost:3000/container29/`.

Because the `group4` has been granted `Read` permission to the `container29`, and because the user `sebastien.rosset` has been granted an individual `Write` permission on the resource `organizations/cheznous`, the following reply is given to this API call for this resource :

In Turtle:
```
@prefix acl: <http://www.w3.org/ns/auth/acl#>.
@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix : <http://localhost:3000/_acl/organizations/cheznous#>.

:Write a acl:Authorization;
    acl:accessTo <http://localhost:3000/organizations/cheznous>;
    acl:mode acl:Write;
    acl:agent <https://data.virtual-assembly.org/users/sebastien.rosset>.

<http://localhost:3000/_acl/container29#DefaultRead> a acl:Authorization;
    acl:mode acl:Read;
    acl:default <http://localhost:3000/container29>;
    acl:agentGroup <http://localhost:3000/_groups/group4>.
```

In JSON-LD:
```
{
    "@context": {
        "acl": "http://www.w3.org/ns/auth/acl#",
        "foaf": "http://xmlns.com/foaf/0.1/",
        "@base": "http://localhost:3000/_acl/organizations/cheznous"
    },
    "@graph": [
        {
            "@id": "#Write",
            "@type": "acl:Authorization",
            "acl:accessTo": "http://localhost:3000/organizations/cheznous",
            "acl:agent": "https://data.virtual-assembly.org/users/sebastien.rosset",
            "acl:mode": "acl:Write"
        },
        {
            "@id": "http://localhost:3000/_acl/container29/#DefaultRead",
            "@type": "acl:Authorization",
            "acl:agentGroup": "http://localhost:3000/_groups/group4",
            "acl:default": "http://localhost:3000/container29",
            "acl:mode": "acl:Read"
        }
    ]
}
```

Furthermore, it happens that the same user has `Control` permission on the `container29`, if we ask for the permissions on that container, this is what we will get:

```
@prefix acl: <http://www.w3.org/ns/auth/acl#>.
@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix : <http://localhost:3000/_acl/container29#>.

:Control a acl:Authorization;
    acl:accessTo <http://localhost:3000/container29>;
    acl:mode acl:Control;
    acl:agent <https://data.virtual-assembly.org/users/sebastien.rosset>.

:DefaultRead a acl:Authorization;
    acl:mode acl:Read;
    acl:agentGroup <http://localhost:3000/_groups/group4>;
    acl:default <http://localhost:3000/container29>.
```

Only a user that has `Control` access to a container, can see the `Default{Read,Write,Append,Control}` Authorization nodes of that container.

### webacl.resource.addRights

Adds some permissions to a resource. Only available if the user has Control access to the ressource.

This API is available as an action or via HTTP.

* `PATCH /_acl/slug/of/container/or/resource` with a body containing the permissions to add.
THe format can be `text/turtle` or `application/ld+json`. Set the `Content-Type` header accordingly.

This action does not take into account the `acl:mode` nor `acl:default` tuples that are sent. The only important part is the beginning of the node `:Read` or `"@id":"#Read"` in jsonLD. Likewise, the `acl:accessTo` and `acl:default` tuples are not taken into account neather. The presence of the keyword `Default` at the beginning of the node is what decides if we are adding an accessTo or a default permission.

Becareful, the `@base` or `@prefix` in turtle is important, it needs to match the resource URL you are modifying with this action.

Please note that the URI of the `@base` or `@prefix` should not include a trailing slash / . Except for the root container !

Hence, all resources should be modified with a `"@base": "http://server.com/_acl/path/of/resource"` in JSON-LD or `@prefix : <http://server.com/_acl/path/of/resource#>.` in turtle.

But the root container has to be accessed as follow : `"@base": "http://server.com/_acl/"` or `@prefix : <http://server.com/_acl/#>.`

* call `addRights` as a moleculer action in middleware. In this case, use the parameter `additionalRights` with a format as below :
```
{
  anon: {
    read: boolean,
    write: boolean,
    append: boolean,
    control: boolean,
  },
  anyUser: {
    read: boolean,
    write: boolean,
    append: boolean,
    control: boolean,
  },
  user: {
    uri: '<URI of user>'
    read: boolean
    write: boolean
    append: boolean
    control: boolean
  },
  group: {
    uri: '<URI of group>'
    read: boolean
    write: boolean
    append: boolean
    control: boolean
  },
  default : { // this is only possible on a container.
    anon : { ... same as above },
    anyUser : { ... same as above },
    user : { ... same as above },
    group : { ... same as above },
  }
}
```

This can only process one user and/or group at a time. repeat the call if you need to add permissions for several users or groups. Note that this limitation is not present in the `PATCH` HTTP method, but only if you call the action from moleculer. 

### webacl.resource.setRights

Changes the permissions of a resource so they become like in the document that is sent by the user. Only available if the user has Control access to the ressource.

This API is available as an action or via HTTP.

* `PUT /_acl/slug/of/container/or/resource` with a body containing the new permissions of this resource.
THe format can be `text/turtle` or `application/ld+json`. Set the `Content-Type` header accordingly.

The former permissions that are not present in the document will be removed.
The new permissions will be added.

The same rules as for `addRights` apply, regarding the format of the HTTP payload. This action can hardy be called from middleware.


## ACL groups

