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
  const [deckVerbs, setDeckVerbs] = useState([])
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [flashcard, setFlashcard] = useState(null)
  const [flashcardNumber, setFlashcardNumber] = useState(0)

  useEffect(() => {
    if (!isLoading & isAuthenticated) {
      const getUserUrl = async () => {
        const userUrlFromServer = user.sub
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

  useEffect(() => {
    if (currentDeck) {
      const getDeckVerbs = async () => {
        const DeckVerbsFromServer = await fetchDeckVerbs(currentDeck.deckId)
        if(DeckVerbsFromServer == null) {
          setDeckVerbs([])
        }
        else {
          shuffleArray(DeckVerbsFromServer)
          setDeckVerbs(DeckVerbsFromServer)
        }
        
      }

      getDeckVerbs()
    }
  }, [currentDeck])

  useEffect(() => {
    if(deckVerbs.length > 0 && deckVerbs.length > flashcardNumber) {
      const getFlashcard = async (deckVerb) => {
        const phraseFromServer = await fetchPhrase(deckVerb.verbId)
        const verb = deckVerb.verb
        const verbId = deckVerb.verbId
        if(phraseFromServer == null) {
          const phrase = "no phrase available for this verb yet"
          const phraseId = "phraseFromServer.phraseId"
          const flashcard = { phrase, verb, verbId, phraseId }
          setFlashcard(flashcard)
        }
        else {
          const phrase = phraseFromServer.phrase
          const phraseId = phraseFromServer.phraseId
          const flashcard = { phrase, verb, verbId, phraseId }
          setFlashcard(flashcard)
        }
    }
    getFlashcard(deckVerbs[flashcardNumber])
  }},[deckVerbs, flashcardNumber])

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

  
  //google-oauth2|109641767784145272988
  // fetch decks
  const fetchDecks = async (userUrl) => {
    const url = `https://localhost:44386/api/Vocabulazy/decks?userId=${userUrl}`
    const res = await fetch(url)
    const data = await res.json()
    return data
  }

  const fetchVerbs = async () => {
    const url = `https://localhost:44386/api/Vocabulazy/verbs`
    const res = await fetch(url)
    const data = await res.json()
    return data
  }

  const fetchDeckVerbs = async (deckId) => {
    const url = `https://localhost:44386/api/Vocabulazy/deckVerbs?deckId=${deckId}`
    const res = await fetch(url)
    const data = await res.json()
    return data
  }

  const fetchPhrase = async (verbId) => {
    const url = `https://localhost:44386/api/Vocabulazy/phrases?verbId=${verbId}`
    const res = await fetch(url)
    const data = await res.json()
    const phrase = data[Math.floor(Math.random() * data.length)];
    
    return phrase
  }



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
    setDeckVerbs([])
    alert(`Deck ${data.deckName} created! now add some verbs.`)
    setShowAddVerbs(true)
    setShowAddDeck(false)

  }

  const addDeckVerb = async (deckVerb) => {
    await fetch('https://localhost:44386/api/Vocabulazy/deckverbs', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(deckVerb)

    })

    // const data = await res.json()
    // setDeckVerbs([...deckVerbs, data])

  };

  const deleteDeckVerb = async (verb) => {
    await fetch(`https://localhost:44386/api/Vocabulazy/deckverbs/${verb.deckVerbId}`, {
      method: 'DELETE',
    })
    // setDeckVerbs(deckVerbs.filter((deckVerb) => deckVerb.deckVerbId !== verb.deckVerbId))

  };


  const updateDeckVerbs = async (deckId) => {
    const deckVerbsFromServer = await fetchDeckVerbs(deckId)
    const verbsToAdd = deckVerbs.filter((verb) => !deckVerbsFromServer.some(x => x.verbId === verb.verbId))
    const verbsToRemove = deckVerbsFromServer.filter((verb) => !deckVerbs.some(x => x.verbId === verb.verbId))
    verbsToAdd.forEach(verb => {
      const deckVerb = { verbId: verb.verbId, deckId: deckId }
      addDeckVerb(deckVerb)
    })
    verbsToRemove.forEach(verb => {
      deleteDeckVerb(verb)
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
        {isAuthenticated && currentDeck && !showAddVerbs && <Deck showFlashcards = {() => setShowFlashcards(true)} deck={currentDeck} setCurrentDeck={setCurrentDeck} verbs={verbs} deckVerbs={deckVerbs} showAddVerbs={showAddVerbs} setShowAddVerbs={setShowAddVerbs} />}
        {deckVerbs && showAddVerbs && <AddVerbs updateDeckVerbs={updateDeckVerbs} verbs={verbs} deckVerbs={deckVerbs} setDeckVerbs={setDeckVerbs} deckId={currentDeck.deckId} deckName={currentDeck.deckName} setShowAddVerbs={setShowAddVerbs} />}
        {currentDeck && showFlashcards && <Flashcards setFlashcard={setFlashcard} hideFlashcards = {() => setShowFlashcards(false)} deckVerbs = {deckVerbs} flashcard={flashcard} flashcardNumber={flashcardNumber} setFlashcardNumber={setFlashcardNumber} />}

      </div>
    </>
  );
}

export default App;
