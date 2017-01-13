var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


//require node modules (see package.json)
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
var app2io  = require('socket.io-client');
var app2    = app2io.connect('http://141.40.254.66:3001');

//var url='mongodb://ec2-35-163-138-71.us-west-2.compute.amazonaws.com:27017/app4';
//var url='mongodb://127.0.0.1:27017/app4';
var url='mongodb://mongo/app4';
var request = require('request')

var urls = ["http://141.40.254.66:3001"]


MongoClient.connect(url, function (err, db)
{
    if (err) throw err;

    console.log("Connected to Database");
    fetchData();

    var timer = setInterval(fetchData, 1000000)
});

/*get the universites names functionn*/
function fetchData() 
{
     MongoClient.connect(url, function (err, db)
    {
       
          // Get the documents collection 
          var collection = db.collection('universities');
          // Find all documents
          collection.find({}).toArray(function(err, univNames)
          {
              if(err)
                  console.log(err);

              for(var i = 0; i < 2; i++)
              {
                  var uniCode=univNames[i].university_code;

                  var data =
                      {
                          "universities":
                              [
                                  {"Name":uniCode},
                              ]
                      }

                    console.log(data);
                  // changing to http request
                   //app2.send(JSON.stringify(data));

                  urls.forEach(function(urld)
                  {
                      request({url:urld,
                          method:"POST",
                          json: true,
                          headers:
                              {
                              "Content-type": "application/json",
                          },
                          body: data
                      }, function callback(error, response)
                      {
                          console.log("Response for "+url);
                          if(error)
                          {
                              console.error(error);
                          }else
                          {
                              console.log(response.body);
                              console.log("statusCode: "+response.statusCode);
                              console.log("body.length: ", response.body.length + " bytes \n");
                              //insert record
                              MongoClient.connect(url, function (err, db)
                              {
				                          if (err) throw err;
                                  var univData = (response.body);
                                  console.log(univData);
                                  // db.collection('app4').update ({ univ_name: "TUM" },univData,{ upsert: true }, function (err, records) {

                                  var collectionN=univData[0].universityCode;
                                  //::::::::::::::Temp fix::::::::::::::
                                  db.collection(collectionN).drop();
                                  //::::::::::::::Temp fix::::::::::::::
                                  db.collection(collectionN).insert (univData, function (err, records)
                                  {
                                      if (err) throw err;
                                      console.log("Record added as " + records);
                                  });
                                  db.close();
                              });
                          }
                      })
                  })

              }
            });
            //db.close();
      });
}
//not used
/*  invoked when app2 sends back data*/
app2.on("message", function (data)
{

    console.log("Message from the App2 arrived");
    
 
   //insert record
    MongoClient.connect(url, function (err, db)
    {
          var univData = JSON.parse(data);
            console.log(univData);
       // db.collection('app4').update ({ univ_name: "TUM" },univData,{ upsert: true }, function (err, records) {

       var collectionN=univData.stats[0].universityCode;
        //::::::::::::::Temp fix::::::::::::::
        db.collection(collectionN).drop();
        //::::::::::::::Temp fix::::::::::::::
        db.collection(collectionN).insert (univData, function (err, records) {
            if (err) throw err;
            console.log("Record added as " + records);
        });
        db.close();
    });
});
