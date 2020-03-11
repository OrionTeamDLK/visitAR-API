const express = require('express')
const router = new express.Router()
const admin = require('../db/firebase')
const auth = require('../middleware/auth')

const firestore = admin.firestore();

router.post('/tourlog', auth, async (req, res) => {
  const tourlogRef = firestore.collection('tour log');

  //console.log(req.body)
  await tourlogRef.doc().set(req.body);

  res.status(200).send();
})

module.exports = router
