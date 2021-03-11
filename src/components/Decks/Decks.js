
import DeckItem from './DeckItem'

const Decks = ({ decks, setDecks, setCurrentDeck, currentDeck, deleteDeck }) => {

  return (
        <ul>
          {decks.length > 0 ? (
            decks.map((deck) => (
              <DeckItem key={deck.deckId} deleteDeck ={deleteDeck} deck={deck} setCurrentDeck={setCurrentDeck} currentDeck={currentDeck} decks={decks} setDecks={setDecks}/>
            ))) : <li>No decks, create one to get started!</li>}
        </ul>
  );
};

export default Decks;