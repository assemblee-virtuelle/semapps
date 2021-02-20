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
import java.util.Enumeration;
import java.util.Iterator;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.apache.jena.graph.Node;
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
			LOG.info( "User not authenticated as admin");
			return null;
		}

		LOG.info( "Graph: " + graphIRI);

		// cast to WebDelegatingSubject because we know the request was made from web app
		WebDelegatingSubject websubject = (WebDelegatingSubject)subject;
		ServletRequest request = (ServletRequest) websubject.getServletRequest();
		// cast to HttpServletRequest because we know the request was made via http
		HttpServletRequest httpRequest = (HttpServletRequest)request;
		String semappsUser = httpRequest.getHeader("X-SemappsUser" );
		
		// TODO : optimization: save the semappsUser in the principal, and retrieve it during following calls, to save this processing
				
		if (semappsUser == null || semappsUser.equals("system"))
		{
			LOG.info( "Header User: system");
			return "system";
		}

		LOG.info( "Header User: " + semappsUser);

		if (graphIRI != null && graphIRI.toString().equals(ACLGraphName)) {
			LOG.info( "Access denied to graph: " + graphIRI);
			return null;
		}

		return semappsUser;
	}

	/**
	 * 
	 * Used to query the Union graph of the defaultGraph and the Web ACL graph, useful for querying group membership.
	 * 
	 * @param queryString
	 * @return
	 */
	private ResultSet queryUnionGraph(String queryString) {
		Query query = QueryFactory.create(queryString);
    QueryExecution qexec = QueryExecutionFactory.create(query, unionModel);
    /*Execute the Query*/
    ResultSet results = qexec.execSelect();
    ResultSetFormatter.out(results) ;
		qexec.close();
		return results;
	}

	/**
	 * Used to query the Web ACL graph, when we do not need to query on the groups and members of groups.
	 * 
	 * @param queryString
	 * @return
	 */
	private ResultSet queryWebAclGraph(String queryString) {
		Query query = QueryFactory.create(queryString);
    QueryExecution qexec = QueryExecutionFactory.create(query, aclModel);
    /*Execute the Query*/
    ResultSet results = qexec.execSelect();
    ResultSetFormatter.out(results) ;
		qexec.close();
		return results;
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
	private boolean evaluateResource( String user, Action action, Resource r )
	{

		LOG.info( "*** evaluating resource : {} for user {}", r.toString(), user+ action.toString());

		// if (action.equals(Action.Delete)) {
		// 	LOG.info( "XXXX aborting DELETE ");
		// 	return false;
		// }
		// if (action.equals(Action.Read)) {
		// 	LOG.info( "XXXX aborting Read ");
		// 	return false;
		// }

		// TODO here check Web ACL

		String queryStr = "SELECT * { ?s ?p ?o }";
		String queryAll = "SELECT * {	{ ?s ?p ?o } UNION { GRAPH ?g { ?s ?p ?o } } }";
		
		// queryWebAclGraph(queryStr);
		// queryWebAclGraph(queryAll);
		// queryUnionGraph(queryStr);
		// queryUnionGraph(queryAll);

		return true;	
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
		// TODO : check what happens with blank nodes

		// TODO : check what to do with SecurityEvaluator.FUTURE and SecurityEvaluator.VARIABLE
		// see https://jena.apache.org/documentation/permissions/design.html
		
		// URI nodes and blank nodes are retrieved from the model and evaluated
		if (node.isURI() || node.isBlank()) {
			Resource r = model.getRDFNode( node ).asResource();
			return evaluateResource( user, action, r );
		}
		// anything else (literals) can be seen.
		return true;
	}
	
	private boolean evaluateTriple(String user, Action action, Triple triple) {

		LOG.info( "evaluateTriple action {} for triple {}", action.toString(), triple.toString());

		return evaluateNode( user, action, triple.getSubject()) &&
			     evaluateNode( user, action, triple.getObject());
	}
	
	/**
	 */
	@Override
	public boolean evaluate(Object principal, Action action, Node graphIRI, Triple triple) {
		
		LOG.info( "evaluate action {} on triple {}", action, triple);

		// we check here to see if the principal is the system and 
		// returned true since the system can perform any operation on any triple.
		// ptherwise we check the permission

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
		String retString = "";
		Iterator<Action> itrr = actions.iterator();
    while(itrr.hasNext()){
			Action action = itrr.next();
			retString = retString + action.toString() + " ";
		}
		LOG.info( "evaluate set of actions {} on triple {}", retString, triple);

		String user = checkUser(principal, graphIRI);
		if (user == null) return false;
		if (user != null && user.equals("system")) return true;

		Iterator<Action> itr = actions.iterator();
    while(itr.hasNext()){
      Action action = itr.next();
			LOG.info( "evaluated action in set " + action.toString());
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
		String retString = "";
		Iterator<Action> itrr = actions.iterator();
    while(itrr.hasNext()){
			Action action = itrr.next();
			retString = retString + action.toString() + " ";
		}
		LOG.info( "evaluateAny set of actions {} on triple {}", retString, triple);

		String user = checkUser(principal, graphIRI);
		if (user == null) return false;
		if (user != null && user.equals("system")) return true;

		Iterator<Action> itr = actions.iterator();
    while(itr.hasNext()){
      Action action = itr.next();
			LOG.info( "evaluated ANY action in set : " + action);
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
		String retString = "";
		Iterator<Action> itr = actions.iterator();
    while(itr.hasNext()){
			Action action = itr.next();
			retString = retString + action.toString() + " ";
		}
		LOG.info( "evaluate set of actions " + retString);

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

		// FOR LOG purpose only, TODO: remove
		String retString = "";
		Iterator<Action> itr = actions.iterator();
    while(itr.hasNext()){
			Action action = itr.next();
			retString = retString + action.toString() + " ";
		}
		LOG.info( "evaluateAny set of actions " + retString);

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

		LOG.info( "evaluateUpdate " + from.toString() + " TO "+to.toString());

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
