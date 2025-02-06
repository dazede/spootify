
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.options('*', cors());

const spotifyApi = new SpotifyWebApi({
    clientId: '4bd6a01fade9432faf647609c95a3368', // process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://localhost:5000/callback'//process.env.REDIRECTURL
});

// authorization request
app.get('/login', function (req, res) {
    console.log("starting login");
    var scope = ['user-read-private', 'user-read-email'];
    res.json(spotifyApi.createAuthorizeURL(scope));
});

// request refresh and access tokens
// after checking the state parameter
app.get('/callback', function (req, res) {
    console.log("starting callback");
    var code = req.query.code || null;
    var state = req.query.state || null;
    var error = req.query.error;

    if (error) {
        console.error('Error Callback:', error);
        res.send('Error');
        return;
    }

    spotifyApi.authorizationCodeGrant(code)
        .then(data => {
            console.log('INITIALISING TOKENS');
            const accessToken = data.body['access_token'];
            const refreshToken = data.body['refresh_token'];
            const expire = data.body['expries_in'];

            spotifyApi.setAccessToken(accessToken);
            spotifyApi.setRefreshToken(refreshToken);

            console.log('ATTEMPTING REDIRECT');
            res.redirect('http://localhost:3000');

            /*
            setInterval(async () => {
                console.log('SET INTERVAL');
                const data = await spotifyApi.refreshAccessToken();
                const accessTokenRefreshed = data.body['access_token'];
                spotifyApi.setAccessToken(accessTokenRefreshed);
            }, expire / 2 * 1000);*/
        }).catch( error => {
        console.error('Error Token:', error);
        res.send('Error getting token');
        return;
        });
});

app.get('/userData', function (req, res) {
    console.log('GETTING USER DATA')
    spotifyApi.getMe()
        .then(function (data) {
            console.log('User', data.body);
            res.send(data.body);
        }).catch(error => {
            console.log('Error User Data:', error);
            res.send('Error Getting User Data');
        });
});

app.listen(process.env.PORT || 5000, () => {
    console.log('server is running');
});