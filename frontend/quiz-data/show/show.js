document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const quizTitle = document.getElementById('quizTitle');
    const timeRemaining = document.getElementById('timeRemaining');
    const userNickname = document.getElementById('userNickname');
    const questionCounter = document.getElementById('questionCounter');
    const questionsContainer = document.getElementById('questionsContainer');
    const prevButton = document.getElementById('prevQuestion');
    const nextButton = document.getElementById('nextQuestion');
    const submitButton = document.getElementById('submitQuiz');
    
    // Timing variables
    let quizStartTime;
    let questionStartTimes = [];
    let questionTimes = [];
    
    // Quiz data from session storage
    const quizData = JSON.parse(sessionStorage.getItem('quizData'));
    const nickname = sessionStorage.getItem('playerName');
    
    // Quiz state variables
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let timeLeft = 40; // 40 seconds (changed from comment saying 2 minutes)
    let timerInterval;

    // Initialize the quiz
    function initQuiz() {
        if (!quizData || !nickname) {
            window.location.href = 'join.html';
            return;
        }

        // Initialize timing
        quizStartTime = Date.now();
        questionStartTimes = new Array(quizData.questions.length);
        questionTimes = new Array(quizData.questions.length).fill(0);

        // Set up quiz info
        quizTitle.textContent = quizData.title;
        userNickname.textContent = nickname;
        userAnswers = new Array(quizData.questions.length).fill(null);

        // Start timer
        startTimer();
        
        // Display first question
        showQuestion(0);
        updateNavigationButtons();
    }

    // Timer functionality
    function startTimer() {
        updateTimerDisplay();
        timerInterval = setInterval(function() {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                submitQuiz();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeRemaining.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Question display and navigation
    function showQuestion(index) {
        // Record end time for previous question
        if (currentQuestionIndex >= 0 && questionStartTimes[currentQuestionIndex]) {
            const endTime = Date.now();
            questionTimes[currentQuestionIndex] = (endTime - questionStartTimes[currentQuestionIndex]) / 1000;
        }
        
        // Update current index and record start time
        currentQuestionIndex = index;
        questionStartTimes[index] = Date.now();
        
        // Display the question
        displayQuestion();
    }

    function displayQuestion() {
        const question = quizData.questions[currentQuestionIndex];
        questionsContainer.innerHTML = '';

        const questionElement = document.createElement('div');
        questionElement.className = 'question';
        questionElement.innerHTML = `
            <h2>Question ${currentQuestionIndex + 1}</h2>
            <p class="question-text">${question.question}</p>
            <div class="options">
                ${question.options.map((option, index) => `
                    <label class="option">
                        <input type="radio" name="question" value="${index}" 
                            ${userAnswers[currentQuestionIndex] === index ? 'checked' : ''}>
                        <span>${String.fromCharCode(65 + index)}. ${option}</span>
                    </label>
                `).join('')}
            </div>
        `;

        questionElement.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', function() {
                userAnswers[currentQuestionIndex] = parseInt(this.value);
            });
        });

        questionsContainer.appendChild(questionElement);
        updateQuestionCounter();
    }

    function updateQuestionCounter() {
        questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${quizData.questions.length}`;
    }

    function updateNavigationButtons() {
        prevButton.disabled = currentQuestionIndex === 0;
        nextButton.classList.toggle('hidden', currentQuestionIndex === quizData.questions.length - 1);
        submitButton.classList.toggle('hidden', currentQuestionIndex !== quizData.questions.length - 1);
    }

    // Navigation event handlers
    nextButton.addEventListener('click', function() {
        if (currentQuestionIndex < quizData.questions.length - 1) {
            showQuestion(currentQuestionIndex + 1);
            updateNavigationButtons();
        }
    });

    prevButton.addEventListener('click', function() {
        if (currentQuestionIndex > 0) {
            showQuestion(currentQuestionIndex - 1);
            updateNavigationButtons();
        }
    });

    // Quiz submission
    submitButton.addEventListener('click', submitQuiz);

    function submitQuiz() {
        clearInterval(timerInterval);
        
        // Calculate time for current question
        if (currentQuestionIndex >= 0 && questionStartTimes[currentQuestionIndex]) {
            const endTime = Date.now();
            questionTimes[currentQuestionIndex] = (endTime - questionStartTimes[currentQuestionIndex]) / 1000;
        }
        
        // Calculate total time and score
        const totalTime = (Date.now() - quizStartTime) / 1000;
        let score = 0;
        const results = quizData.questions.map((question, index) => {
            const isCorrect = userAnswers[index] === question.correctOption;
            if (isCorrect) score++;
            return {
                question: question.question,
                userAnswer: question.options[userAnswers[index]] || 'Not answered',
                correctAnswer: question.options[question.correctOption],
                isCorrect: isCorrect,
                timeTaken: questionTimes[index] || 0
            };
        });

        // Store complete results
        sessionStorage.setItem('quizResults', JSON.stringify({
            quizId: quizData.id,
            quizCode: quizData.code,
            quizTitle: quizData.title,
            nickname: nickname,
            score: score,
            totalQuestions: quizData.questions.length,
            timeTaken: totalTime,
            userAnswers: userAnswers,
            correctAnswers: quizData.questions.map(q => q.correctOption),
            questions: quizData.questions.map((q, i) => ({
                text: q.question,
                options: q.options,
                correctAnswer: q.correctOption,
                timeTaken: questionTimes[i] || 0
            })),
            detailedResults: results
        }));

        // Redirect to results page
        window.location.href = '../results/results.html';
    }

    // Initialize the quiz
    initQuiz();
});


// document.addEventListener("DOMContentLoaded", function () {
//     // DOM Elements
//     const homeContent = document.getElementById('homeContent');
//     const addQuizContent = document.getElementById('addQuizContent');
//     const addedQuizzesContent = document.getElementById('addedQuizzesContent');
//     const addQuizTab = document.getElementById('addQuizTab');
//     const addedQuizzesTab = document.getElementById('addedQuizzesTab');
//     const createQuizCta = document.getElementById('createQuizCta');
//     const exploreQuizzesCta = document.getElementById('exploreQuizzesCta');
//     const quizzesList = document.getElementById('quizzesList');
//     const createQuizForm = document.getElementById('createQuizForm');
//     const questionsContainer = document.getElementById('questionsContainer');
//     const addQuestionButton = document.getElementById('addQuestion');
//     const randomQuizButtons = document.querySelectorAll('.random-quiz-btn');

//     let quizzes = []; // Store quizzes in memory

//     // Show the selected content and hide others
//     function showContent(contentToShow) {
//         [homeContent, addQuizContent, addedQuizzesContent].forEach(content => content.classList.add('hidden'));
//         contentToShow.classList.remove('hidden');
//     }

//     // Handle "Add Quiz" tab and button
//     addQuizTab.addEventListener('click', function (e) {
//         e.preventDefault();
//         showContent(addQuizContent);
//     });

//     createQuizCta.addEventListener('click', function (e) {
//         e.preventDefault();
//         showContent(addQuizContent);
//     });

//     // Handle "Added Quizzes" tab and button
//     addedQuizzesTab.addEventListener('click', function (e) {
//         e.preventDefault();
//         showContent(addedQuizzesContent);
//         loadQuizzes();
//     });

//     exploreQuizzesCta.addEventListener('click', function (e) {
//         e.preventDefault();
//         showContent(addedQuizzesContent);
//         loadQuizzes();
//     });

//     // Load quizzes from the database and display them
//     async function loadQuizzes() {
//         try {
//             const response = await fetch('http://localhost:5000/api/quizzes');
//             console.log('Fetch response:', response); // Log the response
//             if (!response.ok) {
//                 throw new Error('Failed to fetch quizzes');
//             }
//             quizzes = await response.json();
//             console.log('Quizzes loaded:', quizzes); // Log the quizzes
//             renderQuizzes(quizzes);
//         } catch (error) {
//             console.error('Error loading quizzes:', error);
//         }
//     }

//     // Render quizzes in the "Added Quizzes" section
//     function renderQuizzes(quizzes) {
//         quizzesList.innerHTML = ''; // Clear previous content
//         console.log('Rendering quizzes:', quizzes); // Log the quizzes
//         quizzes.forEach(quiz => {
//             const quizElement = document.createElement('div');
//             quizElement.classList.add('quiz-card');
//             quizElement.innerHTML = `
//                 <h3>${quiz.title}</h3>
//                 <p>${quiz.description}</p>
//                 <button class="view-quiz-btn" data-id="${quiz._id}">View Quiz</button>
//                 <button class="edit-quiz-btn" data-id="${quiz._id}">Edit Quiz</button>
//                 <button class="remove-quiz-btn" data-id="${quiz._id}">Remove Quiz</button>
//             `;
//             quizzesList.appendChild(quizElement);
//         });
//     }

//     // Handle quiz removal
//     quizzesList.addEventListener('click', async function (e) {
//         if (e.target.classList.contains('remove-quiz-btn')) {
//             const quizId = e.target.getAttribute('data-id');
//             try {
//                 const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}`, {
//                     method: 'DELETE',
//                 });
//                 if (!response.ok) {
//                     throw new Error('Failed to delete quiz');
//                 }
//                 alert('Quiz removed successfully!');
//                 loadQuizzes(); // Refresh the list
//             } catch (error) {
//                 console.error('Error removing quiz:', error);
//                 alert('Error removing quiz. Please try again.');
//             }
//         }
//     });

//     // Handle quiz editing
//     quizzesList.addEventListener('click', async function (e) {
//         if (e.target.classList.contains('edit-quiz-btn')) {
//             const quizId = e.target.getAttribute('data-id');
//             try {
//                 const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}`);
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch quiz');
//                 }
//                 const quiz = await response.json();
//                 showContent(addQuizContent);
//                 populateForm(quiz);
//             } catch (error) {
//                 console.error('Error fetching quiz:', error);
//                 alert('Error fetching quiz. Please try again.');
//             }
//         }
//     });

//     // Populate form with quiz data for editing
//     function populateForm(quiz) {
//         document.getElementById('quizTitle').value = quiz.title;
//         document.getElementById('quizDescription').value = quiz.description;
//         document.getElementById('quizId').value = quiz._id; // Set quiz ID for editing
//         questionsContainer.innerHTML = ''; // Clear previous questions

//         quiz.questions.forEach(question => {
//             const questionDiv = document.createElement('div');
//             questionDiv.classList.add('question');
//             questionDiv.innerHTML = `
//                 <input type="text" class="questionInput" placeholder="Enter question" value="${question.question}" required>
//                 <div class="options">
//                     ${question.options.map((opt, i) => `
//                         <input type="text" class="optionInput" placeholder="Option ${i + 1}" value="${opt}" required>
//                     `).join('')}
//                     <label for="correctOption">Correct Option:</label>
//                     <select class="correctOption">
//                         ${question.options.map((_, i) => `
//                             <option value="${i}" ${i === question.correctOption ? 'selected' : ''}>Option ${i + 1}</option>
//                         `).join('')}
//                     </select>
//                 </div>
//                 <button type="button" class="removeQuestion">Remove Question</button>
//             `;
//             questionsContainer.appendChild(questionDiv);
//         });
//     }

//     // Handle form submission for creating/editing a quiz
//     createQuizForm.addEventListener('submit', async function (e) {
//         e.preventDefault();

//         const quizTitle = document.getElementById('quizTitle').value.trim();
//         const quizDescription = document.getElementById('quizDescription').value.trim();
//         const questionElements = document.querySelectorAll('.question');

//         if (!quizTitle || !quizDescription || questionElements.length === 0) {
//             alert("Please enter a title, description, and at least one question.");
//             return;
//         }

//         let questions = Array.from(questionElements).map(question => {
//             return {
//                 question: question.querySelector('.questionInput').value.trim(),
//                 options: Array.from(question.querySelectorAll('.optionInput')).map(opt => opt.value.trim()),
//                 correctOption: parseInt(question.querySelector('.correctOption').value)
//             };
//         });

//         if (questions.some(q => !q.question || q.options.some(opt => opt === ""))) {
//             alert("All questions and options must be filled.");
//             return;
//         }

//         const quizData = {
//             title: quizTitle,
//             description: quizDescription,
//             questions: questions,
//         };

//         const quizId = document.getElementById('quizId').value; // For editing
//         const url = quizId ? `http://localhost:5000/api/quizzes/${quizId}` : 'http://localhost:5000/api/quizzes';
//         const method = quizId ? 'PUT' : 'POST';

//         try {
//             const response = await fetch(url, {
//                 method: method,
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(quizData),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to save quiz');
//             }

//             const result = await response.json();
//             alert('Quiz saved successfully!');
//             showContent(homeContent);
//             loadQuizzes();
//             createQuizForm.reset();
//             questionsContainer.innerHTML = '';
//         } catch (error) {
//             console.error('Error saving quiz:', error);
//             alert('Error saving quiz. Please try again.');
//         }
//     });

//     // Add a new question
//     addQuestionButton.addEventListener('click', function () {
//         const questionDiv = document.createElement('div');
//         questionDiv.classList.add('question');
//         questionDiv.innerHTML = `
//             <input type="text" class="questionInput" placeholder="Enter question" required>
//             <div class="options">
//                 ${Array(4).fill().map((_, i) => `
//                     <input type="text" class="optionInput" placeholder="Option ${i + 1}" required>
//                 `).join('')}
//                 <label for="correctOption">Correct Option:</label>
//                 <select class="correctOption">
//                     ${Array(4).fill().map((_, i) => `
//                         <option value="${i}">Option ${i + 1}</option>
//                     `).join('')}
//                 </select>
//             </div>
//             <button type="button" class="removeQuestion">Remove Question</button>
//         `;
//         questionsContainer.appendChild(questionDiv);
//     });

//     // Remove a question
//     questionsContainer.addEventListener('click', function (e) {
//         if (e.target.classList.contains('removeQuestion')) {
//             e.target.closest('.question').remove();
//         }
//     });

//     // Random quiz templates (unchanged)
//     const randomQuizzes = {
//         c: {
//             title: "C Programming Quiz",
//             description: "Test your knowledge of C programming.",
//             questions: [
//                 {
//                     question: "What is the size of an integer in C?",
//                     options: ["2 bytes", "4 bytes", "8 bytes", "Depends on the compiler"],
//                     correctOption: 3
//                 },
//                 {
//                     question: "Which keyword is used to define a constant in C?",
//                     options: ["const", "define", "static", "let"],
//                     correctOption: 0
//                 }
//             ]
//         },
//         cpp: {
//             title: "C++ Programming Quiz",
//             description: "Test your knowledge of C++ programming.",
//             questions: [
//                 {
//                     question: "What is the correct syntax to declare a class in C++?",
//                     options: ["class MyClass {}", "class MyClass();", "class: MyClass {}", "class = MyClass {}"],
//                     correctOption: 0
//                 },
//                 {
//                     question: "Which operator is used for dynamic memory allocation in C++?",
//                     options: ["new", "malloc", "alloc", "create"],
//                     correctOption: 0
//                 }
//             ]
//         },
//         java: {
//             title: "Java Programming Quiz",
//             description: "Test your knowledge of Java programming.",
//             questions: [
//                 {
//                     question: "What is the default value of a boolean variable in Java?",
//                     options: ["true", "false", "null", "0"],
//                     correctOption: 1
//                 },
//                 {
//                     question: "Which keyword is used to inherit a class in Java?",
//                     options: ["extends", "implements", "inherits", "super"],
//                     correctOption: 0
//                 }
//             ]
//         },
//         html: {
//             title: "HTML Quiz",
//             description: "Test your knowledge of HTML.",
//             questions: [
//                 {
//                     question: "What does HTML stand for?",
//                     options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language"],
//                     correctOption: 0
//                 },
//                 {
//                     question: "Which tag is used to create a hyperlink in HTML?",
//                     options: ["<a>", "<link>", "<href>", "<hyperlink>"],
//                     correctOption: 0
//                 }
//             ]
//         },
//         css: {
//             title: "CSS Quiz",
//             description: "Test your knowledge of CSS.",
//             questions: [
//                 {
//                     question: "What does CSS stand for?",
//                     options: ["Cascading Style Sheets", "Colorful Style Sheets", "Computer Style Sheets", "Creative Style Sheets"],
//                     correctOption: 0
//                 },
//                 {
//                     question: "Which property is used to change the background color of an element?",
//                     options: ["background-color", "color", "bgcolor", "background"],
//                     correctOption: 0
//                 }
//             ]
//         },
//         js: {
//             title: "JavaScript Quiz",
//             description: "Test your knowledge of JavaScript.",
//             questions: [
//                 {
//                     question: "Which keyword is used to declare a variable in JavaScript?",
//                     options: ["var", "let", "const", "All of the above"],
//                     correctOption: 3
//                 },
//                 {
//                     question: "What is the result of 3 + '3' in JavaScript?",
//                     options: ["6", "33", "NaN", "Error"],
//                     correctOption: 1
//                 }
//             ]
//         }
//     };

//     // Auto-fill form with random quiz template
//     randomQuizButtons.forEach(button => {
//         button.addEventListener('click', function () {
//             const quizType = button.getAttribute('data-quiz');
//             const quiz = randomQuizzes[quizType];
//             if (quiz) {
//                 document.getElementById('quizTitle').value = quiz.title;
//                 document.getElementById('quizDescription').value = quiz.description;
//                 questionsContainer.innerHTML = ''; // Clear previous questions

//                 quiz.questions.forEach(question => {
//                     const questionDiv = document.createElement('div');
//                     questionDiv.classList.add('question');
//                     questionDiv.innerHTML = `
//                         <input type="text" class="questionInput" placeholder="Enter question" value="${question.question}" required>
//                         <div class="options">
//                             ${question.options.map((opt, i) => `
//                                 <input type="text" class="optionInput" placeholder="Option ${i + 1}" value="${opt}" required>
//                             `).join('')}
//                             <label for="correctOption">Correct Option:</label>
//                             <select class="correctOption">
//                                 ${question.options.map((_, i) => `
//                                     <option value="${i}" ${i === question.correctOption ? 'selected' : ''}>Option ${i + 1}</option>
//                                 `).join('')}
//                             </select>
//                         </div>
//                         <button type="button" class="removeQuestion">Remove Question</button>
//                     `;
//                     questionsContainer.appendChild(questionDiv);
//                 });
//             }
//         });
//     });
// });