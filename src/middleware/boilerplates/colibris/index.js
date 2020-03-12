const { ServiceBroker } = require('moleculer');
const createServices = require('./createServices');
const configureExpress = require('./configureExpress');

const broker = new ServiceBroker();

createServices(broker);
const app = configureExpress(broker);

broker
  .start()
  .then(() => {
    app.listen(3000, err => {
      if (err) {
        console.error(err);
      } else {
        console.log('Listening on port 3000');

        // Start REPL mode, which allows to send commands through the CLI
        broker.repl();
      }
    });
  });
