import fetch from "node-fetch";

const getSpotifyPlaylistId = (playlistUrl) => {
  const parts = playlistUrl.split("/");

  return parts[parts.length - 1];
};

const getAuthenticationToken = async (req, res) => {
  try {
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
  } catch (err) {
    throw new Error("Error getting Spotify token");
  }
};

const createSpotifyPlaylist = async (name, authenticationToken) => {
  try {
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
  } catch (err) {
    throw new Error("Error creating Spotify playlist");
  }
};

const addTracksToSpotifyPlaylist = async (
  playlistId,
  trackIds,
  authenticationToken
) => {
  try {
    const trackURIs = trackIds.map((trackId) => `spotify:track:${trackId}`);

    await fetch(
      `${process.env.SPOTIFY_API_URL}/playlists/${playlistId}/tracks`,
      {
        method: "POST",
        body: JSON.stringify({
          uris: trackURIs,
          position: 0,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authenticationToken,
        },
      }
    );
  } catch (err) {
    throw new Error("Error adding tracks to playlist");
  }
};

const updateSpotifyPlaylistTracks = async (
  playlistId,
  trackIds,
  authenticationToken
) => {
  try {
    const trackURIs = trackIds.map((trackId) => `spotify:track:${trackId}`);

    await fetch(
      `${process.env.SPOTIFY_API_URL}/playlists/${playlistId}/tracks`,
      {
        method: "PUT",
        body: JSON.stringify({
          uris: trackURIs,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authenticationToken,
        },
      }
    );
  } catch (err) {
    throw new Error("Error updating Spotify tracks");
  }
};

const updateSpotifyPlaylist = async (playlistId, name, authenticationToken) => {
  try {
    await fetch(`${process.env.SPOTIFY_API_URL}/playlists/${playlistId}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authenticationToken,
      },
    });
  } catch (err) {
    throw new Error("Error updating Spotify playlist");
  }
};

const getSpotifyPlaylist = async (playlistId, spotifyToken) => {
  try {
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
          url: item.track.preview_url,
        };
      }),
      url: playlist.external_urls.spotify,
    };

    return playlistOutput;
  } catch (err) {
    throw new Error("Error getting Spotify playlist");
  }
};

const getSpotifyTrack = async (trackId, spotifyToken) => {
  if (!trackId) return;

  try {
    const spotifyResponse = await fetch(
      `${process.env.SPOTIFY_API_URL}/tracks/${trackId}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + spotifyToken,
        },
      }
    );

    const track = await spotifyResponse.json();

    let artists = "";

    track.artists.forEach((artist, index) => {
      if (index + 1 === track.artists.length) {
        artists = artists.concat(artist.name);
      } else {
        artists = artists.concat(`${artist.name}, `);
      }
    });

    return {
      artists,
      id: track.id,
      imageUrl: track.album.images[track.album.images.length - 1].url,
      name: track.name,
      url: track.preview_url,
    };
  } catch (err) {
    throw new Error("Error getting Spotify track");
  }
};

export {
  addTracksToSpotifyPlaylist,
  createSpotifyPlaylist,
  getSpotifyPlaylistId,
  getSpotifyPlaylist,
  getSpotifyTrack,
  getAuthenticationToken,
  updateSpotifyPlaylist,
  updateSpotifyPlaylistTracks,
};
