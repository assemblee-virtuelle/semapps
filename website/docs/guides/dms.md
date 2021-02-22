---
title: Add a Data Management System
---

### Purpose

The SemApps project is primarily focused on the backend. You need a frontend if you want to interact with the semantic data that are managed by the backend.

However, it is important for many projects to offer visibility on the data they manage, and thus we have provided tools to help you easily build a Data Management System (DMS).

The DMS you will create on this guide is based on [React-Admin](https://marmelab.com/react-admin/), a complete framework to build backoffices with React. Used by thousands of developers, it is easy to adapt to your needs.

In this guide, you will :
- **Create a DMS** using React-Admin;
- **Add/modify/delete data** using the DMS.

### Prerequisites

The only prerequisites is to have [NodeJS](https://nodejs.org/en/) installed on your computer.

You will of course also need a LDP server, configured with a SPARQL endpoint. Please see [this guide](ldp-server.md) if you didn't set it up yet.

## Create the DMS

### Setup the DMS

We provide a [custom template](https://create-react-app.dev/docs/custom-templates/) for Create-React-App to ease the creation of the DMS.

To use it, run this command in the same directory where you ran the *moleculer init assemblee-virtuelle/semapps-template-ldp my-project* command:

```bash
npx create-react-app my-dms --template @semapps/dms
```

You can now go to the newly-created directory:

```bash
cd my-dms
```

### Launch the DMS

To launch your DMS, run the following command:

```bash
npm start
```

Your instance of the DMS is available at http://localhost:5000.

You should get something like this:

![](dms_resources/homepage_dms.jpg)

### Configuration

By default, the DMS will look on port 3000 of your computer for the LDP server. You can change this by editing the `.env` file or by adding a `.env.local` file. You will also be able to change the port of the DMS:

```
REACT_APP_MIDDLEWARE_URL=http://localhost:3000/
PORT=5000
```

## Adding more resources

### Add more people

As we have done in the guide about the LDP server (, you can try to add new people, change their name or surname, and try to remove them.

If everything works well, the changes should appear both on the LDP server (http://localhost:3000/) and on the Jena Fuseki instance corresponding to the semantic database (http://localhost:3030/).

### Add more types of data

By default, the template will be configured to have one type of resource, of the semantic type `foaf:Person`. You can change this by editing the `./src/config/resources.js` file:

```
export default {
  Person: {
    types: ['foaf:Person'],
    containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'resources'
  }
};
```

If no `types` are defined for the resource, React-Admin will fetch the data from the LDP container at the URL `containerUri`.

If `types` are defined, the `containerUri` field is required only if you need to create new data.

You can then modify the `./src/App.js` component to list the resources, define an edit form, etc. Please see the example provided, and read the excellent [React-Admin documentation](https://marmelab.com/react-admin/Readme.html).
