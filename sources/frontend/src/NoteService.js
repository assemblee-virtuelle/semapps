import {
  PathFactory
} from 'ldflex';
import {
  default as ComunicaEngine
} from 'ldflex-comunica';
import {
  namedNode
} from '@rdfjs/data-model';

class NoteService {
  constructor() {

  }
  async getNote(id,container){
    const context = {
      "@context": {
        "as": "https://www.w3.org/ns/activitystreams#",
        "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      }
    };



    const queryEngine = new ComunicaEngine( container);

    const path = new PathFactory({
      context,
      queryEngine
    });

    const proxy = path.create({
      subject: namedNode(id)
    });

    let description = await proxy['as:content'];
    console.log('as:content', description.toString());
    // let description2 = await proxy.description;
    // console.log('description', description2);

    console.log(`le text du message ${await proxy['as:content']}`);
  }


}

export default NoteService;
