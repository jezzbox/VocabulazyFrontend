import processFlashcards from '../../ProcessFlashcards'
import Button from '../Button'

const Deck = ( {deck, key, currentDeck, setCurrentDeck} ) => {
    deck.flashcards = processFlashcards(deck)
    return (
                    <tr key={key}>
                      <td>{deck.name}</td>
                      <td>{deck.flashcards.length}</td>
                      <td>{deck.flashcards.filter((flashcard) => flashcard.dueDate <= new Date().toJSON()).length}</td>
                      <td onClick={currentDeck === deck ? null : () => setCurrentDeck(deck)}>{currentDeck === deck ? <em>Selected</em> : "Select"}</td>
                      <td><Button className="btn minimal" text="Delete" color="#85144b"/></td>
                    </tr>
    )
}

export default Deck
