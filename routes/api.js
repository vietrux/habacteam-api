var express = require('express');
var router = express.Router();
var axios = require('axios');
var db = require('../config/firebase').db;
require("firebase/firestore");
const { getMessaging } = require('firebase-admin/messaging');



/* GET users listing. */
router.get('/hmc', async function (req, res, next) {
  try {
    //lay du liệu từ facebook
    const access_token = process.env.HMC_ACCESS_TOKEN;
    const api_url = "https://graph.facebook.com/";
    const page_id = "111037578336120";
    const field = "about,fan_count,feed{attachments{media,url},message,permalink_url,full_picture,created_time,reactions.summary(total_count)}";
    const full_url = api_url + page_id + "?fields=" + field + "&access_token=" + access_token;
    const facebook_result = await axios.get(full_url)
    const data = facebook_result.data;
    //cap nhat du lieu vao firebase
    await db.collection('facebook').doc('hmc').update(data);
    //cap nhat thoi gian cap nhat
    await db.collection('facebook').doc('update_time_hmc').update({
      time: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        hour12: true,
        timeZone: "Asia/Ho_Chi_Minh"
      })
    })
    res.json({
      status: 200,
      message: "Facebook data updated successfully",
      data: [new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        hour12: true,
        timeZone: "Asia/Ho_Chi_Minh"
      })],
    })
  } catch (error) {
    res.json({
      status: 500,
      data: error
    })
  }
});

/* GET users listing. */
router.get('/hr', async function (req, res, next) {
  try {
    //lay du liệu từ facebook
    const access_token = process.env.HR_ACCESS_TOKEN;
    const api_url = "https://graph.facebook.com/";
    const page_id = "283053355194941";
    const field = "about,fan_count,feed{attachments{media,url},message,permalink_url,full_picture,created_time,reactions.summary(total_count)}";
    const full_url = api_url + page_id + "?fields=" + field + "&access_token=" + access_token;
    const facebook_result = await axios.get(full_url)
    const data = facebook_result.data;
    //cap nhat du lieu vao firebase
    await db.collection('facebook').doc('hr').update(data);
    //cap nhat thoi gian cap nhat
    await db.collection('facebook').doc('update_time_hr').update({
      time: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        hour12: true,
        timeZone: "Asia/Ho_Chi_Minh"
      })
    })
    res.json({
      status: 200,
      message: "Facebook data updated successfully",
      data: [new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        hour12: true,
        timeZone: "Asia/Ho_Chi_Minh"
      })],
    })
  } catch (error) {
    res.json({
      status: 500,
      data: error
    })
  }
});

router.get('/hcfs', async function (req, res, next) {
  try {
    const userRef = db.collection('users');
    const snapshot = await userRef.get();
    snapshot.forEach(async (doc) => {
      db.collection('users').doc(doc.id).update({
        cfs_per_day: 0,
        cfs_status: true,
      })
    });
    res.json({
      status: 200,
      message: "Cfs box users updated",
      data: [new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        hour12: true,
        timeZone: "Asia/Ho_Chi_Minh"
      })],
    })
  } catch (error) {
    res.json({
      status: 500,
      data: error
    })
  }
});

router.get('/register', async function (req, res, next) {
  try {
    console.log("register")
    var registrationTokens = [];
    //get list of registration tokens
    const userRef = db.collection('messToken');
    const snapshot = await userRef.get();
    snapshot.forEach(async (doc) => {
      //get all value of each key in object
      for (var key in doc.data()) {
        registrationTokens.push(doc.data()[key])
      }
    });

    console.log(registrationTokens)
    // Subscribe the devices corresponding to the registration tokens to the
    // topic.
    getMessaging().subscribeToTopic(registrationTokens, "hbteam")
      .then((response) => {
       res.json({
          status: 200,
          message: "Register successfully",
          data: [new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "numeric",
            hour12: true,
            timeZone: "Asia/Ho_Chi_Minh"
          })],
        })
      })
      .catch((error) => {
        console.log('Error subscribing to topic:', error);
      });
  } catch (error) {
    res.json({
      status: 500,
      data: error
    })
  }


});

router.get('*', function (req, res, next) {
  res.json({
    status: 200,
    data: [new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      hour12: true,
      timeZone: "Asia/Ho_Chi_Minh"
    })],
  })
});

module.exports = router;
