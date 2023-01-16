"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("react"),t=require("react-admin"),r=require("@semapps/semantic-data-provider");function n(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var o=n(e);function u(e){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function a(){return(a=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},u=Object.keys(e);for(n=0;n<u.length;n++)r=u[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(e);for(n=0;n<u.length;n++)r=u[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var i=function(e){var r=e.optionText,n=e.dataServers,u=t.useRecordContext(),a=n&&Object.values(n).find((function(e){return u.id.startsWith(e.baseUrl)}));return o.default.createElement("span",null,u[r],a&&o.default.createElement("em",{className:"serverName",style:{color:"grey"}}," (",a.name,")"))},s=["optionText"],f=["optionText"];exports.MultiLinesInput=function(e){return o.default.createElement(t.TextInput,a({multiline:!0,minRows:2,format:function(e){return e?Array.isArray(e)?e.join("\n"):e:""},parse:function(e){return e.split(/\r?\n/)}},e))},exports.MultiServerAutocompleteArrayInput=function(n){var u=n.optionText,f=c(n,s),l=r.useDataServers(),p=e.useCallback((function(e,t){return t[u].toLowerCase().match(e.toLowerCase())}),[u]);return o.default.createElement(t.AutocompleteArrayInput,a({matchSuggestion:p,optionText:o.default.createElement(i,{optionText:u,dataServers:l}),inputText:function(e){return e[u]}},f))},exports.MultiServerAutocompleteInput=function(n){var u=n.optionText,i=c(n,f),s=r.useDataServers(),l=e.useCallback((function(e){if(e&&s){var t=Object.values(s).find((function(t){return e.id.startsWith(t.baseUrl)}));return e[u]+(t?" (".concat(t.name,")"):"")}}),[u,s]);return o.default.createElement(t.AutocompleteInput,a({optionText:l},i))},exports.ReferenceArrayInput=function(e){var r=t.useResourceContext({}),n=t.useRecordContext();if(n&&n[e.source]){var c=n[e.source];Array.isArray(c)||(c=[c]),e.format&&(c=e.format(c)),c=c.map((function(e){return"object"===u(e)?e.id||e["@id"]:e})),n[e.source]=c}return o.default.createElement(t.ReferenceArrayInput,a({},e,{resource:r,record:n}))},exports.ReferenceInput=function(e){var r=t.useResourceContext({});return o.default.createElement(t.ReferenceInput,a({},e,{resource:r,format:function(t){return t?(e.format&&(t=e.format(t)),"object"===u(t)?t.id||t["@id"]:t):t}}))};
//# sourceMappingURL=index.cjs.js.map
