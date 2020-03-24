'use strict';

const inquirer = require('inquirer');

async function start() {
  let allAnswers = await inquirer.prompt([{
    type: 'list',
    name: 'middlewareTemplate',
    message: "What template do you want to use for the middleware?",
    choices: ['LDP', 'ActivityPub', 'Solid POD']
  },
  {
    type: 'confirm',
    name: 'includeDms',
    message: "Do you need to install a data management system?",
    default: true
  },
  {
    type: 'confirm',
    name: 'localJena',
    message: "Do you need to install a local instance of Jena?",
    default: true
  }]);

  if( !allAnswers.localJena ) {
    const answers = await inquirer.prompt({
      type: 'input',
      name: 'distantJenaUrl',
      message: "What is the URL of your distant Jena instance?",
    });

    allAnswers = { ...allAnswers, ...answers};
  }

  console.log('Résultats', allAnswers);
}

start();