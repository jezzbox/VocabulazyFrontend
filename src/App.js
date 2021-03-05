import { useState, useEffect } from 'react'
import Header from './components/Header'
import { useAuth0 } from "@auth0/auth0-react";
import Welcome from './components/Welcome'
import Navbar from './components/Navbar/Navbar'
import Decks from './components/Decks/Decks';
import Deck from './components/Decks/Deck';
import AddVerbs from './components/Decks/AddVerbs'
import Button from './components/Button'
import AddDeck from './components/Decks/AddDeck'
import Flashcards from './components/Flashcards'

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [toggleNavMenu, setToggleNavMenu] = useState(false);
  const [showAddVerbs, setShowAddVerbs] = useState(false)
  const [showAddDeck, setShowAddDeck] = useState(false)
  const [showChangeDeck, setShowChangeDeck] = useState(false)
  const [userUrl, setUserUrl] = useState(null);
  const [decks, setDecks] = useState([]);
  const [currentDeck, setCurrentDeck] = useState([]);
  const [verbs, setVerbs] = useState([]);
  const [verbFlashcards, setVerbFlashcards] = useState([])
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    if (!isLoading & isAuthenticated) {
      const getUserUrl = async () => {
        const userUrlFromServer = await user.sub
        setUserUrl(userUrlFromServer)
      }
      getUserUrl()
    }
  }, [isAuthenticated, isLoading, user]
  )

  useEffect(() => {
    if (userUrl) {
      const getDecks = async () => {
        const DecksFromServer = await fetchDecks(userUrl)
        setDecks(DecksFromServer)
        setCurrentDeck(DecksFromServer.sort((a, b) => b.isDefault - a.isDefault)[0])
      }

      getDecks()
    }
  }, [userUrl]
  )

  useEffect(() => {
    const getVerbs = async () => {
      const VerbsFromServer = await fetchVerbs()
      setVerbs(VerbsFromServer)
    }

    getVerbs()
  }, [])

// Get verb flashcards for the current selected deck
  useEffect(() => {
    if (currentDeck && currentDeck.deckId) {
      const getVerbFlashcards = async () => {
        const verbFlashcardsFromServer = await fetchVerbFlashcards(currentDeck.deckId)
        if (verbFlashcardsFromServer == null) {
          setVerbFlashcards([])
        }
        else {
          setVerbFlashcards(verbFlashcardsFromServer)
        }
      }

      getVerbFlashcards()
    }
  }, [currentDeck, isFinished])




  //google-oauth2|109641767784145272988
  // fetch decks
  const fetchDecks = async (userUrl) => {
    const url = `https://localhost:44386/api/Vocabulazy/decks?userId=${userUrl}`
    const res = await fetch(url)
    const data = await res.json()
    return data
  }

  //fetch verbs
  const fetchVerbs = async () => {
    const url = `https://localhost:44386/api/Vocabulazy/verbs`
    const res = await fetch(url)
    const data = await res.json()
    return data
  }
  // fetch verb flashcards
  const fetchVerbFlashcards = async (deckId) => {
    const url = `https://localhost:44386/api/Vocabulazy/verbFlashcards?deckId=${deckId}`
    const res = await fetch(url)
    const data = await res.json()
    return data
  }




  //add deck
  const addDeck = async (deck) => {
    const res = await fetch('https://localhost:44386/api/Vocabulazy/decks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(deck)
    })

    const data = await res.json()
    setDecks([...decks, data])
    setCurrentDeck(data)
    setVerbFlashcards([])
    alert(`Deck ${data.deckName} created! now add some verbs.`)
    setShowAddVerbs(true)
    setShowAddDeck(false)

  }

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


  const updateVerbFlashcards = async (deckId) => {
    const verbFlashcardsFromServer = await fetchVerbFlashcards(deckId)
    const verbsToAdd = verbFlashcards.filter((verb) => !verbFlashcardsFromServer.some(x => x.verbId === verb.verbId))
    const verbsToRemove = verbFlashcardsFromServer.filter((verb) => !verbFlashcards.some(x => x.verbId === verb.verbId))

    verbsToAdd.forEach(verb => {
      const newVerbFlashcard = { verbId: verb.verbId, deckId: deckId }
      addVerbFlashcard(newVerbFlashcard)
    })
    verbsToRemove.forEach(verb => {
      deleteVerbFlashcard(verb)
    })
  }


  return (
    <>
      <Navbar onToggleNavMenu={() => setToggleNavMenu(!toggleNavMenu)} toggleNavMenu={toggleNavMenu} />
      <div className="container">
        {!isLoading && <Header title="Welcome to Vocabulazy!" isAuthenticated={isAuthenticated} user={user} />}
        {!isLoading && <Welcome isAuthenticated={isAuthenticated} />}
        <div>
          {isAuthenticated && !showAddDeck && currentDeck && <Button text={showChangeDeck ? "Hide" : "Change Deck"} color={showChangeDeck ? "steelblue" : "blueviolet"} onClick={() => setShowChangeDeck(!showChangeDeck)} />}
          {isAuthenticated && !showChangeDeck && <Button text={showAddDeck ? "Back" : "Create new Deck"} color={showAddDeck ? "steelblue" : "blueviolet"} onClick={() => setShowAddDeck(!showAddDeck)} />}
          {showAddDeck && <AddDeck addDeck={addDeck} userUrl={userUrl} />}
        </div>
        {!currentDeck && isAuthenticated && !isLoading && !showAddDeck ? <h1>No decks yet, create one to get started!</h1> : null}
        {currentDeck && showChangeDeck && <Decks decks={decks} isLoading={isLoading} isAuthenticated={isAuthenticated} setCurrentDeck={setCurrentDeck} currentDeck={currentDeck} />}
        {isAuthenticated && currentDeck && !showAddVerbs && <Deck showFlashcards={() => setShowFlashcards(true)} deck={currentDeck} setCurrentDeck={setCurrentDeck} verbs={verbs} verbFlashcards={verbFlashcards} showAddVerbs={showAddVerbs} setShowAddVerbs={setShowAddVerbs} />}
        {verbFlashcards && showAddVerbs && <AddVerbs updateVerbFlashcards={updateVerbFlashcards} verbs={verbs} verbFlashcards={verbFlashcards} setVerbFlashcards={setVerbFlashcards} deckId={currentDeck.deckId} deckName={currentDeck.deckName} setShowAddVerbs={setShowAddVerbs} />}
        {verbFlashcards && showFlashcards && <Flashcards isFinished = {isFinished} setIsFinished={setIsFinished} hideFlashcards={() => setShowFlashcards(false)} verbFlashcards={verbFlashcards} fetchVerbFlashcards={fetchVerbFlashcards} currentDeck={currentDeck} setVerbFlashcards={setVerbFlashcards} />}

      </div>
    </>
  );
}

export default App;
