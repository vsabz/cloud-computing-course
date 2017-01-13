var express = require('express');
var app = express();
var fs = require("fs");
var hashes = require('hashes');
//var urlOfStatsProvider = 'http://35.156.150.201:8081';
var urlOfStatsProvider = 'http://141.40.254.66:8083';
//var urlOfStatsProvider = 'http://35.157.10.24:8081';
var request = require("request");
var jsonfile = require('jsonfile');



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




var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));


app.post('/', function(req, res) {
    // First read existing users.
    	  var stats;
		  var final;
    	  var packages = {};
        var packageID = 0;
        var pavkageKey;
	var queryid = req.body.queryid;

        timeStart = new Date();
        timestampMsg["EventName"] = String("USER REQUEST");
        timestampMsg["TimeStamp"] = String(timeStart.getMilliseconds());
        timestampMsg["QueryID"] =  String(queryid);
        timestampMsg["AdditionalInfo"]=JSON.stringify("uniName");
        RecordTimeStamp(timestampMsg);

	packages["QueryID"] = queryid;
        for (var i = 0; i < req.body.graduates.length; i++) {
            //graduates += JSON.stringify(data['graduates'][i])
            packageKey = req.body.graduates[i]['University'] + '_' +
                req.body.graduates[i]['Specialty'] + '_' +
                req.body.graduates[i]['LofE'] + '_' +
                req.body.graduates[i]['Sex'] + '_' +
                req.body.graduates[i]['YofG'];
            var graduate = {};

            graduate.firstName = req.body.graduates[i]['FirstName'];
            graduate.lastName = req.body.graduates[i]['LastName'];
            graduate.middleName = req.body.graduates[i]['MiddleName'];
            graduate.birth = req.body.graduates[i]['DOB'];
            var graduates = [];
            if (!packages[packageKey]) {
                packages[packageKey] = {};
                packages[packageKey].packageUniqueID = packageKey;
                packages[packageKey].universityCode = req.body.graduates[i]['University'];
                packages[packageKey].specialty = req.body.graduates[i]['Specialty'];
                packages[packageKey].levelOfEducation = req.body.graduates[i]['LofE'];
                packages[packageKey].sex = req.body.graduates[i]['Sex'];
                packages[packageKey].yearOfEducation = req.body.graduates[i]['YofG'];
                packages[packageKey].graduates = [];
            }
            packages[packageKey].graduates.push(graduate);
           // console.log(JSON.stringify(packages));
	   if(!fs.existsSync(packageKey)){
		var file = '/packages/' + packageKey + '.json';
		jsonfile.writeFileSync(file, packages[packageKey]);	
           }


        }
        //console.log(JSON.stringify(packages));
        
        /*
        Object.keys(packages).forEach(function(key, index) {
            console.log('key');
            console.log(JSON.stringify(packages[key]));
            console.log('\n');
            console.log('\n');
            console.log('\n');
            fs.writeFile("packages/" + key + ".json", JSON.stringify(packages[key]), function(err) {
                if (err) return console.log(err);
            });
        });
*/
        console.log("------------------Start of request to  " + urlOfStatsProvider + " ----------------");
        console.log(JSON.stringify(packages));
        console.log("------------------End of request to  " + urlOfStatsProvider + " ----------------");

//	req.end();

        // fire request
        request({
                url: urlOfStatsProvider,
                method: "POST",
                json: true,
                headers: {
                    "content-type": "application/json",
                },
                body: packages
            }, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log("------------------Start of response from  " + urlOfStatsProvider + " ----------------");
                    console.log(JSON.stringify(body));
                    console.log("------------------End of response from " + urlOfStatsProvider + "   ----------------");
                    //send data from Application 1
                    //requestApp('merges packages and packages','http://127.0.0.1:8092', "POST", body);

                    //console.log("-------------------------------------------old value of stats : " + stats);
                    stats = body;
                    //console.log("-------------------------------------------new value of stats : " + JSON.stringify(stats));
                    //data = body;
                    //res.end(JSON.stringify(stats));




                    // fire request

                    request({
                        url: 'http://222.222.222.223:8092',
                        method: "POST",
                        json: true,
                        headers: {
                            "content-type": "application/json",
                        },
                        body: stats
                    }, function(error, response, body) {
                        if (!error && response.statusCode === 200) {
                            console.log("------------------Start of response from  " + 'http://127.0.0.1:8092' + " ----------------");
                            console.log(body);
                            console.log("------------------End of response from " + 'http://127.0.0.1:8092' + "   ----------------");
                            //send data from Application 1
                            //requestApp('merges packages and packages','http://127.0.0.1:8092', "POST", body);
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




                } else {

                    console.log("error: " + error)
                    console.log("response.statusCode: " + response.statusCode)
                    console.log("response.statusText: " + response.statusText)
                }


        timeStart = new Date();
        timestampMsg["EventName"] = String("USER REQUEST");
        timestampMsg["TimeStamp"] = String(timeStart.getMilliseconds());
        timestampMsg["QueryID"] =  String(queryid);
        timestampMsg["AdditionalInfo"]=JSON.stringify("uniName");
        RecordTimeStamp(timestampMsg);


                //stats = JSON.stringify(stats);
                //console.log("double check" + stats);		
                //requestApp('merges packages and packages','http://127.0.0.1:8092', "POST", data);
                //console.log("will be sent as a response" + JSON.stringify(data));
                //console.log("-----------------------------------------------------final" + JSON.stringify(final));

                //res.end(JSON.stringify(final));

            })
            //end of request


})

var server = app.listen(8082, function() {

    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)

})




