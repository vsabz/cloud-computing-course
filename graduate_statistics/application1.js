// Application-1 server code

// Imports
var express = require('express');
var app = express();
var request = require('request');
var mysql = require('mysql');
var body_parser = require('body-parser');


// Port on which Server is running
const PORT=9000;


// Variable for the Timestamp generation
var timestampMsg = {
    "AppID": "App1",                  // App<ID>-<subID>
    "QueryID": "0",                   // unique query id
    "EventName":"0",
    "TimeStamp": "0",                 // timestamp
    "AdditionalInfo":"0"
};

var micromonURL = "http://ec2-52-32-122-176.us-west-2.compute.amazonaws.com:8172/";

var connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: 'password',
database: 'graduate'});
connection.connect();


// Record the TIME STAMP
function RecordTimeStamp(TimestampMsg)
{
    /**
     * Inserting to Timestamp
     */
    request(
            {
                url: micromonURL,
                method: "POST",
                json: true,
                headers: {
                    "Content-type": "application/json",
                },
                body: (TimestampMsg)
            },
	function callback(error, response) {
                if (error) {
                    console.error(error);
                }
            });
}


app.use(express.static(__dirname + '/public'));
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));


// For GET requests we dont do anything
app.get("/get1", function(req, res){

        var user = req.body;
	console.log(user);
	res.send("Hello from register");
});


// POST request is handled by our Server
app.post("/graduate", function(req, res){
	var user = req.body;
	console.log(user);
        var name = user.university[0].Name;
        console.log(name);
        // Inserting the Timestamp
        timeStart = new Date();
        timestampMsg["EventName"] = String("USER REQUEST");
        timestampMsg["TimeStamp"] = String(timeStart.getMilliseconds());
        timestampMsg["QueryID"] =  String("query1") ;
        timestampMsg["AdditionalInfo"]=JSON.stringify(name);
        
        // Recording Timestamp before the execution of our Query
        RecordTimeStamp(timestampMsg);
        var query = "SELECT CONCAT(FirstName, LastName, MiddleName) AS ID,FirstName, LastName,MiddleName,DOB,DocuCode,University,Specialty,LofE,Sex,YofG FROM graduate WHERE University='"+name+"'";
        connection.query(query , function(err, rows, fields){
        if (!err){
                console.log("RESULT", rows);
                if  (rows.length == 0){
			res.json({"graduates": []});
		} else {
                //console.log(JSON.stringify(rows));
                var jsonresult = {"graduates": rows};
                res.json(jsonresult);
		}
        timeStop = new Date();
        timestampMsg["EventName"] = String("USER REQUEST_FINISHED");
        timestampMsg["TimeStamp"] = String(timeStop.getMilliseconds());
        timestampMsg["QueryID"] =  String("query1") ;
        timestampMsg["AdditionalInfo"]=JSON.stringify(query);
        
        // Recording Timestamp after the execution of our Query
        RecordTimeStamp(timestampMsg);
        }
        else{
		console.log(req.body);
                console.log("ERROR");
        }

});
});

app.listen(PORT);
console.log('Server listening on http://localhost:9000');
