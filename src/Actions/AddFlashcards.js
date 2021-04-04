import fetchData from './FetchData'

const addFlashcards = async (deckId, cardsToAdd) => {
    const patchData = []
        for (var i = 0; i < cardsToAdd.length; i++) {
            const card = cardsToAdd[i]
            const wordType = card["wordType"]
            const idKey = [`${wordType}Id`]
            const event = new Date();
            const jsonDate = event.toJSON();
            const addData = { deckId, Phase: "New", ease: 250, learningStep: 1, interval: 0, dueDate: jsonDate }

            addData[idKey] = card[idKey]
            patchData.push({ "op": "add", "path": `/${wordType}Flashcards/-`, "value": addData })
        }
        const { dataFromServer, error } = await fetchData(`decks/${deckId}`, 'PATCH', patchData)
        return { dataFromServer, error };
    }

export default addFlashcards;