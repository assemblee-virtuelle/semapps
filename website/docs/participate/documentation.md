# Introduction 
- Nous utilisons [docusaurus](https://docusaurus.io/) pour documenter le projet SemApps. Docusaurus permet de générer une documentation à partir de Github : 
    - On bénéficie donc de l'environnement collaboratif github (édition markdown, versionning, commits, pull requests, reviews, merge etc.)
    - On peut prévisualiser les changements
    - On peut documenter le code et afficher la documentation sur le site vitrine.
- Aujourd'hui le docusaurus de SemApps est hébergé sur http://doc.semapps.org/ ; 
- Dans quelques jours il sera hébergé sur http://semapps.org/

# Ou trouver la documentation docusaurus
- https://github.com/assemblee-virtuelle/semapps/tree/master/website/docs
  - On y trouve les **fichiers de documentation** (gouvernance, participer, packages) sont dans website/docs 
- https://github.com/assemblee-virtuelle/semapps/blob/master/website/docusaurus.config.js
  - On y trouve le **menu** (navbar), le **header** (title et tagline) et le **footer**
- https://github.com/assemblee-virtuelle/semapps/blob/master/website/src/pages/index.js
  - On y trouve le contenu du corps de la page d'accueil et également le texte du bouton (Commencer)
- https://github.com/assemblee-virtuelle/semapps/blob/master/website/sidebars.js
  - On y trouve les pages apparaissant dans les sidebars
  
# Comment contribuer à la documentation

## Schéma général
- Tant qu'il n'y a pas eu de décision / consentement du cercle documentation : **On renseigne une issue**
- Si le contenu de ce qu'on veut publier a obtenu l'aval du groupe documentation : 
    - **On crée une pull request sur une branche dédiée.**  
    - Tant qu'il est à l'état d'ébauche ou au stade de brouillon, **on ne demande pas de review**
- Lorsque notre proposition de contribution nous semble aboutie, **on sollicite une review**.

## Proposer des sujets ou des améliorations en créant une "issue"**
- Rendez-vous sur https://github.com/assemblee-virtuelle/semapps/issues
- Détaillez précisément votre demande / proposition, mettez des liens si besoin pour clarifier au maximum votre intention.  
- Renseignez le label "Documentation" à partir de l'onglet "Labels" du menu sur la droite de l'écran. 
- Et discutons en !

## Modifier une page du docusaurus**
Rendez-vous à l'endroit pertinent en vous référant au chapitre précédent. 
- Si c'est une modification mineure, une faute d'orthographe par exemple, effectuez la modification en éditant la page (edit file), puis "commitez" sur la branche __Master__. Décrivez votre modification à l'endroit réservé à cet effet. 
- Si c'est une modification substantielle : 
  - effectuez la modification en éditant la page, 
  - "commitez" ensuite sur une nouvelle branche que vous pourrez nommer de manière explicite.
  - Renseignez un __Label__ et identifiez des __Reviewers__ qui seront invités à commenter / approuver / proposer des modifications à votre pull request. 
  - A l'issue de ce processus collectif, viendra le moment de __merger__ la pull request sur la branche __Master__

## Créer une nouvelle page sur le docusaurus
- Proposez une issue ; 
Si l'initiative parait pertinente : 
- Créez un fichier markdown à l'endroit souhaité, en n'oubliant pas de renseigner l'extention : ".md". Celui-ci doit nécessairement commencer par :
  ```
  ---
  title: [le titre de votre page]
  ---
  ```

  NB : Le titre de la page peut avoir des espaces. En revanche, le nom du fichier .md qui ne doit pas avoir d'espaces, et être écrit en minuscule.

- Commitez et faites un pull request sur une branche dédiée. 
- Une fois validée par les reviewers que vous aurez identifié, mergez la pull request sur la branche master. 
