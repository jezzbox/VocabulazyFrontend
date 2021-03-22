import Button from '../Button'
import { useState, useEffect } from 'react'
import Words from '../Decks/Words'
import CurrentFlashcards from '../Decks/CurrentFlashcards'
import WordTypes from '../WordTypes'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';

const AddFlashcards = ({ currentDeck, onClickAddFlashcards }) => {
    const [searchString, setSearchString] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [flashcards, setFlashcards] = useState(currentDeck.flashcards)
    const [filterString, setFilterString] = useState('')

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
        console.log("clicked search")

        setSearchResult([])
        setIsLoading(true)
        if (searchString === null | searchString.length === 0) {
            alert("please add a search value")
            return
        }
        const searchResultFromServer = await getSearchResult(searchString)
        console.log(searchResultFromServer)
        setSearchResult(searchResultFromServer)
        console.log(searchResult)
    }

    const onClickSubmit = async () => {
        const clickYes = async () => {
            await updateFlashcards(currentDeck.deckId)
        }

        const clickNo = () => {
            return
        }


        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure? Progress will be lost for any removed words',
            buttons: [
              {
                label: 'Yes',
                onClick: () => clickYes()
              },
              {
                label: 'No',
                onClick: () => clickNo()
              }
            ]
          });
    }

    const updateFlashcards = async (deckId) => {
        const currentFlashcards = currentDeck.flashcards
        console.log("capital test")
        console.log(flashcards)
        const flashcardsToAdd = flashcards.filter((flashcard) => !currentFlashcards.some(
            x => (x.wordType === flashcard.wordType && x["flashcardId"] === flashcard["flashcardId"])))
            
        const flashcardsToRemove = currentFlashcards.filter((currentFlashcard) => !flashcards.some(
            x => (x.wordType === currentFlashcard.wordType && x["flashcardId"] === currentFlashcard["flashcardId"])))
            console.log("flashcards to remove")
            console.log(flashcardsToRemove)

            console.log("flashcards to add")
            console.log(flashcardsToAdd)
            addFlashcards(flashcardsToAdd,flashcardsToRemove, deckId)
        }

        const addFlashcards = async (flashcardsToAdd,flashcardsToRemove, deckId) => {

            const patchData = []
            var i = 0;
    
            for (i=0; i < flashcardsToAdd.length;i++) {
                const flashcard= flashcardsToAdd[i]
                console.log(flashcard)
                const wordType = flashcard["wordType"]
                console.log(wordType)
                const id = [WordTypes[wordType]["id"]]
                console.log(WordTypes[wordType])
                const addData = { deckId }
                addData[id] = flashcard[id]
                patchData.push({ "op": "add", "path": `/${wordType}Flashcards/-`, "value": addData })
                }

                const res = await fetch(`https://localhost:44386/api/decks/${deckId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(patchData)
    
                    })
                const updatedDeck = await res.json()
                console.log(updatedDeck)
    
            for (i=0; i < flashcardsToRemove.length;i++) {
                const flashcard= flashcardsToRemove[i]
                deleteFlashcard(flashcard, deckId)

            }

            console.log("patch data")
            console.log(JSON.stringify(patchData))
        }

        const deleteFlashcard = async (flashcard, deckId) => {
            const id = WordTypes[flashcard.wordType]["id"]
                
                await fetch(`https://localhost:44386/api/Flashcards/${flashcard.wordType}s?id=${flashcard[id]}&deckId=${deckId}`, {
                    method: 'DELETE',
                })
            };


    return (
        <>
        <div className="container">
            <h3>Add words:</h3>
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
                    {showResult && <Words words={searchResult} flashcards={flashcards} setFlashcards={setFlashcards} currentFlashcards={currentDeck.verbFlashcards} />}
                </div>
            
            <div className="search-words-container">
                <h2>Current words: </h2>
                    <div className='form-control'>
                        <input type="text" id="myInput" onChange={(e) => setFilterString(e.target.value.toLowerCase())} value={filterString} placeholder="Search deck...">
                        </input>
                    </div>
                    <input type='submit' value='Search' className='btn btn-block' />
                    {currentDeck.flashcards.length === 0 && <h3>Deck is empty</h3>}
                    <CurrentFlashcards flashcards={flashcards} setFlashcards={setFlashcards} currentFlashcards={currentDeck.flashcards} />
            </div>
        </div>
        </div>
            <div className="horizontal-align">
            <div className="word-container left">
            <Button className="btn" text="Back" onClick={onClickAddFlashcards}/>
            </div>
            <div className="word-container right">
                <Button text="Submit" onClick={() => onClickSubmit()} />
            </div>
            </div>
        </>
    )
}

export default AddFlashcards
