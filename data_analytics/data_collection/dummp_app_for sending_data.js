var io = require('socket.io').listen(3013);

io.sockets.on('connection', function (socket) {
    /*sending data to the client , this triggers a message event at the client side */
    console.log('app2 Connection with the app4 established');

    socket.on("message",function(data){
        data = JSON.parse(data);
        console.log(data);
          if(data.universities[0].name == 'TUM')
          {
             var data_to_server1 =
                 {
                     "stats": [

                         {
                             "packageID": "John",
                             "universityCode": "Doe",
                             "specialty": "Doe",
                             "levelOfEducation": "Doe",
                             "sex": "Doe",
                             "yearOfGraduation": "Doe",
                             "numberOfPersons": "Doe",
                             "numberOfEmployedPersons": "Doe",
                             "notFoundPersons": "Doe",
                             "avarageSalary": "Doe"
                         }
                     ]
                 }

              console.log(data_to_server1);
            socket.send(JSON.stringify(data_to_server1));
          }
          else {
              var data_to_server1 =
                  {
                      "stats": [

                          {
                              "packageID": "John",
                              "universityCode": "Doe",
                              "specialty": "Doe",
                              "levelOfEducation": "Doe",
                              "sex": "Doe",
                              "yearOfGraduation": "Doe",
                              "numberOfPersons": "Doe",
                              "numberOfEmployedPersons": "Doe",
                              "notFoundPersons": "Doe",
                              "avarageSalary": "Doe"
                          }
                      ]
                  }

                console.log(data_to_server1);
            socket.send(JSON.stringify(data_to_server1));

          }

        
        
        });
    });
