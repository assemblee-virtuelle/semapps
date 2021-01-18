Le Code Social du projet a pour objectif de le décrire de manière exhaustive et systémique.

# Raison d'être

## Contexte & problématique

L'organisation actuelle des données très centralisée crée des effets de bord non désirable: 
- Infobésité, multiplication des données et difficulté de s'y retrouver.
- Incompatibilité des applications les unes avec les autres.
- Fakenews, on ne sait pas qui produit la donnée, difficile d'avoir confiance en elle donc.

### Pourquoi ?

Transformer la manière dont on produit et on consomme des données en la rendant plus responsable.

### Quoi ?

L'objectif de SemApps est de **favoriser la mise en réseau des acteurs grâce à la mise en synergie de leurs systèmes d'informations**.
Nous utilisons pour cela les protocoles et standards du **web sémantique** qui permettent à de multiples systèmes d’information de s'interconnecter et de communiquer.

### Comment ?

Notre ambition est la création d'un environnement technologique "data-agnostic" qui soit :
- en capacité de manipuler des données issues d'une multiplicité de base de données à partir d'une même interface,
- en capacité d'utiliser une diversité d'interfaces pour manipuler un même jeu de données. 

Ce système prend la forme de 3 composants : 
- Une base de donnée sémantique
- Un serveur Solid
- Un front-end standard permettant l'affichage des données dans des formats multiples

*Cas d'usage* : 

Un cas d'usage typique de SemApps est la description d'une communauté d'acteurs, de ressources, d'événements, de projets et d'initiatives.
Vous trouverez une description de différents cas d'usage (lien à ajouter)

Plus d'informations sur la raison d'être et les enjeux (lien à ajouter)


# Modèle Social et Humain

Le collectif qui contribue au Code Social est un groupe de personnes physiques membres de l'Assemblée Virtuelle.
La gouvernance est partagée et répartie entre différents rôles qui ont chacun des responsabilités et des périmètres d'autonomie.
La modification de ce code social se fait sur la base du consentement lorsqu'un des membres du projet en fait la demande.

Pour en savoir plus sur la [gouvernance partagée](https://nos-communes.fr/gouvernance/introduction-a-la-gouvernance-partagee/#:~:text=La%20co%2Dresponsabilit%C3%A9%20n'emp%C3%AAche,fait%20ce%20qu'il%20veut).

Pour en savoir plus sur l'organisation de [notre gouvernance](https://semapps.org/docs/governance/organisation-and-roles)

# Modèle technologique 

3 piliers :
 - Le logiciel libre: nous croyons au code libre et à l'économie de la contribution. Tous nos développements seront open source en licence [[https://www.apache.org/licenses/LICENSE-2.0 Apache 2]].
 - L'interopérabilité des données: nous croyons à la puissance de la distribution et à une répartition plus équilibrée des données.
 - Le biomimétisme: la nature est organisée de manière aléatoire et repose sur des équilibres systémiques.

Entièrement basés sur des standards ouverts, les composants de SemApps sont conçus pour être indépendants, interopérables et  interchangeables, de telle sorte que la base de données, l’ontologie, le serveur ou les interfaces pourront être remplacés par d’autres briques logicielles respectant elles-mêmes ces standards.
SemApps est enfin construit sur une approche “Ontology Driven Architecture” permettant de construire “à la volée” des applications métiers à partir des ontologies qu’on lui fournit.


SemApps est composé de: 
 - Back-office - Base de données
Technologie: TripleStore Jena + ACL
 - Middleware - API
Technologie : Serveur Solid - LDP, Activity Pub, node.js
 - Front-office - Interface
Technologie : REACT + web-component


Une gestion des identités et des contrôles d’accès à l’aide des standards WebID-OIDC, et WebACL.
Des connecteurs basés sur OpenAPI, ActivityPub OpenAPI sert uniquement à décrire les API LDP. 


Vous trouverez les détails technologiques dans l'architecture et les spécifications [[ModeleTechno ici]]

# Modèle culturel

Parmi les sources d’inspiration autour du projet SemApps, nous pouvons notamment citer :

- Le paradigme organisationnel du pair à pair que l'informatique et l'internet ont permis de redécouvrir.
- Le monde du logiciel libre ainsi que celui des communs dont on peut considérer qu’ils ont très concrètement changé le monde en permettant le développement de projets aussi beaux et fous que le Linux ou wikipedia.  
- Le web sémantique, le W3C, le web qui ont consacré les notions de standards, d’interopérabilité, de neutralité
- La théorie des systèmes ‒ complexes ‒ qui ont permis de porter un nouveau regard sur le monde.  
- Les pensées et mouvements coopérativistes, libertaires, personnalistes ainsi que les notions d’autonomie, de liberté, de fraternité et de solidarité qu’ils ont incarné au cours des siècles derniers. 
- Les pensées et dynamiques qui se sont développées autour de la démocratie directe, de la démocratie liquide, de l’empowerment, de la souveraineté ‒ qu’elle soit individuelle ou collective ‒ de la citoyenneté.
- Les nouvelles formes d’économie, collaboratives, circulaires, numériques, agiles, fablabs, DIY, DIWO, Hackerspaces.
- Le vivant, qui pour plusieurs d’entre nous, constitue un objet ultime de fascination, tant il est complexe et riche d’enseignements. La conception et le design de SemApps sont issus d'une approche biomimétique.  
- Le jeu, l’élan vital, l’hédonisme, l’épicurisme, le Spinozisme (la puissance d’action et la joie), la révolution du sourire et toutes les choses de la vie qui procurent aux êtres sensibles que nous sommes, la sensation d’être vivants, heureux, insouciants, en forme, en harmonie avec soi, les autres et le monde.
- La communication bienveillante, et de manière générale les bienfaits d’une meilleure connaissance de soi pour se donner la capacité de développer des relations sociales harmonieuses avec les autres, dans le cadre du développement de SemApps notamment.


# Modèle écologique 

**Objectif** : Tendre vers le respect de 80% au moins des [[https://collectif.greenit.fr/ecoconception-web/115-bonnes-pratiques-eco-conception_web.html115 bonnes pratiques identifiées]] par Frédéric Bordage, en vue de réduire l'impact énergétique des systèmes informatiques. 


# Modèle économique 

SemApps est un logiciel libre, il n'a pas pour objectif d'être rentable ou de produire de la valeur marchande. Il vise la production de valeur d'usage en direction d'une multiplicité d'acteurs qui pourront se l'approprier, l'utiliser librement et éventuellement proposer des offres de service autour, parmi lesquelles : maintenance, hébergement, développement de nouvelles fonctionnalités.

Ceci étant dit, le modèle économique de SemApps repose sur les ressources suivantes : 
- Contributions en nature
- Contributions en numéraire et dons défiscalisés (66%)
- Contributions au Commun
- Subventions sur projets
- Partenariats et financements R&D avec des acteurs publics et des universités

# Modèle juridique et financier 

## Portage juridique

SemApps est porté par l'Assemblée Virtuelle, association Loi 1901, dont le siège social est situé aux Grands Voisins, 72 avenue Denfert-Rohereau, 75 014 Paris.

## Licence
Nous avons fait le choix de la licence [[https://www.apache.org/licenses/LICENSE-2.0 Apache 2]]
Nous entendons le logiciel libre open source, comme vraiment libre, c'est à dire que chacun peut en faire ce qu'il veut. Les licences BSD et Apache sont faites pour ça. La liberté bridée, les contraintes de code source distribué avec les binaires, les incompatibiltés de licence que les GPL génèrent, et les prises de tête associées, compliquent les choses. On simplifiera la vie de chacun si on opte pour une licence permissive. Les licences permissives représentent vraiment la liberté. 
Par respect pour tout le code que nous allons réutiliser, lequel nous vient d'Apache (Jena, TinkerPop peut-etre, et tant d'autres logiciels de très haute qualité), nous avons choisi la licence Apache 2.

