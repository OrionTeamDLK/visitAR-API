const express = require('express')
const router = new express.Router()
const admin = require('../db/firebase')
const auth = require('../middleware/firebase_auth')

const firestore = admin.firestore();

router.get('/tours', async (req, res) => {

  try {
    const tourRef = firestore.collection('tours')
    let documentArray = [];

    const documentRefs = await tourRef.listDocuments()
    const documentSnapshots = await firestore.getAll(...documentRefs)

    for (let documentSnapshot of documentSnapshots) {

      if (documentSnapshot.exists) {

        let id = documentSnapshot.get('id')
        let name = documentSnapshot.get('name')
        let distance = documentSnapshot.get('distance_km')
        let time = documentSnapshot.get('time_mins')
        let startpoint = documentSnapshot.get('starting point')


        documentArray.push({
          id,
          name,
          distance,
          time,
          startpoint
        })

      } else {
        console.log(`Found missing document: ${documentSnapshot.id}`);
      }
    }

    res.status(200).send(documentArray)

  } catch (e) {

    console.log(e);
    res.status(500).send()
  }
})

router.get('/toursOld', async (req, res) => {

  try {
    const colRef = firestore.collection('tours')
    let documentArray = [];

    await colRef.listDocuments().then(documentRefs => {
      return firestore.getAll(...documentRefs);
    }).then(documentSnapshots => {

      for (let documentSnapshot of documentSnapshots) {
        if (documentSnapshot.exists) {

          let id = documentSnapshot.get('id')
          let name = documentSnapshot.get('name')
          let distance = documentSnapshot.get('distance_km')
          let time = documentSnapshot.get('time_mins')
          let startpoint = documentSnapshot.get('starting point')


          documentArray.push({
            id,
            name,
            distance,
            time,
            startpoint
          })
        } else {
          console.log(`Found missing document: ${documentSnapshot.id}`);
        }
      }

    });

    res.status(200).send(documentArray)

  } catch (e) {
    console.log(e);
    res.status(500).send()
  }
})

module.exports = router
