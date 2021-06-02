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

### Code guidelines

When coding in moleculer, it is important to always respect those rules:
* when calling the action directly from the same service `this.actions.nameOfAction(params)` it is important to add a second argument to pass the context `nameOfAction( params, { defaultCtx: ctx} );`
* when inside an action and calling another action (to another service), always use the form `ctx.call()` and not the form `this.broker.call()` as the later will lose the context.
* when you need to make a `system` call to the triplestore, you have to explicitly state it in the call, by adding an option in the 3rd arguments (2nd if using this.actions)) `{ meta: { webId:'system' } }` like this: `ctx.call('action.name',{ param }, { meta: { webId:'system' } })`
* when programming an action in moleculer, if you want to offer the user a parameter called `webId` in your `ctx.params`, then becareful of 2 points:
  * you don't need to set this param `webId: ctx.meta.webId` when you call your action from the "API action". Indeed, the webId will come automatically from the context meta.
  * in the moleculer action, you have to check if you received a webId from params, otherwise, use ctx.meta.webId. Something like `const webId = ctx.params.webId || ctx.meta.webId` and most importantly, in all your subsequent ctx.calls inside the action code, always pass this webId explicitly ! Or to other actions that take a webId in their params, or to actions that don't take a webId in their params and in this case by using the meta in 3rd argument : `ctx.call('an.action',{...myparams},{ meta: { webId} });`.

## Example of usage

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

## Security

In general it is possible to obtain the list of all resource inside a container, if the user has Read access to the container, and even if they have no accesss to the resources themselves. 

The LDP API will not show those resources though, because of the way it is implemented internally. But a SPARQL query on the apraql public endpoint will return them. It will return only the URIs of those resources. But this could still be considered a leak of some information.

The only way to eal with this problem is to uncomment line [602 of shiroEvaluator](https://github.com/assemblee-virtuelle/semapps/blob/e67f545faf55f3a6343012ab8b74878e14a7ba4c/src/jena/permissions/src/main/java/org/semapps/jena/permissions/ShiroEvaluator.java#L602) so it will check also the permissions of the Object of every triple, which we do not do for now, for performances reasons, and for compliance with the LDP protocol which deal with resources as a unit of data and ACL.

## Future

* If one day you program an action to delete a user profile, after deleting the user resource, please also call the `removeAgentGroupOrAgentFromAuthorizations` method, with a isGroup=false parameter.

* When creation of arbitrary containers at the root will be possible, please prevent the user from chosing those slugs, that must be reserved for system paths :
```
/_acl
/_groups
/_rights
```

* For perfs improvement, switch the code of ShiroEvaluator to use the Java API for querying the model, instead of SPARQL queries.

* root container https://github.com/assemblee-virtuelle/semapps/issues/429

* PATCH of a resource : do the DELETE and INSERT in one call/transaction.

* default perms for containers as a parameter in the code?

* create a system named graph to store semapps config as triples. should be protected as webacl graph (no access except by system)

* inference and groups defined in the business data model : https://github.com/assemblee-virtuelle/semapps/issues/590
in this case, how to call `removeAgentGroupOrAgentFromAuthorizations` when a group is deleted ? listen to some message ? need to configure which resource type should be listened to (Organization, Role...).
