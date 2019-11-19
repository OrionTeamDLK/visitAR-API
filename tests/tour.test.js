const request = require('supertest')
const app = require('../src/app')

test('Tour Test 1', async () => {
  await request(app).get('/tour').expect(200)
})
