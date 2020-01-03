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

//?subarrows=true&tokens=true
router.post('/tourData', auth, async (req, res) => {

  try {

    let documentArray = [];
    let tourStopsArr = [];

    const tourRef = firestore.collection('tours')

    // console.log(req.query)
    //
    // if (req.query.subarrows) {
    //   console.log(req.query.subarrows)
    // }
    //


    const querySnapshot = await tourRef.where('id', '==', req.body.id).get()

    let docs = querySnapshot.docs

    console.log(docs[0]._ref.path)

    const documentSnapshot = await docs[0]._ref.get()

    let {
      id,
      name,
      distance_km,
      time_mins,
      starting_point,
      over_view,
      tourStops
    } = documentSnapshot.data();


    console.log(documentSnapshot.data())

    for (let tourStop of tourStops) {
      const documentSnapshot = await tourStop.get()
      if (documentSnapshot.exists) {
        tourStopsArr.push(documentSnapshot.data())
      }
    }

    documentArray.push({
      id,
      name,
      distance_km,
      time_mins,
      starting_point,
      over_view,
      tourStopsArr,
    })

    if (req.body.tokens) {

      const tokensRef = firestore.collection(`${docs[0]._ref.path}/tokens`)
      let docRefs = await tokensRef.listDocuments();
      let tokenArr = []

      for (let docRef of docRefs) {
        let documentSnapshot = await docRef.get()
        tokenArr.push(documentSnapshot.data())
      }

      documentArray.push({
        "tokens": tokenArr
      })

    }

    if (req.body.subarrows) {

      const subarrowsRef = firestore.collection(`${docs[0]._ref.path}/sub arrows`)
      let docRefs = await subarrowsRef.listDocuments();
      let subarrowsArr = []

      for (let docRef of docRefs) {
        let documentSnapshot = await docRef.get()
        subarrowsArr.push(documentSnapshot.data())
      }

      documentArray.push({
        "sub_arrows": subarrowsArr
      })

    }


    res.status(200).send(documentArray)



    // for (let doc of docs) {
    //
    //   const subCollections = await doc._ref.listCollections()
    //
    //   for (let subCollection of subCollections) {
    //
    //     let docRefs = await subCollection.listDocuments();
    //
    //     for (let docRef of docRefs) {
    //       let documentSnapshot = await docRef.get()
    //
    //       if (subCollection.id == "sub arrows") {
    //         subArrows.push(documentSnapshot.data())
    //       } else {
    //         tokens.push(documentSnapshot.data())
    //       }
    //     }
    //     //console.log(docRef)
    //
    //   }
    //   let tourStopsArr = [];
    //
    //   let {
    //     id,
    //     name,
    //     distance_km,
    //     time_mins,
    //     starting_point,
    //     over_view,
    //     tourStops
    //   } = doc.data();

    //
    //   for (let tourStop of tourStops) {
    //     const documentSnapshot = await tourStop.get()
    //
    //     if (documentSnapshot.exists) {
    //       tourStopsArr.push(documentSnapshot.data())
    //     }
    //   }

    //
    //   documentArray.push({
    //     id,
    //     name,
    //     distance_km,
    //     time_mins,
    //     starting_point,
    //     over_view,
    //     tourStopsArr,
    //     subArrows,
    //     tokens
    //   })
    // }



  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

module.exports = router
