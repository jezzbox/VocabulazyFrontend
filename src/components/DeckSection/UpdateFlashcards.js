import fetchData from '../../FetchData'
import WordTypes from '../WordTypes'

const updateFlashcards = async (currentDeck, updatedFlashcards) => {

    const addFlashcards = async (flashcardsToAdd, flashcardsToRemove, deckId) => {

        for (i = 0; i < flashcardsToRemove.length; i++) {
            const flashcard = flashcardsToRemove[i]
            const id = WordTypes[flashcard.wordType]["id"]

            await fetchData(`Flashcards/${flashcard.wordType}s?id=${flashcard[id]}&deckId=${deckId}`, 'DELETE')
        }

        const patchData = []
        var i = 0;
        console.log(flashcardsToAdd.length)
        for (i = 0; i < flashcardsToAdd.length; i++) {
            const flashcard = flashcardsToAdd[i]
            console.log(flashcard)
            const wordType = flashcard["wordType"]
            console.log(wordType)
            const id = [WordTypes[wordType]["id"]]
            console.log(WordTypes[wordType])
            const event = new Date();
            const jsonDate = event.toJSON();
            const addData = { deckId, Phase: "New", ease: 250, learningStep: 1, interval: 0, dueDate: jsonDate }

            addData[id] = flashcard[id]
            patchData.push({ "op": "add", "path": `/${wordType}Flashcards/-`, "value": addData })
        }
        console.log("patchData")
        console.log(JSON.stringify(patchData))
        const res = await fetchData(`decks/${deckId}`, 'PATCH', patchData)
        return res;





    }
    const currentFlashcards = currentDeck.flashcards
    console.log("current cards")
    console.log(currentFlashcards)
    console.log("updated cards")
    console.log(updatedFlashcards)
    const flashcardsToAdd = updatedFlashcards.filter((flashcard) => !currentFlashcards.some(
        x => (x.wordType === flashcard.wordType && x[`${x.wordType}Id`] === flashcard[`${flashcard.wordType}Id`])))
    console.log("add")
    console.log(flashcardsToAdd)

    const flashcardsToRemove = currentFlashcards.filter((currentFlashcard) => !updatedFlashcards.some(
        x => (x.wordType === currentFlashcard.wordType && x[`${x.wordType}Id`] === currentFlashcard[`${currentFlashcard.wordType}Id`])))
    console.log("remove")
    console.log(flashcardsToRemove)


    const { dataFromServer, error } = await addFlashcards(flashcardsToAdd, flashcardsToRemove, currentDeck.deckId)

    return { dataFromServer, error }
}

export default updateFlashcards;

