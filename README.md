## How to run

* Follow instructions [here](https://rybakov.com/blog/mpeg-dash/) on setting up adaptive bitrate streaming for a video.

* Save the video segment files and MPD file into a directory under root folder of this repo.

* Open `index.html` in Google Chrome. You need to adjust the path in `index.html` that is loading the MPD file. Right now it is set to `video/output/coaster_equir.mpd` as an example.

* If the service worker does not run, you'll need to whitelist your origin to `chrome://flags/`, under "Insecure origins treated as secure".

* Throttle network conditions using Chrome DevTools, under Network tab.

* Retrieve collected data by checking the contents of `localStorage`, under the Application tab of Chrome DevTools. Make sure to edit the key that the data is saving to in `publish.js`.
