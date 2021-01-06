---
title:  main
---

## Purpose

init, configure, debug, contribute, deploy your semapps application

- configuration of environment variables
- configuration of ontologies, context, resources, etc.
- docker + docker-compose
- connection to the source code of the semapps kernel for debugging and to be able to contribute
- deployment on a production environment (https, environment configuration)

## Navigation

<table>
  <tr>
    <th>&nbsp;</th>
    <th><a href="./minimal"><div>minimal&nbsp;stack</div><div>+simple</div><div>-automate</div></a></th>
    <th><a href="./docker"><div>docker&nbsp;stack</div><div>-simple</div><div>+automate</div></a></th>
    <th><a href="./workbench"><div>semapps&nbsp;workbench</div><div>+simple</div><div>+automate</div></a></th>
  </tr>
  <tr>
    <td><a href="./init_main">init a Project</a></td>
    <td><a href="./init_minimal">lien</a></td>
    <td><a href="./init_docker">lien</a></td>
    <td rowspan="3"><a href="./workbench">lien</a></td>
  </tr>
  <tr>
    <td><a href="./kernel_main">use semapps kernel source</a></td>
    <td><a href="./kernel_minimal">lien</a></td>
    <td><a href="./kernel_docker">lien</a></td>
  </tr>
  <tr>
    <td><a href="./production_main">production environment</a></td>
    <td><a href="./production_minimal">lien</a></td>
    <td><a href="./production_docker">lien</a></td>
  </tr>
</table>

## general

Semmapps kernel contains server component and ui components. You have to create your own project (recomandation : git) which requiere them.
Semapps provides template and tools to create server and ui projects.
