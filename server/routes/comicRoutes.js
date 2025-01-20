// routes/comicRoutes.js
const express = require('express');
const { uploadComic } = require('../controllers/comicController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

router.post('/upload',
    authMiddleware,
    upload.fields([
        { name: 'cover', maxCount: 1 },
        { name: 'pages', maxCount: 50 }
    ]),
    uploadComic
);

module.exports = router;
