import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Route, NavLink, Redirect, Link } from 'react-router-dom'
import Header from './components/Header/Header'
import { useAuth0 } from "@auth0/auth0-react";
import Welcome from './components/Welcome'
import Flashcards from './components/Flashcards'
import DeckSection from './components/DeckSection/DeckSection'
import useFetch from './Actions/UseFetch';
import processFlashcards from './Actions/ProcessFlashcards'
import ChangeUserSettings from './components/ChangeUserSettings';
import DeckForm from './components/DeckSection/DeckForm'
import fetchData from './Actions/FetchData'
import Table from './components/Table'
import { confirmAlert } from 'react-confirm-alert'; // Import
import AddCards from './components/DeckSection/AddCards'
import Footer from './components/Footer'
import About from './components/About'

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const [updatedUserProfile, setUpdatedUserProfile] = useState(null)
  const { data: userProfile, isPending, error } = useFetch(`users?authIdentifier=`, updatedUserProfile, "user")
  const [decks, setDecks] = useState(null)
  const [currentDeck, setCurrentDeck] = useState(null)
  const [showAddCards, setShowAddCards] = useState(false)


  const getDefaultDeck = useCallback((decks) => {
    const defaultDeck = decks.find(deck => deck.deckId === userProfile.defaultDeckId)

        if(defaultDeck === undefined) {
          if(decks.length === 0) {
            return null
          }
          const newestDeck = decks.reduce((l,d) => l.dueDate > d.dueDate ? l : d)
          newestDeck.flashcards = processFlashcards(newestDeck)
          return newestDeck;
        }
        else {
           defaultDeck.flashcards = processFlashcards(defaultDeck)
           return defaultDeck;
        }
  },[userProfile.defaultDeckId])

  // sets the decks after userProfile is loaded
  useEffect(() => {
    if (userProfile && !isPending && userProfile.decks) {
        setDecks(userProfile.decks)
    }
  }, [userProfile, isPending])

  // sets the default deck after setDecks
  useEffect(() => {
    if (userProfile && !isPending && decks) {
      if (!currentDeck && decks.length > 0) {

        const newCurrentDeck = getDefaultDeck(decks)
        setCurrentDeck(newCurrentDeck)
    }
}
}, [decks, currentDeck, isPending, userProfile, getDefaultDeck])


  useEffect(() => {
    if (userProfile) {
      console.log(userProfile)
      setUpdatedUserProfile(null)
    }
  }, [userProfile])

// add new deck
  const addDeck = async (deckToAdd) => {
    deckToAdd.userId = userProfile.userId
    const { dataFromServer: newDeck, error } = await fetchData(`decks/`, 'POST', deckToAdd)
    if (error) {
      console.log(error)
    }
    else {
      newDeck.flashcards = []
      setCurrentDeck(newDeck)
      setDecks([...decks, newDeck])
      setShowAddCards(true)
    }

  }

  // delete deck
  const deleteDeck = async (deckId) => {
    const { error } = await fetchData(`decks/${deckId}`, 'DELETE')
    if (error) {
      console.log(error)
    }
    else {
      const newDecks = decks.filter((deck) => deck.deckId !== deckId)
      setDecks(newDecks)

      if(deckId === currentDeck.deckId) {
        const newCurrentDeck = getDefaultDeck(newDecks)
        setCurrentDeck(newCurrentDeck)
      }
    }

  }

  const changeCurrentDeck = async (deck) => {
    deck.flashcards = processFlashcards(deck)
    setCurrentDeck(deck)

  }

  const onClickDeleteDeck = async (deckId) => {


    const clickYes = async () => {
      deleteDeck(deckId)
      
    }

    const clickNo = () => {
      return
    }

  confirmAlert({
      title: 'Confirm',
      message: 'Are you sure you want to delete this deck? all progress will be lost. this cannot be undone.',
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


  const decksColumns =  [
    {
      id: `currentDeck`,
      accessor:'deckId',
      Cell: ({value}) => (<div className="w-16 flex justify-left"> {userProfile.defaultDeckId === value ?
        <svg className="w-6 inline-block" xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg> : null }
        {currentDeck.deckId === value ? <svg className="w-6 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
        </svg> : null}
        </div>)
    },
    {
      Header: 'Name',
      id:'name',
      Cell: ({row}) => (<button className={currentDeck.deckId === row.original.deckId ? "font-bold" : ""} onClick={() => changeCurrentDeck(row.original)}>{row.original.name}</button>)
    },


    {
      Header: 'Cards',
      id:'cards',
      accessor: 'flashcards', // accessor is the "key" in the data
      Cell: ({row}) => (<span className="text-xl p-2">{processFlashcards(row.original).length}</span>)
    },
    {
      Header: 'Due',
      id:'cardsDue',
      accessor: 'flashcards', // accessor is the "key" in the data
      Cell: ({row}) => (<span onClick={() => console.log(row.original)} className="text-xl p-2">{(processFlashcards(row.original).filter((flashcard) => flashcard.dueDate <= new Date().toJSON())).length}</span>)
    },
    
    {
      id: 'deleteDeck',
      accessor:'deckId',
      Cell: ({value}) => (<button className="w-32 uppercase text-lg font-semibold" onClick={
        () => onClickDeleteDeck(value)}>
      Delete</button>)
    },
  ]
  
  return (
    <Router>
      <>
      {error && console.log(error)}
        <Header isAuthenticated={isAuthenticated} isLoading={isLoading}/>
        {!isPending && <nav className="border-b-2 border-bookBlue flex justify-evenly p-2 bg-white   text-2xl ">
            <NavLink className="hover:text-viola-600" activeClassName="font-semibold" to="/home"><svg className="w-6 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
</svg>Home</NavLink>
            <NavLink className="hover:text-viola-600" activeClassName="font-semibold" to="/decks/add"><svg className="w-6 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>Create new deck</NavLink>
            <NavLink className="hover:text-viola-600" activeClassName="font-semibold" to="/decks/change"><svg className="w-6 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
</svg>Change deck</NavLink>
            <NavLink className="hover:text-viola-600" activeClassName="font-semibold" to="/User/Settings"><svg className="w-6 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
</svg>User settings</NavLink>
        </nav>}

        <main className='flex-grow px-16 py-6 bg-gray-100'>

          {/* Initial redirects */}
          {!isLoading ?
             <Route path="/" exact>
              <>
                {!isAuthenticated ? <Redirect to="/welcome" />
                  : !isPending ? <Redirect to="/home" />
                  : <button type="button" className="bg-rose-600" disabled><svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"></svg>Loading ... </button>}
              </>
              </Route>: <button type="button" className="bg-rose-600" disabled><svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"></svg>jesus Loading</button>}

            {/* Welcome page */}
            <Route path="/welcome">
              <Welcome/>
            </Route>

            {/* home page */}
            <Route path="/home">
              {currentDeck ? <>
                {showAddCards && <AddCards startingEase={userProfile.startingEase} cardsInDeck={[]} currentDeck={currentDeck} setCurrentDeck={setCurrentDeck} setShowAddCards={setShowAddCards} newDeck={true}/>}
                <DeckSection setUpdatedUserProfile={setUpdatedUserProfile} userId = {userProfile.userId} defaultDeckId={userProfile.defaultDeckId} currentDeck={currentDeck} decks={decks} setDecks={setDecks} setCurrentDeck={setCurrentDeck} userProfile={userProfile} startingEase={userProfile.startingEase}/>
                {
                  <div className="flex justify-center text-4xl">
                    <div className=" p-4 w-1/2 flex justify-center text-center">
                      <Link className="h-12 w-40 btn text-8xl transition-colors duration-150 bg-puertoRico-300 border focus:shadow-outline hover:bg-puertoRico-100" to ="/flashcards">Start</Link>
                    </div>
                  </div>}
              </>: isAuthenticated ? <div className="flex justify-center"><h1 className="text-2xl">No decks, create one to get started!</h1></div> : null}
            </Route>
            
            {/* User settings */}
            <Route path="/User/Settings">
              {userProfile && userProfile.decks ? <ChangeUserSettings userProfile={userProfile} setUpdatedUserProfile={setUpdatedUserProfile} /> : null}
            </Route>
            
            {/* Add deck */}
              {isAuthenticated && userProfile ?
                <Route path="/decks/add">
                  <>
                  <div className="m-6 w-full flex justify-center bg-white border-2 border-bookBlue shadow-xl rounded-md">
                  <div className="border m-4 rounded-md shadow-xl">
                    <div className="flex justify-between px-6 pt-4 bg-bookBlue rounded-t-lg">
                      <h1 className="text-center text-2xl text-white">New</h1>
                    </div>
                    <div className="border border-bookBlue">
                    {!showAddCards ? <DeckForm processDeck={addDeck}/> : <Redirect to="/home" exact/>}
                    </div>
                  </div>
                  </div>
                  </>
                </Route>
                : null
              }

            {/* Manage decks */}
            <Route path="/decks/change">
                <section className="border-2 border-bookBlue rounded-md bg-white mx-80">
                {decks && currentDeck ? <>
                <header className="flex justify-between p-2 mx-8">
                    <Link className="btn border-2 border-terraCotta-500 bg-gray-100" to="/home">Back</Link>
                </header>
                <div className="flex justify-center">
                  <div className="m-6 w-3/4 bg-bookBlue shadow-xl rounded-md">
                    <div className="flex justify-between px-6 pt-4">
                        <h2 className="text-2xl text-white">Change deck</h2>
                    </div>
                  <div className="flex justify-center bg-white overflow-scrollborder border-2 border-bookBlue scrollbar-thin scrollbar-thumb-bookBlue scrollbar-track-gray-100 overflow-y-scroll">
                    <Table columns={decksColumns} data={decks} />
                  </div>
                  </div>
                  </div>
                  </>:<div className="flex justify-center"><h1 className="text-lg">You don't have any decks yet</h1></div>}
                  </section>
            </Route>



            <Route path="/Flashcards">
                  {currentDeck &&
                    <>
                      <Flashcards userProfile={userProfile} currentDeck={currentDeck} setCurrentDeck={setCurrentDeck}/>
                    </>
                  }

            </Route>
            <Route path="/About">
              <About />
            </Route>
            

        </main>

        <Footer className="flex justify-center border-t-4 border-white bg-bookBlue p-6"/>
      </>
    </Router>
  );
}

export default App;
