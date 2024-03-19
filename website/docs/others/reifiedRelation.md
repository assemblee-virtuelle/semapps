---
title: How to manage reified relations in Archipelago + LDP server
---

# Concept
Reified relation are relations between 2 subjects (Class1 & Class2) which host other information. The role between an Organization and a User for example. Those relations require creation of à third Class hosting Object Property which refer Class1 and Class2. This third Class host Data Property or Object Property.

That Note use exemple:
Entity1 typed by Classe1 and Entity2 types by Class2 linked by a reified relations type by ReifiedClass which contains one ObjectProperty  other (Entity3 for example).
Class1 and Class2 linked by ReifiedClass which contains one ObjectProperty typed Class3 everytime.
Class1 can use ObjectProperty class1ToReifiedClass
Class2 can use ObjectProperty class2ToReifiedClass
ReifiedClass can use ObjectProperty reifiedClassToClass1 and reifiedClassToClass2


# Use
## 1 : configure LDP container
Reified RElation wwill be send in only one object from React-Admin to LDP server. Server have to extract embended subjects (reified relation), create thos in specified container and link main subject to extracted subjects.
**ldp.service.js -> settings**
```
containers :[
  {
    path: '/classe1',
    acceptedTypes: ['onto:Class1'],
    disassembly: [{ path: 'onto:class1ToReifiedClass', container: 'mySettingsBaseUrl/reifiedClass' }]
  },
  {
    path: '/reifiedClass',
    acceptedTypes: ['onto:ReifiedClass']
  }
]
```
## 2 : configure DataProvider : forceArray
**resouces -> Classe1 -> index.js**
```
dataModel: {
  types: ['onto:Class1'],
  containerUri: mySettingsBaseUrl + 'classe1',
  dereference: ['onto:class1ToReifiedClass'], //optional for list => obtains reifiedRelations for list
  slugField: 'onto:label', // usefull but not considere for réification
  forceArray: ['onto:class1ToReifiedClass'] // REQUIRE React Admin Component below not support single value
},
```
### 3 : implement interface : ReificationArrayInput
WARNIG : no properties set to tag no considering by this documentation
considering
* resources -> Classe2 directory exist and well configurated
* ReferenceInput and SelectInput used in this example but you can use every other component to assess reified relation properties.

**resouces -> Classe1 -> Edit.js**
```
import { ReificationArrayInput } from '@semapps/semantic-data-provider';
import { Edit } from '@semapps/archipelago-layout';
import { SimpleForm } from 'react-admin';

export const Classe1Edit = props => (
    <Edit {...props}>
      <SimpleForm>
        <ReificationArrayInput
          source="onto:class1ToReifiedClass"
          reificationClass="onto:ReifiedClass"
        >
          <ReferenceInput reference="Classe2" source="onto:reifiedClassToClass2">
            <SelectInput
              optionText="onto:label"
            />
          </ReferenceInput>
        </ReificationArrayInput>
      </SimpleForm>
    </Edit>
  );

export default Classe1Edit;
```

# inverse relation
this example not explain invers reified relation implementation but concets and use are the same.
* inverse relation have to be set on ontology specified in owl specified on ontologies file.
* container, datamodel and edit interface of Classe 2 have to be configured
