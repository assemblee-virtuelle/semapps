import $4oW5r$jwtdecode from "jwt-decode";
import $4oW5r$urljoin from "url-join";
import {jsxDEV as $4oW5r$jsxDEV, Fragment as $4oW5r$Fragment} from "react/jsx-dev-runtime";
import $4oW5r$react, {useEffect as $4oW5r$useEffect, useState as $4oW5r$useState, useCallback as $4oW5r$useCallback, useRef as $4oW5r$useRef, useMemo as $4oW5r$useMemo, forwardRef as $4oW5r$forwardRef} from "react";
import {useResourceContext as $4oW5r$useResourceContext, Create as $4oW5r$Create, CreateActions as $4oW5r$CreateActions, useGetIdentity as $4oW5r$useGetIdentity, usePermissions as $4oW5r$usePermissions, useNotify as $4oW5r$useNotify, useRedirect as $4oW5r$useRedirect, useGetRecordId as $4oW5r$useGetRecordId, Edit as $4oW5r$Edit, useResourceDefinition as $4oW5r$useResourceDefinition, useRecordContext as $4oW5r$useRecordContext, usePermissionsOptimized as $4oW5r$usePermissionsOptimized, TopToolbar as $4oW5r$TopToolbar, ListButton as $4oW5r$ListButton, ShowButton as $4oW5r$ShowButton, Button as $4oW5r$Button, useTranslate as $4oW5r$useTranslate, useGetList as $4oW5r$useGetList, useDataProvider as $4oW5r$useDataProvider, Loading as $4oW5r$Loading, Error as $4oW5r$Error, useAuthProvider as $4oW5r$useAuthProvider, Toolbar as $4oW5r$Toolbar, SaveButton as $4oW5r$SaveButton, DeleteButton as $4oW5r$DeleteButton, EditButton as $4oW5r$EditButton, List as $4oW5r$List1, CreateButton as $4oW5r$CreateButton, ExportButton as $4oW5r$ExportButton, Show as $4oW5r$Show, useLogin as $4oW5r$useLogin, Notification as $4oW5r$Notification, useLocale as $4oW5r$useLocale, useSafeSetState as $4oW5r$useSafeSetState, useLocaleState as $4oW5r$useLocaleState, Form as $4oW5r$Form, TextInput as $4oW5r$TextInput, required as $4oW5r$required, email as $4oW5r$email, Resource as $4oW5r$Resource, useUserMenu as $4oW5r$useUserMenu, UserMenu as $4oW5r$UserMenu, Logout as $4oW5r$Logout, useGetPermissions as $4oW5r$useGetPermissions} from "react-admin";
import {useCreateContainer as $4oW5r$useCreateContainer} from "@semapps/semantic-data-provider";
import $4oW5r$muiiconsmaterialShare from "@mui/icons-material/Share";
import {Dialog as $4oW5r$Dialog, DialogTitle as $4oW5r$DialogTitle, DialogContent as $4oW5r$DialogContent, DialogActions as $4oW5r$DialogActions, TextField as $4oW5r$TextField, List as $4oW5r$List, ListItem as $4oW5r$ListItem, ListItemAvatar as $4oW5r$ListItemAvatar, Avatar as $4oW5r$Avatar, ListItemText as $4oW5r$ListItemText, ListItemSecondaryAction as $4oW5r$ListItemSecondaryAction, IconButton as $4oW5r$IconButton, Menu as $4oW5r$Menu, MenuItem as $4oW5r$MenuItem, ListItemIcon as $4oW5r$ListItemIcon, useMediaQuery as $4oW5r$useMediaQuery, DialogContentText as $4oW5r$DialogContentText, Button as $4oW5r$Button1, Card as $4oW5r$Card, Typography as $4oW5r$Typography, CardActions as $4oW5r$CardActions, StyledEngineProvider as $4oW5r$StyledEngineProvider, Box as $4oW5r$Box, Divider as $4oW5r$Divider, CardContent as $4oW5r$CardContent, CircularProgress as $4oW5r$CircularProgress, LinearProgress as $4oW5r$LinearProgress} from "@mui/material";
import $4oW5r$muistylesmakeStyles from "@mui/styles/makeStyles";
import $4oW5r$muimaterialAutocomplete from "@mui/material/Autocomplete";
import $4oW5r$muiiconsmaterialPerson from "@mui/icons-material/Person";
import {styled as $4oW5r$styled, ThemeProvider as $4oW5r$ThemeProvider} from "@mui/system";
import $4oW5r$muiiconsmaterialEdit from "@mui/icons-material/Edit";
import $4oW5r$muiiconsmaterialCheck from "@mui/icons-material/Check";
import $4oW5r$muiiconsmaterialPublic from "@mui/icons-material/Public";
import $4oW5r$muiiconsmaterialVpnLock from "@mui/icons-material/VpnLock";
import $4oW5r$muiiconsmaterialGroup from "@mui/icons-material/Group";
import {useNavigate as $4oW5r$useNavigate, useSearchParams as $4oW5r$useSearchParams, useLocation as $4oW5r$useLocation, Link as $4oW5r$Link} from "react-router-dom";
import {styled as $4oW5r$styled1, createTheme as $4oW5r$createTheme} from "@mui/material/styles";
import $4oW5r$muiiconsmaterialLock from "@mui/icons-material/Lock";
import $4oW5r$muiiconsmaterialStorage from "@mui/icons-material/Storage";
import $4oW5r$speakingurl from "speakingurl";
import {withStyles as $4oW5r$withStyles} from "@mui/styles";
import $4oW5r$muiiconsmaterialAccountCircle from "@mui/icons-material/AccountCircle";
import $4oW5r$lodashisEqual from "lodash/isEqual";

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}



const $47a3fad69bcb0083$export$dca4f48302963835 = (value)=>!value ? undefined : Array.isArray(value) ? value : [
        value
    ];
const $47a3fad69bcb0083$export$4450a74bced1b745 = (resourceUri)=>{
    const parsedUrl = new URL(resourceUri);
    return (0, $4oW5r$urljoin)(parsedUrl.origin, "_acl", parsedUrl.pathname);
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


const $1d8606895ce3b768$var$AUTH_TYPE_SSO = "sso";
const $1d8606895ce3b768$var$AUTH_TYPE_LOCAL = "local";
const $1d8606895ce3b768$var$AUTH_TYPE_POD = "pod";
const $1d8606895ce3b768$var$authProvider = ({ dataProvider: dataProvider, authType: authType, allowAnonymous: allowAnonymous = true, checkUser: checkUser, checkPermissions: checkPermissions = false })=>{
    if (![
        $1d8606895ce3b768$var$AUTH_TYPE_SSO,
        $1d8606895ce3b768$var$AUTH_TYPE_LOCAL,
        $1d8606895ce3b768$var$AUTH_TYPE_POD
    ].includes(authType)) throw new Error("The authType parameter is missing from the auth provider");
    return {
        login: async (params)=>{
            const authServerUrl = await (0, $47a3fad69bcb0083$export$274217e117cdbc7b)(dataProvider);
            if (authType === $1d8606895ce3b768$var$AUTH_TYPE_LOCAL) {
                const { username: username, password: password } = params;
                try {
                    const { json: json } = await dataProvider.fetch((0, $4oW5r$urljoin)(authServerUrl, "auth/login"), {
                        method: "POST",
                        body: JSON.stringify({
                            username: username.trim(),
                            password: password.trim()
                        }),
                        headers: new Headers({
                            "Content-Type": "application/json"
                        })
                    });
                    const { token: token } = json;
                    localStorage.setItem("token", token);
                    // Reload to ensure the dataServer config is reset
                    window.location.reload();
                } catch (e) {
                    throw new Error("ra.auth.sign_in_error");
                }
            } else {
                let redirectUrl = `${new URL(window.location.href).origin}/login?login=true`;
                if (params.redirect) redirectUrl += `&redirect=${encodeURIComponent(params.redirect)}`;
                window.location.href = (0, $4oW5r$urljoin)(authServerUrl, `auth?redirectUrl=${encodeURIComponent(redirectUrl)}`);
            }
        },
        signup: async (params)=>{
            const authServerUrl = await (0, $47a3fad69bcb0083$export$274217e117cdbc7b)(dataProvider);
            if (authType === $1d8606895ce3b768$var$AUTH_TYPE_LOCAL) {
                const { username: username, email: email, password: password, domain: domain, ...profileData } = params;
                try {
                    const { json: json } = await dataProvider.fetch((0, $4oW5r$urljoin)(authServerUrl, "auth/signup"), {
                        method: "POST",
                        body: JSON.stringify({
                            username: username.trim(),
                            email: email.trim(),
                            password: password.trim(),
                            ...profileData
                        }),
                        headers: new Headers({
                            "Content-Type": "application/json"
                        })
                    });
                    const { token: token } = json;
                    localStorage.setItem("token", token);
                    const { webId: webId } = (0, $4oW5r$jwtdecode)(token);
                    return webId;
                } catch (e) {
                    if (e.message === "email.already.exists") throw new Error("auth.message.user_email_exist");
                    else if (e.message === "username.already.exists") throw new Error("auth.message.username_exist");
                    else if (e.message === "username.invalid") throw new Error("auth.message.username_invalid");
                    else throw new Error(e.message || "ra.auth.sign_in_error");
                }
            } else {
                const redirectUrl = `${new URL(window.location.href).origin}/login?login=true`;
                window.location.href = (0, $4oW5r$urljoin)(authServerUrl, `auth?redirectUrl=${encodeURIComponent(redirectUrl)}`);
            }
        },
        logout: async ()=>{
            switch(authType){
                case $1d8606895ce3b768$var$AUTH_TYPE_LOCAL:
                    // Delete token but also any other value in local storage
                    localStorage.clear();
                    // Reload to ensure the dataServer config is reset
                    window.location.reload();
                    window.location.href = "/";
                    break;
                case $1d8606895ce3b768$var$AUTH_TYPE_SSO:
                    const authServerUrl = await (0, $47a3fad69bcb0083$export$274217e117cdbc7b)(dataProvider);
                    const baseUrl = new URL(window.location.href).origin;
                    window.location.href = (0, $4oW5r$urljoin)(authServerUrl, `auth/logout?redirectUrl=${encodeURIComponent(`${(0, $4oW5r$urljoin)(baseUrl, "login")}?logout=true`)}`);
                    break;
                case $1d8606895ce3b768$var$AUTH_TYPE_POD:
                    const token = localStorage.getItem("token");
                    const { webId: webId } = (0, $4oW5r$jwtdecode)(token);
                    // Delete token but also any other value in local storage
                    localStorage.clear();
                    window.location.href = (0, $4oW5r$urljoin)(webId, "openApp") + "?type=" + encodeURIComponent("http://activitypods.org/ns/core#FrontAppRegistration");
                    break;
            }
            // Avoid displaying immediately the login page
            return "/";
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
                const { webId: webId } = (0, $4oW5r$jwtdecode)(token);
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
                await dataProvider.fetch((0, $4oW5r$urljoin)(authServerUrl, "auth/reset_password"), {
                    method: "POST",
                    body: JSON.stringify({
                        email: email.trim()
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json"
                    })
                });
            } catch (e) {
                throw new Error("auth.notification.reset_password_error");
            }
        },
        setNewPassword: async (params)=>{
            const { email: email, token: token, password: password } = params;
            const authServerUrl = await (0, $47a3fad69bcb0083$export$274217e117cdbc7b)(dataProvider);
            try {
                await dataProvider.fetch((0, $4oW5r$urljoin)(authServerUrl, "auth/new_password"), {
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
                throw new Error("auth.notification.new_password_error");
            }
        },
        getAccountSettings: async (params)=>{
            const authServerUrl = await (0, $47a3fad69bcb0083$export$274217e117cdbc7b)(dataProvider);
            try {
                const { json: json } = await dataProvider.fetch((0, $4oW5r$urljoin)(authServerUrl, "auth/account"));
                return json;
            } catch (e) {
                throw new Error("auth.notification.get_settings_error");
            }
        },
        updateAccountSettings: async (params)=>{
            const authServerUrl = await (0, $47a3fad69bcb0083$export$274217e117cdbc7b)(dataProvider);
            try {
                const { email: email, currentPassword: currentPassword, newPassword: newPassword } = params;
                await dataProvider.fetch((0, $4oW5r$urljoin)(authServerUrl, "auth/account"), {
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
        }
    };
};
var $1d8606895ce3b768$export$2e2bcd8739ae039 = $1d8606895ce3b768$var$authProvider;


var $f2c5683e04dee28c$exports = {};

$parcel$export($f2c5683e04dee28c$exports, "default", () => $f2c5683e04dee28c$export$2e2bcd8739ae039);






const $3ecc2efd72c45a68$export$66a34090010a35b3 = "acl:Read";
const $3ecc2efd72c45a68$export$7c883503ccedfe0e = "acl:Append";
const $3ecc2efd72c45a68$export$2e56ecf100ca4ba6 = "acl:Write";
const $3ecc2efd72c45a68$export$5581cb2c55de143a = "acl:Control";
const $3ecc2efd72c45a68$export$97a08a1bb7ee0545 = "acl:agent";
const $3ecc2efd72c45a68$export$f07ccbe0773f2c7 = "acl:agentGroup";
const $3ecc2efd72c45a68$export$2703254089a859eb = "acl:agentClass";
const $3ecc2efd72c45a68$export$83ae1bc0992a6335 = "foaf:Agent";
const $3ecc2efd72c45a68$export$546c01a3ffdabe3a = "acl:AuthenticatedAgent";
const $3ecc2efd72c45a68$export$d37f0098bcf84c55 = [
    $3ecc2efd72c45a68$export$66a34090010a35b3,
    $3ecc2efd72c45a68$export$7c883503ccedfe0e,
    $3ecc2efd72c45a68$export$2e56ecf100ca4ba6,
    $3ecc2efd72c45a68$export$5581cb2c55de143a
];
const $3ecc2efd72c45a68$export$dc3840a4e2a72b8c = [
    $3ecc2efd72c45a68$export$66a34090010a35b3,
    $3ecc2efd72c45a68$export$7c883503ccedfe0e,
    $3ecc2efd72c45a68$export$2e56ecf100ca4ba6,
    $3ecc2efd72c45a68$export$5581cb2c55de143a
];
const $3ecc2efd72c45a68$export$65615a101bd6f5ca = [
    $3ecc2efd72c45a68$export$7c883503ccedfe0e,
    $3ecc2efd72c45a68$export$2e56ecf100ca4ba6,
    $3ecc2efd72c45a68$export$5581cb2c55de143a
];
const $3ecc2efd72c45a68$export$b9d0f5f3ab5e453b = [
    $3ecc2efd72c45a68$export$7c883503ccedfe0e,
    $3ecc2efd72c45a68$export$2e56ecf100ca4ba6,
    $3ecc2efd72c45a68$export$5581cb2c55de143a
];
const $3ecc2efd72c45a68$export$ac7b0367c0f9031e = [
    $3ecc2efd72c45a68$export$2e56ecf100ca4ba6,
    $3ecc2efd72c45a68$export$5581cb2c55de143a
];
const $3ecc2efd72c45a68$export$22242524f7d0624 = [
    $3ecc2efd72c45a68$export$5581cb2c55de143a
];
const $3ecc2efd72c45a68$export$cae945d60b6cbe50 = {
    show: $3ecc2efd72c45a68$export$d37f0098bcf84c55,
    list: $3ecc2efd72c45a68$export$dc3840a4e2a72b8c,
    create: $3ecc2efd72c45a68$export$65615a101bd6f5ca,
    edit: $3ecc2efd72c45a68$export$b9d0f5f3ab5e453b,
    delete: $3ecc2efd72c45a68$export$ac7b0367c0f9031e,
    control: $3ecc2efd72c45a68$export$22242524f7d0624
};
const $3ecc2efd72c45a68$export$12e6e8e71d10a4bb = {
    show: "auth.message.resource_show_forbidden",
    edit: "auth.message.resource_edit_forbidden",
    delete: "auth.message.resource_delete_forbidden",
    control: "auth.message.resource_control_forbidden",
    list: "auth.message.container_list_forbidden",
    create: "auth.message.container_create_forbidden"
};
const $3ecc2efd72c45a68$export$2e9571c4ccdeb6a9 = {
    [$3ecc2efd72c45a68$export$66a34090010a35b3]: "auth.right.resource.read",
    [$3ecc2efd72c45a68$export$7c883503ccedfe0e]: "auth.right.resource.append",
    [$3ecc2efd72c45a68$export$2e56ecf100ca4ba6]: "auth.right.resource.write",
    [$3ecc2efd72c45a68$export$5581cb2c55de143a]: "auth.right.resource.control"
};
const $3ecc2efd72c45a68$export$edca379024d80309 = {
    [$3ecc2efd72c45a68$export$66a34090010a35b3]: "auth.right.container.read",
    [$3ecc2efd72c45a68$export$2e56ecf100ca4ba6]: "auth.right.container.write",
    [$3ecc2efd72c45a68$export$5581cb2c55de143a]: "auth.right.container.control"
};


const $abd69a52484f41d9$var$useCheckPermissions = (uri, mode, redirectUrl = "/")=>{
    const { identity: identity, isLoading: isLoading } = (0, $4oW5r$useGetIdentity)();
    const { permissions: permissions } = (0, $4oW5r$usePermissions)(uri);
    const notify = (0, $4oW5r$useNotify)();
    const redirect = (0, $4oW5r$useRedirect)();
    (0, $4oW5r$useEffect)(()=>{
        if (!isLoading && identity && permissions && !permissions.some((p)=>(0, $3ecc2efd72c45a68$export$cae945d60b6cbe50)[mode].includes(p["acl:mode"]))) {
            notify((0, $3ecc2efd72c45a68$export$12e6e8e71d10a4bb)[mode], {
                type: "error"
            });
            redirect(redirectUrl);
        }
    }, [
        permissions,
        identity,
        redirect,
        notify,
        isLoading
    ]);
    return permissions;
};
var $abd69a52484f41d9$export$2e2bcd8739ae039 = $abd69a52484f41d9$var$useCheckPermissions;


const $f2c5683e04dee28c$var$CreateWithPermissions = (props)=>{
    const resource = (0, $4oW5r$useResourceContext)();
    const createContainerUri = (0, $4oW5r$useCreateContainer)(resource);
    (0, $abd69a52484f41d9$export$2e2bcd8739ae039)(createContainerUri, "create");
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Create), {
        ...props
    }, void 0, false, {
        fileName: "packages/auth-provider/src/crud/create/CreateWithPermissions.js",
        lineNumber: 10,
        columnNumber: 10
    }, undefined);
};
$f2c5683e04dee28c$var$CreateWithPermissions.defaultProps = {
    actions: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$CreateActions), {}, void 0, false, {
        fileName: "packages/auth-provider/src/crud/create/CreateWithPermissions.js",
        lineNumber: 14,
        columnNumber: 12
    }, undefined)
};
var $f2c5683e04dee28c$export$2e2bcd8739ae039 = $f2c5683e04dee28c$var$CreateWithPermissions;


var $28fa6ad821327921$exports = {};

$parcel$export($28fa6ad821327921$exports, "default", () => $28fa6ad821327921$export$2e2bcd8739ae039);



var $62be5dcee9954341$exports = {};

$parcel$export($62be5dcee9954341$exports, "default", () => $62be5dcee9954341$export$2e2bcd8739ae039);



var $7dac2771cc5eb38b$exports = {};

$parcel$export($7dac2771cc5eb38b$exports, "default", () => $7dac2771cc5eb38b$export$2e2bcd8739ae039);





var $827412a5ced0d5cd$exports = {};

$parcel$export($827412a5ced0d5cd$exports, "default", () => $827412a5ced0d5cd$export$2e2bcd8739ae039);





var $38698ff0e415f88b$exports = {};

$parcel$export($38698ff0e415f88b$exports, "default", () => $38698ff0e415f88b$export$2e2bcd8739ae039);








const $38698ff0e415f88b$var$useStyles = (0, $4oW5r$muistylesmakeStyles)(()=>({
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
    const translate = (0, $4oW5r$useTranslate)();
    const [value, setValue] = (0, $4oW5r$useState)(null);
    const [inputValue, setInputValue] = (0, $4oW5r$useState)("");
    const [options, setOptions] = (0, $4oW5r$useState)([]);
    const { data: data } = (0, $4oW5r$useGetList)("Person", {
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
    (0, $4oW5r$useEffect)(()=>{
        setOptions(data?.length > 0 ? Object.values(data) : []);
    }, [
        data
    ]);
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$muimaterialAutocomplete), {
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
            addPermission(record.id || record["@id"], (0, $3ecc2efd72c45a68$export$97a08a1bb7ee0545), (0, $3ecc2efd72c45a68$export$66a34090010a35b3));
            setValue(null);
            setInputValue("");
            setOptions([]);
        },
        onInputChange: (event, newInputValue)=>{
            setInputValue(newInputValue);
        },
        renderInput: (params)=>/*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$TextField), {
                ...params,
                label: translate("auth.input.agent_select"),
                variant: "filled",
                margin: "dense",
                fullWidth: true
            }, void 0, false, void 0, void 0),
        renderOption: (props, option)=>/*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$List), {
                dense: true,
                className: classes.list,
                ...props,
                children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ListItem), {
                    button: true,
                    children: [
                        /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ListItemAvatar), {
                            children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Avatar), {
                                src: option.image,
                                children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$muiiconsmaterialPerson), {}, void 0, false, void 0, void 0)
                            }, void 0, false, void 0, void 0)
                        }, void 0, false, void 0, void 0),
                        /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ListItemText), {
                            primary: option["pair:label"]
                        }, void 0, false, void 0, void 0)
                    ]
                }, void 0, true, void 0, void 0)
            }, void 0, false, void 0, void 0)
    }, void 0, false, {
        fileName: "packages/auth-provider/src/components/PermissionsButton/AddPermissionsForm.js",
        lineNumber: 43,
        columnNumber: 5
    }, undefined);
};
var $38698ff0e415f88b$export$2e2bcd8739ae039 = $38698ff0e415f88b$var$AddPermissionsForm;


var $c8acba773a123777$exports = {};

$parcel$export($c8acba773a123777$exports, "default", () => $c8acba773a123777$export$2e2bcd8739ae039);




var $e8b8e6301988112e$exports = {};

$parcel$export($e8b8e6301988112e$exports, "default", () => $e8b8e6301988112e$export$2e2bcd8739ae039);








var $2a38cfa58fd59a9e$exports = {};

$parcel$export($2a38cfa58fd59a9e$exports, "default", () => $2a38cfa58fd59a9e$export$2e2bcd8739ae039);







const $2a38cfa58fd59a9e$var$AgentIcon = ({ agent: agent })=>{
    switch(agent.predicate){
        case 0, $3ecc2efd72c45a68$export$2703254089a859eb:
            return agent.id === (0, $3ecc2efd72c45a68$export$83ae1bc0992a6335) ? /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$muiiconsmaterialPublic), {}, void 0, false, {
                fileName: "packages/auth-provider/src/components/PermissionsButton/AgentIcon.js",
                lineNumber: 11,
                columnNumber: 45
            }, undefined) : /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$muiiconsmaterialVpnLock), {}, void 0, false, {
                fileName: "packages/auth-provider/src/components/PermissionsButton/AgentIcon.js",
                lineNumber: 11,
                columnNumber: 62
            }, undefined);
        case 0, $3ecc2efd72c45a68$export$97a08a1bb7ee0545:
            return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$muiiconsmaterialPerson), {}, void 0, false, {
                fileName: "packages/auth-provider/src/components/PermissionsButton/AgentIcon.js",
                lineNumber: 13,
                columnNumber: 14
            }, undefined);
        case 0, $3ecc2efd72c45a68$export$f07ccbe0773f2c7:
            return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$muiiconsmaterialGroup), {}, void 0, false, {
                fileName: "packages/auth-provider/src/components/PermissionsButton/AgentIcon.js",
                lineNumber: 15,
                columnNumber: 14
            }, undefined);
        default:
            throw new Error(`Unknown agent predicate: ${agent.predicate}`);
    }
};
var $2a38cfa58fd59a9e$export$2e2bcd8739ae039 = $2a38cfa58fd59a9e$var$AgentIcon;


const $e8b8e6301988112e$var$useStyles = (0, $4oW5r$muistylesmakeStyles)(()=>({
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
    const translate = (0, $4oW5r$useTranslate)();
    const dataProvider = (0, $4oW5r$useDataProvider)();
    const [anchorEl, setAnchorEl] = (0, $4oW5r$react).useState(null);
    const [user, setUser] = (0, $4oW5r$useState)();
    const [loading, setLoading] = (0, $4oW5r$useState)(true);
    const [error, setError] = (0, $4oW5r$useState)();
    (0, $4oW5r$useEffect)(()=>{
        if (agent.predicate === (0, $3ecc2efd72c45a68$export$97a08a1bb7ee0545)) dataProvider.getOne("Person", {
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
    if (agent.predicate === (0, $3ecc2efd72c45a68$export$f07ccbe0773f2c7)) return null;
    const openMenu = (event)=>setAnchorEl(event.currentTarget);
    const closeMenu = ()=>setAnchorEl(null);
    const labels = isContainer ? (0, $3ecc2efd72c45a68$export$edca379024d80309) : (0, $3ecc2efd72c45a68$export$2e9571c4ccdeb6a9);
    if (loading) return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Loading), {}, void 0, false, {
        fileName: "packages/auth-provider/src/components/PermissionsButton/AgentItem.js",
        lineNumber: 73,
        columnNumber: 23
    }, undefined);
    if (error) return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Error), {}, void 0, false, {
        fileName: "packages/auth-provider/src/components/PermissionsButton/AgentItem.js",
        lineNumber: 74,
        columnNumber: 21
    }, undefined);
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ListItem), {
        className: classes.listItem,
        children: [
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ListItemAvatar), {
                children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Avatar), {
                    src: user?.image,
                    children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $2a38cfa58fd59a9e$exports.default), {
                        agent: agent
                    }, void 0, false, {
                        fileName: "packages/auth-provider/src/components/PermissionsButton/AgentItem.js",
                        lineNumber: 80,
                        columnNumber: 11
                    }, undefined)
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/PermissionsButton/AgentItem.js",
                    lineNumber: 79,
                    columnNumber: 9
                }, undefined)
            }, void 0, false, {
                fileName: "packages/auth-provider/src/components/PermissionsButton/AgentItem.js",
                lineNumber: 78,
                columnNumber: 7
            }, undefined),
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ListItemText), {
                className: classes.primaryText,
                primary: user ? user["pair:label"] : translate(agent.id === (0, $3ecc2efd72c45a68$export$83ae1bc0992a6335) ? "auth.agent.anonymous" : "auth.agent.authenticated")
            }, void 0, false, {
                fileName: "packages/auth-provider/src/components/PermissionsButton/AgentItem.js",
                lineNumber: 83,
                columnNumber: 7
            }, undefined),
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ListItemText), {
                className: classes.secondaryText,
                primary: agent.permissions && agent.permissions.map((p)=>translate(labels[p])).join(", ")
            }, void 0, false, {
                fileName: "packages/auth-provider/src/components/PermissionsButton/AgentItem.js",
                lineNumber: 91,
                columnNumber: 7
            }, undefined),
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ListItemSecondaryAction), {
                children: [
                    /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$IconButton), {
                        onClick: openMenu,
                        size: "large",
                        children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$muiiconsmaterialEdit), {}, void 0, false, {
                            fileName: "packages/auth-provider/src/components/PermissionsButton/AgentItem.js",
                            lineNumber: 97,
                            columnNumber: 11
                        }, undefined)
                    }, void 0, false, {
                        fileName: "packages/auth-provider/src/components/PermissionsButton/AgentItem.js",
                        lineNumber: 96,
                        columnNumber: 9
                    }, undefined),
                    /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Menu), {
                        anchorEl: anchorEl,
                        keepMounted: true,
                        open: Boolean(anchorEl),
                        onClose: closeMenu,
                        children: Object.entries(labels).map(([rightKey, rightLabel])=>{
                            const hasPermission = agent.permissions && agent.permissions.includes(rightKey);
                            return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$MenuItem), {
                                onClick: ()=>{
                                    if (hasPermission) removePermission(agent.id, agent.predicate, rightKey);
                                    else addPermission(agent.id, agent.predicate, rightKey);
                                    closeMenu();
                                },
                                children: [
                                    /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ListItemIcon), {
                                        children: hasPermission ? /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$muiiconsmaterialCheck), {}, void 0, false, {
                                            fileName: "packages/auth-provider/src/components/PermissionsButton/AgentItem.js",
                                            lineNumber: 114,
                                            columnNumber: 48
                                        }, undefined) : null
                                    }, void 0, false, {
                                        fileName: "packages/auth-provider/src/components/PermissionsButton/AgentItem.js",
                                        lineNumber: 114,
                                        columnNumber: 17
                                    }, undefined),
                                    /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ListItemText), {
                                        primary: translate(rightLabel)
                                    }, void 0, false, {
                                        fileName: "packages/auth-provider/src/components/PermissionsButton/AgentItem.js",
                                        lineNumber: 115,
                                        columnNumber: 17
                                    }, undefined)
                                ]
                            }, rightKey, true, {
                                fileName: "packages/auth-provider/src/components/PermissionsButton/AgentItem.js",
                                lineNumber: 103,
                                columnNumber: 15
                            }, undefined);
                        })
                    }, void 0, false, {
                        fileName: "packages/auth-provider/src/components/PermissionsButton/AgentItem.js",
                        lineNumber: 99,
                        columnNumber: 9
                    }, undefined)
                ]
            }, void 0, true, {
                fileName: "packages/auth-provider/src/components/PermissionsButton/AgentItem.js",
                lineNumber: 95,
                columnNumber: 7
            }, undefined)
        ]
    }, void 0, true, {
        fileName: "packages/auth-provider/src/components/PermissionsButton/AgentItem.js",
        lineNumber: 77,
        columnNumber: 5
    }, undefined);
};
var $e8b8e6301988112e$export$2e2bcd8739ae039 = $e8b8e6301988112e$var$AgentItem;


const $c8acba773a123777$var$StyledList = (0, $4oW5r$styled)((0, $4oW5r$List))(({ theme: theme })=>({
        width: "100%",
        maxWidth: "100%",
        backgroundColor: theme.palette.background.paper
    }));
const $c8acba773a123777$var$EditPermissionsForm = ({ isContainer: isContainer, agents: agents, addPermission: addPermission, removePermission: removePermission })=>{
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)($c8acba773a123777$var$StyledList, {
        dense: true,
        children: Object.entries(agents).map(([agentId, agent])=>/*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $e8b8e6301988112e$exports.default), {
                isContainer: isContainer,
                agent: agent,
                addPermission: addPermission,
                removePermission: removePermission
            }, agentId, false, {
                fileName: "packages/auth-provider/src/components/PermissionsButton/EditPermissionsForm.js",
                lineNumber: 16,
                columnNumber: 9
            }, undefined))
    }, void 0, false, {
        fileName: "packages/auth-provider/src/components/PermissionsButton/EditPermissionsForm.js",
        lineNumber: 14,
        columnNumber: 5
    }, undefined);
};
var $c8acba773a123777$export$2e2bcd8739ae039 = $c8acba773a123777$var$EditPermissionsForm;






const $7ad577d9c9c71db0$var$useAgents = (uri)=>{
    const { permissions: permissions } = (0, $4oW5r$usePermissions)(uri);
    const authProvider = (0, $4oW5r$useAuthProvider)();
    const [agents, setAgents] = (0, $4oW5r$useState)({});
    // Format list of authorized agents, based on the permissions returned for the resource
    (0, $4oW5r$useEffect)(()=>{
        const result = {
            [(0, $3ecc2efd72c45a68$export$83ae1bc0992a6335)]: {
                id: (0, $3ecc2efd72c45a68$export$83ae1bc0992a6335),
                predicate: (0, $3ecc2efd72c45a68$export$2703254089a859eb),
                permissions: []
            },
            [(0, $3ecc2efd72c45a68$export$546c01a3ffdabe3a)]: {
                id: (0, $3ecc2efd72c45a68$export$546c01a3ffdabe3a),
                predicate: (0, $3ecc2efd72c45a68$export$2703254089a859eb),
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
                if (p[0, $3ecc2efd72c45a68$export$2703254089a859eb]) (0, $47a3fad69bcb0083$export$dca4f48302963835)(p[0, $3ecc2efd72c45a68$export$2703254089a859eb]).forEach((agentId)=>appendPermission(agentId, (0, $3ecc2efd72c45a68$export$2703254089a859eb), p["acl:mode"]));
                if (p[0, $3ecc2efd72c45a68$export$97a08a1bb7ee0545]) (0, $47a3fad69bcb0083$export$dca4f48302963835)(p[0, $3ecc2efd72c45a68$export$97a08a1bb7ee0545]).forEach((userUri)=>appendPermission(userUri, (0, $3ecc2efd72c45a68$export$97a08a1bb7ee0545), p["acl:mode"]));
                if (p[0, $3ecc2efd72c45a68$export$f07ccbe0773f2c7]) (0, $47a3fad69bcb0083$export$dca4f48302963835)(p[0, $3ecc2efd72c45a68$export$f07ccbe0773f2c7]).forEach((groupUri)=>appendPermission(groupUri, (0, $3ecc2efd72c45a68$export$f07ccbe0773f2c7), p["acl:mode"]));
            }
            setAgents(result);
        }
    }, [
        permissions
    ]);
    const addPermission = (0, $4oW5r$useCallback)((agentId, predicate, mode)=>{
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
    const removePermission = (0, $4oW5r$useCallback)((agentId, predicate, mode)=>{
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
        .filter(([_, agent])=>agent.predicate === (0, $3ecc2efd72c45a68$export$2703254089a859eb) || agent.permissions.length > 0)));
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


const $827412a5ced0d5cd$var$useStyles = (0, $4oW5r$muistylesmakeStyles)(()=>({
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
    const translate = (0, $4oW5r$useTranslate)();
    const { agents: agents, addPermission: addPermission, removePermission: removePermission } = (0, $7ad577d9c9c71db0$export$2e2bcd8739ae039)(uri);
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Dialog), {
        fullWidth: true,
        open: open,
        onClose: onClose,
        children: [
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$DialogTitle), {
                className: classes.title,
                children: translate(isContainer ? "auth.dialog.container_permissions" : "auth.dialog.resource_permissions")
            }, void 0, false, {
                fileName: "packages/auth-provider/src/components/PermissionsButton/PermissionsDialog.js",
                lineNumber: 34,
                columnNumber: 7
            }, undefined),
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$DialogContent), {
                className: classes.addForm,
                children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $38698ff0e415f88b$exports.default), {
                    agents: agents,
                    addPermission: addPermission
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/PermissionsButton/PermissionsDialog.js",
                    lineNumber: 38,
                    columnNumber: 9
                }, undefined)
            }, void 0, false, {
                fileName: "packages/auth-provider/src/components/PermissionsButton/PermissionsDialog.js",
                lineNumber: 37,
                columnNumber: 7
            }, undefined),
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$DialogContent), {
                className: classes.listForm,
                children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $c8acba773a123777$exports.default), {
                    isContainer: isContainer,
                    agents: agents,
                    addPermission: addPermission,
                    removePermission: removePermission
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/PermissionsButton/PermissionsDialog.js",
                    lineNumber: 41,
                    columnNumber: 9
                }, undefined)
            }, void 0, false, {
                fileName: "packages/auth-provider/src/components/PermissionsButton/PermissionsDialog.js",
                lineNumber: 40,
                columnNumber: 7
            }, undefined),
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$DialogActions), {
                className: classes.actions,
                children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Button), {
                    label: "ra.action.close",
                    variant: "text",
                    onClick: onClose
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/PermissionsButton/PermissionsDialog.js",
                    lineNumber: 49,
                    columnNumber: 9
                }, undefined)
            }, void 0, false, {
                fileName: "packages/auth-provider/src/components/PermissionsButton/PermissionsDialog.js",
                lineNumber: 48,
                columnNumber: 7
            }, undefined)
        ]
    }, void 0, true, {
        fileName: "packages/auth-provider/src/components/PermissionsButton/PermissionsDialog.js",
        lineNumber: 33,
        columnNumber: 5
    }, undefined);
};
var $827412a5ced0d5cd$export$2e2bcd8739ae039 = $827412a5ced0d5cd$var$PermissionsDialog;


const $7dac2771cc5eb38b$var$PermissionsButton = ({ isContainer: isContainer })=>{
    const record = (0, $4oW5r$useRecordContext)();
    const resource = (0, $4oW5r$useResourceContext)();
    const [showDialog, setShowDialog] = (0, $4oW5r$useState)(false);
    const createContainer = (0, $4oW5r$useCreateContainer)(resource);
    const uri = isContainer ? createContainer : record.id || record["@id"];
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Fragment), {
        children: [
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Button), {
                label: "auth.action.permissions",
                onClick: ()=>setShowDialog(true),
                children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$muiiconsmaterialShare), {}, void 0, false, {
                    fileName: "packages/auth-provider/src/components/PermissionsButton/PermissionsButton.js",
                    lineNumber: 16,
                    columnNumber: 9
                }, undefined)
            }, void 0, false, {
                fileName: "packages/auth-provider/src/components/PermissionsButton/PermissionsButton.js",
                lineNumber: 15,
                columnNumber: 7
            }, undefined),
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $827412a5ced0d5cd$exports.default), {
                uri: uri,
                isContainer: isContainer,
                open: showDialog,
                onClose: ()=>setShowDialog(false)
            }, void 0, false, {
                fileName: "packages/auth-provider/src/components/PermissionsButton/PermissionsButton.js",
                lineNumber: 18,
                columnNumber: 7
            }, undefined)
        ]
    }, void 0, true);
};
$7dac2771cc5eb38b$var$PermissionsButton.defaultProps = {
    isContainer: false
};
var $7dac2771cc5eb38b$export$2e2bcd8739ae039 = $7dac2771cc5eb38b$var$PermissionsButton;



const $62be5dcee9954341$var$EditActionsWithPermissions = ()=>{
    const { hasList: hasList, hasShow: hasShow } = (0, $4oW5r$useResourceDefinition)();
    const record = (0, $4oW5r$useRecordContext)();
    const { permissions: permissions } = (0, $4oW5r$usePermissionsOptimized)(record?.id);
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$TopToolbar), {
        children: [
            hasList && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ListButton), {}, void 0, false, {
                fileName: "packages/auth-provider/src/crud/edit/EditActionsWithPermissions.js",
                lineNumber: 19,
                columnNumber: 19
            }, undefined),
            hasShow && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ShowButton), {}, void 0, false, {
                fileName: "packages/auth-provider/src/crud/edit/EditActionsWithPermissions.js",
                lineNumber: 20,
                columnNumber: 19
            }, undefined),
            !!permissions && permissions.some((p)=>(0, $3ecc2efd72c45a68$export$22242524f7d0624).includes(p["acl:mode"])) && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $7dac2771cc5eb38b$exports.default), {}, void 0, false, {
                fileName: "packages/auth-provider/src/crud/edit/EditActionsWithPermissions.js",
                lineNumber: 21,
                columnNumber: 91
            }, undefined)
        ]
    }, void 0, true, {
        fileName: "packages/auth-provider/src/crud/edit/EditActionsWithPermissions.js",
        lineNumber: 18,
        columnNumber: 5
    }, undefined);
};
var $62be5dcee9954341$export$2e2bcd8739ae039 = $62be5dcee9954341$var$EditActionsWithPermissions;


var $701198930c0b0c72$exports = {};

$parcel$export($701198930c0b0c72$exports, "default", () => $701198930c0b0c72$export$2e2bcd8739ae039);




var $7efdcbe4be05bfd5$exports = {};

$parcel$export($7efdcbe4be05bfd5$exports, "default", () => $7efdcbe4be05bfd5$export$2e2bcd8739ae039);




const $7efdcbe4be05bfd5$var$DeleteButtonWithPermissions = (props)=>{
    const recordId = (0, $4oW5r$useGetRecordId)();
    const { permissions: permissions, isLoading: isLoading } = (0, $4oW5r$usePermissions)(recordId);
    if (!isLoading && permissions?.some((p)=>(0, $3ecc2efd72c45a68$export$ac7b0367c0f9031e).includes(p["acl:mode"]))) return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$DeleteButton), {
        ...props
    }, void 0, false, {
        fileName: "packages/auth-provider/src/crud/edit/DeleteButtonWithPermissions.js",
        lineNumber: 9,
        columnNumber: 12
    }, undefined);
    return null;
};
var $7efdcbe4be05bfd5$export$2e2bcd8739ae039 = $7efdcbe4be05bfd5$var$DeleteButtonWithPermissions;


const $701198930c0b0c72$var$useStyles = (0, $4oW5r$muistylesmakeStyles)(()=>({
        toolbar: {
            flex: 1,
            display: "flex",
            justifyContent: "space-between"
        }
    }));
const $701198930c0b0c72$var$EditToolbarWithPermissions = (props)=>{
    const classes = $701198930c0b0c72$var$useStyles();
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Toolbar), {
        ...props,
        className: classes.toolbar,
        children: [
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$SaveButton), {}, void 0, false, {
                fileName: "packages/auth-provider/src/crud/edit/EditToolbarWithPermissions.js",
                lineNumber: 18,
                columnNumber: 7
            }, undefined),
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $7efdcbe4be05bfd5$exports.default), {
                mutationMode: "undoable"
            }, void 0, false, {
                fileName: "packages/auth-provider/src/crud/edit/EditToolbarWithPermissions.js",
                lineNumber: 19,
                columnNumber: 7
            }, undefined)
        ]
    }, void 0, true, {
        fileName: "packages/auth-provider/src/crud/edit/EditToolbarWithPermissions.js",
        lineNumber: 17,
        columnNumber: 5
    }, undefined);
};
var $701198930c0b0c72$export$2e2bcd8739ae039 = $701198930c0b0c72$var$EditToolbarWithPermissions;



const $28fa6ad821327921$var$EditWithPermissions = (props)=>{
    const recordId = (0, $4oW5r$useGetRecordId)();
    (0, $abd69a52484f41d9$export$2e2bcd8739ae039)(recordId, "edit");
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Edit), {
        ...props,
        children: /*#__PURE__*/ (0, $4oW5r$react).cloneElement(props.children, {
            toolbar: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $701198930c0b0c72$exports.default), {}, void 0, false, {
                fileName: "packages/auth-provider/src/crud/edit/EditWithPermissions.js",
                lineNumber: 13,
                columnNumber: 18
            }, undefined),
            // Allow to override toolbar
            ...props.children.props
        })
    }, void 0, false, {
        fileName: "packages/auth-provider/src/crud/edit/EditWithPermissions.js",
        lineNumber: 11,
        columnNumber: 5
    }, undefined);
};
$28fa6ad821327921$var$EditWithPermissions.defaultProps = {
    actions: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $62be5dcee9954341$exports.default), {}, void 0, false, {
        fileName: "packages/auth-provider/src/crud/edit/EditWithPermissions.js",
        lineNumber: 22,
        columnNumber: 12
    }, undefined)
};
var $28fa6ad821327921$export$2e2bcd8739ae039 = $28fa6ad821327921$var$EditWithPermissions;




var $c78c2d7e17f60b2f$exports = {};

$parcel$export($c78c2d7e17f60b2f$exports, "default", () => $c78c2d7e17f60b2f$export$2e2bcd8739ae039);




const $c78c2d7e17f60b2f$var$EditButtonWithPermissions = (props)=>{
    const recordId = (0, $4oW5r$useGetRecordId)();
    const { permissions: permissions, isLoading: isLoading } = (0, $4oW5r$usePermissions)(recordId);
    if (!isLoading && permissions?.some((p)=>(0, $3ecc2efd72c45a68$export$b9d0f5f3ab5e453b).includes(p["acl:mode"]))) return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$EditButton), {
        ...props
    }, void 0, false, {
        fileName: "packages/auth-provider/src/crud/edit/EditButtonWithPermissions.js",
        lineNumber: 9,
        columnNumber: 12
    }, undefined);
    return null;
};
var $c78c2d7e17f60b2f$export$2e2bcd8739ae039 = $c78c2d7e17f60b2f$var$EditButtonWithPermissions;



var $a4ded8260cc90dad$exports = {};

$parcel$export($a4ded8260cc90dad$exports, "default", () => $a4ded8260cc90dad$export$2e2bcd8739ae039);



var $e6071424a1ba88d9$exports = {};

$parcel$export($e6071424a1ba88d9$exports, "default", () => $e6071424a1ba88d9$export$2e2bcd8739ae039);







// Do not show Export and Refresh buttons on mobile
const $e6071424a1ba88d9$var$ListActionsWithPermissions = ({ bulkActions: bulkActions, sort: sort, displayedFilters: displayedFilters, exporter: exporter, filters: filters, filterValues: filterValues, onUnselectItems: onUnselectItems, selectedIds: selectedIds, showFilter: showFilter, total: total })=>{
    const resource = (0, $4oW5r$useResourceContext)();
    const xs = (0, $4oW5r$useMediaQuery)((theme)=>theme.breakpoints.down("xs"));
    const resourceDefinition = (0, $4oW5r$useResourceDefinition)();
    const createContainerUri = (0, $4oW5r$useCreateContainer)(resource);
    const { permissions: permissions } = (0, $4oW5r$usePermissions)(createContainerUri);
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$TopToolbar), {
        children: [
            filters && /*#__PURE__*/ (0, $4oW5r$react).cloneElement(filters, {
                showFilter: showFilter,
                displayedFilters: displayedFilters,
                filterValues: filterValues,
                context: "button"
            }),
            resourceDefinition.hasCreate && permissions && permissions.some((p)=>(0, $3ecc2efd72c45a68$export$65615a101bd6f5ca).includes(p["acl:mode"])) && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$CreateButton), {}, void 0, false, {
                fileName: "packages/auth-provider/src/crud/list/ListActionsWithPermissions.js",
                lineNumber: 43,
                columnNumber: 9
            }, undefined),
            permissions && permissions.some((p)=>(0, $3ecc2efd72c45a68$export$22242524f7d0624).includes(p["acl:mode"])) && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $7dac2771cc5eb38b$exports.default), {
                isContainer: true
            }, void 0, false, {
                fileName: "packages/auth-provider/src/crud/list/ListActionsWithPermissions.js",
                lineNumber: 46,
                columnNumber: 9
            }, undefined),
            !xs && exporter !== false && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ExportButton), {
                disabled: total === 0,
                sort: sort,
                filter: filterValues,
                exporter: exporter
            }, void 0, false, {
                fileName: "packages/auth-provider/src/crud/list/ListActionsWithPermissions.js",
                lineNumber: 49,
                columnNumber: 9
            }, undefined),
            bulkActions && /*#__PURE__*/ (0, $4oW5r$react).cloneElement(bulkActions, {
                filterValues: filterValues,
                selectedIds: selectedIds,
                onUnselectItems: onUnselectItems
            })
        ]
    }, void 0, true, {
        fileName: "packages/auth-provider/src/crud/list/ListActionsWithPermissions.js",
        lineNumber: 34,
        columnNumber: 5
    }, undefined);
};
var $e6071424a1ba88d9$export$2e2bcd8739ae039 = $e6071424a1ba88d9$var$ListActionsWithPermissions;


const $a4ded8260cc90dad$var$ListWithPermissions = (props)=>/*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$List1), {
        ...props
    }, void 0, false, {
        fileName: "packages/auth-provider/src/crud/list/ListWithPermissions.js",
        lineNumber: 5,
        columnNumber: 38
    }, undefined);
$a4ded8260cc90dad$var$ListWithPermissions.defaultProps = {
    actions: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $e6071424a1ba88d9$exports.default), {}, void 0, false, {
        fileName: "packages/auth-provider/src/crud/list/ListWithPermissions.js",
        lineNumber: 8,
        columnNumber: 12
    }, undefined)
};
var $a4ded8260cc90dad$export$2e2bcd8739ae039 = $a4ded8260cc90dad$var$ListWithPermissions;



var $561bb436d5af917c$exports = {};

$parcel$export($561bb436d5af917c$exports, "default", () => $561bb436d5af917c$export$2e2bcd8739ae039);



var $d1f54fc03225e8ee$exports = {};

$parcel$export($d1f54fc03225e8ee$exports, "default", () => $d1f54fc03225e8ee$export$2e2bcd8739ae039);





const $d1f54fc03225e8ee$var$ShowActionsWithPermissions = ()=>{
    const { hasList: hasList, hasEdit: hasEdit } = (0, $4oW5r$useResourceDefinition)();
    const record = (0, $4oW5r$useRecordContext)();
    const { permissions: permissions } = (0, $4oW5r$usePermissions)(record?.id);
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$TopToolbar), {
        children: [
            hasList && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ListButton), {}, void 0, false, {
                fileName: "packages/auth-provider/src/crud/show/ShowActionsWithPermissions.js",
                lineNumber: 19,
                columnNumber: 19
            }, undefined),
            hasEdit && permissions && permissions.some((p)=>(0, $3ecc2efd72c45a68$export$b9d0f5f3ab5e453b).includes(p["acl:mode"])) && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$EditButton), {}, void 0, false, {
                fileName: "packages/auth-provider/src/crud/show/ShowActionsWithPermissions.js",
                lineNumber: 20,
                columnNumber: 97
            }, undefined),
            permissions && permissions.some((p)=>(0, $3ecc2efd72c45a68$export$22242524f7d0624).includes(p["acl:mode"])) && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $7dac2771cc5eb38b$exports.default), {}, void 0, false, {
                fileName: "packages/auth-provider/src/crud/show/ShowActionsWithPermissions.js",
                lineNumber: 21,
                columnNumber: 89
            }, undefined)
        ]
    }, void 0, true, {
        fileName: "packages/auth-provider/src/crud/show/ShowActionsWithPermissions.js",
        lineNumber: 18,
        columnNumber: 5
    }, undefined);
};
var $d1f54fc03225e8ee$export$2e2bcd8739ae039 = $d1f54fc03225e8ee$var$ShowActionsWithPermissions;



const $561bb436d5af917c$var$ShowWithPermissions = (props)=>{
    const recordId = (0, $4oW5r$useGetRecordId)();
    (0, $abd69a52484f41d9$export$2e2bcd8739ae039)(recordId, "show");
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Show), {
        ...props
    }, void 0, false, {
        fileName: "packages/auth-provider/src/crud/show/ShowWithPermissions.js",
        lineNumber: 9,
        columnNumber: 10
    }, undefined);
};
$561bb436d5af917c$var$ShowWithPermissions.defaultProps = {
    actions: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $d1f54fc03225e8ee$exports.default), {}, void 0, false, {
        fileName: "packages/auth-provider/src/crud/show/ShowWithPermissions.js",
        lineNumber: 13,
        columnNumber: 12
    }, undefined)
};
var $561bb436d5af917c$export$2e2bcd8739ae039 = $561bb436d5af917c$var$ShowWithPermissions;




var $c2eef7602bbbff5e$exports = {};

$parcel$export($c2eef7602bbbff5e$exports, "default", () => $c2eef7602bbbff5e$export$2e2bcd8739ae039);




const $c2eef7602bbbff5e$var$AuthDialog = ({ open: open, onClose: onClose, title: title, message: message, redirect: redirect, ...rest })=>{
    const login = (0, $4oW5r$useLogin)();
    const translate = (0, $4oW5r$useTranslate)();
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Dialog), {
        open: open,
        onClose: onClose,
        ...rest,
        children: [
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$DialogTitle), {
                children: translate(title)
            }, void 0, false, {
                fileName: "packages/auth-provider/src/components/AuthDialog.js",
                lineNumber: 10,
                columnNumber: 7
            }, undefined),
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$DialogContent), {
                children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$DialogContentText), {
                    children: translate(message)
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/AuthDialog.js",
                    lineNumber: 12,
                    columnNumber: 9
                }, undefined)
            }, void 0, false, {
                fileName: "packages/auth-provider/src/components/AuthDialog.js",
                lineNumber: 11,
                columnNumber: 7
            }, undefined),
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$DialogActions), {
                children: [
                    /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Button1), {
                        onClick: onClose,
                        children: translate("ra.action.cancel")
                    }, void 0, false, {
                        fileName: "packages/auth-provider/src/components/AuthDialog.js",
                        lineNumber: 15,
                        columnNumber: 9
                    }, undefined),
                    /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Button1), {
                        onClick: ()=>login({
                                redirect: redirect || window.location.pathname + window.location.search
                            }),
                        color: "primary",
                        variant: "contained",
                        children: translate("auth.action.login")
                    }, void 0, false, {
                        fileName: "packages/auth-provider/src/components/AuthDialog.js",
                        lineNumber: 16,
                        columnNumber: 9
                    }, undefined)
                ]
            }, void 0, true, {
                fileName: "packages/auth-provider/src/components/AuthDialog.js",
                lineNumber: 14,
                columnNumber: 7
            }, undefined)
        ]
    }, void 0, true, {
        fileName: "packages/auth-provider/src/components/AuthDialog.js",
        lineNumber: 9,
        columnNumber: 5
    }, undefined);
};
$c2eef7602bbbff5e$var$AuthDialog.defaultProps = {
    title: "auth.dialog.login_required",
    message: "auth.message.login_to_continue"
};
var $c2eef7602bbbff5e$export$2e2bcd8739ae039 = $c2eef7602bbbff5e$var$AuthDialog;


var $479961b7e298304b$exports = {};

$parcel$export($479961b7e298304b$exports, "SsoLoginPageClasses", () => $479961b7e298304b$export$388de65c72fa74b4);
$parcel$export($479961b7e298304b$exports, "default", () => $479961b7e298304b$export$2e2bcd8739ae039);








const $479961b7e298304b$var$delay = async (t)=>new Promise((resolve)=>setTimeout(resolve, t));
// Inspired from https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/auth/Login.tsx
const $479961b7e298304b$var$SsoLoginPage = ({ children: children, backgroundImage: backgroundImage, buttons: buttons, userResource: userResource, propertiesExist: propertiesExist, text: text, ...rest })=>{
    const containerRef = (0, $4oW5r$useRef)();
    let backgroundImageLoaded = false;
    const navigate = (0, $4oW5r$useNavigate)();
    const [searchParams] = (0, $4oW5r$useSearchParams)();
    const { identity: identity, isLoading: isLoading } = (0, $4oW5r$useGetIdentity)();
    const notify = (0, $4oW5r$useNotify)();
    const login = (0, $4oW5r$useLogin)();
    const dataProvider = (0, $4oW5r$useDataProvider)();
    const authProvider = (0, $4oW5r$useAuthProvider)();
    (0, $4oW5r$useEffect)(()=>{
        if (!isLoading && identity?.id) // Already authenticated, redirect to the home page
        navigate(searchParams.get("redirect") || "/");
    }, [
        identity,
        isLoading,
        navigate,
        searchParams
    ]);
    (0, $4oW5r$useEffect)(()=>{
        (async ()=>{
            if (searchParams.has("login")) {
                if (searchParams.has("error")) {
                    if (searchParams.get("error") === "registration.not-allowed") notify("auth.message.user_email_not_found", {
                        type: "error"
                    });
                    else notify("auth.message.bad_request", {
                        type: "error",
                        error: searchParams.get("error")
                    });
                } else if (searchParams.has("token")) {
                    const token = searchParams.get("token");
                    const { webId: webId } = (0, $4oW5r$jwtdecode)(token);
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
    (0, $4oW5r$useEffect)(()=>{
        if (!backgroundImageLoaded) lazyLoadBackgroundImage();
    });
    if (isLoading) return null;
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)($479961b7e298304b$var$Root, {
        ...rest,
        ref: containerRef,
        children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Card), {
            className: $479961b7e298304b$export$388de65c72fa74b4.card,
            children: [
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)("div", {
                    className: $479961b7e298304b$export$388de65c72fa74b4.avatar,
                    children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Avatar), {
                        className: $479961b7e298304b$export$388de65c72fa74b4.icon,
                        children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$muiiconsmaterialLock), {}, void 0, false, {
                            fileName: "packages/auth-provider/src/components/SsoLoginPage.js",
                            lineNumber: 114,
                            columnNumber: 13
                        }, undefined)
                    }, void 0, false, {
                        fileName: "packages/auth-provider/src/components/SsoLoginPage.js",
                        lineNumber: 113,
                        columnNumber: 11
                    }, undefined)
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/SsoLoginPage.js",
                    lineNumber: 112,
                    columnNumber: 9
                }, undefined),
                text && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Typography), {
                    variant: "body2" /* className={classes.text} */ ,
                    children: text
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/SsoLoginPage.js",
                    lineNumber: 117,
                    columnNumber: 18
                }, undefined),
                buttons?.map((button, i)=>/*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$CardActions), {
                        children: /*#__PURE__*/ (0, $4oW5r$react).cloneElement(button, {
                            fullWidth: true,
                            variant: "outlined",
                            type: "submit",
                            onClick: ()=>login({}, "/login")
                        })
                    }, i, false, {
                        fileName: "packages/auth-provider/src/components/SsoLoginPage.js",
                        lineNumber: 119,
                        columnNumber: 11
                    }, undefined))
            ]
        }, void 0, true, {
            fileName: "packages/auth-provider/src/components/SsoLoginPage.js",
            lineNumber: 111,
            columnNumber: 7
        }, undefined)
    }, void 0, false, {
        fileName: "packages/auth-provider/src/components/SsoLoginPage.js",
        lineNumber: 110,
        columnNumber: 5
    }, undefined);
};
const $479961b7e298304b$var$PREFIX = "SsoLoginPage";
const $479961b7e298304b$export$388de65c72fa74b4 = {
    card: `${$479961b7e298304b$var$PREFIX}-card`,
    avatar: `${$479961b7e298304b$var$PREFIX}-avatar`,
    icon: `${$479961b7e298304b$var$PREFIX}-icon`,
    switch: `${$479961b7e298304b$var$PREFIX}-switch`
};
const $479961b7e298304b$var$Root = (0, $4oW5r$styled1)("div", {
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
        /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Button1), {
            startIcon: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Avatar), {
                src: "/lescommuns.jpg"
            }, void 0, false, void 0, void 0),
            children: "Les Communs"
        }, void 0, false, {
            fileName: "packages/auth-provider/src/components/SsoLoginPage.js",
            lineNumber: 177,
            columnNumber: 13
        }, undefined)
    ],
    userResource: "Person"
};
var $479961b7e298304b$export$2e2bcd8739ae039 = $479961b7e298304b$var$SsoLoginPage;


var $907d5edbccff943e$exports = {};

$parcel$export($907d5edbccff943e$exports, "default", () => $907d5edbccff943e$export$2e2bcd8739ae039);






var $a6bc0c3ff4b3b177$exports = {};

$parcel$export($a6bc0c3ff4b3b177$exports, "default", () => $a6bc0c3ff4b3b177$export$2e2bcd8739ae039);









const $a6bc0c3ff4b3b177$var$useStyles = (0, $4oW5r$muistylesmakeStyles)((theme)=>({
        "@global": {
            body: {
                backgroundColor: theme.palette.primary.main
            }
        },
        text: {
            textAlign: "center",
            padding: "4px 8px 8px"
        },
        card: {
            minWidth: 300,
            maxWidth: 350,
            marginTop: "6em",
            [theme.breakpoints.down("sm")]: {
                margin: "1em"
            }
        },
        lockIconAvatar: {
            margin: "1em",
            display: "flex",
            justifyContent: "center"
        },
        lockIcon: {
            backgroundColor: theme.palette.grey["500"]
        },
        list: {
            paddingTop: 0,
            paddingBottom: 0
        },
        listItem: {
            paddingTop: 5,
            paddingBottom: 5
        }
    }));
const $a6bc0c3ff4b3b177$var$PodLoginPageView = ({ text: text, customPodProviders: customPodProviders })=>{
    const classes = $a6bc0c3ff4b3b177$var$useStyles();
    const notify = (0, $4oW5r$useNotify)();
    const location = (0, $4oW5r$useLocation)();
    const navigate = (0, $4oW5r$useNavigate)();
    const locale = (0, $4oW5r$useLocale)();
    const translate = (0, $4oW5r$useTranslate)();
    const authProvider = (0, $4oW5r$useAuthProvider)();
    const dataProvider = (0, $4oW5r$useDataProvider)();
    const [podProviders, setPodProviders] = (0, $4oW5r$useState)(customPodProviders || []);
    const searchParams = new URLSearchParams(location.search);
    (0, $4oW5r$useEffect)(()=>{
        (async ()=>{
            if (podProviders.length === 0) {
                const results = await fetch("https://data.activitypods.org/pod-providers", {
                    headers: {
                        Accept: "application/ld+json"
                    }
                });
                if (results.ok) {
                    const json = await results.json();
                    // Filter POD providers by available locales
                    const podProviders = json["ldp:contains"].filter((provider)=>Array.isArray(provider["apods:locales"]) ? provider["apods:locales"].includes(locale) : provider["apods:locales"] === locale);
                    setPodProviders(podProviders);
                } else notify("auth.message.pod_providers_not_loaded", "error");
            }
        })();
    }, [
        podProviders,
        setPodProviders,
        notify,
        locale
    ]);
    (0, $4oW5r$useEffect)(()=>{
        (async ()=>{
            if (searchParams.has("token")) {
                const token = searchParams.get("token");
                const { webId: webId } = (0, $4oW5r$jwtdecode)(token);
                const response = await fetch(webId, {
                    headers: {
                        Accept: "application/json"
                    }
                });
                if (!response.ok) notify("auth.message.unable_to_fetch_user_data", "error");
                else {
                    const data = await response.json();
                    if (!authProvider.checkUser(data)) {
                        notify("auth.message.user_not_allowed_to_login", "error");
                        navigate("/login");
                    } else {
                        localStorage.setItem("token", token);
                        notify("auth.message.user_connected", "info");
                        // Reload to ensure the dataServers config is reset
                        window.location.reload();
                        window.location.href = "/?addUser=true";
                    }
                }
            } else if (searchParams.has("logout")) {
                // Delete token and any other value in local storage
                localStorage.clear();
                notify("auth.message.user_disconnected", "info");
                history.push("/");
            }
        })();
    }, [
        searchParams,
        dataProvider
    ]);
    if (searchParams.has("token") || searchParams.has("addUser") || searchParams.has("logout")) return null;
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Box), {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Card), {
            className: classes.card,
            children: [
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)("div", {
                    className: classes.lockIconAvatar,
                    children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Avatar), {
                        className: classes.lockIcon,
                        children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$muiiconsmaterialLock), {}, void 0, false, {
                            fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPageView.js",
                            lineNumber: 125,
                            columnNumber: 13
                        }, undefined)
                    }, void 0, false, {
                        fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPageView.js",
                        lineNumber: 124,
                        columnNumber: 11
                    }, undefined)
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPageView.js",
                    lineNumber: 123,
                    columnNumber: 9
                }, undefined),
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Box), {
                    pl: 2,
                    pr: 2,
                    children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Typography), {
                        variant: "body2",
                        className: classes.text,
                        children: text || translate("auth.message.choose_pod_provider")
                    }, void 0, false, {
                        fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPageView.js",
                        lineNumber: 129,
                        columnNumber: 11
                    }, undefined)
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPageView.js",
                    lineNumber: 128,
                    columnNumber: 9
                }, undefined),
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Box), {
                    m: 2,
                    children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$List), {
                        className: classes.list,
                        children: podProviders.map((podProvider, i)=>{
                            const url = new URL("/auth", (podProvider["apods:domainName"].includes(":") ? "http://" : "https://") + podProvider["apods:domainName"]);
                            if (searchParams.has("signup")) url.searchParams.set("signup", "true");
                            url.searchParams.set("redirect", window.location.href);
                            return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$react).Fragment, {
                                children: [
                                    /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Divider), {}, void 0, false, {
                                        fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPageView.js",
                                        lineNumber: 145,
                                        columnNumber: 19
                                    }, undefined),
                                    /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ListItem), {
                                        button: true,
                                        onClick: ()=>window.location.href = url.toString(),
                                        className: classes.listItem,
                                        children: [
                                            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ListItemAvatar), {
                                                children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Avatar), {
                                                    children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$muiiconsmaterialStorage), {}, void 0, false, {
                                                        fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPageView.js",
                                                        lineNumber: 154,
                                                        columnNumber: 25
                                                    }, undefined)
                                                }, void 0, false, {
                                                    fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPageView.js",
                                                    lineNumber: 153,
                                                    columnNumber: 23
                                                }, undefined)
                                            }, void 0, false, {
                                                fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPageView.js",
                                                lineNumber: 152,
                                                columnNumber: 21
                                            }, undefined),
                                            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ListItemText), {
                                                primary: podProvider["apods:domainName"],
                                                secondary: podProvider["apods:area"]
                                            }, void 0, false, {
                                                fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPageView.js",
                                                lineNumber: 157,
                                                columnNumber: 21
                                            }, undefined)
                                        ]
                                    }, i, true, {
                                        fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPageView.js",
                                        lineNumber: 146,
                                        columnNumber: 19
                                    }, undefined)
                                ]
                            }, i, true, {
                                fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPageView.js",
                                lineNumber: 144,
                                columnNumber: 17
                            }, undefined);
                        })
                    }, void 0, false, {
                        fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPageView.js",
                        lineNumber: 134,
                        columnNumber: 11
                    }, undefined)
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPageView.js",
                    lineNumber: 133,
                    columnNumber: 9
                }, undefined)
            ]
        }, void 0, true, {
            fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPageView.js",
            lineNumber: 122,
            columnNumber: 7
        }, undefined)
    }, void 0, false, {
        fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPageView.js",
        lineNumber: 121,
        columnNumber: 5
    }, undefined);
};
var $a6bc0c3ff4b3b177$export$2e2bcd8739ae039 = $a6bc0c3ff4b3b177$var$PodLoginPageView;


const $907d5edbccff943e$var$PodLoginPage = (props)=>{
    const muiTheme = (0, $4oW5r$useMemo)(()=>(0, $4oW5r$createTheme)(props.theme), [
        props.theme
    ]);
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$StyledEngineProvider), {
        injectFirst: true,
        children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ThemeProvider), {
            theme: muiTheme,
            children: [
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $a6bc0c3ff4b3b177$exports.default), {
                    ...props
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPage.js",
                    lineNumber: 13,
                    columnNumber: 9
                }, undefined),
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Notification), {}, void 0, false, {
                    fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPage.js",
                    lineNumber: 14,
                    columnNumber: 9
                }, undefined)
            ]
        }, void 0, true, {
            fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPage.js",
            lineNumber: 12,
            columnNumber: 7
        }, undefined)
    }, void 0, false, {
        fileName: "packages/auth-provider/src/components/PodLoginPage/PodLoginPage.js",
        lineNumber: 11,
        columnNumber: 5
    }, undefined);
};
var $907d5edbccff943e$export$2e2bcd8739ae039 = $907d5edbccff943e$var$PodLoginPage;


var $23fea069f5d2d834$exports = {};

$parcel$export($23fea069f5d2d834$exports, "default", () => $23fea069f5d2d834$export$2e2bcd8739ae039);







var $e011da92680cf1fe$exports = {};

$parcel$export($e011da92680cf1fe$exports, "default", () => $e011da92680cf1fe$export$2e2bcd8739ae039);









const $fb967e2c34f56644$var$useSignup = ()=>{
    const authProvider = (0, $4oW5r$useAuthProvider)();
    return (0, $4oW5r$useCallback)((params = {})=>authProvider.signup(params), [
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
 * @typedef {Object} Color
 * @property {number} red
 * @property {number} green
 * @property {number} blue
 */ /** Calculate a rgb-color from a gradient between `color1` and `color2`
 * @param {number} fade - Indicates the fade between `color1` and `color2` in the range [0, 1].
 * @param {Color} color1
 * @param {Color} color2
 * @returns {string} `` `rgb(${red}, ${green}, ${blue})` ``
 */ const $bab067faa4d10954$var$colorGradient = (fade, color1, color2)=>{
    var diffRed = color2.red - color1.red;
    var diffGreen = color2.green - color1.green;
    var diffBlue = color2.blue - color1.blue;
    var gradient = {
        red: Math.floor(color1.red + diffRed * fade),
        green: Math.floor(color1.green + diffGreen * fade),
        blue: Math.floor(color1.blue + diffBlue * fade)
    };
    return "rgb(" + gradient.red + "," + gradient.green + "," + gradient.blue + ")";
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
    const StyledLinearProgress = (0, $4oW5r$withStyles)({
        colorPrimary: {
            backgroundColor: "#e0e0e0"
        },
        barColorPrimary: {
            backgroundColor: currentColor
        }
    })((0, $4oW5r$LinearProgress));
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)(StyledLinearProgress, {
        ...restProps,
        value: 100 * fade,
        variant: "determinate"
    }, void 0, false, {
        fileName: "packages/auth-provider/src/components/LocalLoginPage/ColorGradientProgressBar.js",
        lineNumber: 58,
        columnNumber: 10
    }, this);
}



function $a8046307c9dfa483$export$2e2bcd8739ae039({ scorer: scorer = (0, $646d64648a630b24$export$19dcdb21c6965fb8), password: password, ...restProps }) {
    const strength = scorer.scoreFn(password);
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $bab067faa4d10954$export$2e2bcd8739ae039), {
        currentVal: strength,
        minVal: 0,
        maxVal: scorer.maxScore,
        ...restProps
    }, void 0, false, {
        fileName: "packages/auth-provider/src/components/LocalLoginPage/PasswordStrengthIndicator.js",
        lineNumber: 7,
        columnNumber: 10
    }, this);
}



const $e011da92680cf1fe$var$useStyles = (0, $4oW5r$muistylesmakeStyles)((theme)=>({
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
 */ const $e011da92680cf1fe$var$SignupForm = ({ redirectTo: redirectTo, passwordScorer: passwordScorer = (0, $646d64648a630b24$export$19dcdb21c6965fb8), postSignupRedirect: postSignupRedirect, additionalSignupValues: additionalSignupValues, delayBeforeRedirect: delayBeforeRedirect })=>{
    const [loading, setLoading] = (0, $4oW5r$useSafeSetState)(false);
    const signup = (0, $fb967e2c34f56644$export$2e2bcd8739ae039)();
    const translate = (0, $4oW5r$useTranslate)();
    const notify = (0, $4oW5r$useNotify)();
    const classes = $e011da92680cf1fe$var$useStyles();
    const location = (0, $4oW5r$useLocation)();
    const searchParams = new URLSearchParams(location.search);
    const [locale] = (0, $4oW5r$useLocaleState)();
    const [password, setPassword] = $4oW5r$useState("");
    const submit = (values)=>{
        setLoading(true);
        signup({
            ...values,
            ...additionalSignupValues
        }).then((webId)=>{
            if (delayBeforeRedirect) setTimeout(()=>{
                // Reload to ensure the dataServer config is reset
                window.location.reload();
                window.location.href = postSignupRedirect ? `${postSignupRedirect}?redirect=${encodeURIComponent(redirectTo || "/")}` : redirectTo || "/";
                setLoading(false);
            }, delayBeforeRedirect);
            else {
                // Reload to ensure the dataServer config is reset
                window.location.reload();
                window.location.href = postSignupRedirect ? `${postSignupRedirect}?redirect=${encodeURIComponent(redirectTo || "/")}` : redirectTo || "/";
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
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Form), {
        onSubmit: submit,
        noValidate: true,
        defaultValues: {
            email: searchParams.get("email")
        },
        children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$CardContent), {
            className: classes.content,
            children: [
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$TextInput), {
                    autoFocus: true,
                    source: "username",
                    label: translate("auth.input.username"),
                    autoComplete: "username",
                    fullWidth: true,
                    disabled: loading,
                    validate: (0, $4oW5r$required)(),
                    format: (value)=>value ? (0, $4oW5r$speakingurl)(value, {
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
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/LocalLoginPage/SignupForm.js",
                    lineNumber: 102,
                    columnNumber: 9
                }, undefined),
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$TextInput), {
                    source: "email",
                    label: translate("auth.input.email"),
                    autoComplete: "email",
                    fullWidth: true,
                    disabled: loading || searchParams.has("email") && searchParams.has("force-email"),
                    validate: [
                        (0, $4oW5r$required)(),
                        (0, $4oW5r$email)()
                    ]
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/LocalLoginPage/SignupForm.js",
                    lineNumber: 120,
                    columnNumber: 9
                }, undefined),
                passwordScorer && password && !(searchParams.has("email") && searchParams.has("force-email")) && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Fragment), {
                    children: [
                        /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Typography), {
                            variant: "caption",
                            style: {
                                marginBottom: 3
                            },
                            children: [
                                translate("auth.input.password_strength"),
                                ":",
                                " "
                            ]
                        }, void 0, true, {
                            fileName: "packages/auth-provider/src/components/LocalLoginPage/SignupForm.js",
                            lineNumber: 130,
                            columnNumber: 13
                        }, undefined),
                        /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $a8046307c9dfa483$export$2e2bcd8739ae039), {
                            password: password,
                            scorer: passwordScorer,
                            sx: {
                                width: "100%"
                            }
                        }, void 0, false, {
                            fileName: "packages/auth-provider/src/components/LocalLoginPage/SignupForm.js",
                            lineNumber: 133,
                            columnNumber: 13
                        }, undefined)
                    ]
                }, void 0, true),
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$TextInput), {
                    source: "password",
                    type: "password",
                    value: password,
                    onChange: (e)=>setPassword(e.target.value),
                    label: translate("ra.auth.password"),
                    autoComplete: "new-password",
                    fullWidth: true,
                    disabled: loading || searchParams.has("email") && searchParams.has("force-email"),
                    validate: [
                        (0, $4oW5r$required)(),
                        (0, $7a0bbe6824860dfe$export$2e2bcd8739ae039)(passwordScorer)
                    ]
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/LocalLoginPage/SignupForm.js",
                    lineNumber: 136,
                    columnNumber: 9
                }, undefined),
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Button1), {
                    variant: "contained",
                    type: "submit",
                    color: "primary",
                    disabled: loading,
                    fullWidth: true,
                    className: classes.button,
                    children: loading ? /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$CircularProgress), {
                        className: classes.icon,
                        size: 19,
                        thickness: 3
                    }, void 0, false, {
                        fileName: "packages/auth-provider/src/components/LocalLoginPage/SignupForm.js",
                        lineNumber: 156,
                        columnNumber: 13
                    }, undefined) : translate("auth.action.signup")
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/LocalLoginPage/SignupForm.js",
                    lineNumber: 147,
                    columnNumber: 9
                }, undefined)
            ]
        }, void 0, true, {
            fileName: "packages/auth-provider/src/components/LocalLoginPage/SignupForm.js",
            lineNumber: 101,
            columnNumber: 7
        }, undefined)
    }, void 0, false, {
        fileName: "packages/auth-provider/src/components/LocalLoginPage/SignupForm.js",
        lineNumber: 100,
        columnNumber: 5
    }, undefined);
};
$e011da92680cf1fe$var$SignupForm.defaultValues = {
    redirectTo: "/",
    additionalSignupValues: {}
};
var $e011da92680cf1fe$export$2e2bcd8739ae039 = $e011da92680cf1fe$var$SignupForm;


var $e2a34b2d647a5391$exports = {};

$parcel$export($e2a34b2d647a5391$exports, "default", () => $e2a34b2d647a5391$export$2e2bcd8739ae039);






const $e2a34b2d647a5391$var$useStyles = (0, $4oW5r$muistylesmakeStyles)((theme)=>({
        content: {
            width: 450
        },
        icon: {
            margin: theme.spacing(0.3)
        }
    }));
const $e2a34b2d647a5391$var$LoginForm = ({ redirectTo: redirectTo, allowUsername: allowUsername })=>{
    const [loading, setLoading] = (0, $4oW5r$useSafeSetState)(false);
    const login = (0, $4oW5r$useLogin)();
    const translate = (0, $4oW5r$useTranslate)();
    const notify = (0, $4oW5r$useNotify)();
    const classes = $e2a34b2d647a5391$var$useStyles();
    const location = (0, $4oW5r$useLocation)();
    const searchParams = new URLSearchParams(location.search);
    const submit = (values)=>{
        setLoading(true);
        login(values, redirectTo).then(()=>{
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
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Form), {
        onSubmit: submit,
        noValidate: true,
        defaultValues: {
            email: searchParams.get("email")
        },
        children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$CardContent), {
            className: classes.content,
            children: [
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$TextInput), {
                    source: "username",
                    label: translate(allowUsername ? "auth.input.username_or_email" : "auth.input.email"),
                    autoComplete: "email",
                    fullWidth: true,
                    disabled: loading || searchParams.has("email") && searchParams.has("force-email"),
                    format: (value)=>value ? value.toLowerCase() : "",
                    validate: allowUsername ? [
                        (0, $4oW5r$required)()
                    ] : [
                        (0, $4oW5r$required)(),
                        (0, $4oW5r$email)()
                    ]
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/LocalLoginPage/LoginForm.js",
                    lineNumber: 52,
                    columnNumber: 9
                }, undefined),
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$TextInput), {
                    source: "password",
                    type: "password",
                    label: translate("ra.auth.password"),
                    autoComplete: "current-password",
                    fullWidth: true,
                    disabled: loading || searchParams.has("email") && searchParams.has("force-email"),
                    validate: (0, $4oW5r$required)()
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/LocalLoginPage/LoginForm.js",
                    lineNumber: 61,
                    columnNumber: 9
                }, undefined),
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Button1), {
                    variant: "contained",
                    type: "submit",
                    color: "primary",
                    disabled: loading,
                    fullWidth: true,
                    className: classes.button,
                    children: loading ? /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$CircularProgress), {
                        className: classes.icon,
                        size: 19,
                        thickness: 3
                    }, void 0, false, {
                        fileName: "packages/auth-provider/src/components/LocalLoginPage/LoginForm.js",
                        lineNumber: 79,
                        columnNumber: 13
                    }, undefined) : translate("auth.action.login")
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/LocalLoginPage/LoginForm.js",
                    lineNumber: 70,
                    columnNumber: 9
                }, undefined)
            ]
        }, void 0, true, {
            fileName: "packages/auth-provider/src/components/LocalLoginPage/LoginForm.js",
            lineNumber: 51,
            columnNumber: 7
        }, undefined)
    }, void 0, false, {
        fileName: "packages/auth-provider/src/components/LocalLoginPage/LoginForm.js",
        lineNumber: 50,
        columnNumber: 5
    }, undefined);
};
$e2a34b2d647a5391$var$LoginForm.defaultValues = {
    redirectTo: "/",
    allowUsername: false
};
var $e2a34b2d647a5391$export$2e2bcd8739ae039 = $e2a34b2d647a5391$var$LoginForm;


var $b403c35bd8d76c50$exports = {};

$parcel$export($b403c35bd8d76c50$exports, "default", () => $b403c35bd8d76c50$export$2e2bcd8739ae039);









const $b403c35bd8d76c50$var$useStyles = (0, $4oW5r$muistylesmakeStyles)((theme)=>({
        icon: {
            margin: theme.spacing(0.3)
        }
    }));
/**
 *
 * @param {string} redirectTo
 * @param {Object} passwordScorer Scorer to evaluate and indicate password strength.
 *  Set to `null` or `false`, if you don't want password strength checks. Default is
 *  passwordStrength's `defaultScorer`.
 * @returns
 */ const $b403c35bd8d76c50$var$NewPasswordForm = ({ redirectTo: redirectTo, passwordScorer: passwordScorer = (0, $646d64648a630b24$export$19dcdb21c6965fb8) })=>{
    const location = (0, $4oW5r$useLocation)();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const [loading, setLoading] = (0, $4oW5r$useSafeSetState)(false);
    const authProvider = (0, $4oW5r$useAuthProvider)();
    const translate = (0, $4oW5r$useTranslate)();
    const notify = (0, $4oW5r$useNotify)();
    const classes = $b403c35bd8d76c50$var$useStyles();
    const [newPassword, setNewPassword] = (0, $4oW5r$useState)("");
    const submit = (values)=>{
        setLoading(true);
        authProvider.setNewPassword({
            ...values,
            token: token
        }).then((res)=>{
            setTimeout(()=>{
                window.location.href = `/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`;
                setLoading(false);
            }, 2000);
            notify("auth.notification.password_changed", "info");
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
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Form), {
        onSubmit: submit,
        noValidate: true,
        defaultValues: {
            email: searchParams.get("email")
        },
        children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$CardContent), {
            className: classes.content,
            children: [
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$TextInput), {
                    autoFocus: true,
                    source: "email",
                    label: translate("auth.input.email"),
                    autoComplete: "email",
                    fullWidth: true,
                    disabled: loading,
                    validate: (0, $4oW5r$required)(),
                    format: (value)=>value ? value.toLowerCase() : ""
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/LocalLoginPage/NewPasswordForm.js",
                    lineNumber: 70,
                    columnNumber: 9
                }, undefined),
                passwordScorer && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Fragment), {
                    children: [
                        /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Typography), {
                            variant: "caption",
                            style: {
                                marginBottom: 3
                            },
                            children: [
                                translate("auth.input.password_strength"),
                                ":",
                                " "
                            ]
                        }, void 0, true, {
                            fileName: "packages/auth-provider/src/components/LocalLoginPage/NewPasswordForm.js",
                            lineNumber: 82,
                            columnNumber: 13
                        }, undefined),
                        /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $a8046307c9dfa483$export$2e2bcd8739ae039), {
                            password: newPassword,
                            scorer: passwordScorer,
                            sx: {
                                width: "100%"
                            }
                        }, void 0, false, {
                            fileName: "packages/auth-provider/src/components/LocalLoginPage/NewPasswordForm.js",
                            lineNumber: 86,
                            columnNumber: 13
                        }, undefined)
                    ]
                }, void 0, true),
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$TextInput), {
                    autoFocus: true,
                    type: "password",
                    source: "password",
                    value: newPassword,
                    label: translate("auth.input.new_password"),
                    autoComplete: "current-password",
                    fullWidth: true,
                    disabled: loading,
                    validate: [
                        (0, $4oW5r$required)(),
                        (0, $7a0bbe6824860dfe$export$2e2bcd8739ae039)(passwordScorer)
                    ],
                    onChange: (e)=>setNewPassword(e.target.value),
                    format: (value)=>value ? value.toLowerCase() : ""
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/LocalLoginPage/NewPasswordForm.js",
                    lineNumber: 89,
                    columnNumber: 9
                }, undefined),
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$TextInput), {
                    autoFocus: true,
                    type: "password",
                    source: "confirm-password",
                    label: translate("auth.input.confirm_new_password"),
                    autoComplete: "current-password",
                    fullWidth: true,
                    disabled: loading,
                    validate: (0, $4oW5r$required)(),
                    format: (value)=>value ? value.toLowerCase() : ""
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/LocalLoginPage/NewPasswordForm.js",
                    lineNumber: 102,
                    columnNumber: 9
                }, undefined),
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Button1), {
                    variant: "contained",
                    type: "submit",
                    color: "primary",
                    disabled: loading,
                    fullWidth: true,
                    className: classes.button,
                    children: loading ? /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$CircularProgress), {
                        className: classes.icon,
                        size: 19,
                        thickness: 3
                    }, void 0, false, {
                        fileName: "packages/auth-provider/src/components/LocalLoginPage/NewPasswordForm.js",
                        lineNumber: 122,
                        columnNumber: 13
                    }, undefined) : translate("auth.action.set_new_password")
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/LocalLoginPage/NewPasswordForm.js",
                    lineNumber: 113,
                    columnNumber: 9
                }, undefined)
            ]
        }, void 0, true, {
            fileName: "packages/auth-provider/src/components/LocalLoginPage/NewPasswordForm.js",
            lineNumber: 69,
            columnNumber: 7
        }, undefined)
    }, void 0, false, {
        fileName: "packages/auth-provider/src/components/LocalLoginPage/NewPasswordForm.js",
        lineNumber: 68,
        columnNumber: 5
    }, undefined);
};
var $b403c35bd8d76c50$export$2e2bcd8739ae039 = $b403c35bd8d76c50$var$NewPasswordForm;


var $8d415f03f06df877$exports = {};

$parcel$export($8d415f03f06df877$exports, "default", () => $8d415f03f06df877$export$2e2bcd8739ae039);





const $8d415f03f06df877$var$useStyles = (0, $4oW5r$muistylesmakeStyles)((theme)=>({
        icon: {
            margin: theme.spacing(0.3)
        }
    }));
const $8d415f03f06df877$var$ResetPasswordForm = ()=>{
    const [loading, setLoading] = (0, $4oW5r$useSafeSetState)(false);
    const authProvider = (0, $4oW5r$useAuthProvider)();
    const translate = (0, $4oW5r$useTranslate)();
    const notify = (0, $4oW5r$useNotify)();
    const classes = $8d415f03f06df877$var$useStyles();
    const submit = (values)=>{
        setLoading(true);
        authProvider.resetPassword({
            ...values
        }).then((res)=>{
            setLoading(false);
            notify("auth.notification.reset_password_submitted", "info");
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
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Form), {
        onSubmit: submit,
        children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$CardContent), {
            className: classes.content,
            children: [
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$TextInput), {
                    autoFocus: true,
                    source: "email",
                    label: translate("auth.input.email"),
                    autoComplete: "email",
                    fullWidth: true,
                    disabled: loading,
                    validate: (0, $4oW5r$required)(),
                    format: (value)=>value ? value.toLowerCase() : ""
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/LocalLoginPage/ResetPasswordForm.js",
                    lineNumber: 48,
                    columnNumber: 9
                }, undefined),
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Button1), {
                    variant: "contained",
                    type: "submit",
                    color: "primary",
                    disabled: loading,
                    fullWidth: true,
                    className: classes.button,
                    children: loading ? /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$CircularProgress), {
                        className: classes.icon,
                        size: 19,
                        thickness: 3
                    }, void 0, false, {
                        fileName: "packages/auth-provider/src/components/LocalLoginPage/ResetPasswordForm.js",
                        lineNumber: 67,
                        columnNumber: 13
                    }, undefined) : translate("auth.action.reset_password")
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/LocalLoginPage/ResetPasswordForm.js",
                    lineNumber: 58,
                    columnNumber: 9
                }, undefined)
            ]
        }, void 0, true, {
            fileName: "packages/auth-provider/src/components/LocalLoginPage/ResetPasswordForm.js",
            lineNumber: 47,
            columnNumber: 7
        }, undefined)
    }, void 0, false, {
        fileName: "packages/auth-provider/src/components/LocalLoginPage/ResetPasswordForm.js",
        lineNumber: 46,
        columnNumber: 5
    }, undefined);
};
var $8d415f03f06df877$export$2e2bcd8739ae039 = $8d415f03f06df877$var$ResetPasswordForm;


var $1b78e27e3e92a798$exports = {};

$parcel$export($1b78e27e3e92a798$exports, "default", () => $1b78e27e3e92a798$export$2e2bcd8739ae039);





const $1b78e27e3e92a798$var$useStyles = (0, $4oW5r$muistylesmakeStyles)((theme)=>({
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
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Box), {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        className: classes.root,
        children: [
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Card), {
                className: classes.card,
                children: [
                    /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Box), {
                        p: 2,
                        display: "flex",
                        justifyContent: "start",
                        children: [
                            icon && /*#__PURE__*/ (0, $4oW5r$react).cloneElement(icon, {
                                fontSize: "large",
                                className: classes.icon
                            }),
                            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Typography), {
                                variant: "h4",
                                className: classes.title,
                                children: title
                            }, void 0, false, {
                                fileName: "packages/auth-provider/src/components/LocalLoginPage/SimpleBox.js",
                                lineNumber: 42,
                                columnNumber: 11
                            }, undefined)
                        ]
                    }, void 0, true, {
                        fileName: "packages/auth-provider/src/components/LocalLoginPage/SimpleBox.js",
                        lineNumber: 40,
                        columnNumber: 9
                    }, undefined),
                    /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Box), {
                        pl: 2,
                        pr: 2,
                        children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Typography), {
                            variant: "body1",
                            children: text
                        }, void 0, false, {
                            fileName: "packages/auth-provider/src/components/LocalLoginPage/SimpleBox.js",
                            lineNumber: 47,
                            columnNumber: 11
                        }, undefined)
                    }, void 0, false, {
                        fileName: "packages/auth-provider/src/components/LocalLoginPage/SimpleBox.js",
                        lineNumber: 46,
                        columnNumber: 9
                    }, undefined),
                    children
                ]
            }, void 0, true, {
                fileName: "packages/auth-provider/src/components/LocalLoginPage/SimpleBox.js",
                lineNumber: 39,
                columnNumber: 7
            }, undefined),
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Notification), {}, void 0, false, {
                fileName: "packages/auth-provider/src/components/LocalLoginPage/SimpleBox.js",
                lineNumber: 51,
                columnNumber: 7
            }, undefined)
        ]
    }, void 0, true, {
        fileName: "packages/auth-provider/src/components/LocalLoginPage/SimpleBox.js",
        lineNumber: 38,
        columnNumber: 5
    }, undefined);
};
var $1b78e27e3e92a798$export$2e2bcd8739ae039 = $1b78e27e3e92a798$var$SimpleBox;



const $23fea069f5d2d834$var$useStyles = (0, $4oW5r$muistylesmakeStyles)(()=>({
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
    const navigate = (0, $4oW5r$useNavigate)();
    const translate = (0, $4oW5r$useTranslate)();
    const [searchParams] = (0, $4oW5r$useSearchParams)();
    const isSignup = hasSignup && searchParams.has("signup");
    const isResetPassword = searchParams.has("reset_password");
    const isNewPassword = searchParams.has("new_password");
    const isLogin = !isSignup && !isResetPassword && !isNewPassword;
    const redirectTo = searchParams.get("redirect");
    const { identity: identity, isLoading: isLoading } = (0, $4oW5r$useGetIdentity)();
    (0, $4oW5r$useEffect)(()=>{
        if (!isLoading && identity?.id) {
            if (postLoginRedirect) navigate(`${postLoginRedirect}?redirect=${encodeURIComponent(redirectTo || "/")}`);
            else if (redirectTo && redirectTo.startsWith("http")) window.location.href = redirectTo;
            else navigate(redirectTo || "/");
        }
    }, [
        identity,
        isLoading,
        navigate,
        redirectTo,
        postLoginRedirect
    ]);
    const [title, text] = (0, $4oW5r$useMemo)(()=>{
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
    if (isLoading || identity?.id) return null;
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $1b78e27e3e92a798$exports.default), {
        title: translate(title),
        text: translate(text),
        icon: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$muiiconsmaterialLock), {}, void 0, false, void 0, void 0),
        children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Card), {
            children: [
                isSignup && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $e011da92680cf1fe$exports.default), {
                    redirectTo: redirectTo,
                    delayBeforeRedirect: 4000,
                    postSignupRedirect: postSignupRedirect,
                    additionalSignupValues: additionalSignupValues,
                    passwordScorer: passwordScorer
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/LocalLoginPage/LocalLoginPage.js",
                    lineNumber: 88,
                    columnNumber: 11
                }, undefined),
                isResetPassword && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $8d415f03f06df877$exports.default), {}, void 0, false, {
                    fileName: "packages/auth-provider/src/components/LocalLoginPage/LocalLoginPage.js",
                    lineNumber: 96,
                    columnNumber: 29
                }, undefined),
                isNewPassword && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $b403c35bd8d76c50$exports.default), {
                    redirectTo: redirectTo,
                    passwordScorer: passwordScorer
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/LocalLoginPage/LocalLoginPage.js",
                    lineNumber: 97,
                    columnNumber: 27
                }, undefined),
                isLogin && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $e2a34b2d647a5391$exports.default), {
                    redirectTo: redirectTo,
                    allowUsername: allowUsername
                }, void 0, false, {
                    fileName: "packages/auth-provider/src/components/LocalLoginPage/LocalLoginPage.js",
                    lineNumber: 98,
                    columnNumber: 21
                }, undefined),
                /*#__PURE__*/ (0, $4oW5r$jsxDEV)("div", {
                    className: classes.switch,
                    children: [
                        isSignup && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Link), {
                            to: "/login",
                            children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Typography), {
                                variant: "body2",
                                children: translate("auth.action.login")
                            }, void 0, false, {
                                fileName: "packages/auth-provider/src/components/LocalLoginPage/LocalLoginPage.js",
                                lineNumber: 102,
                                columnNumber: 15
                            }, undefined)
                        }, void 0, false, {
                            fileName: "packages/auth-provider/src/components/LocalLoginPage/LocalLoginPage.js",
                            lineNumber: 101,
                            columnNumber: 13
                        }, undefined),
                        isLogin && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Fragment), {
                            children: [
                                hasSignup && /*#__PURE__*/ (0, $4oW5r$jsxDEV)("div", {
                                    children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Link), {
                                        to: "/login?signup=true",
                                        children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Typography), {
                                            variant: "body2",
                                            children: translate("auth.action.signup")
                                        }, void 0, false, {
                                            fileName: "packages/auth-provider/src/components/LocalLoginPage/LocalLoginPage.js",
                                            lineNumber: 110,
                                            columnNumber: 21
                                        }, undefined)
                                    }, void 0, false, {
                                        fileName: "packages/auth-provider/src/components/LocalLoginPage/LocalLoginPage.js",
                                        lineNumber: 109,
                                        columnNumber: 19
                                    }, undefined)
                                }, void 0, false, {
                                    fileName: "packages/auth-provider/src/components/LocalLoginPage/LocalLoginPage.js",
                                    lineNumber: 108,
                                    columnNumber: 17
                                }, undefined),
                                /*#__PURE__*/ (0, $4oW5r$jsxDEV)("div", {
                                    children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Link), {
                                        to: `/login?reset_password=true&${searchParams.toString()}`,
                                        children: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Typography), {
                                            variant: "body2",
                                            children: translate("auth.action.reset_password")
                                        }, void 0, false, {
                                            fileName: "packages/auth-provider/src/components/LocalLoginPage/LocalLoginPage.js",
                                            lineNumber: 116,
                                            columnNumber: 19
                                        }, undefined)
                                    }, void 0, false, {
                                        fileName: "packages/auth-provider/src/components/LocalLoginPage/LocalLoginPage.js",
                                        lineNumber: 115,
                                        columnNumber: 17
                                    }, undefined)
                                }, void 0, false, {
                                    fileName: "packages/auth-provider/src/components/LocalLoginPage/LocalLoginPage.js",
                                    lineNumber: 114,
                                    columnNumber: 15
                                }, undefined)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "packages/auth-provider/src/components/LocalLoginPage/LocalLoginPage.js",
                    lineNumber: 99,
                    columnNumber: 9
                }, undefined)
            ]
        }, void 0, true, {
            fileName: "packages/auth-provider/src/components/LocalLoginPage/LocalLoginPage.js",
            lineNumber: 86,
            columnNumber: 7
        }, undefined)
    }, void 0, false, {
        fileName: "packages/auth-provider/src/components/LocalLoginPage/LocalLoginPage.js",
        lineNumber: 85,
        columnNumber: 5
    }, undefined);
};
$23fea069f5d2d834$var$LocalLoginPage.defaultProps = {
    hasSignup: true,
    allowUsername: false,
    additionalSignupValues: {}
};
var $23fea069f5d2d834$export$2e2bcd8739ae039 = $23fea069f5d2d834$var$LocalLoginPage;


var $9594dfbc217337d0$exports = {};

$parcel$export($9594dfbc217337d0$exports, "default", () => $9594dfbc217337d0$export$2e2bcd8739ae039);





// Not used for now. The ListWithPermissions component will handle the conditional display of the Create button.
const $9594dfbc217337d0$var$ResourceWithPermission = ({ name: name, create: create, ...rest })=>{
    const createContainer = (0, $4oW5r$useCreateContainer)(name);
    const { permissions: permissions } = (0, $4oW5r$usePermissions)(createContainer);
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Resource), {
        ...rest,
        name: name,
        create: permissions && permissions.some((p)=>(0, $3ecc2efd72c45a68$export$65615a101bd6f5ca).includes(p["acl:mode"])) ? create : undefined
    }, void 0, false, {
        fileName: "packages/auth-provider/src/components/ResourceWithPermissions.js",
        lineNumber: 11,
        columnNumber: 5
    }, undefined);
};
var $9594dfbc217337d0$export$2e2bcd8739ae039 = $9594dfbc217337d0$var$ResourceWithPermission;


var $5ef2eaf62f09ff2c$exports = {};

$parcel$export($5ef2eaf62f09ff2c$exports, "default", () => $5ef2eaf62f09ff2c$export$2e2bcd8739ae039);







// It's important to pass the ref to allow Material UI to manage the keyboard navigation
const $5ef2eaf62f09ff2c$var$UserMenuItem = /*#__PURE__*/ (0, $4oW5r$forwardRef)(({ label: label, icon: icon, to: to, ...rest }, ref)=>{
    const { onClose: onClose } = (0, $4oW5r$useUserMenu)();
    const translate = (0, $4oW5r$useTranslate)();
    const navigate = (0, $4oW5r$useNavigate)();
    const onClick = (0, $4oW5r$useCallback)(()=>{
        navigate(to);
        onClose();
    }, [
        to,
        onClose,
        navigate
    ]);
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$MenuItem), {
        onClick: onClick,
        ref: ref,
        ...rest,
        children: [
            icon && /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ListItemIcon), {
                children: /*#__PURE__*/ (0, $4oW5r$react).cloneElement(icon, {
                    fontSize: "small"
                })
            }, void 0, false, {
                fileName: "packages/auth-provider/src/components/UserMenu.js",
                lineNumber: 24,
                columnNumber: 16
            }, undefined),
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$ListItemText), {
                children: translate(label)
            }, void 0, false, {
                fileName: "packages/auth-provider/src/components/UserMenu.js",
                lineNumber: 25,
                columnNumber: 7
            }, undefined)
        ]
    }, void 0, true, {
        fileName: "packages/auth-provider/src/components/UserMenu.js",
        lineNumber: 18,
        columnNumber: 5
    }, undefined);
});
const $5ef2eaf62f09ff2c$var$UserMenu = ({ logout: logout, profileResource: profileResource, ...otherProps })=>{
    const { identity: identity } = (0, $4oW5r$useGetIdentity)();
    return /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$UserMenu), {
        ...otherProps,
        children: identity && identity.id !== "" ? [
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)($5ef2eaf62f09ff2c$var$UserMenuItem, {
                label: "auth.action.view_my_profile",
                icon: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$muiiconsmaterialAccountCircle), {}, void 0, false, void 0, void 0),
                to: `/${profileResource}/${encodeURIComponent(identity?.profileData?.id || identity.id)}/show`
            }, "view", false, {
                fileName: "packages/auth-provider/src/components/UserMenu.js",
                lineNumber: 36,
                columnNumber: 13
            }, undefined),
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)($5ef2eaf62f09ff2c$var$UserMenuItem, {
                label: "auth.action.edit_my_profile",
                icon: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$muiiconsmaterialEdit), {}, void 0, false, void 0, void 0),
                to: `/${profileResource}/${encodeURIComponent(identity?.profileData?.id || identity.id)}`
            }, "edit", false, {
                fileName: "packages/auth-provider/src/components/UserMenu.js",
                lineNumber: 42,
                columnNumber: 13
            }, undefined),
            /*#__PURE__*/ (0, $4oW5r$react).cloneElement(logout, {
                key: "logout"
            })
        ] : [
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)($5ef2eaf62f09ff2c$var$UserMenuItem, {
                label: "auth.action.signup",
                to: "/login?signup=true"
            }, "signup", false, {
                fileName: "packages/auth-provider/src/components/UserMenu.js",
                lineNumber: 51,
                columnNumber: 13
            }, undefined),
            /*#__PURE__*/ (0, $4oW5r$jsxDEV)($5ef2eaf62f09ff2c$var$UserMenuItem, {
                label: "auth.action.login",
                to: "/login"
            }, "login", false, {
                fileName: "packages/auth-provider/src/components/UserMenu.js",
                lineNumber: 52,
                columnNumber: 13
            }, undefined)
        ]
    }, void 0, false, {
        fileName: "packages/auth-provider/src/components/UserMenu.js",
        lineNumber: 33,
        columnNumber: 5
    }, undefined);
};
$5ef2eaf62f09ff2c$var$UserMenu.defaultProps = {
    logout: /*#__PURE__*/ (0, $4oW5r$jsxDEV)((0, $4oW5r$Logout), {}, void 0, false, {
        fileName: "packages/auth-provider/src/components/UserMenu.js",
        lineNumber: 59,
        columnNumber: 11
    }, undefined),
    profileResource: "Person"
};
var $5ef2eaf62f09ff2c$export$2e2bcd8739ae039 = $5ef2eaf62f09ff2c$var$UserMenu;






const $a18ea4963428dd85$var$useCheckAuthenticated = (message)=>{
    const { identity: identity, isLoading: isLoading } = (0, $4oW5r$useGetIdentity)();
    const notify = (0, $4oW5r$useNotify)();
    const redirect = (0, $4oW5r$useRedirect)();
    const location = (0, $4oW5r$useLocation)();
    (0, $4oW5r$useEffect)(()=>{
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
    const [state, setState] = (0, $4oW5r$useSafeSetState)({
        permissions: $26b16c415d19fb4a$var$alreadyFetchedPermissions[key]
    });
    const getPermissions = (0, $4oW5r$useGetPermissions)();
    const fetchPermissions = (0, $4oW5r$useCallback)(()=>getPermissions(params).then((permissions)=>{
            if (!(0, $4oW5r$lodashisEqual)(permissions, state.permissions)) {
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
    (0, $4oW5r$useEffect)(()=>{
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




export {$1d8606895ce3b768$export$2e2bcd8739ae039 as authProvider, $f2c5683e04dee28c$export$2e2bcd8739ae039 as CreateWithPermissions, $28fa6ad821327921$export$2e2bcd8739ae039 as EditWithPermissions, $62be5dcee9954341$export$2e2bcd8739ae039 as EditActionsWithPermissions, $701198930c0b0c72$export$2e2bcd8739ae039 as EditToolbarWithPermissions, $c78c2d7e17f60b2f$export$2e2bcd8739ae039 as EditButtonWithPermissions, $7efdcbe4be05bfd5$export$2e2bcd8739ae039 as DeleteButtonWithPermissions, $a4ded8260cc90dad$export$2e2bcd8739ae039 as ListWithPermissions, $e6071424a1ba88d9$export$2e2bcd8739ae039 as ListActionsWithPermissions, $561bb436d5af917c$export$2e2bcd8739ae039 as ShowWithPermissions, $d1f54fc03225e8ee$export$2e2bcd8739ae039 as ShowActionsWithPermissions, $7dac2771cc5eb38b$export$2e2bcd8739ae039 as PermissionsButton, $c2eef7602bbbff5e$export$2e2bcd8739ae039 as AuthDialog, $479961b7e298304b$export$2e2bcd8739ae039 as SsoLoginPage, $479961b7e298304b$export$2e2bcd8739ae039 as LoginPage, $907d5edbccff943e$export$2e2bcd8739ae039 as PodLoginPage, $23fea069f5d2d834$export$2e2bcd8739ae039 as LocalLoginPage, $9594dfbc217337d0$export$2e2bcd8739ae039 as ResourceWithPermissions, $5ef2eaf62f09ff2c$export$2e2bcd8739ae039 as UserMenu, $7ad577d9c9c71db0$export$2e2bcd8739ae039 as useAgents, $a18ea4963428dd85$export$2e2bcd8739ae039 as useCheckAuthenticated, $abd69a52484f41d9$export$2e2bcd8739ae039 as useCheckPermissions, $26b16c415d19fb4a$export$2e2bcd8739ae039 as usePermissionsWithRefetch, $fb967e2c34f56644$export$2e2bcd8739ae039 as useSignup, $a8046307c9dfa483$export$2e2bcd8739ae039 as PasswordStrengthIndicator, $7a0bbe6824860dfe$export$2e2bcd8739ae039 as validatePasswordStrength, $646d64648a630b24$export$19dcdb21c6965fb8 as defaultPasswordScorer, $646d64648a630b24$export$ba43bf67f3d48107 as defaultPasswordScorerOptions, $646d64648a630b24$export$a1d713a9155d58fc as createPasswordScorer, $22afd1c81635c9d9$export$2e2bcd8739ae039 as englishMessages, $509b6323d7902699$export$2e2bcd8739ae039 as frenchMessages};
//# sourceMappingURL=index.es.js.map
