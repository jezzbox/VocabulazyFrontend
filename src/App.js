import { useState, useEffect } from 'react'
import Header from './components/Header'
import Profile from './components/Profile'
import { useAuth0 } from "@auth0/auth0-react";
import Welcome from './components/Welcome'
import Navbar from './components/Navbar/Navbar'
import Decks from './components/Decks';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [toggleNavMenu, setToggleNavMenu] = useState(false);
  //const {data:decks, isPending, Error } = useFetch(`https://localhost:44386/api/Vocabulazy/decks?userId=${userId}`)
  const [userUrl, setUserUrl] = useState(null);
  const [decks, setDecks] = useState([]);

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
      }

      getDecks()
    }
  }, [userUrl]
  )

  //google-oauth2|109641767784145272988
  // fetch decks
  const fetchDecks = async (userUrl) => {
    const url = `https://localhost:44386/api/Vocabulazy/decks?userId=${userUrl}`
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
  }
  return (
    <>
      <Navbar onToggleNavMenu={() => setToggleNavMenu(!toggleNavMenu)} toggleNavMenu={toggleNavMenu} />
      <div className="container">
        {!isLoading && <Header title="Welcome to Vocabulazy!" isAuthenticated={isAuthenticated} user={user} />}
        {!isLoading && <Welcome isAuthenticated={isAuthenticated} />}
        <Profile user={user} isAuthenticated={isAuthenticated} isLoading={isLoading} />
        {isAuthenticated && <Decks userUrl={userUrl} addDeck={addDeck} decks={decks} isAuthenticated={isAuthenticated} isLoading={isLoading} />}
      </div>
    </>
  );
}

export default App;
