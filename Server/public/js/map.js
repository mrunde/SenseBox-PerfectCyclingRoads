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
                            properties: {
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
                                    '</table></div>'/*,
                                    'marker-size': 'large',
                                    'marker-color': '#FF3300',
                                    'marker-symbol': 'circle'*/
                            }
                        }
                    );

                    /*
                    L.mapbox.featureLayer(
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [
                                    measurement.lng, measurement.lat,
                                ]
                            },
                            properties: {
                                'title': '<h5><span class="label label-warning">' + box._id + '</span> <small>BoxId</small></h5>' +
                                    '<h5><span class="label label-success">' + track._id + '</span> <small>TrackId</small></h5>',
                                'description': '<table>' +
                                    '<tr><th>Longitude</th><td><kbd>' + measurement.lng + '</kbd></td></tr>' +
                                    '<tr><th>Latitude</th><td><kbd>' + measurement.lat + '</kbd></td></tr>' +
                                    '<tr><th>Altitude</th><td><kbd>' + measurement.altitude + '</kbd></td></tr>' +
                                    '<tr><th>Speed</th><td><kbd>' + measurement.speed + '</kbd></td></tr>' +
                                    '<tr><th>Vibration</th><td><kbd>' + measurement.vibration + '</kbd></td></tr>' +
                                    '<tr><th>Sound</th><td><kbd>' + measurement.sound + '</kbd></td></tr>' +
                                    '<tr><th>Brightness</th><td><kbd>' + measurement.brightness + '</kbd></td></tr>' +
                                    '<tr><th>IR</th><td><kbd>' + measurement.ir + '</kbd></td></tr>' +
                                    '<tr><th>UV</th><td><kbd>' + measurement.uv + '</kbd></td></tr>' +
                                    '</table>'/*,
                                    'marker-size': 'large',
                                    'marker-color': '#FF3300',
                                    'marker-symbol': 'circle'
                            }
                        }, {
                            pointToLayer: function(feature, latlon) {
                                return L.circleMarker(latlon, {
                                    fillColor: '#FF3300',
                                    radius: 5,
                                    weight: 1,
                                    color: '#FF3300',
                                    opacity: 1,
                                    fillOpacity: 0.8
                                });
                            }
                        }
                    ).addTo(map);*/
                });
            });
        });

        L.mapbox.featureLayer(geoJsonFeatures,
            {
                pointToLayer: function(feature, latlon) {
                    return L.circleMarker(latlon, {
                        fillColor: '#FF3300',
                        radius: 5,
                        weight: 1,
                        color: '#FF3300',
                        opacity: 1,
                        fillOpacity: 0.8
                    });
                }
            }
        ).addTo(map);
    };

});
