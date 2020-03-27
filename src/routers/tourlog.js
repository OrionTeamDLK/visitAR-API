const express = require('express')
const router = new express.Router()
const admin = require('../db/firebase')
const auth = require('../middleware/auth')

const firestore = admin.firestore();

router.get('/tourlog', auth, async (req, res) => {

  try {

    const uid = req.query.uid;
    const tourLogArr = [];
    let documentRef = firestore.doc(`users/${uid}`);
    docSnap = await documentRef.get();

    if (!docSnap.exists) {

      res.status(400).send({"msg": `User Document ${uid} Not Found`})
      return;

    }
    const history_arr = docSnap.get('history');

    const docs = await firestore.getAll(... history_arr)
    const history = [];

    for( let doc of docs){
      const tourTakenRef = await doc.get('tour_taken');
      const tourTakenSnap = await tourTakenRef.get();

      const data = doc.data()
      data.tour_taken = tourTakenSnap.get('name')
      data.time_started[0] = data.time_started[0].toDate()
      data.time_started[1] = data.time_started[1].toDate()
      history.push(data)
    }
    console.log(history)


    res.status(200).send(history);
  } catch (e) {
    console.log(e);
    res.status(500).send(e)
  }

})

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
