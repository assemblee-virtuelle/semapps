import e,{useState as t,useMemo as r,useEffect as n,useCallback as a}from"react";import{Form as o}from"react-final-form";import{useLocale as i,useTranslate as s,useInput as l,FieldTitle as c,useCreateSuggestionContext as u,useResourceContext as f,useCreate as p,useDataProvider as m,useRedirect as b,useNotify as d,FormInput as h,TextInput as g,RadioButtonGroupInput as v,SimpleForm as y}from"react-admin";import{makeStyles as x,TextField as w,Grid as E,Typography as O,Dialog as j,DialogContent as S,DialogActions as P,Button as A,Box as k,Toolbar as C,useMediaQuery as R,Tabs as T,Tab as I,Divider as U}from"@material-ui/core";import L from"@material-ui/lab/Autocomplete";import W from"@material-ui/icons/Language";import F from"@material-ui/icons/Add";import D from"final-form-calculate";import N from"@material-ui/icons/SaveAlt";import{useContainers as V,ReferenceInput as B}from"@semapps/semantic-data-provider";import{MultiServerAutocompleteInput as M}from"@semapps/input-components";import $ from"@material-ui/icons/Save";import q from"@material-ui/icons/StarBorder";function z(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function J(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?z(Object(r),!0).forEach((function(t){_(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):z(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function Y(e,t,r,n,a,o,i){try{var s=e[o](i),l=s.value}catch(e){return void r(e)}s.done?t(l):Promise.resolve(l).then(n,a)}function Z(e){return function(){var t=this,r=arguments;return new Promise((function(n,a){var o=e.apply(t,r);function i(e){Y(o,n,a,i,s,"next",e)}function s(e){Y(o,n,a,i,s,"throw",e)}i(void 0)}))}}function _(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function G(){return(G=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function H(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}function K(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==r)return;var n,a,o=[],i=!0,s=!1;try{for(r=r.call(e);!(i=(n=r.next()).done)&&(o.push(n.value),!t||o.length!==t);i=!0);}catch(e){s=!0,a=e}finally{try{i||null==r.return||r.return()}finally{if(s)throw a}}return o}(e,t)||X(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Q(e){return function(e){if(Array.isArray(e))return ee(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||X(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function X(e,t){if(e){if("string"==typeof e)return ee(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?ee(e,t):void 0}}function ee(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var te="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};var re=function(e,t){return e(t={exports:{}},t.exports),t.exports}((function(e){
// @license MIT
!function(t,r){e.exports?e.exports=r():this.Diacritics=r()}(0,(function(){for(var e={map:{}},t=[{base:" ",letters:" "},{base:"A",letters:"AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ"},{base:"AA",letters:"Ꜳ"},{base:"AE",letters:"ÆǼǢ"},{base:"AO",letters:"Ꜵ"},{base:"AU",letters:"Ꜷ"},{base:"AV",letters:"ꜸꜺ"},{base:"AY",letters:"Ꜽ"},{base:"B",letters:"BⒷＢḂḄḆɃƂƁ"},{base:"C",letters:"CⒸＣĆĈĊČÇḈƇȻꜾ"},{base:"D",letters:"DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ"},{base:"DZ",letters:"ǱǄ"},{base:"Dz",letters:"ǲǅ"},{base:"E",letters:"EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ"},{base:"F",letters:"FⒻＦḞƑꝻ"},{base:"G",letters:"GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ"},{base:"H",letters:"HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ"},{base:"I",letters:"IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ"},{base:"J",letters:"JⒿＪĴɈ"},{base:"K",letters:"KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ"},{base:"L",letters:"LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ"},{base:"LJ",letters:"Ǉ"},{base:"Lj",letters:"ǈ"},{base:"M",letters:"MⓂＭḾṀṂⱮƜ"},{base:"N",letters:"NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ"},{base:"NJ",letters:"Ǌ"},{base:"Nj",letters:"ǋ"},{base:"O",letters:"OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ"},{base:"OI",letters:"Ƣ"},{base:"OO",letters:"Ꝏ"},{base:"OU",letters:"Ȣ"},{base:"P",letters:"PⓅＰṔṖƤⱣꝐꝒꝔ"},{base:"Q",letters:"QⓆＱꝖꝘɊ"},{base:"R",letters:"RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ"},{base:"S",letters:"SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ"},{base:"T",letters:"TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ"},{base:"Th",letters:"Þ"},{base:"TZ",letters:"Ꜩ"},{base:"U",letters:"UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ"},{base:"V",letters:"VⓋＶṼṾƲꝞɅ"},{base:"VY",letters:"Ꝡ"},{base:"W",letters:"WⓌＷẀẂŴẆẄẈⱲ"},{base:"X",letters:"XⓍＸẊẌ"},{base:"Y",letters:"YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ"},{base:"Z",letters:"ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ"},{base:"a",letters:"aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐɑ"},{base:"aa",letters:"ꜳ"},{base:"ae",letters:"æǽǣ"},{base:"ao",letters:"ꜵ"},{base:"au",letters:"ꜷ"},{base:"av",letters:"ꜹꜻ"},{base:"ay",letters:"ꜽ"},{base:"b",letters:"bⓑｂḃḅḇƀƃɓ"},{base:"c",letters:"cⓒｃćĉċčçḉƈȼꜿↄ"},{base:"d",letters:"dⓓｄḋďḍḑḓḏđƌɖɗꝺ"},{base:"dz",letters:"ǳǆ"},{base:"e",letters:"eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ"},{base:"f",letters:"fⓕｆḟƒꝼ"},{base:"ff",letters:"ﬀ"},{base:"fi",letters:"ﬁ"},{base:"fl",letters:"ﬂ"},{base:"ffi",letters:"ﬃ"},{base:"ffl",letters:"ﬄ"},{base:"g",letters:"gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ"},{base:"h",letters:"hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ"},{base:"hv",letters:"ƕ"},{base:"i",letters:"iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı"},{base:"j",letters:"jⓙｊĵǰɉ"},{base:"k",letters:"kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ"},{base:"l",letters:"lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ"},{base:"lj",letters:"ǉ"},{base:"m",letters:"mⓜｍḿṁṃɱɯ"},{base:"n",letters:"nñnⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥлԉ"},{base:"nj",letters:"ǌ"},{base:"o",letters:"߀oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ"},{base:"oe",letters:"Œœ"},{base:"oi",letters:"ƣ"},{base:"ou",letters:"ȣ"},{base:"oo",letters:"ꝏ"},{base:"p",letters:"pⓟｐṕṗƥᵽꝑꝓꝕ"},{base:"q",letters:"qⓠｑɋꝗꝙ"},{base:"r",letters:"rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ"},{base:"s",letters:"sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ"},{base:"ss",letters:"ß"},{base:"t",letters:"tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ"},{base:"th",letters:"þ"},{base:"tz",letters:"ꜩ"},{base:"u",letters:"uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ"},{base:"v",letters:"vⓥｖṽṿʋꝟʌ"},{base:"vy",letters:"ꝡ"},{base:"w",letters:"wⓦｗẁẃŵẇẅẘẉⱳ"},{base:"x",letters:"xⓧｘẋẍ"},{base:"y",letters:"yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ"},{base:"z",letters:"zⓩｚźẑżžẓẕƶȥɀⱬꝣ"}],r=0,n=t.length;r<n;r++)for(var a=t[r].letters.split(""),o=0,i=a.length;o<i;o++)e.map[a[o]]=t[r].base;return e.clean=function(t){if(!t||!t.length||t.length<1)return"";for(var r,n="",a=t.split(""),o=0,i=a.length;o<i;o++)n+=(r=a[o])in e.map?e.map[r]:r;return n},e}))})).clean,ne=/[.*+?^${}()|[\]\\]/g,ae=/[a-z0-9_]/i,oe=/\s+/;var ie=function(e,t,r){var n,a;return a={insideWords:!1,findAllOccurrences:!1,requireMatchAll:!1},n=(n=r)||{},Object.keys(n).forEach((function(e){a[e]=!!n[e]})),r=a,e=re(e),(t=re(t)).trim().split(oe).filter((function(e){return e.length>0})).reduce((function(t,n){var a,o,i=n.length,s=!r.insideWords&&ae.test(n[0])?"\\b":"",l=new RegExp(s+n.replace(ne,"\\$&"),"i");if(a=l.exec(e),r.requireMatchAll&&null===a)return e="",[];for(;a&&(o=a.index,t.push([o,o+i]),e=e.slice(0,o)+new Array(i+1).join(" ")+e.slice(o+i),r.findAllOccurrences);)a=l.exec(e);return t}),[]).sort((function(e,t){return e[0]-t[0]}))},se=/^\s+|\s+$/g,le=/^[-+]0x[0-9a-f]+$/i,ce=/^0b[01]+$/i,ue=/^0o[0-7]+$/i,fe=parseInt,pe="object"==typeof te&&te&&te.Object===Object&&te,me="object"==typeof self&&self&&self.Object===Object&&self,be=pe||me||Function("return this")(),de=Object.prototype.toString,he=Math.max,ge=Math.min,ve=function(){return be.Date.now()};function ye(e,t,r){var n,a,o,i,s,l,c=0,u=!1,f=!1,p=!0;if("function"!=typeof e)throw new TypeError("Expected a function");function m(t){var r=n,o=a;return n=a=void 0,c=t,i=e.apply(o,r)}function b(e){return c=e,s=setTimeout(h,t),u?m(e):i}function d(e){var r=e-l;return void 0===l||r>=t||r<0||f&&e-c>=o}function h(){var e=ve();if(d(e))return g(e);s=setTimeout(h,function(e){var r=t-(e-l);return f?ge(r,o-(e-c)):r}(e))}function g(e){return s=void 0,p&&n?m(e):(n=a=void 0,i)}function v(){var e=ve(),r=d(e);if(n=arguments,a=this,l=e,r){if(void 0===s)return b(l);if(f)return s=setTimeout(h,t),m(l)}return void 0===s&&(s=setTimeout(h,t)),i}return t=we(t)||0,xe(r)&&(u=!!r.leading,o=(f="maxWait"in r)?he(we(r.maxWait)||0,t):o,p="trailing"in r?!!r.trailing:p),v.cancel=function(){void 0!==s&&clearTimeout(s),c=0,n=l=a=s=void 0},v.flush=function(){return void 0===s?i:g(ve())},v}function xe(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function we(e){if("number"==typeof e)return e;if(function(e){return"symbol"==typeof e||function(e){return!!e&&"object"==typeof e}(e)&&"[object Symbol]"==de.call(e)}(e))return NaN;if(xe(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=xe(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(se,"");var r=ce.test(e);return r||ue.test(e)?fe(e.slice(2),r?2:8):le.test(e)?NaN:+e}var Ee=function(e,t,r){var n=!0,a=!0;if("function"!=typeof e)throw new TypeError("Expected a function");return xe(r)&&(n="leading"in r?!!r.leading:n,a="trailing"in r?!!r.trailing:a),ye(e,t,{leading:n,maxWait:t,trailing:a})},Oe=["fetchLexicon","resource","source","initialValue","label","parse","optionText","helperText"],je=x((function(e){return{icon:{color:e.palette.text.secondary,marginRight:e.spacing(2)}}})),Se=function(e,t){return"string"==typeof e?e:e.label?e.label:"string"==typeof t?e[t]:"function"==typeof t?t(e):void 0},Pe=function(a){var o=a.fetchLexicon,u=a.resource,f=a.source,p=a.initialValue,m=a.label,b=a.parse,d=a.optionText;a.helperText;var h=H(a,Oe),g=je(),v=i(),y=s(),x=l(J({source:f,initialValue:p},h)),j=x.input,S=j.value,P=j.onChange,A=j.onBlur,k=j.onFocus,C=x.isRequired,R=x.meta,T=R.error,I=R.submitError,U=R.touched,D=K(t(p),2),N=D[0],V=D[1],B=K(t([]),2),M=B[0],$=B[1],q=r((function(){return Ee((function(e,t){o({keyword:e,locale:v}).then((function(e){return t(e)}))}),200)}),[v,o]);return n((function(){N&&q(N,(function(e){return $(e)}))}),[S,N,d,q]),e.createElement(L,{freeSolo:!0,autoComplete:!0,value:S||null,openOnFocus:!!p,options:S?[S].concat(Q(M)):M,filterSelectedOptions:!0,filterOptions:function(e,t){return""!==t.inputValue&&e.push({label:t.inputValue,summary:'Ajouter "'.concat(t.inputValue,'" au dictionnaire'),icon:F}),e},clearOnBlur:!0,selectOnFocus:!0,handleHomeEndKeys:!0,getOptionLabel:function(e){return Se(e,d)},getOptionSelected:function(e,t){return Se(e,d)===Se(t,d)},onChange:function(e,t){t&&b&&(t=b(t)),P(t),$([])},onInputChange:function(e,t){return V(t)},noOptionsText:y("ra.navigation.no_results"),renderInput:function(t){return t.inputProps.autoComplete="new-password",e.createElement(w,G({},t,{autoFocus:!0,inputProps:J(J({},t.inputProps),{},{onBlur:function(e){A(e),t.inputProps.onBlur&&t.inputProps.onBlur(e)},onFocus:function(e){k(e),t.inputProps.onFocus&&t.inputProps.onFocus(e)}}),label:""!==m&&!1!==m&&e.createElement(c,{label:m,source:f,resource:u,isRequired:C}),error:!(!U||!T&&!I)},h))},renderOption:function(t){var r=ie(t.label,N),n=function(e,t){var r=[];return 0===t.length?r.push({text:e,highlight:!1}):t[0][0]>0&&r.push({text:e.slice(0,t[0][0]),highlight:!1}),t.forEach((function(n,a){var o=n[0],i=n[1];r.push({text:e.slice(o,i),highlight:!0}),a===t.length-1?i<e.length&&r.push({text:e.slice(i,e.length),highlight:!1}):i<t[a+1][0]&&r.push({text:e.slice(i,t[a+1][0]),highlight:!1})})),r}(t.label,r);return e.createElement(E,{container:!0,alignItems:"center"},e.createElement(E,{item:!0},e.createElement(t.icon||W,{className:g.icon})),e.createElement(E,{item:!0,xs:!0},"string"==typeof n?n:n.map((function(t,r){return e.createElement("span",{key:r,style:{fontWeight:t.highlight?700:400}},t.text)})),e.createElement(O,{variant:"body2",color:"textSecondary"},t.summary)))}})};Pe.defaultProps={variant:"filled",margin:"dense"};var Ae=function(r){var n=r.fetchLexicon,i=r.selectData,s=u(),l=s.filter,c=s.onCancel,m=s.onCreate,b=f(),d=K(t(l||""),2),h=d[0],g=d[1],v=K(p(b),1)[0],y=a((function(e){var t=e.lexicon;t.uri||delete t.summary,v({payload:{data:i(t)}},{onSuccess:function(e){var t=e.data;g(""),m(t)}})}),[v,m,i]);return e.createElement(j,{open:!0,onClose:c,fullWidth:!0,maxWidth:"sm"},e.createElement(o,{onSubmit:y,render:function(t){var r=t.handleSubmit,a=t.dirtyFields;return e.createElement("form",{onSubmit:r},e.createElement(S,null,e.createElement(Pe,{label:"Titre",source:"lexicon",initialValue:h,fetchLexicon:n})),e.createElement(P,null,e.createElement(A,{onClick:c},"Annuler"),e.createElement(A,{variant:"contained",color:"primary",type:"submit",disabled:!a.lexicon},"Ajouter")))}}))},ke=function(e){var t=m(),r=b(),n=d();return a(function(){var a=Z(regeneratorRuntime.mark((function a(o){var i,s,l,c,u,f,p=arguments;return regeneratorRuntime.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return i=p.length>1&&void 0!==p[1]?p[1]:[],a.next=3,t.getOne(e,{id:o});case 3:return s=a.sent,l=s.data,(c=J({},l))["http://www.w3.org/ns/prov#wasDerivedFrom"]=c.id,delete c.id,delete c["@context"],i.forEach((function(e){delete c[e]})),a.next=12,t.create(e,{data:c});case 12:u=a.sent,f=u.data,r("/"+e+"/"+encodeURIComponent(f.id)+"/show"),n("La ressource a bien été copiée",{type:"success"});case 16:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}(),[e,t,r,n])},Ce=function(e){var t=m(),r=d(),n=b();return a(function(){var a=Z(regeneratorRuntime.mark((function a(o){return regeneratorRuntime.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,t.create(e,{id:o});case 2:n("/"+e+"/"+encodeURIComponent(o)+"/show"),r("La ressource a bien été importée",{type:"success"});case 4:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}(),[t,n,r])},Re=x((function(e){return{toolbar:{backgroundColor:"light"===e.palette.type?e.palette.grey[100]:e.palette.grey[900],marginTop:e.spacing(2)},field:{marginBottom:23,minWidth:e.spacing(20)}}})),Te=D({field:"remoteUri",updates:function(e){return e?{plainUri:e}:{}}},{field:"plainUri",updates:function(e,t,r){return e!==r.remoteUri?{remoteUri:null}:{}}}),Ie=function(t){var r=t.basePath,n=t.record,i=t.resource,s=t.stripProperties,l=Re(),c=V(i,"@remote"),u=ke(i),f=Ce(i),p=a(function(){var e=Z(regeneratorRuntime.mark((function e(t){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=t.plainUri,"fork"!==t.method){e.next=6;break}return e.next=4,u(r,s);case 4:e.next=8;break;case 6:return e.next=8,f(r);case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[u,f,s]);return e.createElement(o,{onSubmit:p,decorators:[Te],initialValues:{method:"fork"},render:function(t){var a=t.handleSubmit,o=t.dirtyFields;return e.createElement("form",{onSubmit:a},e.createElement(k,{m:"1em"},c&&Object.keys(c).length>0&&e.createElement(h,{input:e.createElement(B,{source:"remoteUri",label:"Rechercher...",reference:i,filter:{_servers:"@remote"},fullWidth:!0},e.createElement(M,{optionText:"pair:label",shouldRenderSuggestions:function(e){return e.length>1},resettable:!0})),basePath:r,record:n,resource:i,variant:"filled",margin:"dense"}),e.createElement(h,{input:e.createElement(g,{source:"plainUri",label:"URL de la ressource distante",fullWidth:!0}),basePath:r,record:n,resource:i,variant:"filled",margin:"dense"}),e.createElement(h,{input:e.createElement(v,{source:"method",label:"Méthode d'importation",choices:[{id:"sync",name:"Garder la ressource locale synchronisée avec la ressource distante"},{id:"fork",name:"Créer une nouvelle version de la ressource (fork)"}]}),basePath:r,record:n,resource:i,variant:"filled",margin:"dense"})),e.createElement(C,{className:l.toolbar},e.createElement(A,{type:"submit",startIcon:e.createElement(N,null),variant:"contained",color:"primary",disabled:!o.remoteUri},"Importer")))}})},Ue=["stripProperties"],Le=x((function(e){return{tab:{maxWidth:"unset",padding:"6px 24px"}}})),We=function(r){var n=r.stripProperties,a=H(r,Ue),o=K(t(0),2),i=o[0],s=o[1],l=R((function(e){return e.breakpoints.down("xs")}),{noSsr:!0}),c=Le();return e.createElement(e.Fragment,null,e.createElement(k,{pb:2,fullWidth:!0},e.createElement(T,{value:i,onChange:function(e,t){return s(t)},indicatorColor:"primary"},e.createElement(I,{className:c.tab,label:"Créer"}),e.createElement(I,{className:c.tab,label:l?"Importer":"Importer une ressource distante"})),e.createElement(U,null)),0===i&&e.createElement(y,a),1===i&&e.createElement(Ie,G({stripProperties:n||[]},a)))},Fe=["resource","fetchLexicon","selectData","redirect","save","saving"],De=x((function(e){return{toolbar:{backgroundColor:"light"===e.palette.type?e.palette.grey[100]:e.palette.grey[900],marginTop:e.spacing(2)},field:{marginBottom:23,minWidth:e.spacing(20)}}})),Ne=function(t){t.resource;var r=t.fetchLexicon,n=t.selectData,i=t.redirect,s=t.save;t.saving,H(t,Fe);var l=De(),c=a(function(){var e=Z(regeneratorRuntime.mark((function e(t){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(r=t.lexicon).uri||delete r.summary,e.next=4,s(n(r),i);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[n,s,i]);return e.createElement(o,{onSubmit:c,render:function(t){var n=t.handleSubmit,a=t.dirtyFields;return e.createElement("form",{onSubmit:n},e.createElement(k,{m:"1em"},e.createElement(Pe,{label:"Titre",source:"lexicon",fetchLexicon:r})),e.createElement(C,{className:l.toolbar},e.createElement(A,{type:"submit",startIcon:e.createElement($,null),variant:"contained",color:"primary",disabled:!a.lexicon},"Créer")))}})},Ve=function(e){return e&&e[0].toUpperCase()+e.slice(1)||""},Be=function(){var e=Z(regeneratorRuntime.mark((function e(t){var r,n,a,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.keyword,n=t.locale,e.next=3,fetch("https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=".concat(n,"&uselang=").concat(n,"&type=item&limit=10&origin=*&search=").concat(encodeURIComponent(r)));case 3:return a=e.sent,e.next=6,a.json();case 6:return o=e.sent,e.abrupt("return",o.search.map((function(e){return{uri:e.concepturi,label:Ve(e.match.text),summary:Ve(e.description),icon:W}})));case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),Me=function(){var e=Z(regeneratorRuntime.mark((function e(t){var r,n,a,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.keyword,n=t.locale,e.next=3,fetch("https://ec.europa.eu/esco/api/suggest2?text=".concat(encodeURIComponent(r),"&language=").concat(n,"&type=skill&isInScheme=&facet=&offset=&limit=&full=&selectedVersion=&viewObsolete="));case 3:return a=e.sent,e.next=6,a.json();case 6:return o=e.sent,e.abrupt("return",o._embedded.results.map((function(e){return{uri:e.uri,label:(t=e.title,t&&t[0].toUpperCase()+t.slice(1)||""),icon:q};var t})));case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();export{We as CreateOrImportForm,Ie as ImportForm,Pe as LexiconAutocompleteInput,Ae as LexiconCreateDialog,Ne as LexiconImportForm,Me as fetchESCO,Be as fetchWikidata,ke as useFork,Ce as useSync};
//# sourceMappingURL=index.es.js.map
