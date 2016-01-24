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



    var boxData = [];
    var senseBoxes = getBoxes();
    var i=0;
    boxData.push({
        box_id: senseBoxes[i].box_id,
        latValues : [],
        lngValues : [],
        altValues : [],
        vibrationValues : [],
        soundValues : [],
        lightValues : []
    });
    requestData(senseBoxes[i].box_id, senseBoxes[i].sensorIds);


    function requestData(box_id, sensorIds) {

        var requestURL_1 = getURL() + "/boxes/" + box_id + "/data/" + sensorIds[0].id;
        $.getJSON( requestURL_1, {
            format: "json"
        }).done(function( data ) {
            $.each( data, function( i, item ) {
                boxData[0].latValues.push(parseFloat(item.value));
            });
        });

        var requestURL_2 = getURL() + "/boxes/" + box_id + "/data/" + sensorIds[1].id;
        $.getJSON( requestURL_2, {
            format: "json"
        }).done(function( data ) {
            $.each( data, function( i, item ) {
                boxData[0].lngValues.push(parseFloat(item.value));
            });
        });

        var requestURL_3 = getURL() + "/boxes/" + box_id + "/data/" + sensorIds[2].id;
        $.getJSON( requestURL_3, {
            format: "json"
        }).done(function( data ) {
            $.each( data, function( i, item ) {
                boxData[0].altValues.push(parseFloat(item.value));
            });
        });

        var requestURL_4 = getURL() + "/boxes/" + box_id + "/data/" + sensorIds[3].id;
        $.getJSON( requestURL_4, {
            format: "json"
        }).done(function( data ) {
            $.each( data, function( i, item ) {
                boxData[0].vibrationValues.push(parseFloat(item.value));
            });
        });

        var requestURL_5 = getURL() + "/boxes/" + box_id + "/data/" + sensorIds[4].id;
        $.getJSON( requestURL_5, {
            format: "json"
        }).done(function( data ) {
            $.each( data, function( i, item ) {
                boxData[0].soundValues.push(parseFloat(item.value));
            });
        });

        var requestURL_6 = getURL() + "/boxes/" + box_id + "/data/" + sensorIds[5].id;
        $.getJSON( requestURL_6, {
            format: "json"
        }).done(function( data ) {
            $.each( data, function( i, item ) {
                boxData[0].lightValues.push(parseFloat(item.value));
            });
            drawMarkers(boxData);
        });

    };


    function drawMarkers(newBoxData) {

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
                        'description': "Data: ", /*
                            newBoxData[i].altValues[j] + "; " +
                            newBoxData[i].vibrationValues[j] + "; " +
                            newBoxData[i].soundValues[j] + "; " +
                            newBoxData[i].lightValues[j],*/
                        'marker-size': 'large',
                        'marker-color': '#FF3300',
                        'marker-symbol': 'circle'
                    }
                }).addTo(map);
            }
        }
    };

});
