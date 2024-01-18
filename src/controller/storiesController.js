const admin = require('firebase-admin');
const db = admin.firestore();

const validCategories = ['Financial', 'Technology', 'Health'];
const validStatuses = ['Publish', 'Draft'];

exports.addStory = async (req, res) => {
    try {
        const {
            title,
            author,
            synopsis,
            category,
            storyCover,
            tags,
            status,
        } = req.body;

        if (!title || !author || !synopsis || !category || !status) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!validCategories.includes(category)) {
            return res.status(400).json({ error: 'Invalid category' });
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const storyRef = await db.collection('stories').add({
            title,
            author,
            synopsis,
            category,
            storyCover,
            tags,
            status,
        });

        res.status(201).json({ id: storyRef.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllStories = async (req, res) => {
    try {
        const snapshot = await db.collection('stories').get();
        const stories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(stories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.searchStory = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ error: 'Name parameter is required' });
        }

        const snapshot = await db.collection('stories').where('title', '==', name).get();
        const stories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(stories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.filterStories = async (req, res) => {
    try {
        const { category, status } = req.query;

        let query = db.collection('stories');

        if (category && validCategories.includes(category)) {
            query = query.where('category', '==', category);
        }

        if (status && validStatuses.includes(status)) {
            query = query.where('status', '==', status);
        }

        const snapshot = await query.get();
        const stories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(stories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateStory = async (req, res) => {
    try {
        const { title, author, synopsis, category, storyCover, tags, status } = req.body;
        const { storyId } = req.params;

        if (!title || !author || !synopsis || !category || !status) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!validCategories.includes(category)) {
            return res.status(400).json({ error: 'Invalid category' });
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        await db.collection('stories').doc(storyId).update({
            title,
            author,
            synopsis,
            category,
            storyCover,
            tags,
            status,
        });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteStory = async (req, res) => {
    try {
        const { storyId } = req.params;

        await db.collection('stories').doc(storyId).delete();

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
