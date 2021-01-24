import './styles.scss';
const ClientOAuth2 = require("client-oauth2");
const SpotifyWebApi = require("spotify-web-api-js")

let featureTypes = ["acousticness", "danceability", "energy", "instrumentalness", "liveness", "loudness", "speechiness", "valence", "tempo"];
let buttonStates = {}
featureTypes.forEach(f => {
    buttonStates[f] = 0; // -1 = less, 0 = unselected, 1 = more
});
console.log(buttonStates);

// Recompute the layout on page resize
let updateLayout = () => {
    let numDivs = featureTypes.length;
    let selector = document.getElementById("selector");
    let selectorElements = document.getElementsByClassName("selector-element");

    if (screen.width > 850) {
        // Vertical selectors
        selector.style["grid-template-columns"] = "1fr ".repeat(numDivs).trim();
        selector.style["grid-template-rows"] = "1fr";
        for (let e of selectorElements) {
            e.classList.remove("selector-element-horizontal");
            e.classList.add("selector-element-vertical");

            let buttonTop = e.getElementsByClassName("selector-button-top")[0];
            buttonTop.innerText = "More";
            buttonTop.onclick = increaseFeature;

            let buttonBottom = e.getElementsByClassName("selector-button-bottom")[0];
            buttonBottom.innerText = "Less";
            buttonBottom.onclick = decreaseFeature;
        }
    } else {
        // Horizontal selectors
        selector.style["grid-template-columns"] = "1fr";
        selector.style["grid-template-rows"] = "1fr ".repeat(numDivs).trim();
        for (let e of selectorElements) {
            e.classList.remove("selector-element-vertical");
            e.classList.add("selector-element-horizontal");

            e.getElementsByClassName("selector-button-top")[0].innerText = "Less";
            e.getElementsByClassName("selector-button-bottom")[0].innerText = "More";
        }
    }
};
window.onresize = updateLayout;

// Feature change buttons clicked
var increaseFeature = e => {
    e.preventDefault();
    let feature = e.srcElement.dataset.feature;
    if (buttonStates[feature] === 0) {
        buttonStates[feature] = 1;
    } else if (buttonStates[feature] === 1) {
        buttonStates[feature] = 0;
    }
    console.log(buttonStates);
}

var decreaseFeature = e => {
    e.preventDefault();
    let feature = e.srcElement.dataset.feature;
    if (buttonStates[feature] === 0) {
        buttonStates[feature] = -1;
    } else if (buttonStates[feature] === -1) {
        buttonStates[feature] = 0;
    } 
    console.log(buttonStates);
}

let mainLoop = () => {
    let track;
    // Fill the player
    spotify.getMyCurrentPlayingTrack()
        .then(
            data => {
                console.log(data);
                track = data;
                let imageUri = data["item"]["album"]["images"][0]["url"];
                document.querySelector("#artwork").src = imageUri;

                let artists = [];
                data["item"]["artists"].forEach(artist => { artists.push(artist["name"]) })
                document.getElementById("track-artist").textContent = artists.join(", ")

                let name = data["item"]["name"];
                document.getElementById("track-title").textContent = name;

                // Calculate how long of the song is left
                let remaining = parseInt(data["progress_ms"]) - parseInt(data["item"]["duration_ms"]);
                if (remaining < 10000) {
                    // TODO Stop features being changed and queue song
                }

                // Get the features for the current track
                let id = track["item"]["id"];
                return spotify.getAudioFeaturesForTrack(id);
            },
            err => {
                console.log(err);
            }
        )
        .then(
            features => {
                console.log(features);
            },
            err => {
                console.log(err);
            }
        )
}

// OAuth setup
var auth = new ClientOAuth2({
    clientId: "d187382ee43545e1aec7d557fb80b074",
    authorizationUri: "https://accounts.spotify.com/authorize",
    redirectUri: "http://localhost:8080/",
    scopes: ["user-read-currently-playing"],
});

// Check if we've been given a token from spotify
if (location.hash.length > 0) {
    let params = new URLSearchParams(location.hash.replace("#", "?"));
    let expires = params.get("expires_in");
    let now = Math.floor(Date.now()/1000);
    localStorage["expires"] = now + parseInt(expires) - 120;

    localStorage["token"] = params.get("access_token");

    document.location.replace("/");
}

// Do we need to get a token?
if (localStorage["token"] === undefined || localStorage["expires"] === undefined || Math.floor(Date.now()/1000) >= parseInt(localStorage["expires"])) {
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

    // Page setup
    let selector = document.getElementById("selector");
    let elem = selector.lastChild;
    selector.removeChild(elem);
    for (let i = 0; i < featureTypes.length; i++) {
        let clone = elem.cloneNode(true);
        clone.getElementsByClassName("selector-category")[0].innerText = featureTypes[i];
        let buttons = clone.getElementsByClassName("selector-button");
        for (let b of buttons) {
            b.dataset.feature = featureTypes[i];
        }
        selector.appendChild(clone);
    }
    updateLayout();

    mainLoop();
    setInterval(mainLoop, 5000);
}
