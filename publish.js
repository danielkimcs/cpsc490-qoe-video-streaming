function q1(x) {
    return x;
}

function q2(x, mn) {
    return Math.log(x/mn);
}

function qoe(qarr, mu, total_buffer_time) {
    const qsum = qarr.reduce((s, a) => s+a, 0)
    var qdiffsum = 0;
    for (var i = 1; i < qarr.length - 1; i++) {
        qdiffsum += Math.abs(qarr[i+1] - qarr[i])
    }
    return qsum - mu * total_buffer_time - qdiffsum
}

(function() {
    "use strict";

    var sessionKey = "mpquic"; // EDIT KEY FOR LOCALSTORAGE
    var mu1 = 4.3;
    var mu2 = 2.66;
    var lowestBitrate = 2000;

    var qualities1 = new Array(31).fill(0);
    var qualities2 = new Array(31).fill(0);

    if (!navigator.serviceWorker || !navigator.serviceWorker.register) {
        console.log("This browser doesn't support service workers");
        return;
    }

    navigator.serviceWorker.addEventListener('message', function(event) {
        var strdata = String(event.data);
        if (strdata.includes(".m4s")) {
            var rx = /coaster_equir_([0-9]*)_dash([0-9]*).m4s/g;
            var rxarr = rx.exec(strdata);
            var bitrate = parseInt(rxarr[1]);
            var chunk = parseInt(rxarr[2]);
            qualities1[chunk] = q1(bitrate);
            qualities2[chunk] = q2(bitrate, lowestBitrate);
            document.getElementById("fetch").innerHTML += "<br />" + "fetched chunk " + chunk + " at bitrate " + bitrate + "kb/s";
        }
    });

    document.getElementById("adaptive_video").addEventListener('ended',
        function() {
            var totalTimeBuffering = parseFloat(document.getElementById("total_time").innerText);
            var linear_qoe = qoe(qualities1, mu1, totalTimeBuffering)
            var log_qoe = qoe(qualities2, mu2, totalTimeBuffering)
            var new_trial = {
                totalTimeBuffering: totalTimeBuffering,
                linearQoE: linear_qoe,
                logQoE: log_qoe,
                chunks: qualities1.slice(1)
            }
            var trials = JSON.parse(localStorage.getItem(sessionKey)) ?? [];
            trials.push(new_trial);
            localStorage.setItem(sessionKey, JSON.stringify(trials));
            location.reload();
        }, false);
    

    if (navigator.serviceWorker.controller) {
    } else {
        navigator.serviceWorker.register("service-worker.js")
            .then(function(registration) {
                location.reload();
            })
            .catch(function(error) {
                console.log("Service worker registration failed: " + error.message);
            });
    }
})();