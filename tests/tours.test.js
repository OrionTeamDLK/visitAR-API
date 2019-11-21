const request = require('supertest')
const app = require('../src/app')

describe('/tours Endpoint', () => {

  const tourObject1 = {
    id: 1,
    name: "History Tour",
    distance: 2.03,
    time: 90,
    startpoint: {
      _latitude: 54.040671,
      _longitude: -6.185419
    }
  }

  const tourObject2 = {
    id: 2,
    name: "test tour",
    distance: 2.5,
    time: 120
  }


  it('When URL is incorrect, Should returb 404', async () => {
    const res = await request(app)
      .get('/tour')
      .expect(404)
  })

  it('When Called, Should return data conataining Correct Values', async () => {
    const res = await request(app)
      .get('/tours')
      .expect(200)

    expect(res.body).toEqual(expect.arrayContaining([
      expect.objectContaining(tourObject1),
      expect.objectContaining(tourObject2)
    ]))

  })
})

describe('/tourData Endpoint', () => {
  
})
