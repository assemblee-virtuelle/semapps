/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.semapps.jena.permissions;

import java.util.Set;
import java.util.Queue;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.stream.Collectors;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.apache.jena.atlas.lib.StrUtils ;
import org.apache.jena.sparql.expr.Expr;
import org.apache.jena.graph.Node;
import org.apache.jena.graph.NodeFactory;
import org.apache.jena.graph.Triple;
import org.apache.jena.permissions.SecurityEvaluator ;
import org.apache.jena.permissions.SecurityEvaluator.Action;
import org.apache.jena.rdf.model.* ;
import org.apache.jena.vocabulary.RDF ;
import org.apache.jena.query.* ;
import org.apache.jena.sparql.core.DatasetGraph;
import org.apache.shiro.SecurityUtils ;
import org.apache.shiro.subject.Subject ;
import org.apache.shiro.web.subject.support.WebDelegatingSubject ;
import org.apache.commons.collections4.map.LRUMap;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import org.slf4j.Logger ;
import org.slf4j.LoggerFactory ;


/**
 * Class to use Shiro to provide credentials.
 * 
 * An example evaluator that only provides access to messages in the graph that 
 * are from or to the principal.
 *
 */
public class ShiroEvaluator implements SecurityEvaluator {

	private static final Logger LOG = LoggerFactory.getLogger(ShiroEvaluator.class);

	private Model model;
	private Model aclModel;
	private DatasetGraph unionModel;
	private Dataset dataset;
	
	private static final String ACLGraphName = "http://semapps.org/securedWebacl";
	private static final String ACLGraphNameExternal = "http://semapps.org/webacl";

	/**
	 * 
	 * @param model The graph we are going to evaluate against.
	 */
	public ShiroEvaluator( Model model, Model aclModel, Dataset dataset )
	{
		this.model = model;
		this.aclModel = aclModel;
		this.dataset = dataset;
		this.unionModel = dataset.asDatasetGraph();
		//LOG.info( "Model: " + model);
		
	}

	/***
	 * 
	 * @param principalObj
	 * @param graphIRI
	 * @return null if the access should be denied (not logged in as admin, or trying to access the webacl graph as a semapps user),
	 *  "system" if the user is a bypass user that can access the webacl graph (access via the middleware or in the web console of fuseki),
	 *  or a string containing the semapps user otherwise.
	 */
	private String checkUser( Object principalObj, Node graphIRI ) {

		// cast to the Subject because we know that it comes from Shiro and that
		// our getPrincipal() method returns a Subject.
		Subject subject = (Subject)principalObj;
		Object principal = subject.getPrincipal();

		// subject is always authenticated with admin user. 
		if (! subject.isAuthenticated() || ! "admin".equals(principal.toString()))
		{
			// we could throw an AuthenticationRequiredException but
			// in our case we just return false.
			//LOG.info( "User not authenticated as admin");
			return null;
		}

		//LOG.info( "Graph: " + graphIRI);

		// cast to WebDelegatingSubject because we know the request was made from web app
		WebDelegatingSubject websubject = (WebDelegatingSubject)subject;
		ServletRequest request = (ServletRequest) websubject.getServletRequest();
		// cast to HttpServletRequest because we know the request was made via http
		HttpServletRequest httpRequest = (HttpServletRequest)request;
		String semappsUser = httpRequest.getHeader("X-SemappsUser" );
		
		// TODO : optimization: save the semappsUser in the principal, and retrieve it during following calls, to save this processing
				
		if (semappsUser == null || semappsUser.equals("system"))
		{
			//LOG.info( "Header User: system");
			return "system";
		}

		//LOG.info( "Header User: " + semappsUser);

		if (graphIRI != null && graphIRI.toString().equals(ACLGraphName)) {
			//LOG.info( "Access denied to graph: " + graphIRI);
			return null;
		}

		return semappsUser;
	}

	/**
	 * 
	 * Caching mechanism to store temporarly the access right for a user on a resource.
	 * the cache is emptied at every beginning of SPARQL request (we suppose)
	 * 
	 */

	private class CacheKey implements Comparable<CacheKey> {
		private final Action action;
		private final String resource;
		private final String user;
		private Integer hashCode;

		public CacheKey(final Action action, final String res, final String user) {
			this.action = action;
			this.resource = res;
			this.user = user;
		}

		@Override
		public int compareTo(final CacheKey other) {
			int retval = this.action.compareTo(other.action);
			if (retval == Expr.CMP_EQUAL) {
				retval = StrUtils.strCompare(this.user, other.user);
				if (retval == Expr.CMP_EQUAL) {
					retval = StrUtils.strCompare(this.resource, other.resource);
				}
			}
			return retval;
		}

		@Override
		public boolean equals(final Object o) {
			if (o instanceof CacheKey) {
				return this.compareTo((CacheKey) o) == 0;
			}
			return false;
		}

		@Override
		public int hashCode() {
			if (hashCode == null) {
				hashCode = new HashCodeBuilder().append(action)
						.append(user).append(resource).toHashCode();
			}
			return hashCode;
		}
	}

	// the maximum size of the cache
	public static int MAX_CACHE = 100000;
	// the cache for this thread.
	public static final ThreadLocal<LRUMap<CacheKey, Boolean>> CACHE = new ThreadLocal<>();

	/**
	 * recycle the cache.
	 */
	public static void recycleUse() {
		final LRUMap<CacheKey, Boolean> cache = ShiroEvaluator.CACHE.get();
		if (cache != null) ShiroEvaluator.CACHE.remove();
		ShiroEvaluator.CACHE.set(new LRUMap<CacheKey, Boolean>(Math.max(
				ShiroEvaluator.MAX_CACHE, 100)));
	}

		/**
	 * get the cached value.
	 * 
	 * @param key
	 *            The key to look for.
	 * @return the value of the security check or <code>null</code> if the value
	 *         has not been cached.
	 */
	private Boolean cacheGet(final CacheKey key) {
		
		final LRUMap<CacheKey, Boolean> cache = ShiroEvaluator.CACHE.get();
		//if (cache != null) System.out.println(cache.size());
		return (cache == null) ? null : (Boolean) cache.get(key);
	}

	/**
	 * set the cache value.
	 * 
	 * @param key
	 *            The key to set the value for.
	 * @param value
	 *            The value to set.
	 */
	private void cachePut(final CacheKey key, final boolean value) {
		final LRUMap<CacheKey, Boolean> cache = ShiroEvaluator.CACHE.get();
		if (cache != null) {
			cache.put(key, value);
			ShiroEvaluator.CACHE.set(cache);
		}
	}

	// TODO: once we are sure that recycleUse() is called at every beginning of transaction, we can remove the User in the CacheKey


	//private static final String AGENTCLASS_PUBLIC = "foaf:Agent";
	//private static final String AGENTCLASS_ANYUSER = "acl:AuthenticatedAgent";
	private static final String QUERY_MODE2 = "UNION { ?auth acl:mode %s }";
	private static final String QUERY_ACCESSTO = "acl:accessTo ?resource .\n";
	private static final String QUERY_DEFAULT = "acl:default ?resource .\n";

	private void prepareNss(ParameterizedSparqlString nss, String query) {
		nss.setCommandText(query);
		nss.setNsPrefix("acl", "http://www.w3.org/ns/auth/acl#");
		nss.setNsPrefix("foaf", "http://xmlns.com/foaf/0.1/");
	}

	private static final String AGENTCLASS_PUBLIC_RESOURCE_QUERY = 
	"SELECT ?auth\n" +
	"WHERE {\n" +
	"{ \n" +
	" ?auth a acl:Authorization ;\n" +
	" acl:agentClass foaf:Agent ;\n" +
	" %s" +
	"} \n" +
	"{ \n" +
	" { ?auth acl:mode %s } %s\n" +
	"} \n" +
	"}";

	private static final String AGENTCLASS_ANYUSER_RESOURCE_QUERY = 
	"SELECT ?auth\n" +
	"WHERE {\n" +
	"{ \n" +
	" ?auth a acl:Authorization ;\n" +
	" %s" +
	"} { { ?auth acl:agentClass foaf:Agent } UNION { ?auth acl:agentClass acl:AuthenticatedAgent } }\n" +
	"{ \n" +
	" { ?auth acl:mode %s } %s\n" +
	"} \n" +
	"}";

	private boolean checkACLAgentClass(RDFNode r, boolean anyUser, String mode1, String mode2, boolean forResource) {
		
		ParameterizedSparqlString query = new ParameterizedSparqlString();
		prepareNss(query, String.format(anyUser ? AGENTCLASS_ANYUSER_RESOURCE_QUERY : AGENTCLASS_PUBLIC_RESOURCE_QUERY,
																		forResource ? QUERY_ACCESSTO : QUERY_DEFAULT,
																		mode1, mode2!=null ? String.format(QUERY_MODE2, mode2) : "") );
		query.setParam("resource", r);

		//System.out.println(query.toString());
		return queryWebAclGraph(query.asQuery());
	}

	private static final String AGENT_RESOURCE_QUERY = 
	"SELECT ?auth\n" +
	"WHERE {\n" +
	"{ \n" +
	" ?auth a acl:Authorization ;\n" +
	" acl:agent ?agent ;\n" +
	" %s" +
	"} \n" +
	"{ \n" +
	" { ?auth acl:mode %s } %s\n" +
	"} \n" +
	"}";

	private boolean checkACLAgent(RDFNode r, String user, String mode1, String mode2, boolean forResource) {
		
		ParameterizedSparqlString query = new ParameterizedSparqlString();
		prepareNss(query, String.format(AGENT_RESOURCE_QUERY, 
																		forResource ? QUERY_ACCESSTO : QUERY_DEFAULT,
																		mode1, mode2!=null ? String.format(QUERY_MODE2, mode2) : "") );
		query.setParam("resource", r);
		query.setIri("agent", user);

		//System.out.println(query.toString());
		return queryWebAclGraph(query.asQuery());
	}

	private static final String USER_GROUPS_QUERY = 
  "SELECT ?group\n" +
  "WHERE {\n" +
	"{ ?group vcard:hasMember ?member . }\n" +
	"UNION { GRAPH <"+ACLGraphNameExternal+"> { ?group vcard:hasMember ?member . } }\n" +
  "UNION\n" +
  " {\n" +
  "  ?group ?anyLink ?member .\n" +
  "  ?anyLink rdfs:subPropertyOf vcard:hasMember .\n" +
  " }\n" +
  "}";

	private ArrayList<RDFNode> getUserGroupsList(String user) {

		ParameterizedSparqlString query = new ParameterizedSparqlString();
		prepareNss(query, USER_GROUPS_QUERY );
		query.setNsPrefix("vcard", "http://www.w3.org/2006/vcard/ns#");
		query.setNsPrefix("rdfs", "http://www.w3.org/2000/01/rdf-schema#");
		query.setIri("member", user);

		//System.out.println(query.toString());
		return queryUnionGraph(query.asQuery(),"group");

	}

	private static final String AGENTGROUP_RESOURCE_QUERY = 
	"SELECT ?auth\n" +
	"WHERE {\n" +
	"{ \n" +
	" ?auth a acl:Authorization ;\n" +
	" %s" +
	"} { %s } \n" +
	"{ \n" +
	" { ?auth acl:mode %s } %s\n" +
	"} \n" +
	"}";

	private static final String AGENTGROUP_RESOURCE_AGENT_SUBQUERY =  "{ ?auth acl:agentGroup <%s> }\n";

	private boolean checkACLAgentGroup(RDFNode r, ArrayList<RDFNode> groups, String mode1, String mode2, boolean forResource) {

		if (groups.size() == 0) return false;

		ParameterizedSparqlString query = new ParameterizedSparqlString();
		String groupsUnion = groups.stream().filter(g -> g.isURIResource()).map(g -> String.format(AGENTGROUP_RESOURCE_AGENT_SUBQUERY,g.toString())).collect(Collectors.joining("UNION "));
		prepareNss(query, String.format(AGENTGROUP_RESOURCE_QUERY, 
																		forResource ? QUERY_ACCESSTO : QUERY_DEFAULT,
																		groupsUnion, 
																		mode1, mode2!=null ? String.format(QUERY_MODE2, mode2) : "") );
		query.setParam("resource", r);

		//System.out.println(query.toString());
		return queryWebAclGraph(query.asQuery());

	}

	private static final String RESOURCE_CONTAINERS_QUERY = 
  "SELECT ?container\n" +
  "WHERE { ?container ldp:contains ?resource . }";

	private ArrayList<RDFNode> getResourceContainers(RDFNode r) {

		ParameterizedSparqlString query = new ParameterizedSparqlString();
		prepareNss(query, RESOURCE_CONTAINERS_QUERY );
		query.setNsPrefix("ldp", "http://www.w3.org/ns/ldp#");
		query.setParam("resource", r);

		//System.out.println(query.toString());
		return queryUnionGraph(query.asQuery(),"container");

	}


	/**
	 * 
	 * Used to query the Union graph of the defaultGraph and the Web ACL graph, useful for querying group membership and container content.
	 * 
	 * @param queryString
	 * @return a list of the nodes found, of the "var" column in the resultSet
	 */
	private ArrayList<RDFNode> queryUnionGraph(Query query, String var) {

		//Query query = QueryFactory.create(queryString);
    QueryExecution qexec = QueryExecutionFactory.create(query, unionModel);
    /*Execute the Query*/
    ResultSet results = qexec.execSelect();
		//ResultSetFormatter.out(results) ;
		ArrayList<RDFNode> nodes = new ArrayList<RDFNode>();
    while(results.hasNext()) {
			QuerySolution sol = results.next();
			nodes.add(sol.get(var));
		}
		qexec.close();
		return nodes;
	}

	/**
	 * Used to query the Web ACL graph, when we do not need to query on the groups and members of groups.
	 * 
	 * @param queryString
	 * @return a boolean if at least one result has been found
	 */
	private boolean queryWebAclGraph(Query query) {

		//Query query = QueryFactory.create(queryString);
    QueryExecution qexec = QueryExecutionFactory.create(query, aclModel);
    /*Execute the Query*/
		ResultSet results = qexec.execSelect();
		//TODO: comment out the 2 below lines. use the 3rd one instead
		//		ResultSetFormatter.out(results) ;
		//		boolean res = results.getRowNumber() > 0;
		boolean res = results.hasNext();
		
		qexec.close();
		return res;
	}

	private String getMode1(Action action) {
		switch(action) {
			case Create:
				return "acl:Append";
			case Read:
				return "acl:Read";
			case Update:
			case Delete:
				return "acl:Write";
		}
		return null;
	} 

	private String getMode2(Action action) {
		switch(action) {
			case Update:
			case Delete:
				return null;
			case Create:
			case Read:
				return "acl:Write";
		}
		return null;
	} 

	/**
	 * This is our internal check to see if the user may access the resource.
	 * A user may only access the resource if they are authenticated as admin
	 * and pass the header X-SemappsUser with value "system" 
	 * or the URI of a user with corresponding permissions.
	 * This is the check for the later case, as "system" user is already allowed
	 * at a higher level.
	 * @param principalObj
	 * @param r
	 * @return
	 */
	private boolean cachedEvaluateResource( String user, Action action, Resource r ) {

		// check Web ACL

		String mode1 = getMode1(action);
		String mode2 = getMode2(action);

		if (user.trim().equals("anon")) {

			if ( checkACLAgentClass(r, false, mode1, mode2, true ) ) return true;

			// check containers, recursively
			ArrayList<RDFNode> containers = getResourceContainers(r);
			Queue<RDFNode> queue = new LinkedList<RDFNode>();
			queue.addAll(containers);

			while (!queue.isEmpty()) {
				RDFNode container = queue.remove();

				if ( checkACLAgentClass(container, false, mode1, mode2, false ) ) return true;

				containers = getResourceContainers(container);
				queue.addAll(containers);
			}

		} else {

			if ( checkACLAgentClass(r, true, mode1, mode2, true ) ) return true;
			if ( checkACLAgent(r, user, mode1, mode2, true ) ) return true;
			ArrayList<RDFNode> groups = getUserGroupsList(user);
			if ( checkACLAgentGroup(r, groups, mode1, mode2, true ) ) return true;

			// check containers, recursively
			ArrayList<RDFNode> containers = getResourceContainers(r);
			Queue<RDFNode> queue = new LinkedList<RDFNode>();
			queue.addAll(containers);

			while (!queue.isEmpty()) {
				RDFNode container = queue.remove();

				if ( checkACLAgentClass(container, true, mode1, mode2, false ) ) return true;
				if ( checkACLAgent(container, user, mode1, mode2, false ) ) return true;
				if ( checkACLAgentGroup(container, groups, mode1, mode2, false ) ) return true;

				containers = getResourceContainers(container);
				queue.addAll(containers);
			}
		}
		return false;
	}

	private boolean evaluateResource( String user, Action action, Resource r )
	{

		//LOG.info( "*** evaluating resource : {} for user {}", r.toString(), user+ action.toString());

		// check if we have it in cache

		final CacheKey key = new CacheKey(action, r.toString(), user);
		Boolean retval = cacheGet(key);
		if (retval != null) {
			//LOG.info( "> CACHE get {}", r.toString());
			return retval;
		}

		retval = cachedEvaluateResource( user, action, r );
		cachePut(key, retval);
		//LOG.info( "CACHE PUT {}", r.toString());

		return retval;
	}

	private boolean evaluateBlankNode( String user, Action action, RDFNode node ) {

		StmtIterator it = model.listStatements(null,null, node);
		if (it.hasNext()) {
			Statement st = it.nextStatement();
			//System.out.println("the resource it is embedded in "+st.getSubject());
			if (!st.getSubject().isAnon())
				return evaluateResource( user, action, st.getSubject() );
			else {
				// recurse upward
				//System.out.println("it is another blank node ");
				return evaluateBlankNode(user, action, st.getSubject());
			}
		}		
		return false;

	}
	
	/**
	 * Check that the user can see a specific node.
	 * @param principal
	 * @param node
	 * @return
	 */
	private boolean evaluateNode( String user, Action action, Node node )
	{
		// Access to wild card is false -- this forces checks to the actual nodes
		// to be returned. Note that we arrive here only if we are not system user.
		if (node.equals( Node.ANY )) {
			return false;
		}

		// Dealing with blank nodes
		if (node.isBlank()) {
			return evaluateBlankNode( user, action, model.getRDFNode( node ) );
		}

		// see https://jena.apache.org/documentation/permissions/design.html
		if (node.equals(SecurityEvaluator.FUTURE)) return true;
		
		// URI nodes are retrieved from the model and evaluated
		if (node.isURI() ) {
			Resource r = model.getRDFNode( node ).asResource();
			return evaluateResource( user, action, r );
		}
		// anything else (literals and blank nodes) can be seen.
		return true;
	}
	
	private boolean evaluateTriple(String user, Action action, Triple triple) {

		//LOG.info( "evaluateTriple action {} for triple {}", action.toString(), triple.toString());

		// see https://jena.apache.org/documentation/permissions/design.html
		if (triple.getSubject().equals(SecurityEvaluator.VARIABLE)) {
			return true;
		}
		if (triple.getPredicate().equals(SecurityEvaluator.VARIABLE) || triple.getObject().equals(SecurityEvaluator.VARIABLE)) {
			return false;
		}

		// We only check permissions for the subject part of the tuple, because this is the definition of a Resource in LDP.
		return evaluateNode( user, action, triple.getSubject());
			     //&& evaluateNode( user, action, triple.getObject());
	}
	
	/**
	 */
	@Override
	public boolean evaluate(Object principal, Action action, Node graphIRI, Triple triple) {
		
		//LOG.info( "evaluate action {} on triple {}", action, triple);

		// we check here to see if the principal is the system and 
		// return true since the system can perform any operation on any triple.
		// otherwise we check the permission

		String user = checkUser(principal, graphIRI);
		if (user == null) return false;
		if (user != null && user.equals("system")) return true;

		return evaluateTriple(user, action, triple);
	}

	/**
	 * This is seldom called. it is implemented here as check for permission for ALL actions in the set
	 */
	@Override
	public boolean evaluate(Object principal, Set<Action> actions, Node graphIRI, Triple triple) {
		
		// FOR LOG purpose only, TODO: remove
		// String retString = "";
		// Iterator<Action> itrr = actions.iterator();
    // while(itrr.hasNext()){
		// 	Action action = itrr.next();
		// 	retString = retString + action.toString() + " ";
		// }
		//LOG.info( "evaluate set of actions {} on triple {}", retString, triple);

		String user = checkUser(principal, graphIRI);
		if (user == null) return false;
		if (user != null && user.equals("system")) return true;

		Iterator<Action> itr = actions.iterator();
    while(itr.hasNext()){
      Action action = itr.next();
			//LOG.info( "evaluated action in set " + action.toString());
			if (! evaluateTriple(user, action, triple))
				return false;
		}
		
		return true;
		
	}

	/**
	 * We force to check individual actions for SemAppsUsers
	 */
	@Override
	public boolean evaluateAny(Object principal, Set<Action> actions, Node graphIRI, Triple triple) {
		
		// FOR LOG purpose only, TODO: remove
		// String retString = "";
		// Iterator<Action> itrr = actions.iterator();
    // while(itrr.hasNext()){
		// 	Action action = itrr.next();
		// 	retString = retString + action.toString() + " ";
		// }
		//LOG.info( "evaluateAny set of actions {} on triple {}", retString, triple);

		String user = checkUser(principal, graphIRI);
		if (user == null) return false;
		if (user != null && user.equals("system")) return true;

		Iterator<Action> itr = actions.iterator();
    while(itr.hasNext()){
      Action action = itr.next();
			//LOG.info( "evaluated ANY action in set : " + action);
			if (evaluateTriple(user, action, triple))
				return true;
		}
		
		return false;

	}

	/**
	 * Note that this
	 * method is checking to see that the user may perform ALL the actions in the set on the
	 * graph.
	 */
	@Override
	public boolean evaluate(Object principal, Set<Action> actions, Node graphIRI) {

		// FOR LOG purpose only, TODO: remove
		// String retString = "";
		// Iterator<Action> itr = actions.iterator();
    // while(itr.hasNext()){
		// 	Action action = itr.next();
		// 	retString = retString + action.toString() + " ";
		// }
		// LOG.info( "evaluate set of actions " + retString);

		String user = checkUser(principal, graphIRI);
		if (user != null && user.equals("system")) return true;
		return false;

	}

	/**
	 * Called once per query, in order to check a general access right to the graph.
	 * If we always return true, then the whole graph will be queried and each triple will be
	 * checked with evaluateAny(Set<>), which is not what we want for the securedWebacl graph.
	 * securedWebacl graph should be blocked here for non-system users.
	 * The only caveat is that returning false here throws an exception in the evaluator and a
	 * 500 error is returned. sometimes with unparsable output (composed of part of some results
	 * followed by the string: Model permissions violation: http://semapps.org/securedWebacl).
	 * TODO: open a ticket with Jena-fuseki to catch the exception and return a 403 instead
	 */
	@Override
	public boolean evaluate(Object principal, Action action, Node graphIRI) {

		ShiroEvaluator.recycleUse();

		LOG.info( "evaluate action " + action);
		String user = checkUser(principal, graphIRI);
		if (user == null) return false;



		return true;
		
	}

	/**
	 * Note that this
	 * method is checking to see that the user may perform ANY of the actions in the set on the
	 * graph.
	 */
	@Override
	public boolean evaluateAny(Object principal, Set<Action> actions, Node graphIRI) {

		//FOR LOG purpose only, TODO: remove
		// String retString = "";
		// Iterator<Action> itr = actions.iterator();
    // while(itr.hasNext()){
		// 	Action action = itr.next();
		// 	retString = retString + action.toString() + " ";
		// }
		// LOG.info( "evaluateAny set of actions " + retString);

		String user = checkUser(principal, graphIRI);
		if (user != null && user.equals("system")) return true;
		return false;
	}

	/**
	 * THis seems to be called only when updating an RDF list or sequence, from a Model interface.
	 * needs to be tsted further. maybe we should convert the calls to evaluationTriple to ask for the 
	 * Actions Delete and Create respectively.
	 */
	@Override
	public boolean evaluateUpdate(Object principal, Node graphIRI, Triple from, Triple to) {

		//LOG.info( "evaluateUpdate " + from.toString() + " TO "+to.toString());

		String user = checkUser(principal, graphIRI);
		if (user == null) return false;
		if (user != null && user.equals("system")) return true;
		
		return evaluateTriple( user, Action.Update, from ) && evaluateTriple( user, Action.Update, to );
	}

	/**
	 * Return the Shiro subject.  This is the subject that Shiro currently has logged in.
	 */
	@Override
	public Object getPrincipal() {
		return SecurityUtils.getSubject();
	}

	/**
	 * Verify the Shiro subject is authenticated.
	 */
	@Override
	public boolean isPrincipalAuthenticated(Object principal) {
		if (principal instanceof Subject)
		{
			return ((Subject)principal).isAuthenticated();
		}
		return false;
	}


}
