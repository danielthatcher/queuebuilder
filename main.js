(()=>{var e={977:(e,t,r)=>{var n=r(679).Buffer,o=r(673),i=r(952);const s="https://example.org/";var a;a="function"==typeof n?function(e){return n.from(e).toString("base64")}:window.btoa.bind(window),e.exports=g;var c={Accept:"application/json, application/x-www-form-urlencoded","Content-Type":"application/x-www-form-urlencoded"},u={invalid_request:["The request is missing a required parameter, includes an","invalid parameter value, includes a parameter more than","once, or is otherwise malformed."].join(" "),invalid_client:["Client authentication failed (e.g., unknown client, no","client authentication included, or unsupported","authentication method)."].join(" "),invalid_grant:["The provided authorization grant (e.g., authorization","code, resource owner credentials) or refresh token is","invalid, expired, revoked, does not match the redirection","URI used in the authorization request, or was issued to","another client."].join(" "),unauthorized_client:["The client is not authorized to request an authorization","code using this method."].join(" "),unsupported_grant_type:["The authorization grant type is not supported by the","authorization server."].join(" "),access_denied:["The resource owner or authorization server denied the request."].join(" "),unsupported_response_type:["The authorization server does not support obtaining","an authorization code using this method."].join(" "),invalid_scope:["The requested scope is invalid, unknown, or malformed."].join(" "),server_error:["The authorization server encountered an unexpected","condition that prevented it from fulfilling the request.","(This error code is needed because a 500 Internal Server","Error HTTP status code cannot be returned to the client","via an HTTP redirect.)"].join(" "),temporarily_unavailable:["The authorization server is currently unable to handle","the request due to a temporary overloading or maintenance","of the server."].join(" ")};function l(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];if(null==e[r])throw new TypeError('Expected "'+r+'" to exist')}}function p(e){var t=u[e.error]||e.error_description||e.error;if(t){var r=new Error(t);return r.body=e,r.code="EAUTH",r}}function d(e){return Array.isArray(e)?e.join(" "):m(e)}function y(e,t){l(e,"clientId","authorizationUri");const r={client_id:e.clientId,redirect_uri:e.redirectUri,response_type:t,state:e.state};void 0!==e.scopes&&(r.scope=d(e.scopes));const n=e.authorizationUri.includes("?")?"&":"?";return e.authorizationUri+n+o.stringify(Object.assign(r,e.query))}function f(e,t){return"Basic "+a(m(e)+":"+m(t))}function m(e){return null==e?"":String(e)}function h(e,t){return{url:e.url,method:e.method,body:Object.assign({},e.body,t.body),query:Object.assign({},e.query,t.query),headers:Object.assign({},e.headers,t.headers)}}function g(e,t){this.options=e,this.request=t||i,this.code=new k(this),this.token=new b(this),this.owner=new T(this),this.credentials=new w(this),this.jwt=new x(this)}function v(e,t){this.client=e,this.data=t,this.tokenType=t.token_type&&t.token_type.toLowerCase(),this.accessToken=t.access_token,this.refreshToken=t.refresh_token,this.expiresIn(Number(t.expires_in))}function T(e){this.client=e}function b(e){this.client=e}function w(e){this.client=e}function k(e){this.client=e}function x(e){this.client=e}g.Token=v,g.prototype.createToken=function(e,t,r,n){var o=Object.assign({},n,"string"==typeof e?{access_token:e}:e,"string"==typeof t?{refresh_token:t}:t,"string"==typeof r?{token_type:r}:r);return new g.Token(this,o)},g.prototype._request=function(e){var t=e.url,r=o.stringify(e.body),n=o.stringify(e.query);return n&&(t+=(-1===t.indexOf("?")?"?":"&")+n),this.request(e.method,t,r,e.headers).then((function(e){var t=function(e){try{return JSON.parse(e)}catch(t){return o.parse(e)}}(e.body),r=p(t);if(r)return Promise.reject(r);if(e.status<200||e.status>=399){var n=new Error("HTTP status "+e.status);return n.status=e.status,n.body=e.body,n.code="ESTATUS",Promise.reject(n)}return t}))},v.prototype.expiresIn=function(e){if("number"==typeof e)this.expires=new Date,this.expires.setSeconds(this.expires.getSeconds()+e);else{if(!(e instanceof Date))throw new TypeError("Unknown duration: "+e);this.expires=new Date(e.getTime())}return this.expires},v.prototype.sign=function(e){if(!this.accessToken)throw new Error("Unable to sign without access token");if(e.headers=e.headers||{},"bearer"===this.tokenType)e.headers.Authorization="Bearer "+this.accessToken;else{var t=e.url.split("#"),r="access_token="+this.accessToken,n=t[0].replace(/[?&]access_token=[^&#]/,""),o=t[1]?"#"+t[1]:"";e.url=n+(n.indexOf("?")>-1?"&":"?")+r+o,e.headers.Pragma="no-store",e.headers["Cache-Control"]="no-store"}return e},v.prototype.refresh=function(e){var t=this,r=Object.assign({},this.client.options,e);return this.refreshToken?this.client._request(h({url:r.accessTokenUri,method:"POST",headers:Object.assign({},c,{Authorization:f(r.clientId,r.clientSecret)}),body:{refresh_token:this.refreshToken,grant_type:"refresh_token"}},r)).then((function(e){return t.client.createToken(Object.assign({},t.data,e))})):Promise.reject(new Error("No refresh token"))},v.prototype.expired=function(){return Date.now()>this.expires.getTime()},T.prototype.getToken=function(e,t,r){var n=this,o=Object.assign({},this.client.options,r);const i={username:e,password:t,grant_type:"password"};return void 0!==o.scopes&&(i.scope=d(o.scopes)),this.client._request(h({url:o.accessTokenUri,method:"POST",headers:Object.assign({},c,{Authorization:f(o.clientId,o.clientSecret)}),body:i},o)).then((function(e){return n.client.createToken(e)}))},b.prototype.getUri=function(e){return y(Object.assign({},this.client.options,e),"token")},b.prototype.getToken=function(e,t){var r=Object.assign({},this.client.options,t),n="object"==typeof e?e:new URL(e,s),i=new URL(r.redirectUri,s);if("string"==typeof n.pathname&&n.pathname!==i.pathname)return Promise.reject(new TypeError("Redirected path should match configured path, but got: "+n.pathname));if(!n.hash&&!n.search)return Promise.reject(new TypeError("Unable to process uri: "+e));var a=Object.assign({},"string"==typeof n.search?o.parse(n.search.substr(1)):n.search||{},"string"==typeof n.hash?o.parse(n.hash.substr(1)):n.hash||{}),c=p(a);return c?Promise.reject(c):null!=r.state&&a.state!==r.state?Promise.reject(new TypeError("Invalid state: "+a.state)):Promise.resolve(this.client.createToken(a))},w.prototype.getToken=function(e){var t=this,r=Object.assign({},this.client.options,e);l(r,"clientId","clientSecret","accessTokenUri");const n={grant_type:"client_credentials"};return void 0!==r.scopes&&(n.scope=d(r.scopes)),this.client._request(h({url:r.accessTokenUri,method:"POST",headers:Object.assign({},c,{Authorization:f(r.clientId,r.clientSecret)}),body:n},r)).then((function(e){return t.client.createToken(e)}))},k.prototype.getUri=function(e){return y(Object.assign({},this.client.options,e),"code")},k.prototype.getToken=function(e,t){var r=this,n=Object.assign({},this.client.options,t);l(n,"clientId","accessTokenUri");var i="object"==typeof e?e:new URL(e,s);if("string"==typeof n.redirectUri&&"string"==typeof i.pathname&&i.pathname!==new URL(n.redirectUri,s).pathname)return Promise.reject(new TypeError("Redirected path should match configured path, but got: "+i.pathname));if(!i.search||!i.search.substr(1))return Promise.reject(new TypeError("Unable to process uri: "+e));var a="string"==typeof i.search?o.parse(i.search.substr(1)):i.search||{},u=p(a);if(u)return Promise.reject(u);if(null!=n.state&&a.state!==n.state)return Promise.reject(new TypeError("Invalid state: "+a.state));if(!a.code)return Promise.reject(new TypeError("Missing code, unable to request token"));var d=Object.assign({},c),y={code:a.code,grant_type:"authorization_code",redirect_uri:n.redirectUri};return n.clientSecret?d.Authorization=f(n.clientId,n.clientSecret):y.client_id=n.clientId,this.client._request(h({url:n.accessTokenUri,method:"POST",headers:d,body:y},n)).then((function(e){return r.client.createToken(e)}))},x.prototype.getToken=function(e,t){var r=this,n=Object.assign({},this.client.options,t),o=Object.assign({},c);l(n,"accessTokenUri"),n.clientId&&(o.Authorization=f(n.clientId,n.clientSecret));const i={grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion:e};return void 0!==n.scopes&&(i.scope=d(n.scopes)),this.client._request(h({url:n.accessTokenUri,method:"POST",headers:o,body:i},n)).then((function(e){return r.client.createToken(e)}))}},952:e=>{e.exports=function(e,t,r,n){return new Promise((function(o,i){var s=new window.XMLHttpRequest;s.open(e,t),s.onload=function(){return o({status:s.status,body:s.responseText})},s.onerror=s.onabort=function(){return i(new Error(s.statusText||"XHR aborted: "+t))},Object.keys(n).forEach((function(e){s.setRequestHeader(e,n[e])})),s.send(r)}))}},99:(e,t,r)=>{"use strict";r.d(t,{Z:()=>i});var n=r(645),o=r.n(n)()((function(e){return e[1]}));o.push([e.id,"body{background-color:black;font-family:Arial;display:grid;height:100%;margin:0;padding:0}#login{margin:auto;display:none;text-align:center}#login h1{color:#fff}#login h2{color:#fff}#login #login-button{border:none;padding:15px;text-align:center;text-decoration:none;display:inline-block;font-size:18px;margin:4px 2px;border-radius:5px;background-color:#1DB954;color:#fff}#main{min-height:100%;max-height:100%;display:grid;grid-template-rows:1fr auto;grid-template-columns:100%}#main #help{display:none;color:#fff;text-align:center;margin:auto}#main #selector{display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));grid-gap:5px;padding:15px;justify-items:center;overflow-y:scroll;scrollbar-width:0}#main #selector::-webkit-scrollbar{display:none}#main #selector .selector-element{color:#fff;justify-content:center}#main #selector .selector-element img{max-height:200px;max-width:200px;display:block;margin:auto}#main #selector .selector-element h1{color:silver;font-size:12;margin:5px;margin-top:3px}#main #selector .selector-element h2{color:silver;font-size:10;margin:5px}#main #selector .selector-element h3{margin:5px;margin-bottom:0px;font-size:15}#main #player{display:grid;grid-template-columns:auto 1fr;max-height:100px}#main #player #artwork-container{min-width:100px;max-height:inherit}#main #player #artwork-container #artwork{max-height:100%;width:auto}#main #player #track-info{display:grid;grid-template-rows:1fr 1fr 1fr;grid-template-columns:1fr;grid-column-gap:30px;color:#fff;max-height:inherit}#main #player #track-info #track-title{font-size:30px;padding:0px;margin:0px;color:#fff}#main #player #track-info #track-artist{font-size:25px;padding:0px;margin:0px;color:silver}#main #player #track-info .track-text-container{display:flex;align-items:center;margin:0px;margin-left:10px}\n",""]);const i=o},645:e=>{"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var r=e(t);return t[2]?"@media ".concat(t[2]," {").concat(r,"}"):r})).join("")},t.i=function(e,r,n){"string"==typeof e&&(e=[[null,e,""]]);var o={};if(n)for(var i=0;i<this.length;i++){var s=this[i][0];null!=s&&(o[s]=!0)}for(var a=0;a<e.length;a++){var c=[].concat(e[a]);n&&o[c[0]]||(r&&(c[2]?c[2]="".concat(r," and ").concat(c[2]):c[2]=r),t.push(c))}},t}},587:e=>{"use strict";function t(e,t){return Object.prototype.hasOwnProperty.call(e,t)}e.exports=function(e,r,n,o){r=r||"&",n=n||"=";var i={};if("string"!=typeof e||0===e.length)return i;var s=/\+/g;e=e.split(r);var a=1e3;o&&"number"==typeof o.maxKeys&&(a=o.maxKeys);var c=e.length;a>0&&c>a&&(c=a);for(var u=0;u<c;++u){var l,p,d,y,f=e[u].replace(s,"%20"),m=f.indexOf(n);m>=0?(l=f.substr(0,m),p=f.substr(m+1)):(l=f,p=""),d=decodeURIComponent(l),y=decodeURIComponent(p),t(i,d)?Array.isArray(i[d])?i[d].push(y):i[d]=[i[d],y]:i[d]=y}return i}},361:e=>{"use strict";var t=function(e){switch(typeof e){case"string":return e;case"boolean":return e?"true":"false";case"number":return isFinite(e)?e:"";default:return""}};e.exports=function(e,r,n,o){return r=r||"&",n=n||"=",null===e&&(e=void 0),"object"==typeof e?Object.keys(e).map((function(o){var i=encodeURIComponent(t(o))+n;return Array.isArray(e[o])?e[o].map((function(e){return i+encodeURIComponent(t(e))})).join(r):i+encodeURIComponent(t(e[o]))})).join(r):o?encodeURIComponent(t(o))+n+encodeURIComponent(t(e)):""}},673:(e,t,r)=>{"use strict";t.decode=t.parse=r(587),t.encode=t.stringify=r(361)},754:e=>{"use strict";var t,r,n,o,i,s,a,c,u=(t="https://api.spotify.com/v1",r=null,n=null,o=function(e,t){return e.abort=t,e},i=function(){var e=Array.prototype.slice.call(arguments),t=e[0],r=e.slice(1);return t=t||{},r.forEach((function(e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})),t},s=function(e,t){var i=new XMLHttpRequest,s=function(n,o){var s=e.type||"GET";if(i.open(s,function(e,t){var r="";for(var n in t)if(t.hasOwnProperty(n)){var o=t[n];r+=encodeURIComponent(n)+"="+encodeURIComponent(o)+"&"}return r.length>0&&(e=e+"?"+(r=r.substring(0,r.length-1))),e}(e.url,e.params)),r&&i.setRequestHeader("Authorization","Bearer "+r),i.onreadystatechange=function(){if(4===i.readyState){var e=null;try{e=i.responseText?JSON.parse(i.responseText):""}catch(e){console.error(e)}i.status>=200&&i.status<300?function(e){n&&n(e),t&&t(null,e)}(e):(o&&o(i),t&&t(i,null))}},"GET"===s)i.send(null);else{var a=null;e.postData&&("image/jpeg"===e.contentType?(a=e.postData,i.setRequestHeader("Content-Type",e.contentType)):(a=JSON.stringify(e.postData),i.setRequestHeader("Content-Type","application/json"))),i.send(a)}};return t?(s(),null):function(e,t){var r;if(null!==n){var s=n.defer();e((function(e){s.resolve(e)}),(function(e){s.reject(e)})),r=s.promise}else window.Promise&&(r=new window.Promise(e));return r?new o(r,(function(){i.abort()})):null}(s)},a=function(e,t,r,n){var o={},a=null;return"object"==typeof t?(o=t,a=r):"function"==typeof t&&(a=t),"GET"!==(e.type||"GET")&&e.postData&&!n?e.postData=i(e.postData,o):e.params=i(e.params,o),s(e,a)},((c=function(){}).prototype={constructor:u}).getGeneric=function(e,t){return a({url:e},t)},c.prototype.getMe=function(e,r){return a({url:t+"/me"},e,r)},c.prototype.getMySavedTracks=function(e,r){return a({url:t+"/me/tracks"},e,r)},c.prototype.addToMySavedTracks=function(e,r,n){return a({url:t+"/me/tracks",type:"PUT",postData:e},r,n)},c.prototype.removeFromMySavedTracks=function(e,r,n){return a({url:t+"/me/tracks",type:"DELETE",postData:e},r,n)},c.prototype.containsMySavedTracks=function(e,r,n){var o={url:t+"/me/tracks/contains",params:{ids:e.join(",")}};return a(o,r,n)},c.prototype.getMySavedAlbums=function(e,r){return a({url:t+"/me/albums"},e,r)},c.prototype.addToMySavedAlbums=function(e,r,n){return a({url:t+"/me/albums",type:"PUT",postData:e},r,n)},c.prototype.removeFromMySavedAlbums=function(e,r,n){return a({url:t+"/me/albums",type:"DELETE",postData:e},r,n)},c.prototype.containsMySavedAlbums=function(e,r,n){var o={url:t+"/me/albums/contains",params:{ids:e.join(",")}};return a(o,r,n)},c.prototype.getMyTopArtists=function(e,r){return a({url:t+"/me/top/artists"},e,r)},c.prototype.getMyTopTracks=function(e,r){return a({url:t+"/me/top/tracks"},e,r)},c.prototype.getMyRecentlyPlayedTracks=function(e,r){return a({url:t+"/me/player/recently-played"},e,r)},c.prototype.followUsers=function(e,r){var n={url:t+"/me/following/",type:"PUT",params:{ids:e.join(","),type:"user"}};return a(n,r)},c.prototype.followArtists=function(e,r){var n={url:t+"/me/following/",type:"PUT",params:{ids:e.join(","),type:"artist"}};return a(n,r)},c.prototype.followPlaylist=function(e,r,n){return a({url:t+"/playlists/"+e+"/followers",type:"PUT",postData:{}},r,n)},c.prototype.unfollowUsers=function(e,r){var n={url:t+"/me/following/",type:"DELETE",params:{ids:e.join(","),type:"user"}};return a(n,r)},c.prototype.unfollowArtists=function(e,r){var n={url:t+"/me/following/",type:"DELETE",params:{ids:e.join(","),type:"artist"}};return a(n,r)},c.prototype.unfollowPlaylist=function(e,r){return a({url:t+"/playlists/"+e+"/followers",type:"DELETE"},r)},c.prototype.isFollowingUsers=function(e,r){var n={url:t+"/me/following/contains",type:"GET",params:{ids:e.join(","),type:"user"}};return a(n,r)},c.prototype.isFollowingArtists=function(e,r){var n={url:t+"/me/following/contains",type:"GET",params:{ids:e.join(","),type:"artist"}};return a(n,r)},c.prototype.areFollowingPlaylist=function(e,r,n){var o={url:t+"/playlists/"+e+"/followers/contains",type:"GET",params:{ids:r.join(",")}};return a(o,n)},c.prototype.getFollowedArtists=function(e,r){return a({url:t+"/me/following",type:"GET",params:{type:"artist"}},e,r)},c.prototype.getUser=function(e,r,n){var o={url:t+"/users/"+encodeURIComponent(e)};return a(o,r,n)},c.prototype.getUserPlaylists=function(e,r,n){var o;return"string"==typeof e?o={url:t+"/users/"+encodeURIComponent(e)+"/playlists"}:(o={url:t+"/me/playlists"},n=r,r=e),a(o,r,n)},c.prototype.getPlaylist=function(e,r,n){return a({url:t+"/playlists/"+e},r,n)},c.prototype.getPlaylistTracks=function(e,r,n){return a({url:t+"/playlists/"+e+"/tracks"},r,n)},c.prototype.getPlaylistCoverImage=function(e,r){return a({url:t+"/playlists/"+e+"/images"},r)},c.prototype.createPlaylist=function(e,r,n){var o={url:t+"/users/"+encodeURIComponent(e)+"/playlists",type:"POST",postData:r};return a(o,r,n)},c.prototype.changePlaylistDetails=function(e,r,n){return a({url:t+"/playlists/"+e,type:"PUT",postData:r},r,n)},c.prototype.addTracksToPlaylist=function(e,r,n,o){return a({url:t+"/playlists/"+e+"/tracks",type:"POST",postData:{uris:r}},n,o,!0)},c.prototype.replaceTracksInPlaylist=function(e,r,n){return a({url:t+"/playlists/"+e+"/tracks",type:"PUT",postData:{uris:r}},{},n)},c.prototype.reorderTracksInPlaylist=function(e,r,n,o,i){return a({url:t+"/playlists/"+e+"/tracks",type:"PUT",postData:{range_start:r,insert_before:n}},o,i)},c.prototype.removeTracksFromPlaylist=function(e,r,n){var o=r.map((function(e){return"string"==typeof e?{uri:e}:e}));return a({url:t+"/playlists/"+e+"/tracks",type:"DELETE",postData:{tracks:o}},{},n)},c.prototype.removeTracksFromPlaylistWithSnapshotId=function(e,r,n,o){var i=r.map((function(e){return"string"==typeof e?{uri:e}:e}));return a({url:t+"/playlists/"+e+"/tracks",type:"DELETE",postData:{tracks:i,snapshot_id:n}},{},o)},c.prototype.removeTracksFromPlaylistInPositions=function(e,r,n,o){return a({url:t+"/playlists/"+e+"/tracks",type:"DELETE",postData:{positions:r,snapshot_id:n}},{},o)},c.prototype.uploadCustomPlaylistCoverImage=function(e,r,n){var o={url:t+"/playlists/"+e+"/images",type:"PUT",postData:r.replace(/^data:image\/jpeg;base64,/,""),contentType:"image/jpeg"};return a(o,{},n)},c.prototype.getAlbum=function(e,r,n){return a({url:t+"/albums/"+e},r,n)},c.prototype.getAlbumTracks=function(e,r,n){return a({url:t+"/albums/"+e+"/tracks"},r,n)},c.prototype.getAlbums=function(e,r,n){var o={url:t+"/albums/",params:{ids:e.join(",")}};return a(o,r,n)},c.prototype.getTrack=function(e,r,n){var o={};return o.url=t+"/tracks/"+e,a(o,r,n)},c.prototype.getTracks=function(e,r,n){var o={url:t+"/tracks/",params:{ids:e.join(",")}};return a(o,r,n)},c.prototype.getArtist=function(e,r,n){return a({url:t+"/artists/"+e},r,n)},c.prototype.getArtists=function(e,r,n){var o={url:t+"/artists/",params:{ids:e.join(",")}};return a(o,r,n)},c.prototype.getArtistAlbums=function(e,r,n){return a({url:t+"/artists/"+e+"/albums"},r,n)},c.prototype.getArtistTopTracks=function(e,r,n,o){return a({url:t+"/artists/"+e+"/top-tracks",params:{country:r}},n,o)},c.prototype.getArtistRelatedArtists=function(e,r,n){return a({url:t+"/artists/"+e+"/related-artists"},r,n)},c.prototype.getFeaturedPlaylists=function(e,r){return a({url:t+"/browse/featured-playlists"},e,r)},c.prototype.getNewReleases=function(e,r){return a({url:t+"/browse/new-releases"},e,r)},c.prototype.getCategories=function(e,r){return a({url:t+"/browse/categories"},e,r)},c.prototype.getCategory=function(e,r,n){return a({url:t+"/browse/categories/"+e},r,n)},c.prototype.getCategoryPlaylists=function(e,r,n){return a({url:t+"/browse/categories/"+e+"/playlists"},r,n)},c.prototype.search=function(e,r,n,o){var i={url:t+"/search/",params:{q:e,type:r.join(",")}};return a(i,n,o)},c.prototype.searchAlbums=function(e,t,r){return this.search(e,["album"],t,r)},c.prototype.searchArtists=function(e,t,r){return this.search(e,["artist"],t,r)},c.prototype.searchTracks=function(e,t,r){return this.search(e,["track"],t,r)},c.prototype.searchPlaylists=function(e,t,r){return this.search(e,["playlist"],t,r)},c.prototype.searchShows=function(e,t,r){return this.search(e,["show"],t,r)},c.prototype.searchEpisodes=function(e,t,r){return this.search(e,["episode"],t,r)},c.prototype.getAudioFeaturesForTrack=function(e,r){var n={};return n.url=t+"/audio-features/"+e,a(n,{},r)},c.prototype.getAudioFeaturesForTracks=function(e,r){return a({url:t+"/audio-features",params:{ids:e}},{},r)},c.prototype.getAudioAnalysisForTrack=function(e,r){var n={};return n.url=t+"/audio-analysis/"+e,a(n,{},r)},c.prototype.getRecommendations=function(e,r){return a({url:t+"/recommendations"},e,r)},c.prototype.getAvailableGenreSeeds=function(e){return a({url:t+"/recommendations/available-genre-seeds"},{},e)},c.prototype.getMyDevices=function(e){return a({url:t+"/me/player/devices"},{},e)},c.prototype.getMyCurrentPlaybackState=function(e,r){return a({url:t+"/me/player"},e,r)},c.prototype.getMyCurrentPlayingTrack=function(e,r){return a({url:t+"/me/player/currently-playing"},e,r)},c.prototype.transferMyPlayback=function(e,r,n){var o=r||{};return o.device_ids=e,a({type:"PUT",url:t+"/me/player",postData:o},r,n)},c.prototype.play=function(e,r){var n="device_id"in(e=e||{})?{device_id:e.device_id}:null,o={};return["context_uri","uris","offset","position_ms"].forEach((function(t){t in e&&(o[t]=e[t])})),a({type:"PUT",url:t+"/me/player/play",params:n,postData:o},"function"==typeof e?e:{},r)},c.prototype.queue=function(e,r,n){var o="device_id"in(r=r||{})?{uri:e,device_id:r.device_id}:{uri:e};return a({type:"POST",url:t+"/me/player/queue",params:o},r,n)},c.prototype.pause=function(e,r){var n="device_id"in(e=e||{})?{device_id:e.device_id}:null;return a({type:"PUT",url:t+"/me/player/pause",params:n},e,r)},c.prototype.skipToNext=function(e,r){var n="device_id"in(e=e||{})?{device_id:e.device_id}:null;return a({type:"POST",url:t+"/me/player/next",params:n},e,r)},c.prototype.skipToPrevious=function(e,r){var n="device_id"in(e=e||{})?{device_id:e.device_id}:null;return a({type:"POST",url:t+"/me/player/previous",params:n},e,r)},c.prototype.seek=function(e,r,n){var o={position_ms:e};return"device_id"in(r=r||{})&&(o.device_id=r.device_id),a({type:"PUT",url:t+"/me/player/seek",params:o},r,n)},c.prototype.setRepeat=function(e,r,n){var o={state:e};return"device_id"in(r=r||{})&&(o.device_id=r.device_id),a({type:"PUT",url:t+"/me/player/repeat",params:o},r,n)},c.prototype.setVolume=function(e,r,n){var o={volume_percent:e};return"device_id"in(r=r||{})&&(o.device_id=r.device_id),a({type:"PUT",url:t+"/me/player/volume",params:o},r,n)},c.prototype.setShuffle=function(e,r,n){var o={state:e};return"device_id"in(r=r||{})&&(o.device_id=r.device_id),a({type:"PUT",url:t+"/me/player/shuffle",params:o},r,n)},c.prototype.getShow=function(e,r,n){var o={};return o.url=t+"/shows/"+e,a(o,r,n)},c.prototype.getShows=function(e,r,n){var o={url:t+"/shows/",params:{ids:e.join(",")}};return a(o,r,n)},c.prototype.getMySavedShows=function(e,r){return a({url:t+"/me/shows"},e,r)},c.prototype.addToMySavedShows=function(e,r,n){return a({url:t+"/me/shows",type:"PUT",postData:e},r,n)},c.prototype.removeFromMySavedShows=function(e,r,n){return a({url:t+"/me/shows",type:"DELETE",postData:e},r,n)},c.prototype.containsMySavedShows=function(e,r,n){var o={url:t+"/me/shows/contains",params:{ids:e.join(",")}};return a(o,r,n)},c.prototype.getShowEpisodes=function(e,r,n){return a({url:t+"/shows/"+e+"/episodes"},r,n)},c.prototype.getEpisode=function(e,r,n){var o={};return o.url=t+"/episodes/"+e,a(o,r,n)},c.prototype.getEpisodes=function(e,r,n){var o={url:t+"/episodes/",params:{ids:e.join(",")}};return a(o,r,n)},c.prototype.getAccessToken=function(){return r},c.prototype.setAccessToken=function(e){r=e},c.prototype.setPromiseImplementation=function(e){var t=!1;try{var r=new e((function(e){e()}));"function"==typeof r.then&&"function"==typeof r.catch&&(t=!0)}catch(e){console.error(e)}if(!t)throw new Error("Unsupported implementation of Promises/A+");n=e},c);"object"==typeof e.exports&&(e.exports=u)},379:(e,t,r)=>{"use strict";var n,o=function(){var e={};return function(t){if(void 0===e[t]){var r=document.querySelector(t);if(window.HTMLIFrameElement&&r instanceof window.HTMLIFrameElement)try{r=r.contentDocument.head}catch(e){r=null}e[t]=r}return e[t]}}(),i=[];function s(e){for(var t=-1,r=0;r<i.length;r++)if(i[r].identifier===e){t=r;break}return t}function a(e,t){for(var r={},n=[],o=0;o<e.length;o++){var a=e[o],c=t.base?a[0]+t.base:a[0],u=r[c]||0,l="".concat(c," ").concat(u);r[c]=u+1;var p=s(l),d={css:a[1],media:a[2],sourceMap:a[3]};-1!==p?(i[p].references++,i[p].updater(d)):i.push({identifier:l,updater:m(d,t),references:1}),n.push(l)}return n}function c(e){var t=document.createElement("style"),n=e.attributes||{};if(void 0===n.nonce){var i=r.nc;i&&(n.nonce=i)}if(Object.keys(n).forEach((function(e){t.setAttribute(e,n[e])})),"function"==typeof e.insert)e.insert(t);else{var s=o(e.insert||"head");if(!s)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");s.appendChild(t)}return t}var u,l=(u=[],function(e,t){return u[e]=t,u.filter(Boolean).join("\n")});function p(e,t,r,n){var o=r?"":n.media?"@media ".concat(n.media," {").concat(n.css,"}"):n.css;if(e.styleSheet)e.styleSheet.cssText=l(t,o);else{var i=document.createTextNode(o),s=e.childNodes;s[t]&&e.removeChild(s[t]),s.length?e.insertBefore(i,s[t]):e.appendChild(i)}}function d(e,t,r){var n=r.css,o=r.media,i=r.sourceMap;if(o?e.setAttribute("media",o):e.removeAttribute("media"),i&&"undefined"!=typeof btoa&&(n+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}var y=null,f=0;function m(e,t){var r,n,o;if(t.singleton){var i=f++;r=y||(y=c(t)),n=p.bind(null,r,i,!1),o=p.bind(null,r,i,!0)}else r=c(t),n=d.bind(null,r,t),o=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(r)};return n(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;n(e=t)}else o()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===n&&(n=Boolean(window&&document&&document.all&&!window.atob)),n));var r=a(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var n=0;n<r.length;n++){var o=s(r[n]);i[o].references--}for(var c=a(e,t),u=0;u<r.length;u++){var l=s(r[u]);0===i[l].references&&(i[l].updater(),i.splice(l,1))}r=c}}}},679:()=>{}},t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={id:n,exports:{}};return e[n](o,o.exports,r),o.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";var e=r(379),t=r.n(e),n=r(99);t()(n.Z,{insert:"head",singleton:!1}),n.Z.locals;const o=r(977),i=r(754);let s,a,c=["acousticness","danceability","energy","instrumentalness","liveness","loudness","speechiness","valence","tempo"],u=e=>{let t=[];return e.artists.forEach((e=>{t.push(e.name)})),t.join(", ")},l=()=>{let e;f.getMyCurrentPlayingTrack().then((t=>{e=t;let r=t.item.album.images[0].url;document.querySelector("#artwork").src=r,document.getElementById("track-artist").textContent=u(t.item);let n=t.item.name;document.getElementById("track-title").textContent=n;let o=e.item.id;return o!==s&&p(),s=o,f.getAudioFeaturesForTrack(s)}),(e=>{console.log(e)})).then((e=>{document.getElementById("help").style.display="none",document.getElementById("selector").style.display="grid",a=e,0===document.querySelectorAll("#selector > .selector-element").length&&p()}),(e=>{console.log(e),document.getElementById("help").style.display="block",document.getElementById("selector").style.display="none"}))},p=()=>{if(!s)return;let e=document.querySelectorAll("#selector > .selector-element");if(!e||0===e.length)for(let t=0;t<12;t++){let t=document.getElementById("selector-element-template").content,r=document.importNode(t,!0);document.getElementById("selector").appendChild(r),e=document.querySelectorAll("#selector > .selector-element")}e.forEach((e=>{d(e)}))},d=e=>{let t,r=0;for(;0==r;)t=c[Math.floor(Math.random()*c.length)],r=a[t];let n=Math.random()>.5?1:-1,o=r+.1*Math.abs(r)*n,i=1==n?"min_":"max_";i+=t;let l={seed_tracks:[s],limit:1};l[i]=o,f.getRecommendations(l).then((r=>{let o=r.tracks[0];if(!o)return void p(e);e.querySelector("[name=artwork]").src=o.album.images[1].url,e.querySelector("[name=artist]").innerText=u(o),e.querySelector("[name=title]").innerText=o.name;let i=1==n?"More":"Less";i+=" "+t,e.querySelector("[name=feature]").innerText=i,e.dataset.trackUri=o.uri,e.onclick=y}),(e=>{console.log(e)}))},y=e=>{let t,r;e.srcElement.dataset.trackUri?(t=e.srcElement.dataset.trackUri,r=e.srcElement):(t=e.srcElement.parentElement.dataset.trackUri,r=e.srcElement.parentElement),f.queue(t).then((()=>{d(r)}),(e=>{console.log(e)}))};if(location.hash.length>0){let e=new URLSearchParams(location.hash.replace("#","?"));if(e.get("state")===localStorage.state){let t=e.get("expires_in"),r=Math.floor(Date.now()/1e3);localStorage.expires=r+parseInt(t)-120,localStorage.token=e.get("access_token")}document.location.replace("/")}if(void 0===localStorage.token||void 0===localStorage.expires||Math.floor(Date.now()/1e3)>=parseInt(localStorage.expires)){let e=(e=>{let t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890",r="";for(let e=0;e<32;e++)r+=t[Math.floor(Math.random()*t.length)];return r})();localStorage.state=e;let t=new o({clientId:"d187382ee43545e1aec7d557fb80b074",authorizationUri:"https://accounts.spotify.com/authorize",redirectUri:document.location.href,scopes:["user-read-currently-playing","user-modify-playback-state"],state:e});document.getElementById("main").style.display="none",document.getElementById("login").style.display="block",document.getElementById("login-button").onclick=function(){window.location.replace(t.token.getUri())}}else{var f=new i;f.setAccessToken(localStorage.token),l(),setInterval(l,3e3)}})()})();