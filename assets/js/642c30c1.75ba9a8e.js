"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4521],{3905:function(e,n,t){t.d(n,{Zo:function(){return d},kt:function(){return f}});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=r.createContext({}),c=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},d=function(e){var n=c(e.components);return r.createElement(l.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},u=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),u=c(t),f=a,v=u["".concat(l,".").concat(f)]||u[f]||p[f]||o;return t?r.createElement(v,i(i({ref:n},d),{},{components:t})):r.createElement(v,i({ref:n},d))}));function f(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=u;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var c=2;c<o;c++)i[c]=t[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}u.displayName="MDXCreateElement"},7184:function(e,n,t){t.r(n),t.d(n,{assets:function(){return d},contentTitle:function(){return l},default:function(){return f},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return p}});var r=t(3117),a=t(102),o=(t(7294),t(3905)),i=["components"],s={title:"Data Servers"},l=void 0,c={unversionedId:"frontend/semantic-data-provider/data-servers",id:"frontend/semantic-data-provider/data-servers",title:"Data Servers",description:"The dataServers config passed to the semantic data provider describes the servers to which we want to connect and what",source:"@site/docs/frontend/semantic-data-provider/data-servers.md",sourceDirName:"frontend/semantic-data-provider",slug:"/frontend/semantic-data-provider/data-servers",permalink:"/docs/frontend/semantic-data-provider/data-servers",draft:!1,editUrl:"https://github.com/assemblee-virtuelle/semapps/edit/master/website/docs/frontend/semantic-data-provider/data-servers.md",tags:[],version:"current",frontMatter:{title:"Data Servers"},sidebar:"frontend",previous:{title:"Semantic Data Provider",permalink:"/docs/frontend/semantic-data-provider/"},next:{title:"Data Model",permalink:"/docs/frontend/semantic-data-provider/data-model"}},d={},p=[{value:"Configuration with VoID endpoints",id:"configuration-with-void-endpoints",level:2},{value:"Configuration without VoID endpoints",id:"configuration-without-void-endpoints",level:2},{value:"Mirrors",id:"mirrors",level:2},{value:"POD providers",id:"pod-providers",level:2}],u={toc:p};function f(e){var n=e.components,t=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"dataServers")," config passed to the semantic data provider describes the servers to which we want to connect and what\nthey contain. Most of these information can be guessed from the VoID endpoint(s)."),(0,o.kt)("h2",{id:"configuration-with-void-endpoints"},"Configuration with VoID endpoints"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"const dataServers = {\n  server1: {\n    baseUrl: 'http://localhost:3000',\n    default: true, // Default server (used for the creation of resources)\n    authServer: true // Server where users are autenticated\n  },\n  server2: {\n    baseUrl: 'http://localhost:3001'\n  }\n};\n")),(0,o.kt)("h2",{id:"configuration-without-void-endpoints"},"Configuration without VoID endpoints"),(0,o.kt)("p",null,"If the server you want to connect to doesn't have a VoID endpoint, you will need to specify manually the name of the\nserver, its SPARQL endpoint as well as the containers"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"const dataServers = {\n  server1: {\n    baseUrl: 'http://localhost:3000',\n    default: true,\n    authServer: true,\n    // Informations required if no VoID endpoint are available\n    name: 'Server 1',\n    sparqlEndpoint: 'http://localhost:3000/sparql',\n    containers: {\n      server1: {\n        'foaf:Person': ['/users']\n      }\n    }\n  },\n  server2: {\n    baseUrl: 'http://localhost:3001',\n    name: 'Server 2',\n    sparqlEndpoint: 'http://localhost:3001/sparql',\n    containers: {\n      server2: {\n        'foaf:Person': ['/users']\n      }\n    }\n  }\n};\n")),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"You can set ",(0,o.kt)("inlineCode",{parentName:"p"},"void: false")," to prevent the semantic data provider from unnecessarily fetching a VoID endpoint.")),(0,o.kt)("h2",{id:"mirrors"},"Mirrors"),(0,o.kt)("p",null,"If a server is ",(0,o.kt)("a",{parentName:"p",href:"/docs/middleware/sync/mirror"},"mirroring")," another server, the VoID endpoint will show this information and\nthe semantic data provider will automatically adapt its requests. If no VoID endpoint is available, you can indicate\nmanually the mirrored data like this:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"const dataServers = {\n  server1: {\n    baseUrl: 'http://localhost:3000',\n    default: true,\n    authServer: true,\n    name: 'Server 1',\n    sparqlEndpoint: 'http://localhost:3000/sparql',\n    containers: {\n      server1: {\n        'foaf:Person': ['/users']\n      },\n      // Data on server2 mirrored on server1\n      server2: {\n        'foaf:Person': ['/users']\n      }\n    }\n  },\n  server2: {\n    baseUrl: 'http://localhost:3001',\n    name: 'Server 2',\n    sparqlEndpoint: 'http://localhost:3001/sparql',\n    containers: {\n      server2: {\n        'foaf:Person': ['/users']\n      }\n    }\n  }\n};\n")),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"If many servers are mirroring each others, you can use the ",(0,o.kt)("inlineCode",{parentName:"p"},"priority")," config to help the semantic data provider\nchoose which servers to request first. Enter a number for each server and the server with the highest number will\nbe chosen.")),(0,o.kt)("h2",{id:"pod-providers"},"POD providers"),(0,o.kt)("p",null,"If a server you wish to connect to is a POD provider, you should set ",(0,o.kt)("inlineCode",{parentName:"p"},"pod: true"),". The ",(0,o.kt)("inlineCode",{parentName:"p"},"baseUrl")," and the ",(0,o.kt)("inlineCode",{parentName:"p"},"sparqlEndpoint"),"\nconfig will be obtained after the user connects to his POD. A ",(0,o.kt)("inlineCode",{parentName:"p"},"proxyUrl")," config will also be obtained automatically: it\nis the URL through which requests can be made using HTTP signatures."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"const dataServers = {\n  server1: { ... },\n  server2: { ... },\n  pod: {\n    pod: true,\n    containers: {\n      'pair:Person': [\n        '/contacts'\n      ]\n    },\n    // Calculated automatically after user login\n    baseUrl: null,\n    sparqlEndpoint: null,\n    proxyUrl: null\n  }\n}\n")))}f.isMDXComponent=!0}}]);