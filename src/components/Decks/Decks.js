import { useState } from 'react'
import Deck from './Deck'
import Button from '../Button'
import AddDeck from './AddDeck'

const Decks = ({ setCurrentDeck, deckVerbs, addDeck, newDeckId, newDeckName, decks ,isLoading, userUrl, isAuthenticated, verbs }) => {
const [showAddDeck, setShowAddDeck] = useState(false)
const [showAddVerbs, setShowAddVerbs] = useState(false)
const [isNewDeck, setIsNewDeck] = useState(true)

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
        <>
        <div>
          {showAddDeck ? <h1>Create new deck:</h1> : <h1>Decks:</h1>}
          <Button text = {showAddDeck ? "Back" : "create new deck"} onClick={() => setShowAddDeck(!showAddDeck)}/>
        </div>
          {isAuthenticated && showAddDeck && <AddDeck setIsNewDeck = {() => setIsNewDeck(true)} addDeck={addDeck} newDeckId={newDeckId} newDeckName={newDeckName} verbs={verbs} userUrl={userUrl} onCreate={() => setShowAddVerbs(true)} setShowAddVerbs={setShowAddVerbs} showAddVerbs={showAddVerbs}/>}
          
          {decks.length > 0 ? (
            !showAddDeck && decks.map((deck) => (
              <Deck key={deck.deckId} setCurrentDeck = {setCurrentDeck} deckVerbs={deckVerbs} deck={deck} setShowAddVerbs={setShowAddVerbs} isNewDeck={isNewDeck} setIsNewDeck={setIsNewDeck} verbs={verbs}/>
            ))) : <h1>No decks, create one to get started!</h1>}
        </>
    )
  );
};

export default Decks;