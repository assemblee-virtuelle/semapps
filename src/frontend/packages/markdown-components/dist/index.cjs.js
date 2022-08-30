"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("react"),r=require("@semapps/archipelago-layout"),t=require("markdown-to-jsx"),n=require("react-mde"),a=require("react-admin"),o=require("@material-ui/core");function u(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var i=u(e),l=u(t),c=u(n);function f(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function s(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?f(Object(t),!0).forEach((function(r){v(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):f(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function p(e,r,t,n,a,o,u){try{var i=e[o](u),l=i.value}catch(e){return void t(e)}i.done?r(l):Promise.resolve(l).then(n,a)}function d(e){return function(){var r=this,t=arguments;return new Promise((function(n,a){var o=e.apply(r,t);function u(e){p(o,n,a,u,i,"next",e)}function i(e){p(o,n,a,u,i,"throw",e)}u(void 0)}))}}function v(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function m(){return(m=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e}).apply(this,arguments)}function b(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}function y(e,r){return function(e){if(Array.isArray(e))return e}(e)||function(e,r){var t=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==t)return;var n,a,o=[],u=!0,i=!1;try{for(t=t.call(e);!(u=(n=t.next()).done)&&(o.push(n.value),!r||o.length!==r);u=!0);}catch(e){i=!0,a=e}finally{try{u||null==t.return||t.return()}finally{if(i)throw a}}return o}(e,r)||function(e,r){if(!e)return;if("string"==typeof e)return g(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(e);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return g(e,r)}(e,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function g(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=new Array(r);t<r;t++)n[t]=e[t];return n}var h=["source","record","overrides"],O=function(e){var t=e.source,n=e.record,a=e.overrides,o=void 0===a?{}:a,u=b(e,h);return n&&n[t]?i.default.createElement(l.default,{options:s({createElement:function(e,t,n){return t.label?i.default.createElement(i.default.Fragment,null,i.default.createElement(r.LargeLabel,null,t.label),i.default.createElement(e,t,n)):i.default.createElement(e,t,n)},overrides:s({h1:r.LargeLabel},o)},u)},n[t]):null};O.defaultProps={addLabel:!0};var w=o.makeStyles((function(e){return{validationError:{"& .MuiFormLabel-root":{color:"#f44336"},"& .mde-text":{outline:"-webkit-focus-ring-color auto 1px",outlineOffset:0,outlineColor:"#f44336",outlineStyle:"auto",outlineWidth:1}}}}));exports.MarkdownField=O,exports.MarkdownInput=function(r){var t=w(),n=r.validate,u=e.useMemo((function(){return!!n&&!![].concat(n).find((function(e){return e.toString()===a.required().toString()}))}),[n]),f=y(e.useState("write"),2),s=f[0],p=f[1],v=a.useInput(r),b=v.input,g=b.value,h=b.onChange,O=b.onBlur,j=v.meta,x=j.error,P=j.touched;return i.default.createElement(o.FormControl,{fullWidth:!0,className:"ra-input-mde ".concat(x?t.validationError:"")},i.default.createElement(a.Labeled,m({},r,{isRequired:u}),i.default.createElement(c.default,m({value:g,onChange:function(e){return h(e)},onTabChange:function(e){return p(e)},generateMarkdownPreview:function(){var e=d(regeneratorRuntime.mark((function e(r){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",i.default.createElement(l.default,null,r));case 1:case"end":return e.stop()}}),e)})));return function(r){return e.apply(this,arguments)}}(),selectedTab:s,childProps:{textArea:{onBlur:function(){return O()}}}},r))),i.default.createElement(o.FormHelperText,{error:!!x,margin:"dense",variant:"outlined"},i.default.createElement(a.InputHelperText,{error:x,helperText:r.helperText,touched:x||P})))},exports.useLoadLinks=function(e,r){var t=a.useDataProvider(),n=a.useTranslate();return function(){var a=d(regeneratorRuntime.mark((function a(o){var u;return regeneratorRuntime.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:if(!o){a.next=9;break}return a.next=3,t.getList(e,{pagination:{page:1,perPage:5},filter:{q:o}});case 3:if(!((u=a.sent).total>0)){a.next=8;break}return a.abrupt("return",u.data.map((function(t){return{preview:t[r],value:"[".concat(t[r],"](/").concat(e,"/").concat(encodeURIComponent(t.id),"/show)")}})));case 8:return a.abrupt("return",[{preview:n("ra.navigation.no_results"),value:"["+o}]);case 9:return a.abrupt("return",[{preview:n("ra.action.search"),value:"["+o}]);case 10:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}()};
//# sourceMappingURL=index.cjs.js.map
