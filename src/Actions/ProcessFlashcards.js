import WORD_TYPES from '../Constants/WORD_TYPES'

const processFlashcards = (deck) => {
    const flashcards = []
    for (const wordType in WORD_TYPES) {
      var h;
      const flashcardType = WORD_TYPES[wordType]["flashcard"]
      const id = WORD_TYPES[wordType]['id']
      if(deck[flashcardType] === null) {
        deck[flashcardType] = []
      }
      for (h = 0; h < deck[flashcardType].length; h++) {
        const flashcard = deck[flashcardType][h]
        const flashcardId = flashcard["flashcardId"]
        const phase = flashcard["phase"]
        const learningStep = flashcard["learningStep"]
        const dueDate = flashcard["dueDate"]
        const lapseCount = flashcard["lapseCount"]
        const isSuspended = flashcard["isSuspended"]

        const processedCard = { word: flashcard[wordType], wordType: wordType, flashcardId, phase, learningStep, dueDate, lapseCount, isSuspended }
        processedCard[id] = flashcard[id]
        flashcards.push(processedCard)
      }
  }
  return flashcards;
}

export default processFlashcards
