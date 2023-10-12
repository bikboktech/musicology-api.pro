const fs = require('fs');

const createValid = JSON.parse(fs.readFileSync('tests/playlists/resources/create.valid.json', 'utf8'));
const updateValid = JSON.parse(fs.readFileSync('tests/playlists/resources/update.valid.json', 'utf8'));
const updateInvalidEvent = JSON.parse(fs.readFileSync('tests/playlists/resources/create.invalidEvent.json', 'utf8'));

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

const updatePlaylist = async (id, body) => {
  return await fetch(`http://localhost:8000/playlists/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
};


describe('update playlist tests', () => {
  test('playlist update - valid update', async () => {
    let response = await createPlaylist(createValid);
    let data = await response.json();
    let updateResponse = await updatePlaylist(data.id, updateValid);
    await deletePlaylist([data.id]);
    expect(updateResponse.status).toBe(203);
  });

  test('playlist update - playlist not found', async () => {
    let updateResponse = await updatePlaylist(99999, updateValid);
    expect(updateResponse.status).toBe(404);
  });

  test('playlist update - event not found', async () => {
    let response = await createPlaylist(createValid);
    let data = await response.json();
    let updateResponse = await updatePlaylist(data.id, updateInvalidEvent);
    await deletePlaylist([data.id]);
    expect(updateResponse.status).toBe(404);
  });
});