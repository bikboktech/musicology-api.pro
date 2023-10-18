const fs = require('fs');

const createValid = JSON.parse(fs.readFileSync('tests/timelines/resources/create.valid.json', 'utf8'));

const getTimelineInfo = async (id) => {
  return await fetch(`http://localhost:8000/timelines/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

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

describe('get timeline info tests', () => {
  test('timeline info - valid get', async () => {
    let response = await createTimeline(createValid);
    let data = await response.json();
    response = await getTimelineInfo(data.id);
    await deleteTimeline({ids: [data.id]});
    expect(response.status).toBe(200);
  });

  test('timeline info - invalid get', async () => {
    let response = await getTimelineInfo(99999);
    expect(response.status).toBe(404);
  });
})