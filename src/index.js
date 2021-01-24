import './styles.scss';
const ClientOAuth2 = require("client-oauth2");
const SpotifyWebApi = require("spotify-web-api-js")

let trackId;
let trackFeatures;
let featureTypes = ["acousticness", "danceability", "energy", "instrumentalness", "liveness", "loudness", "speechiness", "valence", "tempo"];

// Returns a comma separated list of the artists for a track
let getArtistList = t => {
    let artists = [];
    t["artists"].forEach(artist => { artists.push(artist["name"]) });
    return artists.join(", ");
};

let updatePlayer = () => {
    let track;
    // Fill the player
    spotify.getMyCurrentPlayingTrack()
        .then(
            data => {
                track = data;
                let imageUri = data["item"]["album"]["images"][0]["url"];
                document.querySelector("#artwork").src = imageUri;

                document.getElementById("track-artist").textContent = getArtistList(data["item"]);

                let name = data["item"]["name"];
                document.getElementById("track-title").textContent = name;

                // Calculate how long of the song is left
                let remaining = parseInt(data["progress_ms"]) - parseInt(data["item"]["duration_ms"]);
                if (remaining < 10000) {
                    // TODO Stop features being changed and queue song
                }

                // Get the features for the current track
                let id = track["item"]["id"];
                if (id !== trackId) {
                    populateSelector(); // Re-populate selector on track change
                }
                trackId = id;
                return spotify.getAudioFeaturesForTrack(trackId);
            },
            err => {
                console.log(err);
            }
        )
        .then(
            data => {
                trackFeatures = data;
                if (document.querySelectorAll("#selector > .selector-element").length === 0) {
                    populateSelector();
                }
            },
            err => {
                console.log(err);
            }
        );
};

let populateSelector = () => {
    if (!trackId) {
        return;
    }

    // Clear out current values
    let existing = document.querySelectorAll("#selector > .selector-element");
    if (!existing || existing.length === 0) {
        for (let i = 0; i < 12; i++) {
            let t = document.getElementById("selector-element-template").content;
            let e = document.importNode(t, true);
            document.getElementById("selector").appendChild(e);
            existing = document.querySelectorAll("#selector > .selector-element");

        }
    }

    existing.forEach(e => { fillSelectorElement(e) });
}

let fillSelectorElement = elem => {
    let current = 0;
    let feature;
    while (current == 0) {
        feature = featureTypes[Math.floor(Math.random() * featureTypes.length)]
        current = trackFeatures[feature];
    }

    let direction = Math.random() > 0.5 ? 1.0 : -1.0;
    let target = current + (Math.abs(current) * 0.10 * direction);
    let descriptor = direction == 1.0 ? "min_" : "max_";
    descriptor += feature;

    let r = {seed_tracks: [trackId], limit: 1}
    r[descriptor] = target;
    spotify.getRecommendations(r)
        .then(
            data => {
                let track = data["tracks"][0];
                if (!track) {
                    populateSelector(elem);
                    return;
                }

                elem.querySelector("[name=artwork]").src = track["album"]["images"][1]["url"];
                elem.querySelector("[name=artist]").innerText = getArtistList(track);
                elem.querySelector("[name=title]").innerText = track["name"];

                let label = direction == 1.0 ? "More" : "Less";
                label += " " + feature;
                elem.querySelector("[name=feature]").innerText = label;

                elem.dataset.trackUri = track["uri"];
                elem.onclick = queueTrack;
            },
            err => {
                console.log(err);
            }
        );
}

// Called when a song is clicked
let queueTrack = e => {
    let uri;
    let elem;
    if (e.srcElement.dataset.trackUri) {
        uri = e.srcElement.dataset.trackUri;
        elem = e.srcElement;
    } else {
        uri = e.srcElement.parentElement.dataset.trackUri;
        elem = e.srcElement.parentElement;
    }

    spotify.queue(uri)
        .then(
            () => {
                fillSelectorElement(elem);
            },
            err => {
                console.log(err);
            }
        );
};

let randomString = length => {
    let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let ret = "";
    for (let i = 0; i < length; i++) {
        ret += charset[Math.floor(Math.random() * charset.length)];
    }
    return ret;
};

// Check if we've been given a token from spotify
if (location.hash.length > 0) {
    let params = new URLSearchParams(location.hash.replace("#", "?"));
    
    if (params.get("state") === localStorage["state"]) {
        let expires = params.get("expires_in");
        let now = Math.floor(Date.now()/1000);
        localStorage["expires"] = now + parseInt(expires) - 120;

        localStorage["token"] = params.get("access_token");
    }

    document.location.replace("/");
}

// Do we need to get a token?
if (localStorage["token"] === undefined || localStorage["expires"] === undefined || Math.floor(Date.now()/1000) >= parseInt(localStorage["expires"])) {
    let state = randomString(32);
    localStorage["state"] = state;
    let auth = new ClientOAuth2({
        clientId: "d187382ee43545e1aec7d557fb80b074",
        authorizationUri: "https://accounts.spotify.com/authorize",
        redirectUri: "http://localhost:8080/",
        scopes: ["user-read-currently-playing", "user-modify-playback-state"],
        state: state
    });

    let main = document.getElementById("main");
    main.style.display = "none";

    let login = document.getElementById("login");
    login.style.display = "block";

    let button = document.getElementById("login-button");
    button.onclick = function() {
        window.location.replace(auth.token.getUri());
    };
} else {
    // Setup the Spotify api
    var spotify = new SpotifyWebApi();
    spotify.setAccessToken(localStorage["token"]);

    updatePlayer();
    setInterval(updatePlayer, 3000);
}
