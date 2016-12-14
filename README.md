neoCaster
=========
This is a typescript project for forecasting near earth objects and sending relaying that information over the Amazon Echo.

###Installation
1. If you don't already have it install node: I suggest [NVM](https://github.com/creationix/nvm)
1. Install typescript compiler tsc: npm install -g tsc
1. Install typescript definitions: npm install -g tsd
1. If you don't already have it install gulp: npm install -g gulp
1. If you don't already have ava: npm install --global ava
1. If you don't already have coffee-script: npm install -g coffee-script
1. Then run: npm install
1. tsd install the following type definitions: node express request body-parser
1. Optionally install Atom with the atom-typescript package...you can also use any other ide you want

###Build and Deploy
1. run ./createDeployment
1. then upload release/neoCaster.zip to lambda manager
