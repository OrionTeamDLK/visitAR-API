const request = require('request');

const forecast = (lat, long, callback) =>{

  const url = 'https://api.darksky.net/forecast/4de22a7bcd5bc93068d743f8c8b64224/'+lat+','+long+'?units=si';

  request(
    {
      url,
      json:true
    }, (error, {body}) => {

      if(error){
        callback('Cannot Connect to Whether api');
      } else if(body.error){
        callback('API error. Check HTTP data');
        callback(body.error);
      } else{
        callback(undefined, body.daily.data[0].summary + " It is currently " + body.currently.temperature + " degrees with "+ body.currently.precipProbability + "% Chance of rain");
      }
  });
}

module.exports = forecast;
