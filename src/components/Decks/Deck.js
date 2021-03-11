import Button from '../Button'
import Decks from './Decks'
import { useState } from 'react'
import AddDeck from './AddDeck'

const Deck = ({ decks, setDecks, setCurrentDeck, showAddFlashcards, setShowAddFlashcards, currentDeck, currentFlashcards, userProfile, setCurrentFlashcards }) => {
    const [showChangeDeck, setShowChangeDeck] = useState(false)
    const [showAddDeck, setShowAddDeck] = useState(false)

    const onClick = () => {
        setShowAddFlashcards(!showAddFlashcards)
    }

    const deleteDeck = async (deckId) => {
        const url = `https://localhost:44386/api/decks/${deckId}`
        await fetch(url, {
            method: 'DELETE',
        })
    }

    return (
        <>
            <div className="deck-container">
                <h3 className="deck-title">{currentDeck.name}</h3>
                <h3> Words: {currentFlashcards.length}</h3>
                <div>
                    <Button className="btn" color = "steelblue" text={!showAddFlashcards ? "Add/Remove Words" : "Back"} onClick={onClick}/>
                    <Button className="btn" text="Edit settings"/>
                </div>
                <div className="center">
                
              </div>
            </div>
            {showAddDeck &&
                <div>
                    <AddDeck userProfile={userProfile} setDecks={setDecks} decks={decks} setCurrentDeck={setCurrentDeck} setShowAddDeck={setShowAddDeck} setCurrentFlashcards={setCurrentFlashcards} showAddFlashcards={showAddFlashcards} setShowAddFlashcards={setShowAddFlashcards} />
                </div>
                    }
            {!showAddDeck && currentDeck && <Button text={showChangeDeck ? "Hide" : "Change Deck"} color={showChangeDeck ? "blueviolet" : "steelblue"} onClick={() => setShowChangeDeck(!showChangeDeck)} />}
                {!showChangeDeck && <Button text={showAddDeck ? "Back" : "Create new Deck"} color={showAddDeck ? "blueviolet" : "grey"} onClick={() => setShowAddDeck(!showAddDeck)} />}
            {showChangeDeck && <Decks deleteDeck={deleteDeck} decks={decks} setDecks={setDecks} setCurrentDeck={setCurrentDeck} currentDeck={currentDeck} />}
        </>
    )
}

export default Deck