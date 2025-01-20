const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

const Interaction = {
    likeComic: async (userId, comicId) => {
        const likeRef = db.collection("likes").doc(`${userId}_${comicId}`);
        await likeRef.set({ userId, comicId, createdAt: new Date() });
        return { success: true, message: "Comic liked" };
    },

    commentOnComic: async (userId, comicId, comment) => {
        const newCommentRef = db.collection("comments").doc();
        const commentData = {
            id: newCommentRef.id,
            userId,
            comicId,
            comment,
            createdAt: new Date(),
        };
        await newCommentRef.set(commentData);
        return { success: true, message: "Comment added", comment: commentData };
    },

    bookmarkComic: async (userId, comicId) => {
        const bookmarkRef = db.collection("bookmarks").doc(`${userId}_${comicId}`);
        await bookmarkRef.set({ userId, comicId, createdAt: new Date() });
        return { success: true, message: "Comic bookmarked" };
    },
};

module.exports = Interaction;
