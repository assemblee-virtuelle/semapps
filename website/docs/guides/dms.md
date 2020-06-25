---
title: Add a Data Management System (DMS)
---

### Purpose

The SemApps project is primarily focused on the backend. You need a frontend if you want to interact with the semantic data that are managed by the backend.

However, it is important for many projects to offer visibility on the data they manage, and thus we have provided tools to help you easily build a Data Management System (DMS).

The DMS you will create on this guide is based on [React-Admin](https://marmelab.com/react-admin/), a complete framework to build backoffices with React. Used by thousands of developers, it is easy to adapt to your needs.

### Prerequisites

The only prerequisites is to have [NodeJS](https://nodejs.org/en/) installed on your computer.

You will of course also need a LDP server, configured with a SPARQL endpoint. Please see [this guide](ldp-server.md) if you didn't set it up yet.

### Setup the DMS

We provide a [custom template](https://create-react-app.dev/docs/custom-templates/) for Create-React-App to ease the creation of the DMS.

To use it, run this command:

```bash
npx create-react-app my-dms --template @semapps/dms
```

You can now go to the newly-created directory:

```bash
cd my-dms
```

### Launch the DMS

```bash
npm start
```

Your instance of the DMS is available at http://localhost:5000

### Configuration

By default, the DMS will look on port 3000 of your computer for the LDP server. You can change this by editing the `.env` file or by adding a `.env.local` file. You will also be able to change the port of the DMS:

```
REACT_APP_MIDDLEWARE_URL=http://localhost:3000/
PORT=5000
```

### Adding more resources

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
