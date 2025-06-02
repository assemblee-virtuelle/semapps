import type { Quad } from '@rdfjs/types';
import { parseRdf, startTransaction, toSparqlUpdate, toTurtle, set, getDataset, createLdoDataset } from '@ldo/ldo';

import { Activity } from '../../../ldo/index.typings';
import {} from '../../../ldo/index.context';
import {} from '../../../ldo/index.schema';
import { CreateShapeType, ObjectShapeType } from '../../../ldo/index.shapeTypes';
import jsonld from 'jsonld';

const main = async () => {
  const ldoDataset = createLdoDataset(
    (await jsonld.toRDF(
      {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: 'https://foo.bar/create-activity',
        type: 'Create',
        object: 'https://foo.bar/new-object'
      },
      {}
    )) as Quad[]
  );

  const createActivity = ldoDataset.usingType(CreateShapeType).fromSubject('https://foo.bar/create-activity');
  const createdObject = createActivity.object?.map(o => ldoDataset.usingType(ObjectShapeType).fromSubject(o))[0];

  const datasetAgain = getDataset(createdObject!);

  console.log(datasetAgain);
};

main();
