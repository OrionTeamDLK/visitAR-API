const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../src/app')


describe('/tours Endpoint', () => {

  //Expected Object 1
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

  //Expected Object 2
  const tourObject2 = {
    id: 2,
    name: "test tour",
    distance: 2.5,
    time: 120
  }

  //Test 1
  it('Test 1: When URL is incorrect, Should return 404', async () => {
    const res = await request(app)
      .get('/tour')
      .expect(404)
  })

  //Test 2
  it('Test 2: When Auth is valid, Should return Correct Data', async () => {
    const res = await request(app)
      .get('/tours')
      .set('Authorization', 'Bearer ' + jwt.sign({}, process.env.JWT_SECRET) )
      .expect('Content-Type', /json/)
      .expect(200)
  })

  //Test 3
  it('Test 3: When Auth is Invalid, Should return 401 Error', async () => {
    const res = await request(app)
      .get('/tours')
      .set('Authorization', 'Bearer ' + jwt.sign({}, 'password') )
      .expect('Content-Type', /json/)
      .expect(401)
  })

})

describe('/tourData Endpoint', () => {

  //Test 1
  it('Test 1: When URL is incorrect, Should return 404', async () => {
    const res = await request(app)
      .get('/tourDat')
      .expect(404)
  })

  //Test 2
  it('Test 1: When URL is incorrect, Should return 404', async () => {
    const res = await request(app)
      .get('/tourDat')
      .expect(404)
  })

})
