import Button from '../Button'
import { useState, useEffect } from 'react'
// import Words from './Words'
// import CurrentFlashcards from './CurrentFlashcards'
import updateFlashcards from '../../Actions/UpdateFlashcards'
import fetchData from '../../Actions/FetchData'
import processFlashcards from '../../Actions/ProcessFlashcards'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Link } from 'react-router-dom'
import Table from '../Table'
import GenerateButtons from '../../Actions/GenerateButtons'


const AddFlashcards = ({ currentDeck, setCurrentDeck, decks, setDecks }) => {
    const [searchString, setSearchString] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [flashcards, setFlashcards] = useState(null)
    const [filterString, setFilterString] = useState('')

    useEffect(() => {
        if (currentDeck.flashcards) {
            setFlashcards(currentDeck.flashcards)
        }

    }, [currentDeck.flashcards])

    useEffect(() => {
        if (searchResult.length > 0) {
            setIsLoading(false)
            setShowResult(true)
        }
    }, [searchResult])

    const getTableButtons = (data, currentData = null) => {

        const onClickFlashcard = (flashcard, currentFlashcards, action) => {
            if (action === "Add") {
                const newFlashcard = Object.create(flashcard)
                setFlashcards([...currentFlashcards, newFlashcard])
            }
            else if (action === "Remove") {
                setFlashcards(currentFlashcards.filter(x => !(x.word === flashcard.word && x.wordType === flashcard.wordType)))
            }
        }
        return GenerateButtons(data, currentData, onClickFlashcard)


    }

    const onSubmitSearch = async (e) => {
        e.preventDefault()

        setSearchResult([])
        setIsLoading(true)
        if (searchString === null | searchString.length === 0) {
            alert("please add a search value")
            return
        }
        const { dataFromServer, error } = await fetchData(`Vocabulazy/words?word=${searchString}`)
        if (error) {
            console.log(error)
        }
        else {
            setSearchResult(dataFromServer)
            console.log(searchResult)
        }
    }


    const onClickSubmit = async () => {
        const clickYes = async () => {
            console.log("clicked yes")
            const { dataFromServer, error } = await updateFlashcards(currentDeck, flashcards)
            if (error) {
                console.log(error)
            }
            else {

                dataFromServer.flashcards = processFlashcards(dataFromServer)
                const newDecks = decks.filter((deck) => deck.deckId !== currentDeck.deckId)
                setDecks([...newDecks, dataFromServer])
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
                        {showResult && <Table tableData={getTableButtons(searchResult, flashcards)} headers={[{ columnName: 'word', objectProperty: 'word' }, { columnName: "Type", objectProperty: "wordType" }, { columnName: "delete", objectProperty: "button" }]} />}
                    </div>

                    <div className="search-words-container">
                        <h2>Current: </h2>
                        <div className='form-control'>
                            <input type="text" id="myInput" onChange={(e) => setFilterString(e.target.value.toLowerCase())} value={filterString} placeholder="Search deck...">
                            </input>
                        </div>
                        <input type='submit' value='Search' className='btn btn-block' />
                        {currentDeck.flashcards.length === 0 && <h3>Deck is empty</h3>}
                        <div className="scroll table-container">
                            {flashcards && <Table tableData={getTableButtons(flashcards)} headers={[{ columnName: 'word', objectProperty: 'word' }, { columnName: "Type", objectProperty: "wordType" }, { columnName: "delete", objectProperty: "button" }]} />}
                        </div>
                    </div>
                </div>
                <div className="center">
                    <Link className="back-link" to="/home">Back</Link>
                    <Button text="Submit" color="black" onClick={() => onClickSubmit()} />
                </div>
            </div>
        </>
    )
}

export default AddFlashcards
