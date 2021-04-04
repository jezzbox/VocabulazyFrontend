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
import getDecksData from './Actions/GetDecksData'

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const [updatedUserProfile, setUpdatedUserProfile] = useState(null)
  const { data: userProfile, isPending, error } = useFetch(`users?authIdentifier=`, updatedUserProfile, "user")
  const [decks, setDecks] = useState(null)
  const [currentDeck, setCurrentDeck] = useState(null)


  const getDefaultDeck = useCallback((decks) => {
    const defaultDeck = decks.find(deck => deck.deckId === userProfile.defaultDeckId)

        if(defaultDeck === undefined) {
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

  //google-oauth2|109641767784145272988
  // fetch decks

  return (
    <Router>
      <>
      {console.log(error)}
        <Header isAuthenticated={isAuthenticated} isLoading={isLoading}/>
        {!isPending && <nav className="border-2 border-bookBlue flex justify-evenly p-2 bg-white   text-2xl ">
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

        <main className='px-16 py-6 bg-gray-100'>

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
                <DeckSection currentDeck={currentDeck} decks={decks} setDecks={setDecks} setCurrentDeck={setCurrentDeck} userProfile={userProfile}/>
                {
                  <div className="flex justify-center text-4xl">
                    <div className=" p-4 w-1/2 flex justify-center text-center">
                      <Link className="h-12 w-40 btn text-8xl transition-colors duration-150 bg-puertoRico-300 border focus:shadow-outline hover:bg-puertoRico-100" to ="/flashcards">Start</Link>
                    </div>
                  </div>}
              </>: isAuthenticated ? <h1>No decks, create one to get started</h1> : null}
            </Route>
            
            {/* User settings */}
            <Route path="/User/Settings">
              {userProfile && userProfile.decks ? <ChangeUserSettings userProfile={userProfile} setUpdatedUserProfile={setUpdatedUserProfile} /> : null}
            </Route>
            
            {/* Add deck */}
              {isAuthenticated && userProfile ?
                <Route path="/decks/add">
                  <div className="container blue-border">
                    <DeckForm processDeck={addDeck} headerText="Create new deck:" />
                  </div>
                </Route>
                : null
              }

            {/* Manage decks */}
            <Route path="/decks/change">
              {decks && currentDeck ? 
              <>
              <header>
                    <h4>Change deck:</h4>
              </header>
              <div className="container blue-border">
              {decks.length > 0 ? 
                   <Table className="deck-table" tableData={getDecksData(decks,currentDeck,setCurrentDeck,deleteDeck)} headers={[{ columnName: 'Name', objectProperty: 'select' }, { columnName: "Words", objectProperty: "wordCount" },{ columnName: "Due", objectProperty: "dueCount" }, { objectProperty: "deleteButton" }]} />
                  : <h3>No decks yet, create deck to get started</h3>}
                  <div className="center">
                  <Link className="back-link" to ="/home">Back</Link>
                  </div>
                  </div>
                  </> : null}
            </Route>



            <Route path="/Flashcards">
              {isAuthenticated &&
                <div className="container">
                  {currentDeck &&
                    <>
                      <Flashcards userProfile={userProfile} currentDeck={currentDeck} setCurrentDeck={setCurrentDeck}/>
                    </>
                  }
                </div>}
            </Route>

        </main>
        <footer className="border-t-4 border-white bg-bookBlue">This is the footer</footer>
      </>
    </Router>
  );
}

export default App;
