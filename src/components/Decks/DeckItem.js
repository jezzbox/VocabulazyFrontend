import Button from '../Button'

const DeckItem = ( {deck,setDecks,decks, setCurrentDeck, currentDeck, deleteDeck} ) => {

    
const onClick = () => {
    setCurrentDeck(deck)

}

const onClickDelete = async (deck) => {
    await deleteDeck(deck.deckId)
    const filteredDecks = decks.filter((item) => !(item.deckId === deck.deckId))
    await setDecks(filteredDecks)


    if(await deck.deckId === currentDeck.deckId) {
        if(await decks.length > 0) {
            setCurrentDeck(decks[0])
        }
        else {
            setCurrentDeck([])
        }
    }
}

    return (
        <div className="verb-container">
        <h3>{deck.name}</h3>
        {currentDeck === deck ? <Button color="green" text="Selected"/>: <Button text="Select" onClick={onClick}/>}
        <Button text = "Delete" onClick={() => onClickDelete(deck)}/>
        </div>
    )
}

export default DeckItem
