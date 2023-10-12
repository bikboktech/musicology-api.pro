const fs = require('fs');

const createValid = JSON.parse(fs.readFileSync('tests/template-playlists/resources/create.valid.json', 'utf8'));
const deleteInvalidSchema = JSON.parse(fs.readFileSync('tests/template-playlists/resources/delete.invalidSchema.json', 'utf8'));
const deleteInvalidMissingIds = JSON.parse(fs.readFileSync('tests/template-playlists/resources/delete.invalidMissingIds.json', 'utf8'));

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

describe('delete template playlist tests', () => {
  test('template playlist delete - valid delete', async () => {
    let response = await createTemplatePlaylist(createValid);
    let data = await response.json();

    response = await deleteTemplatePlaylist({
      ids: [data.id]
    });
    expect(response.status).toBe(204);
  });

  test('template playlist delete - invalid schema', async () => {
    let response = await deleteTemplatePlaylist(deleteInvalidSchema);
    expect(response.status).toBe(400);
  });

  test('template playlist delete - non-existing ids', async () => {
    let response = await deleteTemplatePlaylist(deleteInvalidMissingIds);
    expect(response.status).toBe(404);
  });

})