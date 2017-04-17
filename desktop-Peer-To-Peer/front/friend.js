var addFriendList = document.getElementById("stylist");
var searchBar = document.getElementById("search");

var xhr = new XMLHttpRequest();


const {ipcRenderer} = require('electron');


//addFriendList.style.display = "none";


searchBar.addEventListener("blur", function() {


              xhr.open('POST', ' http://127.0.0.1:8001/code');
              xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
              xhr.onload = function() {

                    console.log(xhr.response);
                    var parsedJSON = JSON.parse(xhr.response);
                    var code = parsedJSON.code;
                    console.log(`code ${code}`);

                                var urlCode = searchBar.value;


                                xhr.open('POST', 'https://'+urlCode+'.ngrok.io');
                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                xhr.onload = function() {

                                          if ( xhr.status === 200 ) {



                                                  searchBar.style.borderColor = "#4cbbd6";
                                                  console.log(xhr.response);
                                                  var parsedJSON = JSON.parse(xhr.response);
                                                  var username = parsedJSON.code;
                                                  console.log(`username ${username}`);

                                                  var result = `<ul><li><p><a href="#"><img class="users" src="../media/online.png" draggable="false"></a>${username}<a href="#"><img id="add" class="add" src="../media/add.png" draggable="false"></a><p></li>`;

                                                  addFriendList.innerHTML = result;

                                                  var add = document.getElementById("add");

                                                  add.addEventListener("click", function() {



                                                    xhr.open('POST','https://'+urlCode+'.ngrok.io');
                                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                                                    xhr.onload = function() {


                                                                      if ( xhr.status === 200  ) {

                                                                        var parsedJSON = JSON.parse(xhr.response);
                                                                        var usernameCode = parsedJSON.code;


                                                                        xhr.open('POST','http://127.0.0.1:8001/add');
                                                                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                                                                        xhr.onload = function() {

                                                                          if ( xhr.status === 200 ) {

                                                                              window.location.reload(true);

                                                                          }



                                                                      };

                                                                      xhr.send(encodeURI("localadd="+usernameCode));

                                                              }
                                                    };
                                                    xhr.send(encodeURI("add="+code));


                                                  });
                                          }

                                };
                                xhr.send(encodeURI(`searchFriend=true`));



              };

              xhr.send(encodeURI(`code`));



});
