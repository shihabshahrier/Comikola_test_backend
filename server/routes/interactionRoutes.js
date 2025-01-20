const express = require('express');
const { likeComic, commentOnComic, bookmarkComic } = require('../controllers/interactionController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/like', authMiddleware, likeComic);
router.post('/comment', authMiddleware, commentOnComic);
router.post('/bookmark', authMiddleware, bookmarkComic);

module.exports = router;
