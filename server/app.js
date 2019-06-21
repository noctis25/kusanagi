const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const Jikan = require('jikan-node');
const mal = new Jikan();
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});
const unmarshalItem = require('dynamodb-marshaler').unmarshalItem;

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const params = {
  TableName: 'anime',
  Key: {
    'id': {N: '1'}
  }
};

let akira = [];

// Call DynamoDB to read the item from the table
ddb.getItem(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    akira.push(data.Item);
   // console.log("Success", data.Item);
  }
});

let data = ddb.scan({
  TableName: 'anime'
}, function(err, data) {
  // data.Items = [{username: {S: 'nackjicholson'}]
  let items = data.Items.map(unmarshalItem);
  console.log(items); // [{username: 'nackjicholson'}]
});

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
let baga = '';


mal.search('anime','fullmetal alchemist', {limit: 5})
    .then(search => baga = search)
    .catch(err => console.log(err));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({express: akira});
});

//todo - load your own shit and then send to aws db