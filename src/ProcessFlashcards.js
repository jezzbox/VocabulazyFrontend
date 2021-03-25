import WordTypes from './components/WordTypes'

const processFlashcards = (deck) => {
    const flashcards = []
    for (const wordType in WordTypes) {
      var h;
      const flashcardType = WordTypes[wordType]["flashcard"]
      const id = WordTypes[wordType]['id']
      if(deck[flashcardType] === null) {
        deck[flashcardType] = []
      }
      for (h = 0; h < deck[flashcardType].length; h++) {
        const flashcard = deck[flashcardType][h]
        const flashcardId = flashcard["flashcardId"]
        const phase = flashcard["phase"]
        const learningStep = flashcard["learningStep"]
        const dueDate = flashcard["dueDate"]

        const processedCard = { word: flashcard[wordType], wordType: wordType, flashcardId, phase, learningStep, dueDate }
        processedCard[id] = flashcard[id]
        flashcards.push(processedCard)
      }
  }
  return flashcards;
}

export default processFlashcards
