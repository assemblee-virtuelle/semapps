"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2064],{3905:function(e,t,a){a.d(t,{Zo:function(){return s},kt:function(){return k}});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},l=Object.keys(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var p=r.createContext({}),d=function(e){var t=r.useContext(p),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},s=function(e){var t=d(e.components);return r.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,l=e.originalType,p=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),m=d(a),k=n,c=m["".concat(p,".").concat(k)]||m[k]||u[k]||l;return a?r.createElement(c,i(i({ref:t},s),{},{components:a})):r.createElement(c,i({ref:t},s))}));function k(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=a.length,i=new Array(l);i[0]=m;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:n,i[1]=o;for(var d=2;d<l;d++)i[d]=a[d];return r.createElement.apply(null,i)}return r.createElement.apply(null,a)}m.displayName="MDXCreateElement"},3517:function(e,t,a){a.r(t),a.d(t,{assets:function(){return s},contentTitle:function(){return p},default:function(){return k},frontMatter:function(){return o},metadata:function(){return d},toc:function(){return u}});var r=a(3117),n=a(102),l=(a(7294),a(3905)),i=["components"],o={title:"Dataset"},p=void 0,d={unversionedId:"middleware/triplestore/dataset",id:"middleware/triplestore/dataset",title:"Dataset",description:"This service allows you to manage datasets in a Jena Fuseki instance, through its API.",source:"@site/docs/middleware/triplestore/dataset.md",sourceDirName:"middleware/triplestore",slug:"/middleware/triplestore/dataset",permalink:"/docs/middleware/triplestore/dataset",draft:!1,editUrl:"https://github.com/assemblee-virtuelle/semapps/edit/master/website/docs/middleware/triplestore/dataset.md",tags:[],version:"current",frontMatter:{title:"Dataset"},sidebar:"middleware",previous:{title:"TripleStore",permalink:"/docs/middleware/triplestore/"},next:{title:"VoID",permalink:"/docs/middleware/void"}},s={},u=[{value:"Features",id:"features",level:2},{value:"Actions",id:"actions",level:2},{value:"<code>exist</code>",id:"exist",level:3},{value:"Parameters",id:"parameters",level:5},{value:"Return",id:"return",level:5},{value:"<code>list</code>",id:"list",level:3},{value:"Return",id:"return-1",level:5},{value:"<code>create</code>",id:"create",level:3},{value:"Parameters",id:"parameters-1",level:5},{value:"<code>backup</code>",id:"backup",level:3},{value:"Parameters",id:"parameters-2",level:5},{value:"<code>waitForCreation</code>",id:"waitforcreation",level:3},{value:"Parameters",id:"parameters-3",level:5},{value:"<code>waitForTaskCompletion</code>",id:"waitfortaskcompletion",level:3},{value:"Parameters",id:"parameters-4",level:5}],m={toc:u};function k(e){var t=e.components,a=(0,n.Z)(e,i);return(0,l.kt)("wrapper",(0,r.Z)({},m,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"This service allows you to manage datasets in a Jena Fuseki instance, through its API."),(0,l.kt)("h2",{id:"features"},"Features"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Create datasets, or check if they already exist"),(0,l.kt)("li",{parentName:"ul"},"Generate compressed backups og a given dataset"),(0,l.kt)("li",{parentName:"ul"},"Wait for a Fuseki task to be completed")),(0,l.kt)("h2",{id:"actions"},"Actions"),(0,l.kt)("p",null,"The following service actions are available:"),(0,l.kt)("h3",{id:"exist"},(0,l.kt)("inlineCode",{parentName:"h3"},"exist")),(0,l.kt)("p",null,"Check if a dataset already exists."),(0,l.kt)("h5",{id:"parameters"},"Parameters"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Property"),(0,l.kt)("th",{parentName:"tr",align:null},"Type"),(0,l.kt)("th",{parentName:"tr",align:null},"Default"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"dataset")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"String")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"required")),(0,l.kt)("td",{parentName:"tr",align:null},"Name of the dataset")))),(0,l.kt)("h5",{id:"return"},"Return"),(0,l.kt)("p",null,"True if the dataset exists"),(0,l.kt)("h3",{id:"list"},(0,l.kt)("inlineCode",{parentName:"h3"},"list")),(0,l.kt)("p",null,"Return a list of all existing datasets in the Fuseki instance."),(0,l.kt)("h5",{id:"return-1"},"Return"),(0,l.kt)("p",null,"An array with the names of all existing datasets."),(0,l.kt)("h3",{id:"create"},(0,l.kt)("inlineCode",{parentName:"h3"},"create")),(0,l.kt)("p",null,"Create a dataset if it doesn't already exist."),(0,l.kt)("h5",{id:"parameters-1"},"Parameters"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Property"),(0,l.kt)("th",{parentName:"tr",align:null},"Type"),(0,l.kt)("th",{parentName:"tr",align:null},"Default"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"dataset")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"String")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"required")),(0,l.kt)("td",{parentName:"tr",align:null},"Name of the dataset")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"secure")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"Boolean")),(0,l.kt)("td",{parentName:"tr",align:null},"false"),(0,l.kt)("td",{parentName:"tr",align:null},"If true, Fuseki will check permissions with WebACL for this dataset. Only works with the ",(0,l.kt)("a",{parentName:"td",href:"https://hub.docker.com/repository/docker/semapps/jena-fuseki-webacl"},"semapps/jena-fuseki-webacl")," Docker image")))),(0,l.kt)("h3",{id:"backup"},(0,l.kt)("inlineCode",{parentName:"h3"},"backup")),(0,l.kt)("p",null,"Generate a compressed backup of all the triples in the dataset (through ",(0,l.kt)("a",{parentName:"p",href:"https://jena.apache.org/documentation/fuseki2/fuseki-server-protocol.html"},"Fuseki protocol"),")."),(0,l.kt)("h5",{id:"parameters-2"},"Parameters"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Property"),(0,l.kt)("th",{parentName:"tr",align:null},"Type"),(0,l.kt)("th",{parentName:"tr",align:null},"Default"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"dataset")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"String")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"required")),(0,l.kt)("td",{parentName:"tr",align:null},"Name of the dataset")))),(0,l.kt)("h3",{id:"waitforcreation"},(0,l.kt)("inlineCode",{parentName:"h3"},"waitForCreation")),(0,l.kt)("p",null,"Wait for the dataset to have been created."),(0,l.kt)("h5",{id:"parameters-3"},"Parameters"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Property"),(0,l.kt)("th",{parentName:"tr",align:null},"Type"),(0,l.kt)("th",{parentName:"tr",align:null},"Default"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"dataset")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"String")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"required")),(0,l.kt)("td",{parentName:"tr",align:null},"Name of the dataset")))),(0,l.kt)("h3",{id:"waitfortaskcompletion"},(0,l.kt)("inlineCode",{parentName:"h3"},"waitForTaskCompletion")),(0,l.kt)("p",null,"Wait for a Fuseki task to be completed."),(0,l.kt)("h5",{id:"parameters-4"},"Parameters"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Property"),(0,l.kt)("th",{parentName:"tr",align:null},"Type"),(0,l.kt)("th",{parentName:"tr",align:null},"Default"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"taskId")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"String")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"required")),(0,l.kt)("td",{parentName:"tr",align:null},"ID of the Fuseki task")))))}k.isMDXComponent=!0}}]);