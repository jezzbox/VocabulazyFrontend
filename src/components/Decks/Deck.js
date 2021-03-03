import Button from '../Button'

const Deck = ({ showFlashcards, showAddVerbs, setShowAddVerbs, setCurrentDeck, verbs, deckVerbs, deck }) => {

    const onClick = () => {
        setShowAddVerbs(!showAddVerbs)
        setCurrentDeck(deck)
    }

    return (
            <div className="deck-container">
                <h3 className="deck-title">{deck.deckName}</h3>
                <h3> Words: {deckVerbs.length}</h3>
                <div>
                <Button className="btn" color="green" text="Start" onClick={showFlashcards}/>
                    <Button className="btn" color = "steelblue" text={!showAddVerbs ? "Add/Remove Words" : "Back"} onClick={onClick}/>
                    <Button className="btn" text="Edit settings"/>
                </div>
            
            </div>
    )
}

export default Deck