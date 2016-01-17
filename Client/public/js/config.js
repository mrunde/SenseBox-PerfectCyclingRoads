"use strict"

// CONFIG

// Mapbox
function getMapboxAccessToken() {
    return "pk.eyJ1IjoibmljaG85MCIsImEiOiJjaWdrdmswOTQwMDd0dmlrdHFibzQzNjU1In0.s96Fw4mPajLSSu6Azfzgfw";
};

// OpenSenseMap-API
function getURL() {
    return "http://opensensemap.org:8000/";
}

// SenseBoxes
function getBoxes() {
    return [
        {
            "box_id": "568e38d0b3de1fe005202a9c",
            "recorded": "",
            "sensorIds" : [
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
            ]
        }
    ];
}
