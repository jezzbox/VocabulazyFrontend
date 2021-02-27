import { useState, useEffect } from 'react'
import Header from './components/Header'
import Profile from './components/Profile'
import Phrases from './components/Phrases'
import { useAuth0 } from "@auth0/auth0-react"
import Welcome from './components/Welcome'
import Navbar from './components/Navbar/Navbar';
function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [phrases, setPhrases] = useState([])
  const [toggleNavMenu, setToggleNavMenu] = useState(false)

  useEffect(() => {
    const getPhrases = async () => {
      const phrasesFromServer = await fetchPhrases()
      setPhrases(phrasesFromServer)
    }
    getPhrases()
  }, [])

  // fetch tasks
  const fetchPhrases = async () => {
    const res = await fetch('https://localhost:44386/api/Vocabulazy/phrases?verb=hablar')
    const data = await res.json()

    return data
  }


  return (<>
  <Navbar onToggleNavMenu={() => setToggleNavMenu(!toggleNavMenu)} toggleNavMenu={toggleNavMenu}/>
    <div className="container">
      <Header title="Welcome to Vocabulazy!" isAuthenticated={isAuthenticated} isLoading={isLoading} />
      <Welcome isAuthenticated={isAuthenticated} isLoading={isLoading} />
      <Profile user={user} isAuthenticated={isAuthenticated} isLoading={isLoading} />
      <Phrases phrases={phrases} />
    </div>
    </>
  );
}

export default App;
