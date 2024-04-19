"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[735],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return m}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),u=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},s=function(e){var t=u(e.components);return r.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,p=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),d=u(n),m=a,h=d["".concat(p,".").concat(m)]||d[m]||c[m]||i;return n?r.createElement(h,o(o({ref:t},s),{},{components:n})):r.createElement(h,o({ref:t},s))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=d;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var u=2;u<i;u++)o[u]=n[u];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},1705:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return p},default:function(){return m},frontMatter:function(){return l},metadata:function(){return u},toc:function(){return c}});var r=n(3117),a=n(102),i=(n(7294),n(3905)),o=["components"],l={title:"Drupal"},p=void 0,u={unversionedId:"middleware/importer/drupal",id:"middleware/importer/drupal",title:"Drupal",description:"This mixin allows you to import JSON data from Drupal websites. Currently, only the version 7 is supported.",source:"@site/docs/middleware/importer/drupal.md",sourceDirName:"middleware/importer",slug:"/middleware/importer/drupal",permalink:"/docs/middleware/importer/drupal",draft:!1,editUrl:"https://github.com/assemblee-virtuelle/semapps/edit/master/website/docs/middleware/importer/drupal.md",tags:[],version:"current",frontMatter:{title:"Drupal"},sidebar:"middleware",previous:{title:"Discourse",permalink:"/docs/middleware/importer/discourse"},next:{title:"GoGoCarto",permalink:"/docs/middleware/importer/gogocarto"}},s={},c=[{value:"Usage",id:"usage",level:2},{value:"Setup your API endpoints",id:"setup-your-api-endpoints",level:3},{value:"Compact API endpoint",id:"compact-api-endpoint",level:4},{value:"Full API endpoint",id:"full-api-endpoint",level:4},{value:"Create your service",id:"create-your-service",level:3},{value:"Bypassing Drupal cache",id:"bypassing-drupal-cache",level:3}],d={toc:c};function m(e){var t=e.components,n=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"This mixin allows you to import JSON data from ",(0,i.kt)("a",{parentName:"p",href:"https://www.drupal.org/drupal-7.0"},"Drupal")," websites. Currently, only the version 7 is supported."),(0,i.kt)("h2",{id:"usage"},"Usage"),(0,i.kt)("h3",{id:"setup-your-api-endpoints"},"Setup your API endpoints"),(0,i.kt)("p",null,"First install the ",(0,i.kt)("a",{parentName:"p",href:"https://www.drupal.org/project/views_datasource"},"Views Datasource")," module and activate the ",(0,i.kt)("inlineCode",{parentName:"p"},"views_json")," module."),(0,i.kt)("p",null,"For each resource, you will need to configure two API endpoints:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"A compact API endpoint with only the UUID and the last modification date"),(0,i.kt)("li",{parentName:"ul"},"A full API endpoint with all the information you want to import")),(0,i.kt)("p",null,"The compact API endpoint help to increase the performances since the importer is able to quickly identify the nodes that have been created, deleted or updated. The full API endpoint allow to fetch only a selected node."),(0,i.kt)("h4",{id:"compact-api-endpoint"},"Compact API endpoint"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Create a new View",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},'Under "Display", select the type of content you wish to import'),(0,i.kt)("li",{parentName:"ul"},'In the Page configuration, select "JSON data document"'),(0,i.kt)("li",{parentName:"ul"},"Remove the pagination"),(0,i.kt)("li",{parentName:"ul"},"Fill out the other necessary fields, including the path (for example ",(0,i.kt)("inlineCode",{parentName:"li"},"/api/articles_compact"),")"))),(0,i.kt)("li",{parentName:"ul"},"Add the following fields:",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"uuid")," with the UUID of the resource"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"updated")," with the last modification date of the resource (choose a format which can be understood by a machine, like ",(0,i.kt)("inlineCode",{parentName:"li"},"Y-m-d H:i:s"),")")))),(0,i.kt)("h4",{id:"full-api-endpoint"},"Full API endpoint"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Create a new View",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},'Under "Display", select the type of content you wish to import'),(0,i.kt)("li",{parentName:"ul"},'In the Page configuration, select "JSON data document"'),(0,i.kt)("li",{parentName:"ul"},"Remove the pagination"),(0,i.kt)("li",{parentName:"ul"},"Fill out the other necessary fields, including the path (for example ",(0,i.kt)("inlineCode",{parentName:"li"},"/api/articles"),")"))),(0,i.kt)("li",{parentName:"ul"},"Add the following fields:",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"uuid")," with the UUID of the resource"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"updated")," with the last modification date of the resource (choose a format which can be understood by a machine, like ",(0,i.kt)("inlineCode",{parentName:"li"},"Y-m-d H:i:s"),")"),(0,i.kt)("li",{parentName:"ul"},"Any other field you want to import "))),(0,i.kt)("li",{parentName:"ul"},'In the Advanced section, add a Contextual Filter of type "UUID". This will allow the importer to fetch only one node with a path like ',(0,i.kt)("inlineCode",{parentName:"li"},"/api/articles/d29d2a19-13b9-4e57-9047-0d1ad8b944fb"))),(0,i.kt)("h3",{id:"create-your-service"},"Create your service"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"const DrupalImporterMixin = require('./mixins/drupal7');\n\nmodule.exports = {\n  name: 'my-importer',\n  mixins: [DrupalImporterMixin],\n  settings: {\n    source: {\n      apiUrl: 'https://mydomain.com/api/articles',\n      getAllCompact: 'https://mydomain.com/api/articles_compact',\n      getOneFull: data => 'https://mydomain.com/api/articles/' + data.uuid,\n      // ... see ImporterMixin settings for other source config available\n    },\n    dest: {\n      containerUri: null, // Container where the data will be posted (must be created already)\n      predicatesToKeep: [], // Don't remove these predicates when updating data\n    },\n    activitypub: {\n      actorUri: null, // ActivityPub actor who will post activities on synchronization (leave null to disable this)\n      activities: ['Create', 'Update', 'Delete'] // The activities you want to be posted by the actor\n    },\n    cronJob: {\n      time: null, // '0 0 4 * * *' for every night at 4am \n      timeZone: 'Europe/Paris'\n    }\n  },\n  methods: {\n    async transform(data) {\n      return({\n        ...data\n      });\n    }\n  }\n};\n")),(0,i.kt)("h3",{id:"bypassing-drupal-cache"},"Bypassing Drupal cache"),(0,i.kt)("p",null,"Drupal 7 use an internal cache which ignores headers traditionally used to bypass cache (such as ",(0,i.kt)("inlineCode",{parentName:"p"},"Cache-Control: no-cache"),"). "),(0,i.kt)("p",null,"To make sure you get always a fresh version of your data, we recommend you to install the ",(0,i.kt)("a",{parentName:"p",href:"https://www.drupal.org/project/ua_cache_bypass"},"User-Agent Cache Bypass")," module."),(0,i.kt)("p",null,"Once the module is activated, go to its configuration and set ",(0,i.kt)("inlineCode",{parentName:"p"},"SemAppsImporter")," in the User Agents fields."))}m.isMDXComponent=!0}}]);