const express = require('express')
const admin = require('./db/firebase.js')

const locationRouter = require('./routers/location')
const tourRouter = require('./routers/tours')
const userRouter = require('./routers/user')
const tourlog = require('./routers/tourlog')

const setIntervalRequest = require('./utils/interval');

const db = admin.database();
const app = express()

app.use(express.json())
app.use(locationRouter)
app.use(tourRouter)
app.use(userRouter)
app.use(tourlog)

app.get('/', (req, res) => {
  res.status(200).send("Visit AR")
})

setIntervalRequest();

module.exports = app;
