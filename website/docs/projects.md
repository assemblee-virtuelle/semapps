# They use SemApps

## In production
*They are live with SemApps, discover.*

### La Fabrique des colibris
**La Fabrique des Colibiris** is a French non-profit organization which works with ecological projects's holders. They bring their network and expertise to support the projects' development.

Users can suscribe to a notification system to be informed by email when new projects are available online, based on their location or interests.
https://alertes.colibris-lafabrique.org

The notification system uses an [ActivityPub bot based on SemApps](https://github.com/reconnexion/activitypub-mailer), which listens to La Fabrique's activities.

### Data Food Consortium
**DFC** is a consortium between  short food circuit actors. They all uses an application to handle their logicistics (stocks, shipping) without common standard. They can't operate natively with each others.

DFC has developped an application to connect each application and translate their data into a standard, so they can cooperate whith each others.

http://datafoodconsortium.org/fr/

#### Use case
**Synchronise**
- synchronize the product catalog (description, categorization, stock ...) between platforms
- retrieve data from network's platforms for a user (sales for example)
- update data from another platform as the owner of this data

## In development
*They are not yet live, but their projects are on-going.*


### Les chemins de la transition
**Les CdlT** is a French non profit organization creating a nomad and distributed university of profession that care about changing systems.

The organisation has a central national administrative comitee that coordinate the territorial activities. Each territoire host its own plateform, with a specific design, graphism and each territoire shares its data with the others.

### Université de Technologie de Troyes
**UTT** is a French engineering school giving courses and lectures about complex system, semantic web, distributed network. They use SemApps as a proof of concept and test system to design application for energy grid.

### Passerelle Normandie
**Passerelle Normandie** is a project from [La coop des territoires](https://www.lacoop.co/) which is a lab to imagine, design and build tomorrow's territory. Passerelle Normandie hosts event and an application to accompany people willing to move from a city to Normandie (rural territory.
They use SemApps to host interroperable data in 3 scopes : Health, [Third Places](https://en.wikipedia.org/wiki/Third_place) and Agriculture.

### La Fabrique des Mobilités
**La FabMob** is a project to connect all the essential players: industry, startup, community, school, research laboratory, competitiveness cluster, agency and ministry. The [Semantic Media Wiki](https://www.semantic-mediawiki.org/wiki/Semantic_MediaWiki) capitalizes on all projects, feedback and errors, to bring out a common culture of innovation in action.

#### UseCase
In order to better connect the dots and navigate through the data, the community needs a visual graph people can filter and manipulate. Data are extract from the SemanticMediaWiki and copy in a SemApps database in order to be read by Fluidio (Graph viz)
