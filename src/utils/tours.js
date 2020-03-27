
const admin = require('../db/firebase')
const moment = require('moment')

const firestore = admin.firestore();

const formatRequest = async (tourlog) =>{
  const newTourlog = {}

  const TOUR_DATE = tourlog.date;

  newTourlog.date = formatDate(TOUR_DATE)
  newTourlog.time_started = formatDate(TOUR_DATE + " " + tourlog.time_started)
  newTourlog.time_finished = formatDate(TOUR_DATE + " " + tourlog.time_finished)
  newTourlog.tour_completed = tourlog.tour_completed
  newTourlog.tokens_collected = tourlog.tokens_collected
  newTourlog.landmarks_visited = [];

  for(let landmark of tourlog.landmarks_visited) {
    landmark.time_visited = formatDate(TOUR_DATE + " " + landmark.time_visited)
    newTourlog.landmarks_visited.push(landmark)
  }

  return newTourlog;
}

const formatDate = (date) => {

  date = new Date(moment(date, "DD/MM/YYYY  h:mm:ss").format("DD MMM YYYY  h:mm:ss"));

  let newDate = Date.parse(date)
  console.log(newDate)

  return admin.firestore.Timestamp.fromMillis(newDate)
}

module.exports = formatRequest;
