---
title: use semapps kernel source
---



## Purpose

Link semapps sources and your project.

usage :
- debug semapps kernel executing your project
- understand how semapps kernel works executing your project
- contribute to semapps kernel executing your project

## navigation

<table>
  <tr>
    <th>&nbsp;</th>
    <th><a href="./minimal"><div>minimal&nbsp;stack</div><div>+simple</div><div>-automate</div></a></th>
    <th><a href="./docker"><div>docker&nbsp;stack</div><div>-simple</div><div>+automate</div></a></th>
    <th><a href="./workbench"><div>semapps&nbsp;workbench</div><div>+simple</div><div>+automate</div></a></th>
  </tr>
  <tr>
    <td>use semapps kernel source</td>
    <td><a href="./kernal_minimal">lien</a></td>
    <td><a href="./kernel_docker">lien</a></td>
    <td><a href="./workbench">lien</a></td>
  </tr>
</table>

## use semapps kernel source

Your project is based on semapps components published on npmjs. These components are imported when calling "npm install". These components are optimized for deployment which can be complicate their debugging if needed. If you want to debug, experiment or contribute on the core components of semapps, you must establish a link between your project and the source code of the components.

You can use semapps server meleculer services and semapps interface components without needing their sources. All those parts are publish on npmjs and templates use them.
If you want to debug, understand how it works or contribute to kernel while executing your project, you have to link your projects and kernel source. To link kernel source and your project, you have to clone kernel next to your project and link your project to those sources.

[use semapps kernel source in minimal stack](./kernel_minimal)

[use semapps kernel source in docker stack](./kernel_docker)

[use semapps kernel source in semapps workbench stack](./workbench)

## contributing
Thanks to the link you can find a bug or improve semapps with a new feature. To do so, [follow the guide](https://semapps.org/docs/contribute/code).
