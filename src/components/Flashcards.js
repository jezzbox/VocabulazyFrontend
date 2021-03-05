import React from 'react'
import Flashcard from './Flashcard'
import Button from './Button'
import { useState, useEffect } from 'react'

const Flashcards = ({ verbFlashcards, hideFlashcards }) => {
    const [deckFinished, setDeckFinished] = useState(false)
    const [showVerb, setShowVerb] = useState(false)
    const [flashcard, setFlashcard] = useState(null)
    const [flashcardNumber, setFlashcardNumber] = useState(0)
    const [todaysCards, setTodaysCards] = useState([])

    useEffect(() => {
        const currentTime = (new Date()).toJSON();

        const getReviewCards = () => {
            const reviewCards = verbFlashcards.filter(verbFlashcard => verbFlashcard.dueDate <= currentTime | verbFlashcard.phase !== "New")
            const sortedReviewCards = sortByDueDate(reviewCards)
            return sortedReviewCards.slice(0, 200);
        }

        const getNewCards = (reviewCardsLength) => {
            const newCards = verbFlashcards.filter(verbFlashcard => verbFlashcard.phase === "New")
            const sortedNewCards = sortByDueDate(newCards)
            reviewCardsLength > 0 && sortedNewCards.filter(newCard => newCard.dueDate <= currentTime)
            return sortedNewCards.slice(0, 20);
        }

        const reviewCards = getReviewCards()
        const newCards = getNewCards(reviewCards.length)
        const allCards = [...reviewCards, ...newCards]
        setTodaysCards(allCards)
    }, [verbFlashcards])

    const sortByDueDate = (cards) => {
        return cards.sort((a, b) => b.DueDate - a.DueDate)
    }



    useEffect(() => {
        if (todaysCards.length > 0 && todaysCards.length > flashcardNumber) {
            const getFlashcard = async (verbFlashcard) => {
                const phraseFromServer = await fetchPhrase(verbFlashcard.verbId)
                const learningStep = verbFlashcard.learningStep
                const phase = verbFlashcard.phase
                const ease = verbFlashcard.ease
                const interval = verbFlashcard.interval
                const verbFlashcardId = verbFlashcard.verbFlashcardId
                const verb = verbFlashcard.verb
                const verbId = verbFlashcard.verbId
                if (phraseFromServer == null) {
                    const phrase = "no phrase available for this verb yet"
                    const phraseId = "phraseFromServer.phraseId"
                    const flashcard = { verbFlashcardId, phrase, verb, verbId, phraseId, phase, ease, interval, learningStep }
                    setFlashcard(flashcard)
                }
                else {
                    const phrase = phraseFromServer.phrase
                    const phraseId = phraseFromServer.phraseId
                    const flashcard = { verbFlashcardId, phrase, verb, verbId, phraseId, phase, ease, interval, learningStep }
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

    const onClick = async () => {

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
        if (flashcard.phase === "Graduated") {
            const newEase = flashcard.ease - 20
            const newDueDate = getNewDueDate(10)
            const updateData = { learningStep: 10, interval: 1 * 24 * 60, phase: "Learning", ease: newEase, dueDate: newDueDate }

            updateVerbFlashcard(flashcard.verbFlashcardId, updateData)

        }
        else {
            const newDueDate = getNewDueDate(1)
            const updateData = { learningStep: 1, dueDate: newDueDate }
            if (flashcard.phase === "New") {
                updateData.phase = "Learning"
            }
            updateVerbFlashcard(flashcard.verbFlashcardId, updateData)
        }
        onClick()
    }

    const onClickHard = async () => {
        if (flashcard.phase === "Graduated") {
            const newInterval = flashcard.interval * 1.2
            const newEase = flashcard.ease - 15
            const newDueDate = getNewDueDate(newInterval)
            const updateData = { interval: newInterval, ease: newEase, dueDate: newDueDate }

            updateVerbFlashcard(flashcard.verbFlashcardId, updateData)
            onClick()
        }
    }

    const onClickGood = async () => {
        if (flashcard.phase === "Graduated") {
            const newInterval = flashcard.interval * flashcard.ease
            const newDueDate = getNewDueDate(newInterval)
            const updateData = { interval: newInterval, dueDate: newDueDate }

            updateVerbFlashcard(flashcard.verbFlashcardId, updateData)
        }

        else {
            if (flashcard.learningStep === 1) {

                const newLearningStep = 10
                const newInterval = 10
                const newDueDate = getNewDueDate(10)
                const newPhase = "Learning"
                const updateData = { phase: newPhase, learningStep: newLearningStep, interval: newInterval, dueDate: newDueDate }

                updateVerbFlashcard(flashcard.verbFlashcardId, updateData)



            }

            if ((flashcard.learningStep === 10)) {
                const newPhase = "Graduated"
                const newInterval = 1 * 24 * 60
                const newDueDate = getNewDueDate(newInterval)
                const updateData = { learningStep: null, interval: newInterval, phase: newPhase, dueDate: newDueDate }

                updateVerbFlashcard(flashcard.verbFlashcardId, updateData)

            }
        }
        onClick()
    }

    const onClickEasy = async () => {
        if (flashcard.phase === "Graduated") {
            const newEase = flashcard.ease + 15
            const newInterval = flashcard.interval * flashcard.ease * 1.3
            const newDueDate = getNewDueDate(newInterval)
            const updateData = { interval: newInterval, ease: newEase, dueDate: newDueDate }

            updateVerbFlashcard(flashcard.verbFlashcardId, updateData)

        }
        else {
            const newPhase = "Graduated"
            const newInterval = 4 * 24 * 60
            const newDueDate = getNewDueDate(newInterval)

            const updateData = { learningStep: null, interval: newInterval, phase: newPhase, dueDate: newDueDate }

            updateVerbFlashcard(flashcard.verbFlashcardId, updateData)

        }
        onClick()


    }

    const getNewDueDate = (interval) => {
        const currentTime = new Date()
        const dueDate = (new Date(currentTime.setMinutes(currentTime.getMinutes() + interval))).toJSON()
        return dueDate;
    }





    // const onClickEasy = async () => {
    //     if(flashcard.phase === "Graduated") {
    //         console.log("set ease + 15")
    //         console.log("set interval = current interval x current ease x easy bonus (130%)")
    //         console.log("set due date = now + new interval")
    //     }
    //     else {
    //         console.log("set phase = graduated")
    //         console.log("set interval = 4 days")
    //         console.log("set duedate = now + interval")
    //     }


    // }

    const updateVerbFlashcard = async (verbFlashcardId, updateData) => {

        const patchData = []

        for (const [key, value] of Object.entries(updateData)) {
            patchData.push({ "op": "replace", "path": "/" + key, "value": value })

        }

        await fetch(`https://localhost:44386/api/Vocabulazy/verbflashcards/${verbFlashcardId}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(patchData)

        })
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
                    <h2>Come back tomorrow for more flashcards</h2>
                    <Button text="Close" onClick={hideFlashcards} />
                </div>}
        </>
    )
}

export default Flashcards
