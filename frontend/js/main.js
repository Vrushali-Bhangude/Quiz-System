async function fetchQuizzes() {
    try {
        const response = await fetch('http://localhost:5000/api/quizzes');
        const quizzes = await response.json();
        console.log(quizzes); // Display or use the quizzes
    } catch (err) {
        console.error('Error fetching quizzes:', err);
    }
}

fetchQuizzes();