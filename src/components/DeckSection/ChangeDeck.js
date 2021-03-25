
import Button from '../Button'
import Deck from './Deck'

const ChangeDeck = ({ decks, setCurrentDeck, currentDeck, onClickBack, setDeckToDelete}) => {

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
            {decks.map((deck, key) => (
              <Deck key={key} deck={deck} currentDeck={currentDeck} setCurrentDeck={setCurrentDeck} setDeckToDelete={setDeckToDelete}/>
              
              ))}
            </tbody>
         </table> 
        : <h3>No decks yet, create deck to get started</h3>}
        <div className="center">
        <Button className="btn" text="Back" onClick={onClickBack} />
        </div>
        </div>
        </>
  );
};

export default ChangeDeck;