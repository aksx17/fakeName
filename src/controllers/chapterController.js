const Chapter = require('../models/Chapter');
const { setCacheData, getCacheData, invalidateCache } = require('../config/redis');

// Get all chapters with filtering and pagination
exports.getAllChapters = async (req, res, next) => {
  try {
    const {
      class: classNum,
      unit,
      status,
      weakChapter,
      subject,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};
    if (classNum) filter.class = classNum;
    if (unit) filter.unit = unit;
    if (status) filter.status = status;
    if (weakChapter) filter.weakChapter = weakChapter === 'true';
    if (subject) filter.subject = subject;

    // Create cache key based on query parameters
    const cacheKey = `chapters:${JSON.stringify({ filter, page, limit })}`;

    // Try to get data from cache
    const cachedData = await getCacheData(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Chapter.countDocuments(filter);

    // Get chapters with pagination
    const chapters = await Chapter.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const response = {
      success: true,
      data: {
        chapters,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    };

    // Cache the response
    await setCacheData(cacheKey, response);

    res.json(response);
  } catch (err) {
    next(err);
  }
};

// Get single chapter by ID
exports.getChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Chapter not found'
        }
      });
    }

    res.json({
      success: true,
      data: chapter
    });
  } catch (err) {
    next(err);
  }
};

// Upload chapters from JSON file
exports.uploadChapters = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Please upload a JSON file'
        }
      });
    }

    const chapters = JSON.parse(req.file.buffer.toString());
    const failedUploads = [];
    const successfulUploads = [];

    for (const chapter of chapters) {
      try {
        const newChapter = new Chapter(chapter);
        await newChapter.validate();
        await newChapter.save();
        successfulUploads.push(newChapter);
      } catch (err) {
        failedUploads.push({
          chapter,
          error: err.message
        });
      }
    }

    // Invalidate cache after new chapters are added
    await invalidateCache('chapters:*');

    res.status(201).json({
      success: true,
      data: {
        successful: {
          count: successfulUploads.length,
          chapters: successfulUploads
        },
        failed: {
          count: failedUploads.length,
          chapters: failedUploads
        }
      }
    });
  } catch (err) {
    next(err);
  }
}; 