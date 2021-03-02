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
        setDeckVerbs(DeckVerbsFromServer)
      }

      getDeckVerbs()
    }
  }, [currentDeck])


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
    alert(`Deck ${data.deckName} created! now add some verbs.`)
    setShowAddDeck(false)
    setShowAddVerbs(true)

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
          {!showAddDeck && currentDeck && <Button text={showChangeDeck ? "Hide" : "Change Deck"} color={showChangeDeck ? "steelblue" : "blueviolet"} onClick={() => setShowChangeDeck(!showChangeDeck)} />}
          {!showChangeDeck && <Button text={showAddDeck ? "Back" : "Create new Deck"} color={showAddDeck ? "steelblue" : "blueviolet"} onClick={() => setShowAddDeck(!showAddDeck)} />}
          {showAddDeck && <AddDeck addDeck={addDeck} userUrl={userUrl} />}
        </div>
        {!currentDeck && isAuthenticated && !isLoading && !showAddDeck ? <h1>No decks yet, create one to get started!</h1> : null}
        {currentDeck && showChangeDeck && <Decks decks={decks} isLoading={isLoading} isAuthenticated={isAuthenticated} setCurrentDeck={setCurrentDeck} currentDeck={currentDeck} />}
        {currentDeck && !showAddVerbs && <Deck deck={currentDeck} setCurrentDeck={setCurrentDeck} verbs={verbs} deckVerbs={deckVerbs} showAddVerbs={showAddVerbs} setShowAddVerbs={setShowAddVerbs} />}
        {currentDeck && showAddVerbs && <AddVerbs updateDeckVerbs={updateDeckVerbs} verbs={verbs} deckVerbs={deckVerbs} setDeckVerbs={setDeckVerbs} deckId={currentDeck.deckId} deckName={currentDeck.deckName} setShowAddVerbs={setShowAddVerbs} />}

      </div>
    </>
  );
}

export default App;
