const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
var webpush = require('web-push');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const serviceAccount = require("./pwagram.fb.key.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pwagram-4062a.firebaseio.com/',
});

exports.storePOstData = functions.https.onRequest((request, response) => {
 cors(request, response, () => {
  admin.database().ref('posts').push({
    id: request.body.id,
    title: request.body.title,
    location: request.body.location,
    image: request.body.image,
  })
    .then(() => {
      webpush.setVapidDetails('mailto:business@adadsf.com','BAL8tid_eV2sdVr3V6LkzHYKU1-Lpywxhea4ZmLq3zD6Nf6qHmdCsyqPVwygDxA8GC-KJS6lGPXlnpqiliI6DJU', 'b4aB-yY0402M4FgdUJVo_0sowGUOMrLxriIlb2_yH34');
      return admin.database().ref('subscriptions').once('value');
    })
    .then((subscriptions) => {
      subscriptions.forEach((sub) => {
        let pushConfig = {
          endpoint: sub.val().endpoint,
          keys: {
            auth: sub.val().keys.auth,
            p256dh: sub.val().keys.p256dh,
          }
        };

        webpush.sendNotification(pushConfig, JSON.stringify({
          title: 'New Post',
          content: 'New Post added!',
          openUrl: '/help',
        }))
          .catch(err => {
            console.log(err);
          });
      });
      return response.status(201).json({ message: 'Data stored', id: request.body.id });
    })
    .catch((err) => {
      return response.status(500).json({ error: err });
    });
 });
});
