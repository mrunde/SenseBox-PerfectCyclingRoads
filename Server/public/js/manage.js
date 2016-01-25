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
        }
    }

    // LOGIN
    $( "#loginButton" ).click(function() {
        if($( "#senseboxIdInput" ).val() != "") {
            $.get(getURL() + "/boxes/" + $( "#senseboxIdInput" ).val(), function(data) {
                currentSenseboxId = data._id;
                $( "#boxId" ).html(currentSenseboxId);
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
        $('#newTrackModal').modal('hide');
    });

    // LOGOUT
    $( "#logoutButton" ).click(function() {
        currentSenseboxId = null;
        checkBoxId();
    });
});
