const express = require('express')
const router = new express.Router()
const admin = require('../db/firebase')
const auth = require('../middleware/firebase_auth')

const firestore = admin.firestore();

router.get('/tour', async (req, res) => {
  res.status(200).send("GET Tour")
})

module.exports = router
