import fetch from "node-fetch";

const getTracks = async (req, res) => {
  const { context, query } = req;

  let limit = query.limit ?? 20;
  let offset = query.offset ?? 0;
  let search = query.search ?? "";

  const spotifyTrackResponse = await fetch(
    `${process.env.SPOTIFY_API_URL}/search?q=${search}&type=track&limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + context.spotifyToken,
      },
    }
  );

  const trackResults = await spotifyTrackResponse.json();

  const tracks = trackResults.tracks.items;

  const tracksOutput = tracks.map((track) => {
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
  });

  res.status(200).json(tracksOutput || []);
};

export default getTracks;
