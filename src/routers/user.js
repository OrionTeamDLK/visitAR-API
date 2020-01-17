const express = require('express')
const router = new express.Router()
const admin = require('../db/firebase')
const auth = require('../middleware/auth')

const firestore = admin.firestore()

router.post('/user', auth, async (req, res) => {

  try {

    const uid = req.body.uid;

    const userRecord = await admin.auth().getUser(uid)

    if (userRecord) {
      console.log("Successfully fetched user data:", userRecord.toJSON());
      const userColRef = firestore.collection('users')
      let docRefs = await userColRef.listDocuments();

      for (let docRef of docRefs) {
        if (uid == docRef.id) {
          res.status(400).send({"error": `User ID ${docRef.id} Already Created`})
          return
        }
      }

      const newUser = {
        "favourite_list": [],
        "history": []
      }

      await userColRef.doc(`${uid}`).set(newUser);

    } else {
      res.status(401).send({"error": error});
      console.log("Error fetching user data:", error);
    }

    // const profilePicture = (req.body.profile != null) ? req.body.profile :
    //   'https://firebasestorage.googleapis.com/v0/b/orion-57b76.appspot.com/o/profile_pictures%2Fdeafult_profile.jpg?alt=media&token=dd4a8e95-4dfc-4ce7-bbeb-fcccb64fbf94'

    //new

    //old
    // const newUser = {
    //   "favourite_list": [],
    //   "history": [],
    //   "profile_pic": profilePicture
    // }

    //add Data
    //await userColRef.doc(`${uid}`).set(newUser);

    res.status(200).send({"msg": "User Created"})

  } catch (e) {
    console.log(e);
    res.status(401).send()
  }

})

router.get('/favourite', auth, async (req, res) => {

  const uid = req.query.uid;
  let documentRef = firestore.doc(`users/${uid}`);
  docSnap = await documentRef.get();

  if (!docSnap.exists) {

    res.status(400).send({"msg": `User Document ${uid} Not Found`})
    return;

  }
  const fav_arr = docSnap.get('favourite_list');
  res.status(200).send(fav_arr);

})

router.post('/favourite', auth, async (req, res) => {

  const tour_id = req.body.id;
  const uid = req.body.uid;
  let documentRef = firestore.doc(`users/${uid}`);

  docSnap = await documentRef.get();

  if (docSnap.exists) {
    const fav_arr = docSnap.get('favourite_list');

    for (let fav of fav_arr) {
      if (fav.tour_id == tour_id) {
        res.status(400).send({"msg": "Tour Already Added"})
        return;
      }
    }

    fav_arr.push({"tour_id": tour_id});
    documentRef.update({favourite_list: fav_arr});
  } else {
    res.status(400).send({"msg": "User Document Not Found"})
    return;
  }

  res.status(200).send({"msg": `Added Tour ${tour_id}`});
})

router.delete('/favourite', auth, async (req, res) => {

  const tour_id = req.body.id;
  const uid = req.body.uid;
  let documentRef = firestore.doc(`users/${uid}`);

  docSnap = await documentRef.get();

  if (docSnap.exists) {
    const fav_arr = docSnap.get('favourite_list');

    for (let i = 0; i < fav_arr.length; i++) {
      if (fav_arr[i].tour_id == tour_id) {

        fav_arr.splice(i, 1)

        documentRef.update({favourite_list: fav_arr});

        res.status(200).send({"msg": `Tour Id ${tour_id} Removed`})
        return
      }
    }
  } else {
    res.status(400).send({"msg": "User Document Not Found"})
    return;
  }
  res.status(400).send({"msg": `Tour ${tour_id} Not Found`});
})

router.get('/history', auth, async (req, res) => {

  try {

    const uid = req.body.uid;
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

module.exports = router
