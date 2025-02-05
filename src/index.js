
require('dotenv').config();
var express = require('express');
var querystring = require('querystring');
const SpotifyWebApi = require('spotify-web-api-node');

var tokenEndPoint = 'https://accounts.spotify.com/api/token';
const app = express();
app.use(express.static('public')); 

const spotifyApi = new SpotifyWebApi({
    clientId: '4bd6a01fade9432faf647609c95a3368', // process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/callback'//process.env.REDIRECTURL
});

// authorization request
app.get('/login', function (req, res) {
    var scope = ['user-read-private', 'user-read-email'];
    res.redirect(spotifyApi.createAuthorizeURL(scope));
});

// request refresh and access tokens
// after checking the state parameter
app.get('/callback', function (req, res) {
    var code = req.query.code || null;
    var state = req.query.state || null;
    var error = req.query.error;

    if (error) {
        console.error('Error Callback:', error);
        res.send('Error');
        return;
    }

    spotifyApi.authorizationCodeGrant(code).then(data => {
        const accessToken = data.body['access_token'];
        const refreshToken = data.body['refresh_token'];
        const expire = data.body['expries_in'];

        spotifyApi.setAccessToken(accessToken);
        spotifyApi.setRefreshToken(refreshToken);

        console.log(accessToken, refreshToken);
        res.send('Success!');

        setInterval(async () => {
            const data = await spotifyApi.refreshAccessToken();
            const accessTokenRefreshed = data.body['access_token'];
            spotifyApi.setAccessToken(accessTokenRefreshed);
        }, expire / 2 * 1000);
    }).catch(error => {
        console.error('Error Token:', error);
        res.send('Error getting token');
    });
});

app.get('/me')

app.listen(process.env.PORT || 3000, () => {
    console.log('server is running');
});