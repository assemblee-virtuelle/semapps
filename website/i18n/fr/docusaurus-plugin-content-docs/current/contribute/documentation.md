---
title: Contributer à la documentation
---

Nous utilisons [Docusaurus](https://docusaurus.io/) pour documenter le projet SemApps. Docusaurus est utilisé pour générer de la documentation depuis Github :
- Nous bénéficions de l'environnement collaboratif de Github (édition de démarques, versioning, commits, pull request, reviews, etc.).
- Vous pouvez prévisualiser les modifications
- Le code peut être facilement déployé

## Où trouver les fichiers de documentation Docusaurus ?

- Les **fichiers de documentation** en syntaxe **markdown** sont dans le dossier [/website/docs](https://github.com/assemblee-virtuelle/semapps/tree/master/website/docs).

- Les **fichiers traduits en français** sont dans le dossier [/website/i18n/fr/<plugin>](https://github.com/assemblee-virtuelle/semapps/tree/master/website/i18n/fr/).

- La configuration du **menu** (navbar), l' **en-tête** (title and tagline) et le **bas de page**, se trouve dans le fichier [/website/docusaurus.config.js](https://github.com/assemblee-virtuelle/semapps/blob/master/website/docusaurus.config.js).

- Pour modifier **le contenu de la page d'accueil**, le code est en React, dans [/website/src/pages/index.js](https://github.com/assemblee-virtuelle/semapps/blob/master/website/src/pages/index.js)

- Le **menu latéral** est lui personnalisé grâce au fichier [/website/sidebars.js](https://github.com/assemblee-virtuelle/semapps/blob/master/website/sidebars.js).

## Comment contribuer à la documentation ?

### Gouvernance
- Jusqu'à ce qu'il y ait une décision/un consentement du cercle de documentation : **Créer une issue**
- Si le contenu de ce que vous souhaitez publier a été approuvé par le groupe de documentation : 
    - **Créer une pull request sur une branche dédiée.**  
    - Tant qu'il s'agit d'un brouillon ou d'un brouillon, **ne demandez pas de révision**.
- Lorsque notre proposition de contribution semble complète, **une review est demandé**.

### Proposer des sujets ou des améliorations en créant une "issue"

- Aller sur : https://github.com/assemblee-virtuelle/semapps/issues
- Détaillez votre demande/proposition, mettez des liens si besoin pour clarifier au maximum votre intention.
- Remplir l'étiquette de documentation externe / interne / technique depuis l'onglet "Etiquettes" du menu à droite de l'écran.
- Et discutons-en !

### Modifier une page sur le Docusaurus de Semapps
Rendez-vous à l'endroit approprié en vous référant au chapitre précédent.
- S'il s'agit d'une modification mineure, une faute d'orthographe par exemple, effectuez la modification en éditant la page (éditez le fichier), puis "validez" dans la branche __Master__. Décrivez votre changement dans l'espace prévu.
- S'il s'agit d'un changement substantiel :
  - faire le changement en éditant la page,
  - puis "s'engager" dans une nouvelle branche que vous pouvez nommer explicitement.
  - Remplissez un __Label__ et identifiez les __Reviewers__ qui seront invités à commenter / approuver / proposer des modifications à votre pull request.
  - A la fin de ce processus collectif, il sera temps de __merger__ la pull request sur la branche __Master__.

### Créer une nouvelle page sur Docusaurus
- Créer une issue ; 

Si l'initiative semble pertinente :
- Créez un fichier de démarques à l'emplacement souhaité en n'oubliant pas de renseigner l'extension : ".md". Il doit nécessairement commencer par :
  ```
  ---
  title: [titre de votre page]
  ---
  ```

  NB: Le titre de la page peut contenir des espaces. En revanche, le nom du fichier .md ne doit pas comporter d'espaces, et doit être écrit en minuscules.

- S'engager et faire une pull request sur une branche dédiée.
- Une fois que les reviewers que vous avez identifiés l'ont validé, fusionnez la pull request sur la branche master.

## Demander de l'aide : 

Our [Semapps Chat](https://chat.lescommuns.org/channel/semapps_dev) est le principal point d'entrée pour toutes les personnes qui veulent contribuer.
