const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

const Comic = {
    create: async (userId, title, imageUrl, description) => {
        try {
            const newComicRef = db.collection("comics").doc();
            const comicData = {
                id: newComicRef.id,
                userId,
                title,
                imageUrl,
                description,
                createdAt: new Date(),
                likes: 0,
                comments: 0,
            };
            await newComicRef.set(comicData);
            return { success: true, message: "Comic uploaded successfully", comic: comicData };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    getAll: async () => {
        const comicsRef = db.collection("comics");
        const snapshot = await comicsRef.get();
        return snapshot.docs.map((doc) => doc.data());
    },

    getById: async (id) => {
        const comicRef = db.collection("comics").doc(id);
        const doc = await comicRef.get();
        return doc.exists ? doc.data() : null;
    },
};

module.exports = Comic;
