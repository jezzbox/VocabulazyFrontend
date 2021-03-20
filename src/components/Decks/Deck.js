import Button from '../Button'
import Decks from './Decks'
import { useState, useEffect } from 'react'
import AddDeck from './AddDeck'

const Deck = ({ decks, setDecks, setCurrentDeck, showAddFlashcards, setShowAddFlashcards, currentDeck, currentFlashcards, userProfile, setCurrentFlashcards, setShowStartButton }) => {
    const [showChangeDeck, setShowChangeDeck] = useState(false)
    const [showAddDeck, setShowAddDeck] = useState(false)

    useEffect(() => {
        if(decks.length === 0) {
            setShowChangeDeck(false)
        }
    },[decks])

    
    const onClick = () => {
        setShowAddFlashcards(!showAddFlashcards)
    }

    const deleteDeck = async (deckId) => {
        const url = `https://localhost:44386/api/decks/${deckId}`
        await fetch(url, {
            method: 'DELETE',
        })
    }

    const onClickAddDeck = () => {
        if(!showAddDeck) {
            setShowStartButton(false)
            setShowAddDeck(true)
        }
        else {
            setShowStartButton(true)
            setShowAddDeck(false)
        }
    }
    

    return (
        <>
        <div>
        {!showAddDeck && currentDeck.deckId && <Button text={showChangeDeck ? "Hide" : "Change Deck"} color={showChangeDeck ? "blueviolet" : "steelblue"} onClick={() => setShowChangeDeck(!showChangeDeck)} />}
                {!showChangeDeck && <Button text={showAddDeck ? "Back" : "Create new Deck"} color={showAddDeck ? "blueviolet" : "grey"} onClick={() => onClickAddDeck()} />}
                </div>
            {!showAddDeck && !showChangeDeck && currentDeck.deckId && <div className="deck-container">
                <h3 className="deck-title">{currentDeck.name}</h3>
                <h3> Words: {currentFlashcards.length}</h3>
                <div>
                    <Button className="btn" color = "steelblue" text={!showAddFlashcards ? "Add/Remove Words" : "Back"} onClick={onClick}/>
                    <Button className="btn" text="Edit settings"/>
                </div>
                <div className="center">
                
              </div>
            </div>}
            {showAddDeck &&
                <div>
                    <AddDeck userProfile={userProfile} setDecks={setDecks} decks={decks} setCurrentDeck={setCurrentDeck} setShowAddDeck={setShowAddDeck} setCurrentFlashcards={setCurrentFlashcards} showAddFlashcards={showAddFlashcards} setShowAddFlashcards={setShowAddFlashcards} />
                </div>
                    }
            
            {showChangeDeck && <Decks deleteDeck={deleteDeck} decks={decks} setDecks={setDecks} setCurrentDeck={setCurrentDeck} currentDeck={currentDeck} />}
        </>
    )
}

export default Deck