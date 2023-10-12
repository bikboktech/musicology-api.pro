const fs = require('fs');

const createValid = JSON.parse(fs.readFileSync('tests/events/resources/create.valid.json', 'utf8'));
const updateValid = JSON.parse(fs.readFileSync('tests/events/resources/update.valid.json', 'utf8'));
const updateInvalidDuration = JSON.parse(fs.readFileSync('tests/events/resources/create.invalidDuration.json', 'utf8'));
const updateInvalidClient = JSON.parse(fs.readFileSync('tests/events/resources/create.invalidClient.json', 'utf8'));
const updateInvalidEventType = JSON.parse(fs.readFileSync('tests/events/resources/create.invalidEventType.json', 'utf8'));
const updateInvalidArtist = JSON.parse(fs.readFileSync('tests/events/resources/create.invalidArtist.json', 'utf8'));
const updateInvalidSchema = JSON.parse(fs.readFileSync('tests/events/resources/create.invalidSchema.json', 'utf8'));

const updateEvent = async (id, body) => {
  return await fetch(`http://localhost:8000/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
};


describe('update event tests', () => {
  test('event update - valid update', async () => {
    let updateResponse = await updateEvent(1, updateValid);
    expect(updateResponse.status).toBe(200);
  });

  test('event update - invalid duration', async () => {
    let response = await updateEvent(1, updateInvalidDuration);
    expect(response.status).toBe(400);
  });

  test('event update - client not found', async () => {
    let response = await updateEvent(1, updateInvalidClient);
    expect(response.status).toBe(404);
  });

  test('event update - event type not found', async () => {
    let response = await updateEvent(1, updateInvalidEventType);
    expect(response.status).toBe(404);
  });

  test('event update - artist not found', async () => {
    let response = await updateEvent(1, updateInvalidArtist);
    expect(response.status).toBe(404);
  });

  test('event update - invalid schema', async () => {
    let response = await updateEvent(1, updateInvalidSchema);
    expect(response.status).toBe(400);
  });
});