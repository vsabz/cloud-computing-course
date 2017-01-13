var express = require('express');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

var jsonParser = bodyParser.json();
var app = express();
var request = require("request")


// *** Time Stamp ***
var timestampMsg = {
    "AppID": "App1",                  
    "QueryID": "0",                       
    "EventName":"0",
    "TimeStamp": "0",                  
    "AdditionalInfo":"0"
};
var timeStart = 0;
var timeStop = 0;
var micromonURL = ["http://ec2-52-32-122-176.us-west-2.compute.amazonaws.com:8172/addevent"];

function RecordTimeStamp(TimestampMsg)
{    
  micromonURL.forEach(function (urld)
  {
    request(
            {
                url: urld,
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
  });
}
// *** ***

app.use(bodyParser.json({limit: '50mb'}));

app.post('/', function(req, res) {
			var mergedArray = [];
			var app2JSON;

        //Iterate through JSON
        for (var i = 0; i <= req.body.stats.length; i++) {
            //otherwise responde is sent first
            if (i == req.body.stats.length) {

                console.log(i);
                //console.log("now send the response" + JSON.stringify(mergedArray));
                res.end(JSON.stringify(mergedArray));
            } else {
                //console.log(i);

                var app3JSON = req.body.stats[i];
                console.log("------------------" + i + " th stat ----------------------------------");
		console.log(app3JSON);
                console.log('\n');
		console.log("--------------------------------------------------------------");

                /* 
                   reading json from that has been created by app 2 
                   to merge it with the response received from app 3
                */
                var fileName = "/packages/" + app3JSON.packageID; // or packageUniqueID
		
                var jsonfile = require('jsonfile');
                var file = fileName + '.json'
                console.log("---filename----" + file);
		app2JSON = jsonfile.readFileSync(file);


        // Start Time Stamp
        timeStart = new Date();
        timestampMsg["EventName"] = String("USER REQUEST");
        timestampMsg["TimeStamp"] = String(timeStart.getMilliseconds());
        timestampMsg["QueryID"] =  String(app2JSON.QueryID);
        timestampMsg["AdditionalInfo"]=JSON.stringify("uniName");
        RecordTimeStamp(timestampMsg);


		

                // deleting to avoide duplicates in merged json		
                delete app3JSON.packageID;
                delete app3JSON.numberOfPersons;
                var extend = require('util')._extend;
		
                console.log("------------------" + i + " th util ----------------------------------");
                console.log(extend);
                console.log('\n');
                console.log("--------------------------------------------------------------");

		
                
                var temp = extend({}, app3JSON);
                
		
                console.log("------------------" + i + " th temp ----------------------------------");
                console.log(temp);
                console.log('\n');
                console.log("--------------------------------------------------------------");



		var mergedJSON = extend(temp, app2JSON);
		//console.log("---------------------- mergedJSON -------------");
                mergedArray.push(mergedJSON);


	        // End Time Stamp
        	timeStart = new Date();
	        timestampMsg["EventName"] = String("USER REQUEST");
        	timestampMsg["TimeStamp"] = String(timeStart.getMilliseconds());
	        timestampMsg["QueryID"] =  String(app2JSON.QueryID);
        	timestampMsg["AdditionalInfo"]=JSON.stringify("uniName");
        	RecordTimeStamp(timestampMsg);

		//console.log("-----------------------------------------------");
                //console.log("mergedArr");
                console.log(JSON.stringify(mergedJSON));

            }

        } // for


    }) // post

// fire request
/*request({
url: '',
method: "POST",
json: true,
headers: {
   "content-type": "application/json",
},
body: JSON.stringify(mergedArray)
}, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        console.log(body)
    }
    else{
        console.log("error: " + error)
        console.log("response.statusCode: " + response.statusCode)
        console.log("response.statusText: " + response.statusText)
        }
})
*/

app.listen(8092, function() {
    console.log('Listening on port 8092')
});
