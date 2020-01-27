'use strict'

const { test, trait, beforeEach, afterEach } = use('Test/Suite')('Image');

const Helpers = use('Helpers');

trait('Test/ApiClient')

test('it should store the file', async ({ client }) => {
  const response = await client.post('/images')
    .attach('image', Helpers.tmpPath('/uploads/1580141583878-cooked-foods-750073.jpg'))
    .end();

  response.assertStatus(204);
});
