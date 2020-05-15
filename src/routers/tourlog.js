const express = require('express')
const router = new express.Router()
const admin = require('../db/firebase')
const auth = require('../middleware/auth')
const formatRequest = require('../utils/tours');

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
      const data = doc.data()
      data.tour_taken         = "Historic Tour"
      data.time_started       = data.time_started.toDate()
      data.time_finished      = data.time_finished.toDate()
      data.Date               = data.date.toDate()
      console.log(data)
      history.push(data)
    }
    
    res.status(200).send(history);

  } catch (e) {
    console.log(e);
    res.status(500).send(e)
  }

})

router.post('/tourlog', auth, async (req, res) => {
  const tourlogRef = firestore.collection('tour log');

  try {

    const formattedReq = await formatRequest(req.body)
    const tourlogDocRef = tourlogRef.doc()

    const tourlogID = tourlogDocRef._path.segments[1]
    const tourPath = firestore.doc(`tour log/${tourlogID}/`)

    const result = await tourlogDocRef.set(formattedReq)

    res.status(200).send()

    if(req.body.uid === null){
      return
    }

    const usersRef = firestore.doc(`users/${req.body.uid}`)
    const users = await usersRef.get()

    if(users.exists){
      const userData = users.data()
      userData.history.push(tourPath)
      await usersRef.update({"history": userData.history});

    } else {
      console.log(`User Refrence Not Found`)
      return
    }

  } catch(e) {
    console.log(e);
    res.status(500).send()
  }
})

module.exports = router
