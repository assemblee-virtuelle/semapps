"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("react"),t=require("react-admin"),r=require("ra-richtext-tiptap"),n=require("@tiptap/extension-placeholder"),o=require("react-final-form"),i=require("@material-ui/core"),a=require("@material-ui/icons/Send"),u=require("@semapps/semantic-data-provider"),l=require("@semapps/auth-provider"),c=require("@tiptap/core"),s=require("@tiptap/extension-mention"),d=require("@semapps/field-components"),f=require("@tiptap/react"),p=require("tippy.js");function m(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var h=m(e),v=m(n),y=m(a),b=m(s),g=m(p);function w(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function E(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?w(Object(r),!0).forEach((function(t){I(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):w(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function x(){
/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
x=function(){return e};var e={},t=Object.prototype,r=t.hasOwnProperty,n="function"==typeof Symbol?Symbol:{},o=n.iterator||"@@iterator",i=n.asyncIterator||"@@asyncIterator",a=n.toStringTag||"@@toStringTag";function u(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{u({},"")}catch(e){u=function(e,t,r){return e[t]=r}}function l(e,t,r,n){var o=t&&t.prototype instanceof d?t:d,i=Object.create(o.prototype),a=new T(n||[]);return i._invoke=function(e,t,r){var n="suspendedStart";return function(o,i){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===o)throw i;return L()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var u=w(a,r);if(u){if(u===s)continue;return u}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var l=c(e,t,r);if("normal"===l.type){if(n=r.done?"completed":"suspendedYield",l.arg===s)continue;return{value:l.arg,done:r.done}}"throw"===l.type&&(n="completed",r.method="throw",r.arg=l.arg)}}}(e,r,a),i}function c(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=l;var s={};function d(){}function f(){}function p(){}var m={};u(m,o,(function(){return this}));var h=Object.getPrototypeOf,v=h&&h(h(I([])));v&&v!==t&&r.call(v,o)&&(m=v);var y=p.prototype=d.prototype=Object.create(m);function b(e){["next","throw","return"].forEach((function(t){u(e,t,(function(e){return this._invoke(t,e)}))}))}function g(e,t){var n;this._invoke=function(o,i){function a(){return new t((function(n,a){!function n(o,i,a,u){var l=c(e[o],e,i);if("throw"!==l.type){var s=l.arg,d=s.value;return d&&"object"==typeof d&&r.call(d,"__await")?t.resolve(d.__await).then((function(e){n("next",e,a,u)}),(function(e){n("throw",e,a,u)})):t.resolve(d).then((function(e){s.value=e,a(s)}),(function(e){return n("throw",e,a,u)}))}u(l.arg)}(o,i,n,a)}))}return n=n?n.then(a,a):a()}}function w(e,t){var r=e.iterator[t.method];if(void 0===r){if(t.delegate=null,"throw"===t.method){if(e.iterator.return&&(t.method="return",t.arg=void 0,w(e,t),"throw"===t.method))return s;t.method="throw",t.arg=new TypeError("The iterator does not provide a 'throw' method")}return s}var n=c(r,e.iterator,t.arg);if("throw"===n.type)return t.method="throw",t.arg=n.arg,t.delegate=null,s;var o=n.arg;return o?o.done?(t[e.resultName]=o.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=void 0),t.delegate=null,s):o:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,s)}function E(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function O(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function T(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(E,this),this.reset(!0)}function I(e){if(e){var t=e[o];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var n=-1,i=function t(){for(;++n<e.length;)if(r.call(e,n))return t.value=e[n],t.done=!1,t;return t.value=void 0,t.done=!0,t};return i.next=i}}return{next:L}}function L(){return{value:void 0,done:!0}}return f.prototype=p,u(y,"constructor",p),u(p,"constructor",f),f.displayName=u(p,a,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===f||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,p):(e.__proto__=p,u(e,a,"GeneratorFunction")),e.prototype=Object.create(y),e},e.awrap=function(e){return{__await:e}},b(g.prototype),u(g.prototype,i,(function(){return this})),e.AsyncIterator=g,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new g(l(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},b(y),u(y,a,"Generator"),u(y,o,(function(){return this})),u(y,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=I,T.prototype={constructor:T,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(O),!e)for(var t in this)"t"===t.charAt(0)&&r.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=void 0)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function n(r,n){return a.type="throw",a.arg=e,t.next=r,n&&(t.method="next",t.arg=void 0),!!n}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var u=r.call(i,"catchLoc"),l=r.call(i,"finallyLoc");if(u&&l){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=e,a.arg=t,i?(this.method="next",this.next=i.finallyLoc,s):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),s},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),O(r),s}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;O(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,r){return this.delegate={iterator:I(e),resultName:t,nextLoc:r},"next"===this.method&&(this.arg=void 0),s}},e}function O(e,t,r,n,o,i,a){try{var u=e[i](a),l=u.value}catch(e){return void r(e)}u.done?t(l):Promise.resolve(l).then(n,o)}function T(e){return function(){var t=this,r=arguments;return new Promise((function(n,o){var i=e.apply(t,r);function a(e){O(i,n,o,a,u,"next",e)}function u(e){O(i,n,o,a,u,"throw",e)}a(void 0)}))}}function I(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function L(){return(L=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function A(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}function k(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==r)return;var n,o,i=[],a=!0,u=!1;try{for(r=r.call(e);!(a=(n=r.next()).done)&&(i.push(n.value),!t||i.length!==t);a=!0);}catch(e){u=!0,o=e}finally{try{a||null==r.return||r.return()}finally{if(u)throw o}}return i}(e,t)||R(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function C(e){return function(e){if(Array.isArray(e))return S(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||R(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function R(e,t){if(e){if("string"==typeof e)return S(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?S(e,t):void 0}}function S(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var P={ARTICLE:"Article",AUDIO:"Audio",DOCUMENT:"Document",EVENT:"Event",IMAGE:"Image",NOTE:"Note",PAGE:"Page",PLACE:"Place",PROFILE:"Profile",RELATIONSHIP:"Relationship",TOMBSTONE:"Tombstone",VIDEO:"Video"},N="https://www.w3.org/ns/activitystreams#Public",j=function(){var r=t.useGetIdentity().identity,n=e.useMemo((function(){var e;if(null!=r&&r.webIdData)return null==r||null===(e=r.webIdData)||void 0===e?void 0:e.outbox}),[r]),o=e.useMemo((function(){var e,t;if(null!=r&&r.webIdData)return(null==r||null===(e=r.webIdData)||void 0===e||null===(t=e.endpoints)||void 0===t?void 0:t["void:sparqlEndpoint"])||(null==r?void 0:r.id)+"/sparql"}),[r]);return{post:e.useCallback(function(){var e=T(x().mark((function e(r){var o,i,a;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return o=localStorage.getItem("token"),e.next=3,t.fetchUtils.fetchJson(n,{method:"POST",body:JSON.stringify(E({"@context":"https://www.w3.org/ns/activitystreams"},r)),headers:new Headers({"Content-Type":"application/ld+json",Authorization:"Bearer ".concat(o)})});case 3:return i=e.sent,a=i.headers,e.abrupt("return",a.get("Location"));case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[n]),fetch:e.useCallback(T(x().mark((function e(){var r,i,a,l,c;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(o&&n){e.next=2;break}return e.abrupt("return");case 2:return r=localStorage.getItem("token"),i=u.buildBlankNodesQuery(["as:object"]),a="\n      PREFIX as: <https://www.w3.org/ns/activitystreams#>\n      CONSTRUCT {\n        ?s1 ?p1 ?o1 .\n        ".concat(i.construct,"\n      }\n      WHERE {\n        <").concat(n,"> as:items ?s1 .\n        ?s1 ?p1 ?o1 .\n        ").concat(i.where,"\n      }\n    "),e.next=7,t.fetchUtils.fetchJson(o,{method:"POST",body:a,headers:new Headers({Accept:"application/ld+json",Authorization:r?"Bearer ".concat(r):void 0})});case 7:if(l=e.sent,!(c=l.json)["@graph"]){e.next=13;break}return e.abrupt("return",c["@graph"]);case 13:return e.abrupt("return",null);case 14:case"end":return e.stop()}}),e)}))),[o,n]),url:n,owner:null==r?void 0:r.id}},D=b.default.extend({renderHTML:function(e){var t=e.node,r=e.HTMLAttributes;return["span",c.mergeAttributes(this.options.HTMLAttributes,r),"@".concat(t.attrs.id.label)]},addAttributes:function(){return{label:{default:null,parseHTML:function(e){return{label:e.getAttribute("data-mention-label")}},renderHTML:function(e){return e.id.label?{"data-mention-label":e.id.label}:{}}},id:{default:null,parseHTML:function(e){return{id:e.getAttribute("data-mention-id")}},renderHTML:function(e){return e.id.id?{"data-mention-id":e.id.id}:{}}}}}}),M=i.makeStyles((function(e){return{form:{marginTop:-12},container:{paddingLeft:80,position:"relative"},avatar:{position:"absolute",top:16,left:0,bottom:0,width:64,height:64},editorContent:{"& > div":{backgroundColor:"rgba(0, 0, 0, 0.09)",padding:"2px 12px",borderWidth:"0px !important",borderRadius:0,borderBottom:"1px solid #FFF",minHeight:60,outline:"unset !important"},"& > div > p":{marginTop:12,marginBottom:12,fontFamily:e.typography.body1.fontFamily,marginBlockStart:"0.5em",marginBlockEnd:"0.5em"},"& > div > p.is-editor-empty:first-child::before":{color:"grey",content:"attr(data-placeholder)",float:"left",height:0,pointerEvents:"none"},marginBottom:-19},button:{marginBottom:15}}})),F=function(n){var a=n.context,c=n.placeholder,s=n.helperText,d=n.mentions,f=n.userResource,p=n.addItem,m=n.removeItem,b=t.useRecordContext(),g=t.useGetIdentity().identity,w=u.useDataModel(f),O=M(),I=t.useNotify(),L=j(),A=k(e.useState(!1),2),R=A[0],S=A[1],F=k(e.useState(!1),2),B=F[0],U=F[1],_=e.useCallback(function(){var e=T(x().mark((function e(t,r){var n,o,i,u,l,c;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=r.reset,o=(new DOMParser).parseFromString(t.comment,"text/html"),i=Array.from(o.body.getElementsByClassName("mention")),u=[],i.forEach((function(e){var t=e.attributes["data-mention-id"].value,r=e.attributes["data-mention-label"].value,n=o.createElement("a");n.setAttribute("href",new URL(window.location.href).origin+"/"+f+"/"+encodeURIComponent(t)+"/show"),n.textContent="@"+r,e.parentNode.replaceChild(n,e),u.push(t)})),"undefined"!==o.body.innerHTML){e.next=9;break}I("Votre commentaire est vide","error"),e.next=24;break;case 9:return l=Date.now(),c={type:P.NOTE,attributedTo:L.owner,content:o.body.innerHTML,inReplyTo:b[a],published:(new Date).toISOString()},e.prev=11,p(E({id:l},c)),n(),S(!1),e.next=17,L.post(E(E({},c),{},{to:[].concat(u,[N])}));case 17:I("Commentaire posté avec succès","success"),e.next=24;break;case 20:e.prev=20,e.t0=e.catch(11),m(l),I(e.t0.message,"error");case 24:case"end":return e.stop()}}),e,null,[[11,20]])})));return function(t,r){return e.apply(this,arguments)}}(),[L,I,S,p,m]),H=e.useCallback((function(){g.id||U(!0)}),[g,U]);return d&&!d.items||!g?null:h.default.createElement(h.default.Fragment,null,h.default.createElement(o.Form,{onSubmit:_,subscription:{submitting:!0,pristine:!0},render:function(e){var t,n,o,a,u=e.handleSubmit,l=e.submitting;if(e.pristine){var f=document.getElementById("comment");f&&""!==f.textContent&&(f.innerHTML="")}return h.default.createElement("form",{onSubmit:u,className:O.form},h.default.createElement(i.Box,{className:O.container,onClick:H},h.default.createElement(i.Avatar,{src:(null==g||null===(t=g.webIdData)||void 0===t?void 0:t[null==w||null===(n=w.fieldsMapping)||void 0===n?void 0:n.image])||(null==g||null===(o=g.profileData)||void 0===o?void 0:o[null==w||null===(a=w.fieldsMapping)||void 0===a?void 0:a.image]),className:O.avatar}),h.default.createElement(r.RichTextInput,{source:"comment",label:"",toolbar:null,fullWidth:!0,classes:{editorContent:O.editorContent},editorOptions:E(E({},r.DefaultEditorOptions),{},{onFocus:function(){S(!0)},extensions:[].concat(C(r.DefaultEditorOptions.extensions),[c?v.default.configure({placeholder:c}):null,d?D.configure({HTMLAttributes:{class:"mention"},suggestion:d}):null]),editable:!!g.id}),helperText:s}),R&&h.default.createElement(i.Button,{type:"submit",size:"small",variant:"contained",color:"primary",endIcon:h.default.createElement(y.default,null),disabled:l,className:O.button},"Envoyer")))}}),h.default.createElement(l.AuthDialog,{open:B,onClose:function(){return U(!1)},message:"Pour poster un commentaire, vous devez être connecté."}))},B=i.makeStyles((function(){return{container:{paddingLeft:80,marginTop:8,minHeight:80,position:"relative"},avatar:{position:"absolute",top:0,left:0,bottom:0,width:64,height:64},text:{paddingTop:2,paddingBottom:8},label:{fontWeight:"bold"},content:{"& p":{marginBlockStart:"0.5em",marginBlockEnd:"0.5em"}},loading:{zIndex:1e3,backgroundColor:"white",opacity:.5,position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center",minHeight:200,marginTop:5}}})),U=function(e){var r=e.comments,n=e.userResource,o=e.loading,a=B(),l=u.useDataModel(n);return h.default.createElement(i.Box,{position:"relative"},r&&r.sort((function(e,t){return new Date(t.published)-new Date(e.published)})).map((function(e){var r,o;return h.default.createElement(i.Box,{className:a.container},h.default.createElement(i.Box,{className:a.avatar},h.default.createElement(d.ReferenceField,{record:e,reference:n,source:"attributedTo",linkType:"show"},h.default.createElement(d.AvatarWithLabelField,{image:null==l||null===(r=l.fieldsMapping)||void 0===r?void 0:r.image}))),h.default.createElement(i.Box,{className:a.text},h.default.createElement(i.Typography,{variant:"body2"},h.default.createElement(d.ReferenceField,{record:e,reference:n,source:"attributedTo",linkType:"show"},h.default.createElement(t.TextField,{variant:"body2",source:null==l||null===(o=l.fieldsMapping)||void 0===o?void 0:o.title,className:a.label}))," • ",h.default.createElement(t.DateField,{record:e,variant:"body2",source:"published",showTime:!0})),h.default.createElement(t.RichTextField,{record:e,variant:"body1",source:"content",className:a.content})))})),o&&h.default.createElement(i.Box,{minHeight:200},h.default.createElement(i.Box,{alignItems:"center",className:a.loading},h.default.createElement(i.CircularProgress,{size:60,thickness:6}))))},_=function(e){return e?Array.isArray(e)?e:[e]:[]},H=function(r){var n=t.useGetIdentity(),o=n.identity,i=n.loaded,a=k(e.useState([]),2),u=a[0],l=a[1],c=k(e.useState(!1),2),s=c[0],d=c[1],f=k(e.useState(!1),2),p=f[0],m=f[1],h=k(e.useState(!1),2),v=h[0],y=h[1],b=e.useMemo((function(){if(r){if(r.startsWith("http"))return r;var e;if(null!=o&&o.webIdData)return null==o||null===(e=o.webIdData)||void 0===e?void 0:e[r]}}),[o,r]),g=e.useCallback(T(x().mark((function e(){var r,n,i,a;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(b){e.next=2;break}return e.abrupt("return");case 2:d(!0),r=new Headers({Accept:"application/ld+json"}),n=(null==o?void 0:o.id)&&new URL(o.id).origin,i=new URL(b).origin,a=localStorage.getItem("token"),n===i&&a&&r.set("Authorization","Bearer ".concat(a)),t.fetchUtils.fetchJson(b,{headers:r}).then((function(e){var t=e.json;t&&t.items?l(_(t.items)):t&&t.orderedItems?l(_(t.orderedItems)):l([]),y(!1),m(!0),d(!1)})).catch((function(){y(!0),m(!0),d(!1)}));case 9:case"end":return e.stop()}}),e)}))),[l,m,d,y,b,o]);e.useEffect((function(){!i||s||p||v||g()}),[g,i,s,p,v]);var w=e.useCallback((function(e){l((function(t){return[].concat(C(t),[e])}))}),[l]),E=e.useCallback((function(e){l((function(t){return t.filter((function(t){return"string"==typeof t?t!==e:t.id!==e}))}))}),[l]);return{items:u,loading:s,loaded:p,error:v,refetch:g,addItem:w,removeItem:E,url:b}},G=function(e){e.source;var r=e.context,n=e.helperText,o=e.placeholder,i=e.userResource,a=e.mentions,u=t.useRecordContext(),l=H(u.replies),c=l.items,s=l.loading,d=l.addItem,f=l.removeItem;if(!i)throw new Error("No userResource defined for CommentsField");return h.default.createElement(h.default.Fragment,null,h.default.createElement(F,{context:r,helperText:n,userResource:i,placeholder:o,mentions:a,addItem:d,removeItem:f}),h.default.createElement(U,{comments:c,loading:s,userResource:i}))};G.defaultProps={addLabel:!0,label:"Commentaires",placeholder:"Commencez à taper votre commentaire...",source:"id",context:"id"};var q=["collectionUrl","resource","children"],V=function(e){var r=e.collectionUrl,n=e.resource,o=e.children,i=A(e,q);if(1!==h.default.Children.count(o))throw new Error("<CollectionList> only accepts a single child");var a=t.useGetOne(n,r,{enabled:!!r}),u=a.data;return a.loading?h.default.createElement("div",{style:{marginTop:8}},h.default.createElement(t.LinearProgress,null)):u?h.default.createElement(d.ReferenceArrayField,L({reference:n,record:u,source:"items"},i),o):null},W=["source","record","reference","children"],z=function(e){var t=e.source,r=e.record,n=e.reference,o=e.children,i=A(e,W);if(1!==h.default.Children.count(o))throw new Error("<ReferenceCollectionField> only accepts a single child");return r&&r[t]?h.default.createElement(V,L({resource:n,collectionUrl:r[t]},i),o):null};z.defaultProps={addLabel:!0};var J=i.makeStyles((function(e){return{items:{background:"#fff",borderRadius:"0.5rem",boxShadow:"0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1)",color:"rgba(0, 0, 0, 0.8)",fontSize:"0.9rem",overflow:"hidden",padding:"0.2rem",position:"relative"},item:{background:"transparent",border:"1px solid transparent",borderRadius:"0.4rem",display:"block",margin:0,padding:"0.2rem 0.4rem",textAlign:"left",width:"100%","&.selected":{borderColor:"#000"}}}})),K=e.forwardRef((function(t,r){var n=k(e.useState(0),2),o=n[0],i=n[1],a=J(),u=function(e){var r=t.items[e];r&&t.command({id:r})};return e.useEffect((function(){return i(0)}),[t.items]),e.useImperativeHandle(r,(function(){return{onKeyDown:function(e){var r=e.event;return"ArrowUp"===r.key?(i((o+t.items.length-1)%t.items.length),!0):"ArrowDown"===r.key?(i((o+1)%t.items.length),!0):"Enter"===r.key&&(u(o),!0)}}})),h.default.createElement("div",{className:a.items},t.items.length?t.items.map((function(e,t){return h.default.createElement("button",{className:a.item+(t===o?" selected":""),key:t,onClick:function(){return u(t)}},e.label)})):h.default.createElement("div",{className:a.item},"Aucun résultat"))})),Y=function(){var e,t;return{onStart:function(r){e=new f.ReactRenderer(K,{props:r,editor:r.editor}),t=g.default("body",{getReferenceClientRect:r.clientRect,appendTo:function(){return document.body},content:e.element,showOnCreate:!0,interactive:!0,trigger:"manual",placement:"bottom-start"})},onUpdate:function(r){e.updateProps(r),t[0].setProps({getReferenceClientRect:r.clientRect})},onKeyDown:function(r){var n;return"Escape"===r.event.key?(t[0].hide(),!0):null===(n=e.ref)||void 0===n?void 0:n.onKeyDown(r)},onExit:function(){t[0].destroy(),e.destroy()}}};exports.ACTIVITY_TYPES={ACCEPT:"Accept",ADD:"Add",ANNOUNCE:"Announce",ARRIVE:"Arrive",BLOCK:"Block",CREATE:"Create",DELETE:"Delete",DISLIKE:"Dislike",FLAG:"Flag",FOLLOW:"Follow",IGNORE:"Ignore",INVITE:"Invite",JOIN:"Join",LEAVE:"Leave",LIKE:"Like",LISTEN:"Listen",MOVE:"Move",OFFER:"Offer",QUESTION:"Question",REJECT:"Reject",READ:"Read",REMOVE:"Remove",TENTATIVE_REJECT:"TentativeReject",TENTATIVE_ACCEPT:"TentativeAccept",TRAVAL:"Travel",UNDO:"Undo",UPDATE:"Update",VIEW:"View"},exports.ACTOR_TYPES={APPLICATION:"Application",GROUP:"Group",ORGANIZATION:"Organization",PERSON:"Person",SERVICE:"Service"},exports.CollectionList=V,exports.CommentsField=G,exports.OBJECT_TYPES=P,exports.PUBLIC_URI=N,exports.ReferenceCollectionField=z,exports.useCollection=H,exports.useInbox=function(){var r=t.useGetIdentity().identity,n=e.useMemo((function(){var e;if(null!=r&&r.webIdData)return null==r||null===(e=r.webIdData)||void 0===e?void 0:e.inbox}),[r]),o=e.useMemo((function(){var e,t;if(null!=r&&r.webIdData)return(null==r||null===(e=r.webIdData)||void 0===e||null===(t=e.endpoints)||void 0===t?void 0:t["void:sparqlEndpoint"])||(null==r?void 0:r.id)+"/sparql"}),[r]);return{fetch:e.useCallback(function(){var e=T(x().mark((function e(r){var i,a,l,c,s,d,f;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(i=r.filters,console.log("inboxUrl",n,o),o&&n){e.next=4;break}return e.abrupt("return");case 4:return a=localStorage.getItem("token"),l=u.buildBlankNodesQuery(["as:object"]),c="",i&&Object.keys(i).forEach((function(e){if(i[e]){var t=i[e].startsWith("http")?"<".concat(i[e],">"):i[e];c+="?s1 ".concat(e," ").concat(t," .")}})),s="\n        PREFIX as: <https://www.w3.org/ns/activitystreams#>\n        CONSTRUCT {\n          ?s1 ?p1 ?o1 .\n          ".concat(l.construct,"\n        }\n        WHERE {\n          <").concat(n,"> as:items ?s1 .\n          ?s1 ?p1 ?o1 .\n          FILTER( (isIRI(?s1)) ) .\n          ").concat(c,"\n          ").concat(l.where,"\n        }\n      "),e.next=11,t.fetchUtils.fetchJson(o,{method:"POST",body:s,headers:new Headers({Accept:"application/ld+json",Authorization:a?"Bearer ".concat(a):void 0})});case 11:if(d=e.sent,!(f=d.json)["@graph"]){e.next=17;break}return e.abrupt("return",f["@graph"]);case 17:return e.abrupt("return",null);case 18:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[o,n]),url:n,owner:null==r?void 0:r.id}},exports.useMentions=function(r){var n,o,i=u.useDataModel(r),a=t.useQuery({type:"getList",resource:r,payload:{filter:{_predicates:[null==i||null===(n=i.fieldsMapping)||void 0===n?void 0:n.title],blankNodes:[]}}},{enabled:!(null==i||null===(o=i.fieldsMapping)||void 0===o||!o.title)}).data,l=e.useMemo((function(){if(a)return a.map((function(e){var t;return{id:e.id,label:e[null==i||null===(t=i.fieldsMapping)||void 0===t?void 0:t.title]}}))}),[a]);return{items:e.useMemo((function(){if(l)return function(e){var t=e.query;return l.filter((function(e){return e.label.toLowerCase().startsWith(t.toLowerCase())})).slice(0,5)}}),[l]),render:Y}},exports.useOutbox=j,exports.useWebfinger=function(){return{fetch:e.useCallback(function(){var e=T(x().mark((function e(r){var n,o,i,a,u,l,c,s,d;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=r.split("@"),(o=k(n,3))[0],i=o[1],!(a=o[2])){e.next=18;break}return u=a.includes(":")?"http":"https",l="".concat(u,"://").concat(a,"/.well-known/webfinger?resource=acct:").concat(i,"@").concat(a),e.prev=4,e.next=7,t.fetchUtils.fetchJson(l);case 7:return c=e.sent,s=c.json,d=s.links.find((function(e){return"application/activity+json"===e.type})),e.abrupt("return",d?d.href:null);case 13:return e.prev=13,e.t0=e.catch(4),e.abrupt("return",null);case 16:e.next=19;break;case 18:return e.abrupt("return",null);case 19:case"end":return e.stop()}}),e,null,[[4,13]])})));return function(t){return e.apply(this,arguments)}}(),[])}};
//# sourceMappingURL=index.cjs.js.map
