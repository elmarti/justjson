import request from 'supertest';
import startServer from './index';
import express from 'express';

describe('startServer function', () => {
  let app: express.Application;

  beforeAll(async () => {
    app = await startServer(1234, '../test_routes');  // Use a different port for testing
  });

  it('should respond with json for GET requests', async () => {
    const res = await request(app).get('/cabbage');

    expect(res.statusCode).toEqual(200);
    // expect(res.body).toHaveLength(2);
  });

  it('should create new item for POST requests', async () => {
    const res = await request(app)
      .post('/cabbage')
      .send({ id: 3, name: 'Cabbage 3', description: 'This is cabbage 3.' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Cabbage 3');
  });

  it('should update item for PATCH requests', async () => {
    const res = await request(app)
      .patch('/cabbage/1')
      .send({ name: 'Updated Cabbage 1', description: 'This is an updated cabbage 1.' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Updated Cabbage 1');
  });

  it('should delete item for DELETE requests', async () => {
    const res = await request(app)
      .delete('/cabbage/1');

    expect(res.statusCode).toEqual(200);
    // Ensure the item is removed by trying to get it
    const getRes = await request(app).get('/cabbage/1');
    expect(getRes.statusCode).toEqual(404);
  });
});
