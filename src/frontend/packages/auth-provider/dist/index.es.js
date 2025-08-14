import $1obPJ$jwtdecode from "jwt-decode";
import $1obPJ$urljoin from "url-join";
import {discoveryRequest as $1obPJ$discoveryRequest, processDiscoveryResponse as $1obPJ$processDiscoveryResponse, generateRandomCodeVerifier as $1obPJ$generateRandomCodeVerifier, calculatePKCECodeChallenge as $1obPJ$calculatePKCECodeChallenge, validateAuthResponse as $1obPJ$validateAuthResponse, expectNoState as $1obPJ$expectNoState, isOAuth2Error as $1obPJ$isOAuth2Error, authorizationCodeGrantRequest as $1obPJ$authorizationCodeGrantRequest, processAuthorizationCodeOpenIDResponse as $1obPJ$processAuthorizationCodeOpenIDResponse} from "oauth4webapi";
import {jsx as $1obPJ$jsx, jsxs as $1obPJ$jsxs, Fragment as $1obPJ$Fragment} from "react/jsx-runtime";
import $1obPJ$react, {useEffect as $1obPJ$useEffect, useState as $1obPJ$useState, useCallback as $1obPJ$useCallback, useRef as $1obPJ$useRef, useMemo as $1obPJ$useMemo, forwardRef as $1obPJ$forwardRef} from "react";
import {CreateActions as $1obPJ$CreateActions, useResourceContext as $1obPJ$useResourceContext, Create as $1obPJ$Create, usePermissions as $1obPJ$usePermissions, useNotify as $1obPJ$useNotify, useRedirect as $1obPJ$useRedirect, useGetRecordId as $1obPJ$useGetRecordId, Edit as $1obPJ$Edit, useResourceDefinition as $1obPJ$useResourceDefinition, useRecordContext as $1obPJ$useRecordContext, TopToolbar as $1obPJ$TopToolbar, ListButton as $1obPJ$ListButton, ShowButton as $1obPJ$ShowButton, Button as $1obPJ$Button, useTranslate as $1obPJ$useTranslate, useGetList as $1obPJ$useGetList, useDataProvider as $1obPJ$useDataProvider, Loading as $1obPJ$Loading, Error as $1obPJ$Error, useAuthProvider as $1obPJ$useAuthProvider, Toolbar as $1obPJ$Toolbar, SaveButton as $1obPJ$SaveButton, DeleteButton as $1obPJ$DeleteButton, EditButton as $1obPJ$EditButton, List as $1obPJ$List1, CreateButton as $1obPJ$CreateButton, ExportButton as $1obPJ$ExportButton, Show as $1obPJ$Show, useLogin as $1obPJ$useLogin, useGetIdentity as $1obPJ$useGetIdentity, Form as $1obPJ$Form, useSafeSetState as $1obPJ$useSafeSetState, useLocaleState as $1obPJ$useLocaleState, TextInput as $1obPJ$TextInput, required as $1obPJ$required, minLength as $1obPJ$minLength, email as $1obPJ$email, Notification as $1obPJ$Notification, Resource as $1obPJ$Resource, useUserMenu as $1obPJ$useUserMenu, UserMenu as $1obPJ$UserMenu, Logout as $1obPJ$Logout, useGetPermissions as $1obPJ$useGetPermissions} from "react-admin";
import {useCreateContainerUri as $1obPJ$useCreateContainerUri} from "@semapps/semantic-data-provider";
import $1obPJ$muiiconsmaterialShare from "@mui/icons-material/Share";
import {Dialog as $1obPJ$Dialog, DialogTitle as $1obPJ$DialogTitle, DialogContent as $1obPJ$DialogContent, DialogActions as $1obPJ$DialogActions, TextField as $1obPJ$TextField, List as $1obPJ$List, ListItem as $1obPJ$ListItem, ListItemAvatar as $1obPJ$ListItemAvatar, Avatar as $1obPJ$Avatar, ListItemText as $1obPJ$ListItemText, ListItemSecondaryAction as $1obPJ$ListItemSecondaryAction, IconButton as $1obPJ$IconButton, Menu as $1obPJ$Menu, MenuItem as $1obPJ$MenuItem, ListItemIcon as $1obPJ$ListItemIcon, useMediaQuery as $1obPJ$useMediaQuery, DialogContentText as $1obPJ$DialogContentText, Button as $1obPJ$Button1, Card as $1obPJ$Card, Typography as $1obPJ$Typography, CardActions as $1obPJ$CardActions, Box as $1obPJ$Box, CardContent as $1obPJ$CardContent, LinearProgress as $1obPJ$LinearProgress} from "@mui/material";
import {makeStyles as $1obPJ$makeStyles, withStyles as $1obPJ$withStyles} from "tss-react/mui";
import $1obPJ$muimaterialAutocomplete from "@mui/material/Autocomplete";
import $1obPJ$muiiconsmaterialPerson from "@mui/icons-material/Person";
import {styled as $1obPJ$styled} from "@mui/system";
import $1obPJ$muiiconsmaterialEdit from "@mui/icons-material/Edit";
import $1obPJ$muiiconsmaterialCheck from "@mui/icons-material/Check";
import $1obPJ$muiiconsmaterialPublic from "@mui/icons-material/Public";
import $1obPJ$muiiconsmaterialVpnLock from "@mui/icons-material/VpnLock";
import $1obPJ$muiiconsmaterialGroup from "@mui/icons-material/Group";
import {styled as $1obPJ$styled1, useTheme as $1obPJ$useTheme} from "@mui/material/styles";
import {useNavigate as $1obPJ$useNavigate, useSearchParams as $1obPJ$useSearchParams, Link as $1obPJ$Link, useLocation as $1obPJ$useLocation} from "react-router-dom";
import $1obPJ$muiiconsmaterialLock from "@mui/icons-material/Lock";
import $1obPJ$speakingurl from "speakingurl";
import {useFormContext as $1obPJ$useFormContext} from "react-hook-form";
import {VisibilityOff as $1obPJ$VisibilityOff, Visibility as $1obPJ$Visibility} from "@mui/icons-material";
import $1obPJ$muiiconsmaterialAccountCircle from "@mui/icons-material/AccountCircle";
import $1obPJ$lodashisEqual from "lodash/isEqual";





const $ee80a6b397c7131d$export$dca4f48302963835 = (value)=>!value ? undefined : Array.isArray(value) ? value : [
        value
    ];
const $ee80a6b397c7131d$export$4450a74bced1b745 = (resourceUri)=>{
    const parsedUrl = new URL(resourceUri);
    return (0, $1obPJ$urljoin)(parsedUrl.origin, '_acl', parsedUrl.pathname);
};
const $ee80a6b397c7131d$export$4d54b642c3d13c34 = (baseUri)=>({
        '@base': baseUri,
        acl: 'http://www.w3.org/ns/auth/acl#',
        foaf: 'http://xmlns.com/foaf/0.1/',
        'acl:agent': {
            '@type': '@id'
        },
        'acl:agentGroup': {
            '@type': '@id'
        },
        'acl:agentClass': {
            '@type': '@id'
        },
        'acl:mode': {
            '@type': '@id'
        },
        'acl:accessTo': {
            '@type': '@id'
        }
    });
const $ee80a6b397c7131d$export$274217e117cdbc7b = async (dataProvider)=>{
    const dataServers = await dataProvider.getDataServers();
    const authServer = Object.values(dataServers).find((server)=>server.authServer === true);
    if (!authServer) throw new Error('Could not find a server with authServer: true. Check your dataServers config.');
    // If the server is a Pod provider, return the root URL instead of https://domain.com/user/data
    return authServer.pod ? new URL(authServer.baseUrl).origin : authServer.baseUrl;
};
const $ee80a6b397c7131d$export$1391212d75b2ee65 = async (t)=>new Promise((resolve)=>{
        setTimeout(resolve, t);
    });
const $ee80a6b397c7131d$export$bab98af026af71ac = (value)=>typeof value === 'string' && value.startsWith('http') && !/\s/g.test(value);
const $ee80a6b397c7131d$export$50ae7fb6f87de989 = (value)=>typeof value === 'string' && value.startsWith('/') && !/\s/g.test(value);


const $82adcd05a20fe158$var$AUTH_TYPE_SSO = 'sso';
const $82adcd05a20fe158$var$AUTH_TYPE_LOCAL = 'local';
const $82adcd05a20fe158$var$AUTH_TYPE_POD = 'pod';
const $82adcd05a20fe158$var$AUTH_TYPE_SOLID_OIDC = 'solid-oidc';
const $82adcd05a20fe158$var$authProvider = ({ dataProvider: dataProvider, authType: authType, allowAnonymous: allowAnonymous = true, checkUser: checkUser, checkPermissions: checkPermissions = false, clientId: clientId })=>{
    if (![
        $82adcd05a20fe158$var$AUTH_TYPE_SSO,
        $82adcd05a20fe158$var$AUTH_TYPE_LOCAL,
        $82adcd05a20fe158$var$AUTH_TYPE_POD,
        $82adcd05a20fe158$var$AUTH_TYPE_SOLID_OIDC
    ].includes(authType)) throw new Error('The authType parameter is missing from the auth provider');
    if (authType === $82adcd05a20fe158$var$AUTH_TYPE_SOLID_OIDC && !clientId) throw new Error('The clientId parameter is required for solid-oidc authentication');
    const callCheckUser = async (webId)=>{
        if (checkUser) try {
            const { json: userData } = await dataProvider.fetch(webId);
            if (!userData) throw new Error('auth.message.unable_to_fetch_user_data');
            if (checkUser(userData) === false) throw new Error('auth.message.user_not_allowed_to_login');
        } catch (e) {
            localStorage.removeItem('token');
            throw e;
        }
    };
    return {
        login: async (params)=>{
            if (authType === $82adcd05a20fe158$var$AUTH_TYPE_SOLID_OIDC) {
                let { webId: webId, issuer: issuer, redirect: redirect = '/', isSignup: isSignup = false } = params;
                if (webId && !issuer) {
                    // Find issuer from webId
                    const { json: userData } = await dataProvider.fetch(webId);
                    if (!userData) throw new Error('auth.message.unable_to_fetch_user_data');
                    if (!userData['solid:oidcIssuer']) throw new Error('auth.message.no_associated_oidc_issuer');
                    issuer = userData?.['solid:oidcIssuer'];
                }
                const as = await $1obPJ$discoveryRequest(new URL(issuer)).then((response)=>$1obPJ$processDiscoveryResponse(new URL(issuer), response)).catch(()=>{
                    throw new Error('auth.message.unreachable_auth_server');
                });
                const codeVerifier = $1obPJ$generateRandomCodeVerifier();
                const codeChallenge = await $1obPJ$calculatePKCECodeChallenge(codeVerifier);
                const codeChallengeMethod = 'S256';
                // Save to use on handleCallback method
                localStorage.setItem('code_verifier', codeVerifier);
                localStorage.setItem('redirect', redirect);
                const authorizationUrl = new URL(as.authorization_endpoint);
                authorizationUrl.searchParams.set('response_type', 'code');
                authorizationUrl.searchParams.set('client_id', clientId);
                authorizationUrl.searchParams.set('code_challenge', codeChallenge);
                authorizationUrl.searchParams.set('code_challenge_method', codeChallengeMethod);
                authorizationUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth-callback`);
                authorizationUrl.searchParams.set('scope', 'openid webid offline_access');
                authorizationUrl.searchParams.set('is_signup', isSignup);
                // @ts-expect-error TS(2322): Type 'URL' is not assignable to type '(string | Lo... Remove this comment to see the full error message
                window.location = authorizationUrl;
            } else if (authType === $82adcd05a20fe158$var$AUTH_TYPE_LOCAL) {
                const { username: username, password: password } = params;
                const authServerUrl = await (0, $ee80a6b397c7131d$export$274217e117cdbc7b)(dataProvider);
                let token, webId;
                try {
                    ({ json: { token: token, webId: webId } } = await dataProvider.fetch((0, $1obPJ$urljoin)(authServerUrl, 'auth/login'), {
                        method: 'POST',
                        body: JSON.stringify({
                            username: username.trim(),
                            password: password.trim()
                        }),
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    }));
                } catch (e) {
                    throw new Error('ra.auth.sign_in_error');
                }
                // Set token now as it is required for refreshConfig
                localStorage.setItem('token', token);
                await dataProvider.refreshConfig();
                await callCheckUser(webId);
            } else if (authType === $82adcd05a20fe158$var$AUTH_TYPE_SSO) {
                const authServerUrl = await (0, $ee80a6b397c7131d$export$274217e117cdbc7b)(dataProvider);
                let redirectUrl = `${new URL(window.location.href).origin}/login?login=true`;
                if (params.redirect) redirectUrl += `&redirect=${encodeURIComponent(params.redirect)}`;
                window.location.href = (0, $1obPJ$urljoin)(authServerUrl, `auth?redirectUrl=${encodeURIComponent(redirectUrl)}`);
            }
        },
        handleCallback: async ()=>{
            const { searchParams: searchParams } = new URL(window.location.href);
            if (authType === $82adcd05a20fe158$var$AUTH_TYPE_SOLID_OIDC) {
                // @ts-expect-error TS(2345): Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
                const issuer = new URL(searchParams.get('iss'));
                const as = await $1obPJ$discoveryRequest(issuer).then((response)=>$1obPJ$processDiscoveryResponse(issuer, response));
                const client = {
                    client_id: clientId,
                    token_endpoint_auth_method: 'none' // We don't have a client secret
                };
                const currentUrl = new URL(window.location.href);
                // @ts-expect-error TS(2345): Argument of type '{ client_id: any; token_endpoint... Remove this comment to see the full error message
                const params = $1obPJ$validateAuthResponse(as, client, currentUrl, $1obPJ$expectNoState);
                if ($1obPJ$isOAuth2Error(params)) throw new Error(`OAuth error: ${params.error} (${params.error_description})`);
                // Retrieve data set during login
                const codeVerifier = localStorage.getItem('code_verifier');
                const redirect = localStorage.getItem('redirect');
                const response = await $1obPJ$authorizationCodeGrantRequest(as, // @ts-expect-error TS(2345): Argument of type '{ client_id: any; token_endpoint... Remove this comment to see the full error message
                client, params, `${window.location.origin}/auth-callback`, codeVerifier);
                // @ts-expect-error TS(2345): Argument of type '{ client_id: any; token_endpoint... Remove this comment to see the full error message
                const result = await $1obPJ$processAuthorizationCodeOpenIDResponse(as, client, response);
                if ($1obPJ$isOAuth2Error(result)) // @ts-expect-error TS(2339): Property 'error' does not exist on type 'URLSearch... Remove this comment to see the full error message
                throw new Error(`OAuth error: ${params.error} (${params.error_description})`);
                // Until DPoP is implemented, use the ID token to log into local Pod
                // And the proxy endpoint to log into remote Pods
                localStorage.setItem('token', result.id_token);
                // Remove we don't need it anymore
                localStorage.removeItem('code_verifier');
                localStorage.removeItem('redirect');
                // Reload to ensure the dataServer config is reset
                window.location.href = redirect || '/';
            } else {
                const token = searchParams.get('token');
                if (!token) throw new Error('auth.message.no_token_returned');
                let webId;
                try {
                    ({ webId: webId } = (0, $1obPJ$jwtdecode)(token));
                } catch (e) {
                    throw new Error('auth.message.invalid_token_returned');
                }
                localStorage.setItem('token', token);
                await dataProvider.refreshConfig();
                await callCheckUser(webId);
            }
        },
        signup: async (params)=>{
            const authServerUrl = await (0, $ee80a6b397c7131d$export$274217e117cdbc7b)(dataProvider);
            if (authType === $82adcd05a20fe158$var$AUTH_TYPE_LOCAL) {
                const { username: username, email: email, password: password, domain: domain, ...profileData } = params;
                let token, webId;
                try {
                    ({ json: { token: token, webId: webId } } = await dataProvider.fetch((0, $1obPJ$urljoin)(authServerUrl, 'auth/signup'), {
                        method: 'POST',
                        body: JSON.stringify({
                            username: username?.trim(),
                            email: email.trim(),
                            password: password.trim(),
                            ...profileData
                        }),
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    }));
                } catch (e) {
                    if (e.message === 'email.already.exists') throw new Error('auth.message.user_email_exist');
                    else if (e.message === 'email.invalid') throw new Error('auth.message.user_email_invalid');
                    else if (e.message === 'username.already.exists' || e.message === 'username.reserved') throw new Error('auth.message.username_exist');
                    else if (e.message === 'username.too-short') throw new Error('auth.message.username_too_short');
                    else if (e.message === 'username.invalid') throw new Error('auth.message.username_invalid');
                    else if (e.message === 'password.too-short') throw new Error('auth.message.password_too_short');
                    else {
                        console.error(e);
                        throw new Error('auth.message.signup_error');
                    }
                }
                localStorage.setItem('token', token);
                await dataProvider.refreshConfig();
                await callCheckUser(webId);
                return webId;
            } else {
                const redirectUrl = `${new URL(window.location.href).origin}/login?login=true`;
                window.location.href = (0, $1obPJ$urljoin)(authServerUrl, `auth?redirectUrl=${encodeURIComponent(redirectUrl)}`);
            }
        },
        logout: async (params)=>{
            const { redirectUrl: redirectUrl } = params || {};
            switch(authType){
                case $82adcd05a20fe158$var$AUTH_TYPE_LOCAL:
                    {
                        const authServerUrl = await (0, $ee80a6b397c7131d$export$274217e117cdbc7b)(dataProvider);
                        // Delete token but also any other value in local storage
                        localStorage.clear();
                        let result = {};
                        try {
                            result = await dataProvider.fetch((0, $1obPJ$urljoin)(authServerUrl, '.well-known/openid-configuration'));
                        } catch (e) {
                        // Do nothing if it fails
                        }
                        // @ts-expect-error TS(2339): Property 'status' does not exist on type '{}'.
                        if (result.status === 200 && result.json) // Redirect to OIDC endpoint if it exists
                        // @ts-expect-error TS(2339): Property 'json' does not exist on type '{}'.
                        window.location.href = result.json.end_session_endpoint;
                        else {
                            // Reload to ensure the dataServer config is reset
                            window.location.reload();
                            window.location.href = '/';
                        }
                        break;
                    }
                case $82adcd05a20fe158$var$AUTH_TYPE_SSO:
                    {
                        const authServerUrl = await (0, $ee80a6b397c7131d$export$274217e117cdbc7b)(dataProvider);
                        const baseUrl = new URL(window.location.href).origin;
                        return (0, $1obPJ$urljoin)(authServerUrl, `auth/logout?redirectUrl=${encodeURIComponent(`${(0, $1obPJ$urljoin)(baseUrl, 'login')}?logout=true`)}`);
                    }
                case $82adcd05a20fe158$var$AUTH_TYPE_POD:
                    {
                        const token = localStorage.getItem('token');
                        if (token) {
                            // @ts-expect-error TS(2339): Property 'webId' does not exist on type 'unknown'.
                            const { webId: webId } = (0, $1obPJ$jwtdecode)(token);
                            // Delete token but also any other value in local storage
                            localStorage.clear();
                            // Redirect to the POD provider
                            return `${(0, $1obPJ$urljoin)(webId, 'openApp')}?type=${encodeURIComponent('http://activitypods.org/ns/core#FrontAppRegistration')}`;
                        }
                        break;
                    }
                case $82adcd05a20fe158$var$AUTH_TYPE_SOLID_OIDC:
                    {
                        const token = localStorage.getItem('token');
                        if (token) {
                            // @ts-expect-error TS(2339): Property 'webid' does not exist on type 'unknown'.
                            const { webid: webId } = (0, $1obPJ$jwtdecode)(token); // Not webId !!
                            // Delete token but also any other value in local storage
                            localStorage.clear();
                            if (redirectUrl) return redirectUrl;
                            else {
                                // We don't need the token to fetch the WebID since it is public
                                const { json: userData } = await dataProvider.fetch(webId);
                                // Redirect to the Pod provider
                                return userData?.['solid:oidcIssuer'] || new URL(webId).origin;
                            }
                        } else return redirectUrl;
                    }
                default:
                    break;
            }
        },
        checkAuth: async ()=>{
            const token = localStorage.getItem('token');
            if (!token && !allowAnonymous) throw new Error();
        },
        checkUser: (userData)=>{
            if (checkUser) return checkUser(userData);
            return true;
        },
        checkError: (error)=>{
            // We want to disconnect only with INVALID_TOKEN errors
            if (error.status === 401 && error.body && error.body.type === 'INVALID_TOKEN') {
                localStorage.removeItem('token');
                return Promise.reject();
            } else // Other error code (404, 500, etc): no need to log out
            return Promise.resolve();
        },
        getPermissions: async ({ uri: uri })=>{
            if (!checkPermissions) return;
            if (!uri) return;
            // React-admin calls getPermissions with an empty object on every page refresh
            // It also passes an object `{ params: { route: 'dashboard' } }` on the Dashboard
            // Ignore all this until we found a way to bypass these redundant calls
            if (typeof uri === 'object') return;
            if (!uri || !uri.startsWith('http')) throw new Error(`The first parameter passed to getPermissions must be an URL. Received: ${uri}`);
            const aclUri = (0, $ee80a6b397c7131d$export$4450a74bced1b745)(uri);
            try {
                const { json: json } = await dataProvider.fetch(aclUri);
                return json['@graph'];
            } catch (e) {
                console.warn(`Could not fetch ACL URI ${uri}`);
                return [];
            }
        },
        addPermission: async (uri, agentId, predicate, mode)=>{
            if (!uri || !uri.startsWith('http')) throw new Error('The first parameter passed to addPermission must be an URL');
            const aclUri = (0, $ee80a6b397c7131d$export$4450a74bced1b745)(uri);
            const authorization = {
                '@id': `#${mode.replace('acl:', '')}`,
                '@type': 'acl:Authorization',
                [predicate]: agentId,
                'acl:accessTo': uri,
                'acl:mode': mode
            };
            await dataProvider.fetch(aclUri, {
                method: 'PATCH',
                body: JSON.stringify({
                    '@context': (0, $ee80a6b397c7131d$export$4d54b642c3d13c34)(aclUri),
                    '@graph': [
                        authorization
                    ]
                })
            });
        },
        removePermission: async (uri, agentId, predicate, mode)=>{
            if (!uri || !uri.startsWith('http')) throw new Error('The first parameter passed to removePermission must be an URL');
            const aclUri = (0, $ee80a6b397c7131d$export$4450a74bced1b745)(uri);
            // Fetch current permissions
            const { json: json } = await dataProvider.fetch(aclUri);
            const updatedPermissions = json['@graph'].filter((authorization)=>!authorization['@id'].includes('#Default')).map((authorization)=>{
                const modes = (0, $ee80a6b397c7131d$export$dca4f48302963835)(authorization['acl:mode']);
                let agents = (0, $ee80a6b397c7131d$export$dca4f48302963835)(authorization[predicate]);
                if (mode && modes?.includes(mode) && agents && agents.includes(agentId)) agents = agents.filter((agent)=>agent !== agentId);
                return {
                    ...authorization,
                    [predicate]: agents
                };
            });
            await dataProvider.fetch(aclUri, {
                method: 'PUT',
                body: JSON.stringify({
                    '@context': (0, $ee80a6b397c7131d$export$4d54b642c3d13c34)(aclUri),
                    '@graph': updatedPermissions
                })
            });
        },
        getIdentity: async ()=>{
            const token = localStorage.getItem('token');
            if (token) {
                const payload = (0, $1obPJ$jwtdecode)(token);
                // Backend-generated tokens use webId but Solid-OIDC tokens use webid
                // @ts-expect-error TS(2571): Object is of type 'unknown'.
                const webId = authType === $82adcd05a20fe158$var$AUTH_TYPE_SOLID_OIDC ? payload.webid : payload.webId;
                if (!webId) {
                    // If webId is not set, it is probably because we have ActivityPods v1 tokens and we need to disconnect
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    throw new Error('No webId found on provided token !');
                }
                const { json: webIdData } = await dataProvider.fetch(webId);
                let profileData = {};
                if (webIdData.url) try {
                    const { status: status, json: json } = await dataProvider.fetch(webIdData.url);
                    if (status === 200) profileData = json;
                } catch (e) {
                    // Could not fetch profile. Continue...
                    console.error(e);
                }
                return {
                    id: webId,
                    fullName: // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    profileData['vcard:given-name'] || // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    profileData['pair:label'] || webIdData['foaf:name'] || webIdData['pair:label'],
                    avatar: // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    profileData['vcard:photo'] || webIdData.image?.url || webIdData.image || webIdData.icon?.url || webIdData.icon,
                    profileData: profileData,
                    webIdData: webIdData
                };
            }
        },
        resetPassword: async (params)=>{
            const { email: email } = params;
            const authServerUrl = await (0, $ee80a6b397c7131d$export$274217e117cdbc7b)(dataProvider);
            try {
                await dataProvider.fetch((0, $1obPJ$urljoin)(authServerUrl, 'auth/reset_password'), {
                    method: 'POST',
                    body: JSON.stringify({
                        email: email.trim()
                    }),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                });
            } catch (e) {
                if (e.message === 'email.not.exists') throw new Error('auth.message.user_email_not_found');
                else throw new Error('auth.notification.reset_password_error');
            }
        },
        setNewPassword: async (params)=>{
            const { email: email, token: token, password: password } = params;
            const authServerUrl = await (0, $ee80a6b397c7131d$export$274217e117cdbc7b)(dataProvider);
            try {
                await dataProvider.fetch((0, $1obPJ$urljoin)(authServerUrl, 'auth/new_password'), {
                    method: 'POST',
                    body: JSON.stringify({
                        email: email.trim(),
                        token: token,
                        password: password
                    }),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                });
            } catch (e) {
                if (e.message === 'email.not.exists') throw new Error('auth.message.user_email_not_found');
                else throw new Error('auth.notification.new_password_error');
            }
        },
        getAccountSettings: async (params)=>{
            const authServerUrl = await (0, $ee80a6b397c7131d$export$274217e117cdbc7b)(dataProvider);
            try {
                const { json: json } = await dataProvider.fetch((0, $1obPJ$urljoin)(authServerUrl, 'auth/account'));
                return json;
            } catch (e) {
                throw new Error('auth.notification.get_settings_error');
            }
        },
        updateAccountSettings: async (params)=>{
            const authServerUrl = await (0, $ee80a6b397c7131d$export$274217e117cdbc7b)(dataProvider);
            try {
                const { email: email, currentPassword: currentPassword, newPassword: newPassword } = params;
                await dataProvider.fetch((0, $1obPJ$urljoin)(authServerUrl, 'auth/account'), {
                    method: 'POST',
                    body: JSON.stringify({
                        currentPassword: currentPassword,
                        email: email?.trim(),
                        newPassword: newPassword
                    }),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                });
            } catch (e) {
                if (e.message === 'auth.account.invalid_password') throw new Error('auth.notification.invalid_password');
                throw new Error('auth.notification.update_settings_error');
            }
        }
    };
};
var $82adcd05a20fe158$export$2e2bcd8739ae039 = $82adcd05a20fe158$var$authProvider;








const $dd9154ee844248d7$export$66a34090010a35b3 = 'acl:Read';
const $dd9154ee844248d7$export$7c883503ccedfe0e = 'acl:Append';
const $dd9154ee844248d7$export$2e56ecf100ca4ba6 = 'acl:Write';
const $dd9154ee844248d7$export$5581cb2c55de143a = 'acl:Control';
const $dd9154ee844248d7$export$97a08a1bb7ee0545 = 'acl:agent';
const $dd9154ee844248d7$export$f07ccbe0773f2c7 = 'acl:agentGroup';
const $dd9154ee844248d7$export$2703254089a859eb = 'acl:agentClass';
const $dd9154ee844248d7$export$83ae1bc0992a6335 = 'foaf:Agent';
const $dd9154ee844248d7$export$546c01a3ffdabe3a = 'acl:AuthenticatedAgent';
const $dd9154ee844248d7$export$d37f0098bcf84c55 = [
    $dd9154ee844248d7$export$66a34090010a35b3,
    $dd9154ee844248d7$export$7c883503ccedfe0e,
    $dd9154ee844248d7$export$2e56ecf100ca4ba6,
    $dd9154ee844248d7$export$5581cb2c55de143a
];
const $dd9154ee844248d7$export$dc3840a4e2a72b8c = [
    $dd9154ee844248d7$export$66a34090010a35b3,
    $dd9154ee844248d7$export$7c883503ccedfe0e,
    $dd9154ee844248d7$export$2e56ecf100ca4ba6,
    $dd9154ee844248d7$export$5581cb2c55de143a
];
const $dd9154ee844248d7$export$65615a101bd6f5ca = [
    $dd9154ee844248d7$export$7c883503ccedfe0e,
    $dd9154ee844248d7$export$2e56ecf100ca4ba6,
    $dd9154ee844248d7$export$5581cb2c55de143a
];
const $dd9154ee844248d7$export$b9d0f5f3ab5e453b = [
    $dd9154ee844248d7$export$7c883503ccedfe0e,
    $dd9154ee844248d7$export$2e56ecf100ca4ba6,
    $dd9154ee844248d7$export$5581cb2c55de143a
];
const $dd9154ee844248d7$export$ac7b0367c0f9031e = [
    $dd9154ee844248d7$export$2e56ecf100ca4ba6,
    $dd9154ee844248d7$export$5581cb2c55de143a
];
const $dd9154ee844248d7$export$22242524f7d0624 = [
    $dd9154ee844248d7$export$5581cb2c55de143a
];
const $dd9154ee844248d7$export$cae945d60b6cbe50 = {
    show: $dd9154ee844248d7$export$d37f0098bcf84c55,
    list: $dd9154ee844248d7$export$dc3840a4e2a72b8c,
    create: $dd9154ee844248d7$export$65615a101bd6f5ca,
    edit: $dd9154ee844248d7$export$b9d0f5f3ab5e453b,
    delete: $dd9154ee844248d7$export$ac7b0367c0f9031e,
    control: $dd9154ee844248d7$export$22242524f7d0624
};
const $dd9154ee844248d7$export$12e6e8e71d10a4bb = {
    show: 'auth.message.resource_show_forbidden',
    edit: 'auth.message.resource_edit_forbidden',
    delete: 'auth.message.resource_delete_forbidden',
    control: 'auth.message.resource_control_forbidden',
    list: 'auth.message.container_list_forbidden',
    create: 'auth.message.container_create_forbidden'
};
const $dd9154ee844248d7$export$2e9571c4ccdeb6a9 = {
    [$dd9154ee844248d7$export$66a34090010a35b3]: 'auth.right.resource.read',
    [$dd9154ee844248d7$export$7c883503ccedfe0e]: 'auth.right.resource.append',
    [$dd9154ee844248d7$export$2e56ecf100ca4ba6]: 'auth.right.resource.write',
    [$dd9154ee844248d7$export$5581cb2c55de143a]: 'auth.right.resource.control'
};
const $dd9154ee844248d7$export$edca379024d80309 = {
    [$dd9154ee844248d7$export$66a34090010a35b3]: 'auth.right.container.read',
    [$dd9154ee844248d7$export$2e56ecf100ca4ba6]: 'auth.right.container.write',
    [$dd9154ee844248d7$export$5581cb2c55de143a]: 'auth.right.container.control'
};


const $3246c5a1f284b82d$var$useCheckPermissions = (uri, mode, redirectUrl = '/')=>{
    const { permissions: permissions } = (0, $1obPJ$usePermissions)({
        uri: uri
    });
    const notify = (0, $1obPJ$useNotify)();
    const redirect = (0, $1obPJ$useRedirect)();
    (0, $1obPJ$useEffect)(()=>{
        if (permissions && !permissions.some((p)=>(0, $dd9154ee844248d7$export$cae945d60b6cbe50)[mode].includes(p['acl:mode']))) {
            notify((0, $dd9154ee844248d7$export$12e6e8e71d10a4bb)[mode], {
                type: 'error'
            });
            redirect(redirectUrl);
        }
    }, [
        permissions,
        redirect,
        notify
    ]);
    return permissions;
};
var $3246c5a1f284b82d$export$2e2bcd8739ae039 = $3246c5a1f284b82d$var$useCheckPermissions;


const $555a60066c55ca73$var$CreateWithPermissions = ({ actions: actions = /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$CreateActions), {}), children: children, ...rest })=>{
    const resource = (0, $1obPJ$useResourceContext)();
    const createContainerUri = (0, $1obPJ$useCreateContainerUri)(resource);
    (0, $3246c5a1f284b82d$export$2e2bcd8739ae039)(createContainerUri, 'create');
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Create), {
        actions: actions,
        ...rest,
        children: children
    });
};
var $555a60066c55ca73$export$2e2bcd8739ae039 = $555a60066c55ca73$var$CreateWithPermissions;



























const $8e7d7e56831aa2ef$var$useStyles = (0, $1obPJ$makeStyles)()(()=>({
        list: {
            padding: 0,
            width: '100%'
        },
        option: {
            padding: 0
        }
    }));
const $8e7d7e56831aa2ef$var$AddPermissionsForm = ({ agents: agents, addPermission: addPermission })=>{
    const { classes: classes } = $8e7d7e56831aa2ef$var$useStyles();
    const translate = (0, $1obPJ$useTranslate)();
    const [value, setValue] = (0, $1obPJ$useState)(null);
    const [inputValue, setInputValue] = (0, $1obPJ$useState)('');
    const [options, setOptions] = (0, $1obPJ$useState)([]);
    const { data: data } = (0, $1obPJ$useGetList)('Person', {
        pagination: {
            page: 1,
            perPage: 100
        },
        sort: {
            field: 'pair:label',
            order: 'ASC'
        },
        filter: {
            q: inputValue
        }
    }, {
        enabled: inputValue.length > 0
    });
    (0, $1obPJ$useEffect)(()=>{
        setOptions((data?.length || 0) > 0 ? Object.values(data || []) : []);
    }, [
        data
    ]);
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$muimaterialAutocomplete), {
        classes: {
            option: classes.option
        },
        getOptionLabel: (option)=>option['pair:label'],
        // Do not return agents which have already been added
        filterOptions: (x)=>x.filter((agent)=>!Object.keys(agents).includes(agent.id)),
        options: options,
        noOptionsText: translate('ra.navigation.no_results'),
        autoComplete: true,
        blurOnSelect: true,
        clearOnBlur: true,
        disableClearable: true,
        value: value || undefined,
        onChange: (event, record)=>{
            addPermission(record.id || record['@id'], (0, $dd9154ee844248d7$export$97a08a1bb7ee0545), (0, $dd9154ee844248d7$export$66a34090010a35b3));
            setValue(null);
            setInputValue('');
            setOptions([]);
        },
        onInputChange: (event, newInputValue)=>{
            setInputValue(newInputValue);
        },
        renderInput: (params)=>/*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextField), {
                ...params,
                label: translate('auth.input.agent_select'),
                variant: "filled",
                margin: "dense",
                fullWidth: true
            }),
        renderOption: (props, option)=>/*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$List), {
                dense: true,
                className: classes.list,
                ...props,
                children: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$ListItem), {
                    button: true,
                    children: [
                        /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ListItemAvatar), {
                            children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Avatar), {
                                src: option.image,
                                children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$muiiconsmaterialPerson), {})
                            })
                        }),
                        /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ListItemText), {
                            primary: option['pair:label']
                        })
                    ]
                })
            })
    });
};
var $8e7d7e56831aa2ef$export$2e2bcd8739ae039 = $8e7d7e56831aa2ef$var$AddPermissionsForm;





















const $5038212710cd44fa$var$AgentIcon = ({ agent: agent })=>{
    switch(agent.predicate){
        case 0, $dd9154ee844248d7$export$2703254089a859eb:
            return agent.id === (0, $dd9154ee844248d7$export$83ae1bc0992a6335) ? /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$muiiconsmaterialPublic), {}) : /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$muiiconsmaterialVpnLock), {});
        case 0, $dd9154ee844248d7$export$97a08a1bb7ee0545:
            return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$muiiconsmaterialPerson), {});
        case 0, $dd9154ee844248d7$export$f07ccbe0773f2c7:
            return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$muiiconsmaterialGroup), {});
        default:
            throw new Error(`Unknown agent predicate: ${agent.predicate}`);
    }
};
var $5038212710cd44fa$export$2e2bcd8739ae039 = $5038212710cd44fa$var$AgentIcon;


const $2c2af8264d5cc27a$var$useStyles = (0, $1obPJ$makeStyles)()(()=>({
        listItem: {
            paddingLeft: 4,
            paddingRight: 36
        },
        primaryText: {
            width: '30%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        secondaryText: {
            textAlign: 'center',
            width: '60%',
            fontStyle: 'italic',
            color: 'grey'
        }
    }));
const $2c2af8264d5cc27a$var$AgentItem = ({ isContainer: isContainer, agent: agent, addPermission: addPermission, removePermission: removePermission })=>{
    const { classes: classes } = $2c2af8264d5cc27a$var$useStyles();
    const translate = (0, $1obPJ$useTranslate)();
    const dataProvider = (0, $1obPJ$useDataProvider)();
    const [anchorEl, setAnchorEl] = (0, $1obPJ$react).useState(null);
    const [user, setUser] = (0, $1obPJ$useState)();
    const [loading, setLoading] = (0, $1obPJ$useState)(true);
    const [error, setError] = (0, $1obPJ$useState)();
    (0, $1obPJ$useEffect)(()=>{
        if (agent.predicate === (0, $dd9154ee844248d7$export$97a08a1bb7ee0545)) dataProvider.getOne('Person', {
            id: agent.id
        }).then(({ data: data })=>{
            setUser(data);
            setLoading(false);
        }).catch((error)=>{
            setError(error);
            setLoading(false);
        });
        else setLoading(false);
    }, [
        agent.id,
        agent.predicate
    ]);
    // For now, do not display groups
    if (agent.predicate === (0, $dd9154ee844248d7$export$f07ccbe0773f2c7)) return null;
    const openMenu = (event)=>setAnchorEl(event.currentTarget);
    const closeMenu = ()=>setAnchorEl(null);
    const labels = isContainer ? (0, $dd9154ee844248d7$export$edca379024d80309) : (0, $dd9154ee844248d7$export$2e9571c4ccdeb6a9);
    if (loading) return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Loading), {});
    // @ts-expect-error TS(2739): Type '{}' is missing the following properties from... Remove this comment to see the full error message
    if (error) return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Error), {});
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$ListItem), {
        className: classes.listItem,
        children: [
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ListItemAvatar), {
                children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Avatar), {
                    src: // @ts-expect-error TS(2339): Property 'image' does not exist on type 'never'.
                    user?.image,
                    children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $5038212710cd44fa$export$2e2bcd8739ae039), {
                        agent: agent
                    })
                })
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ListItemText), {
                className: classes.primaryText,
                primary: user ? user['pair:label'] : translate(agent.id === (0, $dd9154ee844248d7$export$83ae1bc0992a6335) ? 'auth.agent.anonymous' : 'auth.agent.authenticated')
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ListItemText), {
                className: classes.secondaryText,
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                primary: agent.permissions && agent.permissions.map((p)=>translate(labels[p])).join(', ')
            }),
            /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$ListItemSecondaryAction), {
                children: [
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$IconButton), {
                        onClick: openMenu,
                        size: "large",
                        children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$muiiconsmaterialEdit), {})
                    }),
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Menu), {
                        anchorEl: anchorEl,
                        keepMounted: true,
                        open: Boolean(anchorEl),
                        onClose: closeMenu,
                        children: Object.entries(labels).map(([rightKey, rightLabel])=>{
                            const hasPermission = agent.permissions && agent.permissions.includes(rightKey);
                            return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$MenuItem), {
                                onClick: ()=>{
                                    if (hasPermission) removePermission(agent.id, agent.predicate, rightKey);
                                    else addPermission(agent.id, agent.predicate, rightKey);
                                    closeMenu();
                                },
                                children: [
                                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ListItemIcon), {
                                        children: hasPermission ? /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$muiiconsmaterialCheck), {}) : null
                                    }),
                                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ListItemText), {
                                        primary: translate(rightLabel)
                                    })
                                ]
                            }, rightKey);
                        })
                    })
                ]
            })
        ]
    });
};
var $2c2af8264d5cc27a$export$2e2bcd8739ae039 = $2c2af8264d5cc27a$var$AgentItem;


const $52a311eb9faddd75$var$StyledList = (0, $1obPJ$styled)((0, $1obPJ$List))(({ theme: theme })=>({
        width: '100%',
        maxWidth: '100%',
        backgroundColor: theme.palette.background.paper
    }));
const $52a311eb9faddd75$var$EditPermissionsForm = ({ isContainer: isContainer, agents: agents, addPermission: addPermission, removePermission: removePermission })=>{
    return /*#__PURE__*/ (0, $1obPJ$jsx)($52a311eb9faddd75$var$StyledList, {
        dense: true,
        children: Object.entries(agents).map(([agentId, agent])=>/*#__PURE__*/ (0, $1obPJ$jsx)((0, $2c2af8264d5cc27a$export$2e2bcd8739ae039), {
                isContainer: isContainer,
                agent: agent,
                addPermission: addPermission,
                removePermission: removePermission
            }, agentId))
    });
};
var $52a311eb9faddd75$export$2e2bcd8739ae039 = $52a311eb9faddd75$var$EditPermissionsForm;






const $9437ede267ca0f1e$var$useAgents = (uri)=>{
    const { permissions: permissions } = (0, $1obPJ$usePermissions)({
        uri: uri
    });
    const authProvider = (0, $1obPJ$useAuthProvider)();
    const [agents, setAgents] = (0, $1obPJ$useState)({});
    // Format list of authorized agents, based on the permissions returned for the resource
    (0, $1obPJ$useEffect)(()=>{
        const result = {
            [(0, $dd9154ee844248d7$export$83ae1bc0992a6335)]: {
                id: (0, $dd9154ee844248d7$export$83ae1bc0992a6335),
                predicate: (0, $dd9154ee844248d7$export$2703254089a859eb),
                permissions: []
            },
            [(0, $dd9154ee844248d7$export$546c01a3ffdabe3a)]: {
                id: (0, $dd9154ee844248d7$export$546c01a3ffdabe3a),
                predicate: (0, $dd9154ee844248d7$export$2703254089a859eb),
                permissions: []
            }
        };
        const appendPermission = (agentId, predicate, mode)=>{
            if (result[agentId]) // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
            result[agentId].permissions.push(mode);
            else result[agentId] = {
                id: agentId,
                predicate: predicate,
                // @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
                permissions: [
                    mode
                ]
            };
        };
        if (permissions) {
            for (const p of permissions){
                if (p[0, $dd9154ee844248d7$export$2703254089a859eb]) (0, $ee80a6b397c7131d$export$dca4f48302963835)(p[0, $dd9154ee844248d7$export$2703254089a859eb])?.forEach((agentId)=>appendPermission(agentId, (0, $dd9154ee844248d7$export$2703254089a859eb), p['acl:mode']));
                if (p[0, $dd9154ee844248d7$export$97a08a1bb7ee0545]) (0, $ee80a6b397c7131d$export$dca4f48302963835)(p[0, $dd9154ee844248d7$export$97a08a1bb7ee0545])?.forEach((userUri)=>appendPermission(userUri, (0, $dd9154ee844248d7$export$97a08a1bb7ee0545), p['acl:mode']));
                if (p[0, $dd9154ee844248d7$export$f07ccbe0773f2c7]) (0, $ee80a6b397c7131d$export$dca4f48302963835)(p[0, $dd9154ee844248d7$export$f07ccbe0773f2c7])?.forEach((groupUri)=>appendPermission(groupUri, (0, $dd9154ee844248d7$export$f07ccbe0773f2c7), p['acl:mode']));
            }
            setAgents(result);
        }
    }, [
        permissions
    ]);
    const addPermission = (0, $1obPJ$useCallback)((agentId, predicate, mode)=>{
        const prevAgents = {
            ...agents
        };
        setAgents({
            ...agents,
            [agentId]: {
                id: agentId,
                predicate: predicate,
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                permissions: agents[agentId] ? [
                    ...agents[agentId]?.permissions,
                    mode
                ] : [
                    mode
                ]
            }
        });
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        authProvider.addPermission(uri, agentId, predicate, mode).catch((e)=>{
            // If there was an error, revert the optimistic update
            setAgents(prevAgents);
        });
    }, [
        agents,
        setAgents,
        uri,
        authProvider
    ]);
    const removePermission = (0, $1obPJ$useCallback)((agentId, predicate, mode)=>{
        const prevAgents = {
            ...agents
        };
        setAgents(Object.fromEntries(Object.entries(agents).map(([key, agent])=>{
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            if (agent.id === agentId) // @ts-expect-error TS(2571): Object is of type 'unknown'.
            agent.permissions = agent.permissions.filter((m)=>m !== mode);
            return [
                key,
                agent
            ];
        })// Remove agents if they have no permissions (except if they are class agents)
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        .filter(([_, agent])=>agent.predicate === (0, $dd9154ee844248d7$export$2703254089a859eb) || agent.permissions.length > 0)));
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        authProvider.removePermission(uri, agentId, predicate, mode).catch((e)=>{
            // If there was an error, revert the optimistic update
            setAgents(prevAgents);
        });
    }, [
        agents,
        setAgents,
        uri,
        authProvider
    ]);
    return {
        agents: agents,
        addPermission: addPermission,
        removePermission: removePermission
    };
};
var $9437ede267ca0f1e$export$2e2bcd8739ae039 = $9437ede267ca0f1e$var$useAgents;


const $9461085805fdfe26$var$useStyles = (0, $1obPJ$makeStyles)()(()=>({
        title: {
            paddingBottom: 8
        },
        actions: {
            padding: 15
        },
        addForm: {
            paddingTop: 0
        },
        listForm: {
            paddingTop: 0,
            paddingBottom: 0,
            paddingRight: 0,
            maxHeight: 210
        }
    }));
const $9461085805fdfe26$var$PermissionsDialog = ({ open: open, onClose: onClose, uri: uri, isContainer: isContainer })=>{
    const { classes: classes } = $9461085805fdfe26$var$useStyles();
    const translate = (0, $1obPJ$useTranslate)();
    const { agents: agents, addPermission: addPermission, removePermission: removePermission } = (0, $9437ede267ca0f1e$export$2e2bcd8739ae039)(uri);
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Dialog), {
        fullWidth: true,
        open: open,
        onClose: onClose,
        children: [
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$DialogTitle), {
                className: classes.title,
                children: translate(isContainer ? 'auth.dialog.container_permissions' : 'auth.dialog.resource_permissions')
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$DialogContent), {
                className: classes.addForm,
                children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $8e7d7e56831aa2ef$export$2e2bcd8739ae039), {
                    agents: agents,
                    addPermission: addPermission
                })
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$DialogContent), {
                className: classes.listForm,
                children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $52a311eb9faddd75$export$2e2bcd8739ae039), {
                    isContainer: isContainer,
                    agents: agents,
                    addPermission: addPermission,
                    removePermission: removePermission
                })
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$DialogActions), {
                className: classes.actions,
                children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Button), {
                    label: "ra.action.close",
                    variant: "text",
                    onClick: onClose
                })
            })
        ]
    });
};
var $9461085805fdfe26$export$2e2bcd8739ae039 = $9461085805fdfe26$var$PermissionsDialog;


const $121c824bbff8752d$var$PermissionsButton = ({ isContainer: isContainer = false })=>{
    const record = (0, $1obPJ$useRecordContext)();
    const resource = (0, $1obPJ$useResourceContext)();
    const [showDialog, setShowDialog] = (0, $1obPJ$useState)(false);
    const createContainer = (0, $1obPJ$useCreateContainerUri)(resource);
    const uri = isContainer ? createContainer : record?.id || record?.['@id'];
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Fragment), {
        children: [
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Button), {
                label: "auth.action.permissions",
                onClick: ()=>setShowDialog(true),
                children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$muiiconsmaterialShare), {})
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $9461085805fdfe26$export$2e2bcd8739ae039), {
                uri: uri,
                isContainer: isContainer,
                open: showDialog,
                onClose: ()=>setShowDialog(false)
            })
        ]
    });
};
var $121c824bbff8752d$export$2e2bcd8739ae039 = $121c824bbff8752d$var$PermissionsButton;



const $1d084bfeb799eb8d$var$EditActionsWithPermissions = ()=>{
    const { hasList: hasList, hasShow: hasShow } = (0, $1obPJ$useResourceDefinition)();
    const record = (0, $1obPJ$useRecordContext)();
    const { permissions: permissions } = (0, $1obPJ$usePermissions)({
        uri: record?.id
    });
    const resource = (0, $1obPJ$useResourceContext)();
    const containerUri = (0, $1obPJ$useCreateContainerUri)(resource);
    const { permissions: containerPermissions } = (0, $1obPJ$usePermissions)({
        uri: containerUri
    });
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$TopToolbar), {
        children: [
            hasList && containerPermissions && containerPermissions.some((p)=>(0, $dd9154ee844248d7$export$dc3840a4e2a72b8c).includes(p['acl:mode'])) && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ListButton), {}),
            hasShow && permissions && permissions.some((p)=>(0, $dd9154ee844248d7$export$d37f0098bcf84c55).includes(p['acl:mode'])) && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ShowButton), {}),
            permissions && permissions.some((p)=>(0, $dd9154ee844248d7$export$22242524f7d0624).includes(p['acl:mode'])) && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $121c824bbff8752d$export$2e2bcd8739ae039), {})
        ]
    });
};
var $1d084bfeb799eb8d$export$2e2bcd8739ae039 = $1d084bfeb799eb8d$var$EditActionsWithPermissions;



const $d4772f22df7d8ad1$var$EditWithPermissions = ({ actions: actions = /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1d084bfeb799eb8d$export$2e2bcd8739ae039), {}), children: children, ...rest })=>{
    const recordId = (0, $1obPJ$useGetRecordId)();
    (0, $3246c5a1f284b82d$export$2e2bcd8739ae039)(recordId, 'edit');
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Edit), {
        actions: actions,
        ...rest,
        children: children
    });
};
var $d4772f22df7d8ad1$export$2e2bcd8739ae039 = $d4772f22df7d8ad1$var$EditWithPermissions;











const $f1536e5a1fd8c3b4$var$DeleteButtonWithPermissions = (props)=>{
    const recordId = (0, $1obPJ$useGetRecordId)();
    const { permissions: permissions, isLoading: isLoading } = (0, $1obPJ$usePermissions)({
        uri: recordId
    });
    if (!isLoading && permissions?.some((p)=>(0, $dd9154ee844248d7$export$ac7b0367c0f9031e).includes(p['acl:mode']))) return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$DeleteButton), {
        ...props
    });
    return null;
};
var $f1536e5a1fd8c3b4$export$2e2bcd8739ae039 = $f1536e5a1fd8c3b4$var$DeleteButtonWithPermissions;


const $6b0c1a175ed94bdf$var$StyledToolbar = (0, $1obPJ$styled1)((0, $1obPJ$Toolbar))(()=>({
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between'
    }));
const $6b0c1a175ed94bdf$var$EditToolbarWithPermissions = (props)=>/*#__PURE__*/ (0, $1obPJ$jsxs)($6b0c1a175ed94bdf$var$StyledToolbar, {
        ...props,
        children: [
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$SaveButton), {}),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $f1536e5a1fd8c3b4$export$2e2bcd8739ae039), {})
        ]
    });
var $6b0c1a175ed94bdf$export$2e2bcd8739ae039 = $6b0c1a175ed94bdf$var$EditToolbarWithPermissions;






const $5404fb6e980f17cf$var$EditButtonWithPermissions = (props)=>{
    const recordId = (0, $1obPJ$useGetRecordId)();
    const { permissions: permissions, isLoading: isLoading } = (0, $1obPJ$usePermissions)({
        uri: recordId
    });
    if (!isLoading && permissions?.some((p)=>(0, $dd9154ee844248d7$export$b9d0f5f3ab5e453b).includes(p['acl:mode']))) return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$EditButton), {
        ...props
    });
    return null;
};
var $5404fb6e980f17cf$export$2e2bcd8739ae039 = $5404fb6e980f17cf$var$EditButtonWithPermissions;














// Do not show Export and Refresh buttons on mobile
const $79c9804078d70be7$var$ListActionsWithPermissions = ({ sort: // @ts-expect-error TS(2339): Property 'sort' does not exist on type 'ListAction... Remove this comment to see the full error message
sort, displayedFilters: displayedFilters, exporter: exporter, filters: filters, filterValues: filterValues, showFilter: showFilter, total: total })=>{
    const theme = (0, $1obPJ$useTheme)();
    const xs = (0, $1obPJ$useMediaQuery)(theme.breakpoints.down('xs'));
    const resource = (0, $1obPJ$useResourceContext)();
    const resourceDefinition = (0, $1obPJ$useResourceDefinition)();
    const containerUri = (0, $1obPJ$useCreateContainerUri)(resource);
    const { permissions: permissions } = (0, $1obPJ$usePermissions)({
        uri: containerUri
    });
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$TopToolbar), {
        children: [
            filters && /*#__PURE__*/ (0, $1obPJ$react).cloneElement(filters, {
                showFilter: showFilter,
                displayedFilters: displayedFilters,
                filterValues: filterValues,
                context: 'button'
            }),
            resourceDefinition.hasCreate && permissions?.some((p)=>(0, $dd9154ee844248d7$export$65615a101bd6f5ca).includes(p['acl:mode'])) && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$CreateButton), {}),
            permissions?.some((p)=>(0, $dd9154ee844248d7$export$22242524f7d0624).includes(p['acl:mode'])) && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $121c824bbff8752d$export$2e2bcd8739ae039), {
                isContainer: true
            }),
            !xs && exporter !== false && // @ts-expect-error TS(2322): Type '{ disabled: boolean; sort: any; filterValues... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ExportButton), {
                disabled: total === 0,
                sort: sort,
                filterValues: filterValues,
                exporter: exporter
            })
        ]
    });
};
var $79c9804078d70be7$export$2e2bcd8739ae039 = $79c9804078d70be7$var$ListActionsWithPermissions;


const $c356f5bf85f01e2c$var$ListWithPermissions = ({ actions: actions = /*#__PURE__*/ (0, $1obPJ$jsx)((0, $79c9804078d70be7$export$2e2bcd8739ae039), {}), ...rest })=>/*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$List1), {
        actions: actions,
        ...rest
    });
var $c356f5bf85f01e2c$export$2e2bcd8739ae039 = $c356f5bf85f01e2c$var$ListWithPermissions;












const $acd67d211d146755$var$ShowActionsWithPermissions = ()=>{
    const { hasList: hasList, hasEdit: hasEdit } = (0, $1obPJ$useResourceDefinition)();
    const record = (0, $1obPJ$useRecordContext)();
    const { permissions: permissions } = (0, $1obPJ$usePermissions)({
        uri: record?.id
    });
    const resource = (0, $1obPJ$useResourceContext)();
    const containerUri = (0, $1obPJ$useCreateContainerUri)(resource);
    const { permissions: containerPermissions } = (0, $1obPJ$usePermissions)({
        uri: containerUri
    });
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$TopToolbar), {
        children: [
            hasList && containerPermissions && containerPermissions.some((p)=>(0, $dd9154ee844248d7$export$dc3840a4e2a72b8c).includes(p['acl:mode'])) && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ListButton), {}),
            hasEdit && permissions && permissions.some((p)=>(0, $dd9154ee844248d7$export$b9d0f5f3ab5e453b).includes(p['acl:mode'])) && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$EditButton), {}),
            permissions && permissions.some((p)=>(0, $dd9154ee844248d7$export$22242524f7d0624).includes(p['acl:mode'])) && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $121c824bbff8752d$export$2e2bcd8739ae039), {})
        ]
    });
};
var $acd67d211d146755$export$2e2bcd8739ae039 = $acd67d211d146755$var$ShowActionsWithPermissions;



const $666a46a782bc3d6f$var$ShowWithPermissions = ({ actions: actions, ...rest })=>{
    const recordId = (0, $1obPJ$useGetRecordId)();
    (0, $3246c5a1f284b82d$export$2e2bcd8739ae039)(recordId, 'show');
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Show), {
        actions: actions || /*#__PURE__*/ (0, $1obPJ$jsx)((0, $acd67d211d146755$export$2e2bcd8739ae039), {}),
        ...rest
    });
};
var $666a46a782bc3d6f$export$2e2bcd8739ae039 = $666a46a782bc3d6f$var$ShowWithPermissions;








const $7a4043d65a13021b$var$AuthDialog = ({ open: open, onClose: onClose, title: title = 'auth.dialog.login_required', message: message = 'auth.message.login_to_continue', redirect: redirect, ...rest })=>{
    const login = (0, $1obPJ$useLogin)();
    const translate = (0, $1obPJ$useTranslate)();
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Dialog), {
        open: open,
        onClose: onClose,
        ...rest,
        children: [
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$DialogTitle), {
                children: translate(title)
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$DialogContent), {
                children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$DialogContentText), {
                    children: translate(message)
                })
            }),
            /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$DialogActions), {
                children: [
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Button1), {
                        onClick: onClose,
                        children: translate('ra.action.cancel')
                    }),
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Button1), {
                        onClick: ()=>login({
                                redirect: redirect || window.location.pathname + window.location.search
                            }),
                        color: "primary",
                        variant: "contained",
                        children: translate('auth.action.login')
                    })
                ]
            })
        ]
    });
};
var $7a4043d65a13021b$export$2e2bcd8739ae039 = $7a4043d65a13021b$var$AuthDialog;










const $cf49485181f5598e$var$delay = async (t)=>new Promise((resolve)=>setTimeout(resolve, t));
// Inspired from https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/auth/Login.tsx
const $cf49485181f5598e$var$SsoLoginPage = ({ children: children, backgroundImage: backgroundImage, buttons: buttons, userResource: userResource = 'Person', propertiesExist: propertiesExist = [], text: text, ...rest })=>{
    const containerRef = (0, $1obPJ$useRef)();
    let backgroundImageLoaded = false;
    const navigate = (0, $1obPJ$useNavigate)();
    const [searchParams] = (0, $1obPJ$useSearchParams)();
    const { data: identity, isLoading: isLoading } = (0, $1obPJ$useGetIdentity)();
    const notify = (0, $1obPJ$useNotify)();
    const login = (0, $1obPJ$useLogin)();
    const dataProvider = (0, $1obPJ$useDataProvider)();
    const authProvider = (0, $1obPJ$useAuthProvider)();
    (0, $1obPJ$useEffect)(()=>{
        if (!isLoading && identity?.id) // Already authenticated, redirect to the home page
        navigate(searchParams.get('redirect') || '/');
    }, [
        identity,
        isLoading,
        navigate,
        searchParams
    ]);
    (0, $1obPJ$useEffect)(()=>{
        (async ()=>{
            if (searchParams.has('login')) {
                if (searchParams.has('error')) {
                    if (searchParams.get('error') === 'registration.not-allowed') notify('auth.message.user_email_not_found', {
                        type: 'error'
                    });
                    else notify('auth.message.bad_request', {
                        type: 'error',
                        messageArgs: {
                            error: searchParams.get('error')
                        }
                    });
                } else if (searchParams.has('token')) {
                    const token = searchParams.get('token');
                    // @ts-expect-error TS(2339): Property 'webId' does not exist on type 'unknown'.
                    const { webId: webId } = (0, $1obPJ$jwtdecode)(token);
                    localStorage.setItem('token', token || '');
                    let userData;
                    ({ data: userData } = await dataProvider.getOne(userResource, {
                        id: webId
                    }));
                    if (propertiesExist.length > 0) {
                        // @ts-expect-error TS(7006): Parameter 'p' implicitly has an 'any' type.
                        let allPropertiesExist = propertiesExist.every((p)=>userData[p]);
                        while(!allPropertiesExist){
                            console.log('Waiting for all properties to have been created', propertiesExist);
                            await $cf49485181f5598e$var$delay(500);
                            ({ data: userData } = await dataProvider.getOne(userResource, {
                                id: webId
                            }));
                            allPropertiesExist = propertiesExist.every((p)=>userData[p]);
                        }
                    }
                    if (!authProvider?.checkUser(userData)) {
                        localStorage.removeItem('token');
                        notify('auth.message.user_not_allowed_to_login', {
                            type: 'error'
                        });
                        navigate('/login');
                    } else if (searchParams.has('redirect')) {
                        notify('auth.message.user_connected', {
                            type: 'info'
                        });
                        // @ts-expect-error TS(2322)
                        window.location.href = searchParams.get('redirect');
                    } else if (searchParams.has('new') && searchParams.get('new') === 'true') {
                        notify('auth.message.new_user_created', {
                            type: 'info'
                        });
                        window.location.href = `/${userResource}/${encodeURIComponent(webId)}`;
                    } else {
                        notify('auth.message.user_connected', {
                            type: 'info'
                        });
                        window.location.href = '/';
                    }
                }
            }
            if (searchParams.has('logout')) {
                // Delete token and any other value in local storage
                localStorage.clear();
                notify('auth.message.user_disconnected', {
                    type: 'info'
                });
                navigate('/');
            }
        })();
    }, [
        searchParams,
        navigate,
        notify,
        userResource
    ]);
    const updateBackgroundImage = ()=>{
        if (!backgroundImageLoaded && containerRef.current) {
            // @ts-expect-error TS(2339): Property 'style' does not exist on type 'never'.
            containerRef.current.style.backgroundImage = `url(${backgroundImage})`;
            backgroundImageLoaded = true;
        }
    };
    // Load background image asynchronously to speed up time to interactive
    const lazyLoadBackgroundImage = ()=>{
        if (backgroundImage) {
            const img = new Image();
            img.onload = updateBackgroundImage;
            img.src = backgroundImage;
        }
    };
    (0, $1obPJ$useEffect)(()=>{
        if (!backgroundImageLoaded) lazyLoadBackgroundImage();
    });
    if (isLoading) return null;
    return /*#__PURE__*/ (0, $1obPJ$jsx)($cf49485181f5598e$var$Root, {
        ...rest,
        ref: containerRef,
        children: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Card), {
            className: $cf49485181f5598e$export$388de65c72fa74b4.card,
            children: [
                /*#__PURE__*/ (0, $1obPJ$jsx)("div", {
                    className: $cf49485181f5598e$export$388de65c72fa74b4.avatar,
                    children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Avatar), {
                        className: $cf49485181f5598e$export$388de65c72fa74b4.icon,
                        children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$muiiconsmaterialLock), {})
                    })
                }),
                text && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Typography), {
                    variant: "body2" /* className={classes.text} */ ,
                    children: text
                }),
                buttons?.map((button, i)=>/*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$CardActions), {
                        children: /*#__PURE__*/ (0, $1obPJ$react).cloneElement(button, {
                            fullWidth: true,
                            variant: 'outlined',
                            type: 'submit',
                            onClick: ()=>login({}, '/login')
                        })
                    }, i))
            ]
        })
    });
};
const $cf49485181f5598e$var$PREFIX = 'SsoLoginPage';
const $cf49485181f5598e$export$388de65c72fa74b4 = {
    card: `${$cf49485181f5598e$var$PREFIX}-card`,
    avatar: `${$cf49485181f5598e$var$PREFIX}-avatar`,
    icon: `${$cf49485181f5598e$var$PREFIX}-icon`,
    switch: `${$cf49485181f5598e$var$PREFIX}-switch`
};
const $cf49485181f5598e$var$Root = (0, $1obPJ$styled1)('div', {
    name: $cf49485181f5598e$var$PREFIX,
    overridesResolver: (props, styles)=>styles.root
})(({ theme: theme })=>({
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        height: '1px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundImage: 'radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)',
        [`& .${$cf49485181f5598e$export$388de65c72fa74b4.card}`]: {
            minWidth: 300,
            marginTop: '6em'
        },
        [`& .${$cf49485181f5598e$export$388de65c72fa74b4.avatar}`]: {
            margin: '1em',
            display: 'flex',
            justifyContent: 'center'
        },
        [`& .${$cf49485181f5598e$export$388de65c72fa74b4.icon}`]: {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            backgroundColor: theme.palette.secondary[500]
        },
        [`& .${$cf49485181f5598e$export$388de65c72fa74b4.switch}`]: {
            marginBottom: '1em',
            display: 'flex',
            justifyContent: 'center'
        }
    }));
var $cf49485181f5598e$export$2e2bcd8739ae039 = $cf49485181f5598e$var$SsoLoginPage;


















const $251271bb4fe86cb1$var$useSignup = ()=>{
    const authProvider = (0, $1obPJ$useAuthProvider)();
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    return (0, $1obPJ$useCallback)((params = {})=>authProvider.signup(params), [
        authProvider
    ]);
};
var $251271bb4fe86cb1$export$2e2bcd8739ae039 = $251271bb4fe86cb1$var$useSignup;


// Inspired by https://github.com/bartlomiejzuber/password-strength-score
/**
 * Configuration options for password strength scoring
 *
 * The password strength is calculated based on:
 * - Password length (up to 4 points):
 * - 2 points if length >= 8 characters
 * - Additional 2 points if length >= 14 characters
 * - Character types (1 point each):
 * - Lowercase letters
 * - Uppercase letters
 * - Numbers
 * - Special characters
 *
 * Maximum possible score is 8 points
 * @typedef PasswordStrengthOptions
 * @property {number} isVeryLongLength - Number of characters required for a very long password (default: 14)
 * @property {number} isLongLength - Number of characters required for a long password (default: 8)
 * @property {number} isVeryLongScore - Additional score for a very long password (default: 2)
 * @property {number} isLongScore - Score for a long password (default: 2)
 * @property {number} uppercaseScore - Score for including uppercase letters (default: 1)
 * @property {number} lowercaseScore - Score for including lowercase letters (default: 1)
 * @property {number} numbersScore - Score for including numbers (default: 1)
 * @property {number} nonAlphanumericsScore - Score for including special characters (default: 1)
 */ /** @type {PasswordStrengthOptions} */ const $76384d8f832bd89c$export$ba43bf67f3d48107 = {
    isVeryLongLength: 14,
    isLongLength: 8,
    isLongScore: 2,
    isVeryLongScore: 2,
    uppercaseScore: 1,
    lowercaseScore: 1,
    numbersScore: 1,
    nonAlphanumericsScore: 1
};
const $76384d8f832bd89c$export$963a5c59734509bb = (password, options)=>{
    if (!password) return 0;
    const mergedOptions = {
        ...$76384d8f832bd89c$export$ba43bf67f3d48107,
        ...options
    };
    const lowercaseScore = /[a-z]/.test(password) && mergedOptions.lowercaseScore || 0;
    const uppercaseScore = /[A-Z]/.test(password) && mergedOptions.uppercaseScore || 0;
    const numbersScore = /\d/.test(password) && mergedOptions.numbersScore || 0;
    const nonalphasScore = /\W/.test(password) && mergedOptions.nonAlphanumericsScore || 0;
    // Calculate length score separately
    let lengthScore = 0;
    if (password.length >= mergedOptions.isVeryLongLength) lengthScore = mergedOptions.isLongScore + mergedOptions.isVeryLongScore;
    else if (password.length >= mergedOptions.isLongLength) lengthScore = mergedOptions.isLongScore;
    return uppercaseScore + lowercaseScore + numbersScore + nonalphasScore + lengthScore;
};
const $76384d8f832bd89c$export$b6086dad7504ebad = (password, options = $76384d8f832bd89c$export$ba43bf67f3d48107)=>{
    const mergedOptions = {
        ...$76384d8f832bd89c$export$ba43bf67f3d48107,
        ...options
    };
    const score = $76384d8f832bd89c$export$963a5c59734509bb(password, mergedOptions);
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /\W/.test(password);
    const isLong = password.length >= mergedOptions.isLongLength;
    const isVeryLong = password.length >= mergedOptions.isVeryLongLength;
    const suggestions = [];
    if (!hasLowercase) suggestions.push('add_lowercase_letters_a_z');
    if (!hasUppercase) suggestions.push('add_uppercase_letters_a_z');
    if (!hasNumbers) suggestions.push('add_numbers_0_9');
    if (!hasSpecial) suggestions.push('add_special_characters');
    if (!isLong) suggestions.push('make_it_at_least_8_characters_long');
    else if (!isVeryLong) suggestions.push('make_it_at_least_14_characters_long_for_maximum_strength');
    return {
        score: score,
        suggestions: suggestions,
        missingCriteria: {
            lowercase: !hasLowercase,
            uppercase: !hasUppercase,
            numbers: !hasNumbers,
            special: !hasSpecial,
            length: !isLong,
            veryLong: !isVeryLong
        }
    };
};
const $76384d8f832bd89c$export$a1d713a9155d58fc = (options = $76384d8f832bd89c$export$ba43bf67f3d48107, minRequiredScore = 5)=>{
    const mergedOptions = {
        ...$76384d8f832bd89c$export$ba43bf67f3d48107,
        ...options
    };
    return {
        scoreFn: (password)=>$76384d8f832bd89c$export$963a5c59734509bb(password, mergedOptions),
        analyzeFn: (password)=>$76384d8f832bd89c$export$b6086dad7504ebad(password, mergedOptions),
        minRequiredScore: minRequiredScore,
        maxScore: mergedOptions.uppercaseScore + mergedOptions.lowercaseScore + mergedOptions.numbersScore + mergedOptions.nonAlphanumericsScore + mergedOptions.isLongScore + mergedOptions.isVeryLongScore
    };
};
const $76384d8f832bd89c$export$19dcdb21c6965fb8 = $76384d8f832bd89c$export$a1d713a9155d58fc($76384d8f832bd89c$export$ba43bf67f3d48107, 5);


const $79d99fa54c4682fc$var$validatePasswordStrength = (scorer = (0, $76384d8f832bd89c$export$19dcdb21c6965fb8))=>(value)=>{
        if (!scorer) return undefined;
        const strength = scorer.scoreFn(value);
        if (strength < scorer.minRequiredScore) return 'auth.input.password_too_weak';
        return undefined;
    };
var $79d99fa54c4682fc$export$2e2bcd8739ae039 = $79d99fa54c4682fc$var$validatePasswordStrength;








/**
 * @typedef {object} Color
 * @property {number} red
 * @property {number} green
 * @property {number} blue
 */ /**
 * Calculate a rgb-color from a gradient between `color1` and `color2`
 * @param {number} fade - Indicates the fade between `color1` and `color2` in the range [0, 1].
 * @param {Color} color1
 * @param {Color} color2
 * @returns {string} `` `rgb(${red}, ${green}, ${blue})` ``
 */ const $f8f986295854a691$var$colorGradient = (fade, color1, color2)=>{
    const diffRed = color2.red - color1.red;
    const diffGreen = color2.green - color1.green;
    const diffBlue = color2.blue - color1.blue;
    const gradient = {
        red: Math.floor(color1.red + diffRed * fade),
        green: Math.floor(color1.green + diffGreen * fade),
        blue: Math.floor(color1.blue + diffBlue * fade)
    };
    return `rgb(${gradient.red},${gradient.green},${gradient.blue})`;
};
function $f8f986295854a691$export$2e2bcd8739ae039(props) {
    const { minVal: minVal, maxVal: maxVal, currentVal: currentVal, badColor: badColor, goodColor: goodColor, ...restProps } = props;
    const color1 = badColor || {
        red: 0xff,
        green: 0x40,
        blue: 0x47
    };
    const color2 = goodColor || {
        red: 0x00,
        green: 0xff,
        blue: 0x6e
    };
    const fade = Math.max(0, Math.min(1, (currentVal - minVal) / (maxVal - minVal)));
    const currentColor = $f8f986295854a691$var$colorGradient(fade, color1, color2);
    const StyledLinearProgress = (0, $1obPJ$withStyles)((0, $1obPJ$LinearProgress), {
        colorPrimary: {
            backgroundColor: 'black' // '#e0e0e0'
        },
        barColorPrimary: {
            backgroundColor: currentColor
        }
    });
    return /*#__PURE__*/ (0, $1obPJ$jsx)(StyledLinearProgress, {
        ...restProps,
        value: 100 * fade,
        variant: "determinate"
    });
}



function $8c52861ea4dbf938$export$2e2bcd8739ae039({ scorer: scorer = (0, $76384d8f832bd89c$export$19dcdb21c6965fb8), password: password, ...restProps }) {
    const strength = scorer.scoreFn(password);
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $f8f986295854a691$export$2e2bcd8739ae039), {
        currentVal: strength,
        minVal: 0,
        maxVal: scorer.maxScore,
        ...restProps
    });
}







const $14a371ab7c177429$export$439d29a4e110a164 = (0, $1obPJ$styled1)('span')({
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    width: '1px',
    whiteSpace: 'nowrap'
});
/**
 * Component that indicates a form field is required in an accessible way.
 *
 * How it works:
 * 1. Displays an asterisk (*) visually for sighted users
 * 2. Hides the asterisk from screen readers using aria-hidden="true"
 * 3. Provides explanatory text for screen readers via VisuallyHidden
 *
 * Usage:
 * ```tsx
 * <label>
 *   Name <RequiredFieldIndicator />
 * </label>
 * ```
 *
 * Result:
 * - Visual: "Name *"
 * - Screen reader: "Name This field is required"
 *
 * The message is internationalized using the 'auth.input.required_field_description' translation key
 */ const $14a371ab7c177429$var$RequiredFieldIndicator = ()=>{
    const translate = (0, $1obPJ$useTranslate)();
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Fragment), {
        children: [
            /*#__PURE__*/ (0, $1obPJ$jsx)("span", {
                "aria-hidden": "true",
                children: "*"
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)($14a371ab7c177429$export$439d29a4e110a164, {
                children: translate('auth.input.required_field_description')
            })
        ]
    });
};
var $14a371ab7c177429$export$2e2bcd8739ae039 = $14a371ab7c177429$var$RequiredFieldIndicator;


/**
 * @param onSignup Optional function to call when signup is completed. Called after the `delayBeforeRedirect`.
 * @param additionalSignupValues Passed to react-admin's signup function.
 * @param delayBeforeRedirect In milliseconds
 * @param passwordScorer Scorer to evaluate and indicate password strength.
 *  Set to `null` or `false`, if you don't want password strength checks. Default is
 *  passwordStrength's `defaultScorer`.
 * @returns
 */ const $abd712f6afb101e7$var$SignupForm = ({ passwordScorer: passwordScorer = (0, $76384d8f832bd89c$export$19dcdb21c6965fb8), onSignup: onSignup, additionalSignupValues: additionalSignupValues = {}, delayBeforeRedirect: delayBeforeRedirect = 0, redirectTo: redirectTo })=>{
    const [searchParams] = (0, $1obPJ$useSearchParams)();
    const [handleSubmit, setHandleSubmit] = (0, $1obPJ$useState)(()=>{});
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Form), {
        onSubmit: handleSubmit,
        noValidate: true,
        defaultValues: {
            email: searchParams.get('email')
        },
        children: /*#__PURE__*/ (0, $1obPJ$jsx)($abd712f6afb101e7$var$FormContent, {
            passwordScorer: passwordScorer,
            additionalSignupValues: additionalSignupValues,
            onSignup: onSignup,
            delayBeforeRedirect: delayBeforeRedirect,
            setHandleSubmit: setHandleSubmit,
            redirectTo: redirectTo
        })
    });
};
const $abd712f6afb101e7$var$FormContent = ({ passwordScorer: passwordScorer = (0, $76384d8f832bd89c$export$19dcdb21c6965fb8), onSignup: onSignup, additionalSignupValues: additionalSignupValues, delayBeforeRedirect: delayBeforeRedirect = 0, setHandleSubmit: setHandleSubmit, redirectTo: redirectTo })=>{
    const [loading, setLoading] = (0, $1obPJ$useSafeSetState)(false);
    const [showPassword, setShowPassword] = (0, $1obPJ$useState)(false);
    const [passwordAnalysis, setPasswordAnalysis] = (0, $1obPJ$useState)(null);
    const signup = (0, $251271bb4fe86cb1$export$2e2bcd8739ae039)();
    const translate = (0, $1obPJ$useTranslate)();
    const notify = (0, $1obPJ$useNotify)();
    const [searchParams] = (0, $1obPJ$useSearchParams)();
    const [locale] = (0, $1obPJ$useLocaleState)();
    const [password, setPassword] = (0, $1obPJ$useState)('');
    const formContext = (0, $1obPJ$useFormContext)();
    const togglePassword = ()=>{
        setShowPassword(!showPassword);
    };
    (0, $1obPJ$useEffect)(()=>{
        setHandleSubmit(()=>async (values)=>{
                try {
                    setLoading(true);
                    await signup({
                        ...values,
                        ...additionalSignupValues
                    });
                    setTimeout(()=>{
                        if (onSignup) onSignup(redirectTo);
                        else window.location.href = redirectTo;
                    }, delayBeforeRedirect);
                } catch (error) {
                    setLoading(false);
                    notify(typeof error === 'string' ? error : typeof error === 'undefined' || !error.message ? 'ra.auth.sign_in_error' : error.message, {
                        type: 'error',
                        _: typeof error === 'string' ? error : error?.message ? error.message : undefined
                    });
                    formContext.reset({
                        ...values
                    }, {
                        keepDirty: true,
                        keepErrors: true
                    });
                }
            });
    }, [
        setLoading,
        signup,
        additionalSignupValues,
        redirectTo,
        notify,
        onSignup,
        formContext
    ]);
    (0, $1obPJ$useEffect)(()=>{
        if (password && passwordScorer) {
            const analysis = passwordScorer.analyzeFn(password);
            setPasswordAnalysis(analysis);
        } else setPasswordAnalysis(null);
    }, [
        password,
        passwordScorer
    ]);
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$CardContent), {
        children: [
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextInput), {
                autoFocus: true,
                source: "username",
                label: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Fragment), {
                    children: [
                        translate('auth.input.username'),
                        /*#__PURE__*/ (0, $1obPJ$jsx)((0, $14a371ab7c177429$export$2e2bcd8739ae039), {})
                    ]
                }),
                autoComplete: "username",
                fullWidth: true,
                disabled: loading,
                validate: [
                    (0, $1obPJ$required)(translate('auth.required.identifier')),
                    (0, $1obPJ$minLength)(2)
                ],
                format: (value)=>value ? (0, $1obPJ$speakingurl)(value, {
                        lang: locale || 'fr',
                        separator: '_',
                        custom: [
                            '.',
                            '-',
                            '0',
                            '1',
                            '2',
                            '3',
                            '4',
                            '5',
                            '6',
                            '7',
                            '8',
                            '9'
                        ]
                    }) : ''
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextInput), {
                source: "email",
                label: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Fragment), {
                    children: [
                        translate('auth.input.email'),
                        /*#__PURE__*/ (0, $1obPJ$jsx)((0, $14a371ab7c177429$export$2e2bcd8739ae039), {})
                    ]
                }),
                autoComplete: "email",
                fullWidth: true,
                disabled: loading || searchParams.has('email') && searchParams.has('force-email'),
                validate: [
                    (0, $1obPJ$required)('auth.required.email'),
                    (0, $1obPJ$email)()
                ]
            }),
            passwordScorer && password && !(searchParams.has('email') && searchParams.has('force-email')) && /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Fragment), {
                children: [
                    /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Typography), {
                        variant: "caption",
                        style: {
                            marginBottom: 3
                        },
                        children: [
                            translate('auth.input.password_strength'),
                            ":",
                            ' '
                        ]
                    }),
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $8c52861ea4dbf938$export$2e2bcd8739ae039), {
                        password: password,
                        scorer: passwordScorer,
                        sx: {
                            width: '100%'
                        }
                    }),
                    passwordAnalysis && passwordAnalysis.suggestions.length > 0 && /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Typography), {
                        variant: "caption",
                        color: "textSecondary",
                        component: "div",
                        sx: {
                            mt: 1,
                            mb: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5
                        },
                        children: [
                            translate('auth.input.password_suggestions'),
                            ":",
                            passwordAnalysis.suggestions.map((suggestion, index)=>{
                                const translationKey = `auth.input.password_suggestion.${suggestion}`;
                                const translatedText = translate(translationKey);
                                return /*#__PURE__*/ (0, $1obPJ$jsxs)("span", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    },
                                    children: [
                                        "\u2022 ",
                                        translatedText
                                    ]
                                }, index);
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0, $1obPJ$jsxs)("div", {
                className: "password-container",
                style: {
                    position: 'relative'
                },
                children: [
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextInput), {
                        source: "password",
                        type: showPassword ? 'text' : 'password',
                        value: password,
                        onChange: (e)=>{
                            setPassword(e.target.value);
                        },
                        label: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Fragment), {
                            children: [
                                translate('ra.auth.password'),
                                /*#__PURE__*/ (0, $1obPJ$jsx)((0, $14a371ab7c177429$export$2e2bcd8739ae039), {})
                            ]
                        }),
                        autoComplete: "new-password",
                        fullWidth: true,
                        disabled: loading,
                        validate: [
                            (0, $1obPJ$required)('auth.required.password'),
                            (0, $79d99fa54c4682fc$export$2e2bcd8739ae039)(passwordScorer)
                        ],
                        "aria-describedby": "signup-password-desc"
                    }),
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $14a371ab7c177429$export$439d29a4e110a164), {
                        id: "signup-password-desc",
                        children: translate('auth.input.password_description')
                    }),
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$IconButton), {
                        "aria-label": translate(showPassword ? 'auth.action.hide_password' : 'auth.action.show_password'),
                        onClick: togglePassword,
                        style: {
                            position: 'absolute',
                            right: '8px',
                            top: '17px',
                            padding: '4px'
                        },
                        size: "large",
                        children: showPassword ? /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$VisibilityOff), {}) : /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Visibility), {})
                    })
                ]
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Button1), {
                variant: "contained",
                type: "submit",
                color: "primary",
                disabled: loading,
                fullWidth: true,
                children: translate('auth.action.signup')
            })
        ]
    });
};
var $abd712f6afb101e7$export$2e2bcd8739ae039 = $abd712f6afb101e7$var$SignupForm;










const $326df91dd4ec3405$var$LoginForm = ({ onLogin: onLogin, allowUsername: allowUsername, redirectTo: redirectTo })=>{
    const [searchParams] = (0, $1obPJ$useSearchParams)();
    const [handleSubmit, setHandleSubmit] = (0, $1obPJ$useState)(()=>{});
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Form), {
        onSubmit: handleSubmit,
        noValidate: true,
        defaultValues: {
            email: searchParams.get('email')
        },
        children: /*#__PURE__*/ (0, $1obPJ$jsx)($326df91dd4ec3405$var$FormContent, {
            onLogin: onLogin,
            allowUsername: allowUsername,
            setHandleSubmit: setHandleSubmit,
            redirectTo: redirectTo
        })
    });
};
const $326df91dd4ec3405$var$FormContent = ({ onLogin: onLogin, allowUsername: allowUsername, setHandleSubmit: setHandleSubmit, redirectTo: redirectTo })=>{
    const [loading, setLoading] = (0, $1obPJ$useSafeSetState)(false);
    const [showPassword, setShowPassword] = (0, $1obPJ$useState)(false);
    const login = (0, $1obPJ$useLogin)();
    const translate = (0, $1obPJ$useTranslate)();
    const notify = (0, $1obPJ$useNotify)();
    const [searchParams] = (0, $1obPJ$useSearchParams)();
    const formContext = (0, $1obPJ$useFormContext)();
    const togglePassword = ()=>{
        setShowPassword(!showPassword);
    };
    (0, $1obPJ$useEffect)(()=>{
        setHandleSubmit(()=>async (values)=>{
                try {
                    setLoading(true);
                    await login(values);
                    if (onLogin) onLogin(redirectTo);
                    else window.location.href = redirectTo;
                } catch (error) {
                    setLoading(false);
                    notify(typeof error === 'string' ? error : typeof error === 'undefined' || !error.message ? 'ra.auth.sign_in_error' : error.message, {
                        type: 'error',
                        messageArgs: {
                            _: typeof error === 'string' ? error : error?.message ? error.message : undefined
                        }
                    });
                    formContext.reset({
                        ...values
                    }, {
                        keepDirty: true,
                        keepErrors: true
                    });
                }
            });
    }, [
        setLoading,
        login,
        redirectTo,
        notify,
        onLogin
    ]);
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$CardContent), {
        children: [
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextInput), {
                source: "username",
                label: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Fragment), {
                    children: [
                        translate(allowUsername ? 'auth.input.username_or_email' : 'auth.input.email'),
                        /*#__PURE__*/ (0, $1obPJ$jsx)((0, $14a371ab7c177429$export$2e2bcd8739ae039), {})
                    ]
                }),
                autoComplete: "email",
                fullWidth: true,
                disabled: loading || searchParams.has('email') && searchParams.has('force-email'),
                format: (value)=>value ? value.toLowerCase() : '',
                validate: allowUsername ? [
                    (0, $1obPJ$required)(translate('auth.required.identifier'))
                ] : [
                    (0, $1obPJ$required)(translate('auth.required.identifier')),
                    (0, $1obPJ$email)()
                ]
            }),
            /*#__PURE__*/ (0, $1obPJ$jsxs)("div", {
                className: "password-container",
                style: {
                    position: 'relative'
                },
                children: [
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextInput), {
                        source: "password",
                        type: showPassword ? 'text' : 'password',
                        label: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Fragment), {
                            children: [
                                translate('ra.auth.password'),
                                /*#__PURE__*/ (0, $1obPJ$jsx)((0, $14a371ab7c177429$export$2e2bcd8739ae039), {})
                            ]
                        }),
                        autoComplete: "current-password",
                        fullWidth: true,
                        disabled: loading,
                        validate: (0, $1obPJ$required)(translate('auth.required.password')),
                        "aria-describedby": "password-desc"
                    }),
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $14a371ab7c177429$export$439d29a4e110a164), {
                        id: "password-desc",
                        children: translate('auth.input.password_description')
                    }),
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$IconButton), {
                        "aria-label": translate(showPassword ? 'auth.action.hide_password' : 'auth.action.show_password'),
                        onClick: togglePassword,
                        style: {
                            position: 'absolute',
                            right: '8px',
                            top: '17px',
                            padding: '4px'
                        },
                        size: "large",
                        children: showPassword ? /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$VisibilityOff), {}) : /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Visibility), {})
                    })
                ]
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Button1), {
                variant: "contained",
                type: "submit",
                color: "primary",
                disabled: loading,
                fullWidth: true,
                children: translate('auth.action.login')
            })
        ]
    });
};
$326df91dd4ec3405$var$LoginForm.defaultValues = {
    allowUsername: false
};
var $326df91dd4ec3405$export$2e2bcd8739ae039 = $326df91dd4ec3405$var$LoginForm;












const $ddc5b4ef9210a90f$var$samePassword = (value, allValues)=>{
    if (value && value !== allValues.password) return 'auth.input.password_mismatch';
};
/**
 *
 * @param {string} redirectTo
 * @param {typeof defaultScorer} passwordScorer Scorer to evaluate and indicate password strength.
 *  Set to `null` or `false`, if you don't want password strength checks. Default is
 *  passwordStrength's `defaultScorer`.
 * @returns
 */ const $ddc5b4ef9210a90f$var$NewPasswordForm = ({ redirectTo: redirectTo, passwordScorer: passwordScorer = (0, $76384d8f832bd89c$export$19dcdb21c6965fb8) })=>{
    const [searchParams] = (0, $1obPJ$useSearchParams)();
    const [handleSubmit, setHandleSubmit] = (0, $1obPJ$useState)(()=>{});
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Form), {
        onSubmit: handleSubmit,
        noValidate: true,
        defaultValues: {
            email: searchParams.get('email')
        },
        children: /*#__PURE__*/ (0, $1obPJ$jsx)($ddc5b4ef9210a90f$var$FormContent, {
            setHandleSubmit: setHandleSubmit,
            redirectTo: redirectTo,
            passwordScorer: passwordScorer
        })
    });
};
const $ddc5b4ef9210a90f$var$FormContent = ({ setHandleSubmit: setHandleSubmit, redirectTo: redirectTo, passwordScorer: passwordScorer })=>{
    const location = (0, $1obPJ$useLocation)();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const [loading, setLoading] = (0, $1obPJ$useSafeSetState)(false);
    const [showNewPassword, setShowNewPassword] = (0, $1obPJ$useState)(false);
    const [showConfirmPassword, setShowConfirmPassword] = (0, $1obPJ$useState)(false);
    const authProvider = (0, $1obPJ$useAuthProvider)();
    const translate = (0, $1obPJ$useTranslate)();
    const notify = (0, $1obPJ$useNotify)();
    const [newPassword, setNewPassword] = (0, $1obPJ$useState)('');
    const [passwordAnalysis, setPasswordAnalysis] = (0, $1obPJ$useState)(null);
    const toggleNewPassword = ()=>{
        setShowNewPassword(!showNewPassword);
    };
    const toggleConfirmPassword = ()=>{
        setShowConfirmPassword(!showConfirmPassword);
    };
    (0, $1obPJ$useEffect)(()=>{
        setHandleSubmit(()=>async (values)=>{
                setLoading(true);
                authProvider?.setNewPassword({
                    ...values,
                    token: token
                }).then(()=>{
                    setTimeout(()=>{
                        const url = new URL('/login', window.location.origin);
                        if (redirectTo) url.searchParams.append('redirect', redirectTo);
                        url.searchParams.append('email', values.email);
                        window.location.href = url.toString();
                        setLoading(false);
                    }, 2000);
                    notify('auth.notification.password_changed', {
                        type: 'info'
                    });
                }).catch((error)=>{
                    setLoading(false);
                    notify(typeof error === 'string' ? error : !error.message ? 'auth.notification.reset_password_error' : error.message, {
                        type: 'warning',
                        messageArgs: {
                            _: typeof error === 'string' ? error : error && error.message ? error.message : undefined
                        }
                    });
                });
            });
    });
    (0, $1obPJ$useEffect)(()=>{
        if (newPassword && passwordScorer) {
            const analysis = passwordScorer.analyzeFn(newPassword);
            setPasswordAnalysis(analysis);
        } else setPasswordAnalysis(null);
    }, [
        newPassword,
        passwordScorer
    ]);
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$CardContent), {
        children: [
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextInput), {
                autoFocus: true,
                source: "email",
                label: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Fragment), {
                    children: [
                        translate('auth.input.email'),
                        /*#__PURE__*/ (0, $1obPJ$jsx)((0, $14a371ab7c177429$export$2e2bcd8739ae039), {})
                    ]
                }),
                autoComplete: "email",
                fullWidth: true,
                disabled: loading,
                validate: (0, $1obPJ$required)(translate('auth.required.newPassword')),
                format: (value)=>value ? value.toLowerCase() : ''
            }),
            passwordScorer && newPassword && /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Fragment), {
                children: [
                    /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Typography), {
                        variant: "caption",
                        style: {
                            marginBottom: 3
                        },
                        children: [
                            translate('auth.input.password_strength'),
                            ":",
                            ' '
                        ]
                    }),
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $8c52861ea4dbf938$export$2e2bcd8739ae039), {
                        password: newPassword,
                        scorer: passwordScorer,
                        sx: {
                            width: '100%'
                        }
                    }),
                    passwordAnalysis && passwordAnalysis.suggestions.length > 0 && /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Typography), {
                        variant: "caption",
                        color: "textSecondary",
                        component: "div",
                        sx: {
                            mt: 1,
                            mb: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5
                        },
                        children: [
                            translate('auth.input.password_suggestions'),
                            ":",
                            passwordAnalysis.suggestions.map((suggestion, index)=>{
                                const translationKey = `auth.input.password_suggestion.${suggestion}`;
                                return /*#__PURE__*/ (0, $1obPJ$jsxs)("span", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    },
                                    children: [
                                        "\u2022 ",
                                        translate(translationKey)
                                    ]
                                }, index);
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0, $1obPJ$jsxs)("div", {
                className: "password-container",
                style: {
                    position: 'relative'
                },
                children: [
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextInput), {
                        autoFocus: true,
                        type: showNewPassword ? 'text' : 'password',
                        source: "password",
                        value: newPassword,
                        label: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Fragment), {
                            children: [
                                translate('auth.input.new_password'),
                                /*#__PURE__*/ (0, $1obPJ$jsx)((0, $14a371ab7c177429$export$2e2bcd8739ae039), {})
                            ]
                        }),
                        autoComplete: "current-password",
                        fullWidth: true,
                        disabled: loading,
                        validate: [
                            (0, $1obPJ$required)(translate('auth.required.newPasswordAgain')),
                            (0, $79d99fa54c4682fc$export$2e2bcd8739ae039)(passwordScorer)
                        ],
                        onChange: (e)=>{
                            setNewPassword(e.target.value);
                        },
                        "aria-describedby": "new-password-desc"
                    }),
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $14a371ab7c177429$export$439d29a4e110a164), {
                        id: "new-password-desc",
                        children: translate('auth.input.password_description')
                    }),
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$IconButton), {
                        "aria-label": translate(showNewPassword ? 'auth.action.hide_password' : 'auth.action.show_password'),
                        onClick: toggleNewPassword,
                        style: {
                            position: 'absolute',
                            right: '8px',
                            top: '17px',
                            padding: '4px'
                        },
                        size: "large",
                        children: showNewPassword ? /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$VisibilityOff), {}) : /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Visibility), {})
                    })
                ]
            }),
            /*#__PURE__*/ (0, $1obPJ$jsxs)("div", {
                className: "password-container",
                style: {
                    position: 'relative'
                },
                children: [
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextInput), {
                        type: showConfirmPassword ? 'text' : 'password',
                        source: "confirm-password",
                        label: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Fragment), {
                            children: [
                                translate('auth.input.confirm_new_password'),
                                /*#__PURE__*/ (0, $1obPJ$jsx)((0, $14a371ab7c177429$export$2e2bcd8739ae039), {})
                            ]
                        }),
                        autoComplete: "current-password",
                        fullWidth: true,
                        disabled: loading,
                        validate: [
                            (0, $1obPJ$required)(),
                            $ddc5b4ef9210a90f$var$samePassword
                        ],
                        "aria-describedby": "confirm-password-desc"
                    }),
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $14a371ab7c177429$export$439d29a4e110a164), {
                        id: "confirm-password-desc",
                        children: translate('auth.input.password_description')
                    }),
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$IconButton), {
                        "aria-label": translate(showConfirmPassword ? 'auth.action.hide_password' : 'auth.action.show_password'),
                        onClick: toggleConfirmPassword,
                        style: {
                            position: 'absolute',
                            right: '8px',
                            top: '17px',
                            padding: '4px'
                        },
                        size: "large",
                        children: showConfirmPassword ? /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$VisibilityOff), {}) : /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Visibility), {})
                    })
                ]
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Button1), {
                variant: "contained",
                type: "submit",
                color: "primary",
                disabled: loading,
                fullWidth: true,
                children: translate('auth.action.set_new_password')
            })
        ]
    });
};
var $ddc5b4ef9210a90f$export$2e2bcd8739ae039 = $ddc5b4ef9210a90f$var$NewPasswordForm;







const $4c941e9b40342087$var$ResetPasswordForm = ()=>{
    const [handleSubmit, setHandleSubmit] = (0, $1obPJ$useState)(()=>{});
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Form), {
        onSubmit: handleSubmit,
        noValidate: true,
        children: /*#__PURE__*/ (0, $1obPJ$jsx)($4c941e9b40342087$var$FormContent, {
            setHandleSubmit: setHandleSubmit
        })
    });
};
const $4c941e9b40342087$var$FormContent = ({ setHandleSubmit: setHandleSubmit })=>{
    const [loading, setLoading] = (0, $1obPJ$useSafeSetState)(false);
    const authProvider = (0, $1obPJ$useAuthProvider)();
    const translate = (0, $1obPJ$useTranslate)();
    const notify = (0, $1obPJ$useNotify)();
    (0, $1obPJ$useEffect)(()=>{
        setHandleSubmit(()=>async (values)=>{
                setLoading(true);
                authProvider?.resetPassword({
                    ...values
                }).then(()=>{
                    setLoading(false);
                    notify('auth.notification.reset_password_submitted', {
                        type: 'info'
                    });
                }).catch((error)=>{
                    setLoading(false);
                    notify(typeof error === 'string' ? error : !error.message ? 'auth.notification.reset_password_error' : error.message, {
                        type: 'warning',
                        messageArgs: {
                            _: typeof error === 'string' ? error : error && error.message ? error.message : undefined
                        }
                    });
                });
            });
    });
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$CardContent), {
        children: [
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextInput), {
                autoFocus: true,
                source: "email",
                label: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Fragment), {
                    children: [
                        translate('auth.input.email'),
                        /*#__PURE__*/ (0, $1obPJ$jsx)((0, $14a371ab7c177429$export$2e2bcd8739ae039), {})
                    ]
                }),
                autoComplete: "email",
                fullWidth: true,
                disabled: loading,
                validate: (0, $1obPJ$required)(translate('auth.required.email')),
                format: (value)=>value ? value.toLowerCase() : ''
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Button1), {
                variant: "contained",
                type: "submit",
                color: "primary",
                disabled: loading,
                fullWidth: true,
                children: translate('auth.action.submit')
            })
        ]
    });
};
var $4c941e9b40342087$export$2e2bcd8739ae039 = $4c941e9b40342087$var$ResetPasswordForm;







// TODO jss-to-tss-react codemod: '@global' is not supported by tss-react.
// See https://mui.com/material-ui/customization/how-to-customize/#4-global-css-override for alternatives.
const $771ddf0b1808bdd9$var$useStyles = (0, $1obPJ$makeStyles)()((theme)=>({
        root: {
            backgroundColor: theme.palette.secondary.main,
            minHeight: '100%',
            [theme.breakpoints.down('sm')]: {
                padding: '1em'
            }
        },
        card: {
            width: '100%',
            maxWidth: 450,
            marginTop: '6em'
        },
        icon: {
            marginTop: 5,
            marginRight: 5
        },
        title: {
            [theme.breakpoints.down('sm')]: {
                fontWeight: 'bold',
                marginTop: 12
            }
        }
    }));
const $771ddf0b1808bdd9$var$SimpleBox = ({ title: title, icon: icon, text: text, children: children })=>{
    const { classes: classes } = $771ddf0b1808bdd9$var$useStyles();
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Fragment), {
        children: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Box), {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            className: classes.root,
            children: [
                /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Card), {
                    className: classes.card,
                    children: [
                        /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Box), {
                            p: 2,
                            display: "flex",
                            justifyContent: "start",
                            children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Typography), {
                                variant: "h4",
                                className: classes.title,
                                children: title
                            })
                        }),
                        /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Box), {
                            pl: 2,
                            pr: 2,
                            children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Typography), {
                                variant: "body1",
                                children: text
                            })
                        }),
                        children
                    ]
                }),
                /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Notification), {})
            ]
        })
    });
};
var $771ddf0b1808bdd9$export$2e2bcd8739ae039 = $771ddf0b1808bdd9$var$SimpleBox;



const $621b4faa79920030$var$USED_SEARCH_PARAMS = [
    'signup',
    'reset_password',
    'new_password',
    'email',
    'force-email'
];
const $621b4faa79920030$var$getSearchParamsRest = (searchParams)=>{
    const rest = [];
    for (const [key, value] of searchParams.entries())if (!$621b4faa79920030$var$USED_SEARCH_PARAMS.includes(key)) rest.push(`${key}=${encodeURIComponent(value)}`);
    return rest.length > 0 ? rest.join('&') : '';
};
var $621b4faa79920030$export$2e2bcd8739ae039 = $621b4faa79920030$var$getSearchParamsRest;



/**
 * @param {object} props Props
 * @param {boolean} props.hasSignup If to show signup form.
 * @param {boolean} props.allowUsername Indicates, if login is allowed with username (instead of email).
 * @param {function} props.onLogin Optional function to call when login is completed
 * @param {function} props.onSignup Optional function to call when signup is completed
 * @param {object} props.additionalSignupValues
 * @param {object} props.passwordScorer Scorer to evaluate and indicate password strength.
 *  Set to `null` or `false`, if you don't want password strength checks. Default is
 *  passwordStrength's `defaultScorer`.
 * @returns
 */ const $c30cd9b373befd20$var$LocalLoginPage = ({ hasSignup: hasSignup = true, allowUsername: allowUsername = false, onLogin: onLogin, onSignup: onSignup, additionalSignupValues: additionalSignupValues = {}, passwordScorer: passwordScorer = (0, $76384d8f832bd89c$export$19dcdb21c6965fb8) })=>{
    const translate = (0, $1obPJ$useTranslate)();
    const [searchParams] = (0, $1obPJ$useSearchParams)();
    const isSignup = hasSignup && searchParams.has('signup');
    const isResetPassword = searchParams.has('reset_password');
    const isNewPassword = searchParams.has('new_password');
    const isLogin = !isSignup && !isResetPassword && !isNewPassword;
    const redirectTo = (0, $ee80a6b397c7131d$export$bab98af026af71ac)(searchParams.get('redirect')) || (0, $ee80a6b397c7131d$export$50ae7fb6f87de989)(searchParams.get('redirect')) ? searchParams.get('redirect') : '/';
    const { data: identity, isLoading: isLoading } = (0, $1obPJ$useGetIdentity)();
    (0, $1obPJ$useEffect)(()=>{
        (async ()=>{
            if (!isLoading && identity?.id) {
                if (onLogin) onLogin(redirectTo);
                else // @ts-expect-error TS(2322): Type 'string | null' is not assignable to type 'st... Remove this comment to see the full error message
                window.location.href = redirectTo;
            }
        })();
    }, [
        identity,
        isLoading,
        redirectTo,
        onLogin
    ]);
    const [title, text] = (0, $1obPJ$useMemo)(()=>{
        if (isSignup) return [
            'auth.action.signup',
            'auth.helper.signup'
        ];
        if (isLogin) return [
            'auth.action.login',
            'auth.helper.login'
        ];
        if (isResetPassword) return [
            'auth.action.reset_password',
            'auth.helper.reset_password'
        ];
        if (isNewPassword) return [
            'auth.action.set_new_password',
            'auth.helper.set_new_password'
        ];
        return [
            '',
            ''
        ];
    }, [
        isSignup,
        isLogin,
        isResetPassword,
        isNewPassword
    ]);
    if (isLoading || identity?.id) return null;
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $771ddf0b1808bdd9$export$2e2bcd8739ae039), {
        title: translate(title),
        text: translate(text),
        icon: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$muiiconsmaterialLock), {}),
        children: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Card), {
            children: [
                isLogin && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $326df91dd4ec3405$export$2e2bcd8739ae039), {
                    onLogin: onLogin,
                    redirectTo: redirectTo || '',
                    allowUsername: allowUsername
                }),
                isSignup && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $abd712f6afb101e7$export$2e2bcd8739ae039), {
                    delayBeforeRedirect: 4000,
                    redirectTo: redirectTo || '',
                    onSignup: onSignup,
                    additionalSignupValues: additionalSignupValues,
                    passwordScorer: passwordScorer
                }),
                isResetPassword && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $4c941e9b40342087$export$2e2bcd8739ae039), {}),
                isNewPassword && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $ddc5b4ef9210a90f$export$2e2bcd8739ae039), {
                    redirectTo: redirectTo || '',
                    passwordScorer: passwordScorer
                }),
                /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Box), {
                    sx: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mt: -1,
                        mb: 2
                    },
                    children: [
                        (isSignup || isResetPassword) && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Link), {
                            to: `/login?${(0, $621b4faa79920030$export$2e2bcd8739ae039)(searchParams)}`,
                            children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Typography), {
                                variant: "body2",
                                children: translate('auth.action.login')
                            })
                        }),
                        isLogin && /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Fragment), {
                            children: [
                                hasSignup && /*#__PURE__*/ (0, $1obPJ$jsx)("div", {
                                    children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Link), {
                                        to: `/login?signup=true&${(0, $621b4faa79920030$export$2e2bcd8739ae039)(searchParams)}`,
                                        children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Typography), {
                                            variant: "body2",
                                            children: translate('auth.action.signup')
                                        })
                                    })
                                }),
                                /*#__PURE__*/ (0, $1obPJ$jsx)("div", {
                                    children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Link), {
                                        to: `/login?reset_password=true&${(0, $621b4faa79920030$export$2e2bcd8739ae039)(searchParams)}`,
                                        children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Typography), {
                                            variant: "body2",
                                            children: translate('auth.action.reset_password')
                                        })
                                    })
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    });
};
var $c30cd9b373befd20$export$2e2bcd8739ae039 = $c30cd9b373befd20$var$LocalLoginPage;







// Not used for now. The ListWithPermissions component will handle the conditional display of the Create button.
const $646e01868df02899$var$ResourceWithPermission = ({ name: name, create: create, ...rest })=>{
    const createContainer = (0, $1obPJ$useCreateContainerUri)(name);
    const { permissions: permissions } = (0, $1obPJ$usePermissions)({
        uri: createContainer
    });
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Resource), {
        ...rest,
        name: name,
        create: permissions && permissions.some((p)=>(0, $dd9154ee844248d7$export$65615a101bd6f5ca).includes(p['acl:mode'])) ? create : undefined
    });
};
var $646e01868df02899$export$2e2bcd8739ae039 = $646e01868df02899$var$ResourceWithPermission;









// It's important to pass the ref to allow Material UI to manage the keyboard navigation
// @ts-expect-error TS(2339): Property 'label' does not exist on type '{}'.
const $af962a36e574b739$var$UserMenuItem = /*#__PURE__*/ (0, $1obPJ$forwardRef)(({ label: label, icon: icon, to: to, ...rest }, ref)=>{
    const { onClose: onClose } = (0, $1obPJ$useUserMenu)() || {};
    const translate = (0, $1obPJ$useTranslate)();
    const navigate = (0, $1obPJ$useNavigate)();
    const onClick = (0, $1obPJ$useCallback)(()=>{
        navigate(to);
        onClose?.();
    }, [
        to,
        onClose,
        navigate
    ]);
    return(// @ts-expect-error TS(2769): No overload matches this call.
    /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$MenuItem), {
        onClick: onClick,
        ref: ref,
        ...rest,
        children: [
            icon && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ListItemIcon), {
                children: /*#__PURE__*/ (0, $1obPJ$react).cloneElement(icon, {
                    fontSize: 'small'
                })
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ListItemText), {
                children: translate(label)
            })
        ]
    }));
});
const $af962a36e574b739$var$UserMenu = ({ logout: logout, profileResource: profileResource, ...otherProps })=>{
    const { data: identity } = (0, $1obPJ$useGetIdentity)();
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$UserMenu), {
        ...otherProps,
        children: identity && identity.id !== '' ? [
            /*#__PURE__*/ (0, $1obPJ$jsx)($af962a36e574b739$var$UserMenuItem, {
                // @ts-expect-error TS(2322): Type '{ key: string; label: string; icon: Element;... Remove this comment to see the full error message
                label: "auth.action.view_my_profile",
                icon: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$muiiconsmaterialAccountCircle), {}),
                to: `/${profileResource || 'Person'}/${encodeURIComponent(identity?.profileData?.id || identity.id)}/show`
            }, "view"),
            /*#__PURE__*/ (0, $1obPJ$jsx)($af962a36e574b739$var$UserMenuItem, {
                // @ts-expect-error TS(2322): Type '{ key: string; label: string; icon: Element;... Remove this comment to see the full error message
                label: "auth.action.edit_my_profile",
                icon: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$muiiconsmaterialEdit), {}),
                to: `/${profileResource || 'Person'}/${encodeURIComponent(identity?.profileData?.id || identity.id)}`
            }, "edit"),
            /*#__PURE__*/ (0, $1obPJ$react).cloneElement(logout || /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Logout), {}), {
                key: 'logout'
            })
        ] : [
            // @ts-expect-error TS(2322): Type '{ key: string; label: string; to: string; }'... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $1obPJ$jsx)($af962a36e574b739$var$UserMenuItem, {
                label: "auth.action.signup",
                to: "/login?signup=true"
            }, "signup"),
            // @ts-expect-error TS(2322): Type '{ key: string; label: string; to: string; }'... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $1obPJ$jsx)($af962a36e574b739$var$UserMenuItem, {
                label: "auth.action.login",
                to: "/login"
            }, "login")
        ]
    });
};
var $af962a36e574b739$export$2e2bcd8739ae039 = $af962a36e574b739$var$UserMenu;






const $2c7b6595dba0d953$var$useCheckAuthenticated = (message)=>{
    const { data: identity, isLoading: isLoading } = (0, $1obPJ$useGetIdentity)();
    const notify = (0, $1obPJ$useNotify)();
    const redirect = (0, $1obPJ$useRedirect)();
    const location = (0, $1obPJ$useLocation)();
    (0, $1obPJ$useEffect)(()=>{
        if (!isLoading && !identity?.id) {
            notify(message || 'ra.auth.auth_check_error', {
                type: 'error'
            });
            redirect(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
        }
    }, [
        isLoading,
        identity,
        redirect,
        notify,
        location
    ]);
    return {
        identity: identity,
        isLoading: isLoading
    };
};
var $2c7b6595dba0d953$export$2e2bcd8739ae039 = $2c7b6595dba0d953$var$useCheckAuthenticated;






const $5c56876cd0de31a1$var$emptyParams = {};
// keep a cache of already fetched permissions to initialize state for new
// components and avoid a useless rerender if the permissions haven't changed
const $5c56876cd0de31a1$var$alreadyFetchedPermissions = {
    '{}': undefined
};
// Fork of usePermissionsOptimized, with a refetch option
const $5c56876cd0de31a1$var$usePermissionsWithRefetch = (params = $5c56876cd0de31a1$var$emptyParams)=>{
    const key = JSON.stringify(params);
    const [state, setState] = (0, $1obPJ$useSafeSetState)({
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        permissions: $5c56876cd0de31a1$var$alreadyFetchedPermissions[key]
    });
    const getPermissions = (0, $1obPJ$useGetPermissions)();
    const fetchPermissions = (0, $1obPJ$useCallback)(()=>getPermissions(params).then((permissions)=>{
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            if (!(0, $1obPJ$lodashisEqual)(permissions, state.permissions)) {
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                $5c56876cd0de31a1$var$alreadyFetchedPermissions[key] = permissions;
                setState({
                    permissions: permissions
                });
            }
        }).catch((error)=>{
            setState({
                error: // @ts-expect-error TS(2345): Argument of type '{ error: any; }' is not assignab... Remove this comment to see the full error message
                error
            });
        }), [
        key,
        params,
        getPermissions
    ]);
    (0, $1obPJ$useEffect)(()=>{
        fetchPermissions();
    }, [
        key
    ]);
    return {
        ...state,
        refetch: fetchPermissions
    };
};
var $5c56876cd0de31a1$export$2e2bcd8739ae039 = $5c56876cd0de31a1$var$usePermissionsWithRefetch;






const $4a7f77d08eae2033$var$englishMessages = {
    auth: {
        dialog: {
            container_permissions: 'Container permissions',
            resource_permissions: 'Resource permissions',
            login_required: 'Login required'
        },
        action: {
            submit: 'Submit',
            permissions: 'Permissions',
            signup: 'Signup',
            reset_password: 'Reset password',
            set_new_password: 'Set new password',
            logout: 'Logout',
            login: 'Login',
            view_my_profile: 'View my profile',
            edit_my_profile: 'Edit my profile',
            show_password: 'Show password',
            hide_password: 'Hide password'
        },
        right: {
            resource: {
                read: 'Read',
                append: 'Append',
                write: 'Write',
                control: 'Control'
            },
            container: {
                read: 'List',
                append: 'Add',
                write: 'Add',
                control: 'Control'
            }
        },
        agent: {
            anonymous: 'All users',
            authenticated: 'Connected users'
        },
        input: {
            agent_select: 'Add an user...',
            name: 'Surname',
            username: 'User ID',
            email: 'Email address',
            username_or_email: 'User ID or email address',
            current_password: 'Current password',
            new_password: 'New password',
            confirm_new_password: 'Confirm new password',
            password_strength: 'Password strength',
            password_suggestions: 'Suggestions to improve your password',
            password_suggestion: {
                add_lowercase_letters_a_z: 'Add lowercase letters (a-z)',
                add_uppercase_letters_a_z: 'Add uppercase letters (A-Z)',
                add_numbers_0_9: 'Add numbers (0-9)',
                add_special_characters: 'Add special characters (!@#$...)',
                make_it_at_least_8_characters_long: 'Make it at least 8 characters long',
                make_it_at_least_14_characters_long_for_maximum_strength: 'Make it at least 14 characters long for maximum strength'
            },
            password_too_weak: 'Password too weak. Increase length or add special characters.',
            password_mismatch: 'The passwords you provided do not match.',
            required_field: 'Required field',
            required_field_description: 'This field is required',
            password_description: 'Characters you type will be visually hidden for security reasons'
        },
        helper: {
            login: 'Sign in to your account',
            signup: 'Create your account',
            reset_password: 'Enter your email address below and we will send you a link to reset your password',
            set_new_password: 'Please enter your email address and a new password below'
        },
        message: {
            resource_show_forbidden: 'You are not allowed to view this resource',
            resource_edit_forbidden: 'You are not allowed to edit this resource',
            resource_delete_forbidden: 'You are not allowed to delete this resource',
            resource_control_forbidden: 'You are not allowed to control this resource',
            container_create_forbidden: 'You are not allowed to create new resource',
            container_list_forbidden: 'You are not allowed to list these resources',
            unable_to_fetch_user_data: 'Unable to fetch user data',
            no_token_returned: 'No token returned',
            no_associated_oidc_issuer: 'No OIDC issuer associated with the provided WebID',
            invalid_token_returned: 'Invalid token returned',
            signup_error: 'Account registration failed',
            user_not_allowed_to_login: 'You are not allowed to login with this account',
            user_email_not_found: 'No account found with this email address',
            user_email_exist: 'An account already exist with this email address',
            user_email_invalid: 'The provided email address is not valid',
            username_exist: 'An account already exist with this user ID',
            username_invalid: 'This username is invalid. Only lowercase characters, numbers, dots and hyphens are authorized',
            username_too_short: 'The provided username is too short',
            password_too_short: 'The provided password is too short',
            new_user_created: 'Your account has been successfully created',
            user_connected: 'You are now connected',
            user_disconnected: 'You are now disconnected',
            bad_request: 'Bad request (Error message returned by the server: %{error})',
            account_settings_updated: 'Your account settings have been successfully updated',
            login_to_continue: 'Please login to continue',
            choose_pod_provider: 'Please choose a Pod provider in the list below. All application data will be saved on your Pod.',
            unreachable_auth_server: 'The authentication server cannot be reached'
        },
        notification: {
            reset_password_submitted: 'An email has been sent with reset password instructions',
            reset_password_error: 'An error occurred',
            password_changed: 'Password changed successfully',
            new_password_error: 'An error occurred',
            invalid_password: 'Invalid password',
            get_settings_error: 'An error occurred',
            update_settings_error: 'An error occurred'
        },
        required: {
            email: 'Please enter your email address',
            password: 'Please enter your password',
            identifier: 'Please enter a unique identifier',
            newPassword: 'Please enter a new password',
            newPasswordAgain: 'Please enter the new password again'
        }
    }
};
var $4a7f77d08eae2033$export$2e2bcd8739ae039 = $4a7f77d08eae2033$var$englishMessages;


const $ca5fad849632b3ca$var$frenchMessages = {
    auth: {
        dialog: {
            container_permissions: 'Permissions sur le container',
            resource_permissions: 'Permissions sur la ressource',
            login_required: 'Connexion requise'
        },
        action: {
            submit: 'Soumettre',
            permissions: 'Permissions',
            signup: "S'inscrire",
            reset_password: "Mot de passe oubli\xe9 ?",
            set_new_password: "D\xe9finir le mot de passe",
            logout: "Se d\xe9connecter",
            login: 'Se connecter',
            view_my_profile: 'Voir mon profil',
            edit_my_profile: "\xc9diter mon profil",
            show_password: 'Afficher le mot de passe',
            hide_password: 'Masquer le mot de passe'
        },
        right: {
            resource: {
                read: 'Lire',
                append: 'Enrichir',
                write: 'Modifier',
                control: 'Administrer'
            },
            container: {
                read: 'Lister',
                append: 'Ajouter',
                write: 'Ajouter',
                control: 'Administrer'
            }
        },
        agent: {
            anonymous: 'Tous les utilisateurs',
            authenticated: "Utilisateurs connect\xe9s"
        },
        input: {
            agent_select: 'Ajouter un utilisateur...',
            name: "Pr\xe9nom",
            username: 'Identifiant unique',
            email: 'Adresse e-mail',
            username_or_email: 'Identifiant ou adresse e-mail',
            current_password: 'Mot de passe actuel',
            new_password: 'Nouveau mot de passe',
            confirm_new_password: 'Confirmer le nouveau mot de passe',
            password_strength: 'Force du mot de passe',
            password_suggestions: "Suggestions pour am\xe9liorer votre mot de passe",
            password_suggestion: {
                add_lowercase_letters_a_z: 'Ajouter des lettres minuscules (a-z)',
                add_uppercase_letters_a_z: 'Ajouter des lettres majuscules (A-Z)',
                add_numbers_0_9: 'Ajouter des chiffres (0-9)',
                add_special_characters: "Ajouter des caract\xe8res sp\xe9ciaux (!@#$...)",
                make_it_at_least_8_characters_long: "Faire au moins 8 caract\xe8res de long",
                make_it_at_least_14_characters_long_for_maximum_strength: "Faire au moins 14 caract\xe8res de long pour une force maximale"
            },
            password_too_weak: "Mot de passe trop faible. Augmenter la longueur ou ajouter des caract\xe8res sp\xe9ciaux.",
            password_mismatch: "Mot de passe diff\xe9rent du premier",
            required_field: 'Champ obligatoire',
            required_field_description: 'Ce champ est obligatoire',
            password_description: "Les caract\xe8res que vous tapez seront masqu\xe9s visuellement pour des raisons de s\xe9curit\xe9"
        },
        helper: {
            login: "Connectez-vous \xe0 votre compte.",
            signup: "Cr\xe9ez votre compte",
            reset_password: "Entrez votre adresse mail ci-dessous et nous vous enverrons un lien pour r\xe9initialiser votre mot de passe",
            set_new_password: 'Veuillez entrer votre adresse mail et un nouveau mot de passe ci-dessous'
        },
        message: {
            resource_show_forbidden: "Vous n'avez pas la permission de voir cette ressource",
            resource_edit_forbidden: "Vous n'avez pas la permission d'\xe9diter cette ressource",
            resource_delete_forbidden: "Vous n'avez pas la permission d'effacer cette ressource",
            resource_control_forbidden: "Vous n'avez pas la permission d'administrer cette ressource",
            container_create_forbidden: "Vous n'avez pas la permission de cr\xe9er des ressources",
            container_list_forbidden: "Vous n'avez pas la permission de voir ces ressources",
            unable_to_fetch_user_data: "Impossible de r\xe9cup\xe9rer les donn\xe9es du profil",
            no_token_returned: "Aucun token a \xe9t\xe9 retourn\xe9",
            no_associated_oidc_issuer: "Aucun serveur de connexion associ\xe9 avec le WebID fourni",
            invalid_token_returned: 'Token invalide',
            signup_error: "L'inscription a \xe9chou\xe9",
            user_not_allowed_to_login: "Vous n'avez pas le droit de vous connecter avec ce compte",
            user_email_not_found: "Aucun compte trouv\xe9 avec cette adresse mail",
            user_email_exist: "Un compte existe d\xe9j\xe0 avec cette adresse mail",
            user_email_invalid: "L'adresse mail fournie n'est pas valide",
            username_exist: "Un compte existe d\xe9j\xe0 avec cet identifiant",
            username_invalid: "Cet identifiant n'est pas valide. Seuls les lettres minuscules, les chiffres, les points et les tirets sont autoris\xe9s",
            username_too_short: "L'identifiant est trop court",
            password_too_short: 'Le mot de passe est trop court',
            new_user_created: "Votre compte a \xe9t\xe9 cr\xe9\xe9 avec succ\xe8s",
            user_connected: "Vous \xeates maintenant connect\xe9",
            user_disconnected: "Vous \xeates maintenant d\xe9connect\xe9",
            bad_request: "Requ\xeate erron\xe9e (Message d'erreur renvoy\xe9 par le serveur: %{error})",
            account_settings_updated: "Les param\xe8tres de votre compte ont \xe9t\xe9 mis \xe0 jour avec succ\xe8s",
            login_to_continue: 'Veuillez vous connecter pour continuer',
            choose_pod_provider: "Veuillez choisir un fournisseur de Pods dans la liste ci-dessous. Toutes les donn\xe9es de l'application seront enregistr\xe9es sur votre Pod.",
            unreachable_auth_server: "Le serveur de connexion ne peut \xeatre atteint"
        },
        notification: {
            reset_password_submitted: "Un e-mail a \xe9t\xe9 envoy\xe9 avec les instructions de r\xe9initialisation du mot de passe",
            reset_password_error: "Une erreur s'est produite",
            password_changed: "Le mot de passe a \xe9t\xe9 chang\xe9 avec succ\xe8s",
            new_password_error: "Une erreur s'est produite",
            invalid_password: 'Mot de passe incorrect',
            get_settings_error: "Une erreur s'est produite",
            update_settings_error: "Une erreur s'est produite"
        },
        required: {
            email: 'Veuillez entrer votre adresse e-mail',
            password: 'Veuillez entrer votre mot de passe',
            identifier: 'Veuillez entrer un identifiant unique',
            newPassword: 'Veuillez entrer un nouveau mot de passe',
            newPasswordAgain: 'Veuillez entrer le nouveau mot de passe encore une fois'
        }
    }
};
var $ca5fad849632b3ca$export$2e2bcd8739ae039 = $ca5fad849632b3ca$var$frenchMessages;


var $7bff7e7f4958f7ba$exports = {};




export {$82adcd05a20fe158$export$2e2bcd8739ae039 as authProvider, $555a60066c55ca73$export$2e2bcd8739ae039 as CreateWithPermissions, $d4772f22df7d8ad1$export$2e2bcd8739ae039 as EditWithPermissions, $1d084bfeb799eb8d$export$2e2bcd8739ae039 as EditActionsWithPermissions, $6b0c1a175ed94bdf$export$2e2bcd8739ae039 as EditToolbarWithPermissions, $5404fb6e980f17cf$export$2e2bcd8739ae039 as EditButtonWithPermissions, $f1536e5a1fd8c3b4$export$2e2bcd8739ae039 as DeleteButtonWithPermissions, $c356f5bf85f01e2c$export$2e2bcd8739ae039 as ListWithPermissions, $79c9804078d70be7$export$2e2bcd8739ae039 as ListActionsWithPermissions, $666a46a782bc3d6f$export$2e2bcd8739ae039 as ShowWithPermissions, $acd67d211d146755$export$2e2bcd8739ae039 as ShowActionsWithPermissions, $121c824bbff8752d$export$2e2bcd8739ae039 as PermissionsButton, $7a4043d65a13021b$export$2e2bcd8739ae039 as AuthDialog, $cf49485181f5598e$export$2e2bcd8739ae039 as SsoLoginPage, $cf49485181f5598e$export$2e2bcd8739ae039 as LoginPage, $c30cd9b373befd20$export$2e2bcd8739ae039 as LocalLoginPage, $646e01868df02899$export$2e2bcd8739ae039 as ResourceWithPermissions, $af962a36e574b739$export$2e2bcd8739ae039 as UserMenu, $9437ede267ca0f1e$export$2e2bcd8739ae039 as useAgents, $2c7b6595dba0d953$export$2e2bcd8739ae039 as useCheckAuthenticated, $3246c5a1f284b82d$export$2e2bcd8739ae039 as useCheckPermissions, $5c56876cd0de31a1$export$2e2bcd8739ae039 as usePermissionsWithRefetch, $251271bb4fe86cb1$export$2e2bcd8739ae039 as useSignup, $8c52861ea4dbf938$export$2e2bcd8739ae039 as PasswordStrengthIndicator, $79d99fa54c4682fc$export$2e2bcd8739ae039 as validatePasswordStrength, $76384d8f832bd89c$export$19dcdb21c6965fb8 as defaultPasswordScorer, $76384d8f832bd89c$export$ba43bf67f3d48107 as defaultPasswordScorerOptions, $76384d8f832bd89c$export$a1d713a9155d58fc as createPasswordScorer, $4a7f77d08eae2033$export$2e2bcd8739ae039 as englishMessages, $ca5fad849632b3ca$export$2e2bcd8739ae039 as frenchMessages};
//# sourceMappingURL=index.es.js.map
