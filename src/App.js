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
        <Header isAuthenticated={userProfile ? true : false} />
        {!isPending && <nav className="deck-Navbar">
          <ul className="deck-menu">
            <li><NavLink activeClassName="nav-link active" className="nav-link" to="/home">Home</NavLink></li>
            <li><NavLink activeClassName="nav-link active" className="nav-link"to="/decks/add">Create new deck</NavLink></li>
            <li><NavLink activeClassName="nav-link active" className="nav-link"to="/decks/change">Change deck</NavLink></li>
            <li><NavLink activeClassName="nav-link active" className="nav-link"to="/User/Settings">User settings</NavLink></li>
          </ul>
        </nav>}

        <main className='main'>
          <article>

          {/* Initial redirects */}
          {!isLoading ?
             <Route path="/" exact>
              <>
                {!isAuthenticated ? <Redirect to="/welcome" />
                  : !isPending ? <Redirect to="/home" />
                  : <h1>Loading ... </h1>}
              </>
              </Route>: <h1>Loading ... </h1>}

            {/* Welcome page */}
            <Route path="/welcome">
              <Welcome/>
            </Route>

            {/* home page */}
            <Route path="/home">
              {currentDeck ? <>
                <DeckSection currentDeck={currentDeck} decks={decks} setDecks={setDecks} setCurrentDeck={setCurrentDeck} userProfile={userProfile}/>
                {
                  <div>
                    <div className="center">
                      <Link className="back-link" to ="/flashcards">Start</Link>
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

          </article>
        </main>
        <footer>This is the footer</footer>
      </>
    </Router>
  );
}

export default App;
