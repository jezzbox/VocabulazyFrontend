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
//import Flashcards from './components/Flashcards'
import AddFlashcards from './components/Decks/AddFlashcards';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [toggleNavMenu, setToggleNavMenu] = useState(false);
  const [showAddVerbs, setShowAddVerbs] = useState(false)
  const [showAddDeck, setShowAddDeck] = useState(false)
  const [showChangeDeck, setShowChangeDeck] = useState(false)
  const [decks, setDecks] = useState([]);
  const [currentDeck, setCurrentDeck] = useState([]);
  const [verbs, setVerbs] = useState([]);
  const [verbFlashcards, setVerbFlashcards] = useState([])
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [userProfile, setUserProfile] = useState([])
  const [showAddFlashcards, setShowAddFlashcards] = useState(false)
  const [flashcards, setFlashcards] = useState([])

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
    const url = `https://localhost:44386/api/Vocabulazy/userprofiles?authIdentifier=${authIdentifier}`
    const res = await fetch(url)
    const data = await res.json()
    return data
  }
  const addUserProfile = async (newUser) => {
    const res = await fetch('https://localhost:44386/api/Vocabulazy/userprofiles', {
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
        const currentFlashcards = await fetchCurrentFlashcards(deckId)
        setFlashcards(currentFlashcards)
      }

      getFlashcards(currentDeck.deckId)
    }
  }, [currentDeck, isFinished])

useEffect(() => {
  console.log(flashcards)
},[flashcards])
  

  //google-oauth2|109641767784145272988
  // fetch decks
  const fetchDecks = async (userId) => {
    const url = `https://localhost:44386/api/Vocabulazy/decks?userId=${userId}`
    const res = await fetch(url)
    const data = await res.json()
    return data
  }

  const fetchCurrentFlashcards = async (deckId) => {
    const url = `https://localhost:44386/api/Vocabulazy/currentflashcards?deckId=${deckId}`
    const res = await fetch(url)
    const data = await res.json()
    return data
  }

  // // fetch flashcards
  // const fetchFlashcards = async (wordType, deckId) => {
  //   const url = `https://localhost:44386/api/Vocabulazy/${wordType}Flashcards?deckId=${deckId}`
  //   const res = await fetch(url)
  //   const data = await res.json()
  //   return data
  //}

  const addVerbFlashcard = async (verbFlashcard) => {
    await fetch('https://localhost:44386/api/Vocabulazy/verbFlashcards', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(verbFlashcard)

    })

  };

  const deleteVerbFlashcard = async (verb) => {
    await fetch(`https://localhost:44386/api/Vocabulazy/verbFlashcards/${verb.verbFlashcardId}`, {
      method: 'DELETE',
    })
  };


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
          {showAddDeck && <AddDeck userProfile={userProfile} setDecks={setDecks} decks={decks} setCurrentDeck={setCurrentDeck} setFlashcards={setVerbFlashcards} setShowAddDeck={setShowAddDeck} setShowAddVerbs={setShowAddVerbs} showAddVerbs={showAddVerbs} />}
        </div>
        {!currentDeck && isAuthenticated && !isLoading && !showAddDeck ? <h1>No decks yet, create one to get started!</h1> : null}
        {currentDeck && showChangeDeck && <Decks decks={decks} isLoading={isLoading} isAuthenticated={isAuthenticated} setCurrentDeck={setCurrentDeck} currentDeck={currentDeck} />}
        {isAuthenticated && currentDeck && !showAddFlashcards && <Deck showFlashcards={() => setShowFlashcards(true)} deck={currentDeck} setCurrentDeck={setCurrentDeck} verbs={verbs} verbFlashcards={verbFlashcards} showAddFlashcards={showAddFlashcards} setShowAddFlashcards={setShowAddFlashcards} />}

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
        {/* {verbFlashcards && showFlashcards && <Flashcards isFinished={isFinished} setIsFinished={setIsFinished} hideFlashcards={() => setShowFlashcards(false)} verbFlashcards={verbFlashcards} fetchVerbFlashcards={fetchVerbFlashcards} currentDeck={currentDeck} setVerbFlashcards={setVerbFlashcards} />} */}

      </div>
      <div className="add-flashcards-container">
        {!showFlashcards && showAddFlashcards && <AddFlashcards setCurrentFlashcards={setFlashcards} currentFlashcards={flashcards} hideAddFlashcards={() => setShowAddFlashcards(false)} />}
      </div>
    </>
  );
}

export default App;
