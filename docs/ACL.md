# ACL implementation in Jena Fuseki

## Initial permissions mechanism

A class called `ShiroEvaluator` contains the logic of the permissions mechanism in Jena/Fuseki/Shiro

It is an implementation of [Jena permissions mechanism](https://jena.apache.org/documentation/permissions/)

Basically the HTTP SPARQL requests made on Jena endpoint should be Authenticated with the user admin, and a special header `X-SemappsUser` should contain a string representing the URI of the currently logged in user, or the value `system` if the query should bypass any ACL.

The `shiro.ini` file has been slightly modified in order to force Basic Authentication on all endpoints (it was previsouly too permissive)

The Jena storage backend is now TDB2 and the Jena version is 3.14 (latest as of february 2020).

The whole `localData` dataset is protected by the Jena permission mechanism that uses the class `ShiroEvaluator` to check ACLs.
See the configuration file in `configuration/localData.ttl` for more details.

To compile this class, please refer to [this README](../src/jena/permissions/README.ms)


## Web ACL

For now the above java class is just accepting every request, without checking real ACLs.

TODO : implement the [ Web ACL specs](https://github.com/solid/web-access-control-spec) in Java. 

