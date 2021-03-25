const CurrentDeck = ({ currentDeck }) => {

    return (
        <>
            {currentDeck.flashcards &&
            <div className="current-deck">
                <h2>{currentDeck.name}</h2>
                <div>
                    <h4>Words</h4>
                    <h4>{currentDeck.flashcards.length}</h4>
                </div>
                <div>
                    <h4>Due</h4>
                    <h4>{currentDeck.flashcards.filter((flashcard) => flashcard.dueDate <= new Date().toJSON()).length}</h4>
                </div>
            </div>}
        </>
    )
}

export default CurrentDeck
