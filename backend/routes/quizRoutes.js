const express = require('express');
const router = express.Router();
const Quiz = require('../models/quizModel');
const Leaderboard = require('../models/Leaderboard');

// Helper function to generate unique quiz code
const generateQuizCode = async () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let quizCode;
  let attempts = 0;
  
  do {
    quizCode = Array.from({ length: 6 }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    attempts++;
  } while (await Quiz.exists({ quizCode }) && attempts < 10);

  return attempts < 10 ? quizCode : null;
};

// Create a new quiz
router.post('/quizzes', async (req, res) => {
  try {
    const { title, description, questions, timeLimit } = req.body;

    // Validate required fields
    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Title and at least one question are required' });
    }

    // Validate each question
    for (const question of questions) {
      if (!question.questionText || !question.options || question.options.length < 2) {
        return res.status(400).json({ 
          message: 'Each question must have text and at least 2 options' 
        });
      }
      if (question.correctOption === undefined || question.correctOption < 0) {
        return res.status(400).json({
          message: 'Each question must have a valid correct option index'
        });
      }
    }

    // Generate unique quiz code
    const quizCode = await generateQuizCode();
    if (!quizCode) {
      return res.status(500).json({ message: 'Failed to generate unique quiz code' });
    }

    // Create and save quiz
    const quiz = new Quiz({ 
      title, 
      description: description || '', 
      questions, 
      quizCode,
      timeLimit: timeLimit || 10 // Default 10 minutes if not provided
    });

    await quiz.save();
    
    // Log successful creation
    console.log(`[SUCCESS] Created quiz: ${quizCode} with ${questions.length} questions`);
    
    res.status(201).json({
      message: 'Quiz created successfully',
      quiz: {
        id: quiz._id,
        title: quiz.title,
        quizCode: quiz.quizCode,
        questionCount: quiz.questions.length,
        timeLimit: quiz.timeLimit
      }
    });

  } catch (error) {
    console.error('[ERROR] Quiz creation failed:', error.message);
    res.status(500).json({ 
      message: 'Server error creating quiz',
      error: error.message 
    });
  }
});

// Get quiz by code
router.get('/quizzes/:quizCode', async (req, res) => {
  try {
    const quizCode = req.params.quizCode.toUpperCase();
    console.log(`[REQUEST] Fetching quiz: ${quizCode}`);

    const currentQuiz = await Quiz.findOne({ quizCode })
      .select('-__v -createdAt -updatedAt')
      .lean();
    
    if (!currentQuiz) {
      console.log(`[NOT FOUND] Quiz: ${quizCode}`);
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    // Format response
    const quizData = {
      ...currentQuiz,
      questions: currentQuiz.questions.map(q => ({
        questionText: q.questionText,
        options: q.options,
        // Don't send correct option to client
      }))
    };
    
    console.log(`[SUCCESS] Retrieved quiz: ${quizCode}`);
    res.json(quizData);
    
  } catch (error) {
    console.error(`[ERROR] Fetching quiz ${req.params.quizCode}:`, error.message);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
});

// Submit quiz results
router.post('/quizzes/:quizCode/submit', async (req, res) => {
  try {
    const quizCode = req.params.quizCode.toUpperCase();
    const { username, answers, timeTaken } = req.body;

    // Validate input
    if (!username || !Array.isArray(answers) || typeof timeTaken !== 'number') {
      return res.status(400).json({ message: 'Invalid submission data' });
    }

    // Get the quiz
    const quiz = await Quiz.findOne({ quizCode });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctOption) {
        score++;
      }
    });

    // Create leaderboard entry
    const entry = new Leaderboard({
      quizId: quiz._id,
      quizCode,
      username: username.substring(0, 20).trim(),
      score,
      timeTaken: Math.min(timeTaken, quiz.timeLimit * 60), // Cap at max possible time
      totalQuestions: quiz.questions.length
    });

    await entry.save();

    // Get updated leaderboard
    const leaderboard = await Leaderboard.find({ quizCode })
      .sort({ score: -1, timeTaken: 1 })
      .limit(10)
      .select('username score timeTaken totalQuestions -_id');

    console.log(`[SUCCESS] Quiz submitted: ${quizCode} by ${username}`);
    
    res.json({
      message: 'Results submitted successfully',
      score,
      totalQuestions: quiz.questions.length,
      leaderboard
    });

  } catch (error) {
    console.error('[ERROR] Quiz submission failed:', error.message);
    res.status(500).json({ 
      message: 'Server error submitting results',
      error: error.message 
    });
  }
});

// Get leaderboard by quiz code
router.get('/quizzes/:quizCode/leaderboard', async (req, res) => {
  try {
    const quizCode = req.params.quizCode.toUpperCase();
    
    const leaderboard = await Leaderboard.find({ quizCode })
      .sort({ score: -1, timeTaken: 1 })
      .limit(10)
      .select('username score timeTaken totalQuestions -_id');

    if (leaderboard.length === 0) {
      // Check if quiz exists
      const quizExists = await Quiz.exists({ quizCode });
      if (!quizExists) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
    }

    console.log(`[SUCCESS] Retrieved leaderboard for: ${quizCode}`);
    
    res.json({
      message: 'Leaderboard retrieved successfully',
      leaderboard
    });
  } catch (error) {
    console.error(`[ERROR] Fetching leaderboard ${req.params.quizCode}:`, error.message);
    res.status(500).json({ 
      message: 'Server error fetching leaderboard',
      error: error.message 
    });
  }
});

// Additional route to get quiz metadata without questions
router.get('/quizzes/:quizCode/metadata', async (req, res) => {
  try {
    const quizCode = req.params.quizCode.toUpperCase();
    
    const quiz = await Quiz.findOne({ quizCode })
      .select('title description quizCode timeLimit questions')
      .lean();

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({
      title: quiz.title,
      description: quiz.description,
      quizCode: quiz.quizCode,
      timeLimit: quiz.timeLimit,
      questionCount: quiz.questions.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 