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
import ChangeUserSettings from './components/ChangeUserSettings';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const[updatedUserProfile, setUpdatedUserProfile] = useState(null)
  const { data:userProfile, isPending, error } = useFetch(`users?authIdentifier=`,updatedUserProfile,"user")
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [showAddFlashcards, setShowAddFlashcards] = useState(false)
  const [showEditDeck, setShowEditDeck] = useState(false)
  const [currentFlashcards, setCurrentFlashcards] = useState([])
  const [showStartButton, setShowStartButton] = useState(true)
  const [showChangeDeck, setShowChangeDeck] = useState(false)
  const [showAddDeck, setShowAddDeck] = useState(false)
  const [showChangeUserProfile, setShowChangeUserProfile] = useState(false)
  const [showCurrentDeck, setShowCurrentDeck] = useState(true)

  useEffect(() => {
    if(userProfile) {
      setUpdatedUserProfile(null)
    }
  },[userProfile])


  // //change current deck if decks changes
  // useEffect(() => {
  //   if(decks) {
  //     setCurrentDeck([])
  //   }
  // },[decks])
  


  //google-oauth2|109641767784145272988
  // fetch decks

  const onClickNavbarItem = ({changeUserProfile=false,currentDeck=false,addDeck=false, changeDeck=false,addFlashcards=false,editDeck=false, startButton=false  }) => {
    console.log("do we make it herE?")
    setShowStartButton(startButton)
    setShowChangeUserProfile(changeUserProfile)
    setShowCurrentDeck(currentDeck)
    setShowAddDeck(addDeck)
    setShowChangeDeck(changeDeck)
    setShowAddFlashcards(addFlashcards)
    setShowEditDeck(editDeck)

  }

  return (
    <>
      <Header isAuthenticated={userProfile ? true:false} />
      {!isPending && <nav className="deck-Navbar">
        <ul className = "deck-menu">
          <li onClick={() => onClickNavbarItem({currentDeck:true, startButton:true})}>Home</li>
          <li onClick={() => onClickNavbarItem({currentDeck:true,addDeck:true})}>Create new deck</li>
          <li onClick={() => onClickNavbarItem({currentDeck:true,changeDeck:true})}>Change deck</li>
          <li onClick={() => onClickNavbarItem({changeUserProfile:true})}>User settings</li>
        </ul>
      </nav>}

      {isLoading || isPending ? <div className="center"><h1>Loading ... </h1></div> : null}

      <main className='main'>
        <article>
          {/* Welcome Screen if not logged in */}
          {showCurrentDeck && !isLoading && <Welcome isAuthenticated={isAuthenticated} userProfile={userProfile} />}

          {/* Deck section */}
          {showCurrentDeck && userProfile && userProfile.decks && <DeckSection userProfile={userProfile} showEditDeck={showEditDeck} showAddFlashcards={showAddFlashcards} setShowEditDeck={setShowEditDeck} setShowAddFlashcards={setShowAddFlashcards} setShowChangeDeck={setShowChangeDeck} showChangeDeck={showChangeDeck} showAddDeck={showAddDeck} setShowAddDeck={setShowAddDeck}/>}

          {/*change user settings form */}
          {userProfile && userProfile.decks && showChangeUserProfile && <ChangeUserSettings userProfile={userProfile} setUpdatedUserProfile={setUpdatedUserProfile}/>}

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
