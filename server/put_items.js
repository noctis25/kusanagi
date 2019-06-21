// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var params = {
  TableName: 'anime',
  Item: {
    'id' : {N: '1'},
    "url": {S: "https://myanimelist.net/anime/5114/Fullmetal_Alchemist__Brotherhood"},
   "image_url":{S: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg?s=faffcb677a5eacd17bf761edd78bfb3f"},
   "title":{S: "Fullmetal Alchemist: Brotherhood"},
   "synopsis": {S: "In order for something to be obtained, something of equal value must be lost. Alchemy is bound by this Law of Equivalent Exchange—something the young brothers Edward and Alphonse Elric only realize..."}
  }
};

// Call DynamoDB to add the item to the table
ddb.putItem(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});