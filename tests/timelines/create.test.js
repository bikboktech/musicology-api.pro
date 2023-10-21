const fs = require('fs');

const createValid = JSON.parse(fs.readFileSync('tests/timelines/resources/create.valid.json', 'utf8'));
const createInvalidEvent = JSON.parse(fs.readFileSync('tests/timelines/resources/create.invalidEvent.json', 'utf8'));
const createInvalidSchema = JSON.parse(fs.readFileSync('tests/timelines/resources/create.invalidSchema.json', 'utf8'));

const deleteTimeline = async (ids) => {
  await fetch('http://localhost:8000/timelines', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ids: ids
    })
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


describe('create timeline tests', () => {
  test('timeline create - valid create', async () => {
    let response = await createTimeline(createValid);
    let data = await response.json();
    await deleteTimeline([data.id]);
    expect(response.status).toBe(203);
  });

  test('timeline create - event not found', async () => {
    let response = await createTimeline(createInvalidEvent);
    expect(response.status).toBe(404);
  });

  test('timeline create - invalid schema', async () => {
    let response = await createTimeline(createInvalidSchema);
    expect(response.status).toBe(400);
  });
});