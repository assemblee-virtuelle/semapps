import e,{useMemo as r,useState as t}from"react";import{LargeLabel as n}from"@semapps/archipelago-layout";import o from"markdown-to-jsx";import a from"react-mde";import{required as u,useInput as i,Labeled as c,InputHelperText as l,useDataProvider as f,useTranslate as p}from"react-admin";import{makeStyles as s,FormControl as m,FormHelperText as v}from"@material-ui/core";function b(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function d(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?b(Object(t),!0).forEach((function(r){g(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):b(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function y(e,r,t,n,o,a,u){try{var i=e[a](u),c=i.value}catch(e){return void t(e)}i.done?r(c):Promise.resolve(c).then(n,o)}function h(e){return function(){var r=this,t=arguments;return new Promise((function(n,o){var a=e.apply(r,t);function u(e){y(a,n,o,u,i,"next",e)}function i(e){y(a,n,o,u,i,"throw",e)}u(void 0)}))}}function g(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function O(){return(O=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e}).apply(this,arguments)}function w(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}function j(e,r){return function(e){if(Array.isArray(e))return e}(e)||function(e,r){var t=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==t)return;var n,o,a=[],u=!0,i=!1;try{for(t=t.call(e);!(u=(n=t.next()).done)&&(a.push(n.value),!r||a.length!==r);u=!0);}catch(e){i=!0,o=e}finally{try{u||null==t.return||t.return()}finally{if(i)throw o}}return a}(e,r)||function(e,r){if(!e)return;if("string"==typeof e)return E(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(e);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return E(e,r)}(e,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function E(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=new Array(r);t<r;t++)n[t]=e[t];return n}var P=["source","record","overrides"],x=function(r){var t=r.source,a=r.record,u=r.overrides,i=void 0===u?{}:u,c=w(r,P);return a&&a[t]?e.createElement(o,{options:d({createElement:function(r,t,o){return t.label?e.createElement(e.Fragment,null,e.createElement(n,null,t.label),e.createElement(r,t,o)):e.createElement(r,t,o)},overrides:d({h1:n},i)},c)},a[t]):null};x.defaultProps={addLabel:!0};var S=s((function(e){return{validationError:{"& .MuiFormLabel-root":{color:"#f44336"},"& .mde-text":{outline:"-webkit-focus-ring-color auto 1px",outlineOffset:0,outlineColor:"#f44336",outlineStyle:"auto",outlineWidth:1}}}})),k=function(n){var f=S(),p=n.validate,s=r((function(){return!!p&&!![].concat(p).find((function(e){return e.toString()===u().toString()}))}),[p]),b=j(t("write"),2),d=b[0],y=b[1],g=i(n),w=g.input,E=w.value,P=w.onChange,x=w.onBlur,k=g.meta,A=k.error,C=k.touched;return e.createElement(m,{fullWidth:!0,className:"ra-input-mde ".concat(A?f.validationError:"")},e.createElement(c,O({},n,{isRequired:s}),e.createElement(a,O({value:E,onChange:function(e){return P(e)},onTabChange:function(e){return y(e)},generateMarkdownPreview:function(){var r=h(regeneratorRuntime.mark((function r(t){return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.abrupt("return",e.createElement(o,null,t));case 1:case"end":return r.stop()}}),r)})));return function(e){return r.apply(this,arguments)}}(),selectedTab:d,childProps:{textArea:{onBlur:function(){return x()}}}},n))),e.createElement(v,{error:!!A,margin:"dense",variant:"outlined"},e.createElement(l,{error:A,helperText:n.helperText,touched:A||C})))},A=function(e,r){var t=f(),n=p();return function(){var o=h(regeneratorRuntime.mark((function o(a){var u;return regeneratorRuntime.wrap((function(o){for(;;)switch(o.prev=o.next){case 0:if(!a){o.next=9;break}return o.next=3,t.getList(e,{pagination:{page:1,perPage:5},filter:{q:a}});case 3:if(!((u=o.sent).total>0)){o.next=8;break}return o.abrupt("return",u.data.map((function(t){return{preview:t[r],value:"[".concat(t[r],"](/").concat(e,"/").concat(encodeURIComponent(t.id),"/show)")}})));case 8:return o.abrupt("return",[{preview:n("ra.navigation.no_results"),value:"["+a}]);case 9:return o.abrupt("return",[{preview:n("ra.action.search"),value:"["+a}]);case 10:case"end":return o.stop()}}),o)})));return function(e){return o.apply(this,arguments)}}()};export{x as MarkdownField,k as MarkdownInput,A as useLoadLinks};
//# sourceMappingURL=index.es.js.map
