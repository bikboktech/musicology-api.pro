/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

import querystring from 'querystring';

var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
var redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';


const login = async (req, res) => {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'playlist-modify-private playlist-modify-public';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
}


const callback = async (req, res) => {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var data = {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    };
    var formData = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }
    await fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        body: new URLSearchParams(formData),
        headers: {
          'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        }
      }).then((response) => {
        return response.json()
      }).then((body) => {
        console.log(body);
        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      })
  }
}


const refreshToken = async (req, res) => {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var data = {
    grant_type: 'refresh_token',
    refresh_token: refresh_token
  };
  var formData = new FormData();
  for (var key in data) {
    formData.append(key, data[key]);
  }

  await fetch(
    'https://accounts.spotify.com/api/token',
    {
      method: 'POST',
      body: new URLSearchParams(formData),
      headers: { 'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret) }
    }
  ).then((response) => {
    return response.json()
  }).then((body) => {
    var access_token = body.access_token;
    res.send({
      'access_token': access_token
    });
  })
}


export { login, callback, refreshToken };
