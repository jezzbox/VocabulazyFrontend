import { Link } from 'react-router-dom'
import Table from './Table'
import processFlashcards from '../../Actions/ProcessFlashcards'
import Button from '../Button'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';

const ChangeDeck = ({ decks, setCurrentDeck, currentDeck, deleteDeck}) => {

      const onClickDelete =  (deck) => {
            confirmAlert({
                title: `Delete: ${deck.name}`,
                message: `Are you sure you want to delete the deck ${deck.name}? this cannot be undone`,
                buttons: [
                  {
                    label: 'Yes',
                    onClick: () => deleteDeck(deck.deckId)
                  },
                  {
                    label: 'No',
                    onClick: () => null
                  }
                ]
              });
        }

      const getDecksData = (decks) => {

            
            var i;
            const processedData = [];

            for(i=0;i<decks.length;i++) {
                  const deck = decks[i]
                  deck.flashcards = processFlashcards(deck)
                  const deckCopy = Object.create(deck)

                  if(currentDeck.deckId === deck.deckId) {
                     deck.select = <button className="td-click" onClick={null}>{deck.name}<em> (Selected)</em></button>
                  }
                  else {
                        deck.select = <button className="td-click" onClick={() => setCurrentDeck(deckCopy)}>{deck.name}</button>
                  }
                  
                  deck.select = <button className="td-click" onClick={currentDeck.deckId === deck.deckId ? null : () => setCurrentDeck(deckCopy)}>{currentDeck.deckId === deck.deckId ? <>{deck.name}<em> (Selected)</em></>: deck.name}</button>
                  deck.wordCount = deck.flashcards.length
                  deck.dueCount = deck.flashcards.filter((flashcard) => flashcard.dueDate <= new Date().toJSON()).length

                  deck.deleteButton = 
                        <Button className="btn minimal" text="Delete" color="#85144b" onClick={() => onClickDelete(deck)}/>
                  processedData.push(deck)
                }

            return processedData

      }

return (
    <>
    <header>
          <h4>Change deck:</h4>
    </header>
    <div className="container blue-border">
    {decks.length > 0 ? 
         <Table tableData={getDecksData(decks)} headers={[{ columnName: 'Name', objectProperty: 'select' }, { columnName: "Words", objectProperty: "wordCount" },{ columnName: "Due", objectProperty: "dueCount" }, { columnName: "delete", objectProperty: "deleteButton" }]} />
        : <h3>No decks yet, create deck to get started</h3>}
        <div className="center">
        <Link className="back-link" to ="/home">Back</Link>
        </div>
        </div>
        </>
  );
};

export default ChangeDeck;