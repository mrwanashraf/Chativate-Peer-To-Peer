var me = document.getElementById("me");
var friendList = document.getElementById("left-bottom");
var defaultChat = document.getElementById("middle-top");
var friendInfo = document.getElementById("right");
var textBox = document.getElementById("textBox");
var send = document.getElementById("send");
var form = document.getElementById("form");
var middle = document.getElementById("middle");

const {ipcRenderer} = require('electron');

var xhr = new XMLHttpRequest();



var chattingWith = null;
var meToken = null;

form.style.display = "";





me.addEventListener("click", function() {

    window.location.href = "me.html";

});


window.addEventListener("load", function() {


            xhr.open('POST', 'http://127.0.0.1:8001/code');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {

                  console.log(xhr.response);
                  var parsedJSON = JSON.parse(xhr.response);
                  var code = parsedJSON.code;
                  console.log(code);





                                xhr.open('POST', 'http://127.0.0.1:8001/friendList');
                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                xhr.onload = function() {

                                    if ( xhr.status === 200 ) {

                                          //console.log("200 OK");

                                          var response = JSON.parse(xhr.response);


                                          //console.log(response);



                                          for ( var i = 0; i < response.length; i++ ) {



                                                var username = response[i];

                                                var result = `<p class="online-text"><img class="usericon" src="../media/online.png" draggable="false">${username}<canvas class="circle online"></canvas><p>`;

                                                friendList.innerHTML  += result;

                                          }


                                          var p = friendList.getElementsByTagName("p");



                                          for ( var j = 0; j < p.length; j++ ) {

                                                (function(){

                                                              var innerText = p[j].innerText;
                                                              //console.log(innerText);
                                                              var text = p[j].getElementsByClassName("online-text");
                                                              var usericon = p[j].getElementsByClassName("usericon");
                                                              var circleonline = p[j].getElementsByClassName("circle online");

                                                              //console.log(text);
                                                              //console.log(usericon);
                                                              //console.log(circleonline);


                                                              p[j].addEventListener("click", function() {


                                                                      defaultChat.innerText = "";
                                                                      form.style.display = "";
                                                                      var content = `<img src="../media/user.png" draggable="false"><p>${innerText}</p><canvas class="circle selected"></canvas><div class="removeblock"><input class="remove" type="image" src="../media/remove.png" draggable="false"></div>`;
                                                                      console.log(innerText);
                                                                      friendInfo.innerHTML = content;

                                                                      chattingWith = innerText;

                                                                      console.log(friendInfo);



                                                                      var remove = friendInfo.getElementsByClassName("remove");

                                                                      var info = friendInfo.getElementsByClassName("info");




                                                                      for ( var h = 0; h < remove.length; h++ ) {

                                                                            remove[h].addEventListener("click", function() {

                                                                                  console.log(`remove ${chattingWith}`);
                                                                                  xhr.open('POST', 'http://127.0.0.1:8001/remove');
                                                                                  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                                                  xhr.onload = function() {
                                                                                        if ( xhr.status === 200 ) {


                                                                                                    xhr.open('POST', `https://${chattingWith}.ngrok.io`);
                                                                                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                                                                    xhr.onload = function() {

                                                                                                          if ( xhr.status === 200 ) {

                                                                                                               window.location.reload(true);

                                                                                                          }

                                                                                                    };
                                                                                                    xhr.send(encodeURI(`removeName=${code}`));


                                                                                                }

                                                                                             };







                                                                                  xhr.send(encodeURI(`username=${chattingWith}`));
                                                                            });

                                                                      }


                                                                      socket = io.connect('https://'+chattingWith+'.ngrok.io', {secure: true});

                                                                      socket.emit("join", {'sender': code});

                                                                      socket2 = io.connect('http://127.0.0.1:8000/');

                                                                      socket2.emit("join", {'sender': code});

                                                                      socket2.on("msged", function(data) {



                                                                                    defaultChat.innerHTML += `<p class="userchat">${data.sender}: ${data.msg}</p>`;


                                                                                  defaultChat.scrollTop = defaultChat.scrollHeight; // to scroll down when the DOM is updated with text.



                                                                      });


                                                                      socket.on("msgedBy", function(data) {


                                                                                defaultChat.innerHTML += `<p>${data.sender}: ${data.msg}</p>`;


                                                                                defaultChat.scrollTop = defaultChat.scrollHeight; // to scroll down when the DOM is updated with text.

                                                                                socket.disconnect();
                                                                      });


                                                                      send.addEventListener("click", function() {



                                                                            socket.emit("private", {'msg': textBox.value, 'sendingTo': chattingWith, 'sender': code});
                                                                            textBox.value = "";

                                                                      });





                                                              });



                                                }());

                                          }


                                    }

                                    else if ( xhr.status === 406 ) {

                                          //console.log("406 NOT ACCEPTABLE");


                                    }


                                };


                                xhr.send(encodeURI(`friendList=friendlist`));

            };

            xhr.send(encodeURI(`code=code`));







            });






form.addEventListener("submit", function(event) {

        event.preventDefault();

});
