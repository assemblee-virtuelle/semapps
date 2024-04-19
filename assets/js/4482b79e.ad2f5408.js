"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3292],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return c}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),u=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=u(e.components);return r.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),m=u(n),c=a,k=m["".concat(s,".").concat(c)]||m[c]||d[c]||i;return n?r.createElement(k,l(l({ref:t},p),{},{components:n})):r.createElement(k,l({ref:t},p))}));function c(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,l=new Array(i);l[0]=m;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var u=2;u<i;u++)l[u]=n[u];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},6174:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return s},default:function(){return c},frontMatter:function(){return o},metadata:function(){return u},toc:function(){return d}});var r=n(3117),a=n(102),i=(n(7294),n(3905)),l=["components"],o={title:"Webfinger"},s=void 0,u={unversionedId:"middleware/webfinger",id:"middleware/webfinger",title:"Webfinger",description:"This service implements the Webfinger protocol, which allows remote services to discover local users.",source:"@site/docs/middleware/webfinger.md",sourceDirName:"middleware",slug:"/middleware/webfinger",permalink:"/docs/middleware/webfinger",draft:!1,editUrl:"https://github.com/assemblee-virtuelle/semapps/edit/master/website/docs/middleware/webfinger.md",tags:[],version:"current",frontMatter:{title:"Webfinger"},sidebar:"middleware",previous:{title:"GroupsManagerBot",permalink:"/docs/middleware/webacl/groups-manager"},next:{title:"WebID",permalink:"/docs/middleware/webid"}},p={},d=[{value:"Features",id:"features",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Install",id:"install",level:2},{value:"Usage",id:"usage",level:2},{value:"Discovering an user with Webfinger",id:"discovering-an-user-with-webfinger",level:3},{value:"Settings",id:"settings",level:2},{value:"Actions",id:"actions",level:2},{value:"<code>get</code>",id:"get",level:3},{value:"Parameters",id:"parameters",level:5},{value:"Return value",id:"return-value",level:5},{value:"<code>getRemoteUri</code>",id:"getremoteuri",level:3},{value:"Parameters",id:"parameters-1",level:5},{value:"Return value",id:"return-value-1",level:5},{value:"Additional resources about the protocol",id:"additional-resources-about-the-protocol",level:2}],m={toc:d};function c(e){var t=e.components,n=(0,a.Z)(e,l);return(0,i.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"This service implements the ",(0,i.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/WebFinger"},"Webfinger")," protocol, which allows remote services to discover local users."),(0,i.kt)("h2",{id:"features"},"Features"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Automatically find ActivityPub actors through their username"),(0,i.kt)("li",{parentName:"ul"},"Returns a 404 error if the actor doesn't exist")),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://moleculer.services/docs/0.14/moleculer-web.html"},"ApiGateway")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"auth"},"AuthAccountService"))),(0,i.kt)("h2",{id:"install"},"Install"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"$ yarn add @semapps/webfinger\n")),(0,i.kt)("h2",{id:"usage"},"Usage"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"const { WebfingerService } = require('@semapps/webfinger');\n\nmodule.exports = {\n  mixins: [WebfingerService],\n  settings: {\n    baseUrl: 'https://mydomain.com',\n    domainName: 'mydomain.com' // Not necessary if it is the same as usersContainer\n  }\n};\n")),(0,i.kt)("h3",{id:"discovering-an-user-with-webfinger"},"Discovering an user with Webfinger"),(0,i.kt)("p",null,"In the Webfinger protocol, users are identified by their username and the domain name where they are hosted: ",(0,i.kt)("inlineCode",{parentName:"p"},"username@domain"),". This is similar to email addresses, except services like Mastodon add a ",(0,i.kt)("inlineCode",{parentName:"p"},"@")," at the beginning."),(0,i.kt)("p",null,"To find an user, a simple GET is enough:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"GET /.well-known/webfinger?resource=acct:simon@localhost HTTP/1.1\nHost: localhost:3000\nAccept: application/json\n")),(0,i.kt)("p",null,"If the user exists locally, it will return a JSON like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "subject": "acct:simon@localhost",\n  "aliases": ["http://localhost:3000/actors/simon"],\n  "links": [\n    {\n      "rel": "self",\n      "type": "application/activity+json",\n      "href": "http://localhost:3000/actors/simon"\n    }\n  ]\n}\n')),(0,i.kt)("h2",{id:"settings"},"Settings"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Property"),(0,i.kt)("th",{parentName:"tr",align:null},"Type"),(0,i.kt)("th",{parentName:"tr",align:null},"Default"),(0,i.kt)("th",{parentName:"tr",align:null},"Description"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"baseUrl")),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"String")),(0,i.kt)("td",{parentName:"tr",align:null}),(0,i.kt)("td",{parentName:"tr",align:null},"Base URL of the server. Used to find the domain name if it is not set.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"domainName")),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"String")),(0,i.kt)("td",{parentName:"tr",align:null}),(0,i.kt)("td",{parentName:"tr",align:null},"Domain name used for the user@domain webfinger identifier. If not set, the domain name will be guessed from the users' container.")))),(0,i.kt)("h2",{id:"actions"},"Actions"),(0,i.kt)("h3",{id:"get"},(0,i.kt)("inlineCode",{parentName:"h3"},"get")),(0,i.kt)("p",null,"Return the Webfinger information for a local actor."),(0,i.kt)("h5",{id:"parameters"},"Parameters"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Property"),(0,i.kt)("th",{parentName:"tr",align:null},"Type"),(0,i.kt)("th",{parentName:"tr",align:null},"Default"),(0,i.kt)("th",{parentName:"tr",align:null},"Description"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"resource")),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"String")),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("strong",{parentName:"td"},"required")),(0,i.kt)("td",{parentName:"tr",align:null},"Resource in the format ",(0,i.kt)("inlineCode",{parentName:"td"},"acct:user@server.com"))))),(0,i.kt)("h5",{id:"return-value"},"Return value"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"Object")," formatted like above."),(0,i.kt)("h3",{id:"getremoteuri"},(0,i.kt)("inlineCode",{parentName:"h3"},"getRemoteUri")),(0,i.kt)("p",null,"Return the URI of a remote actor through the Webfinger protocol."),(0,i.kt)("h5",{id:"parameters-1"},"Parameters"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Property"),(0,i.kt)("th",{parentName:"tr",align:null},"Type"),(0,i.kt)("th",{parentName:"tr",align:null},"Default"),(0,i.kt)("th",{parentName:"tr",align:null},"Description"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"account")),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("inlineCode",{parentName:"td"},"String")),(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("strong",{parentName:"td"},"required")),(0,i.kt)("td",{parentName:"tr",align:null},"Account in the format ",(0,i.kt)("inlineCode",{parentName:"td"},"user@server.com")," or ",(0,i.kt)("inlineCode",{parentName:"td"},"@user@server.com"))))),(0,i.kt)("h5",{id:"return-value-1"},"Return value"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"String")," URI of the remote actor. Null if no actor found."),(0,i.kt)("h2",{id:"additional-resources-about-the-protocol"},"Additional resources about the protocol"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://docs.joinmastodon.org/spec/webfinger/"},"https://docs.joinmastodon.org/spec/webfinger/")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.packetizer.com/ws/webfinger/"},"https://www.packetizer.com/ws/webfinger/")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://tools.ietf.org/html/rfc7033"},"https://tools.ietf.org/html/rfc7033"))))}c.isMDXComponent=!0}}]);