const admin = require('firebase-admin');
const db = admin.firestore();

const validCategories = ['Financial', 'Technology', 'Health'];
const validStatuses = ['Publish', 'Draft'];

class StoriesService {
    static async addStory(storyData) {
        const {
            title,
            author,
            synopsis,
            category,
            storyCover,
            tags,
            status,
        } = storyData;

        if (!title || !author || !synopsis || !category || !status) {
            throw new Error('All fields are required');
        }

        if (!validCategories.includes(category)) {
            throw new Error('Invalid category');
        }

        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status');
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

        return { id: storyRef.id };
    }

    static async getAllStories() {
        const snapshot = await db.collection('stories').get();
        const stories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return stories;
    }

    static async searchStoryByName(name) {
        if (!name) {
            throw new Error('Name parameter is required');
        }

        const snapshot = await db.collection('stories').where('title', '==', name).get();
        const stories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return stories;
    }

    static async filterStoriesByCategoryAndStatus(category, status) {
        let query = db.collection('stories');

        if (category && validCategories.includes(category)) {
            query = query.where('category', '==', category);
        }

        if (status && validStatuses.includes(status)) {
            query = query.where('status', '==', status);
        }

        const snapshot = await query.get();
        const stories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return stories;
    }
    
    static async updateStory(storyId, storyData) {
        const {
            title,
            author,
            synopsis,
            category,
            storyCover,
            tags,
            status,
        } = storyData;

        if (!title || !author || !synopsis || !category || !status) {
            throw new Error('All fields are required');
        }

        if (!validCategories.includes(category)) {
            throw new Error('Invalid category');
        }

        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status');
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

        return { success: true };
    }

    static async deleteStory(storyId) {
        await db.collection('stories').doc(storyId).delete();
        return { success: true };
    }
}

module.exports = StoriesService;
