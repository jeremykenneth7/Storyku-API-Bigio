const admin = require('firebase-admin');
const db = admin.firestore();

class ChaptersService {
    static async addChapter(storyId, chapterData) {
        const { chapterTitle, storyChapter } = chapterData;

        if (!chapterTitle || !storyChapter) {
            throw new Error('Chapter title and story content are required');
        }

        const chapterRef = await db.collection(`stories/${storyId}/chapters`).add({
            chapterTitle,
            storyChapter,
            lastUpdated: new Date(),
        });

        return { id: chapterRef.id };
    }

    static async getChapters(storyId) {
        const snapshot = await db.collection(`stories/${storyId}/chapters`).get();
        const chapters = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return chapters;
    }
    static async updateChapter(storyId, chapterId, chapterData) {
        const { chapterTitle, storyChapter } = chapterData;

        if (!chapterTitle || !storyChapter) {
            throw new Error('Chapter title and story content are required');
        }

        await db.collection(`stories/${storyId}/chapters`).doc(chapterId).update({
            chapterTitle,
            storyChapter,
            lastUpdated: new Date(),
        });

        return { success: true };
    }

    static async deleteChapter(storyId, chapterId) {
        await db.collection(`stories/${storyId}/chapters`).doc(chapterId).delete();
        return { success: true };
    }
}

module.exports = ChaptersService;
