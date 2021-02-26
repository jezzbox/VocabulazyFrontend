import { useState, useEffect } from 'react'
import Header from './components/Header'
import Phrases from './components/Phrases'
function App() {
  const [phrases, setPhrases] = useState([])

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

  return (
    <div className="container">
      <Header />
      <Phrases phrases={phrases} />
    </div>
  );
}

export default App;
