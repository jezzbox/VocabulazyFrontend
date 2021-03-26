import Deck from './Deck'
import { Link } from 'react-router-dom'

const ChangeDeck = ({ decks, setCurrentDeck, currentDeck, deleteDeck}) => {

return (
    <>
    <header>
          <h4>Change deck:</h4>
    </header>
    <div className="container blue-border">
    {decks.length > 0 ? 
          <table className="deck-table">
                <tbody>
                <tr>
                    <th>Name</th>
                    <th>Words</th>
                    <th>Due</th>
                  </tr>
            {decks.map((deck) => (
              <Deck key={deck.deckId} deck={deck} currentDeck={currentDeck} setCurrentDeck={setCurrentDeck} deleteDeck={deleteDeck}/>
              
              ))}
            </tbody>
         </table> 
        : <h3>No decks yet, create deck to get started</h3>}
        <div className="center">
        <Link className="back-link" to ="/home">Back</Link>
        </div>
        </div>
        </>
  );
};

export default ChangeDeck;