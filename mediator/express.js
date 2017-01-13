var express = require('express');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
var jsonParser = bodyParser.json();
var app = express();
//var urlOfGraduatesProvider = "http://54.213.254.220:9000/graduate";
//var urlOfGraduatesProvider = 'http://141.40.254.102:9000/graduate';
var urlOfGraduatesProvider = 'http://10.155.208.23:9000/graduate';
//var urlOfGraduatesProvider = "http://141.40.254.66:8081";
//var timestampIP = "http://141.40.254.66:8081";
var request = require("request")
//console.log(here);


// *** Time Stamp ***

var timestampMsg = {
    "AppID": "App2",                  
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



app.use(bodyParser.json());


// wait for POST request
app.post('/', function(req, res) {
	var grads;
	var final;

    var JSONarray = [];


    //res.type('application/json');
    //Iterate through JSON
    for (var i = 0; i < req.body.universities.length; i++) {
        // extract University names
        console.log('vvhghgfghfghf');
        var university = req.body.universities[i].Name;
	var qid = req.body.queryId;

        // build JSON object for each uni and add to array
        //var jObject = ('{\"university\":[{\"Name\":\"' + university + '\"}]}');
	var jObject = {"queryid":qid,"university":[{"Name":university}]};
        JSONarray.push(jObject);
        //console.log(jObject);
    }

    //res.type('application/json');
	
    // go through JSON array and send to app 1
    for (var i = 0; i < JSONarray.length; i++) {
        //console.log("Request " + i);
        console.log(JSONarray[i]);

        // Start Express TimeStamp when request received from App4
        timeStart = new Date();
        timestampMsg["EventName"] = String("USER REQUEST");
        timestampMsg["TimeStamp"] = String(timeStart.getMilliseconds());
        timestampMsg["QueryID"] =  String(JSONarray[i].queryid);
        timestampMsg["AdditionalInfo"]=JSON.stringify("uniName");
        RecordTimeStamp(timestampMsg);

        // fire request
        request({
            url: urlOfGraduatesProvider,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: JSONarray[i]
        }, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("------------------Start of responce from  " + urlOfGraduatesProvider + " ----------------");
//                console.log(JSON.stringify(body))
                console.log("------------------End of responce from " + urlOfGraduatesProvider + "   ----------------");
                //send data from Application 1
                //requestApp('creates packages from graduates','http://127.0.0.1:8082', "POST", body);
					 //console.log(JSON.stringify(final));               
                //res.end(JSON.stringify(final));
					 grads = {"queryid":qid,"graduates":body.graduates};
console.log(JSON.stringify(grads));

					//fire request 




					// fire request

                    request({
                        url: 'http://222.222.222.222:8082',
                        method: "POST",
                        json: true,
                        headers: {
                            "content-type": "application/json",
                        },
                        body: grads
                    }, function(error, response, body) {
                        if (!error && response.statusCode === 200) {
                            console.log("------------------Start of response from  " + 'http://127.0.0.1:8082' + " ----------------");
                            console.log(body);
                            console.log("------------------End of response from " + 'http://127.0.0.1:8082' + "   ----------------");
                            //console.log("-----------------------------------------------------received" + JSON.stringify(body));
                            final = body;
                            //console.log("-----------------------------------------------------final" + JSON.stringify(final));

                            //data = body;
                            //console.log("I send responce now. It contains:" + JSON.stringify(final))
                            res.end(JSON.stringify(body));
                        } else {

                            console.log("error: " + error)
                            console.log("response.statusCode: " + response.statusCode)
                            console.log("response.statusText: " + response.statusText)
                        }
                    })

                    //end of request





					//end request


            } else {

                console.log("error: " + error)
                console.log("response.statusCode: " + response.statusCode)
                console.log("response.statusText: " + response.statusText)
            }

        })
		//end of request

	// END TimeStamp every time when UniName is being send to App1
        timeStart = new Date();
        timestampMsg["EventName"] = String("App2_Time_Stamp");
        timestampMsg["TimeStamp"] = String(timeStart.getMilliseconds());
        timestampMsg["QueryID"] =  String(JSONarray[i].queryid);
        timestampMsg["AdditionalInfo"]=JSON.stringify("uniName");
        RecordTimeStamp(timestampMsg);

    } // for

});




app.listen(3001, function() {
    console.log('Listening on port 3001')
});




// ----------------------------------------------- SEND TIMESTAMP
//	var timestampReq  = {"AppID":"2.1","QueryID":"q1","EventName":"express","TimeStamp":"asdasdasdadd"};
//
//console.log(timestampReq);
//
//	 request({
//            url: timestampIP,
//            method: "POST",
//            json: true,
//            headers: {
//                "content-type": "application/json",
//            },
//            body: JSON.stringify(timestampReq)
//        }, function(error, response, body) {
//
//});
