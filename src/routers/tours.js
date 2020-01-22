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
router.get('/tourData', auth, async (req, res) => {

  try {

    const tourId = req.query.id
    const tourRef = firestore.collection('tours')
    const querySnapshot = await tourRef.where('id', '==', parseInt(tourId) ).get()

    if(querySnapshot._size == 0){
      res.status(400).send({"msg": `Tour ID ${tourId} Not Found`})
      return
    }

    let docs = querySnapshot.docs
    const data = docs[0].data()

    let tourStops = await firestore.getAll(...  data.tourStops)
    let tourStopsArr = []

    for( let tourStop of tourStops){
      tourStopsArr.push(tourStop.data())
    }

    data.tourStops = tourStopsArr;


    if (req.query.tokens) {

      const tokensRef = firestore.collection(`${docs[0]._ref.path}/tokens`)
      let docRefs = await tokensRef.listDocuments();
      let tokenArr = []

      for (let docRef of docRefs) {
        let documentSnapshot = await docRef.get()
        tokenArr.push(documentSnapshot.data())
      }

      data.tokens = tokenArr
    }

    if (req.query.subarrows) {

      const subarrowsRef = firestore.collection(`${docs[0]._ref.path}/sub arrows`)
      let docRefs = await subarrowsRef.listDocuments();
      let subarrowsArr = []

      for (let docRef of docRefs) {
        let documentSnapshot = await docRef.get()
        subarrowsArr.push(documentSnapshot.data())
      }

      data.subarrows = subarrowsArr;
    }
    res.status(200).send(data)

  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

module.exports = router
