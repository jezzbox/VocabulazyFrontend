import CurrentDeck from './CurrentDeck'
import AddFlashcards from './AddFlashcards'
import DeckForm from './DeckForm'
import processFlashcards from '../../Actions/ProcessFlashcards'
import fetchData from '../../Actions/FetchData'
import { useEffect } from 'react'
import './deck.css'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

const DeckSection = ({ currentDeck, decks, setCurrentDeck, setDecks }) => {

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

            <article>
                    
                    
                    <Route path="/home" exact>
                    <header>
                        <h4 className="p-2 border-b-2 border-bookBlue text-bold text-3xl">Current deck</h4>
                    </header>
                    <div className= "flex justify-center">
                        <CurrentDeck currentDeck={currentDeck}/>
                    </div>
                        <div className="flex justify-center text-center text-2xl">
                            <div  className="w-1/3  flex justify-center text-center">
                            <Link className="btn border-2 shadow-md transition-colors duration-75 border-terraCotta-500 hover:text-white hover:bg-terraCotta-500 hover:shadow-inner" to="/deck/addFlashcards">Add/remove cards</Link>
                            <Link className="btn border-2 shadow-md transition-colors duration-75 border-terraCotta-500 hover:text-white hover:bg-terraCotta-500 hover:shadow-inner ml-2" to="/deck/edit">Edit settings</Link>
                            </div>
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

            </article>
        </Router>
    )
}

export default DeckSection
