import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Route, NavLink, Redirect } from 'react-router-dom'
import Header from './components/Header/Header'
import { useAuth0 } from "@auth0/auth0-react";
import Welcome from './components/Welcome'
//import AddVerbs from './components/Decks/AddVerbs'
import Button from './components/Button'
import Flashcards from './components/Flashcards'
import DeckSection from './components/DeckSection/DeckSection'
// import WordTypes from './components/WordTypes'
import useFetch from './UseFetch';
import processFlashcards from './ProcessFlashcards'
import ChangeUserSettings from './components/ChangeUserSettings';
import DeckForm from './components/DeckSection/DeckForm'
import fetchData from './FetchData'
import ChangeDeck from './components/DeckSection/ChangeDeck'

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const [updatedUserProfile, setUpdatedUserProfile] = useState(null)
  const { data: userProfile, isPending, error } = useFetch(`users?authIdentifier=`, updatedUserProfile, "user")
  const [decks, setDecks] = useState(null)
  const [currentDeck, setCurrentDeck] = useState(null)
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [isFinished, setIsFinished] = useState(false)


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


  useEffect(() => {
    console.log(userProfile)
  },[userProfile])

  useEffect(() => {
    console.log(isAuthenticated)
  },[isAuthenticated])
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
      {isAuthenticated ? <h1>authenticated</h1> : <h1>not authenticated</h1>}
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
                      <Button className="btn start" text="Start" color="green" onClick={() => setShowFlashcards(true)} />
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
              {decks ? <ChangeDeck decks={decks} currentDeck={currentDeck} setCurrentDeck={setCurrentDeck} deleteDeck={deleteDeck} />: null}
            </Route>



            <Route path="/Flashcards">
              {isAuthenticated &&
                <div className="container">
                  {showFlashcards &&
                    <>
                      <Flashcards isFinished={isFinished} setIsFinished={setIsFinished} hideFlashcards={() => setShowFlashcards(false)}/>
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
