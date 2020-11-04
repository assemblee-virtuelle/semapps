# SemApps et les architectures PAIR à PAIR : Formation à l'UTT
--------------
 
> **UTT** = Université de technologie de Troyes  
**SemApps** = logiciel open-source, collaboratif, intéropérable, développé par L'AV, permettant de rassembler/créer des synergies entre différents acteurs et projets en Transition  
**P2P** = technologie du web 2.0 consistant à remettre sur un pied d'égalité les utilisateurs du web dans le partage de données/fichiers = ils sont serveurs et clients. Si P2P décentralisé, alros chaque ordinateur fait office de mini-serveur, pas de serveur fixe. 


[Lien du ppt de la réunion](https://docs.google.com/presentation/d/1lVUx4URcKkV1Z3G4EticbH1uCV_NwtVBlYo5cvqUOOc/edit?usp=sharing)  
[Lien de la vidéo de présentation de SemApps et du modèle Pair à Pair](https://www.youtube.com/watch?v=wjQSKP4DWmM&feature=youtu.be)  
*Les différents titres de cette documentation sont accompagnés par le moment de la vidéo concerné.* 

### SOMMAIRE
* Le modèle PAIR (16:50)
* Support technologique du modèle PAIR : SOLID (41:35)
* Le web sémantique (42:45)
* Une ontologie PAIR en restructuration (1:08:58)
* SemApps (1:37:16)
  * Architecture modulaire, en 3 couches indépendantes (1:39:50)
  * Quelques démos du logiciel (1:47:04)
* Expression libre (2:18:15)

L'AV, par ses outils numériques, répond aux **problématiques des environnements collaboratifs (ex : communs, connaissance, logiques de gouvernances partagée, sémantique)** appliquées aux enjeux de Transition.
==> **SemApps** pourrait être adaptée aux projets de ce type des autres participants de la réunion.
==> Réunion pourrait aboutir à la **création d'une instance SemApps** pour des projets de  cartographie des écosystèmes.

**Participants** : 
- Dominique & Eddy + Cédric (stage UTT) : sujet = problématiques des interactions sociales, comment les détecter et les maitriser. 
- Jean-Pierre & Yuri (stage UTT) : TEXICO, outils d'ingénierie de connaissance collaborative (cartes de thèmes), web socio-sémantique. 
- Gilles & Eddy : thèse sur la Mutuelle Générale avec développement d'une approche située pour comprendre interactions de ses adhérents  
- Didier : école de management, pédagogie, travaille sur les écosystèmes chez Engie
- Yolaine : thèse chez Engie avec création d'un outil de calcul + une application pour les communautés des énergies renouvelables.
-  Maxime : DATANOSTRA (labo de R&D pour les entreprises), développe l'application pour Yolaine.
-  Julie : thèse sur les écosystèmes des énergies renouvelables
-  Oscar : Thèse sur le Jumeau Numérique
-  Sébastien Rosset : SemApps, AV et Colibris, outils du web sémantique pour partager des données avec d'autres organisations
-  Guillaume Rouyer   

## Présentation SemApps/P2P par Guillaume et Sébastien


AV : 
- développer des communs (outils comme SemApps et méthodologies comme P2P)
- favoriser la mise en réseau des acteurs de la Transition grâce à la mise en synergie de leurs systèmes d'information

Présentation à 2 dimensions : 
1. Partie technique, logiciels développés
2. Concepts/approches socio-organisationnels sur lesquels reposent ces logiciels 

### Le modèle PAIR (16:50)

Définition : **mode d'organisation sociale en réseau** inspiré du P2P, conceptualisé par l'AV. C'est une **application du P2P à la réalité sociale**, PAIR met en réseau des *Projets, Acteurs, Idées et Ressources* (qui sont des noeuds dans le P2P).   
Source d'inspiration : théorie des systèmes complexes et principe de la combinatoire ==> PAIR veut concevoir des **dynamiques combinatoires** entre P A I R. 

* Réseaux en P2P 
= distribués, interconnectés (≠ centralisé et décentralisé).  
Enjeu : **Sortir des silos** du web (duplication de l'identité et enfermement des données)  
Solution : Architecture distribuée pour permettre aux acteurs d'être **autonomes et reliés**.

Dans la réalité, organisations = silos (ex : salariat enferments acteurs, brevets enferment idées), donc la collaboration n'est pas facilitée. Le modèle PAIR souhaite relier les P A I R **par-delà les organisations**. Ce mode d'organisation répond à la fragmentation des dynamiques et projets (= duplication = inefficience). 

**Objectif** : créer des systèmes d'Idées, d'Acteurs, de Ressources et de Projets.** Un système d'acteurs peut mutualiser idées et ressources, résultent donc des projets collaboratifs, une intelligence collective...
À long terme, l'AV voudrait créer des infrastructures socio-techniques PAIR à PAIR pour redistribuer cette valeur ajoutée par les projets (vers les systèmes d'acteurs à l'origine de ces projets).

Par ex : projet de TEXICO = sous projet d'un projet de l'UTT = sous projet d'un projet d'universités..etc

Mots-clés de l'architecture PAIR : 
* **efficience**
* **autonomie**
* **reliance**

### Support technologique du modèle PAIR : SOLID (41:35)
Définition : **spécification d'architecture** permettant le développement de systèmes d'informations P2P autonomes et reliés.

Enjeu de l'AV : **Créer une ontologie permettant de relier le concept socio-organisationnel (PAIR) et le dispositif technique (SOLID) = SemApps.**

> Question : Comment rejoindre ce réseau PAIR ? ==> Grâce à la cartographie

### Le web sémantique (42:45)

Base du web sémantique : triplet = relation entre un sujet (Valentine), un prédicat (est service civique chez) et un objet (l'AV)

Plusieurs technologies du web sémantique pour utiliser les triples : 

* *RDF* : décrire ces relations (un URL = un élément du triplet, unique).

* *SPARQL* : requêtes complexes, extraire des données dans des bases qui stockent des triples.

* *OWL* : créer du raisonnement, de l'inférence
(par ex : je suis membre d'une orga, l'orga participe à un projet, DONC je suis participant d'un projet).

* *SHACL/SHEX* : valider des données.

* *Linked Data Platform* : communiquer entre serveurs.

**SOLID reprend une grande partie de ces standards du web sémantique, pour nous permettre de nous ré-approprier nos données**. *Ex : Imaginons que Facebook ne nous conviennent plus, SOLID nous permettrait de fermer les droits d'accès à nos données à FB, et de les ouvrir à une plateforme qui nous convient davantage*. 


**ActivityPub**
technologie aussi basée sur le sémantique  
= **langage universel** pour les réseaux sociaux.

Objectif est d'avoir des linked data/données intelligentes, plutôt que des pages web HTML ==> retour à l'objectif d'origine du web de Tim Bernes Lee.

### Une ontologie PAIR en restructuration (1:08:58)

Définition : **Passerelle entre modèle socio-organisationnel et modèle technique.** Une ontologie est un vocabulaire qui fait interagir un certain nombre de concepts, permettant de typer à la fois ces concepts et leurs relations. Elle modélise la diversité des relations d'appartenance entre un individu et une organisation (je suis salarié mais aussi investisseur, administrateur...)

Dans le cadre de l'ontologie PAIR : Acteur peut suggérer une Idée, qui se concrétise dans un Projet, à l'aide de Ressources. 
- Boîtes P A I R
- Boîte concept : identifier thèmes, types, secteurs, branches qui caractérisent les acteurs
- Boîte objet : documenter un P A I R
- Boîte intentions : modéliser finalités, motivations, problèmes, et moyens

==> **Identifier les liens logiques entre les différents P A I R**

SemApps V1 a permis de tester cette ontologie : cartographie de l'écosystème des Grands Voisins, objectif est de créer des synergies. A mené à un besoin de restructuration ==> développement de nouveaux modules : 
- modules métiers : décrire le métier concerné dans sa spécificité (Data Food Consortium, les aider à interopérer leurs plateformes pour faciliter la vie des producteurs & consommateurs ; Modélisation des écosystèmes autour des enjeux de l'énergie avec la Fabrique des énergies, Prats de Mollo et peut être l'UTT ) 
- modules fonctionnels (gestion de projets, gouvernance partagée...)
 

### SemApps (1:37:16)

![](https://pad.lescommuns.org/uploads/upload_47d018cbe852fe95ae419b9741e4efce.png)

Solutions apportées par SemApps : 
* cartographie sémantique
* bases de connaissance collaborative
* systèmes d'informations territoriaux et thématiques
* réseaux sociaux décentralisés
* applications métiers

Objectif de SemApps : proposer une **boîte à outils sémantique** pour construire toutes sortes de logiciels en fonction des besoins des différentes communautés d'utilisateurs.

#### **Architecture modulaire, en 3 couches indépendantes** (1:39:50)


| Triple Store | Middlewear | Applications |
| -------- | -------- | -------- |
| Stockage de données sémantiques brutes     | Basé sur les protocoles du W3C, architecture en microservices (qu'on peut ajouter/retirer selon les préférences). Traite les données sémantiques, son contenu peut être affiché par différentes applications     | Interfaces se connectent au middlewear     |

SemApps développe aussi des "connecteurs" pour faciliter l'usage de ces standards par différentes interfaces, pour augmenter les possibilités de connexion interfaces/serveurs.

Mots-clés de la conception de SemApps : **interopérabilité, modularité, généricité, adaptabilité, scalabilité, accessibilité, ouverture, convivialité**.

#### Quelques démos du logiciel (1:47:04)

**Le bus sémantique** : outil développé par l'Assemblée Virtuelle servant de cartographie sémantique (par ex : transformer tableurs Excel en données sémantiques). 

Le web sémantique permet de faire des **requêtes complexes** et d'**exposer de la connaissance à partir de triplets**. La visualisation des relations SemApps se fait par *Popock*, en forme de graphe intuitif <span style="color: #26B260">(voir à 1:59:00)</span>. 

Objectifs en chantier :
- **Fédération** : pouvoir naviguer à travers différentes instances configurées différemment.
- **Permissions**
- **Validation**
- **Moteur d'inférence**
- **Identification distribuée** : s'identifier sur différentes instances sans dupliquer des comptes (projet SOLID)

Projets en cours/à venir (2:14:00) : 
- Interfaces sémantiques (React-admin, Startin'blox, Popock...)
- Adaptation de logiciels (Yeswiki, Gogocarto...)
- Fédération (Mastodon, Peertube...)
- Bots ActivityPub (mailer, tagbot, learning bot...)

### Expression libre (2:18:15)

2 profils identifiées (présents à l'UTT) pour accéder rapidement à une instance utilisable : 
- Un profil développeur : déploiement et maintien de l'instance + traitement de données via le bus sémantique
- Un profil modélisateur : modéliser les ontologies avec aides ponctuelles relatives aux interfaces 

==> 1 stage/formation au bus sémantique (dirigé par Simon) devrait suffire à adapter ces profils au projet SemApps.





