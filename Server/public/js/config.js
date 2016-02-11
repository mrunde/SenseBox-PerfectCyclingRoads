"use strict"

// MAPBOX
function getMapboxAccessToken() {
    return "pk.eyJ1IjoibmljaG85MCIsImEiOiJjaWp3enA1NmMwMDFzdmNtMGczdGI4YTdxIn0.WKPEegyEq-K_65K-OJ0mgg";
};


// API
function getURL() {
    return "http://localhost:8080/api";
};


// CONSTANT VARIABLES FOR THE ROAD CONDITIONS
function getMinSpeed() {
    return 8;
};

function getMinVibration() {
    return 0.865;
};

function getMaxVibration() {
    return 1.135;
};


// INTERPOLATE
function getInterpolateState() {
    return true;
};


// CLOSE GAPS
function getCloseGapsState() {
    return true;
};
