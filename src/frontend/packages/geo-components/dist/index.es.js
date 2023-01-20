import e,{useState as t,useMemo as r,useEffect as n}from"react";import{useTheme as o,useRecordContext as a,useResourceContext as i,useLocale as l,useTranslate as u,useInput as c,FieldTitle as s,InputHelperText as p,useResourceDefinition as f,ShowButton as m,EditButton as g,useListContext as h}from"react-admin";import{TextField as d,Grid as b,Typography as y,Drawer as v,Box as E,IconButton as O,useMediaQuery as x}from"@mui/material";import A from"@mui/material/Autocomplete";import w from"@mui/icons-material/LocationOn";import j from"lodash.throttle";import{styled as C}from"@mui/system";import{useLocation as P}from"react-router-dom";import I from"@mui/styles/makeStyles";import S from"@mui/material/CircularProgress";import"leaflet-defaulticon-compatibility";import{useMapEvents as U,useMap as k,Marker as z,Popup as T,Polyline as M,MapContainer as R,TileLayer as L}from"react-leaflet";import N from"leaflet";import{createPathComponent as W}from"@react-leaflet/core";import"leaflet.markercluster";import B from"@mui/icons-material/Clear";var H=function(e,t){var r=e.find((function(e){return e.id.startsWith(t+".")}));if(r)return r.text};function q(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function D(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?q(Object(r),!0).forEach((function(t){X(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):q(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function X(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Y(){return(Y=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function G(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}function V(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==r)return;var n,o,a=[],i=!0,l=!1;try{for(r=r.call(e);!(i=(n=r.next()).done)&&(a.push(n.value),!t||a.length!==t);i=!0);}catch(e){l=!0,o=e}finally{try{i||null==r.return||r.return()}finally{if(l)throw o}}return a}(e,t)||_(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Z(e){return function(e){if(Array.isArray(e))return K(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||_(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _(e,t){if(e){if("string"==typeof e)return K(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?K(e,t):void 0}}function K(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;function F(e,t){return e(t={exports:{}},t.exports),t.exports}var J=F((function(e,t){var r,n;e.exports=(r={772:(e,t,r)=>{const n=r(826).remove,o=/[.*+?^${}()|[\]\\]/g,a=/[a-z0-9_]/i,i=/\s+/;e.exports=function(e,t,r){var l,u;u={insideWords:!1,findAllOccurrences:!1,requireMatchAll:!1},l=(l=r)||{},Object.keys(l).forEach(e=>{u[e]=!!l[e]}),r=u;const c=Array.from(e).map(e=>n(e));let s=c.join("");return(t=n(t)).trim().split(i).filter(e=>e.length>0).reduce((e,t)=>{const n=t.length,i=!r.insideWords&&a.test(t[0])?"\\b":"",l=new RegExp(i+t.replace(o,"\\$&"),"i");let u,p;if(u=l.exec(s),r.requireMatchAll&&null===u)return s="",[];for(;u;){p=u.index;const t=n-c.slice(p,p+n).join("").length,o=p-c.slice(0,p).join("").length,a=[p+o,p+n+o+t];if(a[0]!==a[1]&&e.push(a),s=s.slice(0,p)+new Array(n+1).join(" ")+s.slice(p+n),!r.findAllOccurrences)break;u=l.exec(s)}return e},[]).sort((e,t)=>e[0]-t[0])}},826:e=>{var t={"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Ấ":"A","Ắ":"A","Ẳ":"A","Ẵ":"A","Ặ":"A","Æ":"AE","Ầ":"A","Ằ":"A","Ȃ":"A","Ç":"C","Ḉ":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ế":"E","Ḗ":"E","Ề":"E","Ḕ":"E","Ḝ":"E","Ȇ":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ḯ":"I","Ȋ":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ố":"O","Ṍ":"O","Ṓ":"O","Ȏ":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ý":"Y","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","ấ":"a","ắ":"a","ẳ":"a","ẵ":"a","ặ":"a","æ":"ae","ầ":"a","ằ":"a","ȃ":"a","ç":"c","ḉ":"c","è":"e","é":"e","ê":"e","ë":"e","ế":"e","ḗ":"e","ề":"e","ḕ":"e","ḝ":"e","ȇ":"e","ì":"i","í":"i","î":"i","ï":"i","ḯ":"i","ȋ":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ố":"o","ṍ":"o","ṓ":"o","ȏ":"o","ù":"u","ú":"u","û":"u","ü":"u","ý":"y","ÿ":"y","Ā":"A","ā":"a","Ă":"A","ă":"a","Ą":"A","ą":"a","Ć":"C","ć":"c","Ĉ":"C","ĉ":"c","Ċ":"C","ċ":"c","Č":"C","č":"c","C̆":"C","c̆":"c","Ď":"D","ď":"d","Đ":"D","đ":"d","Ē":"E","ē":"e","Ĕ":"E","ĕ":"e","Ė":"E","ė":"e","Ę":"E","ę":"e","Ě":"E","ě":"e","Ĝ":"G","Ǵ":"G","ĝ":"g","ǵ":"g","Ğ":"G","ğ":"g","Ġ":"G","ġ":"g","Ģ":"G","ģ":"g","Ĥ":"H","ĥ":"h","Ħ":"H","ħ":"h","Ḫ":"H","ḫ":"h","Ĩ":"I","ĩ":"i","Ī":"I","ī":"i","Ĭ":"I","ĭ":"i","Į":"I","į":"i","İ":"I","ı":"i","Ĳ":"IJ","ĳ":"ij","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","Ḱ":"K","ḱ":"k","K̆":"K","k̆":"k","Ĺ":"L","ĺ":"l","Ļ":"L","ļ":"l","Ľ":"L","ľ":"l","Ŀ":"L","ŀ":"l","Ł":"l","ł":"l","Ḿ":"M","ḿ":"m","M̆":"M","m̆":"m","Ń":"N","ń":"n","Ņ":"N","ņ":"n","Ň":"N","ň":"n","ŉ":"n","N̆":"N","n̆":"n","Ō":"O","ō":"o","Ŏ":"O","ŏ":"o","Ő":"O","ő":"o","Œ":"OE","œ":"oe","P̆":"P","p̆":"p","Ŕ":"R","ŕ":"r","Ŗ":"R","ŗ":"r","Ř":"R","ř":"r","R̆":"R","r̆":"r","Ȓ":"R","ȓ":"r","Ś":"S","ś":"s","Ŝ":"S","ŝ":"s","Ş":"S","Ș":"S","ș":"s","ş":"s","Š":"S","š":"s","Ţ":"T","ţ":"t","ț":"t","Ț":"T","Ť":"T","ť":"t","Ŧ":"T","ŧ":"t","T̆":"T","t̆":"t","Ũ":"U","ũ":"u","Ū":"U","ū":"u","Ŭ":"U","ŭ":"u","Ů":"U","ů":"u","Ű":"U","ű":"u","Ų":"U","ų":"u","Ȗ":"U","ȗ":"u","V̆":"V","v̆":"v","Ŵ":"W","ŵ":"w","Ẃ":"W","ẃ":"w","X̆":"X","x̆":"x","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Y̆":"Y","y̆":"y","Ź":"Z","ź":"z","Ż":"Z","ż":"z","Ž":"Z","ž":"z","ſ":"s","ƒ":"f","Ơ":"O","ơ":"o","Ư":"U","ư":"u","Ǎ":"A","ǎ":"a","Ǐ":"I","ǐ":"i","Ǒ":"O","ǒ":"o","Ǔ":"U","ǔ":"u","Ǖ":"U","ǖ":"u","Ǘ":"U","ǘ":"u","Ǚ":"U","ǚ":"u","Ǜ":"U","ǜ":"u","Ứ":"U","ứ":"u","Ṹ":"U","ṹ":"u","Ǻ":"A","ǻ":"a","Ǽ":"AE","ǽ":"ae","Ǿ":"O","ǿ":"o","Þ":"TH","þ":"th","Ṕ":"P","ṕ":"p","Ṥ":"S","ṥ":"s","X́":"X","x́":"x","Ѓ":"Г","ѓ":"г","Ќ":"К","ќ":"к","A̋":"A","a̋":"a","E̋":"E","e̋":"e","I̋":"I","i̋":"i","Ǹ":"N","ǹ":"n","Ồ":"O","ồ":"o","Ṑ":"O","ṑ":"o","Ừ":"U","ừ":"u","Ẁ":"W","ẁ":"w","Ỳ":"Y","ỳ":"y","Ȁ":"A","ȁ":"a","Ȅ":"E","ȅ":"e","Ȉ":"I","ȉ":"i","Ȍ":"O","ȍ":"o","Ȑ":"R","ȑ":"r","Ȕ":"U","ȕ":"u","B̌":"B","b̌":"b","Č̣":"C","č̣":"c","Ê̌":"E","ê̌":"e","F̌":"F","f̌":"f","Ǧ":"G","ǧ":"g","Ȟ":"H","ȟ":"h","J̌":"J","ǰ":"j","Ǩ":"K","ǩ":"k","M̌":"M","m̌":"m","P̌":"P","p̌":"p","Q̌":"Q","q̌":"q","Ř̩":"R","ř̩":"r","Ṧ":"S","ṧ":"s","V̌":"V","v̌":"v","W̌":"W","w̌":"w","X̌":"X","x̌":"x","Y̌":"Y","y̌":"y","A̧":"A","a̧":"a","B̧":"B","b̧":"b","Ḑ":"D","ḑ":"d","Ȩ":"E","ȩ":"e","Ɛ̧":"E","ɛ̧":"e","Ḩ":"H","ḩ":"h","I̧":"I","i̧":"i","Ɨ̧":"I","ɨ̧":"i","M̧":"M","m̧":"m","O̧":"O","o̧":"o","Q̧":"Q","q̧":"q","U̧":"U","u̧":"u","X̧":"X","x̧":"x","Z̧":"Z","z̧":"z"},r=Object.keys(t).join("|"),n=new RegExp(r,"g"),o=new RegExp(r,""),a=function(e){return e.replace(n,(function(e){return t[e]}))};e.exports=a,e.exports.has=function(e){return!!e.match(o)},e.exports.remove=a}},n={},function e(t){var o=n[t];if(void 0!==o)return o.exports;var a=n[t]={exports:{}};return r[t](a,a.exports,e),a.exports}(772))}));J.AutosuggestHighlightMatch;var Q=F((function(e,t){var r,n;e.exports=(r={705:e=>{e.exports=function(e,t){const r=[];return 0===t.length?r.push({text:e,highlight:!1}):t[0][0]>0&&r.push({text:e.slice(0,t[0][0]),highlight:!1}),t.forEach((n,o)=>{const a=n[0],i=n[1];r.push({text:e.slice(a,i),highlight:!0}),o===t.length-1?i<e.length&&r.push({text:e.slice(i,e.length),highlight:!1}):i<t[o+1][0]&&r.push({text:e.slice(i,t[o+1][0]),highlight:!1})}),r}}},n={},function e(t){var o=n[t];if(void 0!==o)return o.exports;var a=n[t]={exports:{}};return r[t](a,a.exports,e),a.exports}(705))}));Q.AutosuggestHighlightParse;var $=["mapboxConfig","source","label","parse","optionText","helperText"],ee=C(w)((function(){var e=V(o(),1)[0];return{color:e.palette.text.secondary,marginRight:e.spacing(2)}})),te=function(e,t){return e.place_name?e.place_name:"string"==typeof t?e[t]:"function"==typeof t?t(e):void 0},re=function(o){var f=o.mapboxConfig,m=o.source,g=o.label,h=o.parse,v=o.optionText,E=o.helperText,O=G(o,$);if(!f)throw new Error("@semapps/geo-components : No mapbox configuration");if(!f.access_token)throw new Error("@semapps/geo-components : No access token in mapbox configuration");a();var x=i(),w=l(),C=u(),P=V(t(""),2),I=P[0],S=P[1],U=V(t([]),2),k=U[0],z=U[1],T=c(D({resource:x,source:m},O)),M=T.field,R=M.value,L=M.onChange,N=M.onBlur,W=T.isRequired,B=T.fieldState,H=B.error,q=B.isTouched,X=r((function(){return j((function(e,t){var r=new URL("https://api.mapbox.com/geocoding/v5/mapbox.places/".concat(e,".json"));f.language||(f.language=w),Object.entries(f).forEach((function(e){var t=V(e,2),n=t[0],o=t[1];Array.isArray(o)?o=o.join(","):"boolean"==typeof o&&(o=o?"true":"false"),r.searchParams.set(n,o)})),fetch(r.toString()).then((function(e){return e.json()})).then((function(e){return t(e)}))}),200)}),[f,w]);return n((function(){I&&I!==te(R,v)&&X(I,(function(e){return z(e.features)}))}),[R,I,X]),e.createElement(A,Y({autoComplete:!0,value:R||null,options:R?[R].concat(Z(k)):k,filterSelectedOptions:!0,filterOptions:function(e){return e},getOptionLabel:function(e){return te(e,v)},isOptionEqualToValue:function(e,t){return te(e,v)===te(t,v)},onChange:function(e,t){t&&h&&(t=h(t)),L(t),z([])},onInputChange:function(e,t){return S(t)},noOptionsText:C("ra.navigation.no_results"),renderInput:function(t){return t.inputProps.autoComplete="new-password",e.createElement(d,Y({},t,{inputProps:D(D({},t.inputProps),{},{onBlur:function(e){N(e),t.inputProps.onBlur&&t.inputProps.onBlur(e)}}),label:""!==g&&!1!==g&&e.createElement(s,{label:g,source:m,resource:x,isRequired:W}),error:!(!q||!H),helperText:e.createElement(p,{touched:q,error:H,helperText:E})},O))},renderOption:function(t,r,n){var o=J(r.text,I),a=Q(r.text,o);return e.createElement("li",t,e.createElement(b,{container:!0,alignItems:"center"},e.createElement(b,{item:!0},e.createElement(ee,null)),e.createElement(b,{item:!0,xs:!0},"string"==typeof a?a:a.map((function(t,r){return e.createElement("span",{key:r,style:{fontWeight:t.highlight?700:400}},t.text)})),e.createElement(y,{variant:"body2",color:"textSecondary"},r.place_name))))}},O))};re.defaultProps={variant:"filled",margin:"dense"};var ne=["children"];var oe=W((function(e,t){e.children;var r=G(e,ne),n={},o={};Object.entries(r).forEach((function(e){var t=V(e,2),r=t[0],a=t[1];return r.startsWith("on")?o[r]=a:n[r]=a}));var a=new N.MarkerClusterGroup(n);return Object.entries(o).forEach((function(e){var t=V(e,2),r=t[0],n=t[1],o="cluster".concat(r.substring(2).toLowerCase());a.on(o,n)})),{instance:a,context:D(D({},t),{},{layerContainer:a})}})),ae=function(){var e=P(),t=new URLSearchParams(e.search);return U({moveend:function(e){t.set("lat",e.target.getCenter().lat),t.set("lng",e.target.getCenter().lng),navigate.replace({pathname:navigate.location.pathname,search:"?"+t.toString()})},zoomend:function(e){t.set("zoom",e.target.getZoom()),navigate.replace({pathname:navigate.location.pathname,search:"?"+t.toString()})}}),null},ie=I((function(){return{closeButton:{position:"absolute",zIndex:1400,top:0,right:0}}})),le=function(t){var r=t.record,o=t.basePath,a=t.popupContent,i=t.onClose,l=ie(),u=k();return n((function(){r&&u.setView([r.latitude,r.longitude])}),[r,u]),e.createElement(v,{anchor:"bottom",open:!!r,onClose:i},e.createElement(E,{p:1,position:"relative"},e.createElement(O,{onClick:i,className:l.closeButton,size:"large"},e.createElement(B,null)),r&&e.createElement(a,{record:r,basePath:o})))},ue=["latitude","longitude","label","description","popupContent","height","center","zoom","groupClusters","boundToMarkers","connectMarkers"],ce=I((function(){return{isLoading:{zIndex:1e3,position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center"}}})),se=function(r){var n,a=r.latitude,i=r.longitude,l=r.label,u=r.description,c=r.popupContent,s=r.height,p=r.center,f=r.zoom,m=r.groupClusters,g=r.boundToMarkers,d=r.connectMarkers,b=G(r,ue),y=h(),v=y.data,O=y.isLoading,A=V(o(),1)[0],w=x((function(){return A.breakpoints.down("sm")}),{noSsr:!0}),j=V(t(null),2),C=j[0],I=j[1],U=ce(),k=P(),N=new URLSearchParams(k.search);p=N.has("lat")&&N.has("lng")?[N.get("lat"),N.get("lng")]:p,f=N.has("zoom")?N.get("zoom"):f;var W=O?[]:v.map((function(e){return D(D({},e),{},{latitude:a&&a(e),longitude:i&&i(e),label:l&&l(e),description:u&&u(e)})})).filter((function(e){return e.latitude&&e.longitude})),B=g&&W.length>0?W.map((function(e){return[e.latitude,e.longitude]})):void 0;if(g&&!B)return null;var H=W.map((function(t,r){var o=e.createElement(e.Fragment,{key:r},e.createElement(z,{position:[t.latitude,t.longitude],eventHandlers:w?{click:function(){return I(t)}}:void 0},!w&&e.createElement(T,null,e.createElement(c,{record:t}))),d&&n&&e.createElement(M,{positions:[[n.latitude,n.longitude],[t.latitude,t.longitude]]}));return n=t,o}));return e.createElement(R,Y({style:{height:s},center:g?void 0:p,zoom:g?void 0:f,bounds:B},b),e.createElement(L,{attribution:'© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}),O&&e.createElement(E,{alignItems:"center",className:U.isLoading},e.createElement(S,{size:60,thickness:6})),m?e.createElement(oe,{showCoverageOnHover:!1},H):H,e.createElement(ae,null),e.createElement(le,{record:C,popupContent:c,onClose:function(){return I(null)}}))};se.defaultProps={height:700,center:[47,2.213749],zoom:6,groupClusters:!0,connectMarkers:!1,scrollWheelZoom:!1,popupContent:function(t){var r=t.record,n=t.basePath,o=f({});return e.createElement(e.Fragment,null,r.label&&e.createElement(y,{variant:"h5"},r.label),r.description&&e.createElement(y,null,r.description.length>150?r.description.substring(0,150)+"...":r.description),o.hasShow&&e.createElement(m,{basePath:n,record:r}),o.hasEdit&&e.createElement(g,{basePath:n,record:r}))}};var pe=function(e){var t=e.center,r=e.zoom;return k().setView(t,r),null},fe=["record","latitude","longitude","address","height","addLabel","typographyProps"],me=function(t){var r=t.record,n=t.latitude,o=t.longitude,a=t.address,i=t.height;t.addLabel;var l=t.typographyProps,u=G(t,fe),c=[n(r),o(r)];return c[0]&&c[1]?e.createElement(E,null,a&&e.createElement(E,{mt:1,mb:1},e.createElement(y,l,a(r))),e.createElement(R,Y({style:{height:i},center:c},u),e.createElement(pe,{center:c}),e.createElement(L,{attribution:'© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}),e.createElement(z,{position:c}))):null};me.defaultProps={height:400,zoom:11,addLabel:!0};export{re as LocationInput,me as MapField,se as MapList,H as extractContext};
//# sourceMappingURL=index.es.js.map
