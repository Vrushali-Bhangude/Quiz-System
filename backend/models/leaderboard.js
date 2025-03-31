import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  },
  username: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  timeTaken: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

leaderboardSchema.index({ quizId: 1, score: -1 });

// ES Modules export
const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
export default Leaderboard;