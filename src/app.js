const express = require('express')
const admin = require('./db/firebase.js')

const locationRouter = require('./routers/location')
const tourRouter = require('./routers/tours')
const db = admin.database();

const app = express()

app.use(express.json())
app.use(locationRouter)
app.use(tourRouter)

module.exports = app;
