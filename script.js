
const form = document.querySelector('form')
let quizForm = document.querySelector('.quiz-form');
let quiz = document.querySelector('.quiz');
let username;
let question = document.querySelector('.question');
let questionNum = 0;
let next = document.querySelector('.next')
const api = 'https://opentdb.com/api.php?amount=10&category=23'
let buttonsDiv = document.querySelector('#buttonsDiv')
let buttons;
let finalQuiz;
let showQuestionNum = document.querySelector('.num-of-question');
let correctAnswers=0;
let scoreMessage = document.querySelector('.score-message')
let loader = document.querySelector('.loader')
let correctAnswerText = document.querySelector('.ans')
let finish;
let restart;
let categories = {
    'history':23,
    'geography':22,
    'animals':27,
    'sport':21,
    'computer-science' : 18,
    'general':9,
    'nature':17

}
//feth data
async function fetchData(api){
    const quizQuestions = await fetch(api)
    const data = await quizQuestions.json()
    finalQuiz = data.results.sort(()=>Math.random() - 0.5)
    
}
//Restart Quiz
function restartQuiz(){
    restart = document.createElement('button')
    restart.innerHTML = 'Restart';
    restart.classList.add('next')
    restart.classList.add('next')
    restart.classList.add('next-enabled')
    quiz.appendChild(restart)
    restart.addEventListener('click',()=>{
        correctAnswers=0;
        questionNum = 0;
        scoreMessage.style.visibility = 'hidden'
        quizForm.style.visibility = 'visible';
        quiz.style.visibility = 'hidden';
        next.textContent = 'Next'
    })
}
//Finish Quiz
function finishQuiz(){
    quiz.removeChild(finish)
    while(buttonsDiv.firstChild){
        buttonsDiv.removeChild(buttonsDiv.lastChild)
    }
    scoreMessage.textContent = `Hi ${username}, your score is ${correctAnswers}/10`;
    scoreMessage.style.visibility ='visible'
    showQuestionNum.style.visibility = 'hidden'
    question.style.visibility = 'hidden';
    restartQuiz();
}


function fullfilQuiz(array){
    if(questionNum == 9){
        next.style.display = 'none'
        finish = document.createElement('button')
        finish.innerHTML = 'Finish';
        finish.classList.add('next')
        quiz.appendChild(finish)
        finish.addEventListener('click',finishQuiz)
        
    }
    showQuestionNum.textContent = `${questionNum + 1}/10`
    question.innerHTML = array[questionNum].question
    array[questionNum].incorrect_answers.push( array[questionNum].correct_answer);
    let options = array[questionNum].incorrect_answers;
    correctAnswerText.innerHTML = array[questionNum].correct_answer;
    //make buttons
    options.forEach(answer =>{
        let button = document.createElement('button');
        button.innerHTML = answer
        button.classList.add('option')
        buttonsDiv.appendChild(button)
        buttons = document.querySelectorAll('.option')
    })
    //adding action
    buttons.forEach(button=>{
        button.addEventListener('click',()=>{
            if(button.innerHTML === correctAnswerText.innerHTML){
                if(finish)finish.classList.add('next-enabled')
                correctAnswers++
                button.classList.add('correct');
                next.classList.add('next-enabled')
                buttons.forEach(elem=>{
                    elem.classList.add('buttons-disabled')
                })
            }else{
                if(finish)finish.classList.add('next-enabled')
                button.classList.add('not-correct');
                next.classList.add('next-enabled')
                buttons.forEach(elem=>{
                    elem.classList.add('buttons-disabled')
                    if(elem.innerHTML === correctAnswerText.innerHTML){
                        elem.classList.add('correct')
                        
                    }
                })
                
            }
        })
    })
    
    

}
//reset buttons
function resetButtons(obj){
    
    next.classList.remove('next-enabled');
        for(let btn of buttons){
            btn.classList.remove('correct')
            btn.classList.remove('not-correct')
            
        
    }
}



function resetSettings(){
    question.style.visibility = 'visible';
    showQuestionNum.style.visibility = 'visible'
    scoreMessage.style.visibility = 'hidden'
}
next.addEventListener('click',()=>{
    while(buttonsDiv.firstChild){
        buttonsDiv.removeChild(buttonsDiv.lastChild)
    }
    resetButtons(finalQuiz[questionNum])
    questionNum++
    fullfilQuiz(finalQuiz)
    
})





form.addEventListener('submit', async function(e){
    //PREVENT PAGE RELOAD
    e.preventDefault()
    loader.style.visibility='visible'
    quizForm.style.visibility = 'hidden';
    username = e.target.username.value
    const{category, difficulty} = e.target
    if(restart){
        quiz.removeChild(restart)
        next.style.display = 'block';
    }
    //FETCH DATA
    await fetchData(`https://opentdb.com/api.php?amount=10&category=${categories[category.value]}&difficulty=${difficulty.value}`)

    //FULLFIL DATA
    
    
    //CHANGE DIVS
    setTimeout(()=>{
        fullfilQuiz(finalQuiz)
        loader.style.visibility='hidden'
        quiz.style.visibility='visible';
        resetSettings()
    },200)
    

})

