"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1530],{3905:function(e,r,t){t.d(r,{Zo:function(){return l},kt:function(){return m}});var n=t(7294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?a(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function c(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=n.createContext({}),u=function(e){var r=n.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},l=function(e){var r=u(e.components);return n.createElement(s.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),d=u(t),m=o,f=d["".concat(s,".").concat(m)]||d[m]||p[m]||a;return t?n.createElement(f,i(i({ref:r},l),{},{components:t})):n.createElement(f,i({ref:r},l))}));function m(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=d;var c={};for(var s in r)hasOwnProperty.call(r,s)&&(c[s]=r[s]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var u=2;u<a;u++)i[u]=t[u];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},2031:function(e,r,t){t.r(r),t.d(r,{assets:function(){return l},contentTitle:function(){return s},default:function(){return m},frontMatter:function(){return c},metadata:function(){return u},toc:function(){return p}});var n=t(3117),o=t(102),a=(t(7294),t(3905)),i=["components"],c={title:"AuthorizerBot"},s=void 0,u={unversionedId:"middleware/webacl/authorizer",id:"middleware/webacl/authorizer",title:"AuthorizerBot",description:"Automatically give permissions to users, based on the record being created or updated.",source:"@site/docs/middleware/webacl/authorizer.md",sourceDirName:"middleware/webacl",slug:"/middleware/webacl/authorizer",permalink:"/docs/middleware/webacl/authorizer",draft:!1,editUrl:"https://github.com/assemblee-virtuelle/semapps/edit/master/website/docs/middleware/webacl/authorizer.md",tags:[],version:"current",frontMatter:{title:"AuthorizerBot"},sidebar:"middleware",previous:{title:"WebAclGroupService",permalink:"/docs/middleware/webacl/group"},next:{title:"GroupsManagerBot",permalink:"/docs/middleware/webacl/groups-manager"}},l={},p=[{value:"Usage",id:"usage",level:2}],d={toc:p};function m(e){var r=e.components,t=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,n.Z)({},d,t,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Automatically give permissions to users, based on the record being created or updated."),(0,a.kt)("admonition",{type:"warning"},(0,a.kt)("p",{parentName:"admonition"},"Currently this does not work with PATCH operations since the whole record is needed.")),(0,a.kt)("h2",{id:"usage"},"Usage"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"const { AuthorizerBot } = require('@semapps/webacl');\n\nmodule.exports = {\n  mixins: [AuthorizerBot],\n  settings: {\n    rules: [\n      {\n        // If the resource match...\n        match: { type: 'pair:Event' },\n        // ... give these permissions...\n        rights: {\n          read: true,\n          append: true,\n          write: true,\n          control: true\n        },\n        // ... to these users ...\n        users: record => record['pair:involvedIn']\n      },\n      {\n        // Use a function to match resources\n        match: record => record['pair:hasStatus'] === 'http://localhost:3000/status/special',\n        rights: {\n          read: true,\n          write: true\n        },\n        // Use a string for the users\n        users: 'http://localhost:3000/users/special-user'\n      }\n    ]\n  }\n};\n")))}m.isMDXComponent=!0}}]);