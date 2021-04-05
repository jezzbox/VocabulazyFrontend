import { useState, useEffect } from 'react'
import fetchData from '../../Actions/FetchData'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Link } from 'react-router-dom'
import Table from '../Table'
import AddCards from './AddCards'
import deleteCard from '../../Actions/DeleteCard'
import DeckForm from './DeckForm'


const DeckSettings = ({ currentDeck, setCurrentDeck, updateDeck, startingEase, defaultDeckId }) => {
    const [cardsInDeck, setCardsInDeck] = useState(null)
    const [filterString, setFilterString] = useState('')
    const [showAddCards, setShowAddCards] = useState(false)

    useEffect(() => {
        if (currentDeck.flashcards) {
            const currentFlashcards = [...currentDeck.flashcards]
            setCardsInDeck(currentFlashcards)
        }

    }, [currentDeck.flashcards])


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
            const objIndex = cardsInDeck.findIndex((card => card.word === flashcard.word && card.wordType === flashcard.wordType));
            cardsInDeck[objIndex].isSuspended = !cardsInDeck[objIndex].isSuspended
            console.log(cardsInDeck)
            setCardsInDeck([...cardsInDeck])
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

    const onClickRemove = async (card) => {

        const clickYes = async () => {
            deleteCard(currentDeck.deckId, card)
            setCardsInDeck(cardsInDeck.filter(i => !(i[`${card.wordType}Id`] === card[`${card.wordType}Id`])))
            
        }

        const clickNo = () => {
            return
        }

        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure you want to remove this card? all progress will be lost. this cannot be undone.',
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

        const parseDate = (date) => {
            const newDate = new Date(date)
            return newDate.toDateString()

        }
    
        const CurrentFlashcardsColumns =  [
            {
              Header: 'Word',
              accessor: 'word', // accessor is the "key" in the data
              Cell: ({row, value}) => (<span className={row.original.isSuspended ? "line-through text-center text-xl p-2" : "text-center text-xl p-2"}>{value}</span>)
            },
            {
              Header: 'Type',
              accessor: 'wordType',
            },
            {
                Header: 'Phase',
                accessor: 'phase',
              },
              {
                Header: 'Due',
                accessor: 'dueDate',
                Cell: ({value}) => (parseDate(value))
              },
            {
                id: 'suspend',
                accessor: 'isSuspended',
                Cell: ({row}) => (<button className={row.original.isSuspended ? "text-red-700 w-32 uppercase text-lg font-semibold" : "w-32 uppercase text-lg font-semibold"} onClick={!row.original.phase ? null :() => onClickSuspend(row.original)}>
                    {!row.original.phase ? "-" : cardsInDeck.find(card => card.word === row.original.word && card.wordType === row.original.wordType).isSuspended ? "Suspended" : "Suspend"}</button>)
              },
            {
              id: `flashcardId`,
              accessor:'flashcardId',
              Cell: ({row}) => (<button className="w-32 uppercase text-lg font-semibold" onClick={
                  () => onClickRemove(row.original)}>
              Remove</button>)
            },
          ]

    return (
        <>
        <section className="border-2 border-bookBlue rounded-md bg-white mx-60">
            {showAddCards && <AddCards startingEase={startingEase} cardsInDeck={cardsInDeck} currentDeck={currentDeck} setCurrentDeck={setCurrentDeck} setShowAddCards={setShowAddCards}/>}
            <header className="flex justify-between p-2 mx-8">
                <Link className="btn border-2 border-terraCotta-500 bg-gray-100" to="/home">Back</Link>
                <h4 className="p-2 border-b-2 border-bookBlue text-bold text-center text-xl">Deck: {currentDeck.name}</h4>
            </header>
            <div>
                <div className="flex justify-center">

                {/* Current cards */}
                    <div className="mx-8 w-full bg-bookBlue shadow-xl rounded-md">
                        <div className="flex justify-between px-6 pt-4">
                            <h2 className="text-2xl text-white">Cards</h2>
                            <button className="btn text-white bg-terraCotta-500" onClick={() => setShowAddCards(true)}><svg className="w-6 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
</svg>Add</button>
                        </div>

                        <div className='flex justify-start p-2'>
                            <input className="rounded-full p-2 m-2" type="text" id="myInput" onChange={(e) => setFilterString(e.target.value.toLowerCase())} value={filterString} placeholder="Search deck...">
                            </input>
                            <div className="p-2 flex justify-center">
                                <input type='submit' value='Search' className='btn text-md border-2 border-terraCotta-500' />
                            </div>
                        </div>
                        {currentDeck.flashcards.length === 0 && <h3>Deck is empty</h3>}
                        <div className="h-96 flex justify-center bg-white overflow-scrollborder border-2 border-bookBlue scrollbar-thin scrollbar-thumb-bookBlue scrollbar-track-gray-100 overflow-y-scroll">
                            {cardsInDeck && <Table columns={CurrentFlashcardsColumns} data={cardsInDeck} />}
                            {/* {cardsInDeck && <Table tableData={getTableButtons(cardsInDeck)} headers={[{ columnName: 'word', objectProperty: 'word' }, { columnName: "Type", objectProperty: "wordType" }, { columnName: "delete", objectProperty: "button" }]} />} */}
                        </div>
                    </div>

                    </div>
                    <div className="flex justify-center my-24 rounded-md">
                    <div className="mx-8 w-full bg-bookBlue shadow-lg rounded-md">
                        <div className="flex justify-between px-6 py-4">
                            <h2 className="text-2xl text-white">Deck settings</h2>
                        </div>
                        <div className="bg-white border-2 border-bookBlue rounded-b-md">
                            {console.log(defaultDeckId,currentDeck.deckId)}
                            <DeckForm deck={currentDeck} processDeck={updateDeck} isDefault={defaultDeckId === currentDeck.deckId ? true : false} headerText="Edit deck:"/>
                        </div>
                    </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default DeckSettings
