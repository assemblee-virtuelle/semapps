"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9574],{3905:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return d}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),m=c(r),d=o,f=m["".concat(s,".").concat(d)]||m[d]||u[d]||i;return r?n.createElement(f,a(a({ref:t},p),{},{components:r})):n.createElement(f,a({ref:t},p))}));function d(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,a[1]=l;for(var c=2;c<i;c++)a[c]=r[c];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},967:function(e,t,r){r.r(t),r.d(t,{assets:function(){return p},contentTitle:function(){return s},default:function(){return d},frontMatter:function(){return l},metadata:function(){return c},toc:function(){return u}});var n=r(3117),o=r(102),i=(r(7294),r(3905)),a=["components"],l={title:"Mobilizon"},s=void 0,c={unversionedId:"middleware/importer/mobilizon",id:"middleware/importer/mobilizon",title:"Mobilizon",description:"This mixin allows you to import events from Mobilizon API.",source:"@site/docs/middleware/importer/mobilizon.md",sourceDirName:"middleware/importer",slug:"/middleware/importer/mobilizon",permalink:"/docs/middleware/importer/mobilizon",draft:!1,editUrl:"https://github.com/assemblee-virtuelle/semapps/edit/master/website/docs/middleware/importer/mobilizon.md",tags:[],version:"current",frontMatter:{title:"Mobilizon"},sidebar:"middleware",previous:{title:"Jotform",permalink:"/docs/middleware/importer/jotform"},next:{title:"PrestaShop",permalink:"/docs/middleware/importer/prestashop"}},p={},u=[{value:"Usage",id:"usage",level:2}],m={toc:u};function d(e){var t=e.components,r=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"This mixin allows you to import events from ",(0,i.kt)("a",{parentName:"p",href:"https://prestashop.com"},"Mobilizon")," API."),(0,i.kt)("h2",{id:"usage"},"Usage"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"const { MobilizonImporterMixin } = require('@semapps/importer');\n\nmodule.exports = {\n  name: 'my-importer',\n  mixins: [MobilizonImporterMixin],\n  settings: {\n    source: {\n      mobilizon: {\n        baseUrl: null, // Base URL of the Mobilizon instance\n        type: 'events', // Currently only events can be imported\n      },\n      // ... see ImporterMixin settings for other source config available\n    },\n    dest: {\n      containerUri: null, // Container where the data will be posted (must be created already)\n      predicatesToKeep: [], // Don't remove these predicates when updating data\n    },\n    activitypub: {\n      actorUri: null, // ActivityPub actor who will post activities on synchronization (leave null to disable this)\n      activities: ['Create', 'Update', 'Delete'] // The activities you want to be posted by the actor\n    },\n    cronJob: {\n      time: null, // '0 0 4 * * *' for every night at 4am \n      timeZone: 'Europe/Paris'\n    }\n  },\n  methods: {\n    transform(data) {\n      return({\n        ...data\n      });\n    }\n  }\n};\n")))}d.isMDXComponent=!0}}]);