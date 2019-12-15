# Conventions

## Nommage

Les conventions de nommage ci-dessous correpondent à ce qui est pratiqué généralement pour le code en javascript (Voir [ici](https://www.robinwieruch.de/javascript-naming-conventions) et [là](https://www.freecodecamp.org/news/javascript-naming-conventions-dos-and-don-ts-99c0e2fdd78a/)). Il est bon de s'y conformer afin de faciliter la lecture et rendre le code plus uniforme.

- Tout le code est en **anglais** pour faciliter la collaboration future.

- Les noms des **variables** sont en minuscule avec camelCase.

- Les noms des **constantes** peuvent être en camelCase ou en majuscules (avec underscore pour séparer). En général on garde les majscules pour les constantes qui sont fixées "pour toujours", comme par exemple une clé d'API, ou les jours de la semaine.

- Les noms des **classes** et des **composants** sont en PascalCase. Même s'ils sont des objets, on considère les **services MoleculerJS** comme des classes, afin de se conformer à ce que MoleculerJS propose (p.ex. ApiGateway)

- Les noms de **packages NPM** (et les dossiers associés) sont en minuscules avec traits d'unions, comme le veut la convention de nommage NPM.

## Commentaires

- Il n'est pas nécessaire de commenter tout. Si une chose est évidente en elle-même (p.ex. `const container = createContainer()`), cela ne nécessite pas de commentaire.

- Les commentaires sont appréciés lorsqu'on effectue une opération compliquée, afin de faciliter la compréhension pour les autres et pour notre futur soi.

- Les commentaires sont écrits en **anglais** et avec les **signes de ponctuations** qu'il faut. Ils commencent par une **majuscule**.