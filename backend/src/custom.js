/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/


export const quizQuestionPublicReturn = question => {
  return question;
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  let correctAnswers = [];
  for (let i = 0; i < question.answerOptions.length; i++) {
    if (question.answerOptions[i].isCorrect) {
      correctAnswers.push(question.answerOptions[i].id);
    }
  }
  return correctAnswers;
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  let Answers = [];
  for (let i = 0; i < question.answerOptions.length; i++) {
    Answers.push(question.answerOptions[i].value);
  }
  return Answers;
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return question.timeLimit;
};
