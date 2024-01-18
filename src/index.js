const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const serviceAccount = require('../key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const port = 5000;

const app = express();
app.use(cors());
app.use(express.json());

const storiesRoutes = require('./routes/stories');
const chaptersRoutes = require('./routes/chapters');

app.use('/stories', storiesRoutes);
app.use('/chapters', chaptersRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

exports.api = functions.https.onRequest(app);
