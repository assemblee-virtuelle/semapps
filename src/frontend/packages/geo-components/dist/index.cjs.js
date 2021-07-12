"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}Object.defineProperty(exports,"__esModule",{value:!0});var t=require("react"),n=e(t),r=require("react-admin"),o=require("@material-ui/core"),a=e(require("@material-ui/lab/Autocomplete")),i=e(require("@material-ui/icons/LocationOn")),u=require("react-router"),s=e(require("@material-ui/core/CircularProgress")),l=require("react-dom"),c=require("leaflet"),f=e(c);require("leaflet.markercluster");var p=e(require("@material-ui/icons/Close")),b=function(e){var t=e.record,a=e.basePath,i=r.useResourceDefinition({});return n.createElement(n.Fragment,null,t.label&&n.createElement(o.Typography,{variant:"h5"},t.label),t.description&&n.createElement(o.Typography,null,t.description.length>150?t.description.substring(0,150)+"...":t.description),i.hasShow&&n.createElement(r.ShowButton,{basePath:a,record:t}),i.hasEdit&&n.createElement(r.EditButton,{basePath:a,record:t}))};function d(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function m(){return(m=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function h(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function y(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?h(Object(n),!0).forEach((function(t){d(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):h(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function g(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}function v(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var n=[],r=!0,o=!1,a=void 0;try{for(var i,u=e[Symbol.iterator]();!(r=(i=u.next()).done)&&(n.push(i.value),!t||n.length!==t);r=!0);}catch(e){o=!0,a=e}finally{try{r||null==u.return||u.return()}finally{if(o)throw a}}return n}(e,t)||x(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function O(e){return function(e){if(Array.isArray(e))return E(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||x(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function x(e,t){if(e){if("string"==typeof e)return E(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?E(e,t):void 0}}function E(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var j="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function w(e,t){return e(t={exports:{}},t.exports),t.exports}var C=w((function(e){
// @license MIT
!function(t,n){e.exports?e.exports=n():this.Diacritics=n()}(0,(function(){for(var e={map:{}},t=[{base:" ",letters:" "},{base:"A",letters:"AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ"},{base:"AA",letters:"Ꜳ"},{base:"AE",letters:"ÆǼǢ"},{base:"AO",letters:"Ꜵ"},{base:"AU",letters:"Ꜷ"},{base:"AV",letters:"ꜸꜺ"},{base:"AY",letters:"Ꜽ"},{base:"B",letters:"BⒷＢḂḄḆɃƂƁ"},{base:"C",letters:"CⒸＣĆĈĊČÇḈƇȻꜾ"},{base:"D",letters:"DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ"},{base:"DZ",letters:"ǱǄ"},{base:"Dz",letters:"ǲǅ"},{base:"E",letters:"EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ"},{base:"F",letters:"FⒻＦḞƑꝻ"},{base:"G",letters:"GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ"},{base:"H",letters:"HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ"},{base:"I",letters:"IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ"},{base:"J",letters:"JⒿＪĴɈ"},{base:"K",letters:"KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ"},{base:"L",letters:"LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ"},{base:"LJ",letters:"Ǉ"},{base:"Lj",letters:"ǈ"},{base:"M",letters:"MⓂＭḾṀṂⱮƜ"},{base:"N",letters:"NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ"},{base:"NJ",letters:"Ǌ"},{base:"Nj",letters:"ǋ"},{base:"O",letters:"OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ"},{base:"OI",letters:"Ƣ"},{base:"OO",letters:"Ꝏ"},{base:"OU",letters:"Ȣ"},{base:"P",letters:"PⓅＰṔṖƤⱣꝐꝒꝔ"},{base:"Q",letters:"QⓆＱꝖꝘɊ"},{base:"R",letters:"RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ"},{base:"S",letters:"SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ"},{base:"T",letters:"TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ"},{base:"Th",letters:"Þ"},{base:"TZ",letters:"Ꜩ"},{base:"U",letters:"UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ"},{base:"V",letters:"VⓋＶṼṾƲꝞɅ"},{base:"VY",letters:"Ꝡ"},{base:"W",letters:"WⓌＷẀẂŴẆẄẈⱲ"},{base:"X",letters:"XⓍＸẊẌ"},{base:"Y",letters:"YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ"},{base:"Z",letters:"ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ"},{base:"a",letters:"aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐɑ"},{base:"aa",letters:"ꜳ"},{base:"ae",letters:"æǽǣ"},{base:"ao",letters:"ꜵ"},{base:"au",letters:"ꜷ"},{base:"av",letters:"ꜹꜻ"},{base:"ay",letters:"ꜽ"},{base:"b",letters:"bⓑｂḃḅḇƀƃɓ"},{base:"c",letters:"cⓒｃćĉċčçḉƈȼꜿↄ"},{base:"d",letters:"dⓓｄḋďḍḑḓḏđƌɖɗꝺ"},{base:"dz",letters:"ǳǆ"},{base:"e",letters:"eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ"},{base:"f",letters:"fⓕｆḟƒꝼ"},{base:"ff",letters:"ﬀ"},{base:"fi",letters:"ﬁ"},{base:"fl",letters:"ﬂ"},{base:"ffi",letters:"ﬃ"},{base:"ffl",letters:"ﬄ"},{base:"g",letters:"gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ"},{base:"h",letters:"hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ"},{base:"hv",letters:"ƕ"},{base:"i",letters:"iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı"},{base:"j",letters:"jⓙｊĵǰɉ"},{base:"k",letters:"kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ"},{base:"l",letters:"lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ"},{base:"lj",letters:"ǉ"},{base:"m",letters:"mⓜｍḿṁṃɱɯ"},{base:"n",letters:"nñnⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥлԉ"},{base:"nj",letters:"ǌ"},{base:"o",letters:"߀oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ"},{base:"oe",letters:"Œœ"},{base:"oi",letters:"ƣ"},{base:"ou",letters:"ȣ"},{base:"oo",letters:"ꝏ"},{base:"p",letters:"pⓟｐṕṗƥᵽꝑꝓꝕ"},{base:"q",letters:"qⓠｑɋꝗꝙ"},{base:"r",letters:"rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ"},{base:"s",letters:"sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ"},{base:"ss",letters:"ß"},{base:"t",letters:"tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ"},{base:"th",letters:"þ"},{base:"tz",letters:"ꜩ"},{base:"u",letters:"uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ"},{base:"v",letters:"vⓥｖṽṿʋꝟʌ"},{base:"vy",letters:"ꝡ"},{base:"w",letters:"wⓦｗẁẃŵẇẅẘẉⱳ"},{base:"x",letters:"xⓧｘẋẍ"},{base:"y",letters:"yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ"},{base:"z",letters:"zⓩｚźẑżžẓẕƶȥɀⱬꝣ"}],n=0,r=t.length;n<r;n++)for(var o=t[n].letters.split(""),a=0,i=o.length;a<i;a++)e.map[o[a]]=t[n].base;return e.clean=function(t){if(!t||!t.length||t.length<1)return"";for(var n,r="",o=t.split(""),a=0,i=o.length;a<i;a++)r+=(n=o[a])in e.map?e.map[n]:n;return r},e}))})).clean,P=/[.*+?^${}()|[\]\\]/g,S=/[a-z0-9_]/i,L=/\s+/;var I=function(e,t){return e=C(e),(t=C(t)).trim().split(L).filter((function(e){return e.length>0})).reduce((function(t,n){var r=n.length,o=S.test(n[0])?"\\b":"",a=new RegExp(o+n.replace(P,"\\$&"),"i"),i=e.search(a);return i>-1&&(t.push([i,i+r]),e=e.slice(0,i)+new Array(r+1).join(" ")+e.slice(i+r)),t}),[]).sort((function(e,t){return e[0]-t[0]}))},T=/^\s+|\s+$/g,z=/^[-+]0x[0-9a-f]+$/i,A=/^0b[01]+$/i,k=/^0o[0-7]+$/i,R=parseInt,M="object"==typeof j&&j&&j.Object===Object&&j,D="object"==typeof self&&self&&self.Object===Object&&self,N=M||D||Function("return this")(),_=Object.prototype.toString,B=Math.max,H=Math.min,q=function(){return N.Date.now()};function F(e,t,n){var r,o,a,i,u,s,l=0,c=!1,f=!1,p=!0;if("function"!=typeof e)throw new TypeError("Expected a function");function b(t){var n=r,a=o;return r=o=void 0,l=t,i=e.apply(a,n)}function d(e){return l=e,u=setTimeout(h,t),c?b(e):i}function m(e){var n=e-s;return void 0===s||n>=t||n<0||f&&e-l>=a}function h(){var e=q();if(m(e))return y(e);u=setTimeout(h,function(e){var n=t-(e-s);return f?H(n,a-(e-l)):n}(e))}function y(e){return u=void 0,p&&r?b(e):(r=o=void 0,i)}function g(){var e=q(),n=m(e);if(r=arguments,o=this,s=e,n){if(void 0===u)return d(s);if(f)return u=setTimeout(h,t),b(s)}return void 0===u&&(u=setTimeout(h,t)),i}return t=W(t)||0,U(n)&&(c=!!n.leading,a=(f="maxWait"in n)?B(W(n.maxWait)||0,t):a,p="trailing"in n?!!n.trailing:p),g.cancel=function(){void 0!==u&&clearTimeout(u),l=0,r=s=o=u=void 0},g.flush=function(){return void 0===u?i:y(q())},g}function U(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function W(e){if("number"==typeof e)return e;if(function(e){return"symbol"==typeof e||function(e){return!!e&&"object"==typeof e}(e)&&"[object Symbol]"==_.call(e)}(e))return NaN;if(U(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=U(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(T,"");var n=A.test(e);return n||k.test(e)?R(e.slice(2),n?2:8):z.test(e)?NaN:+e}var Z=function(e,t,n){var r=!0,o=!0;if("function"!=typeof e)throw new TypeError("Expected a function");return U(n)&&(r="leading"in n?!!n.leading:r,o="trailing"in n?!!n.trailing:o),F(e,t,{leading:r,maxWait:t,trailing:o})},$=o.makeStyles((function(e){return{icon:{color:e.palette.text.secondary,marginRight:e.spacing(2)}}})),G=function(e,t){return e.place_name?e.place_name:"string"==typeof t?e[t]:"function"==typeof t?t(e):void 0},V=function(e){var u=e.mapboxConfig,s=(e.record,e.resource),l=e.source,c=e.label,f=(e.basePath,e.parse),p=e.optionText,b=e.helperText,d=g(e,["mapboxConfig","record","resource","source","label","basePath","parse","optionText","helperText"]),h=$(),x=r.useLocale(),E=r.useTranslate(),j=v(t.useState(""),2),w=j[0],C=j[1],P=v(t.useState([]),2),S=P[0],L=P[1],T=r.useInput({resource:s,source:l}),z=T.input,A=z.value,k=z.onChange,R=z.onBlur,M=z.onFocus,D=T.isRequired,N=T.meta,_=N.error,B=N.submitError,H=N.touched,q=t.useMemo((function(){return Z((function(e,t){var n=new URL("https://api.mapbox.com/geocoding/v5/mapbox.places/".concat(e,".json"));u.language||(u.language=x),Object.entries(u).forEach((function(e){var t=v(e,2),r=t[0],o=t[1];Array.isArray(o)?o=o.join(","):"boolean"==typeof o&&(o=o?"true":"false"),n.searchParams.set(r,o)})),fetch(n.toString()).then((function(e){return e.json()})).then((function(e){return t(e)}))}),200)}),[u,x]);return t.useEffect((function(){w&&w!==G(A,p)&&q(w,(function(e){return L(e.features)}))}),[A,w,q]),n.createElement(a,{autoComplete:!0,value:A||null,options:A?[A].concat(O(S)):S,filterSelectedOptions:!0,filterOptions:function(e){return e},getOptionLabel:function(e){return G(e,p)},getOptionSelected:function(e,t){return G(e,p)===G(t,p)},onChange:function(e,t){t&&f&&(t=f(t)),k(t),L([])},onInputChange:function(e,t){return C(t)},noOptionsText:E("ra.navigation.no_results"),renderInput:function(e){return e.inputProps.autoComplete="new-password",n.createElement(o.TextField,m({},e,{inputProps:y(y({},e.inputProps),{},{onBlur:function(t){R(t),e.inputProps.onBlur&&e.inputProps.onBlur(t)},onFocus:function(t){M(t),e.inputProps.onFocus&&e.inputProps.onFocus(t)}}),label:""!==c&&!1!==c&&n.createElement(r.FieldTitle,{label:c,source:l,resource:s,isRequired:D}),error:!(!H||!_&&!B),helperText:n.createElement(r.InputHelperText,{touched:H,error:_||B,helperText:b})},d))},renderOption:function(e){var t=I(e.text,w),r=function(e,t){var n=[];return 0===t.length?n.push({text:e,highlight:!1}):t[0][0]>0&&n.push({text:e.slice(0,t[0][0]),highlight:!1}),t.forEach((function(r,o){var a=r[0],i=r[1];n.push({text:e.slice(a,i),highlight:!0}),o===t.length-1?i<e.length&&n.push({text:e.slice(i,e.length),highlight:!1}):i<t[o+1][0]&&n.push({text:e.slice(i,t[o+1][0]),highlight:!1})})),n}(e.text,t);return n.createElement(o.Grid,{container:!0,alignItems:"center"},n.createElement(o.Grid,{item:!0},n.createElement(i,{className:h.icon})),n.createElement(o.Grid,{item:!0,xs:!0},"string"==typeof r?r:r.map((function(e,t){return n.createElement("span",{key:t,style:{fontWeight:e.highlight?700:400}},e.text)})),n.createElement(o.Typography,{variant:"body2",color:"textSecondary"},e.place_name)))}})};function J(e,n){const r=t.useRef(n);t.useEffect((function(){n!==r.current&&null!=e.attributionControl&&(null!=r.current&&e.attributionControl.removeAttribution(r.current),null!=n&&e.attributionControl.addAttribution(n)),r.current=n}),[e,n])}V.defaultProps={variant:"filled",margin:"dense"};const Q=t.createContext(null),Y=Q.Provider;function X(){const e=t.useContext(Q);if(null==e)throw new Error("No context provided: useLeafletContext() can only be used in a descendant of <MapContainer>");return e}function K(e){function r(r,o){const{instance:a,context:i}=e(r).current;return t.useImperativeHandle(o,()=>a),null==r.children?null:n.createElement(Y,{value:i},r.children)}return t.forwardRef(r)}function ee(e){function n(n,r){const[o,a]=t.useState(!1),{instance:i}=e(n,a).current;t.useImperativeHandle(r,()=>i),t.useEffect((function(){o&&i.update()}),[i,o,n.children]);const u=i._contentNode;return u?l.createPortal(n.children,u):null}return t.forwardRef(n)}function te(e){function n(n,r){const{instance:o}=e(n).current;return t.useImperativeHandle(r,()=>o),null}return t.forwardRef(n)}function ne(e){return function(n){const r=X(),o=e(n,r),{instance:a}=o.current,i=t.useRef(n.position),{position:u}=n;return t.useEffect((function(){return a.addTo(r.map),function(){a.remove()}}),[r.map,a]),t.useEffect((function(){null!=u&&u!==i.current&&(a.setPosition(u),i.current=u)}),[a,u]),o}}function re(e,n){const r=t.useRef();t.useEffect((function(){return null!=n&&e.instance.on(n),r.current=n,function(){null!=r.current&&e.instance.off(r.current),r.current=null}}),[e,n])}function oe(e,t){var n;const r=null!=(n=e.pane)?n:t.pane;return r?{...e,pane:r}:e}function ae(e,t){return function(n,r){const o=X(),a=e(oe(n,o),o);return J(o.map,n.attribution),re(a.current,n.eventHandlers),t(a.current,o,n,r),a}}function ie(e){return e.split(" ").filter(Boolean)}function ue(e,t){ie(t).forEach(t=>{c.DomUtil.addClass(e,t)})}function se(e,t){ie(t).forEach(t=>{c.DomUtil.removeClass(e,t)})}function le(e,n){return null==n?function(n,r){return t.useRef(e(n,r))}:function(r,o){const a=t.useRef(e(r,o)),i=t.useRef(r),{instance:u}=a.current;return t.useEffect((function(){i.current!==r&&(n(u,r,i.current),i.current=r)}),[u,r,o]),a}}function ce(e,n){t.useEffect((function(){var t;const r=null!=(t=n.layerContainer)?t:n.map;return r.addLayer(e.instance),function(){r.removeLayer(e.instance)}}),[n,e])}function fe(e){return function(t){const n=X(),r=e(oe(t,n),n);return J(n.map,t.attribution),re(r.current,t.eventHandlers),ce(r.current,n),r}}function pe(e,n){const r=t.useRef();t.useEffect((function(){if(n.pathOptions!==r.current){var t;const o=null!=(t=n.pathOptions)?t:{};e.instance.setStyle(o),r.current=o}}),[e,n])}function be(e){return function(t){const n=X(),r=e(oe(t,n),n);return re(r.current,t.eventHandlers),ce(r.current,n),pe(r.current,t),r}}function de(e,t){return K(fe(le(e,t)))}function me(e,t){return ee(ae(le(e),t))}function he(e,t){return K(be(le(e,t)))}function ye(e,t){return te(fe(le(e,t)))}function ge(e,t,n){const{opacity:r,zIndex:o}=t;null!=r&&r!==n.opacity&&e.setOpacity(r),null!=o&&o!==n.zIndex&&e.setZIndex(o)}var ve=Object.freeze({__proto__:null,useAttribution:J,updateCircle:function(e,t,n){t.center!==n.center&&e.setLatLng(t.center),null!=t.radius&&t.radius!==n.radius&&e.setRadius(t.radius)},createContainerComponent:K,createDivOverlayComponent:ee,createLeafComponent:te,CONTEXT_VERSION:1,LeafletContext:Q,LeafletProvider:Y,useLeafletContext:X,createControlHook:ne,createDivOverlayHook:ae,addClassName:ue,removeClassName:se,updateClassName:function(e,t,n){null!=e&&n!==t&&(null!=t&&t.length>0&&se(e,t),null!=n&&n.length>0&&ue(e,n))},createElementHook:le,useEventHandlers:re,createControlComponent:function(e){return te(ne(le((function(t,n){return{instance:e(t),context:n}}))))},createLayerComponent:de,createOverlayComponent:me,createPathComponent:he,createTileLayerComponent:ye,updateGridLayer:ge,createLayerHook:fe,useLayerLifecycle:ce,updateMediaOverlay:function(e,t,n){t.bounds instanceof c.LatLngBounds&&t.bounds!==n.bounds&&e.setBounds(t.bounds),null!=t.opacity&&t.opacity!==n.opacity&&e.setOpacity(t.opacity),null!=t.zIndex&&t.zIndex!==n.zIndex&&e.setZIndex(t.zIndex)},withPane:oe,createPathHook:be,usePathOptions:pe});function Oe(e){const n=X().map;return t.useEffect((function(){return n.on(e),function(){n.off(e)}}),[n,e]),n}function xe(){return(xe=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function Ee({children:e,className:r,id:o,placeholder:a,style:i,whenCreated:u,...s}){const l=t.useRef(null),f=function(e,n){const[r,o]=t.useState(null);return t.useEffect(()=>{if(null!==e.current&&null===r){const t=new c.Map(e.current,n);null!=n.center&&null!=n.zoom?t.setView(n.center,n.zoom):null!=n.bounds&&t.fitBounds(n.bounds,n.boundsOptions),null!=n.whenReady&&t.whenReady(n.whenReady),o(t)}},[e,r,n]),r}(l,s),p=t.useRef(!1);t.useEffect(()=>{null!=f&&!1===p.current&&null!=u&&(p.current=!0,u(f))},[f,u]);const[b]=t.useState({className:r,id:o,style:i}),d=t.useMemo(()=>f?{__version:1,map:f}:null,[f]),m=d?n.createElement(Y,{value:d},e):null!=a?a:null;return n.createElement("div",xe({},b,{ref:l}),m)}const je=de((function({position:e,...t},n){const r=new c.Marker(e,t);return{instance:r,context:{...n,overlayContainer:r}}}),(function(e,t,n){t.position!==n.position&&e.setLatLng(t.position),null!=t.icon&&t.icon!==n.icon&&e.setIcon(t.icon),null!=t.zIndexOffset&&t.zIndexOffset!==n.zIndexOffset&&e.setZIndexOffset(t.zIndexOffset),null!=t.opacity&&t.opacity!==n.opacity&&e.setOpacity(t.opacity),null!=e.dragging&&t.draggable!==n.draggable&&(!0===t.draggable?e.dragging.enable():e.dragging.disable())})),we=he((function({positions:e,...t},n){const r=new c.Polyline(e,t);return{instance:r,context:{...n,overlayContainer:r}}}),(function(e,t,n){t.positions!==n.positions&&e.setLatLngs(t.positions)})),Ce=me((function(e,t){return{instance:new c.Popup(e,t.overlayContainer),context:t}}),(function(e,n,r,o){const{onClose:a,onOpen:i,position:u}=r;t.useEffect((function(){const{instance:t}=e;function r(e){e.popup===t&&(t.update(),o(!0),null==i||i())}function s(e){e.popup===t&&(o(!1),null==a||a())}return n.map.on({popupopen:r,popupclose:s}),null==n.overlayContainer?(null!=u&&t.setLatLng(u),t.openOn(n.map)):n.overlayContainer.bindPopup(t),function(){n.map.off({popupopen:r,popupclose:s}),null==n.overlayContainer?n.map.removeLayer(t):n.overlayContainer.unbindPopup()}}),[e,n,o,a,i,u])})),Pe=ye((function({url:e,...t},n){return{instance:new c.TileLayer(e,oe(t,n)),context:n}}),ge);var Se,Le=w((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n,r=(n=f)&&n.__esModule?n:{default:n};function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function u(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var n=[],r=!0,o=!1,a=void 0;try{for(var i,u=e[Symbol.iterator]();!(r=(i=u.next()).done)&&(n.push(i.value),!t||n.length!==t);r=!0);}catch(e){o=!0,a=e}finally{try{r||null==u.return||u.return()}finally{if(o)throw a}}return n}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return s(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return s(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=(0,ve.createPathComponent)((function(e,t){e.children;var n=l(e,["children"]),o={},i={};Object.entries(n).forEach((function(e){var t=u(e,2),n=t[0],r=t[1];return n.startsWith("on")?i[n]=r:o[n]=r}));var s=new r.default.markerClusterGroup(o);return Object.entries(i).forEach((function(e){var t=u(e,2),n=t[0],r=t[1],o="cluster".concat(n.substring(2).toLowerCase());s.on(o,r)})),{instance:s,context:a(a({},t),{},{layerContainer:s})}}));t.default=c})),Ie=(Se=Le)&&Se.__esModule&&Object.prototype.hasOwnProperty.call(Se,"default")?Se.default:Se,Te=function(){var e=u.useHistory(),t=new URLSearchParams(e.location.search);return Oe({moveend:function(n){t.set("lat",n.target.getCenter().lat),t.set("lng",n.target.getCenter().lng),e.replace({pathname:e.location.pathname,search:"?"+t.toString()})},zoomend:function(n){t.set("zoom",n.target.getZoom()),e.replace({pathname:e.location.pathname,search:"?"+t.toString()})}}),null},ze=o.makeStyles((function(){return{loading:{zIndex:1e3,position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center"},closeButton:{position:"absolute",zIndex:1400,top:0,right:0}}})),Ae=function(e){var a,i=e.latitude,l=e.longitude,c=e.label,f=e.description,b=e.popupContent,d=e.height,h=e.center,O=e.zoom,x=e.boundToMarkers,E=e.connectMarkers,j=g(e,["latitude","longitude","label","description","popupContent","height","center","zoom","boundToMarkers","connectMarkers"]),w=r.useListContext(),C=w.ids,P=w.data,S=w.basePath,L=w.loading,I=o.useMediaQuery((function(e){return e.breakpoints.down("xs")}),{noSsr:!0}),T=v(t.useState(null),2),z=T[0],A=T[1],k=v(t.useState(null),2),R=k[0],M=k[1],D=ze(),N=new URLSearchParams(u.useLocation().search);h=N.has("lat")&&N.has("lng")?[N.get("lat"),N.get("lng")]:h,O=N.has("zoom")?N.get("zoom"):O;var _=C.map((function(e){return y(y({},P[e]),{},{latitude:i&&i(P[e]),longitude:l&&l(P[e]),label:c&&c(P[e]),description:f&&f(P[e])})})).filter((function(e){return e.latitude&&e.longitude})),B=x&&_.length>0?_.map((function(e){return[e.latitude,e.longitude]})):void 0;return x&&!B?null:n.createElement(Ee,m({style:{height:d},center:x?void 0:h,zoom:x?void 0:O,bounds:B,whenCreated:M},j),n.createElement(Pe,{attribution:'© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}),L&&n.createElement(o.Box,{alignItems:"center",className:D.loading},n.createElement(s,{size:60,thickness:6})),n.createElement(Ie,{showCoverageOnHover:!1},_.map((function(e,t){var r=n.createElement(n.Fragment,{key:t},n.createElement(je,{position:[e.latitude,e.longitude],eventHandlers:I?{click:function(){R.setView([e.latitude,e.longitude]),A(e)}}:void 0},!I&&n.createElement(Ce,null,n.createElement(b,{record:e,basePath:S}))),E&&a&&n.createElement(we,{positions:[[a.latitude,a.longitude],[e.latitude,e.longitude]]}));return a=e,r}))),n.createElement(Te,null),n.createElement(o.Drawer,{anchor:"bottom",open:!!z,onClose:function(){return A(null)}},n.createElement(o.Box,{p:1,position:"relative"},n.createElement(o.IconButton,{onClick:function(){return A(null)},className:D.closeButton},n.createElement(p,null)),z&&n.createElement(b,{record:z,basePath:S}))))};Ae.defaultProps={height:700,center:[47,2.213749],zoom:6,connectMarkers:!1,scrollWheelZoom:!1,popupContent:b};var ke=o.makeStyles((function(e){return{address:{marginTop:e.spacing(2),marginBottom:e.spacing(1)}}})),Re=function(e){var t=e.record,r=e.latitude,a=e.longitude,i=e.address,u=e.height,s=e.addLabel,l=g(e,["record","latitude","longitude","address","height","addLabel"]),c=ke(),f=[r(t),a(t)];return f[0]&&f[1]?n.createElement(o.Box,{addLabel:s},i&&n.createElement(o.Typography,{className:c.address},i(t)),n.createElement(Ee,m({style:{height:u},center:f},l),n.createElement(Pe,{attribution:'© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}),n.createElement(je,{position:f}))):null};Re.defaultProps={height:400,zoom:11,addLabel:!0},exports.DefaultPopupContent=b,exports.LocationInput=V,exports.MapField=Re,exports.MapList=Ae,exports.QueryStringUpdater=Te,exports.extractContext=function(e,t){var n=e.find((function(e){return e.id.startsWith(t+".")}));if(n)return n.text};
//# sourceMappingURL=index.cjs.js.map
