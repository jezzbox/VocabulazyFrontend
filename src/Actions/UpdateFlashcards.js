import fetchData from './FetchData'
import WORD_TYPES from '../Constants/WORD_TYPES'

const updateFlashcards = async (currentDeck, updatedFlashcards) => {

    const addFlashcards = async (flashcardsToAdd, flashcardsToRemove, deckId) => {
        var i = 0;
        for (i = 0; i < flashcardsToRemove.length; i++) {
            const flashcard = flashcardsToRemove[i]
            const id = WORD_TYPES[flashcard.wordType]["id"]

            await fetchData(`Flashcards/${flashcard.wordType}s?id=${flashcard[id]}&deckId=${deckId}`, 'DELETE')
        }

        const patchData = []
        var j = 0;
        for (j = 0; j < flashcardsToAdd.length; j++) {
            const flashcard = flashcardsToAdd[j]
            const wordType = flashcard["wordType"]
            const id = [WORD_TYPES[wordType]["id"]]
            const event = new Date();
            const jsonDate = event.toJSON();
            const addData = { deckId, Phase: "New", ease: 250, learningStep: 1, interval: 0, dueDate: jsonDate }

            addData[id] = flashcard[id]
            patchData.push({ "op": "add", "path": `/${wordType}Flashcards/-`, "value": addData })
        }
        const res = await fetchData(`decks/${deckId}`, 'PATCH', patchData)
        return res;





    }
    const currentFlashcards = currentDeck.flashcards

    const flashcardsToAdd = updatedFlashcards.filter((flashcard) => !currentFlashcards.some(
        x => (x.wordType === flashcard.wordType && x[`${x.wordType}Id`] === flashcard[`${flashcard.wordType}Id`])))

    const flashcardsToRemove = currentFlashcards.filter((currentFlashcard) => !updatedFlashcards.some(
        x => (x.wordType === currentFlashcard.wordType && x[`${x.wordType}Id`] === currentFlashcard[`${currentFlashcard.wordType}Id`])))


    const { dataFromServer, error } = await addFlashcards(flashcardsToAdd, flashcardsToRemove, currentDeck.deckId)

    return { dataFromServer, error }
}

export default updateFlashcards;

