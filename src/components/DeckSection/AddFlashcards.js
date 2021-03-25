import Button from '../Button'
import { useState, useEffect } from 'react'
import Words from '../Decks/Words'
import CurrentFlashcards from '../Decks/CurrentFlashcards'
import updateFlashcards from './UpdateFlashcards'
import fetchData from '../../FetchData'
import processFlashcards from '../../ProcessFlashcards'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';

const AddFlashcards = ({ currentDeck, onClickAddFlashcards, setCurrentDeck, decks, setDecks }) => {
    const [searchString, setSearchString] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [flashcards, setFlashcards] = useState(currentDeck.flashcards)
    const [filterString, setFilterString] = useState('')

    useEffect(() => {
        setFlashcards(currentDeck.flashcards)
    },[currentDeck.flashcards])

    useEffect(() => {
        if (searchResult.length > 0) {
            setIsLoading(false)
            setShowResult(true)
        }
    }, [searchResult])

    const onSubmitSearch = async (e) => {
        e.preventDefault()

        setSearchResult([])
        setIsLoading(true)
        if (searchString === null | searchString.length === 0) {
            alert("please add a search value")
            return
        }
        const { dataFromServer, error } = await fetchData(`Vocabulazy/words?word=${searchString}`)
        if(error) {
            console.log(error)
        }
        else{
            setSearchResult(dataFromServer)
        console.log(searchResult)
        }
    }


    const onClickSubmit = async () => {
        const clickYes = async () => {
            console.log("clicked yes")
            const { dataFromServer, error } = await updateFlashcards(currentDeck, flashcards)
            if(error) {
                console.log(error)
            }
            else {

                dataFromServer.flashcards = processFlashcards(dataFromServer)
                const newDecks = decks.filter((deck) => deck.deckId !== currentDeck.deckId)
                setDecks([...newDecks,dataFromServer])
                setCurrentDeck(dataFromServer)
            }
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

    return (
        <>
        <div className="container blue-border">
            <div className="container horizontal-align">
                <div className="search-words-container">
                    <h2>Add: </h2>
                    <form className='add-form' onSubmit={onSubmitSearch}>
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
                <h2>Current: </h2>
                    <div className='form-control'>
                        <input type="text" id="myInput" onChange={(e) => setFilterString(e.target.value.toLowerCase())} value={filterString} placeholder="Search deck...">
                        </input>
                    </div>
                    <input type='submit' value='Search' className='btn btn-block' />
                    {currentDeck.flashcards.length === 0 && <h3>Deck is empty</h3>}
                    <CurrentFlashcards flashcards={flashcards} setFlashcards={setFlashcards} currentFlashcards={currentDeck.flashcards} />
            </div>
        </div>
            <div className="center">
                <Button className="btn" text="Back" color="steelblue" onClick={onClickAddFlashcards}/>
                <Button text="Submit" color="black" onClick={() => onClickSubmit()} />
            </div>
        </div>
        </>
    )
}

export default AddFlashcards
