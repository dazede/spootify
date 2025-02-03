import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import { Credentials } from './Credentials';
import { RedirectToAuthCodeFlow, GetAccessToken } from './Authorization';
import axios from 'axios';

const App = () => {
  const spotify = Credentials();
  const [token, setToken] = useState('');
  const [genres, setGenres] = useState([]);

  const tokenEndPoint = 'https://accounts.spotify.com/api/token';
  const webAPIUrl = 'https://api.spotify.com/v1/browse/categories?limit=50';
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  const currentToken = {
    get access_token() { return localStorage.getItem('access_token') || null; },
    get refresh_token() { return localStorage.getItem('refresh_token') || null; },
    get expires_in() { return localStorage.getItem('refresh_in') || null },
    get expires() { return localStorage.getItem('expires') || null },
  
    save: function (response) {
      const { access_token, refresh_token, expires_in } = response;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('expires_in', expires_in);
  
      const now = new Date();
      const expiry = new Date(now.getTime() + (expires_in * 1000));
      localStorage.setItem('expires', expiry);
    }
  };
  
  const launchRedirectToAuthCodeFlow = async () => {
     // If we find a code, we're in a callback, do a token exchange
    if (code) {
      console.log("TOKEN EXCHANGE")
      const token = await GetAccessToken(code);
      currentToken.save(token);
    
      // Remove code from URL so we can refresh correctly.
      const url = new URL(window.location.href);
      url.searchParams.delete("code");
    
      const updatedUrl = url.search ? url.href : url.href.replace('?', '');
      window.history.replaceState({}, document.title, updatedUrl);
    }
    
    // If we have a token, we're logged in, so fetch user data
    if (currentToken.access_token) {
      console.log("GET USER DATA")
      const userData = await fetchProfile();
      populateUI(userData); 
    }
    
    // Otherwise we're not logged in
    if (!currentToken.access_token) {
      console.log("REDIRECT TO AUTH")
      try {
        await RedirectToAuthCodeFlow(spotify.ClientId);
      } catch (error) {
          console.error("Error on Redirect:", error);
      }
    }
  };
 
  const fetchProfile = async () =>  {  
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET", headers: { Authorization: `Bearer ${currentToken.access_token}` }
    });

    return await result.json();
  }

  // Update UI with profile data
  const populateUI = (profile) => {
    console.log("POPULATING PROFILE");

    document.getElementById("displayName").innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar").appendChild(profileImage);
        document.getElementById("imgUrl").innerText = profile.images[0].url;
    }
    document.getElementById("id").innerText = profile.id;
    document.getElementById("email").innerText = profile.email;
    document.getElementById("uri").innerText = profile.uri;
    document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url").innerText = profile.href;
    document.getElementById("url").setAttribute("href", profile.href);
  }

  /*
  const populateGenreDropdown = () => {
    // Get data from API call 
    console.log('RENDERING APP.JS');

    useEffect(() => {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');

      axios(tokenEndPoint, {
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded',
          'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)
        },
        data: params,
        method: 'POST'
      })
      .then(tokenResponse => {
        console.log(tokenResponse.data.access_token);
        setToken(tokenResponse.data.access_token);

      axios(webAPIUrl, {
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token},
        method: 'GET'
      })
      .then (genreResponse => {
        console.log(genreResponse.data.categories.items);
        setGenres(genreResponse.data.categories.items);
      });
      });
    }, []);
  }*/

  (async () => {
    console.log('AUTHORIZING');
    try {
      await launchRedirectToAuthCodeFlow();
      console.log('AUTHORIZATION SUCCESS');
    } catch (error) {
      console.error("Error on Auhtorization:", error);
      console.log('AUTHORIZATION FAIL');
    }
    
  })();

  return(
    <form onSubmit={() => {}}>
      <h1>App Title</h1>
      <div>
        <Dropdown options={genres}/>

      </div>
    </form>
    
  );
}

export default App;
