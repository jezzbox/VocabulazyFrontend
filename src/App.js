import { useState, useEffect } from 'react'
import Header from './components/Header/Header'
import { useAuth0 } from "@auth0/auth0-react";
import Welcome from './components/Welcome'
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
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [showAddFlashcards, setShowAddFlashcards] = useState(false)
  const [showEditDeck, setShowEditDeck] = useState(false)
  const [currentFlashcards, setCurrentFlashcards] = useState([])
  const [showStartButton, setShowStartButton] = useState(true)
  const [showChangeDeck, setShowChangeDeck] = useState(false)
  const [showAddDeck, setShowAddDeck] = useState(false)

 useEffect(() => {
   if(showAddDeck) {
     setShowChangeDeck(false)
     setShowEditDeck(false)
     setShowAddFlashcards(false)
   }
 },[showAddDeck])

 useEffect(() => {
  if(showChangeDeck) {
    setShowAddDeck(false)
    setShowEditDeck(false)
    setShowAddFlashcards(false)
  }
},[showChangeDeck])

useEffect(() => {
  if(showAddFlashcards) {
    setShowAddDeck(false)
    setShowChangeDeck(false)
    setShowEditDeck(false)
  }
},[showAddFlashcards])

useEffect(() => {
  if(showEditDeck) {
    setShowAddDeck(false)
    setShowChangeDeck(false)
    setShowAddFlashcards(false)
    
  }
},[showEditDeck])

  // //change current deck if decks changes
  // useEffect(() => {
  //   if(decks) {
  //     setCurrentDeck([])
  //   }
  // },[decks])
  


  //google-oauth2|109641767784145272988
  // fetch decks

  const onClickHome = () => {
    setShowEditDeck(false)
    setShowAddDeck(false)
    setShowChangeDeck(false)
    setShowAddFlashcards(false)

  }

  return (
    <>
      <Header isAuthenticated={userProfile ? true:false} />
      {!isPending && <nav className="deck-Navbar">
        <ul className = "deck-menu">
          <li onClick={() => onClickHome()}>Home</li>
          <li onClick={() => setShowAddDeck(true)}>Create new deck</li>
          <li onClick={() => setShowChangeDeck(true)}>Change deck</li>
          <li>User settings</li>
        </ul>
      </nav>}

      {isLoading && <div className="center"><h1>Loading ... </h1></div>}

      <main className='main'>
        <article>
          {/* Welcome Screen if not logged in */}
          {!isLoading && <Welcome isAuthenticated={isAuthenticated} />}

          {/* Deck section */}
          {userProfile && userProfile.decks && <DeckSection userProfile={userProfile} showEditDeck={showEditDeck} showAddFlashcards={showAddFlashcards} setShowEditDeck={setShowEditDeck} setShowAddFlashcards={setShowAddFlashcards} setShowChangeDeck={setShowChangeDeck} showChangeDeck={showChangeDeck} showAddDeck={showAddDeck} setShowAddDeck={setShowAddDeck}/>}

          {isAuthenticated &&
          <div className="container">
          
          {showStartButton && !showAddFlashcards && !showEditDeck && !showChangeDeck && !showAddDeck &&
            <div>
              <div className="center">
                <Button className="btn start" text="Start" color="green" onClick={() => setShowFlashcards(true)} />
              </div>
            </div>}
          
          {currentFlashcards && showFlashcards &&
            <>
              <Flashcards wordTypes={WordTypes} isFinished={isFinished} setIsFinished={setIsFinished} hideFlashcards={() => setShowFlashcards(false)} currentFlashcards={currentFlashcards}/>
            </>
          }

        </div>}
        </article>
        </main>
        <footer>This is the footer</footer>
    </>
  );
}

export default App;
