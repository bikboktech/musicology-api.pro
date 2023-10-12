const fs = require('fs');

const createValid = JSON.parse(fs.readFileSync('tests/template-playlists/resources/create.valid.json', 'utf8'));

const getTemplatePlaylistInfo = async (id) => {
  return await fetch(`http://localhost:8000/template-playlists/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const deleteTemplatePlaylist = async (body) => {
  return await fetch('http://localhost:8000/template-playlists', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
};

const createTemplatePlaylist = async (body) => {
  return await fetch('http://localhost:8000/template-playlists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
};

describe('get template playlist info tests', () => {
  test('template playlist info - valid get', async () => {
    let response = await createTemplatePlaylist(createValid);
    let data = await response.json();

    response = await getTemplatePlaylistInfo(data.id);
    await deleteTemplatePlaylist({ids: [data.id]});
    expect(response.status).toBe(200);
  });

  test('template playlist info - invalid get', async () => {
    let response = await getTemplatePlaylistInfo(99999);
    expect(response.status).toBe(404);
  });
})