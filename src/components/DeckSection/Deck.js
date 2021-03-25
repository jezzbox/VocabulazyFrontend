import processFlashcards from '../../ProcessFlashcards'
import Button from '../Button'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';

const Deck = ( {deck, key, currentDeck, setCurrentDeck, setDeckToDelete} ) => {
    deck.flashcards = processFlashcards(deck)

    const onClickDelete =  () => {
      confirmAlert({
          title: `Delete: ${deck.name}`,
          message: `Are you sure you want to delete the deck ${deck.name}? this cannot be undone`,
          buttons: [
            {
              label: 'Yes',
              onClick: () => setDeckToDelete(deck)
            },
            {
              label: 'No',
              onClick: () => null
            }
          ]
        });
  }

    return (
                    <tr key={key}>
                      <td className="td-click" onClick={currentDeck === deck ? null : () => setCurrentDeck(deck)}>{currentDeck === deck ? <>{deck.name}<em> (Selected)</em></>: <>{deck.name}</>  } </td>
                      <td>{deck.flashcards.length}</td>
                      <td>{deck.flashcards.filter((flashcard) => flashcard.dueDate <= new Date().toJSON()).length}</td>
                      <td><Button className="btn minimal" text="Delete" color="#85144b" onClick={() => onClickDelete()}/></td>
                    </tr>
    )
}

export default Deck
