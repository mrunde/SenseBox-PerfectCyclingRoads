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

    function drawMarkers() {

        var geoJsonFeatures = [];

        boxes.forEach(function (box, key) {
            box.tracks.forEach(function (track, key) {
                
                // Interpolate the data before the visualization
                track.measurements = interpolate(track.measurements);

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
                                'perfect': isPerfectCondition(measurement.speed, measurement.vibration),
                                'poor': isPoorCondition(measurement.speed, measurement.vibration),
                                'icon': {
                                    'iconUrl': calcRoadConditionIcon(measurement.speed, measurement.vibration),
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

        // Add markers to the map
        var markers = L.mapbox.featureLayer().addTo(map);
        markers.on('layeradd', function(e) {
            var marker = e.layer;
            var feature = marker.feature;
            marker.setIcon(L.icon(feature.properties.icon));
        });
        markers.setGeoJSON(geoJsonFeatures);

        $('.menu-ui a').on('click', function() {
            // For each filter link, get the 'data-filter' attribute value.
            var filter = $(this).data('filter');
            $(this).addClass('active').siblings().removeClass('active');
            markers.setFilter(function(f) {
                // If the data-filter attribute is set to "all", return
                // all (true). Otherwise, filter on markers that have
                // a value set to true based on the filter name.
                return (filter === 'all') ? true : f.properties[filter] === true;
            });
            return false;
        });
    };

    /*
        Function to interpolate the speed and vibration values
    */
    function interpolate(measurements) {
        for (var i = 2; i < measurements.length - 2; i++) {
            var m_2 = measurements[i-2],
                m_1 = measurements[i-1],
                m = measurements[i],
                m1 = measurements[i+1],
                m2 = measurements[i+2];
            measurements[i].speed = (m_2.speed + m_1.speed + m.speed + m1.speed + m2.speed) / 5;
            measurements[i].vibration = (m_2.vibration + m_1.vibration + m.vibration + m1.vibration + m2.vibration) / 5;
        }

        return measurements;
    }

    /*
        Function to calculate the condition of the road based on the measured parameters
        Returns the icon file path
    */
    function calcRoadConditionIcon(speed, vibration) {
        var icon;

        if (speed > 15 && vibration < 1.2 && vibration > 0.8) {
            // Perfect Cycling Road
            icon = '/img/circle_green.png';
        } else {
            // Poor Cycling Road
            icon = '/img/circle_red.png';
        }

        return icon;
    }

    /*
        Function to calculate whether the condition of the road is perfect
        Returns true or false
    */
    function isPerfectCondition(speed, vibration) {
        if (speed > 15 && vibration < 1.2 && vibration > 0.8) {
            // Perfect Cycling Road
            return true;
        } else {
            // Poor Cycling Road
            return false;
        }
    }

    /*
        Function to calculate whether the condition of the road is poor
        Returns true or false
    */
    function isPoorCondition(speed, vibration) {
        if (speed > 15 && vibration < 1.2 && vibration > 0.8) {
            // Perfect Cycling Road
            return false;
        } else {
            // Poor Cycling Road
            return true;
        }
    }

});
