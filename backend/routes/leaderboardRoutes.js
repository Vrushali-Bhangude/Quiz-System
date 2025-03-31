import express from 'express';
import Leaderboard from '../models/Leaderboard.js';


const router = express.Router();

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const { quizId } = req.query;
    const leaderboard = await Leaderboard.find({ quizId })
      .sort({ score: -1, timeTaken: 1 })
      .limit(10);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;