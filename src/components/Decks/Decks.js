
import DeckItem from './DeckItem'

const Decks = ({ decks ,isLoading, isAuthenticated, setCurrentDeck, currentDeck }) => {

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
        <ul>
          {decks.length > 0 ? (
            decks.map((deck) => (
              <DeckItem key={deck.deckId} deck={deck} setCurrentDeck={setCurrentDeck} currentDeck={currentDeck}/>
            ))) : <li>No decks, create one to get started!</li>}
        </ul>
    )
  );
};

export default Decks;