import fetch from "node-fetch";

const getTracks = async (req, res) => {
  const { context, query } = req;

  let limit = query.limit ?? 20;
  let offset = query.offset ?? 0;
  let search = query.search ?? "";

  const spotifyResponse = await fetch(
    `${process.env.SPOTIFY_API_URL}/search?q=${search}&type=track&limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + context.spotifyToken,
      },
    }
  );

  const { tracks } = await spotifyResponse.json();

  const tracksOutput = tracks.items.map((track) => {
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
    };
  });

  res.status(200).json(tracksOutput);
};

export default getTracks;
