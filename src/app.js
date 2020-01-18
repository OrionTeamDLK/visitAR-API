const express = require('express')
const admin = require('./db/firebase.js')

const locationRouter = require('./routers/location')
const tourRouter = require('./routers/tours')
const userRouter = require('./routers/user')

const db = admin.database();

const app = express()

app.use(express.json())
app.use(locationRouter)
app.use(tourRouter)
app.use(userRouter)

module.exports = app;
