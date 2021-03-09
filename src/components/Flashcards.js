import React from 'react'
import Flashcard from './Flashcard'
import Button from './Button'
import { useState, useEffect } from 'react'

const Flashcards = ({ isFinished, setIsFinished, hideFlashcards, currentDeck, currentFlashcards, wordTypes }) => {
    const [showVerb, setShowVerb] = useState(false)
    const [flashcard, setFlashcard] = useState([])
    const [todaysCards, setTodaysCards] = useState([])
    const [flashcardNumber, setFlashcardNumber] = useState(0)
    const deckId = currentDeck.deckId

    useEffect(() => {
        console.log("effect is being trigged to get todays cards")
        const getTodaysCards = async () => {

            const reviewCards = currentFlashcards.filter((flashcard) => flashcard.phase === "Graduated" && flashcard.dueDate <= getCutoff("Graduated", 4))
            const learningCards = currentFlashcards.filter((flashcard) => flashcard.phase === "Learning" && flashcard.dueDate <= getCutoff("Learning", 20))
            const getNewCards = async (existReviewCard) => {
                if (existReviewCard) {

                    const newCards = currentFlashcards.filter((flashcard) => flashcard.phase === "New" && flashcard.dueDate <= getCutoff("New", 20))
                    return newCards
                }
                else {
                    const newCards = currentFlashcards.filter((flashcard) => flashcard.phase === "New")
                    return newCards
                }
            }

            const newCards = await getNewCards(reviewCards.length > 0)
            const todaysCardsFromServer = [...reviewCards, ...learningCards, ...newCards]

            setTodaysCards(todaysCardsFromServer)
            console.log("todayscards are: ")
            console.log(todaysCardsFromServer)
        }
        getTodaysCards(deckId)
    }, [deckId, currentFlashcards])

    useEffect(() => {
        if (todaysCards.length > 0) {
            console.log("effect was triggered to get flashcard")
            console.log(todaysCards)

            const getFlashcard = async (currentFlashcard) => {
                const phraseFromServer = await fetchPhrase(currentFlashcard.verbId)
                const flashcard = Object.assign({}, currentFlashcard)
                if (phraseFromServer == null) {
                    flashcard.phrase = "this is the phrase"
                    flashcard.phraseId = null
                }
                else {
                    flashcard.phrase = phraseFromServer.phrase
                    flashcard.phraseId = phraseFromServer.phraseId
                }
                flashcard.flashcardId = flashcard[wordTypes[flashcard.wordType]["id"]]
                setFlashcard(flashcard)
            }
            getFlashcard(todaysCards[flashcardNumber])

        }
    }, [todaysCards, flashcardNumber, wordTypes])

    const getCutoff = (phase, customTime) => {
        const currentTime = new Date()
        if (phase === "New") {
            const learningCutoff = (new Date(currentTime.setMinutes(currentTime.getMinutes() + customTime))).toJSON()
            return learningCutoff
        }
        if (phase === "Learning") {
            const newCutoff = (new Date(currentTime.setMinutes(currentTime.getMinutes() + customTime))).toJSON()
            return newCutoff
        }
        if (phase === "Graduated") {
            const setHours = new Date(currentTime.setHours(customTime))
            const setMinutes = new Date(setHours.setMinutes(0))
            return (new Date(setMinutes)).toJSON()
        }
    }

    const fetchPhrase = async (verbId) => {
        const url = `https://localhost:44386/api/Vocabulazy/phrases?verbId=${verbId}`
        const res = await fetch(url)
        const data = await res.json()
        const phrase = data[Math.floor(Math.random() * data.length)];

        return phrase
    }

    const onClickAgain = async () => {
        console.log("again was clicked")
        if (flashcard.phase === "Graduated") {
            const newEase = flashcard.ease - 20
            const newDueDate = getNewDueDate(10)
            const updateData = { learningStep: 10, interval: 1 * 24 * 60, phase: "Learning", ease: newEase, dueDate: newDueDate }

            const updatedCard = await updateFlashcard(flashcard.wordType, flashcard.flashcardId, updateData, currentDeck.deckId)
            todaysCards.push(updatedCard)

            await onClick()

        }
        else {
            const newDueDate = getNewDueDate(1)
            const updateData = { learningStep: 1, dueDate: newDueDate }
            if (flashcard.phase === "New") {
                updateData.phase = "Learning"
            }
            const updatedCard = await updateFlashcard(flashcard.wordType, flashcard.flashcardId, updateData, currentDeck.deckId)
            todaysCards.push(updatedCard)
            await onClick()
        }
    }

    const onClickHard = async () => {
        if (flashcard.phase === "Graduated") {
            const newInterval = flashcard.interval * 1.2
            const newEase = flashcard.ease - 15
            const newDueDate = getNewDueDate(newInterval)
            const updateData = { interval: newInterval, ease: newEase, dueDate: newDueDate }

            await updateFlashcard(flashcard.wordType, flashcard.flashcardId, updateData, currentDeck.deckId)
            await onClick()
        }
    }

    const onClickGood = async () => {
        console.log("clicked good")
        console.log(flashcard)
        if (flashcard.phase === "Graduated") {
            const newInterval = flashcard.interval * flashcard.ease
            const newDueDate = getNewDueDate(newInterval)
            const updateData = { interval: newInterval, dueDate: newDueDate }

            await updateFlashcard(flashcard.wordType, flashcard.flashcardId, updateData, currentDeck.deckId)
            await onClick()
        }

        else {
            if (flashcard.learningStep === 1) {
                console.log("learning step: 1")
                const newLearningStep = 10
                const newInterval = 10
                const newDueDate = getNewDueDate(10)
                const newPhase = "Learning"
                const updateData = { phase: newPhase, learningStep: newLearningStep, interval: newInterval, dueDate: newDueDate }

                const updatedCard = await updateFlashcard(flashcard.wordType, flashcard.flashcardId, updateData, currentDeck.deckId)
                todaysCards.push(updatedCard)

                await onClick()
            }

            if ((flashcard.learningStep === 10)) {
                const newPhase = "Graduated"
                const newInterval = 1 * 24 * 60
                const newDueDate = getNewDueDate(newInterval)
                const updateData = { learningStep: null, interval: newInterval, phase: newPhase, dueDate: newDueDate }

                await updateFlashcard(flashcard.wordType, flashcard.flashcardId, updateData, currentDeck.deckId)
                await onClick()

            }
        }
        onClick()
    }

    const onClickEasy = async () => {
        console.log("easy was clicked")
        if (flashcard.phase === "Graduated") {
            const newEase = flashcard.ease + 15
            const newInterval = flashcard.interval * flashcard.ease * 1.3
            const newDueDate = getNewDueDate(newInterval)
            const updateData = { interval: newInterval, ease: newEase, dueDate: newDueDate }

            await updateFlashcard(flashcard.wordType, flashcard.flashcardId, updateData, currentDeck.deckId)
            await onClick()

        }
        else {

            const newPhase = "Graduated"
            const newInterval = 4 * 24 * 60
            const newDueDate = getNewDueDate(newInterval)

            const updateData = { learningStep: null, interval: newInterval, phase: newPhase, dueDate: newDueDate }

            await updateFlashcard(flashcard.wordType, flashcard.flashcardId, updateData, currentDeck.deckId)
            await onClick()

        }




    }

    const onClick = async () => {
        if (todaysCards.length > 0 && flashcardNumber + 1 !== todaysCards.length) {
            setShowVerb(false)
            setFlashcardNumber(flashcardNumber + 1)
        }
        else {
            setShowVerb(false)
            setIsFinished(true)
            setTodaysCards([])
            setFlashcard([])
        }
    }

    const onClickQuit = async () => {
        setShowVerb(false)
        setIsFinished(true)
        setFlashcard([])
        setTodaysCards([])
        hideFlashcards()


    }


    const getNewDueDate = (interval) => {
        const currentTime = new Date()
        const dueDate = (new Date(currentTime.setMinutes(currentTime.getMinutes() + interval))).toJSON()
        return dueDate;
    }

    const updateFlashcard = async (wordType, flashcardId, updateData, deckId) => {

        const patchData = []

        for (const [key, value] of Object.entries(updateData)) {
            patchData.push({ "op": "replace", "path": "/" + key, "value": value })

        }

        const res = await fetch(`https://localhost:44386/api/flashcards/${wordType}s?id=${flashcardId}&deckId=${deckId}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(patchData)

        })
        const updatedCard = await res.json()
        return updatedCard
    }

    return (
        <>
            {!isFinished && todaysCards.length === 0 && <div>
                <h1>No cards left for today, come back tomorrow</h1>
                <Button text="Close" onClick={hideFlashcards} />
            </div>}

            {!isFinished && flashcard && todaysCards.length > 0 &&
                <div>
                    {<Flashcard key={flashcard.verbId} flashcard={flashcard} showVerb={showVerb} />}
                    {!showVerb && <Button text="Show" onClick={() => setShowVerb(true)} />}
                    {showVerb &&
                        <div>
                            <Button text="Again" onClick={() => onClickAgain()} />
                            {flashcard.phase === "Graduated" && <Button text="Hard" onClick={() => onClickHard()} />}
                            <Button text="Good" onClick={() => onClickGood()} />
                            <Button text="Easy" onClick={() => onClickEasy()} />
                        </div>}
                    {<Button text="Quit" onClick={() => onClickQuit()} />}
                </div>}
            {isFinished &&
                <div>
                    <h1>Deck finished!</h1>
                    <h2>Come back tomorrow for more flashcards</h2>
                    <Button text="Close" onClick={hideFlashcards} />
                </div>}
        </>
    )
}

export default Flashcards
