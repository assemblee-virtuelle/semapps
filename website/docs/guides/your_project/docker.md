---
title: docker-stack
---

## Prerequisites

- [docker-compose](https://docs.docker.com/compose/) & [docker](https://docs.docker.com/engine/)
- you can use [make](https://fr.wikipedia.org/wiki/Make) to simplify daily use
- Prerequisites of [minimal stack](./minimal#prerequisites)

## navigation
<table>
  <tr>
    <td><a href="./init_main">init a Project</a></td>
    <td><a href="./init_docker">lien</a></td>
  </tr>
  <tr>
    <td><a href="./kernel_main">use semapps kernel source</a></td>
    <td><a href="./kernel_docker">lien</a></td>
  </tr>
  <tr>
    <td><a href="./production_main">production environment</a></td>
    <td><a href="./production_docker">lien</a></td>
  </tr>
</table>

## general

In this stack, you want reduce command line and run source code throw docker containers.
You don't need to use docker to deploy semapps but it allows you to make sure that the development environnement and production environnement are the same.
Requiere basic knowledge of docker, docker-compose and Make.
Some informations of this stack can be used in minial stack as Makefile.
