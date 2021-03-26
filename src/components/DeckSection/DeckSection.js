import CurrentDeck from './CurrentDeck'
import AddFlashcards from './AddFlashcards'
import DeckForm from './DeckForm'
import processFlashcards from '../../ProcessFlashcards'
import fetchData from '../../FetchData'
import { useEffect } from 'react'
import './deck.css'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

const DeckSection = ({ currentDeck, decks, setCurrentDeck, setDecks, userProfile }) => {

    useEffect(() => {
        console.log(currentDeck)
    },[currentDeck])

    const updateDeck = async (updatedDeck) => {
        const patchData = []
        for (const [key, value] of Object.entries(updatedDeck)) {
            patchData.push({ "op": "replace", "path": "/" + key, "value": value })
        }

        const { dataFromServer, error } = await fetchData(`decks/${currentDeck.deckId}`, 'PATCH', patchData)
        if (error) {
            console.log(error)
        }
        else {
            dataFromServer.flashcards = processFlashcards(dataFromServer)
            setCurrentDeck(dataFromServer)
        }

    }

    return (
        <Router>
        <>
                <section className="deck-section">
                    <header>
                        <h4>Current deck:</h4>
                    </header>

                    <div className="center">
                        <CurrentDeck currentDeck={currentDeck}/>
                    </div>

                    
                    <Route path="/home" exact>
                        <div className="current-deck deck-options">
                            <Link className="back-link" to="/deck/addFlashcards">Add/remove flashcards</Link>
                            <Link className="back-link" to="/deck/edit">Edit settings</Link>
                        </div>
                    </Route>
                    

                    <Route path="/deck/addFlashcards" exact>
                        {currentDeck.flashcards && <AddFlashcards currentDeck={currentDeck} setCurrentDeck={setCurrentDeck} decks={decks} setDecks={setDecks} />}
                    </Route>


                    <Route path="/deck/edit" exact>
                        <div className="container blue-border">
                            <DeckForm deck={currentDeck} processDeck={updateDeck} headerText="Edit deck:" />
                        </div>
                    </Route>

                </section>
        </>
        </Router>
    )
}

export default DeckSection
