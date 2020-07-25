// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');


// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();



//OnWrite Function (here handling OnUpdate and OnCreate 	)
  exports.sendNotificationOnUpdateNOnCreate = functions.database.ref('/Requests/{receiverId}/{senderId}')
    .onWrite((change, context) => {

     // Log according to OnUpdate or OnCreate
      if (!change.before.exists()) {
         console.log('OnCreate Executing');
     
      }
      else {
        
       // Exit when the data is deleted.
      if (!change.after.exists()) {
        return null;
      }
      else {
         console.log('OnUpdate Executing');
      }

      }

     
      // Else Do these operations

      // Grab the current value of what was written to the Realtime Database.
      const request = change.after.val();
      console.log('Retrieved Data', context.params.receiverId,     context.params.senderId, request.name,request.amount,request.description);
      
//Acquiring current Messaging token for the receiver of request
      const getRetrieveTokenPromise = admin.database().ref('/DeviceTokens/'+ context.params.receiverId).once('value');

     return getRetrieveTokenPromise.then(dataSnapshot => {
        const deviceToken=dataSnapshot.val();
	console.log('Receiver Token', context.params.receiverId, deviceToken);
        
        // Send Notification to the respective device
        var message = {
  notification: {
    title: 'New Request From: '+request.name,
    body: request.description
  },
  token: deviceToken
};

// Send a message to the device corresponding to the provided
// registration token.
return admin.messaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent Notification:', response);
    return null;
  })
  .catch((error) => {
    console.log('Error sending Notification:', error);
  });


    })
    });


