---
title: Introduction
---

Although the core of SemApps is its middleware, we offer frontend components to facilitate the development of interfaces
that connect to servers conforming to semantic web standards (LDP, SPARQL, WAC...)

We rely on [React-Admin](https://marmelab.com/react-admin/doc/3.19/Readme.html), which is a robust and well maintained
framework. It is based on [Material-UI](https://v4.mui.com/), which offers very advanced customization and theming 
possibilities.

The core pieces we offer are:
- A [Semantic Data Provider](semantic-data-provider/index.md), which is the piece connecting the React-Admin interface with the Semantic Server.
- An [Auth Provider](auth-provider.md) to allow users to identify themselves.

In the future we may propose packages for other types of frontend frameworks.
