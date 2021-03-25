import CurrentDeck from './CurrentDeck'
import Button from '../Button'
import AddFlashcards from './AddFlashcards'
import DeckForm from './DeckForm'
import processFlashcards from '../../ProcessFlashcards'
import fetchData from '../../FetchData'
import { useState, useEffect } from 'react'
import './deck.css'
import ChangeDeck from './ChangeDeck'

const DeckSection = ({ userProfile, setShowAddFlashcards, setShowEditDeck, showAddFlashcards, showEditDeck, showChangeDeck, setShowChangeDeck, showAddDeck, setShowAddDeck }) => {
    const [decks, setDecks] = useState([])
    const [currentDeck, setCurrentDeck] = useState([])
    const [updatedDeck, setUpdatedDeck] = useState(null)
    const [deckToAdd, setDeckToAdd] = useState(null)
    const [deckId, setDeckId] = useState(null)
    const [deckToDelete, setDeckToDelete] = useState(null)
    const [defaultDeckId, setDefaultDeckId] = useState(userProfile.defaultDeckId)

    useEffect(() => {
        console.log(currentDeck)
    },[currentDeck])

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
        setDecks(userProfile.decks)
    }, [userProfile.defaultDeckId, userProfile.decks])


    useEffect(() => {
        if (updatedDeck) {
            const updateDeck = async () => {
                const patchData = []
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

    useEffect(() => {
        if (deckToAdd) {
            const addDeck = async () => {
                deckToAdd.userId = userProfile.userId
                const { dataFromServer, error } = await fetchData(`decks/`, 'POST', deckToAdd)
                if (error) {
                    console.log(error)
                }
                else {
                    dataFromServer.flashcards = []
                    setDecks([...decks,dataFromServer])
                    setCurrentDeck(dataFromServer)
                    setShowAddDeck(false)
                    setShowAddFlashcards(true)
                    setDeckToAdd(null)
                }

            }
            addDeck()
        }
    }, [deckToAdd, decks, userProfile.userId])

    useEffect(() => {
        if (deckToDelete) {
            const deleteDeck = async () => {
                if(deckToDelete.deckId === currentDeck.deckId) {
                    setCurrentDeck([])
                    }

                if(deckToDelete.deckId === userProfile.defaultDeckId) {
                    await fetchData(`users/${deckToDelete.deckId}`, 'PATCH', { "op": "replace", "path": `/defaultDeckId`, "value": null })
                    setDefaultDeckId(null)
                    }

                const { dataFromServer, error } = await fetchData(`decks/${deckToDelete.deckId}`, 'DELETE')

                if (error) {
                    console.log(error)
                    }
                else {
                    dataFromServer.flashcards = []
                    const updatedDecks = decks.filter((deck) => deck.deckId !== deckToDelete.deckId)
                    setDecks(updatedDecks)
                    setCurrentDeck(updatedDecks[0])
                    setDeckToDelete(null)

                    }
                }
            deleteDeck()
        }
    }, [deckToDelete, decks, userProfile.userId, currentDeck.deckId])

    return (
        <>
            {currentDeck &&

                <section className="deck-section">
                    {!showAddFlashcards && !showEditDeck && !showChangeDeck && !showAddDeck &&
                    
                    <header>
                        <h4>Current deck:</h4>
                    </header>}

                    {showChangeDeck && <ChangeDeck decks={decks} currentDeck={currentDeck} setCurrentDeck={setCurrentDeck} onClickBack={() => setShowChangeDeck(false)} setDeckToDelete={setDeckToDelete} />}

                    {!showChangeDeck && !showAddDeck && <div className="center">
                        <CurrentDeck currentDeck={currentDeck}/>
                    </div>}

                    {!showAddFlashcards && !showEditDeck && !showChangeDeck && !showAddDeck &&

                        <div className="current-deck deck-options">
                            <Button className="deck-options-btn" color="steelblue" text="Add/Remove Words" onClick={() => setShowAddFlashcards(true)} />
                            <Button className="deck-options-btn" text="Edit settings" color="steelblue" onClick={() => setShowEditDeck(true)} />
                        </div>}

                    {showAddFlashcards && currentDeck.flashcards && <AddFlashcards currentDeck={currentDeck} setCurrentDeck={setCurrentDeck} onClickAddFlashcards={() => setShowAddFlashcards(!showAddFlashcards)} decks={decks} setDecks={setDecks} />}
                    
                    {showAddDeck &&
                        <div className="container blue-border">
                            <DeckForm deck={
        {name:'', isDefault:false, useSubjunctive:true, useInfinitive:true, useIndicative:true, useImperative:true, useParticiple:true, usePreterite:true, useImperfect:true, useFuture:true, usePresent:true,
        useYo:true, useTu:true, useEl:true, useVos:false, useEllos:true, useNosotros:true, useVosotros:true
                            }} setDeck={setDeckToAdd} onClickBack={() => setShowAddDeck(false)} headerText="Create new deck:" />
                        </div>
}


                    {showEditDeck &&
                        <div className="container blue-border">
                            <DeckForm deck={currentDeck} setDeck={setUpdatedDeck} onClickBack={() => setShowEditDeck(false)} headerText="Edit deck:" />
                        </div>
                    }

                </section>}
        </>
    )
}

export default DeckSection
