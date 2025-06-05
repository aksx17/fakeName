const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Chapter name is required'],
    trim: true
  },
  class: {
    type: Number,
    required: [true, 'Class is required'],
    min: 1,
    max: 12
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  weakChapter: {
    type: Boolean,
    default: false
  },
  performance: {
    averageScore: {
      type: Number,
      min: 0,
      max: 100
    },
    completionRate: {
      type: Number,
      min: 0,
      max: 100
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
chapterSchema.index({ class: 1, subject: 1, unit: 1 });
chapterSchema.index({ status: 1 });
chapterSchema.index({ weakChapter: 1 });

module.exports = mongoose.model('Chapter', chapterSchema); 