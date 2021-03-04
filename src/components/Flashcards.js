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
    const [todaysCards, setTodaysCards] = useState([])

    useEffect(() => {
        const currentTime = (new Date()).toJSON();

        const getReviewCards = () => {
            const reviewCards =  verbFlashcards.filter(verbFlashcard => verbFlashcard.dueDate <= currentTime | verbFlashcard.phase !== "New")
            const sortedReviewCards = sortByDueDate(reviewCards)
            return sortedReviewCards.slice(0,200);
            }

        const getNewCards = (reviewCardsLength) => {
            const newCards = verbFlashcards.filter(verbFlashcard => verbFlashcard.phase === "New")
            const sortedNewCards = sortByDueDate(newCards)
            reviewCardsLength > 0 && sortedNewCards.filter(newCard => newCard.dueDate <= currentTime)
            return sortedNewCards.slice(0,20);
            }

        const reviewCards = getReviewCards()
        const newCards = getNewCards(reviewCards.length)
        const allCards = [...reviewCards,...newCards]
        setTodaysCards(allCards)
            }, [verbFlashcards])

    const sortByDueDate = (cards) => {
        return cards.sort((a, b) => b.DueDate - a.DueDate)
    }

    

    useEffect(() => {
        if (todaysCards.length > 0 && todaysCards.length > flashcardNumber) {
            const getFlashcard = async (verbFlashcard) => {
                const phraseFromServer = await fetchPhrase(verbFlashcard.verbId)
                const verb = verbFlashcard.verb
                const verbId = verbFlashcard.verbId
                if (phraseFromServer == null) {
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
            getFlashcard(todaysCards[flashcardNumber])
        }
    }, [todaysCards, flashcardNumber])



    const fetchPhrase = async (verbId) => {
        const url = `https://localhost:44386/api/Vocabulazy/phrases?verbId=${verbId}`
        const res = await fetch(url)
        const data = await res.json()
        const phrase = data[Math.floor(Math.random() * data.length)];

        return phrase
    }

    const onClick = async (cardScore) => {
        setScore(score + cardScore)

        if (flashcardNumber + 1 === todaysCards.length) {
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

    const onClickAgain = async () => {
        if(flashcard.phase === "Graduated") {
            console.log("set interval to 1 day")
            console.log("set phase to learning")
            console.log("set ease - 20")
            console.log("set learning step 10")
            console.log("set due date + 10 mins")
        }
        else {
            console.log("set learning step to 1")
            console.log("set due date + 1 min")
            if(flashcard.phase === "New") {
                console.log("set phase to learning")
            }
        }
    }

    const onClickHard = async () => {
        if(flashcard.phase === "Graduated") {
            console.log("set interval to currentInterval * 1.2")
            console.log("set ease - 15")
            console.log("set due date + new interval")
        }
    }

    const onClickGood = async () => {
        if(flashcard.phase === "Graduated") {
            console.log("set interval = current interval * ease")
            console.log("set due date =  now + new interval")
        }
        else {
            if(flashcard.learningStep === 1) {
                console.log("set learning step = 10")
                console.log("set due date = now + 10 mins")
                
            }

            if((flashcard.learningStep === 10)) {
                console.log("set phase = graduated")
                console.log("set interval = 1 day")
            }
        }
    }

    const onClickEasy = async () => {
        if(flashcard.phase === "Graduated") {
            console.log("set ease + 15")
            console.log("set interval = current interval x current ease x easy bonus (130%)")
            console.log("set due date = now + new interval")
        }
        else {
            console.log("set phase = graduated")
            console.log("set interval = 4 days")
            console.log("set duedate = now + interval")
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
                            <Button text="Again" onClick={() => onClickAgain()} />
                            {flashcard.phase === "Graduated" && <Button text="Hard" onClick={() => onClickHard()} />}
                            <Button text="Good" onClick={() => onClickGood()} />
                            <Button text="Easy" onClick={() => onClickEasy()} />
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
