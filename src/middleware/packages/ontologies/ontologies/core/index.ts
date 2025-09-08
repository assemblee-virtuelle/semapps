import acl from './acl.json' with { type: 'json' };
import as from './as.json' with { type: 'json' };
import cred from './cred.json' with { type: 'json' };
import dc from './dc.json' with { type: 'json' };
import did from './did.json' with { type: 'json' };
import foaf from './foaf.json' with { type: 'json' };
import ldp from './ldp.json' with { type: 'json' };
import rdf from './rdf.json' with { type: 'json' };
import rdfs from './rdfs.json' with { type: 'json' };
import sec from './sec.json' with { type: 'json' };
import semapps from './semapps.json' with { type: 'json' };
import skos from './skos.json' with { type: 'json' };
import vcard from './vcard.json' with { type: 'json' };
// @ts-expect-error TS(1141): String literal expected.
import void from './void.json' with { type: 'json' };
import xsd from './xsd.json' with { type: 'json' };
// @ts-expect-error TS(2304): Cannot find name 'void'.
export { acl, as, cred, dc, did, foaf, ldp, rdf, rdfs, sec, semapps, skos, vcard, void, xsd };
