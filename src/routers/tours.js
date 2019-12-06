const express = require('express')
const router = new express.Router()
const admin = require('../db/firebase')
const auth = require('../middleware/auth')

const firestore = admin.firestore();

// TODO: Add v2 of each endpoint making use od direct refencing.
// TODO: Use Artillery to test performace of old and new endpoints.
// TODO: Add multiple retuen options for the tourData endpint, i.e subArrows=true

router.get('/tours', auth, async (req, res) => {

  try {
    const tourRef = firestore.collection('tours')
    let documentArray = [];

    const documentRefs = await tourRef.listDocuments()
    const documentSnapshots = await firestore.getAll(...documentRefs)

    for (let documentSnapshot of documentSnapshots) {

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
    }

    res.status(200).send(documentArray)

  } catch (e) {
    console.log(e);
    res.status(500).send()
  }
})

router.get('/tourData', auth, async (req, res) => {

  try {
    const tourRef = firestore.collection('tours')
    const tourId = req.body.id
    let documentArray = [];


    const querySnapshot = await tourRef.where('id', '==', tourId).get()
    //  console.log(querySnapshot)
    let docs = querySnapshot.docs;
    let subArrows = [];
    let tokens = [];
    for (let doc of docs) {

      const subCollections = await doc._ref.listCollections()

      for (let subCollection of subCollections) {

        let docRefs = await subCollection.listDocuments();

        for (let docRef of docRefs) {
          let documentSnapshot = await docRef.get()

          if (subCollection.id == "sub arrows") {
            subArrows.push(documentSnapshot.data())
          } else {
            tokens.push(documentSnapshot.data())
          }
        }
        //console.log(docRef)

      }
      let tourStopsArr = [];

      let {
        id,
        name,
        distance_km,
        time_mins,
        starting_point,
        over_view,
        tourStops
      } = doc.data();
      // let id = doc.get('id')
      // let name = doc.get('name')
      // let distance = doc.get('distance_km')
      // let time = doc.get('time_mins')
      // let startpoint = doc.get('starting point')
      // let overview = doc.get('over_view')
      // let landmarkRefs = doc.get('tourStops')

      //  console.log(doc.data())

      for (let tourStop of tourStops) {
        const documentSnapshot = await tourStop.get()

        if (documentSnapshot.exists) {
          tourStopsArr.push(documentSnapshot.data())
        }
      }
      //console.log(doc)

      // doc.listCollections().then(collections => {
      //   for (let collection of collections) {
      //     console.log(`Found subcollection with id: ${collection.id}`);
      //   }
      // });

      //let documentRef = firestore.doc('tours/tour1');

      // documentRef.listCollections().then(collections => {
      //   for (let collection of collections) {
      //     console.log(`Found subcollection with id: ${collection.id}`);
      //   }
      // });

      documentArray.push({
        id,
        name,
        distance_km,
        time_mins,
        starting_point,
        over_view,
        tourStopsArr,
        subArrows,
        tokens
      })
    }

    res.status(200).send(documentArray)

  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

module.exports = router
