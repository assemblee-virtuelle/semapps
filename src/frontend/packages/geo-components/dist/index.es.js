import e,{useState as t,useMemo as r,useEffect as n}from"react";import{useLocale as o,useTranslate as a,useInput as i,FieldTitle as l,InputHelperText as u,useResourceDefinition as c,ShowButton as s,EditButton as p,useListContext as f}from"react-admin";import{TextField as m,Grid as h,Typography as g,Drawer as d,Box as b,IconButton as y,useMediaQuery as v}from"@mui/material";import E from"@mui/styles/makeStyles";import O from"@mui/material/Autocomplete";import x from"@mui/icons-material/LocationOn";import A from"lodash.throttle";import{useHistory as w,useLocation as P}from"react-router";import j from"@mui/material/CircularProgress";import"leaflet-defaulticon-compatibility";import{useMapEvents as C,useMap as I,Marker as S,Popup as U,Polyline as k,MapContainer as z,TileLayer as T}from"react-leaflet";import M from"leaflet";import{createPathComponent as R}from"@react-leaflet/core";import"leaflet.markercluster";import L from"@mui/icons-material/Close";var N=function(e,t){var r=e.find((function(e){return e.id.startsWith(t+".")}));if(r)return r.text};function W(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function B(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?W(Object(r),!0).forEach((function(t){H(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):W(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function H(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function q(){return(q=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function D(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}function F(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==r)return;var n,o,a=[],i=!0,l=!1;try{for(r=r.call(e);!(i=(n=r.next()).done)&&(a.push(n.value),!t||a.length!==t);i=!0);}catch(e){l=!0,o=e}finally{try{i||null==r.return||r.return()}finally{if(l)throw o}}return a}(e,t)||Y(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function X(e){return function(e){if(Array.isArray(e))return G(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||Y(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Y(e,t){if(e){if("string"==typeof e)return G(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?G(e,t):void 0}}function G(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;function V(e,t){return e(t={exports:{}},t.exports),t.exports}var Z=V((function(e,t){var r,n;e.exports=(r={772:(e,t,r)=>{const n=r(826).remove,o=/[.*+?^${}()|[\]\\]/g,a=/[a-z0-9_]/i,i=/\s+/;e.exports=function(e,t,r){var l,u;u={insideWords:!1,findAllOccurrences:!1,requireMatchAll:!1},l=(l=r)||{},Object.keys(l).forEach(e=>{u[e]=!!l[e]}),r=u;const c=Array.from(e).map(e=>n(e));let s=c.join("");return(t=n(t)).trim().split(i).filter(e=>e.length>0).reduce((e,t)=>{const n=t.length,i=!r.insideWords&&a.test(t[0])?"\\b":"",l=new RegExp(i+t.replace(o,"\\$&"),"i");let u,p;if(u=l.exec(s),r.requireMatchAll&&null===u)return s="",[];for(;u;){p=u.index;const t=n-c.slice(p,p+n).join("").length,o=p-c.slice(0,p).join("").length,a=[p+o,p+n+o+t];if(a[0]!==a[1]&&e.push(a),s=s.slice(0,p)+new Array(n+1).join(" ")+s.slice(p+n),!r.findAllOccurrences)break;u=l.exec(s)}return e},[]).sort((e,t)=>e[0]-t[0])}},826:e=>{var t={"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Ấ":"A","Ắ":"A","Ẳ":"A","Ẵ":"A","Ặ":"A","Æ":"AE","Ầ":"A","Ằ":"A","Ȃ":"A","Ç":"C","Ḉ":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ế":"E","Ḗ":"E","Ề":"E","Ḕ":"E","Ḝ":"E","Ȇ":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ḯ":"I","Ȋ":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ố":"O","Ṍ":"O","Ṓ":"O","Ȏ":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ý":"Y","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","ấ":"a","ắ":"a","ẳ":"a","ẵ":"a","ặ":"a","æ":"ae","ầ":"a","ằ":"a","ȃ":"a","ç":"c","ḉ":"c","è":"e","é":"e","ê":"e","ë":"e","ế":"e","ḗ":"e","ề":"e","ḕ":"e","ḝ":"e","ȇ":"e","ì":"i","í":"i","î":"i","ï":"i","ḯ":"i","ȋ":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ố":"o","ṍ":"o","ṓ":"o","ȏ":"o","ù":"u","ú":"u","û":"u","ü":"u","ý":"y","ÿ":"y","Ā":"A","ā":"a","Ă":"A","ă":"a","Ą":"A","ą":"a","Ć":"C","ć":"c","Ĉ":"C","ĉ":"c","Ċ":"C","ċ":"c","Č":"C","č":"c","C̆":"C","c̆":"c","Ď":"D","ď":"d","Đ":"D","đ":"d","Ē":"E","ē":"e","Ĕ":"E","ĕ":"e","Ė":"E","ė":"e","Ę":"E","ę":"e","Ě":"E","ě":"e","Ĝ":"G","Ǵ":"G","ĝ":"g","ǵ":"g","Ğ":"G","ğ":"g","Ġ":"G","ġ":"g","Ģ":"G","ģ":"g","Ĥ":"H","ĥ":"h","Ħ":"H","ħ":"h","Ḫ":"H","ḫ":"h","Ĩ":"I","ĩ":"i","Ī":"I","ī":"i","Ĭ":"I","ĭ":"i","Į":"I","į":"i","İ":"I","ı":"i","Ĳ":"IJ","ĳ":"ij","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","Ḱ":"K","ḱ":"k","K̆":"K","k̆":"k","Ĺ":"L","ĺ":"l","Ļ":"L","ļ":"l","Ľ":"L","ľ":"l","Ŀ":"L","ŀ":"l","Ł":"l","ł":"l","Ḿ":"M","ḿ":"m","M̆":"M","m̆":"m","Ń":"N","ń":"n","Ņ":"N","ņ":"n","Ň":"N","ň":"n","ŉ":"n","N̆":"N","n̆":"n","Ō":"O","ō":"o","Ŏ":"O","ŏ":"o","Ő":"O","ő":"o","Œ":"OE","œ":"oe","P̆":"P","p̆":"p","Ŕ":"R","ŕ":"r","Ŗ":"R","ŗ":"r","Ř":"R","ř":"r","R̆":"R","r̆":"r","Ȓ":"R","ȓ":"r","Ś":"S","ś":"s","Ŝ":"S","ŝ":"s","Ş":"S","Ș":"S","ș":"s","ş":"s","Š":"S","š":"s","Ţ":"T","ţ":"t","ț":"t","Ț":"T","Ť":"T","ť":"t","Ŧ":"T","ŧ":"t","T̆":"T","t̆":"t","Ũ":"U","ũ":"u","Ū":"U","ū":"u","Ŭ":"U","ŭ":"u","Ů":"U","ů":"u","Ű":"U","ű":"u","Ų":"U","ų":"u","Ȗ":"U","ȗ":"u","V̆":"V","v̆":"v","Ŵ":"W","ŵ":"w","Ẃ":"W","ẃ":"w","X̆":"X","x̆":"x","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Y̆":"Y","y̆":"y","Ź":"Z","ź":"z","Ż":"Z","ż":"z","Ž":"Z","ž":"z","ſ":"s","ƒ":"f","Ơ":"O","ơ":"o","Ư":"U","ư":"u","Ǎ":"A","ǎ":"a","Ǐ":"I","ǐ":"i","Ǒ":"O","ǒ":"o","Ǔ":"U","ǔ":"u","Ǖ":"U","ǖ":"u","Ǘ":"U","ǘ":"u","Ǚ":"U","ǚ":"u","Ǜ":"U","ǜ":"u","Ứ":"U","ứ":"u","Ṹ":"U","ṹ":"u","Ǻ":"A","ǻ":"a","Ǽ":"AE","ǽ":"ae","Ǿ":"O","ǿ":"o","Þ":"TH","þ":"th","Ṕ":"P","ṕ":"p","Ṥ":"S","ṥ":"s","X́":"X","x́":"x","Ѓ":"Г","ѓ":"г","Ќ":"К","ќ":"к","A̋":"A","a̋":"a","E̋":"E","e̋":"e","I̋":"I","i̋":"i","Ǹ":"N","ǹ":"n","Ồ":"O","ồ":"o","Ṑ":"O","ṑ":"o","Ừ":"U","ừ":"u","Ẁ":"W","ẁ":"w","Ỳ":"Y","ỳ":"y","Ȁ":"A","ȁ":"a","Ȅ":"E","ȅ":"e","Ȉ":"I","ȉ":"i","Ȍ":"O","ȍ":"o","Ȑ":"R","ȑ":"r","Ȕ":"U","ȕ":"u","B̌":"B","b̌":"b","Č̣":"C","č̣":"c","Ê̌":"E","ê̌":"e","F̌":"F","f̌":"f","Ǧ":"G","ǧ":"g","Ȟ":"H","ȟ":"h","J̌":"J","ǰ":"j","Ǩ":"K","ǩ":"k","M̌":"M","m̌":"m","P̌":"P","p̌":"p","Q̌":"Q","q̌":"q","Ř̩":"R","ř̩":"r","Ṧ":"S","ṧ":"s","V̌":"V","v̌":"v","W̌":"W","w̌":"w","X̌":"X","x̌":"x","Y̌":"Y","y̌":"y","A̧":"A","a̧":"a","B̧":"B","b̧":"b","Ḑ":"D","ḑ":"d","Ȩ":"E","ȩ":"e","Ɛ̧":"E","ɛ̧":"e","Ḩ":"H","ḩ":"h","I̧":"I","i̧":"i","Ɨ̧":"I","ɨ̧":"i","M̧":"M","m̧":"m","O̧":"O","o̧":"o","Q̧":"Q","q̧":"q","U̧":"U","u̧":"u","X̧":"X","x̧":"x","Z̧":"Z","z̧":"z"},r=Object.keys(t).join("|"),n=new RegExp(r,"g"),o=new RegExp(r,""),a=function(e){return e.replace(n,(function(e){return t[e]}))};e.exports=a,e.exports.has=function(e){return!!e.match(o)},e.exports.remove=a}},n={},function e(t){var o=n[t];if(void 0!==o)return o.exports;var a=n[t]={exports:{}};return r[t](a,a.exports,e),a.exports}(772))}));Z.AutosuggestHighlightMatch;var _=V((function(e,t){var r,n;e.exports=(r={705:e=>{e.exports=function(e,t){const r=[];return 0===t.length?r.push({text:e,highlight:!1}):t[0][0]>0&&r.push({text:e.slice(0,t[0][0]),highlight:!1}),t.forEach((n,o)=>{const a=n[0],i=n[1];r.push({text:e.slice(a,i),highlight:!0}),o===t.length-1?i<e.length&&r.push({text:e.slice(i,e.length),highlight:!1}):i<t[o+1][0]&&r.push({text:e.slice(i,t[o+1][0]),highlight:!1})}),r}}},n={},function e(t){var o=n[t];if(void 0!==o)return o.exports;var a=n[t]={exports:{}};return r[t](a,a.exports,e),a.exports}(705))}));_.AutosuggestHighlightParse;var K=["mapboxConfig","record","resource","source","label","basePath","parse","optionText","helperText"],J=E((function(e){return{icon:{color:e.palette.text.secondary,marginRight:e.spacing(2)}}})),Q=function(e,t){return e.place_name?e.place_name:"string"==typeof t?e[t]:"function"==typeof t?t(e):void 0},$=function(c){var s=c.mapboxConfig;c.record;var p=c.resource,f=c.source,d=c.label;c.basePath;var b=c.parse,y=c.optionText,v=c.helperText,E=D(c,K);if(!s)throw new Error("@semapps/geo-components : No mapbox configuration");if(!s.access_token)throw new Error("@semapps/geo-components : No access token in mapbox configuration");var w=J(),P=o(),j=a(),C=F(t(""),2),I=C[0],S=C[1],U=F(t([]),2),k=U[0],z=U[1],T=i(B({resource:p,source:f},E)),M=T.input,R=M.value,L=M.onChange,N=M.onBlur,W=M.onFocus,H=T.isRequired,Y=T.meta,G=Y.error,V=Y.submitError,$=Y.touched,ee=r((function(){return A((function(e,t){var r=new URL("https://api.mapbox.com/geocoding/v5/mapbox.places/".concat(e,".json"));s.language||(s.language=P),Object.entries(s).forEach((function(e){var t=F(e,2),n=t[0],o=t[1];Array.isArray(o)?o=o.join(","):"boolean"==typeof o&&(o=o?"true":"false"),r.searchParams.set(n,o)})),fetch(r.toString()).then((function(e){return e.json()})).then((function(e){return t(e)}))}),200)}),[s,P]);return n((function(){I&&I!==Q(R,y)&&ee(I,(function(e){return z(e.features)}))}),[R,I,ee]),e.createElement(O,{autoComplete:!0,value:R||null,options:R?[R].concat(X(k)):k,filterSelectedOptions:!0,filterOptions:function(e){return e},getOptionLabel:function(e){return Q(e,y)},isOptionEqualToValue:function(e,t){return Q(e,y)===Q(t,y)},onChange:function(e,t){t&&b&&(t=b(t)),L(t),z([])},onInputChange:function(e,t){return S(t)},noOptionsText:j("ra.navigation.no_results"),renderInput:function(t){return t.inputProps.autoComplete="new-password",e.createElement(m,q({},t,{inputProps:B(B({},t.inputProps),{},{onBlur:function(e){N(e),t.inputProps.onBlur&&t.inputProps.onBlur(e)},onFocus:function(e){W(e),t.inputProps.onFocus&&t.inputProps.onFocus(e)}}),label:""!==d&&!1!==d&&e.createElement(l,{label:d,source:f,resource:p,isRequired:H}),error:!(!$||!G&&!V),helperText:e.createElement(u,{touched:$,error:G||V,helperText:v})},E))},renderOption:function(t){var r=Z(t.text,I),n=_(t.text,r);return e.createElement(h,{container:!0,alignItems:"center"},e.createElement(h,{item:!0},e.createElement(x,{className:w.icon})),e.createElement(h,{item:!0,xs:!0},"string"==typeof n?n:n.map((function(t,r){return e.createElement("span",{key:r,style:{fontWeight:t.highlight?700:400}},t.text)})),e.createElement(g,{variant:"body2",color:"textSecondary"},t.place_name)))}})};$.defaultProps={variant:"filled",margin:"dense"};var ee=["children"];var te=R((function(e,t){e.children;var r=D(e,ee),n={},o={};Object.entries(r).forEach((function(e){var t=F(e,2),r=t[0],a=t[1];return r.startsWith("on")?o[r]=a:n[r]=a}));var a=new M.MarkerClusterGroup(n);return Object.entries(o).forEach((function(e){var t=F(e,2),r=t[0],n=t[1],o="cluster".concat(r.substring(2).toLowerCase());a.on(o,n)})),{instance:a,context:B(B({},t),{},{layerContainer:a})}})),re=function(){var e=w(),t=new URLSearchParams(e.location.search);return C({moveend:function(r){t.set("lat",r.target.getCenter().lat),t.set("lng",r.target.getCenter().lng),e.replace({pathname:e.location.pathname,search:"?"+t.toString()})},zoomend:function(r){t.set("zoom",r.target.getZoom()),e.replace({pathname:e.location.pathname,search:"?"+t.toString()})}}),null},ne=E((function(){return{closeButton:{position:"absolute",zIndex:1400,top:0,right:0}}})),oe=function(t){var r=t.record,o=t.basePath,a=t.popupContent,i=t.onClose,l=ne(),u=I();return n((function(){r&&u.setView([r.latitude,r.longitude])}),[r,u]),e.createElement(d,{anchor:"bottom",open:!!r,onClose:i},e.createElement(b,{p:1,position:"relative"},e.createElement(y,{onClick:i,className:l.closeButton,size:"large"},e.createElement(L,null)),r&&e.createElement(a,{record:r,basePath:o})))},ae=["latitude","longitude","label","description","popupContent","height","center","zoom","groupClusters","boundToMarkers","connectMarkers"],ie=E((function(){return{loading:{zIndex:1e3,position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center"}}})),le=function(r){var n,o=r.latitude,a=r.longitude,i=r.label,l=r.description,u=r.popupContent,c=r.height,s=r.center,p=r.zoom,m=r.groupClusters,h=r.boundToMarkers,g=r.connectMarkers,d=D(r,ae),y=f(),E=y.ids,O=y.data,x=y.basePath,A=y.loading,w=v((function(e){return e.breakpoints.down("sm")}),{noSsr:!0}),C=F(t(null),2),I=C[0],M=C[1],R=ie(),L=new URLSearchParams(P().search);s=L.has("lat")&&L.has("lng")?[L.get("lat"),L.get("lng")]:s,p=L.has("zoom")?L.get("zoom"):p;var N=E.filter((function(e){return O[e]})).map((function(e){return B(B({},O[e]),{},{latitude:o&&o(O[e]),longitude:a&&a(O[e]),label:i&&i(O[e]),description:l&&l(O[e])})})).filter((function(e){return e.latitude&&e.longitude})),W=h&&N.length>0?N.map((function(e){return[e.latitude,e.longitude]})):void 0;if(h&&!W)return null;var H=N.map((function(t,r){var o=e.createElement(e.Fragment,{key:r},e.createElement(S,{position:[t.latitude,t.longitude],eventHandlers:w?{click:function(){return M(t)}}:void 0},!w&&e.createElement(U,null,e.createElement(u,{record:t,basePath:x}))),g&&n&&e.createElement(k,{positions:[[n.latitude,n.longitude],[t.latitude,t.longitude]]}));return n=t,o}));return e.createElement(z,q({style:{height:c},center:h?void 0:s,zoom:h?void 0:p,bounds:W},d),e.createElement(T,{attribution:'© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}),A&&e.createElement(b,{alignItems:"center",className:R.loading},e.createElement(j,{size:60,thickness:6})),m?e.createElement(te,{showCoverageOnHover:!1},H):H,e.createElement(re,null),e.createElement(oe,{record:I,basePath:x,popupContent:u,onClose:function(){return M(null)}}))};le.defaultProps={height:700,center:[47,2.213749],zoom:6,groupClusters:!0,connectMarkers:!1,scrollWheelZoom:!1,popupContent:function(t){var r=t.record,n=t.basePath,o=c({});return e.createElement(e.Fragment,null,r.label&&e.createElement(g,{variant:"h5"},r.label),r.description&&e.createElement(g,null,r.description.length>150?r.description.substring(0,150)+"...":r.description),o.hasShow&&e.createElement(s,{basePath:n,record:r}),o.hasEdit&&e.createElement(p,{basePath:n,record:r}))}};var ue=function(e){var t=e.center,r=e.zoom;return I().setView(t,r),null},ce=["record","latitude","longitude","address","height","addLabel","typographyProps"],se=function(t){var r=t.record,n=t.latitude,o=t.longitude,a=t.address,i=t.height;t.addLabel;var l=t.typographyProps,u=D(t,ce),c=[n(r),o(r)];return c[0]&&c[1]?e.createElement(b,null,a&&e.createElement(b,{mt:1,mb:1},e.createElement(g,l,a(r))),e.createElement(z,q({style:{height:i},center:c},u),e.createElement(ue,{center:c}),e.createElement(T,{attribution:'© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}),e.createElement(S,{position:c}))):null};se.defaultProps={height:400,zoom:11,addLabel:!0};export{$ as LocationInput,se as MapField,le as MapList,N as extractContext};
//# sourceMappingURL=index.es.js.map
