import React from 'react'
import Words from './Words'
import Button from '../Button'
import CurrentFlashcards from './CurrentFlashcards'
import { useState, useEffect } from 'react'


const AddFlashcards = ({ currentDeck, hideAddFlashcards, currentFlashcards, setCurrentFlashcards, deckId, wordTypes }) => {
    const [searchString, setSearchString] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [filterString, setFilterString] = useState('')
    const [showResult, setShowResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [flashcards, setFlashcards] = useState(currentFlashcards)

    useEffect(() => {
        if (searchResult.length > 0) {
            setIsLoading(false)
            setShowResult(true)
        }
    }, [searchResult])


    const onClickSubmit = async () => {
        console.log(flashcards)
        console.log(currentFlashcards)
        updateFlashcards(deckId)
    }

    const getSearchResult = async (word) => {
        const url = `https://localhost:44386/api/Vocabulazy/words?word=${word}`
        const res = await fetch(url)
        const data = await res.json()
        return data
    }
    const onSubmit = async (e) => {
        e.preventDefault()
        setSearchResult([])
        setIsLoading(true)
        if (searchString === null | searchString.length === 0) {
            alert("please add a search value")
            return
        }
        const searchResultFromServer = await getSearchResult(searchString)
        setSearchResult(searchResultFromServer)
        console.log(searchResult)
    }

    const updateFlashcards = async (deckId) => {
        const flashcardsToAdd = flashcards.filter((flashcard) => !currentFlashcards.some(
            x => (x.wordType === "Verb" && x.verbId === flashcard.verbId)
                | (x.wordType === "Adjective" && x.adjectiveId === flashcard.adjectiveId)
                | (x.wordType === "Noun" && x.nounId === flashcard.nounId)
                | (x.wordType === "Adverb" && x.adverbId === flashcard.adverbId)
                | (x.wordType === "Conjunction" && x.conjunctionId === flashcard.conjunctionId)
                | (x.wordType === "Pronoun" && x.pronounId === flashcard.pronounId)
                | (x.wordType === "Preposition" && x.prepositionId === flashcard.prepositionId)
                | (x.wordType === "Article" && x.articleId === flashcard.articleId)))

        const flashcardsToRemove = currentFlashcards.filter((currentFlashcard) => !flashcards.some(
            x => (x.wordType === "Verb" && x.verbId === currentFlashcard.verbId)
                | (x.wordType === "Adjective" && x.adjectiveId === currentFlashcard.adjectiveId)
                | (x.wordType === "Noun" && x.nounId === currentFlashcard.nounId)
                | (x.wordType === "Adverb" && x.adverbId === currentFlashcard.adverbId)
                | (x.wordType === "Conjunction" && x.conjunctionId === currentFlashcard.conjunctionId)
                | (x.wordType === "Pronoun" && x.pronounId === currentFlashcard.pronounId)
                | (x.wordType === "Preposition" && x.prepositionId === currentFlashcard.prepositionId)
                | (x.wordType === "Article" && x.articleId === currentFlashcard.articleId)))
        var i;
        var len = flashcardsToAdd.length

        for (i = 0, len, deckId; i < len; i++) {
            const newFlashcard = { deckId }
            const id = wordTypes[flashcardsToAdd[i].wordType]["id"]

            newFlashcard[id] = flashcardsToAdd[i][id]
            console.log(newFlashcard)
            const flashcardFromServer = await addFlashcard(newFlashcard, flashcardsToAdd[i].wordType)
            setCurrentFlashcards([...currentFlashcards,flashcardFromServer])
        }

        var removeLen = flashcardsToRemove.length;
        for (i = 0, removeLen, deckId; i < removeLen; i++) {
            console.log(flashcardsToRemove[i])
            await deleteFlashcard(flashcardsToRemove[i])
        }
        setCurrentFlashcards(currentFlashcards.filter((flashcard) => !flashcardsToRemove.includes(flashcard)))
        // console.log(deckId)
        // console.log(flashcardsToAdd)
        // console.log(flashcardsToRemove)
    }

    const addFlashcard = async (newFlashcard, wordType) => {
        const res = await fetch(`https://localhost:44386/api/Flashcards/${wordType}s`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(newFlashcard)

        })
        const data = await res.json()
        return data;
    };

    const deleteFlashcard = async (flashcard) => {
        const id = wordTypes[flashcard.wordType]["id"]
        
        await fetch(`https://localhost:44386/api/Flashcards/${flashcard.wordType}s?id=${flashcard[id]}&deckId=${deckId}`, {
            method: 'DELETE',
        })
    };

    return (
        <>
            <div>
                <h1>Editing Deck: {currentDeck.name}</h1>
            </div>
            <div className="container horizontal-align">
                <div className="search-words-container">
                    <h2>Add words: </h2>
                    <form className='add-form' onSubmit={onSubmit}>
                        <div className='form-control'>
                            <input
                                type='text'
                                placeholder='Search words'
                                value={searchString}
                                onChange={(e) => setSearchString(e.target.value)}
                            />
                        </div>
                        <input type='submit' value='Search' className='btn btn-block' />
                    </form>
                    {isLoading && <h1>Loading....</h1>}
                    {showResult && <Words words={searchResult} flashcards={flashcards} setFlashcards={setFlashcards} currentFlashcards={currentFlashcards} />}
                </div>
                <div className="search-words-container">
                    <h2>Current words: </h2>
                    {currentFlashcards.length > 0 && <div className='form-control'>
                        <input type="text" id="myInput" onChange={(e) => setFilterString(e.target.value.toLowerCase())} value={filterString} placeholder="Search deck...">

                        </input>
                    </div>}
                    {currentFlashcards.length === 0 && <h3>Deck is empty</h3>}
                    {currentFlashcards.length > 0 && <CurrentFlashcards flashcards={flashcards} setFlashcards={setFlashcards} currentFlashcards={currentFlashcards} />}
                </div>
            </div>
            <div className="horizontal-align">
                <div className="word-container left">
                    <Button text="Back" onClick={hideAddFlashcards} />
                </div>
                <div className="word-container right">
                    <Button text="Submit" onClick={() => onClickSubmit()} />
                </div>
            </div>
        </>
    )
}

export default AddFlashcards
