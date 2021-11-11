---
title: Contribuer à la documentation
---

Nous utilisons [Docusaurus](https://docusaurus.io/) pour documenter le projet SemApps. Docusaurus est utilisé pour générer en langage Markdown de la documentation à partir de Github.

## Organisation des fichiers dans Docusaurus

- Les **fichiers de documentation** en markdown sont dans le répertoire [/website/docs/](https://github.com/assemblee-virtuelle/semapps/tree/master/website/docs) ou en Français dans [/website/i18n/fr/docusaurus-plugin-content-docs/current](https://github.com/assemblee-virtuelle/semapps/tree/master/website/i18n/fr/docusaurus-plugin-content-docs/current).

- La **configuration** pour gérer le  **menu de gauche** (navbar), l'**en tête** (titre et tags) et le **bas de page** se trouve dans le fichier [/website/docusaurus.config.js](https://github.com/assemblee-virtuelle/semapps/blob/master/website/docusaurus.config.js).

- Les fichiers de **traduction** (par example 'fr') sont dans [/website/i18n/fr/](https://github.com/assemblee-virtuelle/semapps/blob/master/website/i18n/fr/) folder.

- Le **contenu de la page d'accueil** (dont le code est en React) est dans [/website/src/pages/index.js](https://github.com/assemblee-virtuelle/semapps/blob/master/website/src/pages/index.js)

- La **Barre/menu de gauche** peut être configuré en modifiant le fichier [/website/sidebars.js](https://github.com/assemblee-virtuelle/semapps/blob/master/website/sidebars.js).

- Le **blog** est une extension que l'on trouvera dans le répertoire [/website/blog/](https://github.com/assemblee-virtuelle/semapps/tree/master/website/blog), ou en français dans [/website/i18n/fr//](https://github.com/assemblee-virtuelle/semapps/tree/master/website/i18n/fr/docusaurus-plugin-content-blog).

## Comment contribuer à la documentation

### Schéma général
- En attendant une décision/consensus du cercle documentation : **Créer une issue**
- Si le contenu de ce que vous voulez publier a été approuvé par le cercle documentation :
    - **Créez une pull request sur une branche dédiée.**  
    - Tout pendant que vous avez un état de brouillon, **ne demandez pas une révision**.
- Lorsque vous avez terminé votre travail, **une révision peut être demandée**.

### Proposer une amélioration en créant une issue
- Allez sur https://github.com/assemblee-virtuelle/semapps/issues
- Détaillez votre proposition, Ajoutez des liens et des détails pour expliquer votre intention.  
- Remplir à droite avec les label appropriés
- Et discutons-en !

### Modifier une page de Docusaurus
Go to the relevant place by referring to the previous chapter.
- If it is a minor modification, a spelling mistake for example, make the change by editing the page (edit file), then "commit" to the __Master__ branch. Describe your change in the space provided.
- If it is a substantial change :
  - make the change by editing the page,
  - then "commit" to a new branch that you can explicitly name.
  - Fill in a __Label__ and identify __Reviewers__ who will be invited to comment / approve / propose changes to your pull request.
  - At the end of this collective process, it will be time to __merger__ the pull request on the __Master__ branch.

### Create a new page on Docusaurus
- Propose an issue ;

If the initiative seems relevant:
- Create a markdown file in the desired location, remembering to fill in the extension: ".md". It must necessarily begin with :
  ```
  ---
  title: [your page title]
  ---
  ```

  NB: The page title may have spaces. On the other hand, the name of the .md file must not have spaces, and must be written in lower case.

- Commit and make a pull request on a dedicated branch.
- Once the reviewers you've identified have validated it, merge the pull request on the master branch.

## Getting help

Our [Semapps dev channel](https://chat.lescommuns.org/channel/semapps_dev) is the main entry point for all people who want to contribute.
