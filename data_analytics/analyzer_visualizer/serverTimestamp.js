var net=require('net');
var util=require('util');

var server=net.createServer(function(conn){
    conn.on('connect',function(){
       console.log('Client connected')
    });
    conn.on('data',function(data){
       console.log("Received " + data);
    });
});
server.listen(1337,'127.0.0.1');