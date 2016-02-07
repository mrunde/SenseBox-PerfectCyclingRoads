"use strict"

var currentSensebox = undefined;


function showTrack(senseboxId, trackId){
    console.log(trackId);
    // TO-DO
};

// TRACK-LIST
function loadTrackList(senseboxId) {
    $.get(getURL() + "/boxes/" + senseboxId + "/tracks", function(data) {
        if(data.length > 0) {
            for(var i=0; i<data.length; i++) {
                var row = '<tr>' +
                    '<td><span class="label label-success" style="font-size: 14px;">' + data[i]._id + '</span></td>' +
                    '<td>' + data[i].created + '</td>' +
                    '<td class="middle">' +
                    '<button type="button" class="btn btn-xs btn-default" onclick="highlightTrack(\'' + data[i]._id + '\')"><i class="fa fa-map"></i></button>' +
                    '</td>' +
                    '<td class="right">' +
                    '<button type="button" class="btn btn-xs btn-danger" id="deleteTrack_' + senseboxId + '" onclick="deleteTrack(\'' + senseboxId + '\', \'' + data[i]._id + '\')"><i class="fa fa-trash"></i></button>' +
                    '</td>' +
                    '</tr>';
                $( row ).appendTo( $( "#tracks" ) );
            }
        } else {
            showNone();
        }
    });
};

// DELETE TRACK
function deleteTrack(senseboxId, trackId) {
    $.ajax({
        url: getURL() + "/boxes/" + senseboxId + "/tracks/" + trackId,
        global: false,
        type: 'DELETE',
        async: false,
        success: function(data) {
            $('#tracks tbody').remove();
            loadTrackList(senseboxId);
        }
    });
};

// DELETE ALL TRACKS
function deleteAllTracks() {
    $.ajax({
        url: getURL() + "/boxes/" + currentSensebox._id + "/tracks",
        global: false,
        type: 'DELETE',
        async: false,
        success: function(data) {
            $('#tracks tbody').remove();
            var row = '<tr><td colspan="4" class="middle" id="noTracks">- none -</td></tr>'
            $( row ).appendTo( $( "#tracks" ) );
        }
    });
};

// SHOW NONE TRACKS AVAILABLE
function showNone() {
    $('#tracks tbody').remove();
    var row = '<tr><td colspan="4" class="middle" id="noTracks">- none -</td></tr>'
    $( row ).appendTo( $( "#tracks" ) );
}

// RESET TRACK-MODAL
function resetTrackModal() {
    $('#closeTrackButton').prop('disabled', false);
    $('#submitTrackButton').prop('disabled', false);
    $('#newTrackModal').modal('hide');
    $('#selectFile').show();
    $('#loading').hide();
}

// MANAGE
$( document ).ready(function() {

    // INIT
    currentSensebox = undefined;
    checkBoxId();
    $( "#loading" ).hide();

    // TOGGLE NAVBAR-ELEMENTS
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
                checkBoxId();
                $('#newSenseboxModal').modal('hide');
                $( "#newBoxId" ).html(currentSensebox._id);
                $('#senseboxIdReminderModal').modal('show');
            });
        } else {
            $('#newSenseboxModal').modal('hide');
        }
    });

    // EDIT SENSEBOX
    $( "#editSensebox" ).click(function() {
        $( "#nameInput_2" ).val(currentSensebox.name);
        $( "#boxTypeInput_2" ).val(currentSensebox.boxType);
    });

    // DELETE SENSEBOX
    $( "#deleteSensebox" ).click(function() {
        $.ajax({
            url: getURL() + "/boxes/" + currentSensebox._id,
            global: false,
            type: 'DELETE',
            async: false,
            success: function(data) {
                $('#senseboxModal').modal('hide');
                currentSensebox = undefined;
                checkBoxId();
            }
        });
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
        loadTrackList(currentSensebox._id);
    });

    // CREATE NEW TRACK
    $( "#submitTrackButton" ).click(function() {
        $( "#selectFile" ).hide();
        $( "#loading" ).show();
        $( "#closeTrackButton" ).prop('disabled', true);
        $( "#submitTrackButton" ).prop('disabled', true);
        handleFiles(document.getElementById("csvInput").files);
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
                var length = measurements.length;
                measurements.forEach(function (measurement, key) {
                    //console.log(measurement);
                    $.ajax({
                        url: getURL() + "/boxes/" + currentSensebox._id + "/tracks/" + track._id + "/measurements",
                        global: false,
                        type: 'POST',
                        data: {
                            "track_id": track._id,
                            "lat": parseFloat(measurement[1]),
                            "lng": parseFloat(measurement[2]),
                            "speed": parseFloat(measurement[3]),
                            "timestamp": measurement[4],
                            "sound": parseFloat(measurement[5]),
                        	"luminosity": parseFloat(measurement[6]),
                        	"brightness": parseFloat(measurement[7]),
                            "ir": parseFloat(measurement[8]),
                            "vibration": parseFloat(measurement[9]),
                            "altitude": parseFloat(measurement[10]),
                        },
                        async: false,
                        success: function(data) {
                            length = length-1;
                            if(length==0) {
                                resetTrackModal();
                            }
                        },
                        error: function(data){
                            length = length-1;
                            if(length==0) {
                                resetTrackModal();
                            }
                        }
                    });
                });
            }
        });
    };
});
