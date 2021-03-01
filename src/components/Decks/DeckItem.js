import Button from '../Button'

const DeckItem = ( {deck, setCurrentDeck, currentDeck} ) => {

const onClick = () => {
    setCurrentDeck(deck)

}

    return (
        <div className="verb-container">
        <h3>{deck.deckName}</h3>
        {currentDeck === deck ? <Button color="green" text="Selected"/>: <Button text="Select" onClick={onClick}/>}
        </div>
    )
}

export default DeckItem
