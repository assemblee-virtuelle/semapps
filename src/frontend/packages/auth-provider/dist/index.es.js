import $1obPJ$jwtdecode from "jwt-decode";
import $1obPJ$urljoin from "url-join";
import {discoveryRequest as $1obPJ$discoveryRequest, processDiscoveryResponse as $1obPJ$processDiscoveryResponse, generateRandomCodeVerifier as $1obPJ$generateRandomCodeVerifier, calculatePKCECodeChallenge as $1obPJ$calculatePKCECodeChallenge, validateAuthResponse as $1obPJ$validateAuthResponse, expectNoState as $1obPJ$expectNoState, isOAuth2Error as $1obPJ$isOAuth2Error, authorizationCodeGrantRequest as $1obPJ$authorizationCodeGrantRequest, processAuthorizationCodeOpenIDResponse as $1obPJ$processAuthorizationCodeOpenIDResponse} from "oauth4webapi";
import {jsx as $1obPJ$jsx, jsxs as $1obPJ$jsxs, Fragment as $1obPJ$Fragment} from "react/jsx-runtime";
import $1obPJ$react, {useEffect as $1obPJ$useEffect, useState as $1obPJ$useState, useCallback as $1obPJ$useCallback, useRef as $1obPJ$useRef, useMemo as $1obPJ$useMemo, forwardRef as $1obPJ$forwardRef} from "react";
import {useResourceContext as $1obPJ$useResourceContext, Create as $1obPJ$Create, CreateActions as $1obPJ$CreateActions, usePermissions as $1obPJ$usePermissions, useNotify as $1obPJ$useNotify, useRedirect as $1obPJ$useRedirect, useGetRecordId as $1obPJ$useGetRecordId, Edit as $1obPJ$Edit, useResourceDefinition as $1obPJ$useResourceDefinition, useRecordContext as $1obPJ$useRecordContext, TopToolbar as $1obPJ$TopToolbar, ListButton as $1obPJ$ListButton, ShowButton as $1obPJ$ShowButton, Button as $1obPJ$Button, useTranslate as $1obPJ$useTranslate, useGetList as $1obPJ$useGetList, useDataProvider as $1obPJ$useDataProvider, Loading as $1obPJ$Loading, Error as $1obPJ$Error, useAuthProvider as $1obPJ$useAuthProvider, Toolbar as $1obPJ$Toolbar, SaveButton as $1obPJ$SaveButton, DeleteButton as $1obPJ$DeleteButton, EditButton as $1obPJ$EditButton, List as $1obPJ$List1, CreateButton as $1obPJ$CreateButton, ExportButton as $1obPJ$ExportButton, Show as $1obPJ$Show, useLogin as $1obPJ$useLogin, useGetIdentity as $1obPJ$useGetIdentity, useSafeSetState as $1obPJ$useSafeSetState, useLocaleState as $1obPJ$useLocaleState, Form as $1obPJ$Form, TextInput as $1obPJ$TextInput, required as $1obPJ$required, minLength as $1obPJ$minLength, email as $1obPJ$email, Notification as $1obPJ$Notification, Resource as $1obPJ$Resource, useUserMenu as $1obPJ$useUserMenu, UserMenu as $1obPJ$UserMenu, Logout as $1obPJ$Logout, useGetPermissions as $1obPJ$useGetPermissions} from "react-admin";
import {useCreateContainerUri as $1obPJ$useCreateContainerUri, useCreateContainer as $1obPJ$useCreateContainer} from "@semapps/semantic-data-provider";
import $1obPJ$muiiconsmaterialShare from "@mui/icons-material/Share";
import {Dialog as $1obPJ$Dialog, DialogTitle as $1obPJ$DialogTitle, DialogContent as $1obPJ$DialogContent, DialogActions as $1obPJ$DialogActions, TextField as $1obPJ$TextField, List as $1obPJ$List, ListItem as $1obPJ$ListItem, ListItemAvatar as $1obPJ$ListItemAvatar, Avatar as $1obPJ$Avatar, ListItemText as $1obPJ$ListItemText, ListItemSecondaryAction as $1obPJ$ListItemSecondaryAction, IconButton as $1obPJ$IconButton, Menu as $1obPJ$Menu, MenuItem as $1obPJ$MenuItem, ListItemIcon as $1obPJ$ListItemIcon, useMediaQuery as $1obPJ$useMediaQuery, DialogContentText as $1obPJ$DialogContentText, Button as $1obPJ$Button1, Card as $1obPJ$Card, Typography as $1obPJ$Typography, CardActions as $1obPJ$CardActions, CardContent as $1obPJ$CardContent, CircularProgress as $1obPJ$CircularProgress, LinearProgress as $1obPJ$LinearProgress, Box as $1obPJ$Box} from "@mui/material";
import $1obPJ$muistylesmakeStyles from "@mui/styles/makeStyles";
import $1obPJ$muimaterialAutocomplete from "@mui/material/Autocomplete";
import $1obPJ$muiiconsmaterialPerson from "@mui/icons-material/Person";
import {styled as $1obPJ$styled} from "@mui/system";
import $1obPJ$muiiconsmaterialEdit from "@mui/icons-material/Edit";
import $1obPJ$muiiconsmaterialCheck from "@mui/icons-material/Check";
import $1obPJ$muiiconsmaterialPublic from "@mui/icons-material/Public";
import $1obPJ$muiiconsmaterialVpnLock from "@mui/icons-material/VpnLock";
import $1obPJ$muiiconsmaterialGroup from "@mui/icons-material/Group";
import {styled as $1obPJ$styled1} from "@mui/material/styles";
import {useNavigate as $1obPJ$useNavigate, useSearchParams as $1obPJ$useSearchParams, Link as $1obPJ$Link, useLocation as $1obPJ$useLocation} from "react-router-dom";
import $1obPJ$muiiconsmaterialLock from "@mui/icons-material/Lock";
import $1obPJ$speakingurl from "speakingurl";
import {withStyles as $1obPJ$withStyles} from "@mui/styles";
import $1obPJ$muiiconsmaterialAccountCircle from "@mui/icons-material/AccountCircle";
import $1obPJ$lodashisEqual from "lodash/isEqual";





const $47a3fad69bcb0083$export$dca4f48302963835 = (value)=>!value ? undefined : Array.isArray(value) ? value : [
        value
    ];
const $47a3fad69bcb0083$export$4450a74bced1b745 = (resourceUri)=>{
    const parsedUrl = new URL(resourceUri);
    return (0, $1obPJ$urljoin)(parsedUrl.origin, "_acl", parsedUrl.pathname);
};
const $47a3fad69bcb0083$export$4d54b642c3d13c34 = (baseUri)=>({
        "@base": baseUri,
        acl: "http://www.w3.org/ns/auth/acl#",
        foaf: "http://xmlns.com/foaf/0.1/",
        "acl:agent": {
            "@type": "@id"
        },
        "acl:agentGroup": {
            "@type": "@id"
        },
        "acl:agentClass": {
            "@type": "@id"
        },
        "acl:mode": {
            "@type": "@id"
        },
        "acl:accessTo": {
            "@type": "@id"
        }
    });
const $47a3fad69bcb0083$export$274217e117cdbc7b = async (dataProvider)=>{
    const dataServers = await dataProvider.getDataServers();
    const authServer = Object.values(dataServers).find((server)=>server.authServer === true);
    if (!authServer) throw new Error("Could not find a server with authServer: true. Check your dataServers config.");
    // If the server is a POD, return the root URL instead of https://domain.com/user/data
    return authServer.pod ? new URL(authServer.baseUrl).origin : authServer.baseUrl;
};
const $47a3fad69bcb0083$export$1391212d75b2ee65 = async (t)=>new Promise((resolve)=>setTimeout(resolve, t));


const $1d8606895ce3b768$var$AUTH_TYPE_SSO = "sso";
const $1d8606895ce3b768$var$AUTH_TYPE_LOCAL = "local";
const $1d8606895ce3b768$var$AUTH_TYPE_POD = "pod";
const $1d8606895ce3b768$var$AUTH_TYPE_SOLID_OIDC = "solid-oidc";
const $1d8606895ce3b768$var$authProvider = ({ dataProvider: dataProvider, authType: authType, allowAnonymous: allowAnonymous = true, checkUser: checkUser, checkPermissions: checkPermissions = false, clientId: clientId })=>{
    if (![
        $1d8606895ce3b768$var$AUTH_TYPE_SSO,
        $1d8606895ce3b768$var$AUTH_TYPE_LOCAL,
        $1d8606895ce3b768$var$AUTH_TYPE_POD,
        $1d8606895ce3b768$var$AUTH_TYPE_SOLID_OIDC
    ].includes(authType)) throw new Error("The authType parameter is missing from the auth provider");
    if (authType === $1d8606895ce3b768$var$AUTH_TYPE_SOLID_OIDC && !clientId) throw new Error("The clientId parameter is required for solid-oidc authentication");
    const callCheckUser = async (webId)=>{
        if (checkUser) try {
            const { json: userData } = await dataProvider.fetch(webId);
            if (!userData) throw new Error("auth.message.unable_to_fetch_user_data");
            if (checkUser(userData) === false) throw new Error("auth.message.user_not_allowed_to_login");
        } catch (e) {
            localStorage.removeItem("token");
            throw e;
        }
    };
    return {
        login: async (params)=>{
            if (authType === $1d8606895ce3b768$var$AUTH_TYPE_SOLID_OIDC) {
                const { webId: webId, issuer: issuer, redirect: redirect = "/", isSignup: isSignup = false } = params;
                webId && issuer;
                const as = await $1obPJ$discoveryRequest(new URL(issuer)).then((response)=>$1obPJ$processDiscoveryResponse(new URL(issuer), response));
                const codeVerifier = $1obPJ$generateRandomCodeVerifier();
                const codeChallenge = await $1obPJ$calculatePKCECodeChallenge(codeVerifier);
                const codeChallengeMethod = "S256";
                // Save to use on handleCallback method
                localStorage.setItem("code_verifier", codeVerifier);
                localStorage.setItem("redirect", redirect);
                const authorizationUrl = new URL(as.authorization_endpoint);
                authorizationUrl.searchParams.set("response_type", "code");
                authorizationUrl.searchParams.set("client_id", clientId);
                authorizationUrl.searchParams.set("code_challenge", codeChallenge);
                authorizationUrl.searchParams.set("code_challenge_method", codeChallengeMethod);
                authorizationUrl.searchParams.set("redirect_uri", `${window.location.origin}/auth-callback`);
                authorizationUrl.searchParams.set("scope", "openid webid offline_access");
                authorizationUrl.searchParams.set("is_signup", isSignup);
                window.location = authorizationUrl;
            } else if (authType === $1d8606895ce3b768$var$AUTH_TYPE_LOCAL) {
                const { username: username, password: password, interactionId: interactionId, redirectTo: redirectTo } = params;
                const authServerUrl = await (0, $47a3fad69bcb0083$export$274217e117cdbc7b)(dataProvider);
                let token, webId;
                try {
                    ({ json: { token: token, webId: webId } } = await dataProvider.fetch((0, $1obPJ$urljoin)(authServerUrl, "auth/login"), {
                        method: "POST",
                        body: JSON.stringify({
                            username: username.trim(),
                            password: password.trim(),
                            interactionId: interactionId
                        }),
                        headers: new Headers({
                            "Content-Type": "application/json"
                        })
                    }));
                } catch (e) {
                    throw new Error("ra.auth.sign_in_error");
                }
                // Set token now as it is required for refreshConfig
                localStorage.setItem("token", token);
                await dataProvider.refreshConfig();
                await callCheckUser(webId);
                // TODO now that we have a refreshConfig method, see if we can avoid a hard reload
                if (redirectTo) {
                    if (interactionId) await (0, $47a3fad69bcb0083$export$1391212d75b2ee65)(3000); // Ensure the interactionId has been received and processed
                    window.location.href = redirectTo;
                } else window.location.reload();
            } else if (authType === $1d8606895ce3b768$var$AUTH_TYPE_SSO) {
                const authServerUrl = await (0, $47a3fad69bcb0083$export$274217e117cdbc7b)(dataProvider);
                let redirectUrl = `${new URL(window.location.href).origin}/login?login=true`;
                if (params.redirect) redirectUrl += `&redirect=${encodeURIComponent(params.redirect)}`;
                window.location.href = (0, $1obPJ$urljoin)(authServerUrl, `auth?redirectUrl=${encodeURIComponent(redirectUrl)}`);
            }
        },
        handleCallback: async ()=>{
            const { searchParams: searchParams } = new URL(window.location);
            if (authType === $1d8606895ce3b768$var$AUTH_TYPE_SOLID_OIDC) {
                const issuer = new URL(searchParams.get("iss"));
                const as = await $1obPJ$discoveryRequest(issuer).then((response)=>$1obPJ$processDiscoveryResponse(issuer, response));
                const client = {
                    client_id: clientId,
                    token_endpoint_auth_method: "none" // We don't have a client secret
                };
                const currentUrl = new URL(window.location.href);
                const params = $1obPJ$validateAuthResponse(as, client, currentUrl, $1obPJ$expectNoState);
                if ($1obPJ$isOAuth2Error(params)) throw new Error(`OAuth error: ${params.error} (${params.error_description})`);
                // Retrieve data set during login
                const codeVerifier = localStorage.getItem("code_verifier");
                const redirect = localStorage.getItem("redirect");
                const response = await $1obPJ$authorizationCodeGrantRequest(as, client, params, `${window.location.origin}/auth-callback`, codeVerifier);
                const result = await $1obPJ$processAuthorizationCodeOpenIDResponse(as, client, response);
                if ($1obPJ$isOAuth2Error(result)) throw new Error(`OAuth error: ${params.error} (${params.error_description})`);
                // Until DPoP is implemented, use the ID token to log into local Pod
                // And the proxy endpoint to log into remote Pods
                localStorage.setItem("token", result.id_token);
                // Remove we don't need it anymore
                localStorage.removeItem("code_verifier");
                localStorage.removeItem("redirect");
                // Reload to ensure the dataServer config is reset
                window.location.href = redirect || "/";
            } else {
                const token = searchParams.get("token");
                if (!token) throw new Error("auth.message.no_token_returned");
                let webId;
                try {
                    ({ webId: webId } = (0, $1obPJ$jwtdecode)(token));
                } catch (e) {
                    throw new Error("auth.message.invalid_token_returned");
                }
                localStorage.setItem("token", token);
                await dataProvider.refreshConfig();
                await callCheckUser(webId);
                // TODO now that we have a refreshConfig method, see if we can avoid a hard reload
                window.location.href = "/";
            }
        },
        signup: async (params)=>{
            const authServerUrl = await (0, $47a3fad69bcb0083$export$274217e117cdbc7b)(dataProvider);
            if (authType === $1d8606895ce3b768$var$AUTH_TYPE_LOCAL) {
                const { username: username, email: email, password: password, domain: domain, interactionId: interactionId, ...profileData } = params;
                let token, webId;
                try {
                    ({ json: { token: token, webId: webId } } = await dataProvider.fetch((0, $1obPJ$urljoin)(authServerUrl, "auth/signup"), {
                        method: "POST",
                        body: JSON.stringify({
                            username: username?.trim(),
                            email: email.trim(),
                            password: password.trim(),
                            interactionId: interactionId,
                            ...profileData
                        }),
                        headers: new Headers({
                            "Content-Type": "application/json"
                        })
                    }));
                } catch (e) {
                    if (e.message === "email.already.exists") throw new Error("auth.message.user_email_exist");
                    else if (e.message === "username.already.exists") throw new Error("auth.message.username_exist");
                    else if (e.message === "username.invalid") throw new Error("auth.message.username_invalid");
                    else throw new Error("auth.message.signup_error");
                }
                localStorage.setItem("token", token);
                await dataProvider.refreshConfig();
                await callCheckUser(webId);
                return webId;
            } else {
                const redirectUrl = `${new URL(window.location.href).origin}/login?login=true`;
                window.location.href = (0, $1obPJ$urljoin)(authServerUrl, `auth?redirectUrl=${encodeURIComponent(redirectUrl)}`);
            }
        },
        logout: async (redirectUrl)=>{
            switch(authType){
                case $1d8606895ce3b768$var$AUTH_TYPE_LOCAL:
                    {
                        const authServerUrl = await (0, $47a3fad69bcb0083$export$274217e117cdbc7b)(dataProvider);
                        // Delete token but also any other value in local storage
                        localStorage.clear();
                        let result = {};
                        try {
                            result = await dataProvider.fetch((0, $1obPJ$urljoin)(authServerUrl, ".well-known/openid-configuration"));
                        } catch (e) {
                        // Do nothing if it fails
                        }
                        if (result.status === 200 && result.json) // Redirect to OIDC endpoint if it exists
                        window.location.href = result.json.end_session_endpoint;
                        else {
                            // Reload to ensure the dataServer config is reset
                            window.location.reload();
                            window.location.href = "/";
                        }
                        break;
                    }
                case $1d8606895ce3b768$var$AUTH_TYPE_SSO:
                    {
                        const authServerUrl = await (0, $47a3fad69bcb0083$export$274217e117cdbc7b)(dataProvider);
                        const baseUrl = new URL(window.location.href).origin;
                        return (0, $1obPJ$urljoin)(authServerUrl, `auth/logout?redirectUrl=${encodeURIComponent(`${(0, $1obPJ$urljoin)(baseUrl, "login")}?logout=true`)}`);
                    }
                case $1d8606895ce3b768$var$AUTH_TYPE_POD:
                    {
                        const token = localStorage.getItem("token");
                        if (token) {
                            const { webId: webId } = (0, $1obPJ$jwtdecode)(token);
                            // Delete token but also any other value in local storage
                            localStorage.clear();
                            // Redirect to the POD provider
                            return `${(0, $1obPJ$urljoin)(webId, "openApp")}?type=${encodeURIComponent("http://activitypods.org/ns/core#FrontAppRegistration")}`;
                        }
                        break;
                    }
                case $1d8606895ce3b768$var$AUTH_TYPE_SOLID_OIDC:
                    {
                        const token = localStorage.getItem("token");
                        if (token) {
                            const { webid: webId } = (0, $1obPJ$jwtdecode)(token); // Not webId !!
                            // Delete token but also any other value in local storage
                            localStorage.clear();
                            // Redirect to the Pod provider
                            // TODO Use 'solid:oidcIssuer' when it is available
                            // See https://github.com/activitypods/activitypods/issues/122
                            return redirectUrl || new URL(webId).origin;
                        } else return redirectUrl;
                    }
                default:
                    break;
            }
        },
        checkAuth: async ()=>{
            const token = localStorage.getItem("token");
            if (!token && !allowAnonymous) throw new Error();
        },
        checkUser: (userData)=>{
            if (checkUser) return checkUser(userData);
            return true;
        },
        checkError: (error)=>Promise.resolve(),
        getPermissions: async (uri)=>{
            if (!checkPermissions) return;
            // React-admin calls getPermissions with an empty object on every page refresh
            // It also passes an object `{ params: { route: 'dashboard' } }` on the Dashboard
            // Ignore all this until we found a way to bypass these redundant calls
            if (typeof uri === "object") return;
            if (!uri || !uri.startsWith("http")) throw new Error("The first parameter passed to getPermissions must be an URL");
            const aclUri = (0, $47a3fad69bcb0083$export$4450a74bced1b745)(uri);
            try {
                const { json: json } = await dataProvider.fetch(aclUri);
                return json["@graph"];
            } catch (e) {
                console.warn(`Could not fetch ACL URI ${uri}`);
                return [];
            }
        },
        addPermission: async (uri, agentId, predicate, mode)=>{
            if (!uri || !uri.startsWith("http")) throw new Error("The first parameter passed to addPermission must be an URL");
            const aclUri = (0, $47a3fad69bcb0083$export$4450a74bced1b745)(uri);
            const authorization = {
                "@id": `#${mode.replace("acl:", "")}`,
                "@type": "acl:Authorization",
                [predicate]: agentId,
                "acl:accessTo": uri,
                "acl:mode": mode
            };
            await dataProvider.fetch(aclUri, {
                method: "PATCH",
                body: JSON.stringify({
                    "@context": (0, $47a3fad69bcb0083$export$4d54b642c3d13c34)(aclUri),
                    "@graph": [
                        authorization
                    ]
                })
            });
        },
        removePermission: async (uri, agentId, predicate, mode)=>{
            if (!uri || !uri.startsWith("http")) throw new Error("The first parameter passed to removePermission must be an URL");
            const aclUri = (0, $47a3fad69bcb0083$export$4450a74bced1b745)(uri);
            // Fetch current permissions
            const { json: json } = await dataProvider.fetch(aclUri);
            const updatedPermissions = json["@graph"].filter((authorization)=>!authorization["@id"].includes("#Default")).map((authorization)=>{
                const modes = (0, $47a3fad69bcb0083$export$dca4f48302963835)(authorization["acl:mode"]);
                let agents = (0, $47a3fad69bcb0083$export$dca4f48302963835)(authorization[predicate]);
                if (mode && modes.includes(mode) && agents && agents.includes(agentId)) agents = agents.filter((agent)=>agent !== agentId);
                return {
                    ...authorization,
                    [predicate]: agents
                };
            });
            await dataProvider.fetch(aclUri, {
                method: "PUT",
                body: JSON.stringify({
                    "@context": (0, $47a3fad69bcb0083$export$4d54b642c3d13c34)(aclUri),
                    "@graph": updatedPermissions
                })
            });
        },
        getIdentity: async ()=>{
            const token = localStorage.getItem("token");
            if (token) {
                const payload = (0, $1obPJ$jwtdecode)(token);
                const webId = payload.webId || payload.webid; // Currently we must deal with both formats
                if (!webId) throw new Error("No webId found on provided token !");
                const { json: webIdData } = await dataProvider.fetch(webId);
                const { json: profileData } = webIdData.url ? await dataProvider.fetch(webIdData.url) : {};
                return {
                    id: webId,
                    fullName: profileData?.["vcard:given-name"] || profileData?.["pair:label"] || webIdData["foaf:name"] || webIdData["pair:label"],
                    profileData: profileData,
                    webIdData: webIdData
                };
            }
        },
        resetPassword: async (params)=>{
            const { email: email } = params;
            const authServerUrl = await (0, $47a3fad69bcb0083$export$274217e117cdbc7b)(dataProvider);
            try {
                await dataProvider.fetch((0, $1obPJ$urljoin)(authServerUrl, "auth/reset_password"), {
                    method: "POST",
                    body: JSON.stringify({
                        email: email.trim()
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json"
                    })
                });
            } catch (e) {
                if (e.message === "email.not.exists") throw new Error("auth.message.user_email_not_found");
                else throw new Error("auth.notification.reset_password_error");
            }
        },
        setNewPassword: async (params)=>{
            const { email: email, token: token, password: password } = params;
            const authServerUrl = await (0, $47a3fad69bcb0083$export$274217e117cdbc7b)(dataProvider);
            try {
                await dataProvider.fetch((0, $1obPJ$urljoin)(authServerUrl, "auth/new_password"), {
                    method: "POST",
                    body: JSON.stringify({
                        email: email.trim(),
                        token: token,
                        password: password
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json"
                    })
                });
            } catch (e) {
                if (e.message === "email.not.exists") throw new Error("auth.message.user_email_not_found");
                else throw new Error("auth.notification.new_password_error");
            }
        },
        getAccountSettings: async (params)=>{
            const authServerUrl = await (0, $47a3fad69bcb0083$export$274217e117cdbc7b)(dataProvider);
            try {
                const { json: json } = await dataProvider.fetch((0, $1obPJ$urljoin)(authServerUrl, "auth/account"));
                return json;
            } catch (e) {
                throw new Error("auth.notification.get_settings_error");
            }
        },
        updateAccountSettings: async (params)=>{
            const authServerUrl = await (0, $47a3fad69bcb0083$export$274217e117cdbc7b)(dataProvider);
            try {
                const { email: email, currentPassword: currentPassword, newPassword: newPassword } = params;
                await dataProvider.fetch((0, $1obPJ$urljoin)(authServerUrl, "auth/account"), {
                    method: "POST",
                    body: JSON.stringify({
                        currentPassword: currentPassword,
                        email: email?.trim(),
                        newPassword: newPassword
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json"
                    })
                });
            } catch (e) {
                if (e.message === "auth.account.invalid_password") throw new Error("auth.notification.invalid_password");
                throw new Error("auth.notification.update_settings_error");
            }
        },
        /**
     * Inform the OIDC server that the login interaction has been completed.
     * This is necessary, otherwise the OIDC server will keep on redirecting to the login form.
     * We call the endpoint with the token as a proof of login, otherwise it could be abused.
     */ loginCompleted: async (interactionId, webId)=>{
            const authServerUrl = await (0, $47a3fad69bcb0083$export$274217e117cdbc7b)(dataProvider);
            // Note: the
            await dataProvider.fetch((0, $1obPJ$urljoin)(authServerUrl, ".oidc/login-completed"), {
                method: "POST",
                body: JSON.stringify({
                    interactionId: interactionId,
                    webId: webId
                }),
                headers: new Headers({
                    "Content-Type": "application/json"
                })
            });
        }
    };
};
var $1d8606895ce3b768$export$2e2bcd8739ae039 = $1d8606895ce3b768$var$authProvider;








const $dd9154ee844248d7$export$66a34090010a35b3 = "acl:Read";
const $dd9154ee844248d7$export$7c883503ccedfe0e = "acl:Append";
const $dd9154ee844248d7$export$2e56ecf100ca4ba6 = "acl:Write";
const $dd9154ee844248d7$export$5581cb2c55de143a = "acl:Control";
const $dd9154ee844248d7$export$97a08a1bb7ee0545 = "acl:agent";
const $dd9154ee844248d7$export$f07ccbe0773f2c7 = "acl:agentGroup";
const $dd9154ee844248d7$export$2703254089a859eb = "acl:agentClass";
const $dd9154ee844248d7$export$83ae1bc0992a6335 = "foaf:Agent";
const $dd9154ee844248d7$export$546c01a3ffdabe3a = "acl:AuthenticatedAgent";
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
    show: "auth.message.resource_show_forbidden",
    edit: "auth.message.resource_edit_forbidden",
    delete: "auth.message.resource_delete_forbidden",
    control: "auth.message.resource_control_forbidden",
    list: "auth.message.container_list_forbidden",
    create: "auth.message.container_create_forbidden"
};
const $dd9154ee844248d7$export$2e9571c4ccdeb6a9 = {
    [$dd9154ee844248d7$export$66a34090010a35b3]: "auth.right.resource.read",
    [$dd9154ee844248d7$export$7c883503ccedfe0e]: "auth.right.resource.append",
    [$dd9154ee844248d7$export$2e56ecf100ca4ba6]: "auth.right.resource.write",
    [$dd9154ee844248d7$export$5581cb2c55de143a]: "auth.right.resource.control"
};
const $dd9154ee844248d7$export$edca379024d80309 = {
    [$dd9154ee844248d7$export$66a34090010a35b3]: "auth.right.container.read",
    [$dd9154ee844248d7$export$2e56ecf100ca4ba6]: "auth.right.container.write",
    [$dd9154ee844248d7$export$5581cb2c55de143a]: "auth.right.container.control"
};


const $3246c5a1f284b82d$var$useCheckPermissions = (uri, mode, redirectUrl = "/")=>{
    const { permissions: permissions } = (0, $1obPJ$usePermissions)(uri);
    const notify = (0, $1obPJ$useNotify)();
    const redirect = (0, $1obPJ$useRedirect)();
    (0, $1obPJ$useEffect)(()=>{
        if (permissions && !permissions.some((p)=>(0, $dd9154ee844248d7$export$cae945d60b6cbe50)[mode].includes(p["acl:mode"]))) {
            notify((0, $dd9154ee844248d7$export$12e6e8e71d10a4bb)[mode], {
                type: "error"
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


const $f2c5683e04dee28c$var$CreateWithPermissions = (props)=>{
    const resource = (0, $1obPJ$useResourceContext)();
    const createContainerUri = (0, $1obPJ$useCreateContainerUri)()(resource);
    (0, $3246c5a1f284b82d$export$2e2bcd8739ae039)(createContainerUri, "create");
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Create), {
        ...props
    });
};
$f2c5683e04dee28c$var$CreateWithPermissions.defaultProps = {
    actions: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$CreateActions), {})
};
var $f2c5683e04dee28c$export$2e2bcd8739ae039 = $f2c5683e04dee28c$var$CreateWithPermissions;



























const $38698ff0e415f88b$var$useStyles = (0, $1obPJ$muistylesmakeStyles)(()=>({
        list: {
            padding: 0,
            width: "100%"
        },
        option: {
            padding: 0
        }
    }));
const $38698ff0e415f88b$var$AddPermissionsForm = ({ agents: agents, addPermission: addPermission })=>{
    const classes = $38698ff0e415f88b$var$useStyles();
    const translate = (0, $1obPJ$useTranslate)();
    const [value, setValue] = (0, $1obPJ$useState)(null);
    const [inputValue, setInputValue] = (0, $1obPJ$useState)("");
    const [options, setOptions] = (0, $1obPJ$useState)([]);
    const { data: data } = (0, $1obPJ$useGetList)("Person", {
        pagination: {
            page: 1,
            perPage: 100
        },
        sort: {
            field: "pair:label",
            order: "ASC"
        },
        filter: {
            q: inputValue
        }
    }, {
        enabled: inputValue.length > 0
    });
    (0, $1obPJ$useEffect)(()=>{
        setOptions(data?.length > 0 ? Object.values(data) : []);
    }, [
        data
    ]);
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$muimaterialAutocomplete), {
        classes: {
            option: classes.option
        },
        getOptionLabel: (option)=>option["pair:label"],
        // Do not return agents which have already been added
        filterOptions: (x)=>x.filter((agent)=>!Object.keys(agents).includes(agent.id)),
        options: options,
        noOptionsText: translate("ra.navigation.no_results"),
        autoComplete: true,
        blurOnSelect: true,
        clearOnBlur: true,
        disableClearable: true,
        value: value,
        onChange: (event, record)=>{
            addPermission(record.id || record["@id"], (0, $dd9154ee844248d7$export$97a08a1bb7ee0545), (0, $dd9154ee844248d7$export$66a34090010a35b3));
            setValue(null);
            setInputValue("");
            setOptions([]);
        },
        onInputChange: (event, newInputValue)=>{
            setInputValue(newInputValue);
        },
        renderInput: (params)=>/*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextField), {
                ...params,
                label: translate("auth.input.agent_select"),
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
                            primary: option["pair:label"]
                        })
                    ]
                })
            })
    });
};
var $38698ff0e415f88b$export$2e2bcd8739ae039 = $38698ff0e415f88b$var$AddPermissionsForm;





















const $2a38cfa58fd59a9e$var$AgentIcon = ({ agent: agent })=>{
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
var $2a38cfa58fd59a9e$export$2e2bcd8739ae039 = $2a38cfa58fd59a9e$var$AgentIcon;


const $e8b8e6301988112e$var$useStyles = (0, $1obPJ$muistylesmakeStyles)(()=>({
        listItem: {
            paddingLeft: 4,
            paddingRight: 36
        },
        primaryText: {
            width: "30%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
        },
        secondaryText: {
            textAlign: "center",
            width: "60%",
            fontStyle: "italic",
            color: "grey"
        }
    }));
const $e8b8e6301988112e$var$AgentItem = ({ isContainer: isContainer, agent: agent, addPermission: addPermission, removePermission: removePermission })=>{
    const classes = $e8b8e6301988112e$var$useStyles();
    const translate = (0, $1obPJ$useTranslate)();
    const dataProvider = (0, $1obPJ$useDataProvider)();
    const [anchorEl, setAnchorEl] = (0, $1obPJ$react).useState(null);
    const [user, setUser] = (0, $1obPJ$useState)();
    const [loading, setLoading] = (0, $1obPJ$useState)(true);
    const [error, setError] = (0, $1obPJ$useState)();
    (0, $1obPJ$useEffect)(()=>{
        if (agent.predicate === (0, $dd9154ee844248d7$export$97a08a1bb7ee0545)) dataProvider.getOne("Person", {
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
    if (error) return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Error), {});
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$ListItem), {
        className: classes.listItem,
        children: [
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ListItemAvatar), {
                children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Avatar), {
                    src: user?.image,
                    children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $2a38cfa58fd59a9e$export$2e2bcd8739ae039), {
                        agent: agent
                    })
                })
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ListItemText), {
                className: classes.primaryText,
                primary: user ? user["pair:label"] : translate(agent.id === (0, $dd9154ee844248d7$export$83ae1bc0992a6335) ? "auth.agent.anonymous" : "auth.agent.authenticated")
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ListItemText), {
                className: classes.secondaryText,
                primary: agent.permissions && agent.permissions.map((p)=>translate(labels[p])).join(", ")
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
var $e8b8e6301988112e$export$2e2bcd8739ae039 = $e8b8e6301988112e$var$AgentItem;


const $c8acba773a123777$var$StyledList = (0, $1obPJ$styled)((0, $1obPJ$List))(({ theme: theme })=>({
        width: "100%",
        maxWidth: "100%",
        backgroundColor: theme.palette.background.paper
    }));
const $c8acba773a123777$var$EditPermissionsForm = ({ isContainer: isContainer, agents: agents, addPermission: addPermission, removePermission: removePermission })=>{
    return /*#__PURE__*/ (0, $1obPJ$jsx)($c8acba773a123777$var$StyledList, {
        dense: true,
        children: Object.entries(agents).map(([agentId, agent])=>/*#__PURE__*/ (0, $1obPJ$jsx)((0, $e8b8e6301988112e$export$2e2bcd8739ae039), {
                isContainer: isContainer,
                agent: agent,
                addPermission: addPermission,
                removePermission: removePermission
            }, agentId))
    });
};
var $c8acba773a123777$export$2e2bcd8739ae039 = $c8acba773a123777$var$EditPermissionsForm;






const $7ad577d9c9c71db0$var$useAgents = (uri)=>{
    const { permissions: permissions } = (0, $1obPJ$usePermissions)(uri);
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
            if (result[agentId]) result[agentId].permissions.push(mode);
            else result[agentId] = {
                id: agentId,
                predicate: predicate,
                permissions: [
                    mode
                ]
            };
        };
        if (permissions) {
            for (const p of permissions){
                if (p[0, $dd9154ee844248d7$export$2703254089a859eb]) (0, $47a3fad69bcb0083$export$dca4f48302963835)(p[0, $dd9154ee844248d7$export$2703254089a859eb]).forEach((agentId)=>appendPermission(agentId, (0, $dd9154ee844248d7$export$2703254089a859eb), p["acl:mode"]));
                if (p[0, $dd9154ee844248d7$export$97a08a1bb7ee0545]) (0, $47a3fad69bcb0083$export$dca4f48302963835)(p[0, $dd9154ee844248d7$export$97a08a1bb7ee0545]).forEach((userUri)=>appendPermission(userUri, (0, $dd9154ee844248d7$export$97a08a1bb7ee0545), p["acl:mode"]));
                if (p[0, $dd9154ee844248d7$export$f07ccbe0773f2c7]) (0, $47a3fad69bcb0083$export$dca4f48302963835)(p[0, $dd9154ee844248d7$export$f07ccbe0773f2c7]).forEach((groupUri)=>appendPermission(groupUri, (0, $dd9154ee844248d7$export$f07ccbe0773f2c7), p["acl:mode"]));
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
                permissions: agents[agentId] ? [
                    ...agents[agentId]?.permissions,
                    mode
                ] : [
                    mode
                ]
            }
        });
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
            if (agent.id === agentId) agent.permissions = agent.permissions.filter((m)=>m !== mode);
            return [
                key,
                agent
            ];
        })// Remove agents if they have no permissions (except if they are class agents)
        .filter(([_, agent])=>agent.predicate === (0, $dd9154ee844248d7$export$2703254089a859eb) || agent.permissions.length > 0)));
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
var $7ad577d9c9c71db0$export$2e2bcd8739ae039 = $7ad577d9c9c71db0$var$useAgents;


const $827412a5ced0d5cd$var$useStyles = (0, $1obPJ$muistylesmakeStyles)(()=>({
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
const $827412a5ced0d5cd$var$PermissionsDialog = ({ open: open, onClose: onClose, uri: uri, isContainer: isContainer })=>{
    const classes = $827412a5ced0d5cd$var$useStyles();
    const translate = (0, $1obPJ$useTranslate)();
    const { agents: agents, addPermission: addPermission, removePermission: removePermission } = (0, $7ad577d9c9c71db0$export$2e2bcd8739ae039)(uri);
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Dialog), {
        fullWidth: true,
        open: open,
        onClose: onClose,
        children: [
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$DialogTitle), {
                className: classes.title,
                children: translate(isContainer ? "auth.dialog.container_permissions" : "auth.dialog.resource_permissions")
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$DialogContent), {
                className: classes.addForm,
                children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $38698ff0e415f88b$export$2e2bcd8739ae039), {
                    agents: agents,
                    addPermission: addPermission
                })
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$DialogContent), {
                className: classes.listForm,
                children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $c8acba773a123777$export$2e2bcd8739ae039), {
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
var $827412a5ced0d5cd$export$2e2bcd8739ae039 = $827412a5ced0d5cd$var$PermissionsDialog;


const $7dac2771cc5eb38b$var$PermissionsButton = ({ isContainer: isContainer })=>{
    const record = (0, $1obPJ$useRecordContext)();
    const resource = (0, $1obPJ$useResourceContext)();
    const [showDialog, setShowDialog] = (0, $1obPJ$useState)(false);
    const createContainer = (0, $1obPJ$useCreateContainer)(resource);
    const uri = isContainer ? createContainer : record.id || record["@id"];
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Fragment), {
        children: [
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Button), {
                label: "auth.action.permissions",
                onClick: ()=>setShowDialog(true),
                children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$muiiconsmaterialShare), {})
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $827412a5ced0d5cd$export$2e2bcd8739ae039), {
                uri: uri,
                isContainer: isContainer,
                open: showDialog,
                onClose: ()=>setShowDialog(false)
            })
        ]
    });
};
$7dac2771cc5eb38b$var$PermissionsButton.defaultProps = {
    isContainer: false
};
var $7dac2771cc5eb38b$export$2e2bcd8739ae039 = $7dac2771cc5eb38b$var$PermissionsButton;



const $1d084bfeb799eb8d$var$EditActionsWithPermissions = ()=>{
    const { hasList: hasList, hasShow: hasShow } = (0, $1obPJ$useResourceDefinition)();
    const record = (0, $1obPJ$useRecordContext)();
    const { permissions: permissions } = (0, $1obPJ$usePermissions)(record?.id);
    const resource = (0, $1obPJ$useResourceContext)();
    const containerUri = (0, $1obPJ$useCreateContainerUri)()(resource);
    const { permissions: containerPermissions } = (0, $1obPJ$usePermissions)(containerUri);
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$TopToolbar), {
        children: [
            hasList && containerPermissions && containerPermissions.some((p)=>(0, $dd9154ee844248d7$export$dc3840a4e2a72b8c).includes(p["acl:mode"])) && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ListButton), {}),
            hasShow && permissions && permissions.some((p)=>(0, $dd9154ee844248d7$export$d37f0098bcf84c55).includes(p["acl:mode"])) && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ShowButton), {}),
            permissions && permissions.some((p)=>(0, $dd9154ee844248d7$export$22242524f7d0624).includes(p["acl:mode"])) && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $7dac2771cc5eb38b$export$2e2bcd8739ae039), {})
        ]
    });
};
var $1d084bfeb799eb8d$export$2e2bcd8739ae039 = $1d084bfeb799eb8d$var$EditActionsWithPermissions;










const $7efdcbe4be05bfd5$var$DeleteButtonWithPermissions = (props)=>{
    const recordId = (0, $1obPJ$useGetRecordId)();
    const { permissions: permissions, isLoading: isLoading } = (0, $1obPJ$usePermissions)(recordId);
    if (!isLoading && permissions?.some((p)=>(0, $dd9154ee844248d7$export$ac7b0367c0f9031e).includes(p["acl:mode"]))) return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$DeleteButton), {
        ...props
    });
    return null;
};
var $7efdcbe4be05bfd5$export$2e2bcd8739ae039 = $7efdcbe4be05bfd5$var$DeleteButtonWithPermissions;


const $6b0c1a175ed94bdf$var$StyledToolbar = (0, $1obPJ$styled1)((0, $1obPJ$Toolbar))(()=>({
        flex: 1,
        display: "flex",
        justifyContent: "space-between"
    }));
const $6b0c1a175ed94bdf$var$EditToolbarWithPermissions = (props)=>/*#__PURE__*/ (0, $1obPJ$jsxs)($6b0c1a175ed94bdf$var$StyledToolbar, {
        ...props,
        children: [
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$SaveButton), {}),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $7efdcbe4be05bfd5$export$2e2bcd8739ae039), {})
        ]
    });
var $6b0c1a175ed94bdf$export$2e2bcd8739ae039 = $6b0c1a175ed94bdf$var$EditToolbarWithPermissions;



const $28fa6ad821327921$var$EditWithPermissions = (props)=>{
    const recordId = (0, $1obPJ$useGetRecordId)();
    (0, $3246c5a1f284b82d$export$2e2bcd8739ae039)(recordId, "edit");
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Edit), {
        ...props,
        children: /*#__PURE__*/ (0, $1obPJ$react).cloneElement(props.children, {
            toolbar: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $6b0c1a175ed94bdf$export$2e2bcd8739ae039), {}),
            // Allow to override toolbar
            ...props.children.props
        })
    });
};
$28fa6ad821327921$var$EditWithPermissions.defaultProps = {
    actions: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1d084bfeb799eb8d$export$2e2bcd8739ae039), {})
};
var $28fa6ad821327921$export$2e2bcd8739ae039 = $28fa6ad821327921$var$EditWithPermissions;








const $c78c2d7e17f60b2f$var$EditButtonWithPermissions = (props)=>{
    const recordId = (0, $1obPJ$useGetRecordId)();
    const { permissions: permissions, isLoading: isLoading } = (0, $1obPJ$usePermissions)(recordId);
    if (!isLoading && permissions?.some((p)=>(0, $dd9154ee844248d7$export$b9d0f5f3ab5e453b).includes(p["acl:mode"]))) return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$EditButton), {
        ...props
    });
    return null;
};
var $c78c2d7e17f60b2f$export$2e2bcd8739ae039 = $c78c2d7e17f60b2f$var$EditButtonWithPermissions;













// Do not show Export and Refresh buttons on mobile
const $e6071424a1ba88d9$var$ListActionsWithPermissions = ({ bulkActions: bulkActions, sort: sort, displayedFilters: displayedFilters, exporter: exporter, filters: filters, filterValues: filterValues, onUnselectItems: onUnselectItems, selectedIds: selectedIds, showFilter: showFilter, total: total })=>{
    const resource = (0, $1obPJ$useResourceContext)();
    const xs = (0, $1obPJ$useMediaQuery)((theme)=>theme.breakpoints.down("xs"));
    const resourceDefinition = (0, $1obPJ$useResourceDefinition)();
    const createContainerUri = (0, $1obPJ$useCreateContainer)(resource);
    const { permissions: permissions } = (0, $1obPJ$usePermissions)(createContainerUri);
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$TopToolbar), {
        children: [
            filters && /*#__PURE__*/ (0, $1obPJ$react).cloneElement(filters, {
                showFilter: showFilter,
                displayedFilters: displayedFilters,
                filterValues: filterValues,
                context: "button"
            }),
            resourceDefinition.hasCreate && permissions && permissions.some((p)=>(0, $dd9154ee844248d7$export$65615a101bd6f5ca).includes(p["acl:mode"])) && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$CreateButton), {}),
            permissions && permissions.some((p)=>(0, $dd9154ee844248d7$export$22242524f7d0624).includes(p["acl:mode"])) && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $7dac2771cc5eb38b$export$2e2bcd8739ae039), {
                isContainer: true
            }),
            !xs && exporter !== false && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ExportButton), {
                disabled: total === 0,
                sort: sort,
                filter: filterValues,
                exporter: exporter
            }),
            bulkActions && /*#__PURE__*/ (0, $1obPJ$react).cloneElement(bulkActions, {
                filterValues: filterValues,
                selectedIds: selectedIds,
                onUnselectItems: onUnselectItems
            })
        ]
    });
};
var $e6071424a1ba88d9$export$2e2bcd8739ae039 = $e6071424a1ba88d9$var$ListActionsWithPermissions;


const $a4ded8260cc90dad$var$ListWithPermissions = (props)=>/*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$List1), {
        ...props
    });
$a4ded8260cc90dad$var$ListWithPermissions.defaultProps = {
    actions: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $e6071424a1ba88d9$export$2e2bcd8739ae039), {})
};
var $a4ded8260cc90dad$export$2e2bcd8739ae039 = $a4ded8260cc90dad$var$ListWithPermissions;












const $acd67d211d146755$var$ShowActionsWithPermissions = ()=>{
    const { hasList: hasList, hasEdit: hasEdit } = (0, $1obPJ$useResourceDefinition)();
    const record = (0, $1obPJ$useRecordContext)();
    const { permissions: permissions } = (0, $1obPJ$usePermissions)(record?.id);
    const resource = (0, $1obPJ$useResourceContext)();
    const containerUri = (0, $1obPJ$useCreateContainerUri)()(resource);
    const { permissions: containerPermissions } = (0, $1obPJ$usePermissions)(containerUri);
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$TopToolbar), {
        children: [
            hasList && containerPermissions && containerPermissions.some((p)=>(0, $dd9154ee844248d7$export$dc3840a4e2a72b8c).includes(p["acl:mode"])) && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ListButton), {}),
            hasEdit && permissions && permissions.some((p)=>(0, $dd9154ee844248d7$export$b9d0f5f3ab5e453b).includes(p["acl:mode"])) && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$EditButton), {}),
            permissions && permissions.some((p)=>(0, $dd9154ee844248d7$export$22242524f7d0624).includes(p["acl:mode"])) && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $7dac2771cc5eb38b$export$2e2bcd8739ae039), {})
        ]
    });
};
var $acd67d211d146755$export$2e2bcd8739ae039 = $acd67d211d146755$var$ShowActionsWithPermissions;



const $561bb436d5af917c$var$ShowWithPermissions = (props)=>{
    const recordId = (0, $1obPJ$useGetRecordId)();
    (0, $3246c5a1f284b82d$export$2e2bcd8739ae039)(recordId, "show");
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Show), {
        ...props
    });
};
$561bb436d5af917c$var$ShowWithPermissions.defaultProps = {
    actions: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $acd67d211d146755$export$2e2bcd8739ae039), {})
};
var $561bb436d5af917c$export$2e2bcd8739ae039 = $561bb436d5af917c$var$ShowWithPermissions;








const $c2eef7602bbbff5e$var$AuthDialog = ({ open: open, onClose: onClose, title: title, message: message, redirect: redirect, ...rest })=>{
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
                        children: translate("ra.action.cancel")
                    }),
                    /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Button1), {
                        onClick: ()=>login({
                                redirect: redirect || window.location.pathname + window.location.search
                            }),
                        color: "primary",
                        variant: "contained",
                        children: translate("auth.action.login")
                    })
                ]
            })
        ]
    });
};
$c2eef7602bbbff5e$var$AuthDialog.defaultProps = {
    title: "auth.dialog.login_required",
    message: "auth.message.login_to_continue"
};
var $c2eef7602bbbff5e$export$2e2bcd8739ae039 = $c2eef7602bbbff5e$var$AuthDialog;










const $479961b7e298304b$var$delay = async (t)=>new Promise((resolve)=>setTimeout(resolve, t));
// Inspired from https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/auth/Login.tsx
const $479961b7e298304b$var$SsoLoginPage = ({ children: children, backgroundImage: backgroundImage, buttons: buttons, userResource: userResource, propertiesExist: propertiesExist, text: text, ...rest })=>{
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
        navigate(searchParams.get("redirect") || "/");
    }, [
        identity,
        isLoading,
        navigate,
        searchParams
    ]);
    (0, $1obPJ$useEffect)(()=>{
        (async ()=>{
            if (searchParams.has("login")) {
                if (searchParams.has("error")) {
                    if (searchParams.get("error") === "registration.not-allowed") notify("auth.message.user_email_not_found", {
                        type: "error"
                    });
                    else notify("auth.message.bad_request", {
                        type: "error",
                        messageArgs: {
                            error: searchParams.get("error")
                        }
                    });
                } else if (searchParams.has("token")) {
                    const token = searchParams.get("token");
                    const { webId: webId } = (0, $1obPJ$jwtdecode)(token);
                    localStorage.setItem("token", token);
                    let userData;
                    ({ data: userData } = await dataProvider.getOne(userResource, {
                        id: webId
                    }));
                    if (propertiesExist.length > 0) {
                        let allPropertiesExist = propertiesExist.every((p)=>userData[p]);
                        while(!allPropertiesExist){
                            console.log("Waiting for all properties to have been created", propertiesExist);
                            await $479961b7e298304b$var$delay(500);
                            ({ data: userData } = await dataProvider.getOne(userResource, {
                                id: webId
                            }));
                            allPropertiesExist = propertiesExist.every((p)=>userData[p]);
                        }
                    }
                    if (!authProvider.checkUser(userData)) {
                        localStorage.removeItem("token");
                        notify("auth.message.user_not_allowed_to_login", {
                            type: "error"
                        });
                        navigate.replace("/login");
                    } else if (searchParams.has("redirect")) {
                        notify("auth.message.user_connected", {
                            type: "info"
                        });
                        window.location.href = searchParams.get("redirect");
                    } else if (searchParams.has("new") && searchParams.get("new") === "true") {
                        notify("auth.message.new_user_created", {
                            type: "info"
                        });
                        window.location.href = `/${userResource}/${encodeURIComponent(webId)}`;
                    } else {
                        notify("auth.message.user_connected", {
                            type: "info"
                        });
                        window.location.href = "/";
                    }
                }
            }
            if (searchParams.has("logout")) {
                // Delete token and any other value in local storage
                localStorage.clear();
                notify("auth.message.user_disconnected", {
                    type: "info"
                });
                navigate("/");
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
    return /*#__PURE__*/ (0, $1obPJ$jsx)($479961b7e298304b$var$Root, {
        ...rest,
        ref: containerRef,
        children: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Card), {
            className: $479961b7e298304b$export$388de65c72fa74b4.card,
            children: [
                /*#__PURE__*/ (0, $1obPJ$jsx)("div", {
                    className: $479961b7e298304b$export$388de65c72fa74b4.avatar,
                    children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Avatar), {
                        className: $479961b7e298304b$export$388de65c72fa74b4.icon,
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
                            variant: "outlined",
                            type: "submit",
                            onClick: ()=>login({}, "/login")
                        })
                    }, i))
            ]
        })
    });
};
const $479961b7e298304b$var$PREFIX = "SsoLoginPage";
const $479961b7e298304b$export$388de65c72fa74b4 = {
    card: `${$479961b7e298304b$var$PREFIX}-card`,
    avatar: `${$479961b7e298304b$var$PREFIX}-avatar`,
    icon: `${$479961b7e298304b$var$PREFIX}-icon`,
    switch: `${$479961b7e298304b$var$PREFIX}-switch`
};
const $479961b7e298304b$var$Root = (0, $1obPJ$styled1)("div", {
    name: $479961b7e298304b$var$PREFIX,
    overridesResolver: (props, styles)=>styles.root
})(({ theme: theme })=>({
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        height: "1px",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundImage: "radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)",
        [`& .${$479961b7e298304b$export$388de65c72fa74b4.card}`]: {
            minWidth: 300,
            marginTop: "6em"
        },
        [`& .${$479961b7e298304b$export$388de65c72fa74b4.avatar}`]: {
            margin: "1em",
            display: "flex",
            justifyContent: "center"
        },
        [`& .${$479961b7e298304b$export$388de65c72fa74b4.icon}`]: {
            backgroundColor: theme.palette.secondary[500]
        },
        [`& .${$479961b7e298304b$export$388de65c72fa74b4.switch}`]: {
            marginBottom: "1em",
            display: "flex",
            justifyContent: "center"
        }
    }));
$479961b7e298304b$var$SsoLoginPage.defaultProps = {
    propertiesExist: [],
    // TODO deprecate this
    buttons: [
        /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Button1), {
            startIcon: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Avatar), {
                src: "/lescommuns.jpg"
            }),
            children: "Les Communs"
        })
    ],
    userResource: "Person"
};
var $479961b7e298304b$export$2e2bcd8739ae039 = $479961b7e298304b$var$SsoLoginPage;


















const $fb967e2c34f56644$var$useSignup = ()=>{
    const authProvider = (0, $1obPJ$useAuthProvider)();
    return (0, $1obPJ$useCallback)((params = {})=>authProvider.signup(params), [
        authProvider
    ]);
};
var $fb967e2c34f56644$export$2e2bcd8739ae039 = $fb967e2c34f56644$var$useSignup;


// Inspired by https://github.com/bartlomiejzuber/password-strength-score
/**
 * @typedef PasswordStrengthOptions
 * @property {number} isVeryLongLength - Required characters for a very long password (default: 12)
 * @property {number} isLongLength - Required characters for a long password (default: 6)
 * @property {number} isVeryLongScore - Score for a very long password (default: 2.5)
 * @property {number} isLongScore - Score for a long password (default: 1.5)
 * @property {number} uppercaseScore - Score for a password with uppercase letters (default: 1)
 * @property {number} lowercaseScore - Score for a password with lowercase letters (default: 1)
 * @property {number} numbersScore - Score for a password with numbers (default: 1)
 * @property {number} nonAlphanumericsScore - Score for a password without non-alphanumeric characters (default: 1)
 */ /** @type {PasswordStrengthOptions} */ const $646d64648a630b24$export$ba43bf67f3d48107 = {
    isVeryLongLength: 14,
    isLongLength: 8,
    isLongScore: 2,
    isVeryLongScore: 4,
    uppercaseScore: 1,
    lowercaseScore: 1,
    numbersScore: 1,
    nonAlphanumericsScore: 1
};
const $646d64648a630b24$export$963a5c59734509bb = (password, options)=>{
    if (!password) return 0;
    const mergedOptions = {
        ...$646d64648a630b24$export$ba43bf67f3d48107,
        ...options
    };
    const longScore = password.length >= mergedOptions.isLongLength && mergedOptions.isLongScore || 0;
    const veryLongScore = password.length >= mergedOptions.isVeryLongLength && mergedOptions.isVeryLongScore || 0;
    const lowercaseScore = /[a-z]/.test(password) && mergedOptions.lowercaseScore || 0;
    const uppercaseScore = /[A-Z]/.test(password) && mergedOptions.uppercaseScore || 0;
    const numbersScore = /\d/.test(password) && mergedOptions.numbersScore || 0;
    const nonalphasScore = /\W/.test(password) && mergedOptions.nonAlphanumericsScore || 0;
    return uppercaseScore + lowercaseScore + numbersScore + nonalphasScore + longScore + veryLongScore;
};
const $646d64648a630b24$export$a1d713a9155d58fc = (options = $646d64648a630b24$export$ba43bf67f3d48107, minRequiredScore = 5)=>{
    const mergedOptions = {
        ...$646d64648a630b24$export$ba43bf67f3d48107,
        ...options
    };
    return {
        scoreFn: (password)=>$646d64648a630b24$export$963a5c59734509bb(password, mergedOptions),
        minRequiredScore: minRequiredScore,
        maxScore: mergedOptions.uppercaseScore + mergedOptions.lowercaseScore + mergedOptions.numbersScore + mergedOptions.nonAlphanumericsScore + mergedOptions.isLongScore + mergedOptions.isVeryLongScore
    };
};
const $646d64648a630b24$export$19dcdb21c6965fb8 = $646d64648a630b24$export$a1d713a9155d58fc($646d64648a630b24$export$ba43bf67f3d48107, 5);


const $7a0bbe6824860dfe$var$validatePasswordStrength = (scorer = (0, $646d64648a630b24$export$19dcdb21c6965fb8))=>(value)=>{
        if (!scorer) return undefined;
        const strength = scorer.scoreFn(value);
        if (strength < scorer.minRequiredScore) return "auth.input.password_too_weak";
        return undefined;
    };
var $7a0bbe6824860dfe$export$2e2bcd8739ae039 = $7a0bbe6824860dfe$var$validatePasswordStrength;








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
 */ const $bab067faa4d10954$var$colorGradient = (fade, color1, color2)=>{
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
function $bab067faa4d10954$export$2e2bcd8739ae039(props) {
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
    const currentColor = $bab067faa4d10954$var$colorGradient(fade, color1, color2);
    const StyledLinearProgress = (0, $1obPJ$withStyles)({
        colorPrimary: {
            backgroundColor: "black" // '#e0e0e0'
        },
        barColorPrimary: {
            backgroundColor: currentColor
        }
    })((0, $1obPJ$LinearProgress));
    return /*#__PURE__*/ (0, $1obPJ$jsx)(StyledLinearProgress, {
        ...restProps,
        value: 100 * fade,
        variant: "determinate"
    });
}



function $a8046307c9dfa483$export$2e2bcd8739ae039({ scorer: scorer = (0, $646d64648a630b24$export$19dcdb21c6965fb8), password: password, ...restProps }) {
    const strength = scorer.scoreFn(password);
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $bab067faa4d10954$export$2e2bcd8739ae039), {
        currentVal: strength,
        minVal: 0,
        maxVal: scorer.maxScore,
        ...restProps
    });
}



const $2dfd781b793256e6$var$USED_SEARCH_PARAMS = [
    "signup",
    "reset_password",
    "new_password",
    "email",
    "force-email"
];
const $2dfd781b793256e6$var$getSearchParamsRest = (searchParams)=>{
    const rest = [];
    for (const [key, value] of searchParams.entries())if (!$2dfd781b793256e6$var$USED_SEARCH_PARAMS.includes(key)) rest.push(`${key}=${encodeURIComponent(value)}`);
    return rest.length > 0 ? rest.join("&") : "";
};
var $2dfd781b793256e6$export$2e2bcd8739ae039 = $2dfd781b793256e6$var$getSearchParamsRest;


const $e011da92680cf1fe$var$useStyles = (0, $1obPJ$muistylesmakeStyles)((theme)=>({
        content: {
            width: 450
        },
        icon: {
            margin: theme.spacing(0.3)
        }
    }));
/**
 * @param postSignupRedirect
 * @param additionalSignupValues
 * @param delayBeforeRedirect
 * @param {string} redirectTo
 * @param {object} passwordScorer Scorer to evaluate and indicate password strength.
 *  Set to `null` or `false`, if you don't want password strength checks. Default is
 *  passwordStrength's `defaultScorer`.
 * @returns
 */ const $e011da92680cf1fe$var$SignupForm = ({ passwordScorer: passwordScorer = (0, $646d64648a630b24$export$19dcdb21c6965fb8), postSignupRedirect: postSignupRedirect, additionalSignupValues: additionalSignupValues, delayBeforeRedirect: delayBeforeRedirect })=>{
    const [loading, setLoading] = (0, $1obPJ$useSafeSetState)(false);
    const signup = (0, $fb967e2c34f56644$export$2e2bcd8739ae039)();
    const translate = (0, $1obPJ$useTranslate)();
    const notify = (0, $1obPJ$useNotify)();
    const classes = $e011da92680cf1fe$var$useStyles();
    const [searchParams] = (0, $1obPJ$useSearchParams)();
    const interactionId = searchParams.get("interaction_id");
    const redirectTo = searchParams.get("redirect");
    const [locale] = (0, $1obPJ$useLocaleState)();
    const [password, setPassword] = $1obPJ$useState("");
    const submit = (values)=>{
        setLoading(true);
        signup({
            ...values,
            interactionId: interactionId,
            ...additionalSignupValues
        }).then(()=>{
            if (delayBeforeRedirect) setTimeout(()=>{
                // Reload to ensure the dataServer config is reset
                window.location.reload();
                window.location.href = postSignupRedirect ? `${postSignupRedirect}?${(0, $2dfd781b793256e6$export$2e2bcd8739ae039)(searchParams)}` : redirectTo || "/";
                setLoading(false);
            }, delayBeforeRedirect);
            else {
                // Reload to ensure the dataServer config is reset
                window.location.reload();
                window.location.href = postSignupRedirect ? `${postSignupRedirect}?${(0, $2dfd781b793256e6$export$2e2bcd8739ae039)(searchParams)}` : redirectTo || "/";
                setLoading(false);
            }
            notify("auth.message.new_user_created", {
                type: "info"
            });
        }).catch((error)=>{
            setLoading(false);
            notify(typeof error === "string" ? error : typeof error === "undefined" || !error.message ? "ra.auth.sign_in_error" : error.message, {
                type: "warning",
                _: typeof error === "string" ? error : error && error.message ? error.message : undefined
            });
        });
    };
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Form), {
        onSubmit: submit,
        noValidate: true,
        defaultValues: {
            email: searchParams.get("email")
        },
        children: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$CardContent), {
            className: classes.content,
            children: [
                /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextInput), {
                    autoFocus: true,
                    source: "username",
                    label: translate("auth.input.username"),
                    autoComplete: "username",
                    fullWidth: true,
                    disabled: loading,
                    validate: [
                        (0, $1obPJ$required)(),
                        (0, $1obPJ$minLength)(2)
                    ],
                    format: (value)=>value ? (0, $1obPJ$speakingurl)(value, {
                            lang: locale || "fr",
                            separator: "_",
                            custom: [
                                ".",
                                "-",
                                "0",
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9"
                            ]
                        }) : ""
                }),
                /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextInput), {
                    source: "email",
                    label: translate("auth.input.email"),
                    autoComplete: "email",
                    fullWidth: true,
                    disabled: loading || searchParams.has("email") && searchParams.has("force-email"),
                    validate: [
                        (0, $1obPJ$required)(),
                        (0, $1obPJ$email)()
                    ]
                }),
                passwordScorer && password && !(searchParams.has("email") && searchParams.has("force-email")) && /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Fragment), {
                    children: [
                        /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Typography), {
                            variant: "caption",
                            style: {
                                marginBottom: 3
                            },
                            children: [
                                translate("auth.input.password_strength"),
                                ":",
                                " "
                            ]
                        }),
                        /*#__PURE__*/ (0, $1obPJ$jsx)((0, $a8046307c9dfa483$export$2e2bcd8739ae039), {
                            password: password,
                            scorer: passwordScorer,
                            sx: {
                                width: "100%"
                            }
                        })
                    ]
                }),
                /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextInput), {
                    source: "password",
                    type: "password",
                    value: password,
                    onChange: (e)=>setPassword(e.target.value),
                    label: translate("ra.auth.password"),
                    autoComplete: "new-password",
                    fullWidth: true,
                    disabled: loading || searchParams.has("email") && searchParams.has("force-email"),
                    validate: [
                        (0, $1obPJ$required)(),
                        (0, $7a0bbe6824860dfe$export$2e2bcd8739ae039)(passwordScorer)
                    ]
                }),
                /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Button1), {
                    variant: "contained",
                    type: "submit",
                    color: "primary",
                    disabled: loading,
                    fullWidth: true,
                    className: classes.button,
                    children: loading ? /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$CircularProgress), {
                        className: classes.icon,
                        size: 19,
                        thickness: 3
                    }) : translate("auth.action.signup")
                })
            ]
        })
    });
};
$e011da92680cf1fe$var$SignupForm.defaultValues = {
    redirectTo: "/",
    additionalSignupValues: {}
};
var $e011da92680cf1fe$export$2e2bcd8739ae039 = $e011da92680cf1fe$var$SignupForm;









const $e2a34b2d647a5391$var$useStyles = (0, $1obPJ$muistylesmakeStyles)((theme)=>({
        content: {
            width: 450
        },
        icon: {
            margin: theme.spacing(0.3)
        }
    }));
const $e2a34b2d647a5391$var$LoginForm = ({ postLoginRedirect: postLoginRedirect, allowUsername: allowUsername })=>{
    const [loading, setLoading] = (0, $1obPJ$useSafeSetState)(false);
    const login = (0, $1obPJ$useLogin)();
    const translate = (0, $1obPJ$useTranslate)();
    const notify = (0, $1obPJ$useNotify)();
    const classes = $e2a34b2d647a5391$var$useStyles();
    const location = (0, $1obPJ$useLocation)();
    const searchParams = new URLSearchParams(location.search);
    const redirectTo = postLoginRedirect ? `${postLoginRedirect}?${(0, $2dfd781b793256e6$export$2e2bcd8739ae039)(searchParams)}` : searchParams.get("redirect");
    const interactionId = searchParams.get("interaction_id");
    const submit = (values)=>{
        setLoading(true);
        login({
            ...values,
            redirectTo: redirectTo,
            interactionId: interactionId
        }).then(()=>{
            setLoading(false);
        }).catch((error)=>{
            setLoading(false);
            notify(typeof error === "string" ? error : typeof error === "undefined" || !error.message ? "ra.auth.sign_in_error" : error.message, {
                type: "warning",
                messageArgs: {
                    _: typeof error === "string" ? error : error && error.message ? error.message : undefined
                }
            });
        });
    };
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Form), {
        onSubmit: submit,
        noValidate: true,
        defaultValues: {
            username: searchParams.get("email")
        },
        children: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$CardContent), {
            className: classes.content,
            children: [
                /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextInput), {
                    source: "username",
                    label: translate(allowUsername ? "auth.input.username_or_email" : "auth.input.email"),
                    autoComplete: "email",
                    fullWidth: true,
                    disabled: loading || searchParams.has("email") && searchParams.has("force-email"),
                    format: (value)=>value ? value.toLowerCase() : "",
                    validate: allowUsername ? [
                        (0, $1obPJ$required)()
                    ] : [
                        (0, $1obPJ$required)(),
                        (0, $1obPJ$email)()
                    ]
                }),
                /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextInput), {
                    source: "password",
                    type: "password",
                    label: translate("ra.auth.password"),
                    autoComplete: "current-password",
                    fullWidth: true,
                    disabled: loading || searchParams.has("email") && searchParams.has("force-email"),
                    validate: (0, $1obPJ$required)()
                }),
                /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Button1), {
                    variant: "contained",
                    type: "submit",
                    color: "primary",
                    disabled: loading,
                    fullWidth: true,
                    className: classes.button,
                    children: loading ? /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$CircularProgress), {
                        className: classes.icon,
                        size: 19,
                        thickness: 3
                    }) : translate("auth.action.login")
                })
            ]
        })
    });
};
$e2a34b2d647a5391$var$LoginForm.defaultValues = {
    redirectTo: "/",
    allowUsername: false
};
var $e2a34b2d647a5391$export$2e2bcd8739ae039 = $e2a34b2d647a5391$var$LoginForm;











const $b403c35bd8d76c50$var$useStyles = (0, $1obPJ$muistylesmakeStyles)((theme)=>({
        icon: {
            margin: theme.spacing(0.3)
        }
    }));
const $b403c35bd8d76c50$var$samePassword = (value, allValues)=>{
    if (value && value !== allValues.password) return "Mot de passe diff\xe9rent du premier";
};
/**
 *
 * @param {string} redirectTo
 * @param {Object} passwordScorer Scorer to evaluate and indicate password strength.
 *  Set to `null` or `false`, if you don't want password strength checks. Default is
 *  passwordStrength's `defaultScorer`.
 * @returns
 */ const $b403c35bd8d76c50$var$NewPasswordForm = ({ redirectTo: redirectTo, passwordScorer: passwordScorer = (0, $646d64648a630b24$export$19dcdb21c6965fb8) })=>{
    const location = (0, $1obPJ$useLocation)();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const [loading, setLoading] = (0, $1obPJ$useSafeSetState)(false);
    const authProvider = (0, $1obPJ$useAuthProvider)();
    const translate = (0, $1obPJ$useTranslate)();
    const notify = (0, $1obPJ$useNotify)();
    const classes = $b403c35bd8d76c50$var$useStyles();
    const [newPassword, setNewPassword] = (0, $1obPJ$useState)("");
    const submit = (values)=>{
        setLoading(true);
        authProvider.setNewPassword({
            ...values,
            token: token
        }).then(()=>{
            setTimeout(()=>{
                const url = new URL("/login", window.location.origin);
                if (redirectTo) url.searchParams.append("redirect", redirectTo);
                url.searchParams.append("email", values.email);
                window.location.href = url.toString();
                setLoading(false);
            }, 2000);
            notify("auth.notification.password_changed", {
                type: "info"
            });
        }).catch((error)=>{
            setLoading(false);
            notify(typeof error === "string" ? error : typeof error === "undefined" || !error.message ? "auth.notification.reset_password_error" : error.message, {
                type: "warning",
                messageArgs: {
                    _: typeof error === "string" ? error : error && error.message ? error.message : undefined
                }
            });
        });
    };
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Form), {
        onSubmit: submit,
        noValidate: true,
        defaultValues: {
            email: searchParams.get("email")
        },
        children: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$CardContent), {
            className: classes.content,
            children: [
                /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextInput), {
                    autoFocus: true,
                    source: "email",
                    label: translate("auth.input.email"),
                    autoComplete: "email",
                    fullWidth: true,
                    disabled: loading,
                    validate: (0, $1obPJ$required)(),
                    format: (value)=>value ? value.toLowerCase() : ""
                }),
                passwordScorer && /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Fragment), {
                    children: [
                        /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Typography), {
                            variant: "caption",
                            style: {
                                marginBottom: 3
                            },
                            children: [
                                translate("auth.input.password_strength"),
                                ":",
                                " "
                            ]
                        }),
                        /*#__PURE__*/ (0, $1obPJ$jsx)((0, $a8046307c9dfa483$export$2e2bcd8739ae039), {
                            password: newPassword,
                            scorer: passwordScorer,
                            sx: {
                                width: "100%"
                            }
                        })
                    ]
                }),
                /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextInput), {
                    autoFocus: true,
                    type: "password",
                    source: "password",
                    value: newPassword,
                    label: translate("auth.input.new_password"),
                    autoComplete: "current-password",
                    fullWidth: true,
                    disabled: loading,
                    validate: [
                        (0, $1obPJ$required)(),
                        (0, $7a0bbe6824860dfe$export$2e2bcd8739ae039)(passwordScorer)
                    ],
                    onChange: (e)=>setNewPassword(e.target.value)
                }),
                /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextInput), {
                    type: "password",
                    source: "confirm-password",
                    label: translate("auth.input.confirm_new_password"),
                    autoComplete: "current-password",
                    fullWidth: true,
                    disabled: loading,
                    validate: [
                        (0, $1obPJ$required)(),
                        $b403c35bd8d76c50$var$samePassword
                    ]
                }),
                /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Button1), {
                    variant: "contained",
                    type: "submit",
                    color: "primary",
                    disabled: loading,
                    fullWidth: true,
                    className: classes.button,
                    children: loading ? /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$CircularProgress), {
                        className: classes.icon,
                        size: 19,
                        thickness: 3
                    }) : translate("auth.action.set_new_password")
                })
            ]
        })
    });
};
var $b403c35bd8d76c50$export$2e2bcd8739ae039 = $b403c35bd8d76c50$var$NewPasswordForm;







const $8d415f03f06df877$var$useStyles = (0, $1obPJ$muistylesmakeStyles)((theme)=>({
        icon: {
            margin: theme.spacing(0.3)
        }
    }));
const $8d415f03f06df877$var$ResetPasswordForm = ()=>{
    const [loading, setLoading] = (0, $1obPJ$useSafeSetState)(false);
    const authProvider = (0, $1obPJ$useAuthProvider)();
    const translate = (0, $1obPJ$useTranslate)();
    const notify = (0, $1obPJ$useNotify)();
    const classes = $8d415f03f06df877$var$useStyles();
    const submit = (values)=>{
        setLoading(true);
        authProvider.resetPassword({
            ...values
        }).then((res)=>{
            setLoading(false);
            notify("auth.notification.reset_password_submitted", {
                type: "info"
            });
        }).catch((error)=>{
            setLoading(false);
            notify(typeof error === "string" ? error : typeof error === "undefined" || !error.message ? "auth.notification.reset_password_error" : error.message, {
                type: "warning",
                messageArgs: {
                    _: typeof error === "string" ? error : error && error.message ? error.message : undefined
                }
            });
        });
    };
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Form), {
        onSubmit: submit,
        children: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$CardContent), {
            className: classes.content,
            children: [
                /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$TextInput), {
                    autoFocus: true,
                    source: "email",
                    label: translate("auth.input.email"),
                    autoComplete: "email",
                    fullWidth: true,
                    disabled: loading,
                    validate: (0, $1obPJ$required)(),
                    format: (value)=>value ? value.toLowerCase() : ""
                }),
                /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Button1), {
                    variant: "contained",
                    type: "submit",
                    color: "primary",
                    disabled: loading,
                    fullWidth: true,
                    className: classes.button,
                    children: loading ? /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$CircularProgress), {
                        className: classes.icon,
                        size: 19,
                        thickness: 3
                    }) : translate("auth.action.submit")
                })
            ]
        })
    });
};
var $8d415f03f06df877$export$2e2bcd8739ae039 = $8d415f03f06df877$var$ResetPasswordForm;







const $1b78e27e3e92a798$var$useStyles = (0, $1obPJ$muistylesmakeStyles)((theme)=>({
        "@global": {
            body: {
                backgroundColor: theme.palette.secondary.main
            }
        },
        root: {
            backgroundColor: theme.palette.secondary.main
        },
        card: {
            minWidth: 300,
            maxWidth: 500,
            marginTop: "6em",
            [theme.breakpoints.down("sm")]: {
                margin: "1em"
            }
        },
        icon: {
            marginTop: 5,
            marginRight: 5
        },
        title: {
            [theme.breakpoints.down("sm")]: {
                fontWeight: "bold",
                marginTop: 12
            }
        }
    }));
const $1b78e27e3e92a798$var$SimpleBox = ({ title: title, icon: icon, text: text, children: children })=>{
    const classes = $1b78e27e3e92a798$var$useStyles();
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Box), {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        className: classes.root,
        children: [
            /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Card), {
                className: classes.card,
                children: [
                    /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Box), {
                        p: 2,
                        display: "flex",
                        justifyContent: "start",
                        children: [
                            icon && /*#__PURE__*/ (0, $1obPJ$react).cloneElement(icon, {
                                fontSize: "large",
                                className: classes.icon
                            }),
                            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Typography), {
                                variant: "h4",
                                className: classes.title,
                                children: title
                            })
                        ]
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
    });
};
var $1b78e27e3e92a798$export$2e2bcd8739ae039 = $1b78e27e3e92a798$var$SimpleBox;




const $23fea069f5d2d834$var$useStyles = (0, $1obPJ$muistylesmakeStyles)(()=>({
        switch: {
            marginBottom: "1em",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }
    }));
/**
 * @param {object} props Props
 * @param {boolean} props.hasSignup If to show signup form.
 * @param {boolean} props.allowUsername Indicates, if login is allowed with username (instead of email).
 * @param {string} props.postSignupRedirect Location to redirect to after signup.
 * @param {string} props.postLoginRedirect Location to redirect to after login.
 * @param {object} props.additionalSignupValues
 * @param {object} props.passwordScorer Scorer to evaluate and indicate password strength.
 *  Set to `null` or `false`, if you don't want password strength checks. Default is
 *  passwordStrength's `defaultScorer`.
 * @returns
 */ const $23fea069f5d2d834$var$LocalLoginPage = ({ hasSignup: hasSignup, allowUsername: allowUsername, postSignupRedirect: postSignupRedirect, postLoginRedirect: postLoginRedirect, additionalSignupValues: additionalSignupValues, passwordScorer: passwordScorer = (0, $646d64648a630b24$export$19dcdb21c6965fb8) })=>{
    const classes = $23fea069f5d2d834$var$useStyles();
    const navigate = (0, $1obPJ$useNavigate)();
    const translate = (0, $1obPJ$useTranslate)();
    const authProvider = (0, $1obPJ$useAuthProvider)();
    const [searchParams] = (0, $1obPJ$useSearchParams)();
    const isSignup = hasSignup && searchParams.has("signup");
    const isResetPassword = searchParams.has("reset_password");
    const isNewPassword = searchParams.has("new_password");
    const isLogin = !isSignup && !isResetPassword && !isNewPassword;
    const redirectTo = searchParams.get("redirect");
    const interactionId = searchParams.get("interaction_id");
    const { data: identity, isLoading: isLoading } = (0, $1obPJ$useGetIdentity)();
    (0, $1obPJ$useEffect)(()=>{
        (async ()=>{
            if (!isLoading && identity?.id) {
                if (interactionId) // If interactionId is set, it means we are connecting from another application.
                // So first call a custom endpoint to tell the OIDC server the login is completed
                await authProvider.loginCompleted(interactionId, identity?.id);
                if (postLoginRedirect) navigate(`${postLoginRedirect}?${(0, $2dfd781b793256e6$export$2e2bcd8739ae039)(searchParams)}`);
                else if (redirectTo && redirectTo.startsWith("http")) window.location.href = redirectTo;
                else navigate(redirectTo || "/");
            }
        })();
    }, [
        identity,
        isLoading,
        navigate,
        searchParams,
        redirectTo,
        postLoginRedirect,
        authProvider,
        interactionId
    ]);
    const [title, text] = (0, $1obPJ$useMemo)(()=>{
        if (isSignup) return [
            "auth.action.signup",
            "auth.helper.signup"
        ];
        if (isLogin) return [
            "auth.action.login",
            "auth.helper.login"
        ];
        if (isResetPassword) return [
            "auth.action.reset_password",
            "auth.helper.reset_password"
        ];
        if (isNewPassword) return [
            "auth.action.set_new_password",
            "auth.helper.set_new_password"
        ];
    }, [
        isSignup,
        isLogin,
        isResetPassword,
        isNewPassword
    ]);
    if (isLoading || identity?.id) return null;
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1b78e27e3e92a798$export$2e2bcd8739ae039), {
        title: translate(title),
        text: translate(text),
        icon: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$muiiconsmaterialLock), {}),
        children: /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Card), {
            children: [
                isSignup && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $e011da92680cf1fe$export$2e2bcd8739ae039), {
                    delayBeforeRedirect: 4000,
                    postSignupRedirect: postSignupRedirect,
                    additionalSignupValues: additionalSignupValues,
                    passwordScorer: passwordScorer
                }),
                isResetPassword && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $8d415f03f06df877$export$2e2bcd8739ae039), {}),
                isNewPassword && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $b403c35bd8d76c50$export$2e2bcd8739ae039), {
                    redirectTo: redirectTo,
                    passwordScorer: passwordScorer
                }),
                isLogin && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $e2a34b2d647a5391$export$2e2bcd8739ae039), {
                    postLoginRedirect: postLoginRedirect,
                    allowUsername: allowUsername
                }),
                /*#__PURE__*/ (0, $1obPJ$jsxs)("div", {
                    className: classes.switch,
                    children: [
                        (isSignup || isResetPassword) && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Link), {
                            to: `/login?${(0, $2dfd781b793256e6$export$2e2bcd8739ae039)(searchParams)}`,
                            children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Typography), {
                                variant: "body2",
                                children: translate("auth.action.login")
                            })
                        }),
                        isLogin && /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$Fragment), {
                            children: [
                                hasSignup && /*#__PURE__*/ (0, $1obPJ$jsx)("div", {
                                    children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Link), {
                                        to: `/login?signup=true&${(0, $2dfd781b793256e6$export$2e2bcd8739ae039)(searchParams)}`,
                                        children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Typography), {
                                            variant: "body2",
                                            children: translate("auth.action.signup")
                                        })
                                    })
                                }),
                                /*#__PURE__*/ (0, $1obPJ$jsx)("div", {
                                    children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Link), {
                                        to: `/login?reset_password=true&${(0, $2dfd781b793256e6$export$2e2bcd8739ae039)(searchParams)}`,
                                        children: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Typography), {
                                            variant: "body2",
                                            children: translate("auth.action.reset_password")
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
$23fea069f5d2d834$var$LocalLoginPage.defaultProps = {
    hasSignup: true,
    allowUsername: false,
    additionalSignupValues: {}
};
var $23fea069f5d2d834$export$2e2bcd8739ae039 = $23fea069f5d2d834$var$LocalLoginPage;







// Not used for now. The ListWithPermissions component will handle the conditional display of the Create button.
const $9594dfbc217337d0$var$ResourceWithPermission = ({ name: name, create: create, ...rest })=>{
    const createContainer = (0, $1obPJ$useCreateContainer)(name);
    const { permissions: permissions } = (0, $1obPJ$usePermissions)(createContainer);
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Resource), {
        ...rest,
        name: name,
        create: permissions && permissions.some((p)=>(0, $dd9154ee844248d7$export$65615a101bd6f5ca).includes(p["acl:mode"])) ? create : undefined
    });
};
var $9594dfbc217337d0$export$2e2bcd8739ae039 = $9594dfbc217337d0$var$ResourceWithPermission;









// It's important to pass the ref to allow Material UI to manage the keyboard navigation
const $5ef2eaf62f09ff2c$var$UserMenuItem = /*#__PURE__*/ (0, $1obPJ$forwardRef)(({ label: label, icon: icon, to: to, ...rest }, ref)=>{
    const { onClose: onClose } = (0, $1obPJ$useUserMenu)();
    const translate = (0, $1obPJ$useTranslate)();
    const navigate = (0, $1obPJ$useNavigate)();
    const onClick = (0, $1obPJ$useCallback)(()=>{
        navigate(to);
        onClose();
    }, [
        to,
        onClose,
        navigate
    ]);
    return /*#__PURE__*/ (0, $1obPJ$jsxs)((0, $1obPJ$MenuItem), {
        onClick: onClick,
        ref: ref,
        ...rest,
        children: [
            icon && /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ListItemIcon), {
                children: /*#__PURE__*/ (0, $1obPJ$react).cloneElement(icon, {
                    fontSize: "small"
                })
            }),
            /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$ListItemText), {
                children: translate(label)
            })
        ]
    });
});
const $5ef2eaf62f09ff2c$var$UserMenu = ({ logout: logout, profileResource: profileResource, ...otherProps })=>{
    const { data: identity } = (0, $1obPJ$useGetIdentity)();
    return /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$UserMenu), {
        ...otherProps,
        children: identity && identity.id !== "" ? [
            /*#__PURE__*/ (0, $1obPJ$jsx)($5ef2eaf62f09ff2c$var$UserMenuItem, {
                label: "auth.action.view_my_profile",
                icon: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$muiiconsmaterialAccountCircle), {}),
                to: `/${profileResource}/${encodeURIComponent(identity?.profileData?.id || identity.id)}/show`
            }, "view"),
            /*#__PURE__*/ (0, $1obPJ$jsx)($5ef2eaf62f09ff2c$var$UserMenuItem, {
                label: "auth.action.edit_my_profile",
                icon: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$muiiconsmaterialEdit), {}),
                to: `/${profileResource}/${encodeURIComponent(identity?.profileData?.id || identity.id)}`
            }, "edit"),
            /*#__PURE__*/ (0, $1obPJ$react).cloneElement(logout, {
                key: "logout"
            })
        ] : [
            /*#__PURE__*/ (0, $1obPJ$jsx)($5ef2eaf62f09ff2c$var$UserMenuItem, {
                label: "auth.action.signup",
                to: "/login?signup=true"
            }, "signup"),
            /*#__PURE__*/ (0, $1obPJ$jsx)($5ef2eaf62f09ff2c$var$UserMenuItem, {
                label: "auth.action.login",
                to: "/login"
            }, "login")
        ]
    });
};
$5ef2eaf62f09ff2c$var$UserMenu.defaultProps = {
    logout: /*#__PURE__*/ (0, $1obPJ$jsx)((0, $1obPJ$Logout), {}),
    profileResource: "Person"
};
var $5ef2eaf62f09ff2c$export$2e2bcd8739ae039 = $5ef2eaf62f09ff2c$var$UserMenu;






const $a18ea4963428dd85$var$useCheckAuthenticated = (message)=>{
    const { data: identity, isLoading: isLoading } = (0, $1obPJ$useGetIdentity)();
    const notify = (0, $1obPJ$useNotify)();
    const redirect = (0, $1obPJ$useRedirect)();
    const location = (0, $1obPJ$useLocation)();
    (0, $1obPJ$useEffect)(()=>{
        if (!isLoading && !identity?.id) {
            notify(message || "ra.auth.auth_check_error", {
                type: "error"
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
var $a18ea4963428dd85$export$2e2bcd8739ae039 = $a18ea4963428dd85$var$useCheckAuthenticated;






const $26b16c415d19fb4a$var$emptyParams = {};
// keep a cache of already fetched permissions to initialize state for new
// components and avoid a useless rerender if the permissions haven't changed
const $26b16c415d19fb4a$var$alreadyFetchedPermissions = {
    "{}": undefined
};
// Fork of usePermissionsOptimized, with a refetch option
const $26b16c415d19fb4a$var$usePermissionsWithRefetch = (params = $26b16c415d19fb4a$var$emptyParams)=>{
    const key = JSON.stringify(params);
    const [state, setState] = (0, $1obPJ$useSafeSetState)({
        permissions: $26b16c415d19fb4a$var$alreadyFetchedPermissions[key]
    });
    const getPermissions = (0, $1obPJ$useGetPermissions)();
    const fetchPermissions = (0, $1obPJ$useCallback)(()=>getPermissions(params).then((permissions)=>{
            if (!(0, $1obPJ$lodashisEqual)(permissions, state.permissions)) {
                $26b16c415d19fb4a$var$alreadyFetchedPermissions[key] = permissions;
                setState({
                    permissions: permissions
                });
            }
        }).catch((error)=>{
            setState({
                error: error
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
var $26b16c415d19fb4a$export$2e2bcd8739ae039 = $26b16c415d19fb4a$var$usePermissionsWithRefetch;






const $22afd1c81635c9d9$var$englishMessages = {
    auth: {
        dialog: {
            container_permissions: "Container permissions",
            resource_permissions: "Resource permissions",
            login_required: "Login required"
        },
        action: {
            submit: "Submit",
            permissions: "Permissions",
            signup: "Signup",
            reset_password: "Reset password",
            set_new_password: "Set new password",
            logout: "Logout",
            login: "Login",
            view_my_profile: "View my profile",
            edit_my_profile: "Edit my profile"
        },
        right: {
            resource: {
                read: "Read",
                append: "Append",
                write: "Write",
                control: "Control"
            },
            container: {
                read: "List",
                append: "Add",
                write: "Add",
                control: "Control"
            }
        },
        agent: {
            anonymous: "All users",
            authenticated: "Connected users"
        },
        input: {
            agent_select: "Add an user...",
            name: "Surname",
            username: "User ID",
            email: "Email address",
            username_or_email: "User ID or email address",
            current_password: "Current password",
            new_password: "New password",
            confirm_new_password: "Confirm new password",
            password_strength: "Password strength",
            password_too_weak: "Password too weak. Increase length or add special characters."
        },
        helper: {
            login: "Sign in to your account",
            signup: "Create your account",
            reset_password: "Enter your email address below and we will send you a link to reset your password",
            set_new_password: "Please enter your email address and a new password below"
        },
        message: {
            resource_show_forbidden: "You are not allowed to view this resource",
            resource_edit_forbidden: "You are not allowed to edit this resource",
            resource_delete_forbidden: "You are not allowed to delete this resource",
            resource_control_forbidden: "You are not allowed to control this resource",
            container_create_forbidden: "You are not allowed to create new resource",
            container_list_forbidden: "You are not allowed to list these resources",
            unable_to_fetch_user_data: "Unable to fetch user data",
            no_token_returned: "No token returned",
            invalid_token_returned: "Invalid token returned",
            signup_error: "Account registration failed",
            user_not_allowed_to_login: "You are not allowed to login with this account",
            user_email_not_found: "No account found with this email address",
            user_email_exist: "An account already exist with this email address",
            username_exist: "An account already exist with this user ID",
            username_invalid: "This username is invalid. Only lowercase characters, numbers, dots and hyphens are authorized",
            new_user_created: "Your account has been successfully created",
            user_connected: "You are now connected",
            user_disconnected: "You are now disconnected",
            bad_request: "Bad request (Error message returned by the server: %{error})",
            account_settings_updated: "Your account settings have been successfully updated",
            login_to_continue: "Please login to continue",
            choose_pod_provider: "Please choose a POD provider in the list below. All application data will be saved on your POD."
        },
        notification: {
            reset_password_submitted: "An email has been sent with reset password instructions",
            reset_password_error: "An error occurred",
            password_changed: "Password changed successfully",
            new_password_error: "An error occurred",
            invalid_password: "Invalid password",
            get_settings_error: "An error occurred",
            update_settings_error: "An error occurred"
        }
    }
};
var $22afd1c81635c9d9$export$2e2bcd8739ae039 = $22afd1c81635c9d9$var$englishMessages;


const $509b6323d7902699$var$frenchMessages = {
    auth: {
        dialog: {
            container_permissions: "Permissions sur le container",
            resource_permissions: "Permissions sur la ressource",
            login_required: "Connexion requise"
        },
        action: {
            submit: "Soumettre",
            permissions: "Permissions",
            signup: "S'inscrire",
            reset_password: "Mot de passe oubli\xe9 ?",
            set_new_password: "D\xe9finir le mot de passe",
            logout: "Se d\xe9connecter",
            login: "Se connecter",
            view_my_profile: "Voir mon profil",
            edit_my_profile: "\xc9diter mon profil"
        },
        right: {
            resource: {
                read: "Lire",
                append: "Enrichir",
                write: "Modifier",
                control: "Administrer"
            },
            container: {
                read: "Lister",
                append: "Ajouter",
                write: "Ajouter",
                control: "Administrer"
            }
        },
        agent: {
            anonymous: "Tous les utilisateurs",
            authenticated: "Utilisateurs connect\xe9s"
        },
        input: {
            agent_select: "Ajouter un utilisateur...",
            name: "Pr\xe9nom",
            username: "Identifiant unique",
            email: "Adresse e-mail",
            username_or_email: "Identifiant ou adresse e-mail",
            current_password: "Mot de passe actuel",
            new_password: "Nouveau mot de passe",
            confirm_new_password: "Confirmer le nouveau mot de passe",
            password_strength: "Force du mot de passe",
            password_too_weak: "Mot de passe trop faible. Augmenter la longueur ou ajouter des caract\xe8res sp\xe9ciaux."
        },
        helper: {
            login: "Connectez-vous \xe0 votre compte.",
            signup: "Cr\xe9ez votre compte",
            reset_password: "Entrez votre adresse mail ci-dessous et nous vous enverrons un lien pour r\xe9initialiser votre mot de passe",
            set_new_password: "Veuillez entrer votre adresse mail et un nouveau mot de passe ci-dessous"
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
            invalid_token_returned: "Token invalide",
            signup_error: "L'inscription a \xe9chou\xe9",
            user_not_allowed_to_login: "Vous n'avez pas le droit de vous connecter avec ce compte",
            user_email_not_found: "Aucun compte trouv\xe9 avec cette adresse mail",
            user_email_exist: "Un compte existe d\xe9j\xe0 avec cette adresse mail",
            username_exist: "Un compte existe d\xe9j\xe0 avec cet identifiant",
            username_invalid: "Cet identifiant n'est pas valide. Seuls les lettres minuscules, les chiffres, les points et les tirets sont autoris\xe9s",
            new_user_created: "Votre compte a \xe9t\xe9 cr\xe9\xe9 avec succ\xe8s",
            user_connected: "Vous \xeates maintenant connect\xe9",
            user_disconnected: "Vous \xeates maintenant d\xe9connect\xe9",
            bad_request: "Requ\xeate erron\xe9e (Message d'erreur renvoy\xe9 par le serveur: %{error})",
            account_settings_updated: "Les param\xe8tres de votre compte ont \xe9t\xe9 mis \xe0 jour avec succ\xe8s",
            login_to_continue: "Veuillez vous connecter pour continuer",
            choose_pod_provider: "Veuillez choisir un fournisseur de PODs dans la liste ci-dessous. Toutes les donn\xe9es de l'application seront enregistr\xe9es sur votre POD."
        },
        notification: {
            reset_password_submitted: "Un e-mail a \xe9t\xe9 envoy\xe9 avec les instructions de r\xe9initialisation du mot de passe",
            reset_password_error: "Une erreur s'est produite",
            password_changed: "Le mot de passe a \xe9t\xe9 chang\xe9 avec succ\xe8s",
            new_password_error: "Une erreur s'est produite",
            invalid_password: "Mot de passe incorrect",
            get_settings_error: "Une erreur s'est produite",
            update_settings_error: "Une erreur s'est produite"
        }
    }
};
var $509b6323d7902699$export$2e2bcd8739ae039 = $509b6323d7902699$var$frenchMessages;




export {$1d8606895ce3b768$export$2e2bcd8739ae039 as authProvider, $f2c5683e04dee28c$export$2e2bcd8739ae039 as CreateWithPermissions, $28fa6ad821327921$export$2e2bcd8739ae039 as EditWithPermissions, $1d084bfeb799eb8d$export$2e2bcd8739ae039 as EditActionsWithPermissions, $6b0c1a175ed94bdf$export$2e2bcd8739ae039 as EditToolbarWithPermissions, $c78c2d7e17f60b2f$export$2e2bcd8739ae039 as EditButtonWithPermissions, $7efdcbe4be05bfd5$export$2e2bcd8739ae039 as DeleteButtonWithPermissions, $a4ded8260cc90dad$export$2e2bcd8739ae039 as ListWithPermissions, $e6071424a1ba88d9$export$2e2bcd8739ae039 as ListActionsWithPermissions, $561bb436d5af917c$export$2e2bcd8739ae039 as ShowWithPermissions, $acd67d211d146755$export$2e2bcd8739ae039 as ShowActionsWithPermissions, $7dac2771cc5eb38b$export$2e2bcd8739ae039 as PermissionsButton, $c2eef7602bbbff5e$export$2e2bcd8739ae039 as AuthDialog, $479961b7e298304b$export$2e2bcd8739ae039 as SsoLoginPage, $479961b7e298304b$export$2e2bcd8739ae039 as LoginPage, $23fea069f5d2d834$export$2e2bcd8739ae039 as LocalLoginPage, $9594dfbc217337d0$export$2e2bcd8739ae039 as ResourceWithPermissions, $5ef2eaf62f09ff2c$export$2e2bcd8739ae039 as UserMenu, $7ad577d9c9c71db0$export$2e2bcd8739ae039 as useAgents, $a18ea4963428dd85$export$2e2bcd8739ae039 as useCheckAuthenticated, $3246c5a1f284b82d$export$2e2bcd8739ae039 as useCheckPermissions, $26b16c415d19fb4a$export$2e2bcd8739ae039 as usePermissionsWithRefetch, $fb967e2c34f56644$export$2e2bcd8739ae039 as useSignup, $a8046307c9dfa483$export$2e2bcd8739ae039 as PasswordStrengthIndicator, $7a0bbe6824860dfe$export$2e2bcd8739ae039 as validatePasswordStrength, $646d64648a630b24$export$19dcdb21c6965fb8 as defaultPasswordScorer, $646d64648a630b24$export$ba43bf67f3d48107 as defaultPasswordScorerOptions, $646d64648a630b24$export$a1d713a9155d58fc as createPasswordScorer, $22afd1c81635c9d9$export$2e2bcd8739ae039 as englishMessages, $509b6323d7902699$export$2e2bcd8739ae039 as frenchMessages};
//# sourceMappingURL=index.es.js.map
