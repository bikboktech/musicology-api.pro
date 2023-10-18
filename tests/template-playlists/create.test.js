const fs = require('fs');

const createValid = JSON.parse(fs.readFileSync('tests/template-playlists/resources/create.valid.json', 'utf8'));
const createInvalidEventType = JSON.parse(fs.readFileSync('tests/template-playlists/resources/create.invalidEventType.json', 'utf8'));
const createInvalidSchema = JSON.parse(fs.readFileSync('tests/template-playlists/resources/create.invalidSchema.json', 'utf8'));

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


describe('create template playlist tests', () => {
  test('template playlist create - valid create', async () => {
    let response = await createTemplatePlaylist(createValid);
    let data = await response.json();
    await deleteTemplatePlaylist([data.id]);
    expect(response.status).toBe(203);
  });

  test('template playlist create - event type not found', async () => {
    let response = await createTemplatePlaylist(createInvalidEventType);
    expect(response.status).toBe(404);
  });

  test('template playlist create - invalid schema', async () => {
    let response = await createTemplatePlaylist(createInvalidSchema);
    expect(response.status).toBe(400);
  });
});