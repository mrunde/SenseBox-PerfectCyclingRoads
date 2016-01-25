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

    /*function onEachFeature(feature, layer) {
        var popupContent = "";

        if (feature.properties && feature.properties.popupContent) {
            popupContent += feature.properties.popupContent;
        }

        layer.bindPopup(popupContent);
	};*/


    /*function drawMarkers(newBoxData) {

        for(var k=0; k<newBoxData.length; k++) {

            console.log(newBoxData[k].latValues);
            console.log(newBoxData[k].lngValues);

            for(var j=0; j<newBoxData[k].lngValues.length; j++) {
                L.mapbox.featureLayer({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [
                            newBoxData[k].lngValues[j], newBoxData[k].latValues[j],
                        ]
                    },
                    properties: {
                        'title': 'SenseBoxId: ',
                        'description': "Data: ",
                            newBoxData[i].altValues[j] + "; " +
                            newBoxData[i].vibrationValues[j] + "; " +
                            newBoxData[i].soundValues[j] + "; " +
                            newBoxData[i].lightValues[j],
                        'marker-size': 'large',
                        'marker-color': '#FF3300',
                        'marker-symbol': 'circle'
                    }
                }).addTo(map);
            }
        }
    };*/

});
