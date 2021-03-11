import Button from '../Button'

const DeckItem = ( {deck,setDecks,decks, setCurrentDeck, currentDeck, deleteDeck} ) => {

const onClick = () => {
    setCurrentDeck(deck)

}

const onClickDelete = () => {
    deleteDeck(deck.deckId)
    setDecks(decks.filter((item) => item.deckId !== deck.deckId))
    if(decks.length === 0) {
        setCurrentDeck([])
    }
    if(deck === currentDeck) {
        setCurrentDeck(decks[0])
    }
}

    return (
        <div className="verb-container">
        <h3>{deck.name}</h3>
        {currentDeck === deck ? <Button color="green" text="Selected"/>: <Button text="Select" onClick={onClick}/>}
        <Button text = "Delete" onClick={onClickDelete}/>
        </div>
    )
}

export default DeckItem
