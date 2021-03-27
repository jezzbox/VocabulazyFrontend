import processFlashcards from './ProcessFlashcards'
import Button from '../components/Button'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';

const getDecksData = (decks, currentDeck, setCurrentDeck, deleteDeck) => {

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

export default getDecksData