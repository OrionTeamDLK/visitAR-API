const express = require('express')
const router = new express.Router()
const admin = require('../db/firebase')
const auth = require('../middleware/auth')

const firestore = admin.firestore()

router.post('/user', auth, async (req, res) => {

  try {

    const uid = req.body.uid;

    const userRecord = await admin.auth().getUser(uid)

    if(userRecord){
        console.log("Successfully fetched user data:", userRecord.toJSON());
        const userColRef = firestore.collection('users')
        let docRefs = await userColRef.listDocuments();

        for( let docRef of docRefs){
          if (uid == docRef.id) {
            res.status(400).send({
              "error": `User ID ${docRef.id} Already Created`
            })
            return
          }
        }

        const newUser = {
          "favourite_list": [],
          "history": []
        }

        await userColRef.doc(`${uid}`).set(newUser);

    } else {
      res.status(401).send({ "error" : error });
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

    res.status(200).send({"msg":"User Created"})

  } catch (e) {
    console.log(e);
    res.status(401).send()
  }

})

router.post('/favourite', auth, async (req, res) => {

  const tour_id = req.body.id;
  const uid = req.body.uid;
  let documentRef = firestore.doc(`users/${uid}`);

  docSnap = await documentRef.get();

  if(docSnap.exists){
    const fav_arr = docSnap.get('favourite_list');

    for( let fav of fav_arr){
      if(fav.tour_id == tour_id){
        res.status(400).send({
          "msg": "Tour Already Added"
        })
        return;
      }
    }

    fav_arr.push({"tour_id": tour_id});
    documentRef.update({ favourite_list: fav_arr});
  } else {
    res.status(400).send({
      "msg": "User Document Not Found"
    })
    return;
  }


  res.status(200).send({
    "msg":`Added Tour ${tour_id}`
  });
})

router.delete('/favourite', auth, async (req, res) => {

  const tour_id = req.body.id;
  const uid = req.body.uid;
  let documentRef = firestore.doc(`users/${uid}`);

  docSnap = await documentRef.get();

  if(docSnap.exists){
    const fav_arr = docSnap.get('favourite_list');
    const tourFound=false;

    for( let fav of fav_arr){
      while(fav.tour_id == tour_id){
        tourFound = true
      }
    }
    someArray.splice(x, 1);

    if(tourFound){

    }

    fav_arr.push({"tour_id": tour_id});
    documentRef.update({ favourite_list: fav_arr});
  }
  // if(fav.tour_id == tour_id){
  //   res.status(400).send({
  //     "msg": "Tour Already Added"
  //   })
  //   return;
  // }

  res.status(200).send({
    "msg":`Added Tour ${tour_id}`
  });
})

module.exports = router
