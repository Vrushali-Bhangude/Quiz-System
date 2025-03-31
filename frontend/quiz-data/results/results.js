document.addEventListener('DOMContentLoaded', async function() {
    // Get results from session storage or use mock data for testing
    const results = JSON.parse(sessionStorage.getItem('quizResults')) || getMockResults();

    // DOM Elements
    const quizTitle = document.getElementById('quizTitle');
    const userScore = document.getElementById('userScore');
    const totalQuestions = document.getElementById('totalQuestions');
    const scorePercent = document.getElementById('scorePercent');
    const timeTaken = document.getElementById('timeTaken');
    const userRank = document.getElementById('userRank');
    const answersContainer = document.getElementById('answersContainer');
    const leaderboardTable = document.querySelector('#leaderboardTable tbody');
    const retakeBtn = document.getElementById('retakeQuiz');
    const leaderboardFilter = document.getElementById('leaderboardFilter');

    // Display basic results
    displayResults(results);

    // Display user answers
    displayUserAnswers(results);

    // Load and display leaderboard
    const leaderboard = await loadLeaderboard(results.quizId);
    displayLeaderboard(leaderboard, results);

    // Event listeners
    setupEventListeners(results);

    // ========== MAIN FUNCTIONS ==========

    function displayResults(results) {
        quizTitle.textContent = results.quizTitle;
        userScore.textContent = results.score;
        totalQuestions.textContent = results.totalQuestions;
        timeTaken.textContent = formatTime(results.timeTaken);
        
        const percentage = Math.round((results.score / results.totalQuestions) * 100);
        scorePercent.textContent = `${percentage}%`;
        scorePercent.style.color = getPercentageColor(percentage);
    }

    function displayUserAnswers(results) {
        answersContainer.innerHTML = '';
        
        results.questions.forEach((question, index) => {
            const userAnswer = results.userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            const answerText = userAnswer !== null ? 
                `Option ${userAnswer + 1}: ${question.options[userAnswer]}` : 
                'Skipped';
            const correctAnswerText = `Option ${question.correctAnswer + 1}: ${question.options[question.correctAnswer]}`;
            
            const answerElement = document.createElement('div');
            answerElement.className = `answer-item ${isCorrect ? 'correct' : 'incorrect'}`;
            answerElement.innerHTML = `
                <div class="answer-question">Question ${index + 1}: ${question.text}</div>
                <div class="answer-user">${answerText}</div>
                ${!isCorrect ? `<div class="answer-correct">${correctAnswerText}</div>` : ''}
                <div class="answer-time">Time taken: ${formatTime(question.timeTaken || 0)}</div>
            `;
            
            answersContainer.appendChild(answerElement);
        });
    }

    async function loadLeaderboard(quizId) {
        try {
            // In a real app, you would fetch from your backend:
            // const response = await fetch(`/api/quizzes/${quizId}/leaderboard`);
            // return await response.json();
            
            // Mock leaderboard data with time tracking
            return [
                { 
                    username: 'QuizMaster', 
                    score: 10, 
                    totalQuestions: 10, 
                    timeTaken: 98,
                    answers: Array(10).fill().map((_,i) => ({ 
                        correct: true, 
                        timeTaken: Math.floor(Math.random() * 15) + 5 
                    }))
                },
                { 
                    username: 'Brainiac', 
                    score: 9, 
                    totalQuestions: 10, 
                    timeTaken: 110,
                    answers: Array(9).fill().map((_,i) => ({ 
                        correct: i !== 3, 
                        timeTaken: Math.floor(Math.random() * 20) + 10 
                    }))
                },
                { 
                    username: 'Player1', 
                    score: 7, 
                    totalQuestions: 10, 
                    timeTaken: 125,
                    answers: results.userAnswers.map((ans, i) => ({
                        correct: ans === results.questions[i].correctAnswer,
                        timeTaken: results.questions[i].timeTaken || 0
                    }))
                },
                { 
                    username: 'TestUser', 
                    score: 7, 
                    totalQuestions: 10, 
                    timeTaken: 150,
                    answers: Array(7).fill().map((_,i) => ({ 
                        correct: true, 
                        timeTaken: Math.floor(Math.random() * 25) + 15 
                    }))
                },
                { 
                    username: 'Newbie', 
                    score: 4, 
                    totalQuestions: 10, 
                    timeTaken: 180,
                    answers: Array(4).fill().map((_,i) => ({ 
                        correct: true, 
                        timeTaken: Math.floor(Math.random() * 30) + 20 
                    }))
                }
            ];
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            return [];
        }
    }

    function displayLeaderboard(leaderboard, userResults) {
        // Sort by score (descending) then by time taken (ascending)
        const sortedLeaderboard = [...leaderboard].sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.timeTaken - b.timeTaken;
        });

        // Find user's rank
        const userEntry = sortedLeaderboard.find(entry => 
            entry.username === userResults.nickname && 
            entry.score === userResults.score &&
            entry.timeTaken === userResults.timeTaken
        );
        
        if (userEntry) {
            const rank = sortedLeaderboard.indexOf(userEntry) + 1;
            userRank.textContent = `#${rank} (Top ${Math.round((rank / sortedLeaderboard.length) * 100)}%)`;
        } else {
            userRank.textContent = 'Not ranked';
        }
        
        // Populate leaderboard table
        leaderboardTable.innerHTML = '';
        sortedLeaderboard.forEach((entry, index) => {
            const row = document.createElement('tr');
            
            // Highlight current user
            if (entry.username === userResults.nickname && 
                entry.score === userResults.score && 
                entry.timeTaken === userResults.timeTaken) {
                row.classList.add('user-highlight');
            }
            
            // Add rank classes for top 3
            if (index === 0) row.classList.add('rank-1');
            if (index === 1) row.classList.add('rank-2');
            if (index === 2) row.classList.add('rank-3');
            
            // Calculate average time per question
            const avgTime = entry.timeTaken / entry.totalQuestions;
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.username}</td>
                <td>${entry.score}/${entry.totalQuestions}</td>
                <td>${formatTime(entry.timeTaken)}</td>
                <td>${formatTime(avgTime)} per question</td>
            `;
            
            leaderboardTable.appendChild(row);
        });
    }

    function setupEventListeners(results) {
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab, .tab-content').forEach(el => {
                    el.classList.remove('active');
                });
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
        });

        // Leaderboard filter
        leaderboardFilter.addEventListener('change', async () => {
            const leaderboard = await loadLeaderboard(results.quizId);
            displayLeaderboard(leaderboard, results);
        });

        // Retake quiz button
        retakeBtn.addEventListener('click', () => {
            sessionStorage.removeItem('quizResults');
            window.location.href = `../show/show.html?code=${results.quizCode}`;
        });
    }

    // ========== HELPER FUNCTIONS ==========

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${mins > 0 ? `${mins}m ` : ''}${secs}s`;
    }

    function getPercentageColor(percentage) {
        if (percentage >= 80) return '#00b894'; // Green
        if (percentage >= 50) return '#fdcb6e'; // Yellow
        return '#d63031'; // Red
    }

    function getMockResults() {
        // Mock quiz questions
        const questions = [
            {
                text: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correctAnswer: 2,
                timeTaken: 12
            },
            {
                text: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correctAnswer: 1,
                timeTaken: 8
            },
            // Add more mock questions as needed...
        ];

        return {
            quizId: 'quiz123',
            quizCode: 'ABC123',
            quizTitle: 'Sample Quiz',
            nickname: 'Player1',
            score: 7,
            totalQuestions: 10,
            timeTaken: 125,
            userAnswers: [0, 1, 2, null, 1, 0, 2, 1, 0, 3],
            correctAnswers: [0, 1, 3, 2, 1, 0, 2, 1, 0, 3],
            questions: questions.concat(Array(7).fill().map((_,i) => ({
                text: `Sample Question ${i+4}`,
                options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                correctAnswer: Math.floor(Math.random() * 4),
                timeTaken: Math.floor(Math.random() * 20) + 5
            })))
        };
    }
});