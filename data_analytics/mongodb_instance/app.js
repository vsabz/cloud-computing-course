var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//app.use(bodyParser.json());

//app.use(bodyParser.urlencoded({ extended: true }));

var fs = require('fs');
var univNamesData;

fs.readFile('univdata.json', 'utf8', function (err, data) {
    if (err) throw err;
    univNamesData = JSON.parse(data);
    //console.log(univNamesData);
    //console.log(JSON.stringify(univNamesData));
    console.log(univNamesData);
    //require node modules (see package.json)
    var MongoClient = require('mongodb').MongoClient, format = require('util').format;

    //before running this please start mongodb
    var url = 'mongodb://localhost:27017/app4';
    // var url = 'mongodb://mongo/app4';
    MongoClient.connect(url, function (err, db)
    {
        if (err) throw err;

        console.log("Connected to Database");
        var collectionN='universities';
        if(db.collection(collectionN)!="undefined")
        {
           db.collection(collectionN).drop();
        }
         
        //insertUnivName
        db.collection(collectionN).insert (univNamesData, function (err, records)
        {
                if (err) throw err;
                console.log("Univversity Names Record added as " + records);
                db.close();
                

        });

    });
});

fs.readFile('AA.json', 'utf8', function (err, data) {
    if (err) throw err;
    aaUni = JSON.parse(data);
    //console.log(univNamesData);
    //console.log(JSON.stringify(univNamesData));
    console.log(aaUni);
    //require node modules (see package.json)
    var MongoClient = require('mongodb').MongoClient, format = require('util').format;

    //before running this please start mongodb
    var url = 'mongodb://localhost:27017/app4';
    // var url = 'mongodb://mongo/app4';
    MongoClient.connect(url, function (err, db)
    {
        if (err) throw err;

        console.log("Connected to Database");
        var collectionN='AA';
        if(db.collection(collectionN)!="undefined")
        {
            db.collection(collectionN).drop();
        }

        //insertUnivName
        db.collection(collectionN).insert (aaUni, function (err, records)
        {
            if (err) throw err;
            console.log("AA Record added as " + records);
            db.close();


        });

    });
});

