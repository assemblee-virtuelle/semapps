import e,{useMemo as t,useCallback as r,useState as n,useEffect as o,forwardRef as i,useImperativeHandle as a}from"react";import{useGetIdentity as c,fetchUtils as l,useRecordContext as u,useNotify as s,TextField as d,DateField as f,RichTextField as p,useGetOne as m,LinearProgress as h,useQuery as v}from"react-admin";import{RichTextInput as y,DefaultEditorOptions as g}from"ra-richtext-tiptap";import b from"@tiptap/extension-placeholder";import{Form as w}from"react-final-form";import{makeStyles as E,Box as x,Avatar as O,Button as T,Typography as I,CircularProgress as L}from"@material-ui/core";import A from"@material-ui/icons/Send";import{buildBlankNodesQuery as k,useDataModel as R}from"@semapps/semantic-data-provider";import{AuthDialog as j}from"@semapps/auth-provider";import{mergeAttributes as N}from"@tiptap/core";import C from"@tiptap/extension-mention";import{ReferenceField as S,AvatarWithLabelField as P,ReferenceArrayField as D}from"@semapps/field-components";import{ReactRenderer as F}from"@tiptap/react";import M from"tippy.js";function H(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function U(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?H(Object(r),!0).forEach((function(t){V(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):H(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function B(){
/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
B=function(){return e};var e={},t=Object.prototype,r=t.hasOwnProperty,n="function"==typeof Symbol?Symbol:{},o=n.iterator||"@@iterator",i=n.asyncIterator||"@@asyncIterator",a=n.toStringTag||"@@toStringTag";function c(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{c({},"")}catch(e){c=function(e,t,r){return e[t]=r}}function l(e,t,r,n){var o=t&&t.prototype instanceof d?t:d,i=Object.create(o.prototype),a=new O(n||[]);return i._invoke=function(e,t,r){var n="suspendedStart";return function(o,i){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===o)throw i;return I()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var c=w(a,r);if(c){if(c===s)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var l=u(e,t,r);if("normal"===l.type){if(n=r.done?"completed":"suspendedYield",l.arg===s)continue;return{value:l.arg,done:r.done}}"throw"===l.type&&(n="completed",r.method="throw",r.arg=l.arg)}}}(e,r,a),i}function u(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=l;var s={};function d(){}function f(){}function p(){}var m={};c(m,o,(function(){return this}));var h=Object.getPrototypeOf,v=h&&h(h(T([])));v&&v!==t&&r.call(v,o)&&(m=v);var y=p.prototype=d.prototype=Object.create(m);function g(e){["next","throw","return"].forEach((function(t){c(e,t,(function(e){return this._invoke(t,e)}))}))}function b(e,t){var n;this._invoke=function(o,i){function a(){return new t((function(n,a){!function n(o,i,a,c){var l=u(e[o],e,i);if("throw"!==l.type){var s=l.arg,d=s.value;return d&&"object"==typeof d&&r.call(d,"__await")?t.resolve(d.__await).then((function(e){n("next",e,a,c)}),(function(e){n("throw",e,a,c)})):t.resolve(d).then((function(e){s.value=e,a(s)}),(function(e){return n("throw",e,a,c)}))}c(l.arg)}(o,i,n,a)}))}return n=n?n.then(a,a):a()}}function w(e,t){var r=e.iterator[t.method];if(void 0===r){if(t.delegate=null,"throw"===t.method){if(e.iterator.return&&(t.method="return",t.arg=void 0,w(e,t),"throw"===t.method))return s;t.method="throw",t.arg=new TypeError("The iterator does not provide a 'throw' method")}return s}var n=u(r,e.iterator,t.arg);if("throw"===n.type)return t.method="throw",t.arg=n.arg,t.delegate=null,s;var o=n.arg;return o?o.done?(t[e.resultName]=o.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=void 0),t.delegate=null,s):o:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,s)}function E(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function x(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function O(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(E,this),this.reset(!0)}function T(e){if(e){var t=e[o];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var n=-1,i=function t(){for(;++n<e.length;)if(r.call(e,n))return t.value=e[n],t.done=!1,t;return t.value=void 0,t.done=!0,t};return i.next=i}}return{next:I}}function I(){return{value:void 0,done:!0}}return f.prototype=p,c(y,"constructor",p),c(p,"constructor",f),f.displayName=c(p,a,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===f||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,p):(e.__proto__=p,c(e,a,"GeneratorFunction")),e.prototype=Object.create(y),e},e.awrap=function(e){return{__await:e}},g(b.prototype),c(b.prototype,i,(function(){return this})),e.AsyncIterator=b,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new b(l(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},g(y),c(y,a,"Generator"),c(y,o,(function(){return this})),c(y,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=T,O.prototype={constructor:O,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(x),!e)for(var t in this)"t"===t.charAt(0)&&r.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=void 0)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function n(r,n){return a.type="throw",a.arg=e,t.next=r,n&&(t.method="next",t.arg=void 0),!!n}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var c=r.call(i,"catchLoc"),l=r.call(i,"finallyLoc");if(c&&l){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=e,a.arg=t,i?(this.method="next",this.next=i.finallyLoc,s):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),s},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),x(r),s}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;x(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,r){return this.delegate={iterator:T(e),resultName:t,nextLoc:r},"next"===this.method&&(this.arg=void 0),s}},e}function _(e,t,r,n,o,i,a){try{var c=e[i](a),l=c.value}catch(e){return void r(e)}c.done?t(l):Promise.resolve(l).then(n,o)}function G(e){return function(){var t=this,r=arguments;return new Promise((function(n,o){var i=e.apply(t,r);function a(e){_(i,n,o,a,c,"next",e)}function c(e){_(i,n,o,a,c,"throw",e)}a(void 0)}))}}function V(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function z(){return(z=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function J(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}function W(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==r)return;var n,o,i=[],a=!0,c=!1;try{for(r=r.call(e);!(a=(n=r.next()).done)&&(i.push(n.value),!t||i.length!==t);a=!0);}catch(e){c=!0,o=e}finally{try{a||null==r.return||r.return()}finally{if(c)throw o}}return i}(e,t)||q(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function K(e){return function(e){if(Array.isArray(e))return Q(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||q(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function q(e,t){if(e){if("string"==typeof e)return Q(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?Q(e,t):void 0}}function Q(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var X={ACCEPT:"Accept",ADD:"Add",ANNOUNCE:"Announce",ARRIVE:"Arrive",BLOCK:"Block",CREATE:"Create",DELETE:"Delete",DISLIKE:"Dislike",FLAG:"Flag",FOLLOW:"Follow",IGNORE:"Ignore",INVITE:"Invite",JOIN:"Join",LEAVE:"Leave",LIKE:"Like",LISTEN:"Listen",MOVE:"Move",OFFER:"Offer",QUESTION:"Question",REJECT:"Reject",READ:"Read",REMOVE:"Remove",TENTATIVE_REJECT:"TentativeReject",TENTATIVE_ACCEPT:"TentativeAccept",TRAVAL:"Travel",UNDO:"Undo",UPDATE:"Update",VIEW:"View"},Y={APPLICATION:"Application",GROUP:"Group",ORGANIZATION:"Organization",PERSON:"Person",SERVICE:"Service"},Z={ARTICLE:"Article",AUDIO:"Audio",DOCUMENT:"Document",EVENT:"Event",IMAGE:"Image",NOTE:"Note",PAGE:"Page",PLACE:"Place",PROFILE:"Profile",RELATIONSHIP:"Relationship",TOMBSTONE:"Tombstone",VIDEO:"Video"},$="https://www.w3.org/ns/activitystreams#Public",ee=function(){var e=c().identity,n=t((function(){var t;if(null!=e&&e.webIdData)return null==e||null===(t=e.webIdData)||void 0===t?void 0:t.outbox}),[e]),o=t((function(){var t,r;if(null!=e&&e.webIdData)return(null==e||null===(t=e.webIdData)||void 0===t||null===(r=t.endpoints)||void 0===r?void 0:r["void:sparqlEndpoint"])||(null==e?void 0:e.id)+"/sparql"}),[e]);return{post:r(function(){var e=G(B().mark((function e(t){var r,o,i;return B().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=localStorage.getItem("token"),e.next=3,l.fetchJson(n,{method:"POST",body:JSON.stringify(U({"@context":"https://www.w3.org/ns/activitystreams"},t)),headers:new Headers({"Content-Type":"application/ld+json",Authorization:"Bearer ".concat(r)})});case 3:return o=e.sent,i=o.headers,e.abrupt("return",i.get("Location"));case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[n]),fetch:r(G(B().mark((function e(){var t,r,i,a,c;return B().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(o&&n){e.next=2;break}return e.abrupt("return");case 2:return t=localStorage.getItem("token"),r=k(["as:object"]),i="\n      PREFIX as: <https://www.w3.org/ns/activitystreams#>\n      CONSTRUCT {\n        ?s1 ?p1 ?o1 .\n        ".concat(r.construct,"\n      }\n      WHERE {\n        <").concat(n,"> as:items ?s1 .\n        ?s1 ?p1 ?o1 .\n        ").concat(r.where,"\n      }\n    "),e.next=7,l.fetchJson(o,{method:"POST",body:i,headers:new Headers({Accept:"application/ld+json",Authorization:t?"Bearer ".concat(t):void 0})});case 7:if(a=e.sent,!(c=a.json)["@graph"]){e.next=13;break}return e.abrupt("return",c["@graph"]);case 13:return e.abrupt("return",null);case 14:case"end":return e.stop()}}),e)}))),[o,n]),url:n,owner:null==e?void 0:e.id}},te=C.extend({renderHTML:function(e){var t=e.node,r=e.HTMLAttributes;return["span",N(this.options.HTMLAttributes,r),"@".concat(t.attrs.id.label)]},addAttributes:function(){return{label:{default:null,parseHTML:function(e){return{label:e.getAttribute("data-mention-label")}},renderHTML:function(e){return e.id.label?{"data-mention-label":e.id.label}:{}}},id:{default:null,parseHTML:function(e){return{id:e.getAttribute("data-mention-id")}},renderHTML:function(e){return e.id.id?{"data-mention-id":e.id.id}:{}}}}}}),re=E((function(e){return{form:{marginTop:-12},container:{paddingLeft:80,position:"relative"},avatar:{position:"absolute",top:16,left:0,bottom:0,width:64,height:64},editorContent:{"& > div":{backgroundColor:"rgba(0, 0, 0, 0.09)",padding:"2px 12px",borderWidth:"0px !important",borderRadius:0,borderBottom:"1px solid #FFF",minHeight:60,outline:"unset !important"},"& > div > p":{marginTop:12,marginBottom:12,fontFamily:e.typography.body1.fontFamily,marginBlockStart:"0.5em",marginBlockEnd:"0.5em"},"& > div > p.is-editor-empty:first-child::before":{color:"grey",content:"attr(data-placeholder)",float:"left",height:0,pointerEvents:"none"},marginBottom:-19},button:{marginBottom:15}}})),ne=function(t){var o=t.context,i=t.placeholder,a=t.helperText,l=t.mentions,d=t.userResource,f=t.addItem,p=t.removeItem,m=u(),h=c().identity,v=R(d),E=re(),I=s(),L=ee(),k=W(n(!1),2),N=k[0],C=k[1],S=W(n(!1),2),P=S[0],D=S[1],F=r(function(){var e=G(B().mark((function e(t,r){var n,i,a,c,l,u;return B().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=r.reset,i=(new DOMParser).parseFromString(t.comment,"text/html"),a=Array.from(i.body.getElementsByClassName("mention")),c=[],a.forEach((function(e){var t=e.attributes["data-mention-id"].value,r=e.attributes["data-mention-label"].value,n=i.createElement("a");n.setAttribute("href",new URL(window.location.href).origin+"/"+d+"/"+encodeURIComponent(t)+"/show"),n.textContent="@"+r,e.parentNode.replaceChild(n,e),c.push(t)})),"undefined"!==i.body.innerHTML){e.next=9;break}I("Votre commentaire est vide","error"),e.next=24;break;case 9:return l=Date.now(),u={type:Z.NOTE,attributedTo:L.owner,content:i.body.innerHTML,inReplyTo:m[o],published:(new Date).toISOString()},e.prev=11,f(U({id:l},u)),n(),C(!1),e.next=17,L.post(U(U({},u),{},{to:[].concat(c,[$])}));case 17:I("Commentaire posté avec succès","success"),e.next=24;break;case 20:e.prev=20,e.t0=e.catch(11),p(l),I(e.t0.message,"error");case 24:case"end":return e.stop()}}),e,null,[[11,20]])})));return function(t,r){return e.apply(this,arguments)}}(),[L,I,C,f,p]),M=r((function(){h.id||D(!0)}),[h,D]);return l&&!l.items||!h?null:e.createElement(e.Fragment,null,e.createElement(w,{onSubmit:F,subscription:{submitting:!0,pristine:!0},render:function(t){var r,n,o,c,u=t.handleSubmit,s=t.submitting;if(t.pristine){var d=document.getElementById("comment");d&&""!==d.textContent&&(d.innerHTML="")}return e.createElement("form",{onSubmit:u,className:E.form},e.createElement(x,{className:E.container,onClick:M},e.createElement(O,{src:(null==h||null===(r=h.webIdData)||void 0===r?void 0:r[null==v||null===(n=v.fieldsMapping)||void 0===n?void 0:n.image])||(null==h||null===(o=h.profileData)||void 0===o?void 0:o[null==v||null===(c=v.fieldsMapping)||void 0===c?void 0:c.image]),className:E.avatar}),e.createElement(y,{source:"comment",label:"",toolbar:null,fullWidth:!0,classes:{editorContent:E.editorContent},editorOptions:U(U({},g),{},{onFocus:function(){C(!0)},extensions:[].concat(K(g.extensions),[i?b.configure({placeholder:i}):null,l?te.configure({HTMLAttributes:{class:"mention"},suggestion:l}):null]),editable:!!h.id}),helperText:a}),N&&e.createElement(T,{type:"submit",size:"small",variant:"contained",color:"primary",endIcon:e.createElement(A,null),disabled:s,className:E.button},"Envoyer")))}}),e.createElement(j,{open:P,onClose:function(){return D(!1)},message:"Pour poster un commentaire, vous devez être connecté."}))},oe=E((function(){return{container:{paddingLeft:80,marginTop:8,minHeight:80,position:"relative"},avatar:{position:"absolute",top:0,left:0,bottom:0,width:64,height:64},text:{paddingTop:2,paddingBottom:8},label:{fontWeight:"bold"},content:{"& p":{marginBlockStart:"0.5em",marginBlockEnd:"0.5em"}},loading:{zIndex:1e3,backgroundColor:"white",opacity:.5,position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center",minHeight:200,marginTop:5}}})),ie=function(t){var r=t.comments,n=t.userResource,o=t.loading,i=oe(),a=R(n);return e.createElement(x,{position:"relative"},r&&r.sort((function(e,t){return new Date(t.published)-new Date(e.published)})).map((function(t){var r,o;return e.createElement(x,{className:i.container},e.createElement(x,{className:i.avatar},e.createElement(S,{record:t,reference:n,source:"attributedTo",linkType:"show"},e.createElement(P,{image:null==a||null===(r=a.fieldsMapping)||void 0===r?void 0:r.image}))),e.createElement(x,{className:i.text},e.createElement(I,{variant:"body2"},e.createElement(S,{record:t,reference:n,source:"attributedTo",linkType:"show"},e.createElement(d,{variant:"body2",source:null==a||null===(o=a.fieldsMapping)||void 0===o?void 0:o.title,className:i.label}))," • ",e.createElement(f,{record:t,variant:"body2",source:"published",showTime:!0})),e.createElement(p,{record:t,variant:"body1",source:"content",className:i.content})))})),o&&e.createElement(x,{minHeight:200},e.createElement(x,{alignItems:"center",className:i.loading},e.createElement(L,{size:60,thickness:6}))))},ae=function(e){return e?Array.isArray(e)?e:[e]:[]},ce=function(e){var i=c(),a=i.identity,u=i.loaded,s=W(n([]),2),d=s[0],f=s[1],p=W(n(!1),2),m=p[0],h=p[1],v=W(n(!1),2),y=v[0],g=v[1],b=W(n(!1),2),w=b[0],E=b[1],x=t((function(){if(e){if(e.startsWith("http"))return e;var t;if(null!=a&&a.webIdData)return null==a||null===(t=a.webIdData)||void 0===t?void 0:t[e]}}),[a,e]),O=r(G(B().mark((function e(){var t,r,n,o;return B().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(x){e.next=2;break}return e.abrupt("return");case 2:h(!0),t=new Headers({Accept:"application/ld+json"}),r=(null==a?void 0:a.id)&&new URL(a.id).origin,n=new URL(x).origin,o=localStorage.getItem("token"),r===n&&o&&t.set("Authorization","Bearer ".concat(o)),l.fetchJson(x,{headers:t}).then((function(e){var t=e.json;t&&t.items?f(ae(t.items)):t&&t.orderedItems?f(ae(t.orderedItems)):f([]),E(!1),g(!0),h(!1)})).catch((function(){E(!0),g(!0),h(!1)}));case 9:case"end":return e.stop()}}),e)}))),[f,g,h,E,x,a]);o((function(){!u||m||y||w||O()}),[O,u,m,y,w]);var T=r((function(e){f((function(t){return[].concat(K(t),[e])}))}),[f]),I=r((function(e){f((function(t){return t.filter((function(t){return"string"==typeof t?t!==e:t.id!==e}))}))}),[f]);return{items:d,loading:m,loaded:y,error:w,refetch:O,addItem:T,removeItem:I,url:x}},le=function(t){t.source;var r=t.context,n=t.helperText,o=t.placeholder,i=t.userResource,a=t.mentions,c=u(),l=ce(c.replies),s=l.items,d=l.loading,f=l.addItem,p=l.removeItem;if(!i)throw new Error("No userResource defined for CommentsField");return e.createElement(e.Fragment,null,e.createElement(ne,{context:r,helperText:n,userResource:i,placeholder:o,mentions:a,addItem:f,removeItem:p}),e.createElement(ie,{comments:s,loading:d,userResource:i}))};le.defaultProps={addLabel:!0,label:"Commentaires",placeholder:"Commencez à taper votre commentaire...",source:"id",context:"id"};var ue=["collectionUrl","resource","children"],se=function(t){var r=t.collectionUrl,n=t.resource,o=t.children,i=J(t,ue);if(1!==e.Children.count(o))throw new Error("<CollectionList> only accepts a single child");var a=m(n,r,{enabled:!!r}),c=a.data;return a.loading?e.createElement("div",{style:{marginTop:8}},e.createElement(h,null)):c?e.createElement(D,z({reference:n,record:c,source:"items"},i),o):null},de=["source","record","reference","children"],fe=function(t){var r=t.source,n=t.record,o=t.reference,i=t.children,a=J(t,de);if(1!==e.Children.count(i))throw new Error("<ReferenceCollectionField> only accepts a single child");return n&&n[r]?e.createElement(se,z({resource:o,collectionUrl:n[r]},a),i):null};fe.defaultProps={addLabel:!0};var pe=function(){var e=c().identity,n=t((function(){var t;if(null!=e&&e.webIdData)return null==e||null===(t=e.webIdData)||void 0===t?void 0:t.inbox}),[e]),o=t((function(){var t,r;if(null!=e&&e.webIdData)return(null==e||null===(t=e.webIdData)||void 0===t||null===(r=t.endpoints)||void 0===r?void 0:r["void:sparqlEndpoint"])||(null==e?void 0:e.id)+"/sparql"}),[e]);return{fetch:r(function(){var e=G(B().mark((function e(t){var r,i,a,c,u,s,d;return B().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=t.filters,console.log("inboxUrl",n,o),o&&n){e.next=4;break}return e.abrupt("return");case 4:return i=localStorage.getItem("token"),a=k(["as:object"]),c="",r&&Object.keys(r).forEach((function(e){if(r[e]){var t=r[e].startsWith("http")?"<".concat(r[e],">"):r[e];c+="?s1 ".concat(e," ").concat(t," .")}})),u="\n        PREFIX as: <https://www.w3.org/ns/activitystreams#>\n        CONSTRUCT {\n          ?s1 ?p1 ?o1 .\n          ".concat(a.construct,"\n        }\n        WHERE {\n          <").concat(n,"> as:items ?s1 .\n          ?s1 ?p1 ?o1 .\n          FILTER( (isIRI(?s1)) ) .\n          ").concat(c,"\n          ").concat(a.where,"\n        }\n      "),e.next=11,l.fetchJson(o,{method:"POST",body:u,headers:new Headers({Accept:"application/ld+json",Authorization:i?"Bearer ".concat(i):void 0})});case 11:if(s=e.sent,!(d=s.json)["@graph"]){e.next=17;break}return e.abrupt("return",d["@graph"]);case 17:return e.abrupt("return",null);case 18:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[o,n]),url:n,owner:null==e?void 0:e.id}},me=function(){return{fetch:r(function(){var e=G(B().mark((function e(t){var r,n,o,i,a,c,u,s,d;return B().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=t.split("@"),(n=W(r,3))[0],o=n[1],!(i=n[2])){e.next=18;break}return a=i.includes(":")?"http":"https",c="".concat(a,"://").concat(i,"/.well-known/webfinger?resource=acct:").concat(o,"@").concat(i),e.prev=4,e.next=7,l.fetchJson(c);case 7:return u=e.sent,s=u.json,d=s.links.find((function(e){return"application/activity+json"===e.type})),e.abrupt("return",d?d.href:null);case 13:return e.prev=13,e.t0=e.catch(4),e.abrupt("return",null);case 16:e.next=19;break;case 18:return e.abrupt("return",null);case 19:case"end":return e.stop()}}),e,null,[[4,13]])})));return function(t){return e.apply(this,arguments)}}(),[])}},he=E((function(e){return{items:{background:"#fff",borderRadius:"0.5rem",boxShadow:"0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1)",color:"rgba(0, 0, 0, 0.8)",fontSize:"0.9rem",overflow:"hidden",padding:"0.2rem",position:"relative"},item:{background:"transparent",border:"1px solid transparent",borderRadius:"0.4rem",display:"block",margin:0,padding:"0.2rem 0.4rem",textAlign:"left",width:"100%","&.selected":{borderColor:"#000"}}}})),ve=i((function(t,r){var i=W(n(0),2),c=i[0],l=i[1],u=he(),s=function(e){var r=t.items[e];r&&t.command({id:r})};return o((function(){return l(0)}),[t.items]),a(r,(function(){return{onKeyDown:function(e){var r=e.event;return"ArrowUp"===r.key?(l((c+t.items.length-1)%t.items.length),!0):"ArrowDown"===r.key?(l((c+1)%t.items.length),!0):"Enter"===r.key&&(s(c),!0)}}})),e.createElement("div",{className:u.items},t.items.length?t.items.map((function(t,r){return e.createElement("button",{className:u.item+(r===c?" selected":""),key:r,onClick:function(){return s(r)}},t.label)})):e.createElement("div",{className:u.item},"Aucun résultat"))})),ye=function(){var e,t;return{onStart:function(r){e=new F(ve,{props:r,editor:r.editor}),t=M("body",{getReferenceClientRect:r.clientRect,appendTo:function(){return document.body},content:e.element,showOnCreate:!0,interactive:!0,trigger:"manual",placement:"bottom-start"})},onUpdate:function(r){e.updateProps(r),t[0].setProps({getReferenceClientRect:r.clientRect})},onKeyDown:function(r){var n;return"Escape"===r.event.key?(t[0].hide(),!0):null===(n=e.ref)||void 0===n?void 0:n.onKeyDown(r)},onExit:function(){t[0].destroy(),e.destroy()}}},ge=function(e){var r,n,o=R(e),i=v({type:"getList",resource:e,payload:{filter:{_predicates:[null==o||null===(r=o.fieldsMapping)||void 0===r?void 0:r.title],blankNodes:[]}}},{enabled:!(null==o||null===(n=o.fieldsMapping)||void 0===n||!n.title)}).data,a=t((function(){if(i)return i.map((function(e){var t;return{id:e.id,label:e[null==o||null===(t=o.fieldsMapping)||void 0===t?void 0:t.title]}}))}),[i]);return{items:t((function(){if(a)return function(e){var t=e.query;return a.filter((function(e){return e.label.toLowerCase().startsWith(t.toLowerCase())})).slice(0,5)}}),[a]),render:ye}};export{X as ACTIVITY_TYPES,Y as ACTOR_TYPES,se as CollectionList,le as CommentsField,Z as OBJECT_TYPES,$ as PUBLIC_URI,fe as ReferenceCollectionField,ce as useCollection,pe as useInbox,ge as useMentions,ee as useOutbox,me as useWebfinger};
//# sourceMappingURL=index.es.js.map
