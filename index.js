const express = require('express')

const { firebase, admin } = require('./db/firebase.js')

const db = firebase.database();

const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000)
console.log("APP Listing On 3000")
