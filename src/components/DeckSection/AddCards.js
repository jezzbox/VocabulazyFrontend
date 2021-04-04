
import TestTable from '../TestTable'
import { useState, useEffect } from 'react'
import fetchData from '../../Actions/FetchData'
import Button from '../Button'
import { confirmAlert } from 'react-confirm-alert'; // Import
import addFlashcards from '../../Actions/AddFlashcards'
import processFlashcards from '../../Actions/ProcessFlashcards'
const AddCards = ({currentDeck, setCurrentDeck, setShowAddCards}) => {
    const [searchString, setSearchString] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [cardsToAdd, setCardsToAdd] = useState([]);
    const [currentCards, setCurrentCards] = useState([]);

    useEffect(() => {
        if(currentDeck.flashcards) {
            setCurrentCards(currentDeck.flashcards)
        }
    },[currentDeck])

    const onClickAdd = (card) => {
        card[`${card.wordType}Id`] = card.flashcardId
        card.isSuspended = false
        setCardsToAdd([...cardsToAdd, card])
        console.log(cardsToAdd)
        }
    
    const onSubmitSearch = async (e) => {
        e.preventDefault()
    
        setSearchResult([])
        if (searchString === null | searchString.length === 0) {
            alert("please add a search value")
            return
            }

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
            }
        }
    
    const cardState = (card,arrayToCheck) => {
        return arrayToCheck.some(i => i[`${i.wordType}Id`] === card.flashcardId)
        }

    const onClickSubmit = async () => {
        const clickYes = async () => {
            console.log(currentCards)
            console.log("clicked yes")
            const { dataFromServer, error } = await addFlashcards(currentDeck.deckId, cardsToAdd)
            if (error) {
                console.log(error)
                }
            else {
                dataFromServer.flashcards = processFlashcards(dataFromServer)
                setCurrentDeck(dataFromServer)
                setShowAddCards(false)
                // const newDecks = decks.filter((deck) => deck.deckId !== currentDeck.deckId)
                // setDecks([...newDecks, dataFromServer])
                // setCurrentDeck(dataFromServer)
                }
            }
    
            const clickNo = () => {
                return
            }
    
    
    
        confirmAlert({
            title: 'Confirm',
            message: 'Add selected cards to deck?',
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

    const searchResultsColumns =  [
        {
          Header: 'Word',
          accessor: 'word', // accessor is the "key" in the data
        },
        {
          Header: 'Type',
          accessor: 'wordType',
        },
        {
          Header: 'Add',
          id: `flashcardId`,
          accessor:'flashcardId',
          Cell: ({row}) => (
                <button className="w-40 uppercase text-md text-left font-semibold" onClick={
                    !cardState(row.values, currentCards) && !cardState(row.values, cardsToAdd) ?
                    () => onClickAdd(row.values)
                    : null}>
              {cardState(row.values, currentCards) ? "Already in deck" 
              : cardState(row.values, cardsToAdd)  ? "Added"
              : "Add"}
          </button>)
        },
      ]

      const cardsToAddColumns =  [
        {
          Header: 'Word',
          accessor: 'word', // accessor is the "key" in the data
        },
        {
          Header: 'Type',
          accessor: 'wordType',
        },
        {
          Header: 'Add',
          id: `flashcardId`,
          accessor:'flashcardId',
          Cell: ({row}) => (<button className="w-20 uppercase text-md text-left font-semibold" onClick={
              () => setCardsToAdd(cardsToAdd.filter(i => !(i.wordType === row.values.wordType && i.flashcardId === row.values.flashcardId)))}>
                Remove
          </button>)
        },
      ]


    return (
        <div className="bg-opacity-60 bg-gray-500 fixed inset-0">

        <div className="opacity-100 mx-96 my-32 shadow-xl p-4 border-4 rounded-xl border-bookBlue bg-gray-100">

            <div className="flex justify-between p-4">
                <h2 className="text-2xl text-terraCotta-600 px-4 border-b border-bookBlue" >Add cards</h2>
                <button className="btn" onClick={() => setShowAddCards(false)}>
                    <svg className="block w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div>
            <div className="mx-16 bg-bookBlue rounded-t-lg">
                
                <form className='flex justify-left px-4 py-2' onSubmit={onSubmitSearch}>
                    <div className='flex justify-start items-center'>
                        <input className="text-md w-full rounded-full p-2"
                        type='text'
                        placeholder='hablar ...'
                        value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}
                        />
                    </div>
                    <div className="p-2 flex justify-center">
                        <input type='submit' value='Search' className='btn text-md border-2 border-terraCotta-500' />
                    </div>
                </form>
            

        <div className="h-48 flex justify-center items-start bg-white scrollbar-thin scrollbar-thumb-bookBlue scrollbar-track-gray-100 overflow-y-scroll border-2 border-bookBlue">
            <TestTable columns={searchResultsColumns} data={searchResult} />
        </div>
    </div>
    <div className="mx-16 bg-terraCotta-600 rounded-t-lg mt-12">
        <h1 className="py-2 px-4 text-white text-xl">Selected</h1>
        <div className="h-48 flex justify-center items-start bg-white scrollbar-thin scrollbar-thumb-terraCotta-600 scrollbar-track-gray-100 overflow-y-scroll border border-terraCotta-600">
            <TestTable columns={cardsToAddColumns} data={cardsToAdd} />
        </div>
        
    </div>
    <div className="flex justify-center p-4">
        <Button className="btn border-2 border-terraCotta-500" text="Submit" color="black" onClick={onClickSubmit} />
    </div>
</div>
</div>
</div>
    )
}

export default AddCards
