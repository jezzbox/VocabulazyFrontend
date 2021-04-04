import fetchData from './FetchData'

const deleteCard = async (deckId, card) => {
    console.log(card)
    const idKey = `${card.wordType}Id`

    const { error } = await fetchData(`Flashcards/${card.wordType}s?id=${card[idKey]}&deckId=${deckId}`, 'DELETE')
    if(error) {
        console.log(error)
        }
}

export default deleteCard

