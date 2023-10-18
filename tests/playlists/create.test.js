const fs = require('fs');

const createValid = JSON.parse(fs.readFileSync('tests/playlists/resources/create.valid.json', 'utf8'));
const createInvalidEvent = JSON.parse(fs.readFileSync('tests/playlists/resources/create.invalidEvent.json', 'utf8'));
const createInvalidSchema = JSON.parse(fs.readFileSync('tests/playlists/resources/create.invalidSchema.json', 'utf8'));

const deletePlaylist = async (ids) => {
  await fetch('http://localhost:8000/playlists', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ids: ids
    })
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


describe('create playlist tests', () => {
  test('playlist create - valid create', async () => {
    let response = await createPlaylist(createValid);
    let data = await response.json();
    await deletePlaylist([data.id]);
    expect(response.status).toBe(203);
  });

  test('playlist create - event not found', async () => {
    let response = await createPlaylist(createInvalidEvent);
    expect(response.status).toBe(404);
  });

  test('playlist create - invalid schema', async () => {
    let response = await createPlaylist(createInvalidSchema);
    expect(response.status).toBe(400);
  });
});