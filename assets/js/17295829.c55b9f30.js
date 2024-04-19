"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2055],{3905:function(t,e,n){n.d(e,{Zo:function(){return u},kt:function(){return c}});var a=n(7294);function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function l(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?l(Object(n),!0).forEach((function(e){r(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function i(t,e){if(null==t)return{};var n,a,r=function(t,e){if(null==t)return{};var n,a,r={},l=Object.keys(t);for(a=0;a<l.length;a++)n=l[a],e.indexOf(n)>=0||(r[n]=t[n]);return r}(t,e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);for(a=0;a<l.length;a++)n=l[a],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(r[n]=t[n])}return r}var p=a.createContext({}),d=function(t){var e=a.useContext(p),n=e;return t&&(n="function"==typeof t?t(e):o(o({},e),t)),n},u=function(t){var e=d(t.components);return a.createElement(p.Provider,{value:e},t.children)},m={inlineCode:"code",wrapper:function(t){var e=t.children;return a.createElement(a.Fragment,{},e)}},s=a.forwardRef((function(t,e){var n=t.components,r=t.mdxType,l=t.originalType,p=t.parentName,u=i(t,["components","mdxType","originalType","parentName"]),s=d(n),c=r,k=s["".concat(p,".").concat(c)]||s[c]||m[c]||l;return n?a.createElement(k,o(o({ref:e},u),{},{components:n})):a.createElement(k,o({ref:e},u))}));function c(t,e){var n=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var l=n.length,o=new Array(l);o[0]=s;var i={};for(var p in e)hasOwnProperty.call(e,p)&&(i[p]=e[p]);i.originalType=t,i.mdxType="string"==typeof t?t:r,o[1]=i;for(var d=2;d<l;d++)o[d]=n[d];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}s.displayName="MDXCreateElement"},3169:function(t,e,n){n.r(e),n.d(e,{assets:function(){return u},contentTitle:function(){return p},default:function(){return c},frontMatter:function(){return i},metadata:function(){return d},toc:function(){return m}});var a=n(3117),r=n(102),l=(n(7294),n(3905)),o=["components"],i={title:"Geo Components"},p=void 0,d={unversionedId:"frontend/geo-components",id:"frontend/geo-components",title:"Geo Components",description:"Installation",source:"@site/docs/frontend/geo-components.md",sourceDirName:"frontend",slug:"/frontend/geo-components",permalink:"/docs/frontend/geo-components",draft:!1,editUrl:"https://github.com/assemblee-virtuelle/semapps/edit/master/website/docs/frontend/geo-components.md",tags:[],version:"current",frontMatter:{title:"Geo Components"},sidebar:"frontend",previous:{title:"Field Components",permalink:"/docs/frontend/field-components"},next:{title:"Input Components",permalink:"/docs/frontend/input-components"}},u={},m=[{value:"Installation",id:"installation",level:2},{value:"Components",id:"components",level:2},{value:"MapList",id:"maplist",level:3},{value:"MapField",id:"mapfield",level:3},{value:"LocationInput",id:"locationinput",level:3}],s={toc:m};function c(t){var e=t.components,n=(0,r.Z)(t,o);return(0,l.kt)("wrapper",(0,a.Z)({},s,n,{components:e,mdxType:"MDXLayout"}),(0,l.kt)("h2",{id:"installation"},"Installation"),(0,l.kt)("p",null,"In addition to this component, you need to install ",(0,l.kt)("inlineCode",{parentName:"p"},"leaflet"),", ",(0,l.kt)("inlineCode",{parentName:"p"},"leaflet-defaulticon-compatibility")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"leaflet.markercluster")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"npm install @semapps/geo-components leaflet@^1.8.0 leaflet-defaulticon-compatibility@0.1.1 leaflet.markercluster@^1.5.3\n")),(0,l.kt)("p",null,"You must also include the following CSS files:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-html"},'<link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css" crossorigin="" />\n<link rel="stylesheet" href="https://unpkg.com/leaflet-defaulticon-compatibility@0.1.1/dist/leaflet-defaulticon-compatibility.css" />\n<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />\n<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />\n')),(0,l.kt)("admonition",{type:"caution"},(0,l.kt)("p",{parentName:"admonition"},"The ",(0,l.kt)("inlineCode",{parentName:"p"},"react-leaflet")," package used by this package requires React 18 !")),(0,l.kt)("h2",{id:"components"},"Components"),(0,l.kt)("h3",{id:"maplist"},"MapList"),(0,l.kt)("p",null,"This component displays a map with a number of geolocalized ressources. It works just like React-Admin official ",(0,l.kt)("a",{parentName:"p",href:"https://marmelab.com/react-admin/List.html"},"list components"),"."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-jsx"},"import { List } from 'react-admin';\nimport { MapList } from '@semapps/geo-components';\n\nconst MyList = props => (\n  <List pagination={false} perPage={1000} {...props}>\n    <MapList\n      latitude={record => record.latitude}\n      longitude={record => record.longitude}\n      label={record => record.label}\n      description={record => record.description}\n    />\n  </List>\n);\n")),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"Note: For a map display, you will usually disable the pagination and display all the available data.")),(0,l.kt)("p",null,"If you prefer to use a custom popup, you can use the ",(0,l.kt)("inlineCode",{parentName:"p"},"popupContent")," prop (and ignore the ",(0,l.kt)("inlineCode",{parentName:"p"},"label")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"description")," properties):"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-jsx"},"import { List, ShowButton } from 'react-admin';\nimport { MapList } from '@semapps/geo-components';\n\nconst MyList = props => (\n  <List pagination={false} perPage={1000} {...props}>\n    <MapList\n      latitude={record => record.latitude}\n      longitude={record => record.longitude}\n      popupContent={({ record, basePath }) => (\n        <>\n          <h1>{record.title}</h1>\n          <ShowButton basePath={basePath} record={record} />\n        </>\n      )}\n    />\n  </List>\n);\n")),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Property"),(0,l.kt)("th",{parentName:"tr",align:null},"Type"),(0,l.kt)("th",{parentName:"tr",align:null},"Default"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"latitude")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"Function")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"required")),(0,l.kt)("td",{parentName:"tr",align:null},"A function which takes a record and returns a latitude")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"longitude")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"Function")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"required")),(0,l.kt)("td",{parentName:"tr",align:null},"A function which takes a record and returns a longitude")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"label")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"Function")),(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null},"A function which takes a record and returns a label to be displayed in the popup. This is not used if ",(0,l.kt)("inlineCode",{parentName:"td"},"popupContent")," is provided.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"description")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"Function")),(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null},"A function which takes a record and returns a description to be displayed in the popup. This is not used if ",(0,l.kt)("inlineCode",{parentName:"td"},"popupContent")," is provided.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"popupContent")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"React Component")),(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null},"A React component to customize the content of the popup (see above)")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"height")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"Number")),(0,l.kt)("td",{parentName:"tr",align:null},"700"),(0,l.kt)("td",{parentName:"tr",align:null},"The height in pixel of the map")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"groupClusters")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"Boolean")),(0,l.kt)("td",{parentName:"tr",align:null},"true"),(0,l.kt)("td",{parentName:"tr",align:null},"If true, markers which are close will be grouped in a cluster.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"boundToMarkers")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"Boolean")),(0,l.kt)("td",{parentName:"tr",align:null},"false"),(0,l.kt)("td",{parentName:"tr",align:null},"If true, center the map around the markers.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"connectMarkers")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"Boolean")),(0,l.kt)("td",{parentName:"tr",align:null},"false"),(0,l.kt)("td",{parentName:"tr",align:null},"If true, trace lines between the markers. The order depends on the list parameters")))),(0,l.kt)("p",null,"You can also provide all the options of ",(0,l.kt)("a",{parentName:"p",href:"https://leafletjs.com/reference-1.7.1.html#map"},"LeafletJS Map")," (",(0,l.kt)("inlineCode",{parentName:"p"},"center"),", ",(0,l.kt)("inlineCode",{parentName:"p"},"zoom"),", ",(0,l.kt)("inlineCode",{parentName:"p"},"scrollWheelZoom"),"...)."),(0,l.kt)("h3",{id:"mapfield"},"MapField"),(0,l.kt)("p",null,"This component allows you to display the location of a resource in a map. You just need to pass its latitude and longitude."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-jsx"},"import { Show, SimpleShowLayout, TextField, DateField, RichTextField } from 'react-admin';\nimport { MapField } from '@semapps/geo-components';\n\nexport const MyShow = (props) => (\n  <Show {...props}>\n    <SimpleShowLayout>\n      <TextField source=\"title\" />\n      <MapField\n        latitude={record => record.latitude}\n        longitude={record => record.longitude}\n      />\n    </SimpleShowLayout>\n  </Show>\n);\n")),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Property"),(0,l.kt)("th",{parentName:"tr",align:null},"Type"),(0,l.kt)("th",{parentName:"tr",align:null},"Default"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"latitude")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"Function")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"required")),(0,l.kt)("td",{parentName:"tr",align:null},"A function which takes a record and returns a latitude")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"longitude")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"Function")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"required")),(0,l.kt)("td",{parentName:"tr",align:null},"A function which takes a record and returns a longitude")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"address")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"Function")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"required")),(0,l.kt)("td",{parentName:"tr",align:null},"A function which takes a record and returns a text to display above the map")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"typographyProps")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"Object")),(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null},"Props passed down to the Typography element used to display the text above the map")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"height")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"Number")),(0,l.kt)("td",{parentName:"tr",align:null},"400"),(0,l.kt)("td",{parentName:"tr",align:null},"The height in pixel of the map")))),(0,l.kt)("p",null,"You can also provide all the options of ",(0,l.kt)("a",{parentName:"p",href:"https://leafletjs.com/reference-1.7.1.html#map"},"LeafletJS Map")," (",(0,l.kt)("inlineCode",{parentName:"p"},"center"),", ",(0,l.kt)("inlineCode",{parentName:"p"},"zoom"),", ",(0,l.kt)("inlineCode",{parentName:"p"},"scrollWheelZoom"),"...)."),(0,l.kt)("h3",{id:"locationinput"},"LocationInput"),(0,l.kt)("p",null,"This component allows you to search for a geolocalized address. It uses the MapBox API to provide search results. When an address is selected, the ",(0,l.kt)("inlineCode",{parentName:"p"},"parse")," function is called, and you can format the results as you wish."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-jsx"},"import { Create, SimpleForm } from 'react-admin';\nimport { LocationInput, extractContext } from '@semapps/geo-components';\n\nexport const MyCreate = (props) => (\n  <Create {...props}>\n    <SimpleForm>\n      <LocationInput\n        source=\"address\"\n        mapboxConfig={{\n          access_token: 'YOUR_MABPOX_TOKEN',\n          types: ['place', 'address'],\n          country: ['fr', 'be', 'ch']\n          // ... any other MapBox configuration\n        }}\n        parse={value => ({\n          label: value.place_name,\n          longitude: value.center[0],\n          latitude: value.center[1],\n          street: value.place_type[0] === 'address' ? [value.address, value.text].join(' ') : undefined,\n          zip: extractContext(value.context, 'postcode'),\n          city: value.place_type[0] === 'place' ? value.text : extractContext(value.context, 'place'),\n          country: extractContext(value.context, 'country')\n        })}\n        optionText={resource => resource.label}\n      />\n    </SimpleForm>\n  </Create>\n);\n")),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"The ",(0,l.kt)("inlineCode",{parentName:"p"},"extractContext")," utility function allows you to more easily select amongst MapBox data.")),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Property"),(0,l.kt)("th",{parentName:"tr",align:null},"Type"),(0,l.kt)("th",{parentName:"tr",align:null},"Default"),(0,l.kt)("th",{parentName:"tr",align:null},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"source")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"String")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"required")),(0,l.kt)("td",{parentName:"tr",align:null},"Standard React-Admin prop to identify the field to be created or modified.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"mapboxConfig")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"Object")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"required")),(0,l.kt)("td",{parentName:"tr",align:null},"Parameters to pass to the ",(0,l.kt)("a",{parentName:"td",href:"https://docs.mapbox.com/api/search/geocoding/#forward-geocoding"},"MapBox forward geocoding API"),". The ",(0,l.kt)("inlineCode",{parentName:"td"},"access_token")," property is required.")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"parse")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"Function")),(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null},"A function to format a MapBox ",(0,l.kt)("inlineCode",{parentName:"td"},"Feature")," according to your needs. You can find its properties ",(0,l.kt)("a",{parentName:"td",href:"https://docs.mapbox.com/api/search/geocoding/#geocoding-response-object"},"here"),".")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"optionText")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"String")," or ",(0,l.kt)("inlineCode",{parentName:"td"},"Function")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"required")),(0,l.kt)("td",{parentName:"tr",align:null},"What property to display in the input when a resource is loaded. You can also pass a function, which takes the full record as an input and returns the label.")))),(0,l.kt)("p",null,"Any other prop will be passed down to the ",(0,l.kt)("inlineCode",{parentName:"p"},"TextField")," base component."))}c.isMDXComponent=!0}}]);