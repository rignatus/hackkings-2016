const http = require('http');
const express = require('express');
const twilio = require('twilio');
const NodeGeocoder = require('node-geocoder');
const accountSid = 'AC6b9e3a7c4494b8bf80e008d49482e328';
const authToken = '1cf0a996afedf7d3d39552009d84737e';
const bodyParser = require('body-parser');
const toiletData = require("./damnFiles.json");
const _ = require('lodash')
// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);
const app = express();
var options = {
	provider: 'google',
	httpAdapter: 'https',
	apiKey: 'AIzaSyDyu1KPfoVIOWfH1pBuO4M1f-huFypT-nQ',
}
var geocoder = NodeGeocoder(options);
app.use(bodyParser());
app.post('/', (req, res) => {
  
  const twiml = new twilio.TwimlResponse();
  const location = req.body.Body;
  var toiletLongitude = 0;
  geocoder.geocode(location + ", London")
	  .then(function(result) {
	  	
	    const userLatitude = result[0].latitude;
	    const userLongitude = result[0].longitude;
	    var suggestedToilet = "";
	    var suggestedToilets = [];
	    var distances = [];
	    //toiletLongitude = toiletData[element].coordinates[0];
	    var minimumDistance = 3;
	    toiletData.forEach(function(element){
	    	toiletLongitude = element.coordinates[0];
	    	toiletLatitude = element.coordinates[1];
	    	var R = 6371; // Radius of the earth in km
  			var dLat = deg2rad(userLatitude-toiletLatitude);  // deg2rad below
  			var dLon = deg2rad(userLongitude-toiletLongitude); 
  			var a = 
    			Math.sin(dLat/2) * Math.sin(dLat/2) +
    			Math.cos(deg2rad(toiletLatitude)) * Math.cos(deg2rad(userLatitude)) * 
    			Math.sin(dLon/2) * Math.sin(dLon/2)
    		; 
  			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  			var d = R * c; // Distance in km
            if(d < minimumDistance) {
            	minimumDistance = d;
            	distances.push(minimumDistance)
            	suggestedToilets.push(element.name);
            	suggestedToilet = suggestedToilets[suggestedToilets.length - 1];
            }
	    })


	    //const closest = (distances.length)-1;
	    //const eta = (distances[closest]/5) * 60;
	    var eta = (minimumDistance/5)*60;
	    twiml.message("Nearest toilet at: " + suggestedToilet + " " + "Distance: " + minimumDistance + "KM, ETA:" + eta);
		res.writeHead(200, {'Content-Type': 'text/xml'});
		res.end(twiml.toString());
	    //console.log(res.longitude);
	  })
	  .catch(function(err) {
	    console.log(err);
  });
  
});
const deg2rad = (deg) => {
	return deg * (Math.PI/180)
}
http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});

