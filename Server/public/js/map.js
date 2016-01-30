"use strict"

// MAP
$( document ).ready(function() {


    // INIT
    L.mapbox.accessToken = getMapboxAccessToken();
    var map = L.mapbox.map('map').setView([51.961298, 7.625849], 14);

    L.control.layers({
        'Streets': L.mapbox.tileLayer('mapbox.streets').addTo(map),
        'Satellite': L.mapbox.tileLayer('mapbox.satellite'),
        'Light': L.mapbox.tileLayer('mapbox.light')
    }).addTo(map);

    var boxes = [];
    var markers = [];
    requestData();


    // MAP-FUNCTION
    map.on('zoomend', function() {
        console.log(map.getZoom());
        if (map.getZoom() >= 14) {
            map.featureLayer.setFilter(function() { return true; });
        } else {
            map.featureLayer.setFilter(function() { return false; });
        }
    });


    // REQUEST DATA FROM API
    function requestData(){

        $.ajax({
            url: getURL() + "/boxes",
            global: false,
            type: 'GET',
            async: false,
            success: function(data) {
                boxes = data;
                boxes.forEach(function (box, key) {
                    $.ajax({
                        url: getURL() + "/boxes/" + box._id + "/tracks",
                        global: false,
                        type: 'GET',
                        async: false,
                        success: function(data) {
                            box.tracks = data;
                            box.tracks.forEach(function (track, key) {
                                $.ajax({
                                    url: getURL() + "/boxes/" + box._id + "/tracks/" + track._id + "/measurements",
                                    global: false,
                                    type: 'GET',
                                    async: false,
                                    success: function(data) {
                                        track.measurements = data;
                                    }
                                });
                            });
                        }
                    });
                });
                drawMarkers();
            }
        });
    }

    //

    //var geoJsonLayer = L.geoJson(rodents1);
    /*

    var geoJsonFeature = rodents1;
    var geoJsonLayer = L.geoJson(rodents1);

    var map = L.mapbox.map('map','mapbox.streets')
        .setView([42.35,-71.08],13);

    markers.addLayer(geoJsonLayer);
    map.addLayer(markers);
    */



    function drawMarkers() {

        var geoJsonFeatures = [];

        boxes.forEach(function (box, key) {
            box.tracks.forEach(function (track, key) {

                track.measurements.forEach(function (measurement, key) {

                    geoJsonFeatures.push(
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [
                                    measurement.lng, measurement.lat,
                                ]
                            },
                            'properties': {
                                'title': '<h5><span class="label label-warning">' + box._id + '</span> <small>BoxId</small></h5>' +
                                    '<h5><span class="label label-success">' + track._id + '</span> <small>TrackId</small></h5>',
                                'description': '<div class="panel panel-default"><table class="table table-striped">' +
                                    '<tr><th>Longitude</th><td>' + measurement.lng + '</td></tr>' +
                                    '<tr><th>Latitude</th><td>' + measurement.lat + '</td></tr>' +
                                    '<tr><th>Altitude</th><td>' + measurement.altitude + '</td></tr>' +
                                    '<tr><th>Speed</th><td>' + measurement.speed + '</td></tr>' +
                                    '<tr><th>Vibration</th><td>' + measurement.vibration + '</td></tr>' +
                                    '<tr><th>Sound</th><td>' + measurement.sound + '</td></tr>' +
                                    '<tr><th>Brightness</th><td>' + measurement.brightness + '</td></tr>' +
                                    '<tr><th>IR</th><td>' + measurement.ir + '</td></tr>' +
                                    '<tr><th>UV</th><td>' + measurement.uv + '</td></tr>' +
                                    '</table></div>',
                                'icon': {
                                    'iconUrl': calcRoadCondition(measurement.speed, measurement.vibration),
                                    'iconSize': [12, 12], // size of the icon
                                    'iconAnchor': [6, 6], // point of the icon which will correspond to marker's location
                                    'popupAnchor': [0, -6], // point from which the popup should open relative to the iconAnchor
                                    'className': 'dot'
                                }
                            }
                        }
                    );
                });
            });
        });

        var myLayer = L.mapbox.featureLayer().addTo(map);
        myLayer.on('layeradd', function(e) {
            var marker = e.layer;
            var feature = marker.feature;
            marker.setIcon(L.icon(feature.properties.icon));
        });

        // Add features to the map
        myLayer.setGeoJSON(geoJsonFeatures);
    };

    /*
        Function to calculate the condition of the road based on the measured parameters
        Returns the icon corresponding to the calculated road condition
    */
    function calcRoadCondition(speed, vibration) {
        var icon;

        if (speed > 15 && vibration < 1.2 && vibration > 0.8) {
            // Perfect Cycling Road
            icon = '/img/circle_green.png';
        } else {
            // Horrible Cycling Road
            icon = '/img/circle_red.png';
        }

        return icon;
    }

});
