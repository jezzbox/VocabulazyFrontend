import CurrentDeck from './CurrentDeck'
import Button from '../Button'
import AddFlashcards from './AddFlashcards'
import DeckForm from './DeckForm'
import processFlashcards from '../../ProcessFlashcards'
import fetchData from '../../FetchData'
import { useState, useEffect } from 'react'
import './deck.css'

const DeckSection = ({ userProfile, setShowAddFlashcards, setShowEditDeck, showAddFlashcards, showEditDeck }) => {
    const [currentDeck, setCurrentDeck] = useState([])
    const [updatedDeck, setUpdatedDeck] = useState(null)
    const [deckId, setDeckId] = useState(null)

    useEffect(() => {
        if (userProfile.defaultDeckId) {
            const currentDeck = userProfile.decks.filter((deck) => deck.deckId === userProfile.defaultDeckId)[0]
            currentDeck.flashcards = processFlashcards(currentDeck)
            setCurrentDeck(currentDeck)
            setDeckId(currentDeck.deckId)
        }
        else {
            const currentDeck = userProfile.decks[0]
            currentDeck.flashcards = processFlashcards(currentDeck)
            setCurrentDeck(currentDeck)
            setDeckId(currentDeck.deckId)
        }
    }, [userProfile.defaultDeckId, userProfile.decks])


    useEffect(() => {
        if (updatedDeck) {
            const updateDeck = async () => {
                const patchData = []
                console.log(updatedDeck)
                for (const [key, value] of Object.entries(updatedDeck)) {
                    patchData.push({ "op": "replace", "path": "/" + key, "value": value })
                }

                const { dataFromServer, error } = await fetchData(`decks/${deckId}`, 'PATCH', patchData)
                console.log()
                if (error) {
                    console.log(error)
                }
                else {
                    dataFromServer.flashcards = processFlashcards(dataFromServer)
                    setCurrentDeck(dataFromServer)
                    setUpdatedDeck(null)
                }

            }
            updateDeck()
        }
    }, [updatedDeck, deckId])

    return (
        <>
            {currentDeck &&

                <section className="deck-section">
                    <header>
                        <h4>Current deck:</h4>
                    </header>

                    <div className="center">
                        <CurrentDeck currentDeck={currentDeck}/>

                        {!showAddFlashcards && !showEditDeck && <div className="current-deck-options">
                            <Button className="btn" color="steelblue" text="Add/Remove Words" onClick={() => setShowAddFlashcards(true)} />
                            {!showAddFlashcards && <Button className="btn" text="Edit settings" color="steelblue" onClick={() => setShowEditDeck(true)} />}
                        </div>}

                    </div>

                    {showAddFlashcards && currentDeck.flashcards && <AddFlashcards currentDeck={currentDeck} setCurrentDeck={setCurrentDeck} onClickAddFlashcards={() => setShowAddFlashcards(!showAddFlashcards)} />}

                    {showEditDeck &&
                        <div>
                            <h1>Edit deck settings</h1>
                            <DeckForm deck={currentDeck} setDeck={setUpdatedDeck} onClickBack={() => setShowEditDeck(false)} />
                        </div>
                    }

                </section>}
        </>
    )
}

export default DeckSection
