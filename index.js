const express = require('express')
const admin = require('./db/firebase.js')

const locationRouter = require('./routers/location')
const db = admin.database();

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(locationRouter)

app.listen(port, () => console.log(`App listening on ${port}`) )
