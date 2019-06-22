//Setup express server
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

//Grab Jikan API
const Jikan = require('jikan-node');
const mal = new Jikan();

//Setup AWS
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

//Unmarshaller for dynamo
const unmarshalItem = require('dynamodb-marshaler').unmarshalItem;

//Items to hold dynamo items
let items = [];

//db scan
let data = ddb.scan({
  TableName: 'anime'
}, function(err, data) {
  items = data.Items.map(unmarshalItem);
  console.log(items); 
});

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
let baga = '';


//Sample jikan api search
mal.search('anime','fullmetal alchemist', {limit: 5})
    .then(search => baga = search)
    .catch(err => console.log(err));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({express: items});
});
