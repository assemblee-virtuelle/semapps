"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("react"),t=require("react-admin"),r=require("ra-richtext-tiptap"),n=require("@tiptap/extension-placeholder"),o=require("react-final-form"),a=require("@material-ui/core"),i=require("@material-ui/icons/Send"),u=require("@semapps/semantic-data-provider"),l=require("@semapps/auth-provider"),c=require("@tiptap/core"),s=require("@tiptap/extension-mention"),d=require("@semapps/field-components"),f=require("@tiptap/react"),p=require("tippy.js");function m(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var h=m(e),v=m(n),b=m(i),y=m(s),g=m(p);function w(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function E(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?w(Object(r),!0).forEach((function(t){I(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):w(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function x(){
/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
x=function(){return e};var e={},t=Object.prototype,r=t.hasOwnProperty,n="function"==typeof Symbol?Symbol:{},o=n.iterator||"@@iterator",a=n.asyncIterator||"@@asyncIterator",i=n.toStringTag||"@@toStringTag";function u(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{u({},"")}catch(e){u=function(e,t,r){return e[t]=r}}function l(e,t,r,n){var o=t&&t.prototype instanceof d?t:d,a=Object.create(o.prototype),i=new T(n||[]);return a._invoke=function(e,t,r){var n="suspendedStart";return function(o,a){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===o)throw a;return L()}for(r.method=o,r.arg=a;;){var i=r.delegate;if(i){var u=w(i,r);if(u){if(u===s)continue;return u}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var l=c(e,t,r);if("normal"===l.type){if(n=r.done?"completed":"suspendedYield",l.arg===s)continue;return{value:l.arg,done:r.done}}"throw"===l.type&&(n="completed",r.method="throw",r.arg=l.arg)}}}(e,r,i),a}function c(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=l;var s={};function d(){}function f(){}function p(){}var m={};u(m,o,(function(){return this}));var h=Object.getPrototypeOf,v=h&&h(h(I([])));v&&v!==t&&r.call(v,o)&&(m=v);var b=p.prototype=d.prototype=Object.create(m);function y(e){["next","throw","return"].forEach((function(t){u(e,t,(function(e){return this._invoke(t,e)}))}))}function g(e,t){var n;this._invoke=function(o,a){function i(){return new t((function(n,i){!function n(o,a,i,u){var l=c(e[o],e,a);if("throw"!==l.type){var s=l.arg,d=s.value;return d&&"object"==typeof d&&r.call(d,"__await")?t.resolve(d.__await).then((function(e){n("next",e,i,u)}),(function(e){n("throw",e,i,u)})):t.resolve(d).then((function(e){s.value=e,i(s)}),(function(e){return n("throw",e,i,u)}))}u(l.arg)}(o,a,n,i)}))}return n=n?n.then(i,i):i()}}function w(e,t){var r=e.iterator[t.method];if(void 0===r){if(t.delegate=null,"throw"===t.method){if(e.iterator.return&&(t.method="return",t.arg=void 0,w(e,t),"throw"===t.method))return s;t.method="throw",t.arg=new TypeError("The iterator does not provide a 'throw' method")}return s}var n=c(r,e.iterator,t.arg);if("throw"===n.type)return t.method="throw",t.arg=n.arg,t.delegate=null,s;var o=n.arg;return o?o.done?(t[e.resultName]=o.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=void 0),t.delegate=null,s):o:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,s)}function E(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function O(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function T(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(E,this),this.reset(!0)}function I(e){if(e){var t=e[o];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var n=-1,a=function t(){for(;++n<e.length;)if(r.call(e,n))return t.value=e[n],t.done=!1,t;return t.value=void 0,t.done=!0,t};return a.next=a}}return{next:L}}function L(){return{value:void 0,done:!0}}return f.prototype=p,u(b,"constructor",p),u(p,"constructor",f),f.displayName=u(p,i,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===f||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,p):(e.__proto__=p,u(e,i,"GeneratorFunction")),e.prototype=Object.create(b),e},e.awrap=function(e){return{__await:e}},y(g.prototype),u(g.prototype,a,(function(){return this})),e.AsyncIterator=g,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new g(l(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},y(b),u(b,i,"Generator"),u(b,o,(function(){return this})),u(b,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=I,T.prototype={constructor:T,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(O),!e)for(var t in this)"t"===t.charAt(0)&&r.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=void 0)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function n(r,n){return i.type="throw",i.arg=e,t.next=r,n&&(t.method="next",t.arg=void 0),!!n}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],i=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var u=r.call(a,"catchLoc"),l=r.call(a,"finallyLoc");if(u&&l){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return n(a.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=e,i.arg=t,a?(this.method="next",this.next=a.finallyLoc,s):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),s},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),O(r),s}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;O(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,r){return this.delegate={iterator:I(e),resultName:t,nextLoc:r},"next"===this.method&&(this.arg=void 0),s}},e}function O(e,t,r,n,o,a,i){try{var u=e[a](i),l=u.value}catch(e){return void r(e)}u.done?t(l):Promise.resolve(l).then(n,o)}function T(e){return function(){var t=this,r=arguments;return new Promise((function(n,o){var a=e.apply(t,r);function i(e){O(a,n,o,i,u,"next",e)}function u(e){O(a,n,o,i,u,"throw",e)}i(void 0)}))}}function I(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function L(){return(L=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function k(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}function C(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==r)return;var n,o,a=[],i=!0,u=!1;try{for(r=r.call(e);!(i=(n=r.next()).done)&&(a.push(n.value),!t||a.length!==t);i=!0);}catch(e){u=!0,o=e}finally{try{i||null==r.return||r.return()}finally{if(u)throw o}}return a}(e,t)||R(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function A(e){return function(e){if(Array.isArray(e))return S(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||R(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function R(e,t){if(e){if("string"==typeof e)return S(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?S(e,t):void 0}}function S(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var P={ARTICLE:"Article",AUDIO:"Audio",DOCUMENT:"Document",EVENT:"Event",IMAGE:"Image",NOTE:"Note",PAGE:"Page",PLACE:"Place",PROFILE:"Profile",RELATIONSHIP:"Relationship",TOMBSTONE:"Tombstone",VIDEO:"Video"},N="https://www.w3.org/ns/activitystreams#Public",j=function(){var r=t.useGetIdentity().identity,n=e.useMemo((function(){var e;if(null!=r&&r.webIdData)return null==r||null===(e=r.webIdData)||void 0===e?void 0:e.outbox}),[r]),o=e.useMemo((function(){var e,t;if(null!=r&&r.webIdData)return(null==r||null===(e=r.webIdData)||void 0===e||null===(t=e.endpoints)||void 0===t?void 0:t["void:sparqlEndpoint"])||(null==r?void 0:r.id)+"/sparql"}),[r]);return{post:e.useCallback(function(){var e=T(x().mark((function e(r){var o,a,i;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n){e.next=2;break}throw new Error("Cannot post to outbox before user identity is loaded. Please use the loaded argument of useOutbox");case 2:return o=localStorage.getItem("token"),e.next=5,t.fetchUtils.fetchJson(n,{method:"POST",body:JSON.stringify(E({"@context":"https://www.w3.org/ns/activitystreams"},r)),headers:new Headers({"Content-Type":"application/ld+json",Authorization:"Bearer ".concat(o)})});case 5:return a=e.sent,i=a.headers,e.abrupt("return",i.get("Location"));case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[n]),fetch:e.useCallback(T(x().mark((function e(){var r,a,i,l,c;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(o&&n){e.next=2;break}return e.abrupt("return");case 2:return r=localStorage.getItem("token"),a=u.buildBlankNodesQuery(["as:object"]),i="\n      PREFIX as: <https://www.w3.org/ns/activitystreams#>\n      CONSTRUCT {\n        ?s1 ?p1 ?o1 .\n        ".concat(a.construct,"\n      }\n      WHERE {\n        <").concat(n,"> as:items ?s1 .\n        ?s1 ?p1 ?o1 .\n        ").concat(a.where,"\n      }\n    "),e.next=7,t.fetchUtils.fetchJson(o,{method:"POST",body:i,headers:new Headers({Accept:"application/ld+json",Authorization:r?"Bearer ".concat(r):void 0})});case 7:if(l=e.sent,!(c=l.json)["@graph"]){e.next=13;break}return e.abrupt("return",c["@graph"]);case 13:return e.abrupt("return",null);case 14:case"end":return e.stop()}}),e)}))),[o,n]),url:n,loaded:!!n,owner:null==r?void 0:r.id}},D=y.default.extend({renderHTML:function(e){var t=e.node,r=e.HTMLAttributes;return["span",c.mergeAttributes(this.options.HTMLAttributes,r),"@".concat(t.attrs.id.label)]},addAttributes:function(){return{label:{default:null,parseHTML:function(e){return{label:e.getAttribute("data-mention-label")}},renderHTML:function(e){return e.id.label?{"data-mention-label":e.id.label}:{}}},id:{default:null,parseHTML:function(e){return{id:e.getAttribute("data-mention-id")}},renderHTML:function(e){return e.id.id?{"data-mention-id":e.id.id}:{}}}}}}),M=a.makeStyles((function(e){return{form:{marginTop:-12},container:{paddingLeft:80,position:"relative"},avatar:{position:"absolute",top:16,left:0,bottom:0,width:64,height:64},editorContent:{"& > div":{backgroundColor:"rgba(0, 0, 0, 0.09)",padding:"2px 12px",borderWidth:"0px !important",borderRadius:0,borderBottom:"1px solid #FFF",minHeight:60,outline:"unset !important"},"& > div > p":{marginTop:12,marginBottom:12,fontFamily:e.typography.body1.fontFamily,marginBlockStart:"0.5em",marginBlockEnd:"0.5em"},"& > div > p.is-editor-empty:first-child::before":{color:"grey",content:"attr(data-placeholder)",float:"left",height:0,pointerEvents:"none"},marginBottom:-19},button:{marginBottom:15}}})),F=function(n){var i=n.context,c=n.placeholder,s=n.helperText,d=n.mentions,f=n.userResource,p=n.addItem,m=n.removeItem,y=t.useRecordContext(),g=t.useGetIdentity().identity,w=u.useDataModel(f),O=M(),I=t.useNotify(),L=j(),k=C(e.useState(!1),2),R=k[0],S=k[1],F=C(e.useState(!1),2),B=F[0],U=F[1],_=e.useCallback(function(){var e=T(x().mark((function e(t,r){var n,o,a,u,l,c;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=r.reset,o=(new DOMParser).parseFromString(t.comment,"text/html"),a=Array.from(o.body.getElementsByClassName("mention")),u=[],a.forEach((function(e){var t=e.attributes["data-mention-id"].value,r=e.attributes["data-mention-label"].value,n=o.createElement("a");n.setAttribute("href",new URL(window.location.href).origin+"/"+f+"/"+encodeURIComponent(t)+"/show"),n.textContent="@"+r,e.parentNode.replaceChild(n,e),u.push(t)})),"undefined"!==o.body.innerHTML){e.next=9;break}I("Votre commentaire est vide","error"),e.next=24;break;case 9:return l=Date.now(),c={type:P.NOTE,attributedTo:L.owner,content:o.body.innerHTML,inReplyTo:y[i],published:(new Date).toISOString()},e.prev=11,p(E({id:l},c)),n(),S(!1),e.next=17,L.post(E(E({},c),{},{to:[].concat(u,[N])}));case 17:I("Commentaire posté avec succès","success"),e.next=24;break;case 20:e.prev=20,e.t0=e.catch(11),m(l),I(e.t0.message,"error");case 24:case"end":return e.stop()}}),e,null,[[11,20]])})));return function(t,r){return e.apply(this,arguments)}}(),[L,I,S,p,m]),H=e.useCallback((function(){g.id||U(!0)}),[g,U]);return d&&!d.items||!g?null:h.default.createElement(h.default.Fragment,null,h.default.createElement(o.Form,{onSubmit:_,subscription:{submitting:!0,pristine:!0},render:function(e){var t,n,o,i,u=e.handleSubmit,l=e.submitting;if(e.pristine){var f=document.getElementById("comment");f&&""!==f.textContent&&(f.innerHTML="")}return h.default.createElement("form",{onSubmit:u,className:O.form},h.default.createElement(a.Box,{className:O.container,onClick:H},h.default.createElement(a.Avatar,{src:(null==g||null===(t=g.webIdData)||void 0===t?void 0:t[null==w||null===(n=w.fieldsMapping)||void 0===n?void 0:n.image])||(null==g||null===(o=g.profileData)||void 0===o?void 0:o[null==w||null===(i=w.fieldsMapping)||void 0===i?void 0:i.image]),className:O.avatar}),h.default.createElement(r.RichTextInput,{source:"comment",label:"",toolbar:null,fullWidth:!0,classes:{editorContent:O.editorContent},editorOptions:E(E({},r.DefaultEditorOptions),{},{onFocus:function(){S(!0)},extensions:[].concat(A(r.DefaultEditorOptions.extensions),[c?v.default.configure({placeholder:c}):null,d?D.configure({HTMLAttributes:{class:"mention"},suggestion:d}):null]),editable:!!g.id}),helperText:s}),R&&h.default.createElement(a.Button,{type:"submit",size:"small",variant:"contained",color:"primary",endIcon:h.default.createElement(b.default,null),disabled:l,className:O.button},"Envoyer")))}}),h.default.createElement(l.AuthDialog,{open:B,onClose:function(){return U(!1)},message:"Pour poster un commentaire, vous devez être connecté."}))},B=a.makeStyles((function(){return{container:{paddingLeft:80,marginTop:8,minHeight:80,position:"relative"},avatar:{position:"absolute",top:0,left:0,bottom:0,width:64,height:64},text:{paddingTop:2,paddingBottom:8},label:{fontWeight:"bold"},content:{"& p":{marginBlockStart:"0.5em",marginBlockEnd:"0.5em"}},loading:{zIndex:1e3,backgroundColor:"white",opacity:.5,position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center",minHeight:200,marginTop:5}}})),U=function(e){var r=e.comments,n=e.userResource,o=e.loading,i=B(),l=u.useDataModel(n);return h.default.createElement(a.Box,{position:"relative"},r&&r.sort((function(e,t){return new Date(t.published)-new Date(e.published)})).map((function(e){var r,o;return h.default.createElement(a.Box,{className:i.container},h.default.createElement(a.Box,{className:i.avatar},h.default.createElement(d.ReferenceField,{record:e,reference:n,source:"attributedTo",linkType:"show"},h.default.createElement(d.AvatarWithLabelField,{image:null==l||null===(r=l.fieldsMapping)||void 0===r?void 0:r.image}))),h.default.createElement(a.Box,{className:i.text},h.default.createElement(a.Typography,{variant:"body2"},h.default.createElement(d.ReferenceField,{record:e,reference:n,source:"attributedTo",linkType:"show"},h.default.createElement(t.TextField,{variant:"body2",source:null==l||null===(o=l.fieldsMapping)||void 0===o?void 0:o.title,className:i.label}))," • ",h.default.createElement(t.DateField,{record:e,variant:"body2",source:"published",showTime:!0})),h.default.createElement(t.RichTextField,{record:e,variant:"body1",source:"content",className:i.content})))})),o&&h.default.createElement(a.Box,{minHeight:200},h.default.createElement(a.Box,{alignItems:"center",className:i.loading},h.default.createElement(a.CircularProgress,{size:60,thickness:6}))))},_=function(r){var n=t.useGetIdentity(),o=n.identity,a=n.loaded,i=C(e.useState([]),2),u=i[0],l=i[1],c=C(e.useState(!1),2),s=c[0],d=c[1],f=C(e.useState(!1),2),p=f[0],m=f[1],h=C(e.useState(!1),2),v=h[0],b=h[1],y=e.useMemo((function(){if(r){if(r.startsWith("http"))return r;var e;if(null!=o&&o.webIdData)return null==o||null===(e=o.webIdData)||void 0===e?void 0:e[r]}}),[o,r]),g=e.useCallback(T(x().mark((function e(){var r,n,a,i;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(y){e.next=2;break}return e.abrupt("return");case 2:d(!0),r=new Headers({Accept:"application/ld+json"}),n=o.id&&new URL(o.id).origin,a=new URL(y).origin,i=localStorage.getItem("token"),n===a&&i&&r.set("Authorization","Bearer ".concat(i)),t.fetchUtils.fetchJson(y,{headers:r}).then((function(e){var t=e.json;t&&t.items?l(t.items):t&&t.orderedItems?l(t.orderedItems):l([]),b(!1),m(!0),d(!1)})).catch((function(){b(!0),m(!0),d(!1)}));case 9:case"end":return e.stop()}}),e)}))),[l,m,d,b,y,o]);e.useEffect((function(){!a||s||p||v||g()}),[g,a,s,p,v]);var w=e.useCallback((function(e){l((function(t){return[].concat(A(t),[e])}))}),[l]),E=e.useCallback((function(e){l((function(t){return t.filter((function(t){return"string"==typeof t?t!==e:t.id!==e}))}))}),[l]);return{items:u,loading:s,loaded:p,error:v,refetch:g,addItem:w,removeItem:E,url:y}},H=function(e){e.source;var r=e.context,n=e.helperText,o=e.placeholder,a=e.userResource,i=e.mentions,u=t.useRecordContext(),l=_(u.replies),c=l.items,s=l.loading,d=l.addItem,f=l.removeItem;if(!a)throw new Error("No userResource defined for CommentsField");return h.default.createElement(h.default.Fragment,null,h.default.createElement(F,{context:r,helperText:n,userResource:a,placeholder:o,mentions:i,addItem:d,removeItem:f}),h.default.createElement(U,{comments:c,loading:s,userResource:a}))};H.defaultProps={addLabel:!0,label:"Commentaires",placeholder:"Commencez à taper votre commentaire...",source:"id",context:"id"};var G=["collectionUrl","resource","children"],q=function(e){var r=e.collectionUrl,n=e.resource,o=e.children,a=k(e,G);if(1!==h.default.Children.count(o))throw new Error("<CollectionList> only accepts a single child");var i=t.useGetOne(n,r,{enabled:!!r}),u=i.data;return i.loading?h.default.createElement("div",{style:{marginTop:8}},h.default.createElement(t.LinearProgress,null)):u?h.default.createElement(d.ReferenceArrayField,L({reference:n,record:u,source:"items"},a),o):null},V=["source","record","reference","children"],W=function(e){var t=e.source,r=e.record,n=e.reference,o=e.children,a=k(e,V);if(1!==h.default.Children.count(o))throw new Error("<ReferenceCollectionField> only accepts a single child");return r&&r[t]?h.default.createElement(q,L({resource:n,collectionUrl:r[t]},a),o):null};W.defaultProps={addLabel:!0};var z=a.makeStyles((function(e){return{items:{background:"#fff",borderRadius:"0.5rem",boxShadow:"0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1)",color:"rgba(0, 0, 0, 0.8)",fontSize:"0.9rem",overflow:"hidden",padding:"0.2rem",position:"relative"},item:{background:"transparent",border:"1px solid transparent",borderRadius:"0.4rem",display:"block",margin:0,padding:"0.2rem 0.4rem",textAlign:"left",width:"100%","&.selected":{borderColor:"#000"}}}})),J=e.forwardRef((function(t,r){var n=C(e.useState(0),2),o=n[0],a=n[1],i=z(),u=function(e){var r=t.items[e];r&&t.command({id:r})};return e.useEffect((function(){return a(0)}),[t.items]),e.useImperativeHandle(r,(function(){return{onKeyDown:function(e){var r=e.event;return"ArrowUp"===r.key?(a((o+t.items.length-1)%t.items.length),!0):"ArrowDown"===r.key?(a((o+1)%t.items.length),!0):"Enter"===r.key&&(u(o),!0)}}})),h.default.createElement("div",{className:i.items},t.items.length?t.items.map((function(e,t){return h.default.createElement("button",{className:i.item+(t===o?" selected":""),key:t,onClick:function(){return u(t)}},e.label)})):h.default.createElement("div",{className:i.item},"Aucun résultat"))})),K=function(){var e,t;return{onStart:function(r){e=new f.ReactRenderer(J,{props:r,editor:r.editor}),t=g.default("body",{getReferenceClientRect:r.clientRect,appendTo:function(){return document.body},content:e.element,showOnCreate:!0,interactive:!0,trigger:"manual",placement:"bottom-start"})},onUpdate:function(r){e.updateProps(r),t[0].setProps({getReferenceClientRect:r.clientRect})},onKeyDown:function(r){var n;return"Escape"===r.event.key?(t[0].hide(),!0):null===(n=e.ref)||void 0===n?void 0:n.onKeyDown(r)},onExit:function(){t[0].destroy(),e.destroy()}}};exports.ACTIVITY_TYPES={ACCEPT:"Accept",ADD:"Add",ANNOUNCE:"Announce",ARRIVE:"Arrive",BLOCK:"Block",CREATE:"Create",DELETE:"Delete",DISLIKE:"Dislike",FLAG:"Flag",FOLLOW:"Follow",IGNORE:"Ignore",INVITE:"Invite",JOIN:"Join",LEAVE:"Leave",LIKE:"Like",LISTEN:"Listen",MOVE:"Move",OFFER:"Offer",QUESTION:"Question",REJECT:"Reject",READ:"Read",REMOVE:"Remove",TENTATIVE_REJECT:"TentativeReject",TENTATIVE_ACCEPT:"TentativeAccept",TRAVAL:"Travel",UNDO:"Undo",UPDATE:"Update",VIEW:"View"},exports.ACTOR_TYPES={APPLICATION:"Application",GROUP:"Group",ORGANIZATION:"Organization",PERSON:"Person",SERVICE:"Service"},exports.CollectionList=q,exports.CommentsField=H,exports.OBJECT_TYPES=P,exports.PUBLIC_URI=N,exports.ReferenceCollectionField=W,exports.useCollection=_,exports.useInbox=function(){var r=t.useGetIdentity().identity,n=e.useMemo((function(){var e;if(null!=r&&r.webIdData)return null==r||null===(e=r.webIdData)||void 0===e?void 0:e.inbox}),[r]),o=e.useMemo((function(){var e,t;if(null!=r&&r.webIdData)return(null==r||null===(e=r.webIdData)||void 0===e||null===(t=e.endpoints)||void 0===t?void 0:t["void:sparqlEndpoint"])||(null==r?void 0:r.id)+"/sparql"}),[r]);return{fetch:e.useCallback(function(){var e=T(x().mark((function e(r){var a,i,l,c,s,d,f;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=r.filters,console.log("inboxUrl",n,o),o&&n){e.next=4;break}return e.abrupt("return");case 4:return i=localStorage.getItem("token"),l=u.buildBlankNodesQuery(["as:object"]),c="",a&&Object.keys(a).forEach((function(e){if(a[e]){var t=a[e].startsWith("http")?"<".concat(a[e],">"):a[e];c+="?s1 ".concat(e," ").concat(t," .")}})),s="\n        PREFIX as: <https://www.w3.org/ns/activitystreams#>\n        CONSTRUCT {\n          ?s1 ?p1 ?o1 .\n          ".concat(l.construct,"\n        }\n        WHERE {\n          <").concat(n,"> as:items ?s1 .\n          ?s1 ?p1 ?o1 .\n          FILTER( (isIRI(?s1)) ) .\n          ").concat(c,"\n          ").concat(l.where,"\n        }\n      "),e.next=11,t.fetchUtils.fetchJson(o,{method:"POST",body:s,headers:new Headers({Accept:"application/ld+json",Authorization:i?"Bearer ".concat(i):void 0})});case 11:if(d=e.sent,!(f=d.json)["@graph"]){e.next=17;break}return e.abrupt("return",f["@graph"]);case 17:return e.abrupt("return",null);case 18:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[o,n]),url:n,owner:null==r?void 0:r.id}},exports.useMentions=function(r){var n,o,a=u.useDataModel(r),i=t.useQuery({type:"getList",resource:r,payload:{filter:{_predicates:[null==a||null===(n=a.fieldsMapping)||void 0===n?void 0:n.title],blankNodes:[]}}},{enabled:!(null==a||null===(o=a.fieldsMapping)||void 0===o||!o.title)}).data,l=e.useMemo((function(){if(i)return i.map((function(e){var t;return{id:e.id,label:e[null==a||null===(t=a.fieldsMapping)||void 0===t?void 0:t.title]}}))}),[i]);return{items:e.useMemo((function(){if(l)return function(e){var t=e.query;return l.filter((function(e){return e.label.toLowerCase().startsWith(t.toLowerCase())})).slice(0,5)}}),[l]),render:K}},exports.useOutbox=j,exports.useWebfinger=function(){return{fetch:e.useCallback(function(){var e=T(x().mark((function e(r){var n,o,a,i,u,l,c,s,d;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=r.split("@"),(o=C(n,3))[0],a=o[1],!(i=o[2])){e.next=18;break}return u=i.includes(":")?"http":"https",l="".concat(u,"://").concat(i,"/.well-known/webfinger?resource=acct:").concat(a,"@").concat(i),e.prev=4,e.next=7,t.fetchUtils.fetchJson(l);case 7:return c=e.sent,s=c.json,d=s.links.find((function(e){return"application/activity+json"===e.type})),e.abrupt("return",d?d.href:null);case 13:return e.prev=13,e.t0=e.catch(4),e.abrupt("return",null);case 16:e.next=19;break;case 18:return e.abrupt("return",null);case 19:case"end":return e.stop()}}),e,null,[[4,13]])})));return function(t){return e.apply(this,arguments)}}(),[])}};
//# sourceMappingURL=index.cjs.js.map
