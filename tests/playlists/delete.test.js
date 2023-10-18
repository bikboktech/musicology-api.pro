const fs = require('fs');

const createValid = JSON.parse(fs.readFileSync('tests/playlists/resources/create.valid.json', 'utf8'));
const deleteInvalidSchema = JSON.parse(fs.readFileSync('tests/playlists/resources/delete.invalidSchema.json', 'utf8'));
const deleteInvalidMissingIds = JSON.parse(fs.readFileSync('tests/playlists/resources/delete.invalidMissingIds.json', 'utf8'));

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

describe('delete playlist tests', () => {
  test('playlist delete - valid delete', async () => {
    let response = await createPlaylist(createValid);
    let data = await response.json();

    response = await deletePlaylist({
      ids: [data.id]
    });
    expect(response.status).toBe(204);
  });

  test('playlist delete - invalid schema', async () => {
    let response = await deletePlaylist(deleteInvalidSchema);
    expect(response.status).toBe(400);
  });

  test('playlist delete - non-existing ids', async () => {
    let response = await deletePlaylist(deleteInvalidMissingIds);
    expect(response.status).toBe(404);
  });

})