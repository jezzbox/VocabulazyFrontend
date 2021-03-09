import Button from '../Button'

const Deck = ({ showFlashcards, showAddFlashcards, setShowAddFlashcards, setCurrentDeck, currentDeck, currentFlashcards }) => {

    const onClick = () => {
        setShowAddFlashcards(!showAddFlashcards)
        setCurrentDeck(currentDeck)
    }

    return (
            <div className="deck-container">
                <h3 className="deck-title">{currentDeck.name}</h3>
                <h3> Words: {currentFlashcards.length}</h3>
                <div>
                <Button className="btn" color="green" text="Start" onClick={showFlashcards}/>
                    <Button className="btn" color = "steelblue" text={!showAddFlashcards ? "Add/Remove Words" : "Back"} onClick={onClick}/>
                    <Button className="btn" text="Edit settings"/>
                </div>
            
            </div>
    )
}

export default Deck