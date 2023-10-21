const fs = require('fs');

const createValid = JSON.parse(fs.readFileSync('tests/template-playlists/resources/create.valid.json', 'utf8'));
const updateValid = JSON.parse(fs.readFileSync('tests/template-playlists/resources/update.valid.json', 'utf8'));
const updateInvalidEventType = JSON.parse(fs.readFileSync('tests/template-playlists/resources/create.invalidEventType.json', 'utf8'));

const deleteTemplatePlaylist = async (ids) => {
  await fetch('http://localhost:8000/template-playlists', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ids: ids
    })
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

const updateTemplatePlaylist = async (id, body) => {
  return await fetch(`http://localhost:8000/template-playlists/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
};


describe('update template playlist tests', () => {
  test('template playlist update - valid update', async () => {
    let response = await createTemplatePlaylist(createValid);
    let data = await response.json();
    let updateResponse = await updateTemplatePlaylist(data.id, updateValid);
    await deleteTemplatePlaylist([data.id]);
    expect(updateResponse.status).toBe(203);
  });

  test('template playlist update - playlist not found', async () => {
    let updateResponse = await updateTemplatePlaylist(99999, updateValid);
    expect(updateResponse.status).toBe(404);
  });

  test('template playlist update - event type not found', async () => {
    let response = await createTemplatePlaylist(createValid);
    let data = await response.json();
    let updateResponse = await updateTemplatePlaylist(data.id, updateInvalidEventType);
    await deleteTemplatePlaylist([data.id]);
    expect(updateResponse.status).toBe(404);
  });
});