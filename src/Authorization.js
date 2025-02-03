//PKCE authorization flow
const redirectUri = 'http://localhost:3000/callback';
const tokenEndPoint = 'https://accounts.spotify.com/api/token';

// Redirect to Spotify authorization page
const RedirectToAuthCodeFlow = async (clientId) => {
    const codeVerifier = generateRandomString(128);
    let codeChallenge;

    try {
        codeChallenge = await generateCodeChallenge(codeVerifier);
    } catch (error) {
        console.error("Error on Redirect:", error);
        return;
    }

    window.localStorage.setItem('code_verifier', codeVerifier);

    const authUrl = new URL("https://accounts.spotify.com/authorize")
    const params =  {
        response_type: 'code',
        client_id: clientId,
        scope: 'user-read-private user-read-email',
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
}

// Get access token for code
const GetAccessToken = async (clientId, code) => {
    const verifier = localStorage.getItem("verifier");

    const result = await fetch(tokenEndPoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            code_verifier: verifier,
          }),
    });

    return await result.json();
}

//---------HELPERS---------//

// code verifier
// returns a high-entropy cryptographic random string
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  }
  
// code challenge
// hash the code verifier using the SHA256 algorithm
 // return base64 representation of the digest
const generateCodeChallenge = async (input) => {
    const data = new TextEncoder().encode(input);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
  }

export  {RedirectToAuthCodeFlow, GetAccessToken};