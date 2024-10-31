module.exports = {
  name: 'quiz',
  description: 'quiz',
  usage: '',
  author: 'cliff',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const axios = require('axios');
    const triviaData = {};

    const difficultyMap = {
      easy: 'easy',
      medium: 'medium',
      hard: 'hard',
    };

    const categoryMap = {
      general: 9,
      books: 10,
      film: 11,
      music: 12,
      theatres: 13,
      television: 14,
      videogames: 15,
      boardgames: 16,
      science: 17,
      computers: 18,
      math: 19,
      mythology: 20,
      sports: 21,
      geography: 22,
      history: 23,
      politics: 24,
      art: 25,
      celebrity: 26,
      animals: 27,
      vehicles: 28,
      comics: 29,
      gadgets: 30,
      anime: 31,
      cartoon: 32,
    };

    const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const response = await axios.get(`https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986&difficulty=${difficultyMap[args[0]] || ''}&category=${categoryMap[args[1]] || ''}`);
    const question = response.data.results[0];
    const options = [question.correct_answer, ...question.incorrect_answers].sort(() => Math.random() - 0.5);

    const questionMessage = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: `Difficulty: ${capitalizeFirstLetter(decodeURIComponent(question.difficulty))}\nCategory: ${decodeURIComponent(question.category)}\n\n${decodeURIComponent(question.question)}`,
          buttons: options.map((option, index) => ({
            type: "postback",
            title: `${String.fromCharCode(65 + index)}. ${decodeURIComponent(option)}`,
            payload: `ANSWER_${index}`
          }))
        }
      }
    };

    sendMessage(senderId, questionMessage, pageAccessToken);

    // Store the correct answer and options for the senderId
    triviaData[senderId] = {
      correctIndex: options.indexOf(question.correct_answer),
      answered: false,
      options,
    };

    // Timeout for providing the answer if no response is received
    setTimeout(() => {
      if (!triviaData[senderId].answered) {
        sendMessage(senderId, {
          text: `Time's up! The correct answer is:\n\n${String.fromCharCode(65 + triviaData[senderId].correctIndex)}. ${decodeURIComponent(options[triviaData[senderId].correctIndex])}`
        }, pageAccessToken);
        triviaData[senderId].answered = true;
      }
    }, 30000);
  },

  // Method to handle postback response
  handlePostback(senderId, payload, pageAccessToken, sendMessage) {
    const triviaInfo = triviaData[senderId];
    if (triviaInfo && !triviaInfo.answered) {
      const selectedOptionIndex = parseInt(payload.split('_')[1], 10);

      if (selectedOptionIndex === triviaInfo.correctIndex) {
        sendMessage(senderId, { text: "Correct! Great job!" }, pageAccessToken);
      } else {
        sendMessage(senderId, {
          text: `Incorrect! The correct answer is:\n\n${String.fromCharCode(65 + triviaInfo.correctIndex)}. ${decodeURIComponent(triviaInfo.options[triviaInfo.correctIndex])}`
        }, pageAccessToken);
      }
      triviaInfo.answered = true;
    }
  }
};
