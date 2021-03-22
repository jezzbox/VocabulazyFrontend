import { useState, useEffect } from 'react'
import Header from './components/Header/Header'
import { useAuth0 } from "@auth0/auth0-react";
import Welcome from './components/Welcome'
import Deck from './components/Decks/Deck';
//import AddVerbs from './components/Decks/AddVerbs'
import Button from './components/Button'
import Flashcards from './components/Flashcards'
import AddFlashcards from './components/Decks/AddFlashcards';
import DeckSection from './components/DeckSection/DeckSection'
import WordTypes from './components/WordTypes'
import Word from './components/Decks/Word';
import useFetch from './UseFetch';
import processFlashcards from './ProcessFlashcards'

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const { data:userProfile, isPending, error } = useFetch(`users?authIdentifier=`)
  const [decks, setDecks] = useState([])
  const [currentDeck, setCurrentDeck] = useState([]);
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [showAddFlashcards, setShowAddFlashcards] = useState(false)
  const [currentFlashcards, setCurrentFlashcards] = useState([])
  const [showStartButton, setShowStartButton] = useState(true)



  // //change current deck if decks changes
  // useEffect(() => {
  //   if(decks) {
  //     setCurrentDeck([])
  //   }
  // },[decks])
  


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
      <Header isAuthenticated={userProfile ? true:false} />
      {!isPending && <nav className="deck-Navbar">
        <ul className = "deck-menu">
          <li>Home</li>
          <li>Create new deck</li>
          <li>Change deck</li>
          <li>User settings</li>
        </ul>
      </nav>}

      {isLoading && <div className="center"><h1>Loading ... </h1></div>}

      {<main className='main'>
        <article>
          {!isLoading && <Welcome isAuthenticated={isAuthenticated} />}
          {userProfile && userProfile.decks && <DeckSection userProfile={userProfile}/>}

          {isAuthenticated &&
          <div className="container">
          
          {showStartButton && !showAddFlashcards &&
            <div>
              <div className="center">
                <Button className="btn start" text="Start" color="green" onClick={() => setShowFlashcards(true)} />
              </div>
            </div>}
          
          {currentFlashcards && showFlashcards &&
            <>
              <Flashcards wordTypes={WordTypes} isFinished={isFinished} setIsFinished={setIsFinished} hideFlashcards={() => setShowFlashcards(false)} currentFlashcards={currentFlashcards} currentDeck={currentDeck} />
            </>
          }

        </div>}
        </article>
          
  

      {isAuthenticated && !showFlashcards && showAddFlashcards &&
        <div className="add-flashcards-container">
          {currentDeck.flashcards && <AddFlashcards currentDeck={currentDeck} wordTypes={WordTypes} setCurrentFlashcards={setCurrentFlashcards} currentFlashcards={currentFlashcards} hideAddFlashcards={() => setShowAddFlashcards(false)} deckId={currentDeck.deckId} />}
        </div>}
        </main>}
        <footer>This is the footer</footer>
    </>
  );
}

export default App;
