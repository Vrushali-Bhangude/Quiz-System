document.addEventListener('DOMContentLoaded', function() {
    const QUIZ_STORAGE_KEY = 'quizAppQuizzes';
    const startButton = document.getElementById('startQuiz');
    const quizCodeInput = document.getElementById('quizCode');
    const nicknameInput = document.getElementById('nickname');
    const errorDiv = document.getElementById('errorMessage');

    startButton.addEventListener('click', function(event) {
        event.preventDefault();
        
        const quizCode = quizCodeInput.value.trim().toUpperCase();
        const nickname = nicknameInput.value.trim();
        
        if (!quizCode) {
            showError('Please enter a quiz ID');
            return;
        }
        
        if (!nickname) {
            showError('Please enter your nickname');
            return;
        }

        startButton.disabled = true;
        startButton.textContent = 'Loading...';

        try {
            const quizzes = JSON.parse(localStorage.getItem(QUIZ_STORAGE_KEY)) || [];
            const quiz = quizzes.find(q => q.id === quizCode);
            
            if (!quiz) {
                throw new Error('No quiz found with this ID. Please check the code.');
            }

            // Store data for the quiz page
            sessionStorage.setItem('quizData', JSON.stringify(quiz));
            sessionStorage.setItem('playerName', nickname);
            
            // Redirect to quiz page
            window.location.href = '../show/show.html';
            
        } catch (error) {
            showError(error.message);
            startButton.disabled = false;
            startButton.textContent = 'Join Quiz';
        }
    });

    function showError(message) {
        errorDiv.textContent = message;
        setTimeout(() => errorDiv.textContent = '', 3000);
    }

    // Auto-focus the input field on page load
    quizCodeInput.focus();
});


// document.addEventListener("DOMContentLoaded", function () {
//     // DOM Elements
//     const homeContent = document.getElementById('homeContent');
//     const addQuizContent = document.getElementById('addQuizContent');
//     const addedQuizzesContent = document.getElementById('addedQuizzesContent');
//     const quizContent = document.getElementById('quizContent');
//     const addQuizTab = document.getElementById('addQuizTab');
//     const addedQuizzesTab = document.getElementById('addedQuizzesTab');
//     const createQuizCta = document.getElementById('createQuizCta');
//     const exploreQuizzesCta = document.getElementById('exploreQuizzesCta');
//     const quizzesList = document.getElementById('quizzesList');
//     const createQuizForm = document.getElementById('createQuizForm');
//     const questionsContainer = document.getElementById('questionsContainer');
//     const addQuestionButton = document.getElementById('addQuestion');
//     const randomQuizButtons = document.querySelectorAll('.random-quiz-btn');
//     const quizContentTitle = document.getElementById('quizContentTitle');
//     const quizContentDescription = document.getElementById('quizContentDescription');
//     const quizQuestionsContainer = document.getElementById('quizQuestionsContainer');
//     const backToQuizzes = document.getElementById('backToQuizzes');

//     // Storage key that matches what join.js will use
//     const QUIZ_STORAGE_KEY = 'quizAppQuizzes';

//     // Load quizzes from localStorage or initialize empty array
//     let quizzes = JSON.parse(localStorage.getItem(QUIZ_STORAGE_KEY)) || [];

//     // Show the selected content and hide others
//     function showContent(contentToShow) {
//         [homeContent, addQuizContent, addedQuizzesContent, quizContent].forEach(content => content.classList.add('hidden'));
//         contentToShow.classList.remove('hidden');
//     }

//     // Navigation event listeners
//     addQuizTab.addEventListener('click', function (e) {
//         e.preventDefault();
//         showContent(addQuizContent);
//     });

//     createQuizCta.addEventListener('click', function (e) {
//         e.preventDefault();
//         showContent(addQuizContent);
//     });

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

//     backToQuizzes.addEventListener('click', function() {
//         showContent(addedQuizzesContent);
//     });

//     // Load quizzes from localStorage
//     function loadQuizzes() {
//         quizzes = JSON.parse(localStorage.getItem(QUIZ_STORAGE_KEY)) || [];
//         renderQuizzes(quizzes);
//     }

//     // Render quizzes in the "Added Quizzes" section
//     function renderQuizzes(quizzes) {
//         quizzesList.innerHTML = '';
        
//         if (quizzes.length === 0) {
//             quizzesList.innerHTML = '<p>No quizzes added yet. Create your first quiz!</p>';
//             return;
//         }

//         quizzes.forEach((quiz, index) => {
//             const quizElement = document.createElement('div');
//             quizElement.classList.add('quiz-card');
//             quizElement.innerHTML = `
//                 <h3>${quiz.title}</h3>
//                 <p>${quiz.description}</p>
//                 <p>Code: ${quiz.title.toUpperCase()}</p>
//                 <p>Questions: ${quiz.questions.length}</p>
//                 <button class="view-quiz-btn" data-id="${index}">View Quiz</button>
//                 <button class="edit-quiz-btn" data-id="${index}">Edit Quiz</button>
//                 <button class="remove-quiz-btn" data-id="${index}">Remove Quiz</button>
//             `;
//             quizzesList.appendChild(quizElement);
//         });
//     }

//     // View quiz details
//     quizzesList.addEventListener('click', function (e) {
//         if (e.target.classList.contains('view-quiz-btn')) {
//             const quizId = e.target.getAttribute('data-id');
//             const quiz = quizzes[quizId];
//             showQuizContent(quiz);
//         }
//     });

//     // Show quiz content in detail view
//     function showQuizContent(quiz) {
//         quizContentTitle.textContent = quiz.title;
//         quizContentDescription.textContent = quiz.description;
//         quizQuestionsContainer.innerHTML = '';
        
//         quiz.questions.forEach((question, qIndex) => {
//             const questionDiv = document.createElement('div');
//             questionDiv.classList.add('quiz-question');
//             questionDiv.innerHTML = `
//                 <h3>Question ${qIndex + 1}: ${question.question}</h3>
//                 <ul class="quiz-options">
//                     ${question.options.map((option, oIndex) => `
//                         <li class="${oIndex === question.correctOption ? 'correct-answer' : ''}">
//                             ${String.fromCharCode(65 + oIndex)}. ${option}
//                         </li>
//                     `).join('')}
//                 </ul>
//             `;
//             quizQuestionsContainer.appendChild(questionDiv);
//         });
        
//         showContent(quizContent);
//     }

//     // Remove quiz
//     quizzesList.addEventListener('click', function (e) {
//         if (e.target.classList.contains('remove-quiz-btn')) {
//             if (confirm('Are you sure you want to remove this quiz?')) {
//                 const quizId = e.target.getAttribute('data-id');
//                 quizzes.splice(quizId, 1);
//                 localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizzes));
//                 loadQuizzes();
//             }
//         }
//     });

//     // Edit quiz
//     quizzesList.addEventListener('click', function (e) {
//         if (e.target.classList.contains('edit-quiz-btn')) {
//             const quizId = e.target.getAttribute('data-id');
//             const quiz = quizzes[quizId];
//             showContent(addQuizContent);
//             populateForm(quiz, quizId);
//         }
//     });

//     // Populate form with quiz data for editing
//     function populateForm(quiz, quizId) {
//         document.getElementById('quizTitle').value = quiz.title;
//         document.getElementById('quizDescription').value = quiz.description;
//         document.getElementById('quizId').value = quizId;
//         questionsContainer.innerHTML = '';

//         quiz.questions.forEach(question => {
//             const questionDiv = document.createElement('div');
//             questionDiv.classList.add('question');
//             questionDiv.innerHTML = `
//                 <input type="text" class="questionInput" placeholder="Enter question" value="${question.question}" required>
//                 <div class="options">
//                     ${question.options.map((opt, i) => `
//                         <input type="text" class="optionInput" placeholder="Option ${i + 1}" value="${opt}" required>
//                     `).join('')}
//                     <label>Correct Option:</label>
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

//     // Form submission for creating/editing quizzes
//     createQuizForm.addEventListener('submit', function (e) {
//         e.preventDefault();

//         const quizTitle = document.getElementById('quizTitle').value.trim();
//         const quizDescription = document.getElementById('quizDescription').value.trim();
//         const questionElements = document.querySelectorAll('.question');
//         const quizId = document.getElementById('quizId').value;

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

//         // Validate all fields are filled
//         if (questions.some(q => !q.question || q.options.some(opt => opt === ""))) {
//             alert("All questions and options must be filled.");
//             return;
//         }

//         const quizData = {
//             title: quizTitle,
//             description: quizDescription,
//             questions: questions,
//         };

//         if (quizId) {
//             // Update existing quiz
//             quizzes[quizId] = quizData;
//         } else {
//             // Add new quiz
//             quizzes.push(quizData);
//         }

//         // Save to localStorage
//         localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizzes));

//         alert('Quiz saved successfully!');
//         showContent(homeContent);
//         loadQuizzes();
//         createQuizForm.reset();
//         questionsContainer.innerHTML = '';
//         document.getElementById('quizId').value = '';
//     });

//     // Add new question
//     addQuestionButton.addEventListener('click', function () {
//         const questionDiv = document.createElement('div');
//         questionDiv.classList.add('question');
//         questionDiv.innerHTML = `
//             <input type="text" class="questionInput" placeholder="Enter question" required>
//             <div class="options">
//                 ${Array(4).fill().map((_, i) => `
//                     <input type="text" class="optionInput" placeholder="Option ${i + 1}" required>
//                 `).join('')}
//                 <label>Correct Option:</label>
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

//     // Remove question
//     questionsContainer.addEventListener('click', function (e) {
//         if (e.target.classList.contains('removeQuestion')) {
//             e.target.closest('.question').remove();
//         }
//     });

//     // Random quiz templates
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
//                 questionsContainer.innerHTML = '';

//                 quiz.questions.forEach(question => {
//                     const questionDiv = document.createElement('div');
//                     questionDiv.classList.add('question');
//                     questionDiv.innerHTML = `
//                         <input type="text" class="questionInput" placeholder="Enter question" value="${question.question}" required>
//                         <div class="options">
//                             ${question.options.map((opt, i) => `
//                                 <input type="text" class="optionInput" placeholder="Option ${i + 1}" value="${opt}" required>
//                             `).join('')}
//                             <label>Correct Option:</label>
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