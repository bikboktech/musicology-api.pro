import fetch from "node-fetch";

const getSpotifyPlaylistId = (playlistUrl) => {
  const parts = playlistUrl.split("/");

  return parts[parts.length - 1];
};

const getAuthenticationToken = async (req, res) => {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        new Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
    },
  });

  const spotifyToken = await response.json();

  return spotifyToken.access_token;
};

const createSpotifyPlaylist = async (name, authenticationToken) => {
  const playlistResponse = await fetch(
    `${process.env.SPOTIFY_API_URL}/users/${process.env.SPOTIFY_USER_ID}/playlists`,
    {
      method: "POST",
      body: JSON.stringify({
        name: name,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authenticationToken,
      },
    }
  ).catch((err) => console.log(err));

  const playlist = await playlistResponse.json();

  return playlist;
};

const addTracksToSpotifyPlaylist = async (
  playlistId,
  trackIds,
  authenticationToken
) => {
  console.log(playlistId);
  const trackURIs = trackIds.map((trackId) => `spotify:track:${trackId}`);

  await fetch(`${process.env.SPOTIFY_API_URL}/playlists/${playlistId}/tracks`, {
    method: "POST",
    body: JSON.stringify({
      uris: trackURIs,
      position: 0,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authenticationToken,
    },
  }).catch((err) => console.log(err));

  console.log("SUCCESS addTracksToSpotifyPlaylist");
};

const updateSpotifyPlaylistTracks = async (
  playlistId,
  trackIds,
  authenticationToken
) => {
  console.log(playlistId)
  const trackURIs = trackIds.map((trackId) => `spotify:track:${trackId}`);

  await fetch(`${process.env.SPOTIFY_API_URL}/playlists/${playlistId}/tracks`, {
    method: "PUT",
    body: JSON.stringify({
      uris: trackURIs,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authenticationToken,
    },
  }).catch((err) => console.log(err));

  console.log("SUCCESS updateSpotifyPlaylistTracks");
};

const updateSpotifyPlaylist = async (playlistId, name, authenticationToken) => {
  console.log(playlistId, name);
  await fetch(`${process.env.SPOTIFY_API_URL}/playlists/${playlistId}`, {
    method: "PUT",
    body: JSON.stringify({
      name,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authenticationToken,
    },
  }).catch((err) => console.log(err));
};

const getSpotifyPlaylist = async (playlistId, spotifyToken) => {
  const spotifyResponse = await fetch(
    `${process.env.SPOTIFY_API_URL}/playlists/${playlistId}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + spotifyToken,
      },
    }
  );

  const playlist = await spotifyResponse.json();
  const playlistOutput = {
    id: playlist.id,
    name: playlist.name,
    tracks: playlist.tracks?.items.map((item) => {
      let artists = "";

      item.track.artists.forEach((artist, index) => {
        if (index + 1 === item.track.artists.length) {
          artists = artists.concat(artist.name);
        } else {
          artists = artists.concat(`${artist.name}, `);
        }
      });

      return {
        artists,
        id: item.track.id,
        imageUrl:
          item.track.album.images[item.track.album.images.length - 1].url,
        name: item.track.name,
      };
    }),
    // url: playlist.external_urls.spotify,
  };

  return playlistOutput;
};

export {
  addTracksToSpotifyPlaylist,
  createSpotifyPlaylist,
  getSpotifyPlaylistId,
  getSpotifyPlaylist,
  getAuthenticationToken,
  updateSpotifyPlaylist,
  updateSpotifyPlaylistTracks,
};
