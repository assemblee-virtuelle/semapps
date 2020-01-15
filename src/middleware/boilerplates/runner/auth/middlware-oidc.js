const base64url = require('base64url');
const jose = require('node-jose');
const E = require("moleculer-web").Errors;

class MiddlwareOidc {
  constructor(options) {
    this.options = options;
  }
  async middlwareOidc(req, res) {
    return new Promise(async (resolve,reject)=>{
      if (req.headers.authorization == undefined) {
        reject(new Error('Missing Bearer Token'))
      } else {
        var token = req.headers.authorization.split(' ')[1];
        if (token == null || token == undefined || token == 'null') {
          reject(new Error('Missing Bearer Token'))
        } else {
          var components = token.split('.');
          var header = JSON.parse(base64url.decode(components[0]));
          var payload = JSON.parse(base64url.decode(components[1]));
          var signature = components[2];
          try {
            let publicKey = '-----BEGIN PUBLIC KEY-----' + this.options.public_key + '-----END PUBLIC KEY-----';
            const key = await jose.JWK.asKey(publicKey, 'pem');
            const verifier = jose.JWS.createVerify(key);
            const verified = await verifier.verify(token);
            resolve({
              oidcPayload : payload,
              user : undefined
            })
          } catch (err) {
            console.error(err);
            reject(new Error('Invalid Tocken'))
          }
        }
      }
    })
  }
  getMiddlwareMoleculerOidc() {
    return async (ctx,route, req, res) =>{
      try {
        let info  = await this.middlwareOidc(req, res);
        ctx.meta.user = info.user;
        ctx.meta.oidcPayload = info.oidcPayload;
        return Promise.resolve(ctx);
      } catch (err) {
        console.log('OIDC KO');
        return Promise.reject(new E.UnAuthorizedError(err));
      }
    }
  }
  getMiddlwareExpressOidc() {
    return (req, res, next)=> {
      this.middlwareOidc(req, res).then(info=>{
        // console.log(info);
        req.oidcPayload = info.oidcPayload;
        req.user = info.user;
        next();
      }).catch(err=>{
        res.status(401);
        next(err);
      });
    }
  }
}

module.exports = MiddlwareOidc;
