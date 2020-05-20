---
title: Create your first Data Management System
---
### Prerequisites

nodejs
NPM

### What is the purpose of this application

SemApps is a backend project. You need a FrontEnd if you want to interact with datas.

react-admin is a very complete framework to build à CRUD front app whith react. This is probably the easiest way to make an app to work with the semapps server.

We create a "custom Create React App templates"  to facilitate the creation of an interface for semapps.

### Setup the app

```bash
$ npx create-react-app my-project --template cra-template-dms
```

You can now go to the newly-created directory:

```bash
$ cd my-project
```


### Launch react app

dms is a react app ready to execute. you can run it.

```bash
$ npm start
```
this script use package.json and "react-scripts" included in dependencies.

react-scripts start a web server on port 5000 usualy. If this port is alraedy used, you can choose an other by prompt. react-scripts open a browser and navigate to the app (usaly http://localhost:5000/).
