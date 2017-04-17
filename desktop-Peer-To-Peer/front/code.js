var codevalue = document.getElementById("codevalue");

var xhr = new XMLHttpRequest();


window.addEventListener("load", function() {

  xhr.open('POST', 'http://127.0.0.1:8001/code');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {

        console.log(xhr.response);
        var parsedJSON = JSON.parse(xhr.response);
        codevalue.innerText = parsedJSON.code;

  };

  xhr.send(encodeURI(`code=code`));


});
