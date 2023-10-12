const fs = require('fs');

const createValid = JSON.parse(fs.readFileSync('tests/playlists/resources/create.valid.json', 'utf8'));

const getPlaylistInfo = async (id) => {
  return await fetch(`http://localhost:8000/playlists/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const deletePlaylist = async (body) => {
  return await fetch('http://localhost:8000/playlists', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
};

const createPlaylist = async (body) => {
  return await fetch('http://localhost:8000/playlists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
};

describe('get playlist info tests', () => {
  test('playlist info - valid get', async () => {
    let response = await createPlaylist(createValid);
    let data = await response.json();

    response = await getPlaylistInfo(data.id);
    await deletePlaylist({ids: [data.id]});
    expect(response.status).toBe(200);
  });

  test('playlist info - invalid get', async () => {
    let response = await getPlaylistInfo(99999);
    expect(response.status).toBe(404);
  });
})