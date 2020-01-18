const request = require('request');

const geocode = (address, callback) => {
  const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ encodeURIComponent(address) + '.json?access_token=pk.eyJ1IjoiY29ybWFjbGV2aW5zIiwiYSI6ImNqdzgydGl4eDBxanU0Nm80cWFtN3VmZWIifQ.UdJ3hcybyN4kve0SnHxMUg&limit=1';

  request( {
    url,
    json:true
  }, (error, {body}) => {

    if(error){

      callback('Cannot Connect to mapbox api');

    } else if(body.message){

      callback(body.message);

    } else if(body.features.length === 0){

      callback('Cannot Find Location');

    } else{

      const lat = body.features[0].center[1];
      const long = body.features[0].center[0];

      callback(undefined, {
        lat: body.features[0].center[1],
        long: body.features[0].center[0],
        location: body.features[0].place_name
      })
    }
  });

}

module.exports = geocode;
