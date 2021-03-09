import { useState, useEffect } from 'react'
import Header from './components/Header'
import { useAuth0 } from "@auth0/auth0-react";
import Welcome from './components/Welcome'
import Navbar from './components/Navbar/Navbar'
import Decks from './components/Decks/Decks';
import Deck from './components/Decks/Deck';
//import AddVerbs from './components/Decks/AddVerbs'
import Button from './components/Button'
import AddDeck from './components/Decks/AddDeck'
import Flashcards from './components/Flashcards'
import AddFlashcards from './components/Decks/AddFlashcards';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [toggleNavMenu, setToggleNavMenu] = useState(false);
  const [showAddVerbs, setShowAddVerbs] = useState(false)
  const [showAddDeck, setShowAddDeck] = useState(false)
  const [showChangeDeck, setShowChangeDeck] = useState(false)
  const [decks, setDecks] = useState([]);
  const [currentDeck, setCurrentDeck] = useState([]);
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [userProfile, setUserProfile] = useState([])
  const [showAddFlashcards, setShowAddFlashcards] = useState(false)
  const [currentFlashcards, setCurrentFlashcards] = useState([])

  const wordTypes = {
    Verb: { id:"verbId"},
    Adjective: { id:"adjectiveId"},
    Adverb: { id:"adverbId"},
    Noun:{ id:"nounId"},
    Preposition:{ id:"prepositionId"},
    Pronoun: {id:"pronounId"},
    Conjunction:{ id:"conjunctionId"},
    Article: { id:"articleId"}
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

        }

        else if (decksFromServer[0]) {
          const defaultDeck = decksFromServer[0]
          console.log("Doesnt have default deck")
          console.log(defaultDeck)
          setCurrentDeck(defaultDeck)
          setDecks(decksFromServer)
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
  }, [currentDeck, isFinished])


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

  // const updateVerbFlashcards = async (deckId) => {
  //   const verbFlashcardsFromServer = await fetchVerbFlashcards(deckId)
  //   const verbsToAdd = verbFlashcards.filter((verb) => !verbFlashcardsFromServer.some(x => x.verbId === verb.verbId))
  //   const verbsToRemove = verbFlashcardsFromServer.filter((verb) => !verbFlashcards.some(x => x.verbId === verb.verbId))

  //   verbsToAdd.forEach(verb => {
  //     const newVerbFlashcard = { verbId: verb.verbId, deckId: deckId }
  //     addVerbFlashcard(newVerbFlashcard)
  //   })
  //   verbsToRemove.forEach(verb => {
  //     deleteVerbFlashcard(verb)
  //   })
  // }


  return (
    <>
      <Navbar onToggleNavMenu={() => setToggleNavMenu(!toggleNavMenu)} toggleNavMenu={toggleNavMenu} />
      <div className="container">
        {!isLoading && <Header title="Welcome to Vocabulazy!" isAuthenticated={isAuthenticated} user={user} />}
        {!isLoading && <Welcome isAuthenticated={isAuthenticated} />}
        <div>
          {showAddDeck && <AddDeck userProfile={userProfile} setDecks={setDecks} decks={decks} setCurrentDeck={setCurrentDeck} setShowAddDeck={setShowAddDeck} setShowAddVerbs={setShowAddVerbs} showAddVerbs={showAddVerbs} setCurrentFlashcards={setCurrentFlashcards} />}
        </div>
        {!currentDeck && isAuthenticated && !isLoading && !showAddDeck ? <h1>No decks yet, create one to get started!</h1> : null}
        {currentDeck && showChangeDeck && <Decks decks={decks} isLoading={isLoading} isAuthenticated={isAuthenticated} setCurrentDeck={setCurrentDeck} currentDeck={currentDeck} />}
        {isAuthenticated && currentDeck && !showAddFlashcards && <Deck showFlashcards={() => setShowFlashcards(true)} currentDeck={currentDeck} setCurrentDeck={setCurrentDeck} currentFlashcards={currentFlashcards} showAddFlashcards={showAddFlashcards} setShowAddFlashcards={setShowAddFlashcards} />}

        {isAuthenticated && !showAddFlashcards && <div>
          <div className="center">
            <Button className="btn start" text="Start" color="green" />
          </div>

          <div className="center">
            {!showAddDeck && currentDeck && <Button text={showChangeDeck ? "Hide" : "Change Deck"} color={showChangeDeck ? "blueviolet" : "steelblue"} onClick={() => setShowChangeDeck(!showChangeDeck)} />}
            {!showChangeDeck && <Button text={showAddDeck ? "Back" : "Create new Deck"} color={showAddDeck ? "blueviolet" : "grey"} onClick={() => setShowAddDeck(!showAddDeck)} />}
          </div>
        </div>}

        {/* {verbFlashcards && showAddVerbs && <AddVerbs updateVerbFlashcards={updateVerbFlashcards} verbs={verbs} verbFlashcards={verbFlashcards} setVerbFlashcards={setVerbFlashcards} deckId={currentDeck.deckId} deckName={currentDeck.name} setShowAddVerbs={setShowAddVerbs} />} */}
        {currentFlashcards && showFlashcards && <Flashcards  wordTypes={wordTypes} isFinished={isFinished} setIsFinished={setIsFinished} hideFlashcards={() => setShowFlashcards(false)} currentFlashcards={currentFlashcards} currentDeck={currentDeck} />}

      </div>
      <div className="add-flashcards-container">
        {!showFlashcards && showAddFlashcards && <AddFlashcards currentDeck={currentDeck} wordTypes={wordTypes} setCurrentFlashcards={setCurrentFlashcards} currentFlashcards={currentFlashcards} hideAddFlashcards={() => setShowAddFlashcards(false)} deckId={currentDeck.deckId} />}
      </div>
    </>
  );
}

export default App;
