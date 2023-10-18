const fs = require('fs');

const createValid = JSON.parse(fs.readFileSync('tests/timelines/resources/create.valid.json', 'utf8'));
const updateValid = JSON.parse(fs.readFileSync('tests/timelines/resources/update.valid.json', 'utf8'));
const updateInvalidEvent = JSON.parse(fs.readFileSync('tests/timelines/resources/create.invalidEvent.json', 'utf8'));

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

const updateTimeline = async (id, body) => {
  return await fetch(`http://localhost:8000/timelines/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
};


describe('update timeline tests', () => {
  test('timeline update - valid update', async () => {
    let response = await createTimeline(createValid);
    let data = await response.json();
    let updateResponse = await updateTimeline(data.id, updateValid);
    await deleteTimeline([data.id]);
    expect(updateResponse.status).toBe(200);
  });

  test('timeline update - timeline not found', async () => {
    let updateResponse = await updateTimeline(99999, updateValid);
    expect(updateResponse.status).toBe(404);
  });

  test('timeline update - event not found', async () => {
    let response = await createTimeline(createValid);
    let data = await response.json();
    let updateResponse = await updateTimeline(data.id, updateInvalidEvent);
    await deleteTimeline([data.id]);
    expect(updateResponse.status).toBe(404);
  });
});