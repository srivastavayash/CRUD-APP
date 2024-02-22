const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const app = express();
const MongoClient = require('mongodb').MongoClient
const url = require('./URL.js');

// MongoClient.connect(url);
const client = new MongoClient(url);
client.connect();
const myDB = client.db('public').collection('friends');

app.get('/user/:name', (req, res) => {
  console.log(req.params);
  myDB.find(req.params).toArray().then(results => {
    console.log(results);
    res.contentType('application/json');
    res.send(JSON.stringify(results));
  })
})

app.use(bodyParser.json());

app.route('/users')
  .get((req, res) => {
    myDB.find().toArray().then(results => {
      console.log(results);
      res.contentType('application/json');
      res.send(JSON.stringify(results));
    })
  })

  .post((req, res) => {
    console.log(req.body);
    myDB.insertOne(req.body).then(results => {
      console.log(results);
      res.contentType('application/json');
      res.send(JSON.stringify(req.body));
    })
  })

  .put((req, res) => {
    console.log(req.body);
    myDB.findOneAndUpdate({ _id:new ObjectId(req.body._id) },
      {
        $set: {
          name: req.body.name,
        }
      },
      {
        upsert: false
      }).then(results => {
        res.contentType('application/json');
        res.send({ 'Status': true });
      })
  })
  
  .delete((req, res) => {
    console.log(req.body);
    myDB.deleteOne({ _id:new ObjectId(req.body._id) }).then(results => {
        let boo=true;
        if(results.deletedCount===0){
           boo:false
        }
        res.send({ "status": boo });
      }).catch(err=>{console.log(err)})
  })

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
})

app.listen(8080, () => {
  console.log('Server ready to response..')
})
