# Introduction 
- Nous utilisons https://docusaurus.io/ pour la documenter le projet SemApps. Docusaurus permet de générer une documentation à partir de Github : 
    - On bénéficie donc de l'environnement collaboratif github (édition markdown, versionning, commits, pull requests, reviews, pull resquests etc.)
    - On peut prévisualiser les changements
    - On peut documenter le code et afficher la documentation sur le site vitrine.
- Aujourd'hui le docusaurus de SemApps est hébergé sur https://website-3rr9j6b6k.now.sh/ ; 
- Dans quelques jours il sera hébergé sur http://semapps.org/

# Ou trouver la documentation docusaurus
- https://github.com/assemblee-virtuelle/semapps/tree/master/website/docs
  - On y trouve les **fichiers de documentation** (gouvernance, participer, documentation) sont dans website/docs 
- https://github.com/assemblee-virtuelle/semapps/blob/master/website/docusaurus.config.js
  - On y trouve le **menu**, le **header** et le **footer**
- https://github.com/assemblee-virtuelle/semapps/blob/master/website/src/pages/index.js
  - On y trouve les textes et images de la page d'accueil
- https://github.com/assemblee-virtuelle/semapps/blob/master/website/sidebars.js
  - On y trouve les pages apparaissant dans la sidebar
  
# Comment contribuer à la documentation

## Proposer des sujets ou des améliorations en créant une "issue"**
- Rendez-vous sur https://github.com/assemblee-virtuelle/semapps/issues
- Renseignez le label "Documentation" à partir de l'onglet "Labels" du menu sur la droite de l'écran
- Et discutons en !

## Modifier une page du docusaurus**
Rendez-vous à l'endroit pertinent en vous référant au paragraphe ci-dessus. 
- Si c'est une modification mineure, une faute d'orthographe par exemple, effectuez la modification en éditant la page, puis "commitez" sur la branche __Master__. Décrivez votre modification à l'endroit réservé à cet effet. 
- Si c'est une modification substantielle : 
  - effectuez la modification en éditant la page, 
  - "commitez" ensuite sur une nouvelle branche que vous pourrez nommer de manière explicite.
  - Renseignez un __Label__ et identifiez des __Reviewers__ qui seront invités à commenter / approuver / proposer des modifications à votre piull request. 
  - A l'issue de ce processus collaboratif, viendra le moment de __merger__ la pull request sur la branche __Master__

## Créer une nouvelle page sur le docusaurus
- Proposez une issue ; Si l'initiative parait pertinente : 
- Créez un fichier markdown à l'endroit souhaité.Celui-ci doit nécessairement commencer par :
  ```
  ---
  title: [le titre de votre page]
  ---
  ```
- Commitez et faites un pull request sur une branche dédiée. 
- Une fois validée par les reviewers que vous aurez identifié, mergez la pull request sur la branche master. 