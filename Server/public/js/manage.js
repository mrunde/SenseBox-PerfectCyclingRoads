"use strict"

function showTrack(senseboxId, trackId){
    console.log(trackId);
    // TO-DO
};

function deleteTrack(senseboxId, trackId) {
    $.ajax({
        url: getURL() + "/boxes/" + senseboxId + "/tracks/" + trackId,
        global: false,
        type: 'DELETE',
        async: false,
        success: function(data) {
            $('#trackModal').modal('hide');
        }
    });
};

// MANAGE
$( document ).ready(function() {

    // INIT
    var currentSensebox = undefined;
    checkBoxId();

    function checkBoxId() {
        if(currentSensebox == undefined) {
            $( "#login" ).show();
            $( "#newSensebox" ).show();
            $( "#sensebox" ).hide();
        } else {
            $( "#login" ).hide();
            $( "#newSensebox" ).hide();
            $( "#sensebox" ).show();
            $( "#boxId" ).html(currentSensebox._id);
            $( "#boxName" ).html(currentSensebox.name);
        }
    }

    // LOGIN
    $( "#loginButton" ).click(function() {
        if($( "#senseboxIdInput" ).val() != "") {
            $.get(getURL() + "/boxes/" + $( "#senseboxIdInput" ).val(), function(data) {
                currentSensebox = data;
                checkBoxId();
            });
        }
    });

    // CREATE NEW SENSEBOX
    $( "#submitSenseboxButton" ).click(function() {
        if($( "#nameInput" ).val() != "") {
            $.post(getURL() + "/boxes", { name: $( "#nameInput" ).val(), boxType: $( "#boxTypeInput" ).val() }, function(data) {
                currentSensebox = data;
                $( "#boxId" ).html(currentSensebox.name);
                checkBoxId();

            });
        }
        $('#newSenseboxModal').modal('hide');
    });

    // EDIT SENSEBOX
    $( "#editSensebox" ).click(function() {
        $( "#nameInput_2" ).val(currentSensebox.name);
        $( "#boxTypeInput_2" ).val(currentSensebox.boxType);
    });

    // SAVE SENSEBOX
    $( "#saveSenseboxButton" ).click(function() {
        if($( "#nameInput_2" ).val() != "") {
            $.ajax({
                url: getURL() + "/boxes/" + currentSensebox._id ,
                type: 'PUT',
                data: JSON.stringify({
                    name: $( "#nameInput_2" ).val(),
                    boxType: $( "#boxTypeInput_2" ).val()
                }),
                contentType: 'application/json; charset=UTF-8',
                async: false,
                success: function(data) {
                    currentSensebox = data;
                    $( "#boxId" ).html(currentSensebox.name);
                    checkBoxId();
                }
            });
        }
        $('#senseboxModal').modal('hide');
    });

    // SHOW/EDIT TRACKS
    $( "#editTracks" ).click(function() {
        $('#tracks tbody').remove();
        $.get(getURL() + "/boxes/" + currentSensebox._id + "/tracks", function(data) {
            for(var i=0; i<data.length; i++) {
                var row = '<tr><td><span class="label label-success" style="font-size: 14px;">' + data[i]._id + '</span></td>' +
                    '<td>' + data[i].created + '</td>' +
                    '<td><button type="button" class="btn btn-default" onclick="highlightTrack(\'' + data[i]._id + '\')"><i class="fa fa-map"></i></button></td>' +
                    '<td><button type="button" class="btn btn-danger" onclick="deleteTrack(\'' + currentSensebox._id + '\', \'' + data[i]._id + '\')"><i class="fa fa-trash"></i></button></td></tr>';
                $( row ).appendTo( $( "#tracks" ) );
            }
        });
    });

    // CREATE NEW TRACK
    $( "#submitTrackButton" ).click(function() {
        handleFiles(document.getElementById("csvInput").files);
        $('#newTrackModal').modal('hide');
    });


    // LOGOUT
    $( "#logoutButton" ).click(function() {
        currentSensebox = undefined;
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
            var data = allTextLines[i].split(',');
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
            url: getURL() + "/boxes/" + currentSensebox._id + "/tracks",
            global: false,
            type: 'POST',
            data: { "box_id": currentSensebox._id },
            async: false,
            success: function(data) {
                var track = data;
                measurements.forEach(function (measurement, key) {
                    console.log(measurement);
                    $.ajax({
                        url: getURL() + "/boxes/" + currentSensebox._id + "/tracks/" + track._id + "/measurements",
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
