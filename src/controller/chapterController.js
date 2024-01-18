const admin = require('firebase-admin');
const db = admin.firestore();

exports.addChapter = async (req, res) => {
    try {
        const { chapterTitle, storyChapter } = req.body;
        const { storyId } = req.params;

        if (!chapterTitle || !storyChapter) {
            return res.status(400).json({ error: 'Chapter title and story content are required' });
        }

        const chapterRef = await db.collection(`stories/${storyId}/chapters`).add({
            chapterTitle,
            storyChapter,
            lastUpdated: new Date(),
        });

        res.status(201).json({ id: chapterRef.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getChapters = async (req, res) => {
    try {
        const { storyId } = req.params;
        const snapshot = await db.collection(`stories/${storyId}/chapters`).get();
        const chapters = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(chapters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateChapter = async (req, res) => {
    try {
        const { chapterTitle, storyChapter } = req.body;
        const { storyId, chapterId } = req.params;

        if (!chapterTitle || !storyChapter) {
            return res.status(400).json({ error: 'Chapter title and story content are required' });
        }

        await db.collection(`stories/${storyId}/chapters`).doc(chapterId).update({
            chapterTitle,
            storyChapter,
            lastUpdated: new Date(),
        });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteChapter = async (req, res) => {
    try {
        const { storyId, chapterId } = req.params;

        await db.collection(`stories/${storyId}/chapters`).doc(chapterId).delete();

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
