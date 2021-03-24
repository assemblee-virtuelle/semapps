const http = require('http');
const querystring = require('querystring');
const CONFIG = require('../config');

function doRequest(options) {
  let query = {};
  query[options.endpoint] = options.sparql;
  let postData = querystring.stringify(query);
  let opts = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Accept: 'application/sparql-results+json'
    },
    method: 'POST',
    auth: options.auth
  };
  if (options.jsonld) opts.headers.Accept = 'application/ld+json';
  if (options.user) opts.headers['X-SemappsUser'] = options.user;

  return new Promise((resolve, reject) => {
    let str = '';
    let response;
    let req = http.request(CONFIG.SPARQL_ENDPOINT + CONFIG.MAIN_DATASET + '/' + options.endpoint, opts, res => {
      res.on('data', chunk => {
        str += chunk;
      });
      res.on('end', () => {
        response.body = str;
        if (response.statusCode == 200)
          try {
            response.body = JSON.parse(str);
          } catch (e) {
            console.error('Invalid JSON')
          }

        resolve(response);
      });
      res.on('error', err => {
        reject(err);
      });
    });
    req.on('response', res => {
      response = res;
    });
    req.on('error', err => {
      reject(err);
    });
    req.write(postData);
    req.end();
  });
}

module.exports = doRequest;
