"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3469],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return d}});var o=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,o,a=function(e,t){if(null==e)return{};var n,o,a={},r=Object.keys(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=o.createContext({}),c=function(e){var t=o.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=c(e.components);return o.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},m=o.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,s=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),m=c(n),d=a,f=m["".concat(s,".").concat(d)]||m[d]||u[d]||r;return n?o.createElement(f,l(l({ref:t},p),{},{components:n})):o.createElement(f,l({ref:t},p))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,l=new Array(r);l[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var c=2;c<r;c++)l[c]=n[c];return o.createElement.apply(null,l)}return o.createElement.apply(null,n)}m.displayName="MDXCreateElement"},2195:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return s},default:function(){return d},frontMatter:function(){return i},metadata:function(){return c},toc:function(){return u}});var o=n(3117),a=n(102),r=(n(7294),n(3905)),l=["components"],i={title:"ActivityPub Components"},s=void 0,c={unversionedId:"frontend/activitypub-components",id:"frontend/activitypub-components",title:"ActivityPub Components",description:"Installation",source:"@site/docs/frontend/activitypub-components.md",sourceDirName:"frontend",slug:"/frontend/activitypub-components",permalink:"/docs/frontend/activitypub-components",draft:!1,editUrl:"https://github.com/assemblee-virtuelle/semapps/edit/master/website/docs/frontend/activitypub-components.md",tags:[],version:"current",frontMatter:{title:"ActivityPub Components"},sidebar:"frontend",previous:{title:"Auth Provider",permalink:"/docs/frontend/auth-provider"},next:{title:"Date Components",permalink:"/docs/frontend/date-components"}},p={},u=[{value:"Installation",id:"installation",level:2},{value:"Components",id:"components",level:2},{value:"CollectionList",id:"collectionlist",level:3},{value:"CommentsField",id:"commentsfield",level:3},{value:"ReferenceCollectionField",id:"referencecollectionfield",level:3},{value:"Hooks",id:"hooks",level:2},{value:"useCollection",id:"usecollection",level:3},{value:"useInbox",id:"useinbox",level:3},{value:"useOutbox",id:"useoutbox",level:3},{value:"useNodeinfo",id:"usenodeinfo",level:3},{value:"useWebfinger",id:"usewebfinger",level:3},{value:"useMentions",id:"usementions",level:3}],m={toc:u};function d(e){var t=e.components,n=(0,a.Z)(e,l);return(0,r.kt)("wrapper",(0,o.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"installation"},"Installation"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm install @semapps/activitypub-components\n")),(0,r.kt)("h2",{id:"components"},"Components"),(0,r.kt)("h3",{id:"collectionlist"},"CollectionList"),(0,r.kt)("p",null,"Load an ",(0,r.kt)("a",{parentName:"p",href:"https://www.w3.org/TR/activitystreams-core/#collections"},"ActivityStreams Collection")," from its URL and display it in a list of type ",(0,r.kt)("inlineCode",{parentName:"p"},"Datagrid"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"SimpleList"),", etc."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},'import { Show, SimpleList } from \'react-admin\';\nimport { CollectionList } from \'@semapps/activitypub-components\';\n\nexport const MyPage = props => (\n  <div>\n    <CollectionList collectionUrl="http://localhost:3000/alice/followers" resource="Actor">\n      <SimpleList primaryText="name" />\n    </CollectionList>\n  </div>\n);\n')),(0,r.kt)("h3",{id:"commentsfield"},"CommentsField"),(0,r.kt)("p",null,"Display a form to attach comments to the current resource, as well as the list of existing comments (located in the ",(0,r.kt)("inlineCode",{parentName:"p"},"replies")," collection). A comment is an ActivityPub ",(0,r.kt)("inlineCode",{parentName:"p"},"Note")," and it is linked to the original resource with the ",(0,r.kt)("inlineCode",{parentName:"p"},"inReplyOf")," property."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},"import { Show, SimpleShowLayout } from 'react-admin';\nimport { CommentsField } from '@semapps/activitypub-components';\n\nconst DocumentShow = props => {\n  const mentions = useMentions('Person');\n  return (\n    <Show {...props}>\n      <SimpleShowLayout>\n        <CommentsField userResource=\"Person\" mentions={mentions} />\n      </SimpleShowLayout>\n    </Show>\n  );\n};\n")),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Property"),(0,r.kt)("th",{parentName:"tr",align:null},"Type"),(0,r.kt)("th",{parentName:"tr",align:null},"Default"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"userResource")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"String")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("strong",{parentName:"td"},"required")),(0,r.kt)("td",{parentName:"tr",align:null},"React-Admin resource ID for users")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"label")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"String")),(0,r.kt)("td",{parentName:"tr",align:null},'"Commentaires"'),(0,r.kt)("td",{parentName:"tr",align:null},"The label to use for the field")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"placeholder")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"String")),(0,r.kt)("td",{parentName:"tr",align:null},'"Commencez \xe0 taper votre commentaire..."'),(0,r.kt)("td",{parentName:"tr",align:null},"A placeholder to show before the user starts typing text.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"mentions")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"Object")),(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"A tiptap ",(0,r.kt)("a",{parentName:"td",href:"https://tiptap.dev/api/utilities/suggestion"},"suggestion")," object. If present, it allows to mention users.")))),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"To display the users' avatars, the ",(0,r.kt)("inlineCode",{parentName:"p"},"fieldsMapping.image")," property must be defined in the data model of the user resource.")),(0,r.kt)("h3",{id:"referencecollectionfield"},"ReferenceCollectionField"),(0,r.kt)("p",null,"This component can be used like React-Admin ",(0,r.kt)("a",{parentName:"p",href:"https://marmelab.com/react-admin/Fields.html#referencefield"},"ReferenceField"),". It fetches the collection associated with a resource, and display it in a list. Internally, it uses the CollectionList component."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},'import { Show, SimpleList } from \'react-admin\';\nimport { ReferenceCollectionField } from \'@semapps/activitypub-components\';\n\nexport const ActorShow = props => (\n  <Show {...props}>\n    <SimpleForm>\n      <ReferenceCollectionField reference="Actor" source="followers">\n        <SimpleList primaryText="name" />\n      </ReferenceCollectionField>\n    </SimpleForm>\n  </Show>\n);\n')),(0,r.kt)("h2",{id:"hooks"},"Hooks"),(0,r.kt)("h3",{id:"usecollection"},"useCollection"),(0,r.kt)("p",null,"This hook allows you to load data from an ",(0,r.kt)("a",{parentName:"p",href:"https://www.w3.org/TR/activitystreams-core/#collections"},"ActivityStreams Collection"),"."),(0,r.kt)("p",null,"It takes as a parameter a full URL or a predicate. In the latter case, it will look for the properties of the logged-in actor. Typically, you could use ",(0,r.kt)("inlineCode",{parentName:"p"},'useCollection("followers")')," to get the list of followers of the logged-in actor."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},"const {\n  items, // an array listing the items of the collection\n  loaded, // boolean that is false until the data is available\n  loading, // boolean that is true on mount, and false once the data was fetched\n  error, // error message if there was an error loading the collection\n  refetch, // a callback to refresh the data\n  url // url of the loaded collection (useful if only a predicate was passed)\n} = useCollection('http://localhost:3000/alice/followers');\n")),(0,r.kt)("h3",{id:"useinbox"},"useInbox"),(0,r.kt)("p",null,"This hook allows you to fetch activities from the logged-in user's inbox."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},"import { useEffect } from 'react';\nimport { useInbox } from '@semapps/activitypub-components';\n\nexport const MyPage = props => {\n  const inbox = useInbox();\n  useEffect(() => {\n    inbox.fetch().then(activities => console.log(activities));\n  }, [inbox]);\n  return null;\n};\n")),(0,r.kt)("h3",{id:"useoutbox"},"useOutbox"),(0,r.kt)("p",null,"This hook allows you to fetch activities from the logged-in user's outbox, and also to post new activities."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},"import { useEffect, useCallback } from 'react';\nimport { useOutbox, ACTIVITY_TYPES } from '@semapps/activitypub-components';\n\nexport const MyPage = props => {\n  const outbox = useOutbox();\n\n  useEffect(() => {\n    outbox.fetch().then(activities => console.log(activities));\n  }, [outbox]);\n\n  const follow = useCallback(\n    actorUrl => {\n      outbox.post({\n        type: ACTIVITY_TYPES.FOLLOW,\n        actor: outbox.owner,\n        object: actorUrl,\n        to: actorUrl\n      });\n    },\n    [outbox]\n  );\n\n  return <button onClick={() => follow('http://localhost:3000/alice')}>Follow Alice</button>;\n};\n")),(0,r.kt)("h3",{id:"usenodeinfo"},"useNodeinfo"),(0,r.kt)("p",null,"This hook allows you to get the ",(0,r.kt)("a",{parentName:"p",href:"https://nodeinfo.diaspora.software"},"nodeinfo")," schema of an instance."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},"import { useNodeinfo } from '@semapps/activitypub-components';\n\nexport const MyComponent = () => {\n  const nodeinfo = useNodeinfo('mastodon.social');\n  console.log('Nodeinfo schema: ', nodeinfo);\n  return null;\n};\n")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"You can pass as a second argument the ",(0,r.kt)("inlineCode",{parentName:"p"},"rel")," you want to fetch. By default, it is ",(0,r.kt)("inlineCode",{parentName:"p"},"http://nodeinfo.diaspora.software/ns/schema/2.1"),".")),(0,r.kt)("h3",{id:"usewebfinger"},"useWebfinger"),(0,r.kt)("p",null,"This hook allows you to get an actor URL from its ",(0,r.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/WebFinger"},"Webfinger")," account"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},"import { useCallback } from 'react';\nimport { useWebfinger } from '@semapps/activitypub-components';\n\nexport const MyPage = props => {\n  const webfinger = useWebfinger();\n\n  const showActorUrl = useCallback(\n    actorAccount => {\n      webfinger.fetch(actorAccount).then(actorUrl => alert(actorUrl));\n    },\n    [webfinger]\n  );\n\n  return <button onClick={() => showActorUrl('@alice@localhost:3000')}>Show Alice URL</button>;\n};\n")),(0,r.kt)("h3",{id:"usementions"},"useMentions"),(0,r.kt)("p",null,"Returns a tiptap ",(0,r.kt)("a",{parentName:"p",href:"https://tiptap.dev/api/utilities/suggestion"},"suggestion")," object, allowing to mention users."),(0,r.kt)("p",null,"See the ",(0,r.kt)("inlineCode",{parentName:"p"},"CommentsField")," component above for an example."))}d.isMDXComponent=!0}}]);