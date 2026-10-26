import fetch from "node-fetch";

const getSpotifyPlaylistId = (playlistUrl) => {
  const parts = playlistUrl.split("/");

  return parts[parts.length - 1];
};


const getAuthenticationToken = async () => {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!refreshToken || !clientId || !clientSecret) {
    throw new Error("Missing Spotify OAuth environment variables");
  }

  const response = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }).toString(),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    console.error("Spotify token refresh failed:", {
      status: response.status,
      error: data.error,
      description: data.error_description,
    });

    if (
      response.status === 400 &&
      data.error === "invalid_grant"
    ) {
      console.error(
        "To reauthorize, open https://<api>/spotify/login, then rotate the SPOTIFY_REFRESH_TOKEN secret with the new refresh_token and redeploy."
      );

      throw new Error(
        "Spotify refresh token is invalid or expired; reauthorization is required"
      );
    }

    throw new Error(
      `Spotify token refresh failed with HTTP ${response.status}`
    );
  }

  return data.access_token;
};

const createSpotifyPlaylist = async (name, authenticationToken) => {
  const response = await fetch(
    `${process.env.SPOTIFY_API_URL}/me/playlists`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authenticationToken}`,
      },
      body: JSON.stringify({ name }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Spotify playlist creation failed:", {
      status: response.status,
      error: data.error,
    });

    throw new Error(
      `Spotify playlist creation failed: HTTP ${response.status} - ${
        data.error?.message ?? data.error ?? "Unknown error"
      }`
    );
  }

  return data;
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
      link: track.external_urls.spotify,
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
