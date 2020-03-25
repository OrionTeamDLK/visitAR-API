const express = require('express')
const router = new express.Router()
const admin = require('../db/firebase')
const auth = require('../middleware/auth')

const firestore = admin.firestore();

router.post('/tourlog', auth, async (req, res) => {
  const tourlogRef = firestore.collection('tour log');

  try {
    await tourlogRef.doc().set(req.body);
    res.status(200).send();
  } catch(e) {
    console.log(e);
    res.status(500).send()
  }
})

module.exports = router
