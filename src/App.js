import { useState, useEffect } from 'react'
import Header from './components/Header'
import { useAuth0 } from "@auth0/auth0-react";
import Welcome from './components/Welcome'
import Navbar from './components/Navbar/Navbar'
import Deck from './components/Decks/Deck';
//import AddVerbs from './components/Decks/AddVerbs'
import Button from './components/Button'
import Flashcards from './components/Flashcards'
import AddFlashcards from './components/Decks/AddFlashcards';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [toggleNavMenu, setToggleNavMenu] = useState(false);
  const [decks, setDecks] = useState([]);
  const [currentDeck, setCurrentDeck] = useState([]);
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [userProfile, setUserProfile] = useState([])
  const [showAddFlashcards, setShowAddFlashcards] = useState(false)
  const [currentFlashcards, setCurrentFlashcards] = useState([])
  const [showStartButton, setShowStartButton] = useState(true)

  const wordTypes = {
    Verb: { id: "verbId" },
    Adjective: { id: "adjectiveId" },
    Adverb: { id: "adverbId" },
    Noun: { id: "nounId" },
    Preposition: { id: "prepositionId" },
    Pronoun: { id: "pronounId" },
    Conjunction: { id: "conjunctionId" },
    Article: { id: "articleId" }
  }

  //adds user profile if doesnt exist
  useEffect(() => {
    if (isAuthenticated) {
      const getUserProfile = async () => {
        const authIdentifier = await user.sub
        const userProfileFromServer = await fetchUserProfile(authIdentifier)

        if (userProfileFromServer.status === 404) {
          const newUser = { authIdentifier: authIdentifier, defaultDeckId: null }
          const userProfileFromServer = await addUserProfile(newUser)
          setUserProfile(userProfileFromServer)
        }

        else if (userProfileFromServer.authIdentifier === user.sub) {
          setUserProfile(userProfileFromServer)
        }

        else {
          console.log("Error")
        }
      }
      getUserProfile()

    }
  }, [isAuthenticated, user])

  const fetchUserProfile = async (authIdentifier) => {
    const url = `https://localhost:44386/api/users?authIdentifier=${authIdentifier}`
    const res = await fetch(url)
    const data = await res.json()
    return data
  }

  const addUserProfile = async (newUser) => {
    const res = await fetch('https://localhost:44386/api/users', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(newUser)
    })
    const data = await res.json()
    return data

  }

  //gets users decks (if any) and sets default deck
  useEffect(() => {
    if (userProfile.userId) {
      const getDecks = async () => {
        const decksFromServer = await fetchDecks(userProfile.userId)

        if (userProfile.defaultDeckId) {
          const defaultDeck = decksFromServer.filter(x => x.deckId === userProfile.defaultDeckId)
          console.log("has default deck")
          console.log(defaultDeck)
          setCurrentDeck(defaultDeck)
          setDecks(decksFromServer)
          console.log("dekcs")

        }

        else if (decksFromServer[0]) {
          const defaultDeck = decksFromServer[0]
          console.log("Doesnt have default deck")
          console.log(defaultDeck)
          setCurrentDeck(defaultDeck)
          setDecks(decksFromServer)
          console.log("dekcs")
        }

      }

      getDecks()
    }
  }, [userProfile]
  )

  // Get flashcards for the current selected deck
  useEffect(() => {
    if (currentDeck.deckId) {

      const getFlashcards = async (deckId) => {
        const flashcardsFromServer = await fetchCurrentFlashcards(deckId)
        setCurrentFlashcards(flashcardsFromServer)
      }

      getFlashcards(currentDeck.deckId)
    }
  }, [currentDeck, isFinished, showAddFlashcards])

  //change current deck if decks changes
  useEffect(() => {
    if(decks.length === 0) {
      setCurrentDeck([])
    }
  },[decks])
  


  //google-oauth2|109641767784145272988
  // fetch decks
  const fetchDecks = async (userId) => {
    const url = `https://localhost:44386/api/decks?userId=${userId}`
    const res = await fetch(url)
    const data = await res.json()
    return data
  }

  const fetchCurrentFlashcards = async (deckId) => {
    const url = `https://localhost:44386/api/flashcards?deckId=${deckId}`
    const res = await fetch(url)
    const data = await res.json()
    return data
  }

  return (
    <>
      <Navbar onToggleNavMenu={() => setToggleNavMenu(!toggleNavMenu)} toggleNavMenu={toggleNavMenu} />
      <div className="container">
        <Header title="Welcome to Vocabulazy!" isAuthenticated={isAuthenticated} user={user} />
        <Welcome isAuthenticated={isAuthenticated} />
        {isAuthenticated && !userProfile.userId && <h1>Loading ... </h1>}
      </div>
      {userProfile.userId &&
        <div className="container">
          
          {!currentDeck.deckId ? <h1>No decks yet, create one to get started!</h1> : null}
          {currentDeck && !showAddFlashcards && <Deck setShowStartButton = {setShowStartButton} userProfile = {userProfile} decks={decks} setDecks={setDecks} setCurrentDeck={setCurrentDeck} currentDeck={currentDeck} currentFlashcards={currentFlashcards} showAddFlashcards={showAddFlashcards} setShowAddFlashcards={setShowAddFlashcards} setCurrentFlashcards={setCurrentFlashcards} />}

          {showStartButton && !showAddFlashcards &&
            <div>
              <div className="center">
                <Button className="btn start" text="Start" color="green" onClick={() => setShowFlashcards(true)} />
              </div>
            </div>}

          {currentFlashcards && showFlashcards &&
            <>
              <Flashcards wordTypes={wordTypes} isFinished={isFinished} setIsFinished={setIsFinished} hideFlashcards={() => setShowFlashcards(false)} currentFlashcards={currentFlashcards} currentDeck={currentDeck} />
            </>
          }

        </div>}

      {!isLoading && isAuthenticated && !showFlashcards && showAddFlashcards &&
        <div className="add-flashcards-container">
          <AddFlashcards currentDeck={currentDeck} wordTypes={wordTypes} setCurrentFlashcards={setCurrentFlashcards} currentFlashcards={currentFlashcards} hideAddFlashcards={() => setShowAddFlashcards(false)} deckId={currentDeck.deckId} />
        </div>}
    </>
  );
}

export default App;
