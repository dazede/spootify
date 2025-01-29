import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import { Credentials } from './Credentials';
import axios from 'axios';

const App = () => {

  const spotify = Credentials();

  console.log('RENDERING APP.JS');

  const data = [
    {value: 1, name: 'A'},
    {value: 2, name: 'B'},
    {value: 3, name: 'C'},
  ];

  const [token, setToken] = useState('');
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    axios('https://accounts.spotify.com/api/token', {
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

    axios('https://api.spotify.com/v1/browse/categories', {
      headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token},
      method: 'GET'
    })
    .then (genreResponse => {
      console.log(genreResponse.data.categories.items);
      setGenres(genreResponse.data.categories.items);
    });

    });
  }, []);

  return(
    <form onSubmit={() => {}}>
      <div>
        <Dropdown options={genres}/>
      </div>
    </form>
    
  );
}

export default App;
