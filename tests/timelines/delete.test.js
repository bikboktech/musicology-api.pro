const fs = require('fs');

const createValid = JSON.parse(fs.readFileSync('tests/timelines/resources/create.valid.json', 'utf8'));
const deleteInvalidSchema = JSON.parse(fs.readFileSync('tests/timelines/resources/delete.invalidSchema.json', 'utf8'));
const deleteInvalidMissingIds = JSON.parse(fs.readFileSync('tests/timelines/resources/delete.invalidMissingIds.json', 'utf8'));

const deleteTimeline = async (body) => {
  return await fetch('http://localhost:8000/timelines', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
};

const createTimeline = async (body) => {
  return await fetch('http://localhost:8000/timelines', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
};

describe('delete timeline tests', () => {
  test('timeline delete - valid delete', async () => {
    let response = await createTimeline(createValid);
    let data = await response.json();

    response = await deleteTimeline({
      ids: [data.id]
    });
    expect(response.status).toBe(204);
  });

  test('timeline delete - invalid schema', async () => {
    let response = await deleteTimeline(deleteInvalidSchema);
    expect(response.status).toBe(400);
  });

  test('timeline delete - non-existing ids', async () => {
    let response = await deleteTimeline(deleteInvalidMissingIds);
    expect(response.status).toBe(404);
  });

})