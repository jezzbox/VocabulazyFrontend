import React from 'react'
import Flashcard from './Flashcard'
import Button from './Button'
import { useState } from 'react'

const Flashcards = ({ hideFlashcards, deckVerbs, flashcard, setFlashcardNumber, setFlashcard, flashcardNumber, }) => {

    const [deckFinished, setDeckFinished] = useState(false)
    const [score, setScore] = useState(0)
    const [showVerb, setShowVerb] = useState(false)

    const isLastCard = deckVerbs.length === flashcardNumber + 1 ? true : false

    const onClick = async (cardScore) => {
        setScore(score + cardScore)
        
        if (isLastCard) {
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
                    <Flashcard key={flashcard.verbId} flashcard={flashcard} showVerb={showVerb} />
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
