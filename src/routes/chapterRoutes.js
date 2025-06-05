const express = require('express');
const multer = require('multer');
const { isAdmin } = require('../middleware/auth');
const {
  getAllChapters,
  getChapter,
  uploadChapters
} = require('../controllers/chapterController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all chapters with filtering
router.get('/', getAllChapters);

// Get single chapter
router.get('/:id', getChapter);

// Upload chapters (admin only)
router.post('/', isAdmin, upload.single('file'), uploadChapters);

module.exports = router; 