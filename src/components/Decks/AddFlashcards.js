import React from 'react'
import Words from './Words'
import Button from '../Button'
import CurrentFlashcards from './CurrentFlashcards'
import { useState, useEffect } from 'react'


const AddFlashcards = ({ hideAddFlashcards, currentFlashcards, setCurrentFlashcards }) => {
    const [searchString, setSearchString] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [filterString, setFilterString] = useState('')
    const [showResult, setShowResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [flashcards, setFlashcards] = useState([])

    useEffect(() => {
        if (searchResult.length > 0) {
            setIsLoading(false)
            setShowResult(true)
        }
    }, [searchResult])

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

    // const updateFlashcards = async (deckId) => {
    //     const verbFlashcardsFromServer = await fetchFlashcards("Verb", deckId)
    //     const adjectiveFlashcardsFromServer = await fetchFlashcards("Adjective", deckId)

    //     const verbsToAdd = verbFlashcards.filter((verb) => !verbFlashcardsFromServer.some(x => x.verbId === verb.verbId))
    //     const verbsToRemove = verbFlashcardsFromServer.filter((verb) => !verbFlashcards.some(x => x.verbId === verb.verbId))

    //     verbsToAdd.forEach(verb => {
    //       const newVerbFlashcard = { verbId: verb.verbId, deckId: deckId }
    //       addVerbFlashcard(newVerbFlashcard)
    //     })
    //     verbsToRemove.forEach(verb => {
    //       deleteVerbFlashcard(verb)
    //     })
    //   }


    return (
        <>
            <div>
                <h1>Editing Deck: my first deck</h1>
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
                    {showResult && <Words words={searchResult} currentFlashcards={currentFlashcards} setCurrentFlashcards={setCurrentFlashcards} />}
                </div>
                <div className="search-words-container">
                    <h2>Current words: </h2>
                    {currentFlashcards.length > 0 && <div className='form-control'>
                        <input type="text" id="myInput" onChange={(e) => setFilterString(e.target.value.toLowerCase())} value={filterString} placeholder="Search deck...">

                        </input>
                    </div>}
                    {currentFlashcards.length === 0 && <h3>Deck is empty</h3>}
                    {currentFlashcards.length > 0 && <CurrentFlashcards flashcards={currentFlashcards} setCurrentFlashcards={setCurrentFlashcards}/>}
                </div>
            </div>
            <div className="horizontal-align">
                <div className="word-container left">
                    <Button text="Back" onClick={hideAddFlashcards} />
                </div>
                <div className="word-container right">
                    <Button text="Submit" />
                </div>
            </div>
        </>
    )
}

export default AddFlashcards
