import React from 'react'
import Flashcard from './Flashcard'
import Button from './Button'
import { useState, useEffect } from 'react'

const Flashcards = ({ verbFlashcards, hideFlashcards }) => {
    const [deckFinished, setDeckFinished] = useState(false)
    const [score, setScore] = useState(0)
    const [showVerb, setShowVerb] = useState(false)
    const [flashcard, setFlashcard] = useState(null)
    const [flashcardNumber, setFlashcardNumber] = useState(0)

    useEffect(() => {
        if(verbFlashcards.length > 0 && verbFlashcards.length > flashcardNumber) {
          const getFlashcard = async (verbFlashcard) => {
            const phraseFromServer = await fetchPhrase(verbFlashcard.verbId)
            const verb = verbFlashcard.verb
            const verbId = verbFlashcard.verbId
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
        getFlashcard(verbFlashcards[flashcardNumber])
      }},[verbFlashcards, flashcardNumber])

    

    const fetchPhrase = async (verbId) => {
        const url = `https://localhost:44386/api/Vocabulazy/phrases?verbId=${verbId}`
        const res = await fetch(url)
        const data = await res.json()
        const phrase = data[Math.floor(Math.random() * data.length)];
        
        return phrase
      }

    const onClick = async (cardScore) => {
        setScore(score + cardScore)
        
        if (flashcardNumber + 1 === verbFlashcards.length) {
            setShowVerb(false)
            setDeckFinished(true)
            setFlashcardNumber(0)
            setFlashcard([])
            }
        else {
            setShowVerb(false)
            const nextFlashcardnumber = flashcardNumber + 1
            setFlashcardNumber(nextFlashcardnumber)
        }

    }

    return (
        <>
            {!deckFinished &&
                <div>
                    {flashcard && <Flashcard key={flashcard.verbId} flashcard={flashcard} showVerb={showVerb} />}
                    {!showVerb && <Button text="Show" onClick={() => setShowVerb(true)} />}
                    {showVerb &&
                        <div>
                            <Button text="Again" onClick={() => onClick(-1)} />
                            <Button text="Hard" onClick={() => onClick(1)} />
                            <Button text="Good" onClick={() => onClick(3)} />
                            <Button text="Easy" onClick={() => onClick(5)} />
                        </div>}
                </div>}
            {deckFinished &&
                <div>
                    <h1>Deck finished!</h1>
                    <h2>Score: {score} </h2>
                    <Button text="Close" onClick={hideFlashcards} />
                </div>}
        </>
    )
}

export default Flashcards
