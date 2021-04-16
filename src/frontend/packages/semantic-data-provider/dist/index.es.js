import e,{useState as r,useEffect as t}from"react";import{ImageField as n,ReferenceArrayField as a,ReferenceField as o,ArrayField as i,useDataProvider as c,DateTimeInput as u,useResourceContext as s,ReferenceArrayInput as f,ReferenceInput as l,ArrayInput as p,SimpleFormIterator as d,TextInput as y,fetchUtils as m}from"react-admin";import{Box as h,Typography as b}from"@material-ui/core";import{makeStyles as g}from"@material-ui/core/styles";import v from"jsonld";function w(e){return(w="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function x(e,r,t,n,a,o,i){try{var c=e[o](i),u=c.value}catch(e){return void t(e)}c.done?r(u):Promise.resolve(u).then(n,a)}function j(e){return function(){var r=this,t=arguments;return new Promise((function(n,a){var o=e.apply(r,t);function i(e){x(o,n,a,i,c,"next",e)}function c(e){x(o,n,a,i,c,"throw",e)}i(void 0)}))}}function O(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function E(){return(E=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e}).apply(this,arguments)}function k(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function A(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?k(Object(t),!0).forEach((function(r){O(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):k(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function R(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}function P(e,r){return function(e){if(Array.isArray(e))return e}(e)||function(e,r){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var t=[],n=!0,a=!1,o=void 0;try{for(var i,c=e[Symbol.iterator]();!(n=(i=c.next()).done)&&(t.push(i.value),!r||t.length!==r);n=!0);}catch(e){a=!0,o=e}finally{try{n||null==c.return||c.return()}finally{if(a)throw o}}return t}(e,r)||S(e,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function S(e,r){if(e){if("string"==typeof e)return T(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?T(e,r):void 0}}function T(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=new Array(r);t<r;t++)n[t]=e[t];return n}function I(e){if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(e=S(e))){var r=0,t=function(){};return{s:t,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:t}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var n,a,o=!0,i=!1;return{s:function(){n=e[Symbol.iterator]()},n:function(){var e=n.next();return o=e.done,e},e:function(e){i=!0,a=e},f:function(){try{o||null==n.return||n.return()}finally{if(i)throw a}}}}var C=function(r){var t=r.record,a=r.source,o=R(r,["record","source"]);return"string"==typeof t&&(t=O({},a,t)),e.createElement(n,E({record:t,source:a},o))},L=function(r){var t=r.record,n=r.source,o=R(r,["record","source"]);return(null==t?void 0:t[n])&&(Array.isArray(t[n])||(t[n]=[t[n]]),t[n]=t[n].map((function(e){return e["@id"]||e.id||e}))),e.createElement(a,E({record:t,source:n},o))};L.defaultProps={addLabel:!0};var F=function(r){var t=r.record,n=r.source,a=R(r,["record","source"]);return t[n]&&"object"===w(t[n])&&(t[n]=t[n]["@id"]||t[n].id),e.createElement(o,E({record:t,source:n},a))};F.defaultProps={addLabel:!0};var U=function(n){var a=n.children,o=n.record,c=n.filter,u=n.source,s=R(n,["children","record","filter","source"]),f=P(r(),2),l=f[0],p=f[1];return t((function(){if(o&&u&&Array.isArray(o[u])){var e=o[u].filter((function(e){var r=!0;for(var t in c){var n=e[t];Array.isArray(n)?n.includes(c[t])||(r=!1):n!==c[t]&&(r=!1)}return r})),r=A({},o);r[u]=e,p(r)}}),[o,u,c]),e.createElement(i,E({record:l,source:u},s),a)};U.defaultProps={addLabel:!0};var D=function(n){var a=n.children,o=n.groupReference,i=n.groupLabel,u=n.filterProperty,s=n.groupComponent,f=n.groupVariant,l=R(n,["children","groupReference","groupLabel","filterProperty","groupComponent","groupVariant"]),p=c(),d=P(r(),2),y=d[0],m=d[1];return t((function(){y||p.getResources().then((function(e){var r=e.data[o];p.getList(o,{"@id":r.containerUri}).then((function(e){m(e.data)})).catch((function(e){m([])}))}))}),[y]),e.createElement(e.Fragment,null,null==y?void 0:y.map((function(r,t){var n={};return n[u]=r.id,e.createElement(h,{key:t},s&&s(r),!s&&e.createElement(b,{variant:f,align:"left",noWrap:!0},r[i]),e.createElement(U,E({},l,{filter:n}),a))})))};D.defaultProps={addLabel:!0};var M=function(r){return e.createElement(u,E({},r,{format:function(e){return e&&e.replace(" ","T").replace("Z","")}}))},N=function(r){var t=s({});return e.createElement(f,E({},r,{resource:t,format:function(e){return e?(Array.isArray(e)||(e=[e]),r.format&&(e=r.format(e)),e.map((function(e){return"object"===w(e)?e.id||e["@id"]:e}))):e}}))},q=function(r){var t=s({});return e.createElement(l,E({},r,{resource:t,format:function(e){return e?(r.format&&(e=r.format(e)),"object"===w(e)?e.id||e["@id"]:e):e}}))},H=g({form:{display:"flex"},input:{paddingRight:"20px"}}),W=g({root:{display:"none"}}),J=function(r){var t=r.reificationClass,n=(r.children,R(r,["reificationClass","children"])),a=H(),o=W();return e.createElement(p,n,e.createElement(d,{classes:{form:a.form}},e.Children.map(r.children,(function(r,t){return e.cloneElement(r,{className:a.input})})),e.createElement(y,{className:o.root,source:"type",initialValue:t})))},V=function(e){return e.split(":").map((function(e){return e[0].toUpperCase()+e.slice(1)})).join("")},X=function(e){var r=e.types,t=e.params,n=t.pagination,a=(t.sort,t.filter),o=e.dereference,i=e.ontologies,c="";a&&(a.q&&a.q.length>0&&(c+='\n      {\n        SELECT ?s1\n        WHERE {\n          ?s1 ?p1 ?o1 .\n          FILTER regex(lcase(str(?o1)), "'.concat(a.q.toLowerCase(),'")\n          FILTER NOT EXISTS {?s1 a ?o1}\n        }\n      }\n      '),delete a.q),Object.keys(a).forEach((function(e){var r=a[e].startsWith("http")?"<".concat(a[e],">"):a[e];c+="?s1 ".concat(e," ").concat(r," .")})));var u=function(e){var r=[];if(e)for(var t=e.reduce((function(e,r){return function e(r,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"root";if(t.includes("/")){var a=t.split(/\/(.+)/);r[a[0]]=n,e(r,a[1],a[0])}else r[t]=n;return r}(e,r)}),{}),n=0,a=Object.entries(t);n<a.length;n++){var o=P(a[n],2),i=o[0],c=o[1],u=V(i),s="root"===c?"1":V(c),f="root"===c?i:c;r[f]||(r[f]=[]),r[f].push("\n        ?s".concat(s," ").concat(i," ?s").concat(u," .\n        ?s").concat(u," ?p").concat(u," ?o").concat(u," .\n      "))}return{construct:Object.values(r).map((function(e){return Object.values(e).join("\n")})).join("\n"),where:Object.values(r).map((function(e){return"OPTIONAL { ".concat(Object.values(e).join("\n")," }")})).join("\n")}}(o);return"\n    ".concat(function(e){return e.map((function(e){return"PREFIX ".concat(e.prefix,": <").concat(e.url,">")})).join("\n")}(i),"\n    CONSTRUCT {\n      ?s1 ?p2 ?o2 .\n      ").concat(u.construct,"\n    }\n    WHERE {\n      ?s1 a ?type .\n      FILTER( ?type IN (").concat(r.join(", "),") ) .\n      FILTER( (isIRI(?s1)) ) .\n      ").concat(c,"\n      ").concat(u.where,"\n      ?s1 ?p2 ?o2 .\n    }\n    # TODO try to make pagination work in SPARQL as this doesn't work.\n    # LIMIT ").concat(n.perPage,"\n    # OFFSET ").concat((n.page-1)*n.perPage,"\n  ")},z=require("speakingurl"),B=function(e){var r={};return e.forEach((function(e){return r[e.prefix]=e.url})),r},G=function(e){return e&&e.rawFile&&e.rawFile instanceof File},Q=function(e){var r,t,n,a,o,i,c,u=e.sparqlEndpoint,s=e.httpClient,f=e.resources,l=e.ontologies,p=e.jsonContext,d=e.uploadsContainerUri,y=function(){var e=j(regeneratorRuntime.mark((function e(r){var t;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(d){e.next=2;break}throw new Error("No uploadsContainerUri defined for the data provider");case 2:return e.next=4,s(d,{method:"POST",body:r,headers:new Headers({Slug:(n=r.name,a=void 0,o=void 0,a="",o=n.split("."),o.length>1&&(a=o.pop(),n=o.join(".")),z(n,{lang:"fr"})+"."+a),"Content-Type":r.type})});case 4:if(201!==(t=e.sent).status){e.next=7;break}return e.abrupt("return",t.headers.get("Location"));case 7:case"end":return e.stop()}var n,a,o}),e)})));return function(r){return e.apply(this,arguments)}}(),m=function(){var e=j(regeneratorRuntime.mark((function e(r){var t,n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:e.t0=regeneratorRuntime.keys(r);case 1:if((e.t1=e.t0()).done){e.next=22;break}if(t=e.t1.value,!r.hasOwnProperty(t)){e.next=20;break}if(!Array.isArray(r[t])){e.next=16;break}n=0;case 6:if(!(n<r[t].length)){e.next=14;break}if(!G(r[t][n])){e.next=11;break}return e.next=10,y(r[t][n].rawFile);case 10:r[t][n]=e.sent;case 11:n++,e.next=6;break;case 14:e.next=20;break;case 16:if(!G(r[t])){e.next=20;break}return e.next=19,y(r[t].rawFile);case 19:r[t]=e.sent;case 20:e.next=1;break;case 22:return e.abrupt("return",r);case 23:case"end":return e.stop()}}),e)})));return function(r){return e.apply(this,arguments)}}();return{getResources:(c=j(regeneratorRuntime.mark((function e(r,t){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",{data:f});case 1:case"end":return e.stop()}}),e)}))),function(e,r){return c.apply(this,arguments)}),getList:(i=j(regeneratorRuntime.mark((function e(r,t){var n,a,o,i,c,d,y,m,h,b,g,w;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(f[r],!t.id&&!t["@id"]&&f[r].types){e.next=26;break}return n=t.id||t["@id"]||f[r].containerUri,e.next=5,s(n);case 5:if(a=e.sent,o=a.json,x="ldp:Container",O=void 0,O=(j=o).type||j["@type"],!(Array.isArray(O)?O.includes(x):O===x)){e.next=14;break}return i=o["ldp:contains"].map((function(e){return e.id=e.id||e["@id"],e})),t.filter&&(t.filter.q&&delete t.filter.q,Object.keys(t.filter).length>0&&(i=i.filter((function(e){return Object.entries(t.filter).some((function(r){var t=P(r,2),n=t[0],a=t[1];return Array.isArray(e[n])?e[n].includes(a):e[n]===a}))})))),t.pagination&&(i=i.slice((t.pagination.page-1)*t.pagination.perPage,t.pagination.page*t.pagination.perPage)),e.abrupt("return",{data:i,total:o["ldp:contains"].length});case 14:if(!o.first){e.next=19;break}return e.next=17,s(o.first);case 17:c=e.sent,o=c.json;case 19:if(d=["as:orderedItems","orderedItems","as:items","items"].find((function(e){return o[e]}))){e.next=22;break}throw new Error("Unknown list type");case 22:return y=o[d].map((function(e){return e.id=e.id||e["@id"],e})),e.abrupt("return",{data:y,total:o.totalItems});case 24:e.next=45;break;case 26:return m=X({types:f[r].types,params:A(A({},t),{},{filter:A(A({},f[r].filter),t.filter)}),dereference:f[r].dereference,ontologies:l}),e.next=29,s(u,{method:"POST",body:m});case 29:return h=e.sent,b=h.json,e.next=33,v.frame(b,{"@context":p||B(l),"@type":f[r].types});case 33:if(g=e.sent,1!==Object.keys(g).length){e.next=38;break}return e.abrupt("return",{data:[],total:0});case 38:if(g["@graph"]){e.next=43;break}return g.id=g.id||g["@id"],e.abrupt("return",{data:[g],total:1});case 43:return w=g["@graph"].map((function(e){return e.id=e.id||e["@id"],e})).sort((function(e,r){return!(t.sort&&e[t.sort.field]&&r[t.sort.field])||("DESC"===t.sort.order?e[t.sort.field].localeCompare(r[t.sort.field]):r[t.sort.field].localeCompare(e[t.sort.field]))})).slice((t.pagination.page-1)*t.pagination.perPage,t.pagination.page*t.pagination.perPage),e.abrupt("return",{data:w,total:g["@graph"].length});case 45:case"end":return e.stop()}var x,j,O}),e)}))),function(e,r){return i.apply(this,arguments)}),getOne:(o=j(regeneratorRuntime.mark((function e(r,t){var n,a,o,i,c,u,d;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return f[r],n=f[r],e.next=4,s(t.id);case 4:return a=e.sent,(o=a.json).id=o.id||o["@id"],e.next=9,v.compact(o,p||B(l));case 9:if(i=e.sent,n.forceArray){c=I(n.forceArray);try{for(c.s();!(u=c.n()).done;)d=u.value,i[d]&&!Array.isArray(i[d])&&(i[d]=[i[d]])}catch(e){c.e(e)}finally{c.f()}}return e.abrupt("return",{data:i});case 12:case"end":return e.stop()}}),e)}))),function(e,r){return o.apply(this,arguments)}),getMany:(a=j(regeneratorRuntime.mark((function e(r,t){var n,a,o,i,c,u;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=[],a=I(t.ids),e.prev=2,a.s();case 4:if((o=a.n()).done){e.next=20;break}return i="object"===w(i=o.value)?i["@id"]:i,e.prev=7,e.next=10,s(i);case 10:c=e.sent,(u=c.json).id=u.id||u["@id"],n.push(u),e.next=18;break;case 16:e.prev=16,e.t0=e.catch(7);case 18:e.next=4;break;case 20:e.next=25;break;case 22:e.prev=22,e.t1=e.catch(2),a.e(e.t1);case 25:return e.prev=25,a.f(),e.finish(25);case 28:return e.abrupt("return",{data:n});case 29:case"end":return e.stop()}}),e,null,[[2,22,25,28],[7,16]])}))),function(e,r){return a.apply(this,arguments)}),getManyReference:function(e,r){throw new Error("getManyReference is not implemented yet")},create:(n=j(regeneratorRuntime.mark((function e(r,t){var n,a,o,i,c,u,d,y,h,b;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return f[r],n=f[r],a=n.slugField,o=n.containerUri,i=n.types,c=new Headers,a&&c.set("Slug",Array.isArray(a)?a.map((function(e){return t.data[e]})).join(" "):t.data[a]),e.next=6,m(t.data);case 6:return t.data=e.sent,e.next=9,s(o,{method:"POST",headers:c,body:JSON.stringify(A({"@context":p||B(l),"@type":i},t.data))});case 9:return u=e.sent,d=u.headers,y=d.get("Location"),e.next=14,s(y);case 14:return h=e.sent,(b=h.json).id=b.id||b["@id"],e.abrupt("return",{data:b});case 18:case"end":return e.stop()}}),e)}))),function(e,r){return n.apply(this,arguments)}),update:(t=j(regeneratorRuntime.mark((function e(r,t){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,m(t.data);case 2:return t.data=e.sent,e.next=5,s(t.id,{method:"PUT",body:JSON.stringify(A({"@context":p||B(l)},t.data))});case 5:return e.abrupt("return",{data:t.data});case 6:case"end":return e.stop()}}),e)}))),function(e,r){return t.apply(this,arguments)}),updateMany:function(e,r){throw new Error("updateMany is not implemented yet")},delete:(r=j(regeneratorRuntime.mark((function e(r,t){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s(t.id,{method:"DELETE"});case 2:return e.abrupt("return",{data:{id:t.id}});case 3:case"end":return e.stop()}}),e)}))),function(e,t){return r.apply(this,arguments)}),deleteMany:function(e,r){throw new Error("deleteMany is not implemented yet")}}},Z=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};switch(r.headers||(r.headers=new Headers),r.method){case"POST":case"PATCH":case"PUT":r.headers.has("Accept")||r.headers.set("Accept","application/ld+json"),r.headers.has("Content-Type")||r.headers.set("Content-Type","application/ld+json");break;case"DELETE":break;case"GET":default:r.headers.has("Accept")||r.headers.set("Accept","application/ld+json")}var t=localStorage.getItem("token");return t&&r.headers.set("Authorization","Bearer ".concat(t)),m.fetchJson(e,r)};export{M as DateTimeInput,U as FilteredArrayField,D as GroupedArrayField,C as ImageField,L as ReferenceArrayField,N as ReferenceArrayInput,F as ReferenceField,q as ReferenceInput,J as ReificationArrayInput,L as UriArrayField,N as UriArrayInput,Q as dataProvider,Z as httpClient};
