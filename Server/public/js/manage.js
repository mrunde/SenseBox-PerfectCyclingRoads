"use strict"

// MANAGE
$( document ).ready(function() {

    // INIT
    var currentSenseboxId = null;
    checkBoxId();


    function checkBoxId() {
        if(currentSenseboxId == null) {
            $( "#login" ).show();
            $( "#newSensebox" ).show();
            $( "#sensebox" ).hide();
        } else {
            $( "#login" ).hide();
            $( "#newSensebox" ).hide();
            $( "#sensebox" ).show();
            $( "#boxId" ).html(currentSenseboxId);
        }
    }

    // LOGIN
    $( "#loginButton" ).click(function() {
        if($( "#senseboxIdInput" ).val() != "") {
            $.get(getURL() + "/boxes/" + $( "#senseboxIdInput" ).val(), function(data) {
                currentSenseboxId = data._id;
                checkBoxId();
            });
        }
    });

    // CREATE NEW SENSEBOX
    $( "#submitSenseboxButton" ).click(function() {
        if($( "#nameInput" ).val() != "") {
            $.post(getURL() + "/boxes", { name: $( "#nameInput" ).val(), boxType: $( "#boxTypeInput" ).val() }, function(data) {
                currentSenseboxId = data._id;
                $( "#boxId" ).html(currentSenseboxId);
                checkBoxId();

            });
        }
        $('#newSenseboxModal').modal('hide');
    });

    // CREATE NEW TRACK
    $( "#submitTrackButton" ).click(function() {
        handleFiles(document.getElementById("csvInput").files);
        $('#newTrackModal').modal('hide');
    });


    // LOGOUT
    $( "#logoutButton" ).click(function() {
        currentSenseboxId = null;
        checkBoxId();
    });


    // CHECK FILE-READER-SUPPORT IN BROWSER
    function handleFiles(files) {
        // Check for the various File API support.
        if (window.FileReader) {
            // FileReader are supported.
            getAsText(files[0]);
        } else {
            alert('FileReader are not supported in this browser!');
        }
    }


    // CSV-TO-JSON-CONVERTER
    function getAsText(fileToRead) {
        var reader = new FileReader();
        // Read file into memory as UTF-8
        reader.readAsText(fileToRead);
        // Handle errors load
        reader.onload = loadHandler;
        reader.onerror = errorHandler;
    }

    function loadHandler(event) {
        var csv = event.target.result;
        processData(csv);
    }

    function processData(csv) {
        var allTextLines = csv.split(/\r\n|\n/);
        var lines = [];
        for (var i=0; i<allTextLines.length; i++) {
            var data = allTextLines[i].split(';');
                var tarr = [];
                for (var j=0; j<data.length; j++) {
                    tarr.push(data[j]);
                }
                lines.push(tarr);
        }
        if(lines.length!=0){
            //console.log(lines);
            uploadTrack(lines);
        } else {
            console.log("Empty CSV-file");
        }
    }

    function errorHandler(evt) {
      if(evt.target.error.name == "NotReadableError") {
          alert("Canno't read file !");
      }
    }


    // UPLOAD NEW TRACK
    function uploadTrack(measurements){

        $.ajax({
            url: getURL() + "/boxes/" + currentSenseboxId + "/tracks",
            global: false,
            type: 'POST',
            data: { "box_id": currentSenseboxId },
            async: false,
            success: function(data) {
                var track = data;
                measurements.forEach(function (measurement, key) {
                    console.log(measurement);
                    $.ajax({
                        url: getURL() + "/boxes/" + currentSenseboxId + "/tracks/" + track._id + "/measurements",
                        global: false,
                        type: 'POST',
                        data: {
                            "track_id": track._id,
                            "timestamp": measurement[4],
                            "lng": parseFloat(measurement[2]),
                            "lat": parseFloat(measurement[1]),
                        	"altitude": parseFloat(measurement[8]),
                        	"speed": parseFloat(measurement[3]),
                        	"vibration": parseFloat(measurement[7]),
                        	"sound": parseFloat(measurement[5]),
                        	"brightness": parseFloat(measurement[6]),
                        	"uv": parseFloat("0"), // TO-DO
                        	"ir": parseFloat("0") // TO-DO
                        },
                        async: false,
                        success: function(data) {
                            console.log(data);
                        }
                    });
                });
            }
        });
        drawMarkers();
    };
});
