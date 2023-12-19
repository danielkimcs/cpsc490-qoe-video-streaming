// Source: https://stackoverflow.com/a/23828241

var totalTimeBuffering = 0
var checkInterval  = 50.0 // check every 50 ms (do not use lower values)
var lastPlayPos    = 0
var currentPlayPos = 0
var lastBufferingTimestamp = 0
var bufferingDetected = false
var player = document.getElementById('adaptive_video')

setInterval(checkBuffering, checkInterval)
function checkBuffering() {
    currentPlayPos = player.currentTime

    // checking offset should be at most the check interval
    // but allow for some margin
    var offset = (checkInterval - 20) / 1000

    // if no buffering is currently detected,
    // and the position does not seem to increase
    // and the player isn't manually paused...
    if (
            !bufferingDetected 
            && currentPlayPos < (lastPlayPos + offset)
            && !player.paused
        ) {
        lastBufferingTimestamp = currentPlayPos
        bufferingDetected = true
    }

    // if we were buffering but the player has advanced,
    // then there is no buffering
    if (
        bufferingDetected 
        && currentPlayPos > (lastPlayPos + offset)
        && !player.paused
        ) {
        totalTimeBuffering += (currentPlayPos - lastBufferingTimestamp)
        document.getElementById("total_time").innerText = totalTimeBuffering;
        document.getElementById("time").innerHTML += "<br /> buffered: " + lastBufferingTimestamp + " - " + currentPlayPos;
        bufferingDetected = false
        lastBufferingTimestamp = 0
    }
    lastPlayPos = currentPlayPos
}