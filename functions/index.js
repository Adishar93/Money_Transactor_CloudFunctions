// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');


// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
   exports.helloWorld = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
 });

  exports.databaseListener = functions.database.ref('/Requests/{receiverId}/{senderId}')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      const request = snapshot.val();
      console.log('Retrieved Data', context.params.receiverId,     context.params.senderId, request.name,request.amount,request.description);
      
//Acquiring current Messaging token for the receiver of request
      const getRetrieveTokenPromise = admin.database().ref('/DeviceTokens/'+ context.params.receiverId).once('value');

     return getRetrieveTokenPromise.then(dataSnapshot => {
        const token=dataSnapshot.val();
	console.log('Receiver Token', context.params.receiverId, token);
        return null;
        // Do something with the snapshot
    })
    });

