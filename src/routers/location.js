const express = require('express')
const router = new express.Router()
const admin = require('../db/firebase')
const auth = require('../middleware/firebase_auth')

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
//
// router.post('/locations', (req, res) => {
//   const colRef = firestore.collection('LandMarks')
//
//   try {
//     colRef.add(req.body).then(documentReference => {
//       let firestore = documentReference.firestore;
//       console.log(`Root location for document is ${firestore.formattedName}`);
//     });
//     res.status(200).send('POST Locations')
//   } catch (e) {
//     console.log(e);
//     res.status(500).send();
//   }
// })

module.exports = router
