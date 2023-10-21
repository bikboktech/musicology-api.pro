const fs = require('fs');

const createValid = JSON.parse(fs.readFileSync('tests/events/resources/create.valid.json', 'utf8'));
const createInvalidDuration = JSON.parse(fs.readFileSync('tests/events/resources/create.invalidDuration.json', 'utf8'));
const createInvalidClient = JSON.parse(fs.readFileSync('tests/events/resources/create.invalidClient.json', 'utf8'));
const createInvalidEventType = JSON.parse(fs.readFileSync('tests/events/resources/create.invalidEventType.json', 'utf8'));
const createInvalidArtist = JSON.parse(fs.readFileSync('tests/events/resources/create.invalidArtist.json', 'utf8'));
const createInvalidSchema = JSON.parse(fs.readFileSync('tests/events/resources/create.invalidSchema.json', 'utf8'));

const createEvent = async (body) => {
  return await fetch('http://localhost:8000/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
};

const deleteEvent = async (ids) => {
  await fetch('http://localhost:8000/events', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ids: ids
    })
  });
};


describe('create event tests', () => {
  test('event create - valid create', async () => {
    let response = await createEvent(createValid);
    let data = await response.json();
    await deleteEvent([data.id]);
    expect(response.status).toBe(203);
  });

  test('event create - invalid duration', async () => {
    let response = await createEvent(createInvalidDuration);
    expect(response.status).toBe(400);
  });

  test('event create - client not found', async () => {
    let response = await createEvent(createInvalidClient);
    expect(response.status).toBe(404);
  });

  test('event create - event type not found', async () => {
    let response = await createEvent(createInvalidEventType);
    expect(response.status).toBe(404);
  });

  test('event create - artist not found', async () => {
    let response = await createEvent(createInvalidArtist);
    expect(response.status).toBe(404);
  });

  test('event create - invalid schema', async () => {
    let response = await createEvent(createInvalidSchema);
    expect(response.status).toBe(400);
  });
})