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
    if(currentDeck) {
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

  }

  const onCreateDeck = () => {
    setShowAddDeck(false)
    setShowAddVerbs(true)
  }
  return (
    <>
      <Navbar onToggleNavMenu={() => setToggleNavMenu(!toggleNavMenu)} toggleNavMenu={toggleNavMenu} />
      <div className="container">
        {!isLoading && <Header title="Welcome to Vocabulazy!" isAuthenticated={isAuthenticated} user={user} />}
        {!isLoading && <Welcome isAuthenticated={isAuthenticated} />}
        <div>
        {!showAddDeck && <Button text={showChangeDeck ? "Hide" : "Change Deck"} color={showChangeDeck ? "steelblue" : "blueviolet"} onClick={() => setShowChangeDeck(!showChangeDeck)}/>}
        {!showChangeDeck && <Button text={showAddDeck ? "Back" : "Create new Deck"} color={showAddDeck ? "steelblue" : "blueviolet"} onClick={() => setShowAddDeck(!showAddDeck)}/>}
        {showAddDeck && <AddDeck addDeck={addDeck} userUrl={userUrl} onCreate={onCreateDeck} />}
        </div>
        {!isLoading && isAuthenticated && showChangeDeck && <Decks decks={decks} isLoading={isLoading} isAuthenticated={isAuthenticated} setCurrentDeck={setCurrentDeck} currentDeck={currentDeck}/> }
        {isAuthenticated && !showAddDeck && !showAddVerbs && <Deck deck={currentDeck} setCurrentDeck={setCurrentDeck} verbs={verbs} deckVerbs={deckVerbs} showAddVerbs={showAddVerbs} setShowAddVerbs={setShowAddVerbs} />}
        {showAddVerbs && <AddVerbs verbs = {verbs} deckVerbs={deckVerbs} deckId={currentDeck.deckId} deckName={currentDeck.deckName} setShowAddVerbs={setShowAddVerbs} />}
        
      </div>
    </>
  );
}

export default App;
