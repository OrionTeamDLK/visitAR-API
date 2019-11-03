const express = require('express')
const { firebase, admin } = require('./db/firebase.js')

const locationRouter = require('./routers/location')
const db = firebase.database();

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(locationRouter)

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(port, () => console.log(`App listening on ${port}`) )
