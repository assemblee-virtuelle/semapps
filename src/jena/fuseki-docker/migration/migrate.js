const fs = require('fs');
const path = require('path');
const format = require('string-template');

const matchAll = require("match-all");

//const folder = path.join(__dirname,'configuration');
const folder = path.join(path.parse(__dirname).root,'fuseki','configuration');

const rdfsLabelRegex = new RegExp('^\\s*rdfs:label\\s*"([\\w\\s]+)"\\s*[;.]\\s*$','gm')
const fusekiNameRegex = new RegExp('^\\s*fuseki:name\\s*"([\\w]+)"\\s*[;.]\\s*$','gm')
const tdb2LocationRegex = new RegExp('^\\s*tdb2:location\\s*"([/\\\\:\\w]+)"\\s*[;.]\\s*$','gm')

let template = fs.readFileSync(path.join(__dirname,'templates','dataset.ttl'), {encoding: 'utf8'} )
let templateAcl = fs.readFileSync(path.join(__dirname,'templates','secure-dataset.ttl'), {encoding: 'utf8'} )


fs.readdirSync(folder).forEach(file => {
  if (file.endsWith('.ttl')) {
    console.log(file);
    const filename = path.join(folder,file)
    let content = fs.readFileSync(filename, {encoding: 'utf8'} )
    if (!content.includes('mirror')) {
      console.log('> migrating...')
      fs.writeFileSync(filename+'.bak',content)
      // extract names
      const rdfsLabel = matchAll(content,rdfsLabelRegex).toArray()[0]
      const fusekiName =  matchAll(content,fusekiNameRegex).toArray()[0]
      console.log('> rdfsLabel = ',rdfsLabel)
      console.log('> fusekiName = ',fusekiName)
      const locations = matchAll(content,tdb2LocationRegex).toArray();
      if (content.includes('webacl')) {
        let aclLocation = locations.filter(l => l.includes('acl') || l.includes('Acl'))
        aclLocation = aclLocation.length == 1 && aclLocation[0]
        if (!aclLocation) { console.log('> error: cannot find acl location'); }
        else {
          console.log('> aclLocation = ',aclLocation)  
          const newContent = format(templateAcl, { dataset: fusekiName, aclLocation, rdfsLabel });
          fs.writeFileSync(filename,newContent)
        }
      } else {
        const newContent = format(template, { dataset: fusekiName, rdfsLabel });
        fs.writeFileSync(filename,newContent)
      }

    }
    else  console.log('> already done.')
    console.log('')
  }
});
