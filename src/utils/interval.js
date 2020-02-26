const request = require('request');

setIntervalRequest = () => {

  var requestLoop = setInterval(function(){
    request({
        url: "https://orion-visitar.herokuapp.com/",
        method: "GET",
        timeout: 10000,
        followRedirect: true
    },function(error, response, body){
        if(!error && response.statusCode == 200){
            console.log('Request to https://orion-visitar.herokuapp.com/ Successful');
        }else{
            console.log('error' + response.statusCode);
        }
    });
  }, 5000);

}

module.exports = setIntervalRequest;
