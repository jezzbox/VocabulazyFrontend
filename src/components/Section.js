const Section = ({currentDeck}) => {
    return (
        <section>
            <header>
              <h1>Current deck</h1>
            </header>
            <h3 className="deck-title">{currentDeck.name}</h3>
            <h3> Words: {currentDeck.flashcards.length}</h3>
        </section>
    )
}

export default Section
