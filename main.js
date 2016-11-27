const http = require('http');
const express = require('express');
const twilio = require('twilio');
const NodeGeocoder = require('node-geocoder');
const accountSid = 'AC6b9e3a7c4494b8bf80e008d49482e328';
const authToken = '1cf0a996afedf7d3d39552009d84737e';
const bodyParser = require('body-parser');
const toiletData = require("./damnFiles.json");
const _ = require('lodash')
const request = require('request')
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
  var toiletLatitude = 0;
  var userLatitude = 0;
  var userLongitude = 0;
  var walkingDirections = '';
  var directions = [];
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
	    const suggestionLessThan1 = ['Pretty sure you\'ll make it, we believe in you!',
	                                  'Today is your lucky day!',
	                                  'Having second thoughts about that 4th Pint now, are we?',
	                                  'Maybe you\'ll think twice before downing another plate of curry now.']
	    const suggestionGreatThan1 = ['Run like your life depends on it!',
	                                 'You might make it, might not.',
	                                 'We are sure you would be able to explain this to your boss.',
	                                 'I hope you learn a lesson from this.']
	    if(minimumDistance > 1) {
	    	twiml.message("Nearest toilet at: " + suggestedToilet + " " + "Distance: " + minimumDistance.toFixed(3) + "KM, ETA:" + eta.toFixed(1) +
	    		         " minutes." + random(suggestionGreatThan1));
	    }
	    else {
	    	twiml.message("Nearest toilet at: " + suggestedToilet + " " + "Distance: " + minimumDistance.toFixed(3) + "KM, ETA:" + eta.toFixed(1) +
	    		         " minutes." + random(suggestionLessThan1));
	    }
	    request('https://maps.googleapis.com/maps/api/directions/json?origin=' + location + '&destination=' + toiletLatitude +"," + toiletLongitude+'&mode=walking&key=AIzaSyDyu1KPfoVIOWfH1pBuO4M1f-huFypT-nQ', function(error, response, body){
	    	 if (!error && response.statusCode == 200) {
    			//var directions = JSON.parse(body['routes']);
    			var obj = JSON.parse(body);
    			directions = obj.routes[0].legs[0].steps;
    			directions.forEach(function(element){
    				var instructions = element.html_instructions
    				instructions = instructions.replace(/(<([^>]+)>)/ig,"");
    				twiml.message("Directions:" + instructions + ", " + element.distance.text);
    					
    			})
    			res.writeHead(200, {'Content-Type': 'text/xml'});
				res.end(twiml.toString());

  			}
	    })

	    

	    
	    
	    
		
	    //console.log(res.longitude);
	  })
	  .catch(function(err) {
	    console.log(err);
  });
  
  
});
const deg2rad = (deg) => {
	return deg * (Math.PI/180)
}
const random = array => { return array[Math.floor(Math.random() * array.length)] }

/** var getDirections = (userLatitude, userLongitude, toiletLongitude, toiletLatitude) {
	https://maps.googleapis.com/maps/api/directions/json?origin=' + str(latitude) + ',' + str(longitude) + '&destination=' + str(destination) + '&mode=walking'
} **/
http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});

