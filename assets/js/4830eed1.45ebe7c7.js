"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4491],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return m}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),u=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=u(n),m=a,h=d["".concat(s,".").concat(m)]||d[m]||p[m]||o;return n?r.createElement(h,i(i({ref:t},c),{},{components:n})):r.createElement(h,i({ref:t},c))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var u=2;u<o;u++)i[u]=n[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},7867:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return s},default:function(){return m},frontMatter:function(){return l},metadata:function(){return u},toc:function(){return p}});var r=n(3117),a=n(102),o=(n(7294),n(3905)),i=["components"],l={title:"Webhooks"},s=void 0,u={unversionedId:"middleware/webhooks",id:"middleware/webhooks",title:"Webhooks",description:"This service allows to create incoming webhooks, in order to allow users to perform some actions directly, bypassing the endpoints authorizations.",source:"@site/docs/middleware/webhooks.md",sourceDirName:"middleware",slug:"/middleware/webhooks",permalink:"/docs/middleware/webhooks",draft:!1,editUrl:"https://github.com/assemblee-virtuelle/semapps/edit/master/website/docs/middleware/webhooks.md",tags:[],version:"current",frontMatter:{title:"Webhooks"},sidebar:"middleware",previous:{title:"SynchronizerService",permalink:"/docs/middleware/sync/synchronizer"}},c={},p=[{value:"Features",id:"features",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Install",id:"install",level:2},{value:"Usage",id:"usage",level:2},{value:"Settings",id:"settings",level:2},{value:"Use cases",id:"use-cases",level:2},{value:"Generating new webhooks",id:"generating-new-webhooks",level:3},{value:"Through the command line",id:"through-the-command-line",level:4},{value:"Through a secured endpoint",id:"through-a-secured-endpoint",level:4},{value:"Posting to a webhook",id:"posting-to-a-webhook",level:3},{value:"Queuing incoming POSTs",id:"queuing-incoming-posts",level:3}],d={toc:p};function m(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"This service allows to create incoming ",(0,o.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Webhook"},"webhooks"),", in order to allow users to perform some actions directly, bypassing the endpoints authorizations."),(0,o.kt)("h2",{id:"features"},"Features"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Generate webhooks for any user through ",(0,o.kt)("a",{parentName:"li",href:"https://moleculer.services/docs/0.14/moleculer-repl.html"},"Moleculer REPL")),(0,o.kt)("li",{parentName:"ul"},"Allow users to create their own webhooks with a secured endpoint"),(0,o.kt)("li",{parentName:"ul"},"Handle different kind of actions, depending on your needs")),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://moleculer.services/docs/0.14/moleculer-web.html"},"ApiGateway")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"ldp"},"LdpService"))),(0,o.kt)("h2",{id:"install"},"Install"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"$ yarn add @semapps/webhooks\n")),(0,o.kt)("h2",{id:"usage"},"Usage"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"const { WebhooksService } = require('@semapps/webhooks');\n\nmodule.exports = {\n  mixins: [WebhooksService],\n  settings: {\n    containerUri: \"http://localhost:3000/webhooks/\",\n    allowedActions: ['myAction'],\n    \n  },\n  actions: {\n    async myAction(ctx) {\n      const { user, data } = ctx.params;\n      // Handle stuff here...\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"settings"},"Settings"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Property"),(0,o.kt)("th",{parentName:"tr",align:null},"Type"),(0,o.kt)("th",{parentName:"tr",align:null},"Default"),(0,o.kt)("th",{parentName:"tr",align:null},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"containerUri")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"String")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("strong",{parentName:"td"},"required")),(0,o.kt)("td",{parentName:"tr",align:null},"Container where the webhooks will be stored.")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"allowedActions")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"Array")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("strong",{parentName:"td"},"required")),(0,o.kt)("td",{parentName:"tr",align:null},"Name of the webhook actions which can be used")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"context")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"Array")," or ",(0,o.kt)("inlineCode",{parentName:"td"},"Object")),(0,o.kt)("td",{parentName:"tr",align:null},'{ "@vocab": "',(0,o.kt)("a",{parentName:"td",href:"http://semapps.org/ns/core#%22"},'http://semapps.org/ns/core#"')," }"),(0,o.kt)("td",{parentName:"tr",align:null},"JSON-LD context used when returning the webhook information")))),(0,o.kt)("h2",{id:"use-cases"},"Use cases"),(0,o.kt)("h3",{id:"generating-new-webhooks"},"Generating new webhooks"),(0,o.kt)("p",null,"You generate a webhook by providing a user and an action. The action must be in the list of ",(0,o.kt)("inlineCode",{parentName:"p"},"allowedActions"),", in the settings."),(0,o.kt)("h4",{id:"through-the-command-line"},"Through the command line"),(0,o.kt)("p",null,"Start Moleculer in REPL mode and call the ",(0,o.kt)("inlineCode",{parentName:"p"},"generate")," action like this:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"mol$ call webhooks.generate --userId myUser --action myAction\n")),(0,o.kt)("h4",{id:"through-a-secured-endpoint"},"Through a secured endpoint"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"POST")," to the ",(0,o.kt)("inlineCode",{parentName:"p"},"/webhooks")," endpoint as a logged-in user, providing the action that will be handled by this endpoint as JSON."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},'POST /webhooks HTTP/1.1\nHost: localhost:3000\nContent-Type: application/json\nAuthorization: Bearer XXX\n\n{\n  "action": "myAction",\n}\n')),(0,o.kt)("h3",{id:"posting-to-a-webhook"},"Posting to a webhook"),(0,o.kt)("p",null,"When you generate a webhook, you will receive an URI in response. You can then post JSON data to this webhook. It will be handled by the action(s) you defined."),(0,o.kt)("h3",{id:"queuing-incoming-posts"},"Queuing incoming POSTs"),(0,o.kt)("p",null,"If you wish, you can use the ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/OptimalBits/bull"},"Bull")," task manager to queue incoming POSTs and make sure no data is lost."),(0,o.kt)("p",null,"All you need to do is add ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/moleculerjs/moleculer-addons/tree/master/packages/moleculer-bull"},"Moleculer's official Bull service")," as a mixin:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"const QueueService = require('moleculer-bull');\nconst { WebhooksService } = require('@semapps/webhooks');\n\nmodule.exports = {\n  mixins: [WebhooksService, QueueService('redis://localhost:6379/0')],\n  ...\n};\n")),(0,o.kt)("p",null,"Please look at the Bull service's official documentation for more information."))}m.isMDXComponent=!0}}]);