"use strict"

// MAP
$( document ).ready(function() {

    // INIT
    L.mapbox.accessToken = getMapboxAccessToken();
    var map = L.mapbox.map('map').setView([51.961298, 7.625849], 14).addControl(L.mapbox.geocoderControl('mapbox.places'));

    L.control.layers({
        'Dark': L.mapbox.tileLayer('mapbox.dark').addTo(map),
        'Light': L.mapbox.tileLayer('mapbox.light'),
        'Streets': L.mapbox.tileLayer('mapbox.streets'),
        'Satellite': L.mapbox.tileLayer('mapbox.satellite')
    }).addTo(map);

    var boxes = [];
    var markers = [];
    requestData();


    // MAP-FUNCTION
    /*map.on('zoomend', function() {
        // TO-DO - not working
        if (map.getZoom() >= 14) {
            map.featureLayer.setFilter(function() { return true; });
        } else {
            map.featureLayer.setFilter(function() { return false; });
        }
    });*/

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

                                        // Interpolate the data before the visualization
                                        if(getInterpolateState){
                                            track.measurements = interpolate(track.measurements);
                                        }

                                        // Close gaps in series of "perfect" or "poor" road conditions
                                        if(getCloseGapsState) {
                                            track.measurements = closeGaps(track.measurements);
                                        }
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
                                    '<tr><th>Timestamp</th><td>' + measurement.timestamp + '</td></tr>' +
                                    '<tr><th>Longitude</th><td>' + measurement.lng + '</td></tr>' +
                                    '<tr><th>Latitude</th><td>' + measurement.lat + '</td></tr>' +
                                    '<tr><th>Altitude</th><td>' + measurement.altitude + '</td></tr>' +
                                    '<tr><th>Speed</th><td>' + measurement.speed + '</td></tr>' +
                                    '<tr><th>Vibration</th><td>' + measurement.vibration + '</td></tr>' +
                                    '<tr><th>Sound</th><td>' + measurement.sound + '</td></tr>' +
                                    '<tr><th>Luminosity</th><td>' + measurement.luminosity + '</td></tr>' +
                                    '<tr><th>Brightness</th><td>' + measurement.brightness + '</td></tr>' +
                                    '<tr><th>IR</th><td>' + measurement.ir + '</td></tr>' +
                                    '</table></div>',
                                'perfect': isPerfectCondition(measurement.speed, measurement.vibration),
                                'poor': isPoorCondition(measurement.speed, measurement.vibration),
                                'fillColor': calcRoadConditionIcon(measurement.speed, measurement.vibration),
                                'color': calcRoadConditionIcon(measurement.speed, measurement.vibration)
                            }
                        }
                    );
                });
            });
        });

        // Add markers to the map
        var markers = L.mapbox.featureLayer(geoJsonFeatures, {
            pointToLayer: function(feature, latlon) {
                return L.circleMarker(latlon, {
                    radius: 3,
                    fillColor: feature.properties.fillColor,
                    weight: 1,
                    color: feature.properties.color,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        }).addTo(map);

        // Pan the map so that all markers are visible
        map.fitBounds(markers.getBounds());

        // FILTERS
        var filter = 'all';
        updateMarkers(filter);

        $( '#filter_all' ).on('click', function() {
            $( '#filter_all' ).removeClass('btn-default').addClass('btn-primary');
            $( '#filter_perfect' ).removeClass('btn-primary').addClass('btn-default');
            $( '#filter_poor' ).removeClass('btn-primary').addClass('btn-default');
            updateMarkers('all');
        });

        $( '#filter_perfect' ).on('click', function() {
            $( '#filter_all' ).removeClass('btn-primary').addClass('btn-default');
            $( '#filter_perfect' ).removeClass('btn-default').addClass('btn-primary');
            $( '#filter_poor' ).removeClass('btn-primary').addClass('btn-default');
            updateMarkers('perfect');
        });

        $( '#filter_poor' ).on('click', function() {
            $( '#filter_all' ).removeClass('btn-primary').addClass('btn-default');
            $( '#filter_perfect' ).removeClass('btn-primary').addClass('btn-default');
            $( '#filter_poor' ).removeClass('btn-default').addClass('btn-primary');
            updateMarkers('poor');
        });

        // FILTER-FUNCTION
        function updateMarkers(filter) {
            markers.setFilter(function(f) {
                // If the data-filter attribute is set to "all", return
                // all (true). Otherwise, filter on markers that have
                // a value set to true based on the filter name.
                return (filter === 'all') ? true : f.properties[filter] === true;
            });
            return false;
        };

        // MAP REFRESHING
        // ...for new tracks
        $( '#submitTrackButton' ).on('click', function() {
            refreshMap();
        });
        // ...for deleted boxes
        $( '#deleteSensebox' ).on('click', function() {
            refreshMap();
        });
        // ...for deleted tracks (single and all)
        // TODO works only for deleting all tracks so far
        $( '[id^="delete"]' ).each(function() {
            $(this).on('click', function() {
                refreshMap();
            });
        });

        // REFRESH FUNCTION
        function refreshMap() {
            setTimeout(function() {
                map.removeLayer(markers);
                requestData();
            }, 10);
        }
    };

    // INTERPOLATE SPEED AND VIBRATION
    function interpolate(measurements) {
        // Range of the interpolation
        var range = 3;

        // Factors for the interpolation
        // The array must be of the size: (range*2)+1
        var factors = [1, 2, 3, 4, 3, 2, 1];

        // Interpolate the measurements
        for (var i = range; i < measurements.length - range; i++) {
            var interpolSpeed     = 0,
                interpolVibration = 0,
                divider           = 0;

            for (var j = 0; j < range; j++) {
                interpolSpeed     = interpolSpeed + factors[j] * measurements[i-j].speed;
                interpolVibration = interpolVibration + factors[j] * measurements[i-j].vibration;
                divider           = divider + factors[j];
            }

            measurements[i].speed     = interpolSpeed / divider;
            measurements[i].vibration = interpolVibration / divider;
        }

        // Return the interpolated measurements
        return measurements;
    }

    // CLOSE GAPS
    function closeGaps(measurements) {
        // Range of neighbours to observe to close gaps between
        // Range must be greater 0
        var range = 2;

        for (var i = range; i < measurements.length - range; i++) {
            var gap               = true,
                current           = isPerfectCondition(measurements[i].speed, measurements[i].vibration),
                previous          = isPerfectCondition(measurements[i-1].speed, measurements[i-1].vibration),
                next              = isPerfectCondition(measurements[i+1].speed, measurements[i+1].vibration),
                interpolSpeed     = 0,
                interpolVibration = 0;

            // Check whether a gap might exist before running the code
            if (current != previous && current != next) {
                for (var j = -range; j < range && gap; j++) {
                    if (j != 0) {
                        if (current != isPerfectCondition(measurements[i-range].speed, measurements[i-range].vibration)) {
                            gap = false;
                            break;
                        } else {
                            interpolSpeed     = interpolSpeed + measurements[i-range].speed;
                            interpolVibration = interpolVibration + measurements[i-range].vibration;
                        }
                    }
                }

                if (gap) {
                    measurements[i].speed     = interpolSpeed / (range * 2);
                    measurements[i].vibration = interpolVibration / (range * 2);
                }
            }
        }
        // Return the adjusted measurements
        return measurements;
    }

    // CALCULATE ROAD CONDITION ICON
    function calcRoadConditionIcon(speed, vibration) {
        if (speed > getMinSpeed() && vibration < getMaxVibration() && vibration > getMinVibration()) {
            // Perfect Cycling Road
            return "#00FF00";
        } else {
            // Poor Cycling Road
            return "#FF0000";
        }
    }

    // IS ROAD IN PERFECT CONDITION
    function isPerfectCondition(speed, vibration) {
        if (speed > getMinSpeed() && vibration < getMaxVibration() && vibration > getMinVibration()) {
            // Perfect Cycling Road
            return true;
        } else {
            // Poor Cycling Road
            return false;
        }
    }

    // IS ROAD IN POOR CONDITION
    function isPoorCondition(speed, vibration) {
        if (speed > getMinSpeed() && vibration < getMaxVibration() && vibration > getMinVibration()) {
            // Perfect Cycling Road
            return false;
        } else {
            // Poor Cycling Road
            return true;
        }
    }
});
