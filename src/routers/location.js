const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const admin = require('../db/firebase')

const forecast = require('../utils/forecast');


const firestore = admin.firestore();

// router.get('/locations', async (req, res) => {
//
//   try {
//     const colRef = firestore.collection('LandMarks')
//     let documentArray = [];
//
//     await colRef.listDocuments().then(documentRefs => {
//       return firestore.getAll(...documentRefs);
//     }).then(documentSnapshots => {
//
//       for (let documentSnapshot of documentSnapshots) {
//         if (documentSnapshot.exists) {
//           documentArray.push(documentSnapshot.data())
//         } else {
//           console.log(`Found missing document: ${documentSnapshot.id}`);
//         }
//       }
//
//     });
//
//     res.status(200).send(documentArray)
//
//   } catch (e) {
//     console.log(e);
//     res.status(500).send()
//   }
// })

router.get('/weather', auth, async(req, res) => {

  const lat = req.query.lat
  const long = req.query.long


  forecast(lat,long, (error, forecastData) => {

  if(error){
    return console.log(error);
    }


    res.status(200).send({ "msg" : forecastData } )
  });

})

module.exports = router
