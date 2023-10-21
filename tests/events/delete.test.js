const fs = require('fs');

const createValid = JSON.parse(fs.readFileSync('tests/events/resources/create.valid.json', 'utf8'));
const deleteInvalidSchema = JSON.parse(fs.readFileSync('tests/events/resources/delete.invalidSchema.json', 'utf8'));
const deleteInvalidMissingIds = JSON.parse(fs.readFileSync('tests/events/resources/delete.invalidMissingIds.json', 'utf8'));

const deleteEvent = async (body) => {
  return await fetch('http://localhost:8000/events', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
};

const createEvent = async (body) => {
  return await fetch('http://localhost:8000/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
};

describe('delete event tests', () => {
  test('event delete - valid delete', async () => {
    let response = await createEvent(createValid);
    let data = await response.json();

    response = await deleteEvent({
      ids: [data.id]
    });
    expect(response.status).toBe(204);
  });

  test('event delete - invalid schema', async () => {
    let response = await deleteEvent(deleteInvalidSchema);
    expect(response.status).toBe(400);
  });

  test('event delete - non-existing ids', async () => {
    let response = await deleteEvent(deleteInvalidMissingIds);
    expect(response.status).toBe(404);
  });

})