const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: options => options.length >= 2,
      message: 'At least 2 options are required'
    }
  },
  correctOption: {
    type: Number,
    required: true,
    min: [0, 'Option index cannot be negative']
  },
  explanation: String,
  category: String,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true
  },
  description: String,
  questions: [questionSchema],
  quizCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    match: [/^[A-Z0-9]{6}$/, 'Quiz code must be 6 alphanumeric characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  timeLimit: {
    type: Number, // in minutes
    default: 10,
    min: [1, 'Time limit must be at least 1 minute']
  }
});

quizSchema.index({ quizCode: 1 }, { unique: true });

module.exports = mongoose.model('Quiz', quizSchema); 