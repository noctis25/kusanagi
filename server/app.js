//Setup express server
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

//Grab Jikan API
const Jikan = require('jikan-node');
const mal = new Jikan();

// Create body parser
const bodyParser = require('body-parser')

//Create multer for multi-part/form-data
const multer = require('multer');
var upload = multer(); 

// to support JSON-encoded bodies 
app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({})); 

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

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

mal.search('anime','fullmetal alchemist', {limit: 1})
    .then(search => baga = search)
    .catch(err => console.log(err));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({express: items});
});

app.post("/inputData", (req, res) => {
  
  var params = {
    TableName: 'anime',
    Item: {
      'id' : {N: '3'},
      "url": {S: req.body.url},
     "image_url":{S: req.body.image_url},
     "title":{S: req.body.title},
     "synopsis": {S: req.body.synopsis}
    }
  };
  
   res.send("recieved your request!");
   //Write req.body to database
   ddb.putItem(params, function(err, data) {
     if (err) {
       console.log("Error", err);
     } else {
       console.log("Success", data);
     }
   });
});