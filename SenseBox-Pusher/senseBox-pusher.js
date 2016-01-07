var requestify = require('requestify');
var async = require('async');
var fs = require('fs');

var url = "http://opensensemap.org:8000";
var senseBoxId = "568e38d0b3de1fe005202a9c";
var sensorIds = [
    {
        "name": "lat",
        "id": "568e38d0b3de1fe005202aa2"
    }, {
        "name": "lng",
        "id": "568e38d0b3de1fe005202aa3"
    }, {
        "name": "alt",
        "id": "568e38d0b3de1fe005202aa1"
    }, {
        "name": "vibration",
        "id": "568e38d0b3de1fe005202a9e"
    }, {
        "name": "sound",
        "id": "568e38d0b3de1fe005202a9f"
    }, {
        "name": "light",
        "id": "568e38d0b3de1fe005202aa0"
    }
];

var data;
fs.readFile('data.json', 'utf8', function (err, content) {
  if (err) throw err;
  data = JSON.parse(content);
  console.log(data.length);
  sendMeasurements(data);
});


function sendMeasurements(data) {
    async.forEachOf(data, function (object, key, callback) {
        async.parallel([
            function(callback){

                requestify.post(url + "/boxes/" + senseBoxId + "/" + sensorIds[0].id, {
                        value: String(object.lat)
                })
                .then(function(response) {
                    //response.getBody();
                    callback();
                });
            },
            function(callback){
                requestify.post(url + "/boxes/" + senseBoxId + "/" + sensorIds[1].id, {
                        value: String(object.lon)
                })
                .then(function(response) {
                    //response.getBody();
                    callback();
                });
            },
            function(callback){
                requestify.post(url + "/boxes/" + senseBoxId + "/" + sensorIds[2].id, {
                        "value": String(object.altitude)
                })
                .then(function(response) {
                    //response.getBody();
                    callback();
                });
            },
            function(callback){
                requestify.post(url + "/boxes/" + senseBoxId + "/" + sensorIds[3].id, {
                        "value": String(object.vibration)
                })
                .then(function(response) {
                    //response.getBody();
                    callback();
                });
            },
            function(callback){
                requestify.post(url + "/boxes/" + senseBoxId + "/" + sensorIds[4].id, {
                        "value": String(object.sound)
                })
                .then(function(response) {
                    //response.getBody();
                    callback();
                });
            },
            function(callback){
                requestify.post(url + "/boxes/" + senseBoxId + "/" + sensorIds[5].id, {
                        "value": String(object.brightness)
                })
                .then(function(response) {
                    //response.getBody();
                    callback();
                });
            }
        ],
        function(err, results){
            callback();
        });
    }, function (err) {
        console.log("FINISHED!");
    });
};
