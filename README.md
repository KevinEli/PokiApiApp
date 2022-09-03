# PokiApiApp
It's an Application that consumes an external API using Node.js, Serverless and DynamoDB 

Steps to start the app in a local enviroment
 - npm install (to install all app dependencies)
 - npm start (to start serveless offline. Note: the app needs a DynamoDB connection, but you can try the pokemonType endpoint: /dev/pokemonType/{Type} )
 - npm run deploy (to deploy the app to aws. Note: you must have configured you aws credential)
