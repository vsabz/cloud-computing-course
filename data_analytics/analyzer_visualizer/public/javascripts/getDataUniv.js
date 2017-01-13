/**
 * Created by ansjin on 11/28/2016.
 */
//var io = require('socket.io');
function Comparator(a, b) {
    if (a[1] > b[1]) return -1;
    if (a[1] < b[1]) return 1;
    return 0;
}


var socket = io.connect("/");
/*Initializing the connection with the server via websockets */
socket.on("message",function(message){
    /*
     When server(app4.js) sends data to the client it will trigger this function
     */
    console.log("Message From the server App4 arrived")
    univData = JSON.parse(message);
    // console.log(univData); /*converting the data into JS object */

    // Now use of D3 library to make the chart
    makeChart(univData);
    for(i=0;i<8;i++)
    document.getElementsByClassName("loader")[i].style.display="none";

    document.getElementById("barChart").style.display="block";
    document.getElementById("bachelorRate").style.display="block";
    document.getElementById("femaleRate").style.display="block";
    document.getElementById("maleRate").style.display="block";
    document.getElementById("MasterAvgSalary").style.display="block";
    document.getElementById("BachelorAvgSalary").style.display="block";
    document.getElementById("masterPie").style.display="block";
    document.getElementById("bachelorPie").style.display="block";

});

/*function to send the univ name to app4 which formwards it to app2*/
function getData(univName)
{
    for(i=0;i<8;i++)
    document.getElementsByClassName("loader")[i].style.display="block";

    document.getElementById("barChart").style.display="none";
    document.getElementById("bachelorRate").style.display="none";
    document.getElementById("femaleRate").style.display="none";
    document.getElementById("maleRate").style.display="none";
    document.getElementById("MasterAvgSalary").style.display="none";
    document.getElementById("BachelorAvgSalary").style.display="none";
    document.getElementById("masterPie").style.display="none";
    document.getElementById("bachelorPie").style.display="none";
    var data =
    {
        /*creating a Js ojbect to be sent to the server*/
        univ:univName /*getting the text input data      */
    }
    /*University name sent to application 4 which forwards it to application 4 in jason format*/
    socket.send(JSON.stringify(data));
}

function makeBarChartMasterRate(univData)
{

    data1 = []
    for (var x in univData){
        data1.push([univData[x].major, univData[x].m_emp_rate])
        if (x==19)
            break;
    }
    data1 = data1.sort(Comparator);

    Highcharts.chart('barChart', {
        chart: {
            type: 'bar',
            marginLeft: 150
        },
        title: {
            text: 'Master Employment Rate'
        },
        xAxis: {
            type: 'category',
            title: {
                text: null
            },
            min: 0,
            max: 6,
            scrollbar: {
                enabled: true
            },
            tickLength: 0
        },
        yAxis: {
            min: 0,
            max: 300,
            title: {
                text: 'Rates',
                align: 'high'
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Rates',
            data: data1,
            color: '#45C2A0',
        }]
    });

}


function makeBarChartBachelorRate(univData) {

    data1 = []
    for (var x in univData) {
        data1.push([univData[x].major, univData[x].b_emp_rate])
        if (x == 19)
            break;
    }
    data1 = data1.sort(Comparator);

    Highcharts.chart('bachelorRate', {
        chart: {
            type: 'bar',
            marginLeft: 150
        },
        title: {
            text: 'Bachelor Employment Rate'
        },
        xAxis: {
            type: 'category',
            title: {
                text: null
            },
            min: 0,
            max: 6,
            scrollbar: {
                enabled: true
            },
            tickLength: 0
        },
        yAxis: {
            min: 0,
            max: 300,
            title: {
                text: 'Rates',
                align: 'high'
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Rates',
            data: data1,
            color: "#D2B48C",
        }]
    });
}

function makeBarChartFemaleRate(univData) {

    femaleMaster = []
    femaleBachelor = []
    majorList = []

    for (var x in univData) {

        femaleMaster.push([univData[x].major, univData[x].female_master])
        femaleBachelor.push([univData[x].major, univData[x].female_bachelor])
        majorList.push(univData[x].major)

        if (x == 19)
            break;

    }

    console.log(majorList)

    Highcharts.chart('femaleRate', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Female Employment Rate'
        },
        xAxis: {
            categories: majorList,
            min: 0,
            max: 6,
            scrollbar: {
                enabled: true
            },
            tickLength: 0
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Female Employment Rate'
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'Master',
            data: femaleMaster,
            color: "#E8839D",
        }, {
            name: 'Bachelor',
            data: femaleBachelor,
            color: '#2E2A2B'
        }
        ]
    });

}

function makeBarChartMaleRate(univData) {

    maleMaster = []
    maleBachelor = []
    majorList = []

    for (var x in univData) {

        maleMaster.push([univData[x].major, univData[x].male_master])
        maleBachelor.push([univData[x].major, univData[x].male_bachelor])
        majorList.push(univData[x].major)

        if (x == 19)
            break;

    }

    console.log(majorList)

    Highcharts.chart('maleRate', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Male Employment Rate'
        },
        xAxis: {
            categories: majorList,
            min: 0,
            max: 6,
            scrollbar: {
                enabled: true
            },
            tickLength: 0
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Male Employment Rate'
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'Master',
            data: maleMaster
        }, {
            name: 'Bachelor',
            data: maleBachelor,
            color: "#2E2A2B"
        }
        ]
    });

}


function makeBarChartMasterAvgSalary(univData){

    maleAvgSalary = []
    femaleAvgSalary = []

    majorList = []

    for (var x in univData) {

        maleAvgSalary.push([univData[x].major, univData[x].maleAvgSalaryMaster])
        femaleAvgSalary.push([univData[x].major, univData[x].femaleAvgSalaryMaster])
        majorList.push(univData[x].major)

        if (x == 19)
            break;

    }

    Highcharts.chart('MasterAvgSalary', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Average Master Salary'
        },
        xAxis: {
            categories: majorList,
            min: 0,
            max: 6,
            scrollbar: {
                enabled: true
            },
            tickLength: 0
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Average Master Salary'
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'Male Salary',
            data: maleAvgSalary
        }, {
            name: 'Female Salary',
            data: femaleAvgSalary
        }]
    });

}

function makeBarChartBachelorAvgSalary(univData){

    maleAvgSalary = []
    femaleAvgSalary = []

    majorList = []

    for (var x in univData) {

        maleAvgSalary.push([univData[x].major, univData[x].maleAvgSalaryBachelor])
        femaleAvgSalary.push([univData[x].major, univData[x].femaleAvgSalaryBachelor])
        majorList.push(univData[x].major)

        if (x == 19)
            break;

    }

    Highcharts.chart('BachelorAvgSalary', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Average Bachelor Salary'
        },
        xAxis: {
            categories: majorList,
            min: 0,
            max: 6,
            scrollbar: {
                enabled: true
            },
            tickLength: 0
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Average Bachelor Salary'
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'Male Salary',
            data: maleAvgSalary
        }, {
            name: 'Female Salary',
            data: femaleAvgSalary
        }]
    });

}



function makeMasterPie(){

    master = []

    for (var x in univData) {

        master.push({"name":univData[x].major, "y":univData[x].master})

        if (x == 19)
            break;

    }

    // Build the chart
    Highcharts.chart('masterPie', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Master Students per Major'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Fields',
            colorByPoint: true,
            data: master
        }]
    });
}



function makeBachelorPie(){

    bachelor = []

    for (var x in univData) {

        bachelor.push({"name":univData[x].major, "y":univData[x].bachelor})

        if (x == 19)
            break;

    }

    // Build the chart
    Highcharts.chart('bachelorPie', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Bachelor Students per Major'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Fields',
            colorByPoint: true,
            data: bachelor
        }]
    });

}



/*function to make chart using D3.js on the analyzed data received from app4*/z
function makeChart(univData)
{
    //d3.selectAll("svg > *").remove();

    makeBarChartMasterRate(univData);
    makeBarChartBachelorRate(univData);
    makeBarChartFemaleRate(univData);
    makeBarChartMaleRate(univData);
    makeBarChartMasterAvgSalary(univData);
    makeBarChartBachelorAvgSalary(univData);
    makeMasterPie(univData);
    makeBachelorPie(univData);

}