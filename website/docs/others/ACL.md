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

## Web interface from SPARQL queries

Fuseki offers a web interface to query your dataset [here](http://localhost:3030/dataset.html)

This interface is protected by the `admin` user and password. If you expose this web interface to a public IP, the password should be stong and the http connection should be secured with a TLS certificate.

The `localData` dataset is accessible there as if are a `system` user, and all the tuples can be queried and modified, both on the defaultGraph and on the ACL named graph `http://semapps.org/webacl`.

## Web ACL

The java class `ShiroEvaluator` is checking, for every SPARQL request, the subjet and the object of each tuple that the SPARQL engine has asked to receive from the underlying storage.
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


## Middleware

The SemApps middleware should always connect to the SPARQL endpoint with a Basic Authorization header containing the `admin` user and its password. `Authorization: Basic `and the base64 encoded username and password.

If the middleware is doing a query on behalf of a semapps user, it should send the WebID URI of this user in the HTTP header `X-SemappsUser`.

If to the contrary, the middleware is modifying the ACLs, it should send no header, or a header with the X-SemappsUser set to `system`.
