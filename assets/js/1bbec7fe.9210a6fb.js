"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1028],{3905:function(e,t,r){r.d(t,{Zo:function(){return c},kt:function(){return d}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=n.createContext({}),l=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=l(e.components);return n.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),m=l(r),d=a,g=m["".concat(u,".").concat(d)]||m[d]||p[d]||o;return r?n.createElement(g,i(i({ref:t},c),{},{components:r})):n.createElement(g,i({ref:t},c))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=m;var s={};for(var u in t)hasOwnProperty.call(t,u)&&(s[u]=t[u]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var l=2;l<o;l++)i[l]=r[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},9756:function(e,t,r){r.r(t),r.d(t,{assets:function(){return c},contentTitle:function(){return u},default:function(){return d},frontMatter:function(){return s},metadata:function(){return l},toc:function(){return p}});var n=r(3117),a=r(102),o=(r(7294),r(3905)),i=["components"],s={title:"GroupsManagerBot"},u=void 0,l={unversionedId:"middleware/webacl/groups-manager",id:"middleware/webacl/groups-manager",title:"GroupsManagerBot",description:"Automatically add users to WebACL-compatible groups depending on matching rules.",source:"@site/docs/middleware/webacl/groups-manager.md",sourceDirName:"middleware/webacl",slug:"/middleware/webacl/groups-manager",permalink:"/docs/middleware/webacl/groups-manager",draft:!1,editUrl:"https://github.com/assemblee-virtuelle/semapps/edit/master/website/docs/middleware/webacl/groups-manager.md",tags:[],version:"current",frontMatter:{title:"GroupsManagerBot"},sidebar:"middleware",previous:{title:"AuthorizerBot",permalink:"/docs/middleware/webacl/authorizer"},next:{title:"Webfinger",permalink:"/docs/middleware/webfinger"}},c={},p=[{value:"Usage",id:"usage",level:2}],m={toc:p};function d(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Automatically add users to WebACL-compatible groups depending on matching rules."),(0,o.kt)("p",null,"This bot will listen to users creation/update/removal and add them to the given groups depending on matching rules."),(0,o.kt)("admonition",{type:"warning"},(0,o.kt)("p",{parentName:"admonition"},"Currently this does not work with PATCH operations since the whole record is needed.")),(0,o.kt)("h2",{id:"usage"},"Usage"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"const { GroupsManagerBot } = require('@semapps/webacl');\n\nmodule.exports = {\n  mixins: [GroupsManagerBot],\n  settings: {\n    usersContainer: 'http://localhost:3000/users',\n    rules: [\n      {\n        // Use an object to match users\n        // If several properties are passed, users will need to match all of them\n        match: { status: 'http://localhost:3000/status/admin' },\n        groupSlug: 'superadmins'\n      },\n      {\n        // Use a function to match users\n        match: userData => userData.email.endsWith('gmail.com'),\n        groupSlug: 'gmailusers'\n      }\n    ]\n  }\n};\n")))}d.isMDXComponent=!0}}]);