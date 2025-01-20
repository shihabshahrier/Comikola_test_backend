// controllers/comicController.js
const { db, storage, admin } = require('../utils/firebase');
const Comic = require('../models/Comic');

const uploadComic = async (req, res) => {
  try {
    const { title, genre } = req.body;
    const coverImage = req.files['cover'][0];
    const comicPages = req.files['pages'];

    if (!coverImage || !comicPages || comicPages.length === 0) {
      return res.status(400).json({ message: 'Cover image and comic pages are required' });
    }

    // Check if user uploaded a comic today
    const userComics = await db.collection('comics')
      .where('authorId', '==', req.userId)
      .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0))))
      .get();

    if (!userComics.empty) {
      return res.status(400).json({ message: 'You can upload only one comic per day.' });
    }

    // Upload images to Firebase Storage
    const coverImageUrl = await uploadImage(coverImage);
    const comicPageUrls = await Promise.all(comicPages.map(page => uploadImage(page)));

    const newComic = {
      title,
      genre,
      coverImage: coverImageUrl,
      pages: comicPageUrls,
      authorId: req.userId,
      createdAt: admin.firestore.Timestamp.now(),
      likesCount: 0,
      commentsCount: 0,
      bookmarksCount: 0
    };

    const comicRef = await db.collection('comics').add(newComic);
    return res.status(201).json({
      message: 'Comic uploaded successfully',
      comicId: comicRef.id,
      comic: newComic
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ message: 'Error uploading comic', error: err.message });
  }
};

const uploadImage = async (file) => {
  const bucket = storage.bucket();
  const fileName = `${Date.now()}_${file.originalname}`;
  const fileUpload = bucket.file(fileName);

  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (error) => reject(error));
    blobStream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      resolve(publicUrl);
    });
    blobStream.end(file.buffer);
  });
};

module.exports = { uploadComic };
