/********************************************//**
 *    app.js
 *    Purpose: Runs the main program
 *
 *    @author Anshul and Spyros
 *    @version 1.0
 ***********************************************/



/********************************************//**
 *          Imports
 ***********************************************/
var express = require('express');
var app = express();
var app4 = require('http').createServer(app);
var io = require('socket.io').listen(app4);
var path = require('path');
var net = require('net');
var d3 = require("d3");
var bodyParser = require('body-parser');


/********************************************//**
 *          Path Variables
 ***********************************************/
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, 'views')));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views'));
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * initializing the websockets communication/*
 */
app4.listen(3012);
app4io = io.listen(app4);

/********************************************//**
 *          Global Variables
 ***********************************************/
var timestampMsg = {
    "AppID": "App4",                  // App<ID>-<subID>
    "QueryID": "0",                       // unique query id
    "EventName":"0",
    "TimeStamp": "0",                  // timestamp
    "AdditionalInfo":"0"
};
var timeStart = 0;
var timeStop = 0;
var app4SocketSaved;
var defaultDate = new Date("1970/01/01");
/**
 *  for debugging and other optional flags
 */
var de = true; // true when debugging
var logging =true;
function bug( msg ){console.log(msg); }
var mongoEn=false;
/**
 *  for Connectinng with mongoDB if using other wise disable this
 */
if(mongoEn)
{
    // var url = 'mongodb://ec2-35-167-181-24.us-west-2.compute.amazonaws.com:27017/app4';
    /*For local enable below*/
    var url='mongodb://35.167.222.142:27017/app4';
    //using the docker mongo container
    //var url='mongodb://localhost/app4';
    //require node modules (see package.json)
    var MongoClient = require('mongodb').MongoClient, format = require('util').format;
}
else
{
    var app2url = ["http://141.40.254.66:3001"]
    var request = require('request')
}
function RecordTimeStamp( TimestampMsg)
{
    if(logging==true)
    {
    /**
     * Inserting to Timestamp SErver
     */
    var timestampServerUrl = ["http://ec2-52-32-122-176.us-west-2.compute.amazonaws.com:8172/addevent"];
    //var msg = {"AppID":"ID-1","QueryID":"q1","EventName":"RegisterStudent","TimeStamp":"23.1","AdditionalInfo":"TUMStudent"};
    de&&bug("Record to add " + JSON.stringify(TimestampMsg));

    timestampServerUrl.forEach(function (urld) {
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
                de && bug("Response for " + urld)
                if (error) {
                    console.error(error);
                }
                else
                de&&bug("Record Added" + JSON.stringify(TimestampMsg));
            })
    });
    }

}
/********************************************//**
 *          Main start
 ***********************************************/
/**
 * Associating the callback function to be executed when client visits the page and
 * websocket connection is made
 */
app4io.sockets.on("connection",function(app4Socket)
{
    de&&bug('App4 Server Connection with the client established')
    /*saving the client information*/
    app4SocketSaved=app4Socket;

    app4Socket.on("message",function(uniName)
    {
        /**
         * This event is triggered at the App4 side when client sends the univName using socket.send() method
         * so start the Timer
         */
        timestampMsg["EventName"] = String("USER REQUEST");
        timestampMsg["TimeStamp"] = String(Math.abs(new Date()-defaultDate));
        timestampMsg["QueryID"] =  String(Math.floor((Math.random() * 1000000) + 1)) ;
        timestampMsg["AdditionalInfo"]=JSON.stringify(uniName);
        //sendAMessage(JSON.stringify(timestampMsg));
         RecordTimeStamp(timestampMsg);
        de&&bug("Start timestamp of Data Analyzer : " + timestampMsg["TimeStamp"])

        /**
         * Parse the university code
         */
        uniName = JSON.parse(uniName);
        uniName = uniName.univ;
        de&&bug(uniName);
/*............................... If no mongo DB is to be used ...........................*/
        if(mongoEn == false)
        {
            /**
             *
             * Form the query as required by app2
             */
            var data =
                {
                    "universities": [
                        {"Name": uniName},
                    ],
                    "queryId": timestampMsg["QueryID"],
                }

            de && bug(data)
            /**
             * Send the uiv name to app2
             */
            timestampMsg["EventName"] = String("SENT REQUEST TO APP2");
            timestampMsg["TimeStamp"] = String(Math.abs(new Date()-defaultDate));
            RecordTimeStamp(timestampMsg);
            app2url.forEach(function (urld) {
                request(
                    {
                        url: urld,
                        method: "POST",
                        json: true,
                        headers: {
                            "Content-type": "application/json",
                        },
                        body: data
                    },
                    function callback(error, response) {
                        de && bug("Response for " + url)
                        if (error) {
                            console.error(error);
                        }
                        else {
                            timestampMsg["EventName"] = String("RECV RESPONSE FROM APP2");
                            timestampMsg["TimeStamp"] = String(Math.abs(new Date()-defaultDate));
                            RecordTimeStamp(timestampMsg);
                            de && bug(response.body)
                            de && bug("statusCode: " + response.statusCode)
                            de && bug("body.length: ", response.body.length + " bytes \n")
                            /**
                             * Get the university data
                             */
                            var univData = (response.body);
                            de && bug(univData)

                            /**
                             * Send the data for analyze
                             */
                            timestampMsg["EventName"] = String("SENT TO ANALYZER");
                            timestampMsg["TimeStamp"] = String(Math.abs(new Date()-defaultDate));
                            RecordTimeStamp(timestampMsg);
                            analyzedUnivData = analyzeData(univData);
                            timestampMsg["EventName"] = String("RECV FROM ANALYZER");
                            timestampMsg["TimeStamp"] = String(Math.abs(new Date()-defaultDate));
                            RecordTimeStamp(timestampMsg);
                            /**
                             * Send back the analyzed data to user
                             */
                            app4SocketSaved.send(JSON.stringify(analyzedUnivData));
                            /**
                             *
                             * Stop the timer
                             */
                            timestampMsg["EventName"] = String("STOP");
                            timestampMsg["TimeStamp"] = String(Math.abs(new Date()-defaultDate));
                            RecordTimeStamp(timestampMsg);
                            // RecordTimeStamp(timestampMsg);
                            de && bug("Stop timestamp of Data Analyzer : " + timestampMsg["TimeStamp"])
                            de && bug("Query ID : " + timestampMsg["QueryID"])



                        }
                    });
            });
        }
/*..............................................................................*/
        else
        {
            /**
             * query to mongodb to fetch the data call the data analyzer and return the analyzed data
             */
            MongoClient.connect(url, function (err, db)
            {
                if (err) throw err;

                de && bug("Connected to Database")
                /**
                 *
                 * Make the univeristy code as the collection Name
                 */
                var collectionN = db.collection(uniName);
                /**
                 * Find the University Data
                 */
                collectionN.find({}).toArray(function (err, univ_data) {
                    if (err) throw err;
                    de && bug("Found the following records")
                    de && bug(univ_data)
                    /**
                     * Analyze the Data
                     */
                    analyzedUnivData = analyzeData(univ_data);
                    /**
                     * Send the analzed Data to user
                     */
                    app4SocketSaved.send(JSON.stringify(analyzedUnivData));

                    /**
                     *
                     * Stop the timer
                     */
                    timestampMsg["EventName"] = String("USER REQUEST_FINISHED");
                    timestampMsg["TimeStamp"] = String(Math.abs(new Date()-defaultDate));
                    RecordTimeStamp(timestampMsg);
                    // RecordTimeStamp(timestampMsg);
                    de && bug("Stop timestamp of Data Analyzer : " + timestampMsg["TimeStamp"]);
                    de && bug("Query ID : " + timestampMsg["QueryID"]);

                });
                //db.close();
            });
        }
    });
});

function analyzeData(aunivData)
{

    /*Data analyzation*/
    var uniqueSpl = {};
    var distinctSpl = [];

    for( var i in aunivData )
    {
        aunivData[i].specialty = aunivData[i].specialty.replace(/\s/g, '');

        if(aunivData[i].levelOfEducation == "Doctorate")
            aunivData[i].levelOfEducation = "PhD";
        else if(aunivData[i].levelOfEducation == "Masters")
            aunivData[i].levelOfEducation = "Master";
        else if(aunivData[i].levelOfEducation == "Bachelors")
            aunivData[i].levelOfEducation = "Bachelor";

        if( typeof(uniqueSpl[aunivData[i].specialty]) == "undefined")
        {
            distinctSpl.push(aunivData[i].specialty);
        }
        uniqueSpl[aunivData[i].specialty] = 0;
    }
    //console.log("aaaaaaaaaaaa");
    //console.log(distinctSpl);

    var analyzedUnivData = [];
    for( var spl in distinctSpl )
    {
        analyzedUnivData[distinctSpl[spl]] =
            {
                "Master": {
                    "numberOfPersons": 0,
                    "numberOfWorkingPersons": 0,
                    "emp_rate": 0,
                    "averageSalary": 0,
                    "Male": {
                        "numberOfPersons": 0,
                        "numberOfWorkingPersons": 0,
                        "emp_rate": 0,
                        "averageSalary": 0

                    },
                    "Female": {
                        "numberOfPersons": 0,
                        "numberOfWorkingPersons": 0,
                        "emp_rate": 0,
                        "averageSalary": 0

                    },
                },
                "Bachelor": {
                    "numberOfPersons": 0,
                    "numberOfWorkingPersons": 0,
                    "emp_rate": 0,
                    "averageSalary": 0,
                    "Male": {
                        "numberOfPersons": 0,
                        "numberOfWorkingPersons": 0,
                        "emp_rate": 0,
                        "averageSalary": 0

                    },
                    "Female": {
                        "numberOfPersons": 0,
                        "numberOfWorkingPersons": 0,
                        "emp_rate": 0,
                        "averageSalary": 0

                    },

                },
                "PhD": {
                    "numberOfPersons": 0,
                    "numberOfWorkingPersons": 0,
                    "emp_rate": 0,
                    "averageSalary": 0,
                    "Male": {
                        "numberOfPersons": 0,
                        "numberOfWorkingPersons": 0,
                        "emp_rate": 0,
                        "averageSalary": 0

                    },
                    "Female": {
                        "numberOfPersons": 0,
                        "numberOfWorkingPersons": 0,
                        "emp_rate": 0,
                        "averageSalary": 0

                    },

                },
                // "Male": {
                //     "numberOfPersons": 0,
                //     "numberOfWorkingPersons": 0,
                //     "emp_rate": 0,
                //     "averageSalary": 0
                //
                // },
                // "Female": {
                //     "numberOfPersons": 0,
                //     "numberOfWorkingPersons": 0,
                //     "emp_rate": 0,
                //     "averageSalary": 0
                //
                // },

            };
    }
    //for debugging this can be enabled
    /*
    console.log(alerts["Informatics"]["Master"]["numberOfPersons"]);
    console.log(alerts);
    console.log(aunivData[0].numberOfPersons);
    */
    for( var uni in aunivData )
    {
        //console.log(aunivData[uni].specialty + " " + aunivData[uni].levelOfEducation);
        //console.log(analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation]);
        analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation]["numberOfPersons"] += (parseInt(aunivData[uni].notFoundPersons)+ parseInt(aunivData[uni].numberOfWorkingPersons));
        analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation]["numberOfWorkingPersons"] += parseInt(aunivData[uni].numberOfWorkingPersons);
        analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation][aunivData[uni].sex]["numberOfPersons"] += (parseInt(aunivData[uni].notFoundPersons)+ parseInt(aunivData[uni].numberOfWorkingPersons));
        analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation][aunivData[uni].sex]["numberOfWorkingPersons"] += parseInt(aunivData[uni].numberOfWorkingPersons);

        analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation][aunivData[uni].sex]["averageSalary"] += parseInt(aunivData[uni].avarageSalary);
        analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation]["averageSalary"] += parseInt(aunivData[uni].avarageSalary);

       // console.log(analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation]["averageSalary"]);

    }
    for( var uni in aunivData )
    {
        var totalNoLvLEducation=parseInt(analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation]["numberOfPersons"]);
        var totalEmployedLvLEducation= parseInt(analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation]["numberOfWorkingPersons"]);

        var totalNoLvLEducationSex=parseInt(analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation][aunivData[uni].sex]["numberOfPersons"]);
        var totalEmployedLvLEducationSex= parseInt(analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation][aunivData[uni].sex]["numberOfWorkingPersons"]);

        var totalAvgSalaryLvLEducationSex = parseInt(analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation][aunivData[uni].sex]["averageSalary"]);
        var totalAvgSalaryLvLEducation = parseInt(analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation]["averageSalary"]);

        analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation]["emp_rate"] = (totalEmployedLvLEducation/totalNoLvLEducation)*100;

        analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation][aunivData[uni].sex]["emp_rate"] = (totalEmployedLvLEducationSex/totalNoLvLEducationSex)*100;

        analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation][aunivData[uni].sex]["averageSalary"] = totalAvgSalaryLvLEducationSex/totalNoLvLEducationSex;
        analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation]["averageSalary"] = totalAvgSalaryLvLEducation/totalNoLvLEducation;

        //console.log(analyzedUnivData[aunivData[uni].specialty][aunivData[uni].levelOfEducation][aunivData[uni].sex]["averageSalary"]);

    }
   // console.log(analyzedUnivData);

    graphData=[];
    for( var spl in distinctSpl )
    {
        Data={
            id: spl+1,
            major: distinctSpl[spl],
            m_emp_rate: analyzedUnivData[distinctSpl[spl]]["Master"]["emp_rate"],
            b_emp_rate: analyzedUnivData[distinctSpl[spl]]["Bachelor"]["emp_rate"],
            master:analyzedUnivData[distinctSpl[spl]]["Master"]["numberOfPersons"],
            bachelor:analyzedUnivData[distinctSpl[spl]]["Bachelor"]["numberOfPersons"],
            male_master:analyzedUnivData[distinctSpl[spl]]["Master"]["Male"]["emp_rate"],
            male_bachelor:analyzedUnivData[distinctSpl[spl]]["Bachelor"]["Male"]["emp_rate"],
            female_master:analyzedUnivData[distinctSpl[spl]]["Master"]["Female"]["emp_rate"],
            female_bachelor:analyzedUnivData[distinctSpl[spl]]["Bachelor"]["Female"]["emp_rate"],
            maleAvgSalaryMaster:analyzedUnivData[distinctSpl[spl]]["Master"]["Male"]["averageSalary"],
            femaleAvgSalaryMaster:analyzedUnivData[distinctSpl[spl]]["Master"]["Female"]["averageSalary"],
            maleAvgSalaryBachelor:analyzedUnivData[distinctSpl[spl]]["Bachelor"]["Male"]["averageSalary"],
            femaleAvgSalaryBachelor:analyzedUnivData[distinctSpl[spl]]["Bachelor"]["Female"]["averageSalary"],
            masterAvgSalary:analyzedUnivData[distinctSpl[spl]]["Master"]["averageSalary"],
            bachelorAvgSalary:analyzedUnivData[distinctSpl[spl]]["Bachelor"]["averageSalary"],

        };
        graphData.push(Data);
    }
    //console.log("Salary");
   // console.log(Data.maleAvgSalaryBachelor);
    return graphData;
}
