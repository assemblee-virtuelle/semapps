const delay = t => new Promise(resolve => setTimeout(resolve, t));

const fetchVoidEndpoints = config => {
  return new Promise(resolve => {
    const fetchArray = Object.values(config.dataServers).map(server => config.httpClient(new URL('/.well-known/void', 'https://' + server.domain)));
    Promise.all([delay(5000)]).then(values => {
      console.log('fetchVoidEndpoints resolved');
      // Process all data received and put them in the config
      config.containers = { hello: 'world' };
      resolve();
    });
  });
}

export default fetchVoidEndpoints;
