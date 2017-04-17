var fs = require('fs');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var app2 = express();
var ngrok = require('ngrok');

var code = null;
var friendList = [];

var httpServer = http.createServer(app).listen(8000, function() {


    console.log("I'm listening on port 8000, http://127.0.0.1:8000/");




    ngrok.connect(8000, function (err, url) {

            console.log(url);
            code = url.slice(8, url.length - 9);
            console.log(code);
    });

});

var localhost = http.createServer(app2).listen(8001, function() {

      console.log("I'm listening on port 8001, http://127.0.0.1:8001/");

});

var io = require('socket.io')(httpServer);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app2.use(bodyParser.urlencoded({ extended: true }));
app2.use(bodyParser.json());

 app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app2.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});

app.get('/', function(req,res) {

      res.send("hello world");


});

app.post('/', function(req,res) {

      var msg = req.body.msg;
      var searchFriend = req.body.searchFriend;
      var add = req.body.add;
      var removeName = req.body.removeName;

      if ( msg ) {

          console.log(msg);

      }

      if ( searchFriend ) {

            //  if ( addFriend === code ) {

                  //  res.status(406).end();
              //}
              //else {

                    console.log(searchFriend);
                    res.status(200).json({'code': code}).end();

              //}


      }

      if ( add  ) {


          friendList.push(add);
          console.log(friendList);
          res.status(200).json({'code': code}).end();

      }


      if ( removeName ) {

            var index = friendList.indexOf(removeName);

            if (index > -1) {

                  friendList.splice(index, 1);
                  res.status(200).end();
            }
      }

});

app2.post('/code', function(req,res) {

        console.log(`code ${code}`);
        res.status(200).json({'code': code}).end();

});


app2.post('/add', function(req,res) {

    var username = req.body.localadd;

    console.log("username "+username);
    friendList.push(username);
    console.log(friendList);
    res.status(200).end();

});


app2.post('/friendList', function(req,res) {

      res.status(200).send(friendList);
});

app2.post('/remove', function(req, res) {

        var username = req.body.username;

        var index = friendList.indexOf(username);

        if (index > -1) {

              friendList.splice(index, 1);
              res.status(200).end();
        }

});


io.on('connection', function(socket) {


      socket.on("join", function(data) {




          if (  data.sender.length > 0 ) {



                      socket.join(data.sender);


                      socket.on("private", function(data) {

                            socket.in(data.sendingTo).emit("msged", {msg: data.msg, sender: data.sender});
                            socket.emit("msgedBy", {msg: data.msg, sender: data.sender});


                      });






          }




      });





});
