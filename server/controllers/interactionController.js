const { db } = require('../utils/firebase');
const { FieldValue } = require('firebase-admin/firestore');

// Like a comic
const likeComic = async (req, res) => {
  const { comicId } = req.body;
  const userId = req.userId;

  try {
    const likeRef = db.collection('likes').doc(`${userId}_${comicId}`);
    const doc = await likeRef.get();

    if (doc.exists) {
      // Unlike if already liked
      await likeRef.delete();
      await db.collection('comics').doc(comicId).update({
        likeCount: FieldValue.increment(-1)
      });
      return res.json({ message: 'Like removed' });
    } else {
      // Add new like
      await likeRef.set({
        userId,
        comicId,
        createdAt: FieldValue.serverTimestamp()
      });
      await db.collection('comics').doc(comicId).update({
        likeCount: FieldValue.increment(1)
      });
      return res.json({ message: 'Comic liked' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Comment on a comic (renamed from addComment to match route)
const commentOnComic = async (req, res) => {
  const { comicId, text } = req.body;
  const userId = req.userId;

  try {
    const newComment = {
      comicId,
      userId,
      text,
      createdAt: FieldValue.serverTimestamp(),
    };

    const commentRef = await db.collection('comments').add(newComment);
    return res.status(201).json({ message: 'Comment added', commentId: commentRef.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Bookmark a comic
const bookmarkComic = async (req, res) => {
  const { comicId } = req.body;
  const userId = req.userId;

  try {
    const bookmarkRef = db.collection('bookmarks').doc(`${userId}_${comicId}`);
    const doc = await bookmarkRef.get();

    if (doc.exists) {
      // Remove bookmark if exists
      await bookmarkRef.delete();
      await db.collection('comics').doc(comicId).update({
        bookmarkCount: FieldValue.increment(-1)
      });
      return res.json({ message: 'Bookmark removed' });
    } else {
      // Add new bookmark
      await bookmarkRef.set({
        userId,
        comicId,
        createdAt: FieldValue.serverTimestamp()
      });
      await db.collection('comics').doc(comicId).update({
        bookmarkCount: FieldValue.increment(1)
      });
      return res.json({ message: 'Comic bookmarked' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  likeComic,
  commentOnComic,
  bookmarkComic
};