const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

const User = {
    create: async (uid, email, username) => {
        try {
            const userRef = db.collection("users").doc(uid);
            await userRef.set({
                uid,
                email,
                username,
                createdAt: new Date(),
            });
            return { success: true, message: "User created successfully" };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    getById: async (uid) => {
        const userRef = db.collection("users").doc(uid);
        const doc = await userRef.get();
        return doc.exists ? doc.data() : null;
    },

    updateProfile: async (uid, updates) => {
        const userRef = db.collection("users").doc(uid);
        await userRef.update(updates);
        return { success: true, message: "Profile updated successfully" };
    },
};

module.exports = User;
