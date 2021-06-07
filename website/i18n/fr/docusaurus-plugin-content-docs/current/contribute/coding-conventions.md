---
titre: Les conventions de code 
---

## Prettier

Nous utilisons [prettier](https://prettier.io/) pour formater toute la base de code. Si vous lancez un PR, il sera automatiquement lancé après tous vos commits.

Vous pouvez également le lancer manuellement avec cette commande :

```
make prettier
```
## Nommage

Les conventions de nommage ci-dessous correspondent à ce qui est généralement pratiqué pour le code Javascript (Voir [ici](https://www.robinwieruch.de/javascript-naming-conventions) et [ici](https://www.freecodecamp.org/news/javascript-naming-conventions-dos-and-don-ts-99c0e2fdd78a/)). La bonne pratique est de s'y conformer afin de rendre le code plus facile à lire et plus uniforme.

- Tout le code est en **anglais** pour faciliter les collaborations futures.

- Les noms des **variables** sont en minuscules en camelCase.

- Le nom des **constantes** peuvent être en camelCase ou en majuscule (avec un underscore pour séparer). En général, les majuscules sont reservées pour les constantes qui sont fixées "pour toujours", comme une clé API ou les jours de la semaine.

- Les noms des **classes** et des **composants** sont en PascalCase. Même s'ils sont des objets, nous considérons les services **MoleculerJS** comme des classes, afin de nous conformer à ce que fait MoleculerJS (par exemple ApiGateway).

- Les noms des **NPM packages** (et des dossiers associés) sont séparés par un trait d'union en minuscules, comme l'exige la convention de dénomination NPM.

## Commentaires

- Il n'est pas nécessaire de tout commenter. Si une chose est évidente (par exemple, `const container = createContainer()`), aucun commentaire n'est nécessaire.

- Les commentaires sont appréciés lors d'opérations compliquées, afin de faciliter la lecture du code par les autres et par notre futur soi.

- Les commentaires sont écrits en **anglais** et avec une les **ponctuation** appropriés. Ils commencent par une **majuscule**.
