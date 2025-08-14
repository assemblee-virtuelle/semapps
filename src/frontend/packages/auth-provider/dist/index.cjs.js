var $4Uj5b$jwtdecode = require("jwt-decode");
var $4Uj5b$urljoin = require("url-join");
var $4Uj5b$oauth4webapi = require("oauth4webapi");
var $4Uj5b$reactjsxruntime = require("react/jsx-runtime");
var $4Uj5b$react = require("react");
var $4Uj5b$reactadmin = require("react-admin");
var $4Uj5b$semappssemanticdataprovider = require("@semapps/semantic-data-provider");
var $4Uj5b$muiiconsmaterialShare = require("@mui/icons-material/Share");
var $4Uj5b$muimaterial = require("@mui/material");
var $4Uj5b$tssreactmui = require("tss-react/mui");
var $4Uj5b$muimaterialAutocomplete = require("@mui/material/Autocomplete");
var $4Uj5b$muiiconsmaterialPerson = require("@mui/icons-material/Person");
var $4Uj5b$muisystem = require("@mui/system");
var $4Uj5b$muiiconsmaterialEdit = require("@mui/icons-material/Edit");
var $4Uj5b$muiiconsmaterialCheck = require("@mui/icons-material/Check");
var $4Uj5b$muiiconsmaterialPublic = require("@mui/icons-material/Public");
var $4Uj5b$muiiconsmaterialVpnLock = require("@mui/icons-material/VpnLock");
var $4Uj5b$muiiconsmaterialGroup = require("@mui/icons-material/Group");
var $4Uj5b$muimaterialstyles = require("@mui/material/styles");
var $4Uj5b$reactrouterdom = require("react-router-dom");
var $4Uj5b$muiiconsmaterialLock = require("@mui/icons-material/Lock");
var $4Uj5b$speakingurl = require("speakingurl");
var $4Uj5b$reacthookform = require("react-hook-form");
var $4Uj5b$muiiconsmaterial = require("@mui/icons-material");
var $4Uj5b$muiiconsmaterialAccountCircle = require("@mui/icons-material/AccountCircle");
var $4Uj5b$lodashisEqual = require("lodash/isEqual");


function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "authProvider", () => $3e2f5a5cfc042f4b$export$2e2bcd8739ae039);
$parcel$export(module.exports, "CreateWithPermissions", () => $436b98c09d4bfc58$export$2e2bcd8739ae039);
$parcel$export(module.exports, "EditWithPermissions", () => $7059823a3e1f1c04$export$2e2bcd8739ae039);
$parcel$export(module.exports, "EditActionsWithPermissions", () => $87767302443de17c$export$2e2bcd8739ae039);
$parcel$export(module.exports, "EditToolbarWithPermissions", () => $41feb0ed0192b62e$export$2e2bcd8739ae039);
$parcel$export(module.exports, "EditButtonWithPermissions", () => $e5286b7fc80bde79$export$2e2bcd8739ae039);
$parcel$export(module.exports, "DeleteButtonWithPermissions", () => $07fcd08bad87f796$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ListWithPermissions", () => $027dac078faf6ea1$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ListActionsWithPermissions", () => $429746dd303ba55f$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ShowWithPermissions", () => $7789a2f600191ad3$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ShowActionsWithPermissions", () => $43f4d313e20b20c2$export$2e2bcd8739ae039);
$parcel$export(module.exports, "PermissionsButton", () => $c0cf5d4e3c0b20b5$export$2e2bcd8739ae039);
$parcel$export(module.exports, "AuthDialog", () => $249eac8bebdf233a$export$2e2bcd8739ae039);
$parcel$export(module.exports, "SsoLoginPage", () => $79d1291c35f967ca$export$2e2bcd8739ae039);
$parcel$export(module.exports, "LoginPage", () => $79d1291c35f967ca$export$2e2bcd8739ae039);
$parcel$export(module.exports, "LocalLoginPage", () => $0d47464799b2c057$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ResourceWithPermissions", () => $76c7f775d1617747$export$2e2bcd8739ae039);
$parcel$export(module.exports, "UserMenu", () => $131d39940f741630$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useAgents", () => $88e412417ca399a1$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useCheckAuthenticated", () => $4a91bf5a432d59d0$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useCheckPermissions", () => $715d0a876ac5de8e$export$2e2bcd8739ae039);
$parcel$export(module.exports, "usePermissionsWithRefetch", () => $45526ff039ac8974$export$2e2bcd8739ae039);
$parcel$export(module.exports, "useSignup", () => $033230994b67a556$export$2e2bcd8739ae039);
$parcel$export(module.exports, "PasswordStrengthIndicator", () => $7cb03e2f4ad57366$export$2e2bcd8739ae039);
$parcel$export(module.exports, "validatePasswordStrength", () => $f9e45ac9fbccef57$export$2e2bcd8739ae039);
$parcel$export(module.exports, "defaultPasswordScorer", () => $89099a5121c435dd$export$19dcdb21c6965fb8);
$parcel$export(module.exports, "defaultPasswordScorerOptions", () => $89099a5121c435dd$export$ba43bf67f3d48107);
$parcel$export(module.exports, "createPasswordScorer", () => $89099a5121c435dd$export$a1d713a9155d58fc);
$parcel$export(module.exports, "englishMessages", () => $910ad1ab1142b9b2$export$2e2bcd8739ae039);
$parcel$export(module.exports, "frenchMessages", () => $e20e00d5292fa16c$export$2e2bcd8739ae039);




const $7448e031bca4bf1e$export$dca4f48302963835 = (value)=>!value ? undefined : Array.isArray(value) ? value : [
        value
    ];
const $7448e031bca4bf1e$export$4450a74bced1b745 = (resourceUri)=>{
    const parsedUrl = new URL(resourceUri);
    return (0, ($parcel$interopDefault($4Uj5b$urljoin)))(parsedUrl.origin, '_acl', parsedUrl.pathname);
};
const $7448e031bca4bf1e$export$4d54b642c3d13c34 = (baseUri)=>({
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
const $7448e031bca4bf1e$export$274217e117cdbc7b = async (dataProvider)=>{
    const dataServers = await dataProvider.getDataServers();
    const authServer = Object.values(dataServers).find((server)=>server.authServer === true);
    if (!authServer) throw new Error('Could not find a server with authServer: true. Check your dataServers config.');
    // If the server is a Pod provider, return the root URL instead of https://domain.com/user/data
    return authServer.pod ? new URL(authServer.baseUrl).origin : authServer.baseUrl;
};
const $7448e031bca4bf1e$export$1391212d75b2ee65 = async (t)=>new Promise((resolve)=>{
        setTimeout(resolve, t);
    });
const $7448e031bca4bf1e$export$bab98af026af71ac = (value)=>typeof value === 'string' && value.startsWith('http') && !/\s/g.test(value);
const $7448e031bca4bf1e$export$50ae7fb6f87de989 = (value)=>typeof value === 'string' && value.startsWith('/') && !/\s/g.test(value);


const $3e2f5a5cfc042f4b$var$AUTH_TYPE_SSO = 'sso';
const $3e2f5a5cfc042f4b$var$AUTH_TYPE_LOCAL = 'local';
const $3e2f5a5cfc042f4b$var$AUTH_TYPE_POD = 'pod';
const $3e2f5a5cfc042f4b$var$AUTH_TYPE_SOLID_OIDC = 'solid-oidc';
const $3e2f5a5cfc042f4b$var$authProvider = ({ dataProvider: dataProvider, authType: authType, allowAnonymous: allowAnonymous = true, checkUser: checkUser, checkPermissions: checkPermissions = false, clientId: clientId })=>{
    if (![
        $3e2f5a5cfc042f4b$var$AUTH_TYPE_SSO,
        $3e2f5a5cfc042f4b$var$AUTH_TYPE_LOCAL,
        $3e2f5a5cfc042f4b$var$AUTH_TYPE_POD,
        $3e2f5a5cfc042f4b$var$AUTH_TYPE_SOLID_OIDC
    ].includes(authType)) throw new Error('The authType parameter is missing from the auth provider');
    if (authType === $3e2f5a5cfc042f4b$var$AUTH_TYPE_SOLID_OIDC && !clientId) throw new Error('The clientId parameter is required for solid-oidc authentication');
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
            if (authType === $3e2f5a5cfc042f4b$var$AUTH_TYPE_SOLID_OIDC) {
                let { webId: webId, issuer: issuer, redirect: redirect = '/', isSignup: isSignup = false } = params;
                if (webId && !issuer) {
                    // Find issuer from webId
                    const { json: userData } = await dataProvider.fetch(webId);
                    if (!userData) throw new Error('auth.message.unable_to_fetch_user_data');
                    if (!userData['solid:oidcIssuer']) throw new Error('auth.message.no_associated_oidc_issuer');
                    issuer = userData?.['solid:oidcIssuer'];
                }
                const as = await $4Uj5b$oauth4webapi.discoveryRequest(new URL(issuer)).then((response)=>$4Uj5b$oauth4webapi.processDiscoveryResponse(new URL(issuer), response)).catch(()=>{
                    throw new Error('auth.message.unreachable_auth_server');
                });
                const codeVerifier = $4Uj5b$oauth4webapi.generateRandomCodeVerifier();
                const codeChallenge = await $4Uj5b$oauth4webapi.calculatePKCECodeChallenge(codeVerifier);
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
            } else if (authType === $3e2f5a5cfc042f4b$var$AUTH_TYPE_LOCAL) {
                const { username: username, password: password } = params;
                const authServerUrl = await (0, $7448e031bca4bf1e$export$274217e117cdbc7b)(dataProvider);
                let token, webId;
                try {
                    ({ json: { token: token, webId: webId } } = await dataProvider.fetch((0, ($parcel$interopDefault($4Uj5b$urljoin)))(authServerUrl, 'auth/login'), {
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
            } else if (authType === $3e2f5a5cfc042f4b$var$AUTH_TYPE_SSO) {
                const authServerUrl = await (0, $7448e031bca4bf1e$export$274217e117cdbc7b)(dataProvider);
                let redirectUrl = `${new URL(window.location.href).origin}/login?login=true`;
                if (params.redirect) redirectUrl += `&redirect=${encodeURIComponent(params.redirect)}`;
                window.location.href = (0, ($parcel$interopDefault($4Uj5b$urljoin)))(authServerUrl, `auth?redirectUrl=${encodeURIComponent(redirectUrl)}`);
            }
        },
        handleCallback: async ()=>{
            const { searchParams: searchParams } = new URL(window.location.href);
            if (authType === $3e2f5a5cfc042f4b$var$AUTH_TYPE_SOLID_OIDC) {
                // @ts-expect-error TS(2345): Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
                const issuer = new URL(searchParams.get('iss'));
                const as = await $4Uj5b$oauth4webapi.discoveryRequest(issuer).then((response)=>$4Uj5b$oauth4webapi.processDiscoveryResponse(issuer, response));
                const client = {
                    client_id: clientId,
                    token_endpoint_auth_method: 'none' // We don't have a client secret
                };
                const currentUrl = new URL(window.location.href);
                // @ts-expect-error TS(2345): Argument of type '{ client_id: any; token_endpoint... Remove this comment to see the full error message
                const params = $4Uj5b$oauth4webapi.validateAuthResponse(as, client, currentUrl, $4Uj5b$oauth4webapi.expectNoState);
                if ($4Uj5b$oauth4webapi.isOAuth2Error(params)) throw new Error(`OAuth error: ${params.error} (${params.error_description})`);
                // Retrieve data set during login
                const codeVerifier = localStorage.getItem('code_verifier');
                const redirect = localStorage.getItem('redirect');
                const response = await $4Uj5b$oauth4webapi.authorizationCodeGrantRequest(as, // @ts-expect-error TS(2345): Argument of type '{ client_id: any; token_endpoint... Remove this comment to see the full error message
                client, params, `${window.location.origin}/auth-callback`, codeVerifier);
                // @ts-expect-error TS(2345): Argument of type '{ client_id: any; token_endpoint... Remove this comment to see the full error message
                const result = await $4Uj5b$oauth4webapi.processAuthorizationCodeOpenIDResponse(as, client, response);
                if ($4Uj5b$oauth4webapi.isOAuth2Error(result)) // @ts-expect-error TS(2339): Property 'error' does not exist on type 'URLSearch... Remove this comment to see the full error message
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
                    ({ webId: webId } = (0, ($parcel$interopDefault($4Uj5b$jwtdecode)))(token));
                } catch (e) {
                    throw new Error('auth.message.invalid_token_returned');
                }
                localStorage.setItem('token', token);
                await dataProvider.refreshConfig();
                await callCheckUser(webId);
            }
        },
        signup: async (params)=>{
            const authServerUrl = await (0, $7448e031bca4bf1e$export$274217e117cdbc7b)(dataProvider);
            if (authType === $3e2f5a5cfc042f4b$var$AUTH_TYPE_LOCAL) {
                const { username: username, email: email, password: password, domain: domain, ...profileData } = params;
                let token, webId;
                try {
                    ({ json: { token: token, webId: webId } } = await dataProvider.fetch((0, ($parcel$interopDefault($4Uj5b$urljoin)))(authServerUrl, 'auth/signup'), {
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
                window.location.href = (0, ($parcel$interopDefault($4Uj5b$urljoin)))(authServerUrl, `auth?redirectUrl=${encodeURIComponent(redirectUrl)}`);
            }
        },
        logout: async (params)=>{
            const { redirectUrl: redirectUrl } = params || {};
            switch(authType){
                case $3e2f5a5cfc042f4b$var$AUTH_TYPE_LOCAL:
                    {
                        const authServerUrl = await (0, $7448e031bca4bf1e$export$274217e117cdbc7b)(dataProvider);
                        // Delete token but also any other value in local storage
                        localStorage.clear();
                        let result = {};
                        try {
                            result = await dataProvider.fetch((0, ($parcel$interopDefault($4Uj5b$urljoin)))(authServerUrl, '.well-known/openid-configuration'));
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
                case $3e2f5a5cfc042f4b$var$AUTH_TYPE_SSO:
                    {
                        const authServerUrl = await (0, $7448e031bca4bf1e$export$274217e117cdbc7b)(dataProvider);
                        const baseUrl = new URL(window.location.href).origin;
                        return (0, ($parcel$interopDefault($4Uj5b$urljoin)))(authServerUrl, `auth/logout?redirectUrl=${encodeURIComponent(`${(0, ($parcel$interopDefault($4Uj5b$urljoin)))(baseUrl, 'login')}?logout=true`)}`);
                    }
                case $3e2f5a5cfc042f4b$var$AUTH_TYPE_POD:
                    {
                        const token = localStorage.getItem('token');
                        if (token) {
                            // @ts-expect-error TS(2339): Property 'webId' does not exist on type 'unknown'.
                            const { webId: webId } = (0, ($parcel$interopDefault($4Uj5b$jwtdecode)))(token);
                            // Delete token but also any other value in local storage
                            localStorage.clear();
                            // Redirect to the POD provider
                            return `${(0, ($parcel$interopDefault($4Uj5b$urljoin)))(webId, 'openApp')}?type=${encodeURIComponent('http://activitypods.org/ns/core#FrontAppRegistration')}`;
                        }
                        break;
                    }
                case $3e2f5a5cfc042f4b$var$AUTH_TYPE_SOLID_OIDC:
                    {
                        const token = localStorage.getItem('token');
                        if (token) {
                            // @ts-expect-error TS(2339): Property 'webid' does not exist on type 'unknown'.
                            const { webid: webId } = (0, ($parcel$interopDefault($4Uj5b$jwtdecode)))(token); // Not webId !!
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
            const aclUri = (0, $7448e031bca4bf1e$export$4450a74bced1b745)(uri);
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
            const aclUri = (0, $7448e031bca4bf1e$export$4450a74bced1b745)(uri);
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
                    '@context': (0, $7448e031bca4bf1e$export$4d54b642c3d13c34)(aclUri),
                    '@graph': [
                        authorization
                    ]
                })
            });
        },
        removePermission: async (uri, agentId, predicate, mode)=>{
            if (!uri || !uri.startsWith('http')) throw new Error('The first parameter passed to removePermission must be an URL');
            const aclUri = (0, $7448e031bca4bf1e$export$4450a74bced1b745)(uri);
            // Fetch current permissions
            const { json: json } = await dataProvider.fetch(aclUri);
            const updatedPermissions = json['@graph'].filter((authorization)=>!authorization['@id'].includes('#Default')).map((authorization)=>{
                const modes = (0, $7448e031bca4bf1e$export$dca4f48302963835)(authorization['acl:mode']);
                let agents = (0, $7448e031bca4bf1e$export$dca4f48302963835)(authorization[predicate]);
                if (mode && modes?.includes(mode) && agents && agents.includes(agentId)) agents = agents.filter((agent)=>agent !== agentId);
                return {
                    ...authorization,
                    [predicate]: agents
                };
            });
            await dataProvider.fetch(aclUri, {
                method: 'PUT',
                body: JSON.stringify({
                    '@context': (0, $7448e031bca4bf1e$export$4d54b642c3d13c34)(aclUri),
                    '@graph': updatedPermissions
                })
            });
        },
        getIdentity: async ()=>{
            const token = localStorage.getItem('token');
            if (token) {
                const payload = (0, ($parcel$interopDefault($4Uj5b$jwtdecode)))(token);
                // Backend-generated tokens use webId but Solid-OIDC tokens use webid
                // @ts-expect-error TS(2571): Object is of type 'unknown'.
                const webId = authType === $3e2f5a5cfc042f4b$var$AUTH_TYPE_SOLID_OIDC ? payload.webid : payload.webId;
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
            const authServerUrl = await (0, $7448e031bca4bf1e$export$274217e117cdbc7b)(dataProvider);
            try {
                await dataProvider.fetch((0, ($parcel$interopDefault($4Uj5b$urljoin)))(authServerUrl, 'auth/reset_password'), {
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
            const authServerUrl = await (0, $7448e031bca4bf1e$export$274217e117cdbc7b)(dataProvider);
            try {
                await dataProvider.fetch((0, ($parcel$interopDefault($4Uj5b$urljoin)))(authServerUrl, 'auth/new_password'), {
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
            const authServerUrl = await (0, $7448e031bca4bf1e$export$274217e117cdbc7b)(dataProvider);
            try {
                const { json: json } = await dataProvider.fetch((0, ($parcel$interopDefault($4Uj5b$urljoin)))(authServerUrl, 'auth/account'));
                return json;
            } catch (e) {
                throw new Error('auth.notification.get_settings_error');
            }
        },
        updateAccountSettings: async (params)=>{
            const authServerUrl = await (0, $7448e031bca4bf1e$export$274217e117cdbc7b)(dataProvider);
            try {
                const { email: email, currentPassword: currentPassword, newPassword: newPassword } = params;
                await dataProvider.fetch((0, ($parcel$interopDefault($4Uj5b$urljoin)))(authServerUrl, 'auth/account'), {
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
var $3e2f5a5cfc042f4b$export$2e2bcd8739ae039 = $3e2f5a5cfc042f4b$var$authProvider;








const $09c536abc6cea017$export$66a34090010a35b3 = 'acl:Read';
const $09c536abc6cea017$export$7c883503ccedfe0e = 'acl:Append';
const $09c536abc6cea017$export$2e56ecf100ca4ba6 = 'acl:Write';
const $09c536abc6cea017$export$5581cb2c55de143a = 'acl:Control';
const $09c536abc6cea017$export$97a08a1bb7ee0545 = 'acl:agent';
const $09c536abc6cea017$export$f07ccbe0773f2c7 = 'acl:agentGroup';
const $09c536abc6cea017$export$2703254089a859eb = 'acl:agentClass';
const $09c536abc6cea017$export$83ae1bc0992a6335 = 'foaf:Agent';
const $09c536abc6cea017$export$546c01a3ffdabe3a = 'acl:AuthenticatedAgent';
const $09c536abc6cea017$export$d37f0098bcf84c55 = [
    $09c536abc6cea017$export$66a34090010a35b3,
    $09c536abc6cea017$export$7c883503ccedfe0e,
    $09c536abc6cea017$export$2e56ecf100ca4ba6,
    $09c536abc6cea017$export$5581cb2c55de143a
];
const $09c536abc6cea017$export$dc3840a4e2a72b8c = [
    $09c536abc6cea017$export$66a34090010a35b3,
    $09c536abc6cea017$export$7c883503ccedfe0e,
    $09c536abc6cea017$export$2e56ecf100ca4ba6,
    $09c536abc6cea017$export$5581cb2c55de143a
];
const $09c536abc6cea017$export$65615a101bd6f5ca = [
    $09c536abc6cea017$export$7c883503ccedfe0e,
    $09c536abc6cea017$export$2e56ecf100ca4ba6,
    $09c536abc6cea017$export$5581cb2c55de143a
];
const $09c536abc6cea017$export$b9d0f5f3ab5e453b = [
    $09c536abc6cea017$export$7c883503ccedfe0e,
    $09c536abc6cea017$export$2e56ecf100ca4ba6,
    $09c536abc6cea017$export$5581cb2c55de143a
];
const $09c536abc6cea017$export$ac7b0367c0f9031e = [
    $09c536abc6cea017$export$2e56ecf100ca4ba6,
    $09c536abc6cea017$export$5581cb2c55de143a
];
const $09c536abc6cea017$export$22242524f7d0624 = [
    $09c536abc6cea017$export$5581cb2c55de143a
];
const $09c536abc6cea017$export$cae945d60b6cbe50 = {
    show: $09c536abc6cea017$export$d37f0098bcf84c55,
    list: $09c536abc6cea017$export$dc3840a4e2a72b8c,
    create: $09c536abc6cea017$export$65615a101bd6f5ca,
    edit: $09c536abc6cea017$export$b9d0f5f3ab5e453b,
    delete: $09c536abc6cea017$export$ac7b0367c0f9031e,
    control: $09c536abc6cea017$export$22242524f7d0624
};
const $09c536abc6cea017$export$12e6e8e71d10a4bb = {
    show: 'auth.message.resource_show_forbidden',
    edit: 'auth.message.resource_edit_forbidden',
    delete: 'auth.message.resource_delete_forbidden',
    control: 'auth.message.resource_control_forbidden',
    list: 'auth.message.container_list_forbidden',
    create: 'auth.message.container_create_forbidden'
};
const $09c536abc6cea017$export$2e9571c4ccdeb6a9 = {
    [$09c536abc6cea017$export$66a34090010a35b3]: 'auth.right.resource.read',
    [$09c536abc6cea017$export$7c883503ccedfe0e]: 'auth.right.resource.append',
    [$09c536abc6cea017$export$2e56ecf100ca4ba6]: 'auth.right.resource.write',
    [$09c536abc6cea017$export$5581cb2c55de143a]: 'auth.right.resource.control'
};
const $09c536abc6cea017$export$edca379024d80309 = {
    [$09c536abc6cea017$export$66a34090010a35b3]: 'auth.right.container.read',
    [$09c536abc6cea017$export$2e56ecf100ca4ba6]: 'auth.right.container.write',
    [$09c536abc6cea017$export$5581cb2c55de143a]: 'auth.right.container.control'
};


const $715d0a876ac5de8e$var$useCheckPermissions = (uri, mode, redirectUrl = '/')=>{
    const { permissions: permissions } = (0, $4Uj5b$reactadmin.usePermissions)({
        uri: uri
    });
    const notify = (0, $4Uj5b$reactadmin.useNotify)();
    const redirect = (0, $4Uj5b$reactadmin.useRedirect)();
    (0, $4Uj5b$react.useEffect)(()=>{
        if (permissions && !permissions.some((p)=>(0, $09c536abc6cea017$export$cae945d60b6cbe50)[mode].includes(p['acl:mode']))) {
            notify((0, $09c536abc6cea017$export$12e6e8e71d10a4bb)[mode], {
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
var $715d0a876ac5de8e$export$2e2bcd8739ae039 = $715d0a876ac5de8e$var$useCheckPermissions;


const $436b98c09d4bfc58$var$CreateWithPermissions = ({ actions: actions = /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.CreateActions), {}), children: children, ...rest })=>{
    const resource = (0, $4Uj5b$reactadmin.useResourceContext)();
    const createContainerUri = (0, $4Uj5b$semappssemanticdataprovider.useCreateContainerUri)(resource);
    (0, $715d0a876ac5de8e$export$2e2bcd8739ae039)(createContainerUri, 'create');
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Create), {
        actions: actions,
        ...rest,
        children: children
    });
};
var $436b98c09d4bfc58$export$2e2bcd8739ae039 = $436b98c09d4bfc58$var$CreateWithPermissions;



























const $0fe99d8ef25120fc$var$useStyles = (0, $4Uj5b$tssreactmui.makeStyles)()(()=>({
        list: {
            padding: 0,
            width: '100%'
        },
        option: {
            padding: 0
        }
    }));
const $0fe99d8ef25120fc$var$AddPermissionsForm = ({ agents: agents, addPermission: addPermission })=>{
    const { classes: classes } = $0fe99d8ef25120fc$var$useStyles();
    const translate = (0, $4Uj5b$reactadmin.useTranslate)();
    const [value, setValue] = (0, $4Uj5b$react.useState)(null);
    const [inputValue, setInputValue] = (0, $4Uj5b$react.useState)('');
    const [options, setOptions] = (0, $4Uj5b$react.useState)([]);
    const { data: data } = (0, $4Uj5b$reactadmin.useGetList)('Person', {
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
    (0, $4Uj5b$react.useEffect)(()=>{
        setOptions((data?.length || 0) > 0 ? Object.values(data || []) : []);
    }, [
        data
    ]);
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, ($parcel$interopDefault($4Uj5b$muimaterialAutocomplete))), {
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
            addPermission(record.id || record['@id'], (0, $09c536abc6cea017$export$97a08a1bb7ee0545), (0, $09c536abc6cea017$export$66a34090010a35b3));
            setValue(null);
            setInputValue('');
            setOptions([]);
        },
        onInputChange: (event, newInputValue)=>{
            setInputValue(newInputValue);
        },
        renderInput: (params)=>/*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.TextField), {
                ...params,
                label: translate('auth.input.agent_select'),
                variant: "filled",
                margin: "dense",
                fullWidth: true
            }),
        renderOption: (props, option)=>/*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.List), {
                dense: true,
                className: classes.list,
                ...props,
                children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.ListItem), {
                    button: true,
                    children: [
                        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.ListItemAvatar), {
                            children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Avatar), {
                                src: option.image,
                                children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, ($parcel$interopDefault($4Uj5b$muiiconsmaterialPerson))), {})
                            })
                        }),
                        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.ListItemText), {
                            primary: option['pair:label']
                        })
                    ]
                })
            })
    });
};
var $0fe99d8ef25120fc$export$2e2bcd8739ae039 = $0fe99d8ef25120fc$var$AddPermissionsForm;





















const $6ad8b01b8ba81118$var$AgentIcon = ({ agent: agent })=>{
    switch(agent.predicate){
        case 0, $09c536abc6cea017$export$2703254089a859eb:
            return agent.id === (0, $09c536abc6cea017$export$83ae1bc0992a6335) ? /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, ($parcel$interopDefault($4Uj5b$muiiconsmaterialPublic))), {}) : /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, ($parcel$interopDefault($4Uj5b$muiiconsmaterialVpnLock))), {});
        case 0, $09c536abc6cea017$export$97a08a1bb7ee0545:
            return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, ($parcel$interopDefault($4Uj5b$muiiconsmaterialPerson))), {});
        case 0, $09c536abc6cea017$export$f07ccbe0773f2c7:
            return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, ($parcel$interopDefault($4Uj5b$muiiconsmaterialGroup))), {});
        default:
            throw new Error(`Unknown agent predicate: ${agent.predicate}`);
    }
};
var $6ad8b01b8ba81118$export$2e2bcd8739ae039 = $6ad8b01b8ba81118$var$AgentIcon;


const $950ca392943fda1f$var$useStyles = (0, $4Uj5b$tssreactmui.makeStyles)()(()=>({
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
const $950ca392943fda1f$var$AgentItem = ({ isContainer: isContainer, agent: agent, addPermission: addPermission, removePermission: removePermission })=>{
    const { classes: classes } = $950ca392943fda1f$var$useStyles();
    const translate = (0, $4Uj5b$reactadmin.useTranslate)();
    const dataProvider = (0, $4Uj5b$reactadmin.useDataProvider)();
    const [anchorEl, setAnchorEl] = (0, ($parcel$interopDefault($4Uj5b$react))).useState(null);
    const [user, setUser] = (0, $4Uj5b$react.useState)();
    const [loading, setLoading] = (0, $4Uj5b$react.useState)(true);
    const [error, setError] = (0, $4Uj5b$react.useState)();
    (0, $4Uj5b$react.useEffect)(()=>{
        if (agent.predicate === (0, $09c536abc6cea017$export$97a08a1bb7ee0545)) dataProvider.getOne('Person', {
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
    if (agent.predicate === (0, $09c536abc6cea017$export$f07ccbe0773f2c7)) return null;
    const openMenu = (event)=>setAnchorEl(event.currentTarget);
    const closeMenu = ()=>setAnchorEl(null);
    const labels = isContainer ? (0, $09c536abc6cea017$export$edca379024d80309) : (0, $09c536abc6cea017$export$2e9571c4ccdeb6a9);
    if (loading) return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Loading), {});
    // @ts-expect-error TS(2739): Type '{}' is missing the following properties from... Remove this comment to see the full error message
    if (error) return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Error), {});
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.ListItem), {
        className: classes.listItem,
        children: [
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.ListItemAvatar), {
                children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Avatar), {
                    src: // @ts-expect-error TS(2339): Property 'image' does not exist on type 'never'.
                    user?.image,
                    children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $6ad8b01b8ba81118$export$2e2bcd8739ae039), {
                        agent: agent
                    })
                })
            }),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.ListItemText), {
                className: classes.primaryText,
                primary: user ? user['pair:label'] : translate(agent.id === (0, $09c536abc6cea017$export$83ae1bc0992a6335) ? 'auth.agent.anonymous' : 'auth.agent.authenticated')
            }),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.ListItemText), {
                className: classes.secondaryText,
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                primary: agent.permissions && agent.permissions.map((p)=>translate(labels[p])).join(', ')
            }),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.ListItemSecondaryAction), {
                children: [
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.IconButton), {
                        onClick: openMenu,
                        size: "large",
                        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, ($parcel$interopDefault($4Uj5b$muiiconsmaterialEdit))), {})
                    }),
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Menu), {
                        anchorEl: anchorEl,
                        keepMounted: true,
                        open: Boolean(anchorEl),
                        onClose: closeMenu,
                        children: Object.entries(labels).map(([rightKey, rightLabel])=>{
                            const hasPermission = agent.permissions && agent.permissions.includes(rightKey);
                            return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.MenuItem), {
                                onClick: ()=>{
                                    if (hasPermission) removePermission(agent.id, agent.predicate, rightKey);
                                    else addPermission(agent.id, agent.predicate, rightKey);
                                    closeMenu();
                                },
                                children: [
                                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.ListItemIcon), {
                                        children: hasPermission ? /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, ($parcel$interopDefault($4Uj5b$muiiconsmaterialCheck))), {}) : null
                                    }),
                                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.ListItemText), {
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
var $950ca392943fda1f$export$2e2bcd8739ae039 = $950ca392943fda1f$var$AgentItem;


const $78b9b704a64a1c26$var$StyledList = (0, $4Uj5b$muisystem.styled)((0, $4Uj5b$muimaterial.List))(({ theme: theme })=>({
        width: '100%',
        maxWidth: '100%',
        backgroundColor: theme.palette.background.paper
    }));
const $78b9b704a64a1c26$var$EditPermissionsForm = ({ isContainer: isContainer, agents: agents, addPermission: addPermission, removePermission: removePermission })=>{
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)($78b9b704a64a1c26$var$StyledList, {
        dense: true,
        children: Object.entries(agents).map(([agentId, agent])=>/*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $950ca392943fda1f$export$2e2bcd8739ae039), {
                isContainer: isContainer,
                agent: agent,
                addPermission: addPermission,
                removePermission: removePermission
            }, agentId))
    });
};
var $78b9b704a64a1c26$export$2e2bcd8739ae039 = $78b9b704a64a1c26$var$EditPermissionsForm;






const $88e412417ca399a1$var$useAgents = (uri)=>{
    const { permissions: permissions } = (0, $4Uj5b$reactadmin.usePermissions)({
        uri: uri
    });
    const authProvider = (0, $4Uj5b$reactadmin.useAuthProvider)();
    const [agents, setAgents] = (0, $4Uj5b$react.useState)({});
    // Format list of authorized agents, based on the permissions returned for the resource
    (0, $4Uj5b$react.useEffect)(()=>{
        const result = {
            [(0, $09c536abc6cea017$export$83ae1bc0992a6335)]: {
                id: (0, $09c536abc6cea017$export$83ae1bc0992a6335),
                predicate: (0, $09c536abc6cea017$export$2703254089a859eb),
                permissions: []
            },
            [(0, $09c536abc6cea017$export$546c01a3ffdabe3a)]: {
                id: (0, $09c536abc6cea017$export$546c01a3ffdabe3a),
                predicate: (0, $09c536abc6cea017$export$2703254089a859eb),
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
                if (p[0, $09c536abc6cea017$export$2703254089a859eb]) (0, $7448e031bca4bf1e$export$dca4f48302963835)(p[0, $09c536abc6cea017$export$2703254089a859eb])?.forEach((agentId)=>appendPermission(agentId, (0, $09c536abc6cea017$export$2703254089a859eb), p['acl:mode']));
                if (p[0, $09c536abc6cea017$export$97a08a1bb7ee0545]) (0, $7448e031bca4bf1e$export$dca4f48302963835)(p[0, $09c536abc6cea017$export$97a08a1bb7ee0545])?.forEach((userUri)=>appendPermission(userUri, (0, $09c536abc6cea017$export$97a08a1bb7ee0545), p['acl:mode']));
                if (p[0, $09c536abc6cea017$export$f07ccbe0773f2c7]) (0, $7448e031bca4bf1e$export$dca4f48302963835)(p[0, $09c536abc6cea017$export$f07ccbe0773f2c7])?.forEach((groupUri)=>appendPermission(groupUri, (0, $09c536abc6cea017$export$f07ccbe0773f2c7), p['acl:mode']));
            }
            setAgents(result);
        }
    }, [
        permissions
    ]);
    const addPermission = (0, $4Uj5b$react.useCallback)((agentId, predicate, mode)=>{
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
    const removePermission = (0, $4Uj5b$react.useCallback)((agentId, predicate, mode)=>{
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
        .filter(([_, agent])=>agent.predicate === (0, $09c536abc6cea017$export$2703254089a859eb) || agent.permissions.length > 0)));
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
var $88e412417ca399a1$export$2e2bcd8739ae039 = $88e412417ca399a1$var$useAgents;


const $d7753b9837c85814$var$useStyles = (0, $4Uj5b$tssreactmui.makeStyles)()(()=>({
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
const $d7753b9837c85814$var$PermissionsDialog = ({ open: open, onClose: onClose, uri: uri, isContainer: isContainer })=>{
    const { classes: classes } = $d7753b9837c85814$var$useStyles();
    const translate = (0, $4Uj5b$reactadmin.useTranslate)();
    const { agents: agents, addPermission: addPermission, removePermission: removePermission } = (0, $88e412417ca399a1$export$2e2bcd8739ae039)(uri);
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Dialog), {
        fullWidth: true,
        open: open,
        onClose: onClose,
        children: [
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.DialogTitle), {
                className: classes.title,
                children: translate(isContainer ? 'auth.dialog.container_permissions' : 'auth.dialog.resource_permissions')
            }),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.DialogContent), {
                className: classes.addForm,
                children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $0fe99d8ef25120fc$export$2e2bcd8739ae039), {
                    agents: agents,
                    addPermission: addPermission
                })
            }),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.DialogContent), {
                className: classes.listForm,
                children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $78b9b704a64a1c26$export$2e2bcd8739ae039), {
                    isContainer: isContainer,
                    agents: agents,
                    addPermission: addPermission,
                    removePermission: removePermission
                })
            }),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.DialogActions), {
                className: classes.actions,
                children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Button), {
                    label: "ra.action.close",
                    variant: "text",
                    onClick: onClose
                })
            })
        ]
    });
};
var $d7753b9837c85814$export$2e2bcd8739ae039 = $d7753b9837c85814$var$PermissionsDialog;


const $c0cf5d4e3c0b20b5$var$PermissionsButton = ({ isContainer: isContainer = false })=>{
    const record = (0, $4Uj5b$reactadmin.useRecordContext)();
    const resource = (0, $4Uj5b$reactadmin.useResourceContext)();
    const [showDialog, setShowDialog] = (0, $4Uj5b$react.useState)(false);
    const createContainer = (0, $4Uj5b$semappssemanticdataprovider.useCreateContainerUri)(resource);
    const uri = isContainer ? createContainer : record?.id || record?.['@id'];
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactjsxruntime.Fragment), {
        children: [
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Button), {
                label: "auth.action.permissions",
                onClick: ()=>setShowDialog(true),
                children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, ($parcel$interopDefault($4Uj5b$muiiconsmaterialShare))), {})
            }),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $d7753b9837c85814$export$2e2bcd8739ae039), {
                uri: uri,
                isContainer: isContainer,
                open: showDialog,
                onClose: ()=>setShowDialog(false)
            })
        ]
    });
};
var $c0cf5d4e3c0b20b5$export$2e2bcd8739ae039 = $c0cf5d4e3c0b20b5$var$PermissionsButton;



const $87767302443de17c$var$EditActionsWithPermissions = ()=>{
    const { hasList: hasList, hasShow: hasShow } = (0, $4Uj5b$reactadmin.useResourceDefinition)();
    const record = (0, $4Uj5b$reactadmin.useRecordContext)();
    const { permissions: permissions } = (0, $4Uj5b$reactadmin.usePermissions)({
        uri: record?.id
    });
    const resource = (0, $4Uj5b$reactadmin.useResourceContext)();
    const containerUri = (0, $4Uj5b$semappssemanticdataprovider.useCreateContainerUri)(resource);
    const { permissions: containerPermissions } = (0, $4Uj5b$reactadmin.usePermissions)({
        uri: containerUri
    });
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactadmin.TopToolbar), {
        children: [
            hasList && containerPermissions && containerPermissions.some((p)=>(0, $09c536abc6cea017$export$dc3840a4e2a72b8c).includes(p['acl:mode'])) && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.ListButton), {}),
            hasShow && permissions && permissions.some((p)=>(0, $09c536abc6cea017$export$d37f0098bcf84c55).includes(p['acl:mode'])) && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.ShowButton), {}),
            permissions && permissions.some((p)=>(0, $09c536abc6cea017$export$22242524f7d0624).includes(p['acl:mode'])) && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $c0cf5d4e3c0b20b5$export$2e2bcd8739ae039), {})
        ]
    });
};
var $87767302443de17c$export$2e2bcd8739ae039 = $87767302443de17c$var$EditActionsWithPermissions;



const $7059823a3e1f1c04$var$EditWithPermissions = ({ actions: actions = /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $87767302443de17c$export$2e2bcd8739ae039), {}), children: children, ...rest })=>{
    const recordId = (0, $4Uj5b$reactadmin.useGetRecordId)();
    (0, $715d0a876ac5de8e$export$2e2bcd8739ae039)(recordId, 'edit');
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Edit), {
        actions: actions,
        ...rest,
        children: children
    });
};
var $7059823a3e1f1c04$export$2e2bcd8739ae039 = $7059823a3e1f1c04$var$EditWithPermissions;











const $07fcd08bad87f796$var$DeleteButtonWithPermissions = (props)=>{
    const recordId = (0, $4Uj5b$reactadmin.useGetRecordId)();
    const { permissions: permissions, isLoading: isLoading } = (0, $4Uj5b$reactadmin.usePermissions)({
        uri: recordId
    });
    if (!isLoading && permissions?.some((p)=>(0, $09c536abc6cea017$export$ac7b0367c0f9031e).includes(p['acl:mode']))) return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.DeleteButton), {
        ...props
    });
    return null;
};
var $07fcd08bad87f796$export$2e2bcd8739ae039 = $07fcd08bad87f796$var$DeleteButtonWithPermissions;


const $41feb0ed0192b62e$var$StyledToolbar = (0, $4Uj5b$muimaterialstyles.styled)((0, $4Uj5b$reactadmin.Toolbar))(()=>({
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between'
    }));
const $41feb0ed0192b62e$var$EditToolbarWithPermissions = (props)=>/*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)($41feb0ed0192b62e$var$StyledToolbar, {
        ...props,
        children: [
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.SaveButton), {}),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $07fcd08bad87f796$export$2e2bcd8739ae039), {})
        ]
    });
var $41feb0ed0192b62e$export$2e2bcd8739ae039 = $41feb0ed0192b62e$var$EditToolbarWithPermissions;






const $e5286b7fc80bde79$var$EditButtonWithPermissions = (props)=>{
    const recordId = (0, $4Uj5b$reactadmin.useGetRecordId)();
    const { permissions: permissions, isLoading: isLoading } = (0, $4Uj5b$reactadmin.usePermissions)({
        uri: recordId
    });
    if (!isLoading && permissions?.some((p)=>(0, $09c536abc6cea017$export$b9d0f5f3ab5e453b).includes(p['acl:mode']))) return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.EditButton), {
        ...props
    });
    return null;
};
var $e5286b7fc80bde79$export$2e2bcd8739ae039 = $e5286b7fc80bde79$var$EditButtonWithPermissions;














// Do not show Export and Refresh buttons on mobile
const $429746dd303ba55f$var$ListActionsWithPermissions = ({ sort: // @ts-expect-error TS(2339): Property 'sort' does not exist on type 'ListAction... Remove this comment to see the full error message
sort, displayedFilters: displayedFilters, exporter: exporter, filters: filters, filterValues: filterValues, showFilter: showFilter, total: total })=>{
    const theme = (0, $4Uj5b$muimaterialstyles.useTheme)();
    const xs = (0, $4Uj5b$muimaterial.useMediaQuery)(theme.breakpoints.down('xs'));
    const resource = (0, $4Uj5b$reactadmin.useResourceContext)();
    const resourceDefinition = (0, $4Uj5b$reactadmin.useResourceDefinition)();
    const containerUri = (0, $4Uj5b$semappssemanticdataprovider.useCreateContainerUri)(resource);
    const { permissions: permissions } = (0, $4Uj5b$reactadmin.usePermissions)({
        uri: containerUri
    });
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactadmin.TopToolbar), {
        children: [
            filters && /*#__PURE__*/ (0, ($parcel$interopDefault($4Uj5b$react))).cloneElement(filters, {
                showFilter: showFilter,
                displayedFilters: displayedFilters,
                filterValues: filterValues,
                context: 'button'
            }),
            resourceDefinition.hasCreate && permissions?.some((p)=>(0, $09c536abc6cea017$export$65615a101bd6f5ca).includes(p['acl:mode'])) && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.CreateButton), {}),
            permissions?.some((p)=>(0, $09c536abc6cea017$export$22242524f7d0624).includes(p['acl:mode'])) && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $c0cf5d4e3c0b20b5$export$2e2bcd8739ae039), {
                isContainer: true
            }),
            !xs && exporter !== false && // @ts-expect-error TS(2322): Type '{ disabled: boolean; sort: any; filterValues... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.ExportButton), {
                disabled: total === 0,
                sort: sort,
                filterValues: filterValues,
                exporter: exporter
            })
        ]
    });
};
var $429746dd303ba55f$export$2e2bcd8739ae039 = $429746dd303ba55f$var$ListActionsWithPermissions;


const $027dac078faf6ea1$var$ListWithPermissions = ({ actions: actions = /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $429746dd303ba55f$export$2e2bcd8739ae039), {}), ...rest })=>/*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.List), {
        actions: actions,
        ...rest
    });
var $027dac078faf6ea1$export$2e2bcd8739ae039 = $027dac078faf6ea1$var$ListWithPermissions;












const $43f4d313e20b20c2$var$ShowActionsWithPermissions = ()=>{
    const { hasList: hasList, hasEdit: hasEdit } = (0, $4Uj5b$reactadmin.useResourceDefinition)();
    const record = (0, $4Uj5b$reactadmin.useRecordContext)();
    const { permissions: permissions } = (0, $4Uj5b$reactadmin.usePermissions)({
        uri: record?.id
    });
    const resource = (0, $4Uj5b$reactadmin.useResourceContext)();
    const containerUri = (0, $4Uj5b$semappssemanticdataprovider.useCreateContainerUri)(resource);
    const { permissions: containerPermissions } = (0, $4Uj5b$reactadmin.usePermissions)({
        uri: containerUri
    });
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactadmin.TopToolbar), {
        children: [
            hasList && containerPermissions && containerPermissions.some((p)=>(0, $09c536abc6cea017$export$dc3840a4e2a72b8c).includes(p['acl:mode'])) && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.ListButton), {}),
            hasEdit && permissions && permissions.some((p)=>(0, $09c536abc6cea017$export$b9d0f5f3ab5e453b).includes(p['acl:mode'])) && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.EditButton), {}),
            permissions && permissions.some((p)=>(0, $09c536abc6cea017$export$22242524f7d0624).includes(p['acl:mode'])) && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $c0cf5d4e3c0b20b5$export$2e2bcd8739ae039), {})
        ]
    });
};
var $43f4d313e20b20c2$export$2e2bcd8739ae039 = $43f4d313e20b20c2$var$ShowActionsWithPermissions;



const $7789a2f600191ad3$var$ShowWithPermissions = ({ actions: actions, ...rest })=>{
    const recordId = (0, $4Uj5b$reactadmin.useGetRecordId)();
    (0, $715d0a876ac5de8e$export$2e2bcd8739ae039)(recordId, 'show');
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Show), {
        actions: actions || /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $43f4d313e20b20c2$export$2e2bcd8739ae039), {}),
        ...rest
    });
};
var $7789a2f600191ad3$export$2e2bcd8739ae039 = $7789a2f600191ad3$var$ShowWithPermissions;








const $249eac8bebdf233a$var$AuthDialog = ({ open: open, onClose: onClose, title: title = 'auth.dialog.login_required', message: message = 'auth.message.login_to_continue', redirect: redirect, ...rest })=>{
    const login = (0, $4Uj5b$reactadmin.useLogin)();
    const translate = (0, $4Uj5b$reactadmin.useTranslate)();
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Dialog), {
        open: open,
        onClose: onClose,
        ...rest,
        children: [
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.DialogTitle), {
                children: translate(title)
            }),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.DialogContent), {
                children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.DialogContentText), {
                    children: translate(message)
                })
            }),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.DialogActions), {
                children: [
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Button), {
                        onClick: onClose,
                        children: translate('ra.action.cancel')
                    }),
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Button), {
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
var $249eac8bebdf233a$export$2e2bcd8739ae039 = $249eac8bebdf233a$var$AuthDialog;










const $79d1291c35f967ca$var$delay = async (t)=>new Promise((resolve)=>setTimeout(resolve, t));
// Inspired from https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/auth/Login.tsx
const $79d1291c35f967ca$var$SsoLoginPage = ({ children: children, backgroundImage: backgroundImage, buttons: buttons, userResource: userResource = 'Person', propertiesExist: propertiesExist = [], text: text, ...rest })=>{
    const containerRef = (0, $4Uj5b$react.useRef)();
    let backgroundImageLoaded = false;
    const navigate = (0, $4Uj5b$reactrouterdom.useNavigate)();
    const [searchParams] = (0, $4Uj5b$reactrouterdom.useSearchParams)();
    const { data: identity, isLoading: isLoading } = (0, $4Uj5b$reactadmin.useGetIdentity)();
    const notify = (0, $4Uj5b$reactadmin.useNotify)();
    const login = (0, $4Uj5b$reactadmin.useLogin)();
    const dataProvider = (0, $4Uj5b$reactadmin.useDataProvider)();
    const authProvider = (0, $4Uj5b$reactadmin.useAuthProvider)();
    (0, $4Uj5b$react.useEffect)(()=>{
        if (!isLoading && identity?.id) // Already authenticated, redirect to the home page
        navigate(searchParams.get('redirect') || '/');
    }, [
        identity,
        isLoading,
        navigate,
        searchParams
    ]);
    (0, $4Uj5b$react.useEffect)(()=>{
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
                    const { webId: webId } = (0, ($parcel$interopDefault($4Uj5b$jwtdecode)))(token);
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
                            await $79d1291c35f967ca$var$delay(500);
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
    (0, $4Uj5b$react.useEffect)(()=>{
        if (!backgroundImageLoaded) lazyLoadBackgroundImage();
    });
    if (isLoading) return null;
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)($79d1291c35f967ca$var$Root, {
        ...rest,
        ref: containerRef,
        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Card), {
            className: $79d1291c35f967ca$export$388de65c72fa74b4.card,
            children: [
                /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)("div", {
                    className: $79d1291c35f967ca$export$388de65c72fa74b4.avatar,
                    children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Avatar), {
                        className: $79d1291c35f967ca$export$388de65c72fa74b4.icon,
                        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, ($parcel$interopDefault($4Uj5b$muiiconsmaterialLock))), {})
                    })
                }),
                text && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Typography), {
                    variant: "body2" /* className={classes.text} */ ,
                    children: text
                }),
                buttons?.map((button, i)=>/*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.CardActions), {
                        children: /*#__PURE__*/ (0, ($parcel$interopDefault($4Uj5b$react))).cloneElement(button, {
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
const $79d1291c35f967ca$var$PREFIX = 'SsoLoginPage';
const $79d1291c35f967ca$export$388de65c72fa74b4 = {
    card: `${$79d1291c35f967ca$var$PREFIX}-card`,
    avatar: `${$79d1291c35f967ca$var$PREFIX}-avatar`,
    icon: `${$79d1291c35f967ca$var$PREFIX}-icon`,
    switch: `${$79d1291c35f967ca$var$PREFIX}-switch`
};
const $79d1291c35f967ca$var$Root = (0, $4Uj5b$muimaterialstyles.styled)('div', {
    name: $79d1291c35f967ca$var$PREFIX,
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
        [`& .${$79d1291c35f967ca$export$388de65c72fa74b4.card}`]: {
            minWidth: 300,
            marginTop: '6em'
        },
        [`& .${$79d1291c35f967ca$export$388de65c72fa74b4.avatar}`]: {
            margin: '1em',
            display: 'flex',
            justifyContent: 'center'
        },
        [`& .${$79d1291c35f967ca$export$388de65c72fa74b4.icon}`]: {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            backgroundColor: theme.palette.secondary[500]
        },
        [`& .${$79d1291c35f967ca$export$388de65c72fa74b4.switch}`]: {
            marginBottom: '1em',
            display: 'flex',
            justifyContent: 'center'
        }
    }));
var $79d1291c35f967ca$export$2e2bcd8739ae039 = $79d1291c35f967ca$var$SsoLoginPage;


















const $033230994b67a556$var$useSignup = ()=>{
    const authProvider = (0, $4Uj5b$reactadmin.useAuthProvider)();
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    return (0, $4Uj5b$react.useCallback)((params = {})=>authProvider.signup(params), [
        authProvider
    ]);
};
var $033230994b67a556$export$2e2bcd8739ae039 = $033230994b67a556$var$useSignup;


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
 */ /** @type {PasswordStrengthOptions} */ const $89099a5121c435dd$export$ba43bf67f3d48107 = {
    isVeryLongLength: 14,
    isLongLength: 8,
    isLongScore: 2,
    isVeryLongScore: 2,
    uppercaseScore: 1,
    lowercaseScore: 1,
    numbersScore: 1,
    nonAlphanumericsScore: 1
};
const $89099a5121c435dd$export$963a5c59734509bb = (password, options)=>{
    if (!password) return 0;
    const mergedOptions = {
        ...$89099a5121c435dd$export$ba43bf67f3d48107,
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
const $89099a5121c435dd$export$b6086dad7504ebad = (password, options = $89099a5121c435dd$export$ba43bf67f3d48107)=>{
    const mergedOptions = {
        ...$89099a5121c435dd$export$ba43bf67f3d48107,
        ...options
    };
    const score = $89099a5121c435dd$export$963a5c59734509bb(password, mergedOptions);
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
const $89099a5121c435dd$export$a1d713a9155d58fc = (options = $89099a5121c435dd$export$ba43bf67f3d48107, minRequiredScore = 5)=>{
    const mergedOptions = {
        ...$89099a5121c435dd$export$ba43bf67f3d48107,
        ...options
    };
    return {
        scoreFn: (password)=>$89099a5121c435dd$export$963a5c59734509bb(password, mergedOptions),
        analyzeFn: (password)=>$89099a5121c435dd$export$b6086dad7504ebad(password, mergedOptions),
        minRequiredScore: minRequiredScore,
        maxScore: mergedOptions.uppercaseScore + mergedOptions.lowercaseScore + mergedOptions.numbersScore + mergedOptions.nonAlphanumericsScore + mergedOptions.isLongScore + mergedOptions.isVeryLongScore
    };
};
const $89099a5121c435dd$export$19dcdb21c6965fb8 = $89099a5121c435dd$export$a1d713a9155d58fc($89099a5121c435dd$export$ba43bf67f3d48107, 5);


const $f9e45ac9fbccef57$var$validatePasswordStrength = (scorer = (0, $89099a5121c435dd$export$19dcdb21c6965fb8))=>(value)=>{
        if (!scorer) return undefined;
        const strength = scorer.scoreFn(value);
        if (strength < scorer.minRequiredScore) return 'auth.input.password_too_weak';
        return undefined;
    };
var $f9e45ac9fbccef57$export$2e2bcd8739ae039 = $f9e45ac9fbccef57$var$validatePasswordStrength;








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
 */ const $bf8434ea21da792a$var$colorGradient = (fade, color1, color2)=>{
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
function $bf8434ea21da792a$export$2e2bcd8739ae039(props) {
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
    const currentColor = $bf8434ea21da792a$var$colorGradient(fade, color1, color2);
    const StyledLinearProgress = (0, $4Uj5b$tssreactmui.withStyles)((0, $4Uj5b$muimaterial.LinearProgress), {
        colorPrimary: {
            backgroundColor: 'black' // '#e0e0e0'
        },
        barColorPrimary: {
            backgroundColor: currentColor
        }
    });
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)(StyledLinearProgress, {
        ...restProps,
        value: 100 * fade,
        variant: "determinate"
    });
}



function $7cb03e2f4ad57366$export$2e2bcd8739ae039({ scorer: scorer = (0, $89099a5121c435dd$export$19dcdb21c6965fb8), password: password, ...restProps }) {
    const strength = scorer.scoreFn(password);
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $bf8434ea21da792a$export$2e2bcd8739ae039), {
        currentVal: strength,
        minVal: 0,
        maxVal: scorer.maxScore,
        ...restProps
    });
}







const $189e343500739785$export$439d29a4e110a164 = (0, $4Uj5b$muimaterialstyles.styled)('span')({
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
 */ const $189e343500739785$var$RequiredFieldIndicator = ()=>{
    const translate = (0, $4Uj5b$reactadmin.useTranslate)();
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactjsxruntime.Fragment), {
        children: [
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)("span", {
                "aria-hidden": "true",
                children: "*"
            }),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)($189e343500739785$export$439d29a4e110a164, {
                children: translate('auth.input.required_field_description')
            })
        ]
    });
};
var $189e343500739785$export$2e2bcd8739ae039 = $189e343500739785$var$RequiredFieldIndicator;


/**
 * @param onSignup Optional function to call when signup is completed. Called after the `delayBeforeRedirect`.
 * @param additionalSignupValues Passed to react-admin's signup function.
 * @param delayBeforeRedirect In milliseconds
 * @param passwordScorer Scorer to evaluate and indicate password strength.
 *  Set to `null` or `false`, if you don't want password strength checks. Default is
 *  passwordStrength's `defaultScorer`.
 * @returns
 */ const $87a1f23cb4681f00$var$SignupForm = ({ passwordScorer: passwordScorer = (0, $89099a5121c435dd$export$19dcdb21c6965fb8), onSignup: onSignup, additionalSignupValues: additionalSignupValues = {}, delayBeforeRedirect: delayBeforeRedirect = 0, redirectTo: redirectTo })=>{
    const [searchParams] = (0, $4Uj5b$reactrouterdom.useSearchParams)();
    const [handleSubmit, setHandleSubmit] = (0, $4Uj5b$react.useState)(()=>{});
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Form), {
        onSubmit: handleSubmit,
        noValidate: true,
        defaultValues: {
            email: searchParams.get('email')
        },
        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)($87a1f23cb4681f00$var$FormContent, {
            passwordScorer: passwordScorer,
            additionalSignupValues: additionalSignupValues,
            onSignup: onSignup,
            delayBeforeRedirect: delayBeforeRedirect,
            setHandleSubmit: setHandleSubmit,
            redirectTo: redirectTo
        })
    });
};
const $87a1f23cb4681f00$var$FormContent = ({ passwordScorer: passwordScorer = (0, $89099a5121c435dd$export$19dcdb21c6965fb8), onSignup: onSignup, additionalSignupValues: additionalSignupValues, delayBeforeRedirect: delayBeforeRedirect = 0, setHandleSubmit: setHandleSubmit, redirectTo: redirectTo })=>{
    const [loading, setLoading] = (0, $4Uj5b$reactadmin.useSafeSetState)(false);
    const [showPassword, setShowPassword] = (0, $4Uj5b$react.useState)(false);
    const [passwordAnalysis, setPasswordAnalysis] = (0, $4Uj5b$react.useState)(null);
    const signup = (0, $033230994b67a556$export$2e2bcd8739ae039)();
    const translate = (0, $4Uj5b$reactadmin.useTranslate)();
    const notify = (0, $4Uj5b$reactadmin.useNotify)();
    const [searchParams] = (0, $4Uj5b$reactrouterdom.useSearchParams)();
    const [locale] = (0, $4Uj5b$reactadmin.useLocaleState)();
    const [password, setPassword] = (0, $4Uj5b$react.useState)('');
    const formContext = (0, $4Uj5b$reacthookform.useFormContext)();
    const togglePassword = ()=>{
        setShowPassword(!showPassword);
    };
    (0, $4Uj5b$react.useEffect)(()=>{
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
    (0, $4Uj5b$react.useEffect)(()=>{
        if (password && passwordScorer) {
            const analysis = passwordScorer.analyzeFn(password);
            setPasswordAnalysis(analysis);
        } else setPasswordAnalysis(null);
    }, [
        password,
        passwordScorer
    ]);
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.CardContent), {
        children: [
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.TextInput), {
                autoFocus: true,
                source: "username",
                label: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactjsxruntime.Fragment), {
                    children: [
                        translate('auth.input.username'),
                        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $189e343500739785$export$2e2bcd8739ae039), {})
                    ]
                }),
                autoComplete: "username",
                fullWidth: true,
                disabled: loading,
                validate: [
                    (0, $4Uj5b$reactadmin.required)(translate('auth.required.identifier')),
                    (0, $4Uj5b$reactadmin.minLength)(2)
                ],
                format: (value)=>value ? (0, ($parcel$interopDefault($4Uj5b$speakingurl)))(value, {
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
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.TextInput), {
                source: "email",
                label: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactjsxruntime.Fragment), {
                    children: [
                        translate('auth.input.email'),
                        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $189e343500739785$export$2e2bcd8739ae039), {})
                    ]
                }),
                autoComplete: "email",
                fullWidth: true,
                disabled: loading || searchParams.has('email') && searchParams.has('force-email'),
                validate: [
                    (0, $4Uj5b$reactadmin.required)('auth.required.email'),
                    (0, $4Uj5b$reactadmin.email)()
                ]
            }),
            passwordScorer && password && !(searchParams.has('email') && searchParams.has('force-email')) && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactjsxruntime.Fragment), {
                children: [
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Typography), {
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
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $7cb03e2f4ad57366$export$2e2bcd8739ae039), {
                        password: password,
                        scorer: passwordScorer,
                        sx: {
                            width: '100%'
                        }
                    }),
                    passwordAnalysis && passwordAnalysis.suggestions.length > 0 && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Typography), {
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
                                return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)("span", {
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
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)("div", {
                className: "password-container",
                style: {
                    position: 'relative'
                },
                children: [
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.TextInput), {
                        source: "password",
                        type: showPassword ? 'text' : 'password',
                        value: password,
                        onChange: (e)=>{
                            setPassword(e.target.value);
                        },
                        label: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactjsxruntime.Fragment), {
                            children: [
                                translate('ra.auth.password'),
                                /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $189e343500739785$export$2e2bcd8739ae039), {})
                            ]
                        }),
                        autoComplete: "new-password",
                        fullWidth: true,
                        disabled: loading,
                        validate: [
                            (0, $4Uj5b$reactadmin.required)('auth.required.password'),
                            (0, $f9e45ac9fbccef57$export$2e2bcd8739ae039)(passwordScorer)
                        ],
                        "aria-describedby": "signup-password-desc"
                    }),
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $189e343500739785$export$439d29a4e110a164), {
                        id: "signup-password-desc",
                        children: translate('auth.input.password_description')
                    }),
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.IconButton), {
                        "aria-label": translate(showPassword ? 'auth.action.hide_password' : 'auth.action.show_password'),
                        onClick: togglePassword,
                        style: {
                            position: 'absolute',
                            right: '8px',
                            top: '17px',
                            padding: '4px'
                        },
                        size: "large",
                        children: showPassword ? /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muiiconsmaterial.VisibilityOff), {}) : /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muiiconsmaterial.Visibility), {})
                    })
                ]
            }),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Button), {
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
var $87a1f23cb4681f00$export$2e2bcd8739ae039 = $87a1f23cb4681f00$var$SignupForm;










const $403a8b015c5eea65$var$LoginForm = ({ onLogin: onLogin, allowUsername: allowUsername, redirectTo: redirectTo })=>{
    const [searchParams] = (0, $4Uj5b$reactrouterdom.useSearchParams)();
    const [handleSubmit, setHandleSubmit] = (0, $4Uj5b$react.useState)(()=>{});
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Form), {
        onSubmit: handleSubmit,
        noValidate: true,
        defaultValues: {
            email: searchParams.get('email')
        },
        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)($403a8b015c5eea65$var$FormContent, {
            onLogin: onLogin,
            allowUsername: allowUsername,
            setHandleSubmit: setHandleSubmit,
            redirectTo: redirectTo
        })
    });
};
const $403a8b015c5eea65$var$FormContent = ({ onLogin: onLogin, allowUsername: allowUsername, setHandleSubmit: setHandleSubmit, redirectTo: redirectTo })=>{
    const [loading, setLoading] = (0, $4Uj5b$reactadmin.useSafeSetState)(false);
    const [showPassword, setShowPassword] = (0, $4Uj5b$react.useState)(false);
    const login = (0, $4Uj5b$reactadmin.useLogin)();
    const translate = (0, $4Uj5b$reactadmin.useTranslate)();
    const notify = (0, $4Uj5b$reactadmin.useNotify)();
    const [searchParams] = (0, $4Uj5b$reactrouterdom.useSearchParams)();
    const formContext = (0, $4Uj5b$reacthookform.useFormContext)();
    const togglePassword = ()=>{
        setShowPassword(!showPassword);
    };
    (0, $4Uj5b$react.useEffect)(()=>{
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
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.CardContent), {
        children: [
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.TextInput), {
                source: "username",
                label: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactjsxruntime.Fragment), {
                    children: [
                        translate(allowUsername ? 'auth.input.username_or_email' : 'auth.input.email'),
                        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $189e343500739785$export$2e2bcd8739ae039), {})
                    ]
                }),
                autoComplete: "email",
                fullWidth: true,
                disabled: loading || searchParams.has('email') && searchParams.has('force-email'),
                format: (value)=>value ? value.toLowerCase() : '',
                validate: allowUsername ? [
                    (0, $4Uj5b$reactadmin.required)(translate('auth.required.identifier'))
                ] : [
                    (0, $4Uj5b$reactadmin.required)(translate('auth.required.identifier')),
                    (0, $4Uj5b$reactadmin.email)()
                ]
            }),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)("div", {
                className: "password-container",
                style: {
                    position: 'relative'
                },
                children: [
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.TextInput), {
                        source: "password",
                        type: showPassword ? 'text' : 'password',
                        label: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactjsxruntime.Fragment), {
                            children: [
                                translate('ra.auth.password'),
                                /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $189e343500739785$export$2e2bcd8739ae039), {})
                            ]
                        }),
                        autoComplete: "current-password",
                        fullWidth: true,
                        disabled: loading,
                        validate: (0, $4Uj5b$reactadmin.required)(translate('auth.required.password')),
                        "aria-describedby": "password-desc"
                    }),
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $189e343500739785$export$439d29a4e110a164), {
                        id: "password-desc",
                        children: translate('auth.input.password_description')
                    }),
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.IconButton), {
                        "aria-label": translate(showPassword ? 'auth.action.hide_password' : 'auth.action.show_password'),
                        onClick: togglePassword,
                        style: {
                            position: 'absolute',
                            right: '8px',
                            top: '17px',
                            padding: '4px'
                        },
                        size: "large",
                        children: showPassword ? /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muiiconsmaterial.VisibilityOff), {}) : /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muiiconsmaterial.Visibility), {})
                    })
                ]
            }),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Button), {
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
$403a8b015c5eea65$var$LoginForm.defaultValues = {
    allowUsername: false
};
var $403a8b015c5eea65$export$2e2bcd8739ae039 = $403a8b015c5eea65$var$LoginForm;












const $2f0ce992717e175e$var$samePassword = (value, allValues)=>{
    if (value && value !== allValues.password) return 'auth.input.password_mismatch';
};
/**
 *
 * @param {string} redirectTo
 * @param {typeof defaultScorer} passwordScorer Scorer to evaluate and indicate password strength.
 *  Set to `null` or `false`, if you don't want password strength checks. Default is
 *  passwordStrength's `defaultScorer`.
 * @returns
 */ const $2f0ce992717e175e$var$NewPasswordForm = ({ redirectTo: redirectTo, passwordScorer: passwordScorer = (0, $89099a5121c435dd$export$19dcdb21c6965fb8) })=>{
    const [searchParams] = (0, $4Uj5b$reactrouterdom.useSearchParams)();
    const [handleSubmit, setHandleSubmit] = (0, $4Uj5b$react.useState)(()=>{});
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Form), {
        onSubmit: handleSubmit,
        noValidate: true,
        defaultValues: {
            email: searchParams.get('email')
        },
        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)($2f0ce992717e175e$var$FormContent, {
            setHandleSubmit: setHandleSubmit,
            redirectTo: redirectTo,
            passwordScorer: passwordScorer
        })
    });
};
const $2f0ce992717e175e$var$FormContent = ({ setHandleSubmit: setHandleSubmit, redirectTo: redirectTo, passwordScorer: passwordScorer })=>{
    const location = (0, $4Uj5b$reactrouterdom.useLocation)();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const [loading, setLoading] = (0, $4Uj5b$reactadmin.useSafeSetState)(false);
    const [showNewPassword, setShowNewPassword] = (0, $4Uj5b$react.useState)(false);
    const [showConfirmPassword, setShowConfirmPassword] = (0, $4Uj5b$react.useState)(false);
    const authProvider = (0, $4Uj5b$reactadmin.useAuthProvider)();
    const translate = (0, $4Uj5b$reactadmin.useTranslate)();
    const notify = (0, $4Uj5b$reactadmin.useNotify)();
    const [newPassword, setNewPassword] = (0, $4Uj5b$react.useState)('');
    const [passwordAnalysis, setPasswordAnalysis] = (0, $4Uj5b$react.useState)(null);
    const toggleNewPassword = ()=>{
        setShowNewPassword(!showNewPassword);
    };
    const toggleConfirmPassword = ()=>{
        setShowConfirmPassword(!showConfirmPassword);
    };
    (0, $4Uj5b$react.useEffect)(()=>{
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
    (0, $4Uj5b$react.useEffect)(()=>{
        if (newPassword && passwordScorer) {
            const analysis = passwordScorer.analyzeFn(newPassword);
            setPasswordAnalysis(analysis);
        } else setPasswordAnalysis(null);
    }, [
        newPassword,
        passwordScorer
    ]);
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.CardContent), {
        children: [
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.TextInput), {
                autoFocus: true,
                source: "email",
                label: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactjsxruntime.Fragment), {
                    children: [
                        translate('auth.input.email'),
                        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $189e343500739785$export$2e2bcd8739ae039), {})
                    ]
                }),
                autoComplete: "email",
                fullWidth: true,
                disabled: loading,
                validate: (0, $4Uj5b$reactadmin.required)(translate('auth.required.newPassword')),
                format: (value)=>value ? value.toLowerCase() : ''
            }),
            passwordScorer && newPassword && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactjsxruntime.Fragment), {
                children: [
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Typography), {
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
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $7cb03e2f4ad57366$export$2e2bcd8739ae039), {
                        password: newPassword,
                        scorer: passwordScorer,
                        sx: {
                            width: '100%'
                        }
                    }),
                    passwordAnalysis && passwordAnalysis.suggestions.length > 0 && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Typography), {
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
                                return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)("span", {
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
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)("div", {
                className: "password-container",
                style: {
                    position: 'relative'
                },
                children: [
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.TextInput), {
                        autoFocus: true,
                        type: showNewPassword ? 'text' : 'password',
                        source: "password",
                        value: newPassword,
                        label: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactjsxruntime.Fragment), {
                            children: [
                                translate('auth.input.new_password'),
                                /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $189e343500739785$export$2e2bcd8739ae039), {})
                            ]
                        }),
                        autoComplete: "current-password",
                        fullWidth: true,
                        disabled: loading,
                        validate: [
                            (0, $4Uj5b$reactadmin.required)(translate('auth.required.newPasswordAgain')),
                            (0, $f9e45ac9fbccef57$export$2e2bcd8739ae039)(passwordScorer)
                        ],
                        onChange: (e)=>{
                            setNewPassword(e.target.value);
                        },
                        "aria-describedby": "new-password-desc"
                    }),
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $189e343500739785$export$439d29a4e110a164), {
                        id: "new-password-desc",
                        children: translate('auth.input.password_description')
                    }),
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.IconButton), {
                        "aria-label": translate(showNewPassword ? 'auth.action.hide_password' : 'auth.action.show_password'),
                        onClick: toggleNewPassword,
                        style: {
                            position: 'absolute',
                            right: '8px',
                            top: '17px',
                            padding: '4px'
                        },
                        size: "large",
                        children: showNewPassword ? /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muiiconsmaterial.VisibilityOff), {}) : /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muiiconsmaterial.Visibility), {})
                    })
                ]
            }),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)("div", {
                className: "password-container",
                style: {
                    position: 'relative'
                },
                children: [
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.TextInput), {
                        type: showConfirmPassword ? 'text' : 'password',
                        source: "confirm-password",
                        label: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactjsxruntime.Fragment), {
                            children: [
                                translate('auth.input.confirm_new_password'),
                                /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $189e343500739785$export$2e2bcd8739ae039), {})
                            ]
                        }),
                        autoComplete: "current-password",
                        fullWidth: true,
                        disabled: loading,
                        validate: [
                            (0, $4Uj5b$reactadmin.required)(),
                            $2f0ce992717e175e$var$samePassword
                        ],
                        "aria-describedby": "confirm-password-desc"
                    }),
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $189e343500739785$export$439d29a4e110a164), {
                        id: "confirm-password-desc",
                        children: translate('auth.input.password_description')
                    }),
                    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.IconButton), {
                        "aria-label": translate(showConfirmPassword ? 'auth.action.hide_password' : 'auth.action.show_password'),
                        onClick: toggleConfirmPassword,
                        style: {
                            position: 'absolute',
                            right: '8px',
                            top: '17px',
                            padding: '4px'
                        },
                        size: "large",
                        children: showConfirmPassword ? /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muiiconsmaterial.VisibilityOff), {}) : /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muiiconsmaterial.Visibility), {})
                    })
                ]
            }),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Button), {
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
var $2f0ce992717e175e$export$2e2bcd8739ae039 = $2f0ce992717e175e$var$NewPasswordForm;







const $be1129164d40878e$var$ResetPasswordForm = ()=>{
    const [handleSubmit, setHandleSubmit] = (0, $4Uj5b$react.useState)(()=>{});
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Form), {
        onSubmit: handleSubmit,
        noValidate: true,
        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)($be1129164d40878e$var$FormContent, {
            setHandleSubmit: setHandleSubmit
        })
    });
};
const $be1129164d40878e$var$FormContent = ({ setHandleSubmit: setHandleSubmit })=>{
    const [loading, setLoading] = (0, $4Uj5b$reactadmin.useSafeSetState)(false);
    const authProvider = (0, $4Uj5b$reactadmin.useAuthProvider)();
    const translate = (0, $4Uj5b$reactadmin.useTranslate)();
    const notify = (0, $4Uj5b$reactadmin.useNotify)();
    (0, $4Uj5b$react.useEffect)(()=>{
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
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.CardContent), {
        children: [
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.TextInput), {
                autoFocus: true,
                source: "email",
                label: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactjsxruntime.Fragment), {
                    children: [
                        translate('auth.input.email'),
                        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $189e343500739785$export$2e2bcd8739ae039), {})
                    ]
                }),
                autoComplete: "email",
                fullWidth: true,
                disabled: loading,
                validate: (0, $4Uj5b$reactadmin.required)(translate('auth.required.email')),
                format: (value)=>value ? value.toLowerCase() : ''
            }),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Button), {
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
var $be1129164d40878e$export$2e2bcd8739ae039 = $be1129164d40878e$var$ResetPasswordForm;







// TODO jss-to-tss-react codemod: '@global' is not supported by tss-react.
// See https://mui.com/material-ui/customization/how-to-customize/#4-global-css-override for alternatives.
const $d40c6416028cfc15$var$useStyles = (0, $4Uj5b$tssreactmui.makeStyles)()((theme)=>({
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
const $d40c6416028cfc15$var$SimpleBox = ({ title: title, icon: icon, text: text, children: children })=>{
    const { classes: classes } = $d40c6416028cfc15$var$useStyles();
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactjsxruntime.Fragment), {
        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Box), {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            className: classes.root,
            children: [
                /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Card), {
                    className: classes.card,
                    children: [
                        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Box), {
                            p: 2,
                            display: "flex",
                            justifyContent: "start",
                            children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Typography), {
                                variant: "h4",
                                className: classes.title,
                                children: title
                            })
                        }),
                        /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Box), {
                            pl: 2,
                            pr: 2,
                            children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Typography), {
                                variant: "body1",
                                children: text
                            })
                        }),
                        children
                    ]
                }),
                /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Notification), {})
            ]
        })
    });
};
var $d40c6416028cfc15$export$2e2bcd8739ae039 = $d40c6416028cfc15$var$SimpleBox;



const $2ff95c8cae7c2756$var$USED_SEARCH_PARAMS = [
    'signup',
    'reset_password',
    'new_password',
    'email',
    'force-email'
];
const $2ff95c8cae7c2756$var$getSearchParamsRest = (searchParams)=>{
    const rest = [];
    for (const [key, value] of searchParams.entries())if (!$2ff95c8cae7c2756$var$USED_SEARCH_PARAMS.includes(key)) rest.push(`${key}=${encodeURIComponent(value)}`);
    return rest.length > 0 ? rest.join('&') : '';
};
var $2ff95c8cae7c2756$export$2e2bcd8739ae039 = $2ff95c8cae7c2756$var$getSearchParamsRest;



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
 */ const $0d47464799b2c057$var$LocalLoginPage = ({ hasSignup: hasSignup = true, allowUsername: allowUsername = false, onLogin: onLogin, onSignup: onSignup, additionalSignupValues: additionalSignupValues = {}, passwordScorer: passwordScorer = (0, $89099a5121c435dd$export$19dcdb21c6965fb8) })=>{
    const translate = (0, $4Uj5b$reactadmin.useTranslate)();
    const [searchParams] = (0, $4Uj5b$reactrouterdom.useSearchParams)();
    const isSignup = hasSignup && searchParams.has('signup');
    const isResetPassword = searchParams.has('reset_password');
    const isNewPassword = searchParams.has('new_password');
    const isLogin = !isSignup && !isResetPassword && !isNewPassword;
    const redirectTo = (0, $7448e031bca4bf1e$export$bab98af026af71ac)(searchParams.get('redirect')) || (0, $7448e031bca4bf1e$export$50ae7fb6f87de989)(searchParams.get('redirect')) ? searchParams.get('redirect') : '/';
    const { data: identity, isLoading: isLoading } = (0, $4Uj5b$reactadmin.useGetIdentity)();
    (0, $4Uj5b$react.useEffect)(()=>{
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
    const [title, text] = (0, $4Uj5b$react.useMemo)(()=>{
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
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $d40c6416028cfc15$export$2e2bcd8739ae039), {
        title: translate(title),
        text: translate(text),
        icon: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, ($parcel$interopDefault($4Uj5b$muiiconsmaterialLock))), {}),
        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Card), {
            children: [
                isLogin && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $403a8b015c5eea65$export$2e2bcd8739ae039), {
                    onLogin: onLogin,
                    redirectTo: redirectTo || '',
                    allowUsername: allowUsername
                }),
                isSignup && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $87a1f23cb4681f00$export$2e2bcd8739ae039), {
                    delayBeforeRedirect: 4000,
                    redirectTo: redirectTo || '',
                    onSignup: onSignup,
                    additionalSignupValues: additionalSignupValues,
                    passwordScorer: passwordScorer
                }),
                isResetPassword && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $be1129164d40878e$export$2e2bcd8739ae039), {}),
                isNewPassword && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $2f0ce992717e175e$export$2e2bcd8739ae039), {
                    redirectTo: redirectTo || '',
                    passwordScorer: passwordScorer
                }),
                /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.Box), {
                    sx: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mt: -1,
                        mb: 2
                    },
                    children: [
                        (isSignup || isResetPassword) && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactrouterdom.Link), {
                            to: `/login?${(0, $2ff95c8cae7c2756$export$2e2bcd8739ae039)(searchParams)}`,
                            children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Typography), {
                                variant: "body2",
                                children: translate('auth.action.login')
                            })
                        }),
                        isLogin && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$reactjsxruntime.Fragment), {
                            children: [
                                hasSignup && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)("div", {
                                    children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactrouterdom.Link), {
                                        to: `/login?signup=true&${(0, $2ff95c8cae7c2756$export$2e2bcd8739ae039)(searchParams)}`,
                                        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Typography), {
                                            variant: "body2",
                                            children: translate('auth.action.signup')
                                        })
                                    })
                                }),
                                /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)("div", {
                                    children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactrouterdom.Link), {
                                        to: `/login?reset_password=true&${(0, $2ff95c8cae7c2756$export$2e2bcd8739ae039)(searchParams)}`,
                                        children: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.Typography), {
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
var $0d47464799b2c057$export$2e2bcd8739ae039 = $0d47464799b2c057$var$LocalLoginPage;







// Not used for now. The ListWithPermissions component will handle the conditional display of the Create button.
const $76c7f775d1617747$var$ResourceWithPermission = ({ name: name, create: create, ...rest })=>{
    const createContainer = (0, $4Uj5b$semappssemanticdataprovider.useCreateContainerUri)(name);
    const { permissions: permissions } = (0, $4Uj5b$reactadmin.usePermissions)({
        uri: createContainer
    });
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Resource), {
        ...rest,
        name: name,
        create: permissions && permissions.some((p)=>(0, $09c536abc6cea017$export$65615a101bd6f5ca).includes(p['acl:mode'])) ? create : undefined
    });
};
var $76c7f775d1617747$export$2e2bcd8739ae039 = $76c7f775d1617747$var$ResourceWithPermission;









// It's important to pass the ref to allow Material UI to manage the keyboard navigation
// @ts-expect-error TS(2339): Property 'label' does not exist on type '{}'.
const $131d39940f741630$var$UserMenuItem = /*#__PURE__*/ (0, $4Uj5b$react.forwardRef)(({ label: label, icon: icon, to: to, ...rest }, ref)=>{
    const { onClose: onClose } = (0, $4Uj5b$reactadmin.useUserMenu)() || {};
    const translate = (0, $4Uj5b$reactadmin.useTranslate)();
    const navigate = (0, $4Uj5b$reactrouterdom.useNavigate)();
    const onClick = (0, $4Uj5b$react.useCallback)(()=>{
        navigate(to);
        onClose?.();
    }, [
        to,
        onClose,
        navigate
    ]);
    return(// @ts-expect-error TS(2769): No overload matches this call.
    /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsxs)((0, $4Uj5b$muimaterial.MenuItem), {
        onClick: onClick,
        ref: ref,
        ...rest,
        children: [
            icon && /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.ListItemIcon), {
                children: /*#__PURE__*/ (0, ($parcel$interopDefault($4Uj5b$react))).cloneElement(icon, {
                    fontSize: 'small'
                })
            }),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$muimaterial.ListItemText), {
                children: translate(label)
            })
        ]
    }));
});
const $131d39940f741630$var$UserMenu = ({ logout: logout, profileResource: profileResource, ...otherProps })=>{
    const { data: identity } = (0, $4Uj5b$reactadmin.useGetIdentity)();
    return /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.UserMenu), {
        ...otherProps,
        children: identity && identity.id !== '' ? [
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)($131d39940f741630$var$UserMenuItem, {
                // @ts-expect-error TS(2322): Type '{ key: string; label: string; icon: Element;... Remove this comment to see the full error message
                label: "auth.action.view_my_profile",
                icon: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, ($parcel$interopDefault($4Uj5b$muiiconsmaterialAccountCircle))), {}),
                to: `/${profileResource || 'Person'}/${encodeURIComponent(identity?.profileData?.id || identity.id)}/show`
            }, "view"),
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)($131d39940f741630$var$UserMenuItem, {
                // @ts-expect-error TS(2322): Type '{ key: string; label: string; icon: Element;... Remove this comment to see the full error message
                label: "auth.action.edit_my_profile",
                icon: /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, ($parcel$interopDefault($4Uj5b$muiiconsmaterialEdit))), {}),
                to: `/${profileResource || 'Person'}/${encodeURIComponent(identity?.profileData?.id || identity.id)}`
            }, "edit"),
            /*#__PURE__*/ (0, ($parcel$interopDefault($4Uj5b$react))).cloneElement(logout || /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)((0, $4Uj5b$reactadmin.Logout), {}), {
                key: 'logout'
            })
        ] : [
            // @ts-expect-error TS(2322): Type '{ key: string; label: string; to: string; }'... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)($131d39940f741630$var$UserMenuItem, {
                label: "auth.action.signup",
                to: "/login?signup=true"
            }, "signup"),
            // @ts-expect-error TS(2322): Type '{ key: string; label: string; to: string; }'... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $4Uj5b$reactjsxruntime.jsx)($131d39940f741630$var$UserMenuItem, {
                label: "auth.action.login",
                to: "/login"
            }, "login")
        ]
    });
};
var $131d39940f741630$export$2e2bcd8739ae039 = $131d39940f741630$var$UserMenu;






const $4a91bf5a432d59d0$var$useCheckAuthenticated = (message)=>{
    const { data: identity, isLoading: isLoading } = (0, $4Uj5b$reactadmin.useGetIdentity)();
    const notify = (0, $4Uj5b$reactadmin.useNotify)();
    const redirect = (0, $4Uj5b$reactadmin.useRedirect)();
    const location = (0, $4Uj5b$reactrouterdom.useLocation)();
    (0, $4Uj5b$react.useEffect)(()=>{
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
var $4a91bf5a432d59d0$export$2e2bcd8739ae039 = $4a91bf5a432d59d0$var$useCheckAuthenticated;






const $45526ff039ac8974$var$emptyParams = {};
// keep a cache of already fetched permissions to initialize state for new
// components and avoid a useless rerender if the permissions haven't changed
const $45526ff039ac8974$var$alreadyFetchedPermissions = {
    '{}': undefined
};
// Fork of usePermissionsOptimized, with a refetch option
const $45526ff039ac8974$var$usePermissionsWithRefetch = (params = $45526ff039ac8974$var$emptyParams)=>{
    const key = JSON.stringify(params);
    const [state, setState] = (0, $4Uj5b$reactadmin.useSafeSetState)({
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        permissions: $45526ff039ac8974$var$alreadyFetchedPermissions[key]
    });
    const getPermissions = (0, $4Uj5b$reactadmin.useGetPermissions)();
    const fetchPermissions = (0, $4Uj5b$react.useCallback)(()=>getPermissions(params).then((permissions)=>{
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            if (!(0, ($parcel$interopDefault($4Uj5b$lodashisEqual)))(permissions, state.permissions)) {
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                $45526ff039ac8974$var$alreadyFetchedPermissions[key] = permissions;
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
    (0, $4Uj5b$react.useEffect)(()=>{
        fetchPermissions();
    }, [
        key
    ]);
    return {
        ...state,
        refetch: fetchPermissions
    };
};
var $45526ff039ac8974$export$2e2bcd8739ae039 = $45526ff039ac8974$var$usePermissionsWithRefetch;






const $910ad1ab1142b9b2$var$englishMessages = {
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
var $910ad1ab1142b9b2$export$2e2bcd8739ae039 = $910ad1ab1142b9b2$var$englishMessages;


const $e20e00d5292fa16c$var$frenchMessages = {
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
var $e20e00d5292fa16c$export$2e2bcd8739ae039 = $e20e00d5292fa16c$var$frenchMessages;


var $2b305707583c053c$exports = {};


$parcel$exportWildcard(module.exports, $2b305707583c053c$exports);


//# sourceMappingURL=index.cjs.js.map
