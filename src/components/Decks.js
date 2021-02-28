import { useState } from 'react'
import Deck from './Deck'
import Button from './Button'
import AddDeck from './AddDeck'

const Decks = ({ addDeck, decks ,isLoading, userUrl, isAuthenticated }) => {
const [showAddDeck, setShowAddDeck] = useState(false)

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
        <>
        <h1>Decks</h1>
        <Button text = {showAddDeck ? "Back" : "create new deck"} onClick={() => setShowAddDeck(!showAddDeck)}/>
        {isAuthenticated && showAddDeck && <AddDeck addDeck={addDeck} userUrl={userUrl}/>}
        {!showAddDeck && decks.map((deck) => (
            <Deck key={deck.deckId} deck={deck}/>
            ))}
        </>
    )
  );
};

export default Decks;