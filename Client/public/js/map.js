"use strict"

// MAP
$( document ).ready(function() {

    L.mapbox.accessToken = getMapboxAccessToken();
    var map = L.mapbox.map('map').setView([51.961298, 7.625849], 13);

    L.control.layers({
        'Streets': L.mapbox.tileLayer('mapbox.streets').addTo(map),
        'Satellite': L.mapbox.tileLayer('mapbox.satellite'),
        'Light': L.mapbox.tileLayer('mapbox.light')
    }).addTo(map);

    // Add Feature Layer
    L.mapbox.featureLayer({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [
              7.625849, 51.961298
            ]
        },
        properties: {
            'title': 'Schloss',
            'description': 'Schoss',
            'marker-size': 'large',
            'marker-color': '#BE9A6B',
            'marker-symbol': 'bus'
        }
    }).addTo(map);

    /*function onEachFeature(feature, layer) {
        var popupContent = "";

        if (feature.properties && feature.properties.popupContent) {
            popupContent += feature.properties.popupContent;
        }

        layer.bindPopup(popupContent);
	};*/


    /*function loadData() {
        var data;

        var senseBoxes = getBoxes();

        for

        getURL
         +"http://opensensemap.org:8000/boxes/568e38d0b3de1fe005202a9c/data/568e38d0b3de1fe005202a9e";
    };*/


});
