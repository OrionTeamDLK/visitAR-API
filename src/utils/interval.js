const request = require('request');

rootRequest = () => {

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

}

rootRequest();

setIntervalRequest = () => {
  var requestLoop = setInterval(function(){
    rootRequest();
  }, 1500000);
}

module.exports = setIntervalRequest;
