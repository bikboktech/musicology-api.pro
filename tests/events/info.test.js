const fs = require('fs');

const createValid = JSON.parse(fs.readFileSync('tests/events/resources/create.valid.json', 'utf8'));

const getEventInfo = async (id) => {
  return await fetch(`http://localhost:8000/events/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

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

describe('get event info tests', () => {
  test('event info - valid get', async () => {
    let response = await createEvent(createValid);
    let data = await response.json();

    response = await getEventInfo(data.id);
    await deleteEvent({ids: [data.id]});
    expect(response.status).toBe(200);
  });

  test('event info - invalid get', async () => {
    let response = await getEventInfo(99999);
    expect(response.status).toBe(404);
  });
})