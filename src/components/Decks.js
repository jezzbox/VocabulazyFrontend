import Deck from './Deck'
import Button from './Button'

const Decks = ({ decks ,isLoading, isAuthenticated }) => {

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
        <>
        <h1>Decks</h1>
        <Button text = "create new deck"/>
        {decks.map((deck) => (
            <Deck key={deck.deckId} deck={deck}/>
        ))}
        </>
    )
  );
};

export default Decks;