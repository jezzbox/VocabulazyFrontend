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
import GenerateButtons from '../../Actions/GenerateButtons'
import TestTable from '../TestTable'


const AddFlashcards = ({ currentDeck, setCurrentDeck, decks, setDecks }) => {
    const [searchString, setSearchString] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [flashcardsInDeck, setFlashcardsInDeck] = useState(null)
    const [filterString, setFilterString] = useState('')
    const [cardsToSuspend, setCardsToSuspend] = useState([])

    useEffect(() => {
        if (currentDeck.flashcards) {
            const currentFlashcards = [...currentDeck.flashcards]
            setFlashcardsInDeck(currentFlashcards)
        }

    }, [currentDeck.flashcards])

    useEffect(() => {
        if (searchResult.length > 0) {
            setIsLoading(false)
            setShowResult(true)
        }
    }, [searchResult])


    const onSubmitSearch = async (e) => {
        e.preventDefault()

        setSearchResult([])
        if (searchString === null | searchString.length === 0) {
            alert("please add a search value")
            return
        }
        setIsLoading(true)
        const { dataFromServer, error } = await fetchData(`words?word=${searchString}`)
        if (error) {
            console.log(error)
        }
        else {
            var i;
            for(i=0;i<dataFromServer.length;i++) {
                dataFromServer[i].flashcardId = dataFromServer[i][`${dataFromServer[i].wordType}Id`]

            }
            setSearchResult(dataFromServer)
            console.log("search result")
            console.log(searchResult)
        }
    }


    const onClickSubmit = async () => {
        const clickYes = async () => {
            console.log("clicked yes")
            const { dataFromServer, error } = await updateFlashcards(currentDeck, flashcardsInDeck)
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



    const onClickSuspend = async (flashcard) => {
        

        const changeCardSuspension = async (flashcard) => {
            const flashcardId = flashcard[`${flashcard.wordType}Id`]
            const url = `flashcards/${flashcard.wordType}s?id=${flashcardId}&deckId=${currentDeck.deckId}`
            const patchData = [{ "op": "replace", "path": `/isSuspended`, "value": !flashcard.isSuspended }]
            const { error } = await fetchData(url,'PATCH',patchData)
            
            return { error }
            }
        

        const clickYes = async () => {
            changeCardSuspension(flashcard)
            const objIndex = flashcardsInDeck.findIndex((card => card.word === flashcard.word && card.wordType === flashcard.wordType));
            flashcardsInDeck[objIndex].isSuspended = !flashcardsInDeck[objIndex].isSuspended
            console.log(flashcardsInDeck)
            setFlashcardsInDeck([...flashcardsInDeck])
            }

        const clickNo = () => {
            return
        }

        confirmAlert({
            title: 'Confirm',
            message: flashcard.isSuspended ? 'Unsuspend card?' : 'Are you sure you want to suspend this card? you can unsuspend it at any time.',
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

    const onClickAdd = (flashcard) => {
        flashcard[`${flashcard.wordType}Id`] = flashcard.flashcardId
        flashcard.isSuspended = false
        setFlashcardsInDeck([...flashcardsInDeck, flashcard])
        console.log(flashcardsInDeck)
}

    const searchResultsColumns =  [
          {
            Header: 'Word',
            accessor: 'word', // accessor is the "key" in the data
            Cell: ({value}) => (<span className="text-center font-semibold text-2xl p-2">{value}</span>)
          },
          {
            Header: 'Type',
            accessor: 'wordType',
            Cell: ({value}) => (<span className="text-center text-xl p-2">{value}</span>)
          },
          {
            id: `flashcardId`,
            accessor:'flashcardId',
            Cell: ({row}) => (<button className="btn" onClick={
                flashcardsInDeck.some(card => card[`${card.wordType}Id`] === row.values.flashcardId) ? null :
                () => onClickAdd({flashcardId:row.values.flashcardId, wordType:row.values.wordType,word:row.values.word})}>
                {flashcardsInDeck.some(card => card[`${card.wordType}Id`] === row.values.flashcardId) ? "Added" : "Add"}
            </button>)
          },
        ]
    
        const CurrentFlashcardsColumns =  [
            {
              Header: 'Word',
              accessor: 'word', // accessor is the "key" in the data
              Cell: ({row, value}) => (<span className={row.original.isSuspended ? "text-red-700 text-center font-semibold text-2xl p-2" : "text-center font-semibold text-2xl p-2"}>{value}</span>)
            },
            {
              Header: 'Type',
              accessor: 'wordType',
              Cell: ({row, value}) => (<span className='text-center text-xl p-2'>{value}</span>)
            },
            {
                id: 'suspend',
                accessor: 'isSuspended',
                Cell: ({row}) => (<button className="btn" onClick={!row.original.phase ? null :() => onClickSuspend(row.original)}>
                    {!row.original.phase ? "Can't suspend new card" : flashcardsInDeck.find(card => card.word === row.original.word && card.wordType === row.original.wordType).isSuspended ? "Suspended" : "Suspend"}</button>)
              },
            {
              id: `flashcardId`,
              accessor:'flashcardId',
              Cell: ({row}) => (<button className="btn" onClick={
                  () => setFlashcardsInDeck(flashcardsInDeck.filter(x => !(x.word === row.values.word && x.wordType === row.values.wordType)))}>
              Remove</button>)
            },
          ]

    return (
        <>
            <section className="px-32 py-6">
            <header>
                <h4 className="p-2 border-b-2 border-bookBlue text-bold text-5xl">Editing: {currentDeck.name}</h4>
            </header>
                <div className="flex justify-evenly shadow-md">
                    <div className="w-1/2 bg-gray-100 shadow-md p-4">
                        <h2 className="text-4xl p-4" >Add cards</h2>
                        
                        <form className='p-4' onSubmit={onSubmitSearch}>
                            <div className='flex justify-center bg-gray-100'>
                                <input
                                    type='text'
                                    placeholder='Search'
                                    value={searchString}
                                    onChange={(e) => setSearchString(e.target.value)}
                                />
                            </div>
                            <div className="p-2 flex justify-center">
                            <input type='submit' value='Search' className='btn' />
                            </div>
                            
                        </form>
                        {isLoading && <h1>Loading....</h1>}
                        <div className="h-80 flex justify-center bg-white overflow-scroll">
                        {showResult && <TestTable columns={searchResultsColumns} data={searchResult} />}
                        </div>
                        {/* {showResult && <Table tableData={getTableButtons(searchResult, flashcardsInDeck)} headers={[{ columnName: 'word', objectProperty: 'word' }, { columnName: "Type", objectProperty: "wordType" }, { columnName: "delete", objectProperty: "button" }]} />} */}
                    </div>

                    <div className="w-1/2 bg-gray-100 shadow-md p-4">
                        <h2 className="text-4xl p-4">Current cards</h2>
                        <div className='flex justify-center bg-gray-100'>
                            <input type="text" id="myInput" onChange={(e) => setFilterString(e.target.value.toLowerCase())} value={filterString} placeholder="Search deck...">
                            </input>
                        </div>
                        <div className='p-6 flex justify-center'>
                        <input type='submit' value='Search' className='btn btn-block' />
                        </div>
                        {currentDeck.flashcards.length === 0 && <h3>Deck is empty</h3>}
                        <div className="flex justify-center bg-white overflow-scroll h-80">
                            {flashcardsInDeck && cardsToSuspend && <TestTable columns={CurrentFlashcardsColumns} data={flashcardsInDeck} />}
                            {/* {flashcardsInDeck && <Table tableData={getTableButtons(flashcardsInDeck)} headers={[{ columnName: 'word', objectProperty: 'word' }, { columnName: "Type", objectProperty: "wordType" }, { columnName: "delete", objectProperty: "button" }]} />} */}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center p-4">
                    <Link className="btn" to="/home">Back</Link>
                    <Button className="btn border-2 border-terraCotta-500" text="Submit" color="black" onClick={() => onClickSubmit()} />
                </div>
            </section>
        </>
    )
}

export default AddFlashcards
