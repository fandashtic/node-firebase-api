const express = require('express');
const cors = require('cors');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const config = require('./firebase-config.json');
const app = express();

app.use(cors({ origin: true }));
admin.initializeApp({
    credential: admin.credential.cert(config.tocken),
    databaseURL: config.databaseURL
});
const db = admin.firestore();

//HttpGet
//http://localhost:5000/mirror-app-ef1d2/us-central1/get?root=entries
//https://us-central1-mirror-app-ef1d2.cloudfunctions.net/get?root=entries
exports.get = functions.https.onRequest(async (request, response) => {
    var root = String(request.query.root);
    const snapshot = await db.collection(root).get();
    entries = snapshot.empty ? [] : snapshot.docs.map(doc => Object.assign(doc.data(), { id: doc.id }));
    response.send(entries);
});

//HttpPost
//http://localhost:5000/mirror-app-ef1d2/us-central1/put?root=entries&id=123
//https://us-central1-mirror-app-ef1d2.cloudfunctions.net/put?root=entries&id=Manickam
//Body: {"Name":"Hello1234","Class":"123","School":"GHSS"}
exports.put = functions.https.onRequest(async (request, response) => {
    var data = request.body;
    var root = String(request.query.root);
    var id = String(request.query.id);
    await db.collection(root)
        .doc(id)
        .set(data, { merge: true });
    response.send(data);
});
