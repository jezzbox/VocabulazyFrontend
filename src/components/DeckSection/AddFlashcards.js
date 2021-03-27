import Button from '../Button'
import { useState, useEffect } from 'react'
// import Words from './Words'
// import CurrentFlashcards from './CurrentFlashcards'
import updateFlashcards from './UpdateFlashcards'
import fetchData from '../../FetchData'
import processFlashcards from '../../ProcessFlashcards'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Link } from 'react-router-dom'
import Table from './Table'

const AddFlashcards = ({ currentDeck, setCurrentDeck, decks, setDecks }) => {
    const [searchString, setSearchString] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [flashcards, setFlashcards] = useState(null)
    const [filterString, setFilterString] = useState('')

    useEffect(() => {
        if(currentDeck.flashcards) {
            setFlashcards(currentDeck.flashcards)
        }
        
    },[currentDeck.flashcards])

    useEffect(() => {
        if (searchResult.length > 0) {
            setIsLoading(false)
            setShowResult(true)
        }
    }, [searchResult])

    const onClickFlashcard = (flashcard,currentFlashcards,action) => {
        if(action === "Add") {
            setFlashcards([...currentFlashcards,flashcard])
        }
        else if(action === "Remove") {
            setFlashcards(currentFlashcards.filter(x => !(x.word === flashcard.word && x.wordType === flashcard.wordType)))
        }
        }

    const generateRemoveButtons = (data) => {

        var i;
        const processedData = []
        for(i=0;i<data.length;i++) {
            const flashcard = data[i]
            flashcard.button = 
                <Button 
                text="Remove"
                color="#85144b"
                onClick={() => onClickFlashcard(flashcard,data,"Remove")}/>
                processedData.push(flashcard)
                    }
                return processedData
      }

      const generateAddButtons = (data, currentFlashcards) => {

        var i;
        const processedData = []
        for(i=0;i<data.length;i++) {
            const result = data[i]
            const wordInDeck = currentFlashcards.some(x => x.word === result.word && x.wordType === result.wordType) ? true : false
            result.button = 
                <Button 
                text={wordInDeck ? "Added" :"Add"}
                color={wordInDeck ? "#85144b" : "Green"}
                onClick={wordInDeck ? null : () => onClickFlashcard(result,currentFlashcards,"Add")}/>
                processedData.push(result)
                    }
                return processedData
            }

    // const onClickFlashcard = async (flashcard,action, wordInDeck) => {
    //     if(action === "Add") {
    //         if (!wordInDeck){
    //             setFlashcards([...flashcards,flashcard])
    //             }
    //     }
    //     else if(action === "Remove") {
    //         setFlashcards(flashcards.filter(x => !(x.word === flashcard.word && x.wordType === flashcard.wordType)))
    //     }
    //     }


    // const addButton = (data) => {
    //     var i;
    //     const processedData = []

    //     for(i=0;i<data.length;i++) {
    //         const flashcard = data[i]
    //         const wordInDeck = flashcards.some(x => x.word === flashcard.word && x.wordType === flashcard.wordType) ? true : false
    //         flashcard.button = <Button text={wordInDeck ? "Added" :"Add"} color="#85144b" onClick={() => onClickFlashcard(flashcard, "Add",wordInDeck)}/>
    //         processedData.push(flashcard)
    //             }
    //     return processedData

    // }

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
                    {showResult && <Table tableData={generateAddButtons(searchResult, flashcards)} headers={[{columnName:'word', objectProperty:'word'},{columnName:"Type", objectProperty:"wordType"}, {columnName:"delete", objectProperty:"button"}]}/>}
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
                        {flashcards && <Table tableData={generateRemoveButtons(flashcards)} headers={[{columnName:'word', objectProperty:'word'},{columnName:"Type", objectProperty:"wordType"}, {columnName:"delete", objectProperty:"button"}]}/>}
                    </div>
            </div>
        </div>
            <div className="center">
                <Link className="back-link" to = "/home">Back</Link>
                <Button text="Submit" color="black" onClick={() => onClickSubmit()} />
            </div>
        </div>
        </>
    )
}

export default AddFlashcards
