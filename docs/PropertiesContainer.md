# Direct Container et Indirect Container

Direct Container et Indirect Container sont lié à une ressource grace à ``ldp:membershipResource``. Cela permet de fournir un container au client pour qu'il puisse ajouter et supprimer une ressource2 lié à une ressource1 en une seul requete.
Ils sont l'interface pour ajouter ou supprimers des ressources2 et les lier sémantiquement à la resource1 par la propriété ``ldp:hasMemberRelation`` (et ``ldp:isMemberOfRelation`` pour créer automatiquement la relation inverse sur la resource créee)

## uri container
### influance de la ressource lié (membershipResource)
l'URI d'un DC/IC ne dépend pas necessairement de la ressource à laquel il est lié mais cela serait incohérent de faire autrement car il serait impossible de distinguer un containers lié à deux resources différentes sans que l'uri de celui-ci depende de l'uri de la resource.

### influance de la propriété managé (hasMemberRelation)
l'URI d'un DC/IC ne dépend pas necessairement de la propriété de la ressource (à laquelle il est lié) qu'il manage (ajout, supression). Cependant, si ce n'est pas le cas, il est impossible de différencier deux container qui managent deux propriétés différente de la même ressource.
La spec est réductrice car l'exemple fourni considère que le container ``/tracker/ldp-demo``  (qui est à la fois une ressource de type ``bt:product`` et un container) lié à la resource ``/tracker/ldp-demo/#it``  manage la propriété ``bt:hasbug``. Il n'est donc pas possible de manager une autre propriété de ``/tracker/ldp-demo/#it`` par le formalisme d'uri proposé dans la spec.

### proposition de construction d'uri
``/{uriResource}/{ontology}:{property}`` ou ``{ontology}:{property}`` identique à ``ldp:hasMemberRelation`` du container et ``/{uriResource}`` identique à ``ldp:membershipResource`` du container.
:::info
Les consiédrations ci apres partirons du postulat que les uri de container doivent dépendre de la ressource lié et de la propriété managé.
:::

## Direct Container
Le Direct Container implique que le serveur va creer une ressource avec une uri qui dépend directement de celle du Container.
En partant du postulat d'uri ci dessus, le DC s'apparente à une logique de composition car l'existance même d'une ressource créé par la container dépend de celui-ci (et son uri) et que l'existance de celui-ci depend de la resource lié (et de son uris). Cette composition entraine à une logique arborescente strict proche du File Sytem tout en apportant une abstration compatible HTTP.
## Indirect Container
### généralité
Un Indirect Container se conporte tres differement qu'un direct container. Les ressource de ce container (``ldp:contains``) sont "informatives" et ne suffisent pas à décrire la resource réelle. Pour obtenir la ressource réelle, il est necessaire se suivre le predicat fourni par le container par son predicat ``ldp:insertedContentRelation``. la ressource contenue dans le container est un rebond vers la ressource réelle. La resource "informative" est la relation et la ressource "concrete" le sujet avec lequel la ressource1 est lié.
Dans les 2 cas ci dessous, la propriété ``ldp:hasMemberRelation`` de la ressource1 est mise à jour avec la ressource réelle (en cas d'ajout).
### cas 1 : ressource créé dans le même container
Sur ce container, il est possible de créer une resource2 réelle et de l'associer à une ressource1. il faut fournir les 2 ressources ("informative" et réelle) généralement en une seul fois. Dans cette configuration l'id de la resource2 est généralement ``#id`` qui fait reference au container.
### cas 2  : ressource existante (dans un autre container)
Il est également possible de réaliser une liaison entre une resource2 existante et une resource1. Dans ce cas, il suffit de créer la ressource "informative" en pointant vers une ressource existante (toujours par prédicat fourni par le container par son predicat ``ldp:insertedContentRelation``)
### arboresence ou graph
le cas 1 ressemble beaucoup au Direct Container (arborescence) en le complexifiant (sans apporter grand chose). L'URI de ressource2 dépand du container associé à une ressource donc de cette ressource.
L'interet du Indirect Container réside dans le cas 2 qui permet d'ajouter ou de supprimer des relations entre resources gérées par différents containers et par différents serveurs. C'est l'approche à priviligier pour faire la relation entre deux ressources de classe différente si les classes différentes sont gérés dans des containers différents. C'est également l'approche à privilégier si nous voulons pouvoir lier une resource du sereur courant avec une ressource externe.

:::info
documentation : maleureusement la logique de rebond n'est pas vraiment expliqué. C'est la spec qui permet de comprendre en relisant 10 fois.
https://www.dataversity.net/introduction-linked-data-platform/
https://fr.slideshare.net/nandana/learning-w3c-linked-data-platform-with-examples
https://www.researchgate.net/publication/303028533_Linking_the_Web_of_Things_LDP-CoAP_Mapping
:::

## Necessité
Les Direct Container sont utile dans une approche de composition de sujet (au sens POO) arborescente locale.
Les Indirect Container sont utile dans une approche d'agrégation de sujet (au sens POO) en graph distribué.
Ils ont donc une utlité mais cela n'est pertinent que si nous voulons des API LDP pour modifier les relations d'une ressource. Il est enviseageable de ne travailler qu'avec les Basic Container et de modifier les resources en faisant une requete PATCH/PUT sur cette ressource et donc de metttre à jour une propriété.
La différence est qu'avec des IC/DC il sera possible de modifier une relation d'une resource sans devoir échanger avec le serveur, l'intégralité des de cette propriété. Ajouter un projet à un acteur sans retransmettre d'intégralité des projets de cet acteur par exemple.
