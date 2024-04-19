"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1596],{3905:function(e,t,n){n.d(t,{Zo:function(){return l},kt:function(){return m}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),p=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},l=function(e){var t=p(e.components);return r.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),d=p(n),m=a,f=d["".concat(s,".").concat(m)]||d[m]||u[m]||o;return n?r.createElement(f,i(i({ref:t},l),{},{components:n})):r.createElement(f,i({ref:t},l))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:a,i[1]=c;for(var p=2;p<o;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},5539:function(e,t,n){n.r(t),n.d(t,{assets:function(){return l},contentTitle:function(){return s},default:function(){return m},frontMatter:function(){return c},metadata:function(){return p},toc:function(){return u}});var r=n(3117),a=n(102),o=(n(7294),n(3905)),i=["components"],c={title:"Compacting datasets"},s=void 0,p={unversionedId:"triplestore/compacting-datasets",id:"triplestore/compacting-datasets",title:"Compacting datasets",description:"Jena Fuseki datasets must be regularly compacted, or they will become bigger and bigger until your hard drive is full.",source:"@site/docs/triplestore/compacting-datasets.md",sourceDirName:"triplestore",slug:"/triplestore/compacting-datasets",permalink:"/docs/triplestore/compacting-datasets",draft:!1,editUrl:"https://github.com/assemblee-virtuelle/semapps/edit/master/website/docs/triplestore/compacting-datasets.md",tags:[],version:"current",frontMatter:{title:"Compacting datasets"},sidebar:"triplestore",previous:{title:"Migrating datasets",permalink:"/docs/triplestore/migrating-datasets"}},l={},u=[{value:"Launch the compaction",id:"launch-the-compaction",level:2},{value:"Bash script",id:"bash-script",level:2}],d={toc:u};function m(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Jena Fuseki datasets must be regularly compacted, or they will become bigger and bigger until your hard drive is full."),(0,o.kt)("p",null,"Unfortunately, the endpoint to compact datasets (see ",(0,o.kt)("a",{parentName:"p",href:"https://jena.apache.org/documentation/fuseki2/fuseki-server-protocol.html"},"this page"),")\ncannot be used with SemApps-specific datasets. You have to stop Fuseki and launch a specific command."),(0,o.kt)("h2",{id:"launch-the-compaction"},"Launch the compaction"),(0,o.kt)("p",null,"First stop your Fuseki container (",(0,o.kt)("inlineCode",{parentName:"p"},"docker compose down"),"), then run the following command:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},'docker run --volume="$(pwd)"/data/fuseki:/fuseki --entrypoint=/docker-compact-entrypoint.sh semapps/jena-fuseki-webacl\n')),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},(0,o.kt)("strong",{parentName:"p"},"Warning"),": The volume path can be different on your setup. It has to be the exact same as the ",(0,o.kt)("inlineCode",{parentName:"p"},"volumes")," line of the\n",(0,o.kt)("inlineCode",{parentName:"p"},"fuseki")," service present in your docker-compose file.")),(0,o.kt)("p",null,"It will compact all datasets one by one, put them in new directories and then remove the old directories. Instead of\n",(0,o.kt)("inlineCode",{parentName:"p"},"/Data-0001"),", the data will now be stored in ",(0,o.kt)("inlineCode",{parentName:"p"},"/Data-0002")," (for example)."),(0,o.kt)("h2",{id:"bash-script"},"Bash script"),(0,o.kt)("p",null,"Here's a script which can be launched with a cron job every night:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},'#!/bin/bash\n\n# Add /usr/local/bin directory where docker-compose is installed\nPATH=/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/bin\n\ncd ~/path-to-semapps-directory\n\n# Stop all containers including Fuseki\ndocker compose down\n\n# Run fuseki compact with same data as prod\ndocker run --volume="$(pwd)"/data/fuseki:/fuseki --entrypoint=/docker-compact-entrypoint.sh semapps/jena-fuseki-webacl\n\ndocker compose up -d\n\necho "Cron job finished at" $(date)\n')),(0,o.kt)("p",null,"To call this script every night at 4am, call ",(0,o.kt)("inlineCode",{parentName:"p"},"crontab -e")," and enter this line :"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"0 4 * * * /path/to/script.sh >> /home/cron-compact.log 2>&1\n")))}m.isMDXComponent=!0}}]);