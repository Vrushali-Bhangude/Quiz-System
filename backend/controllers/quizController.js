const Quiz = require('../models/quizModel');

// Get all quizzes
const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a new quiz
const addQuiz = async (req, res) => {
    const { question, options, correctAnswer } = req.body;

    try {
        const newQuiz = new Quiz({ question, options, correctAnswer });
        await newQuiz.save();
        res.status(201).json(newQuiz);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { getQuizzes, addQuiz };