const base64url = require('base64url');
const jose = require('node-jose');
// const config=require("../../../configuration.js")
// const EntrepriseService=require("../service/entreprise.js")
// const UserService=require("../service/user.js")

function getMiddlwareExpressOidc(options){
  return async function(req,res,next){
    console.log('req.headers',req.headers.authorization);
    if(req.headers.authorization==undefined){
      res.status(401)
      next(new Error('Missing Bearer Token'));
    }else {
      var token = req.headers.authorization.split(' ')[1];
      if (token==null || token==undefined || token=='null') {
        res.status(401)
        next(new Error('Missing Bearer Token'));
      }else{
        var components = token.split('.');
        var header = JSON.parse(base64url.decode(components[0]));
        var payload = JSON.parse(base64url.decode(components[1]));
        var signature = components[2];
        var decodedSignature = base64url.decode(components[2])

        console.log('payload', payload);
        console.log('resource_access', payload.resource_access);
        console.log('signature', signature);
        console.log('decoded signature', decodedSignature);

        try {
          let publicKey="-----BEGIN PUBLIC KEY-----"+options.public_key+"-----END PUBLIC KEY-----"
          const key = await jose.JWK.asKey(publicKey, 'pem');
          const verifier = jose.JWS.createVerify(key);
          const verified = await verifier
            .verify(token)
          req.oidcPayload=payload;
          req.user=undefined;
          next()
        } catch (err) {
          console.error(err);
          res.status(401)
          next(new Error('Invalid Tocken'));
        }
      }
    }
  }
}

async function middlware_express_oidc (req,res,next) {


}
module.exports = getMiddlwareExpressOidc
