import React from 'react'
import Flashcard from './Flashcard'
import Button from './Button'
import { useState, useEffect } from 'react'

const Flashcards = ({ isFinished, setIsFinished, hideFlashcards, currentDeck }) => {
    const [showVerb, setShowVerb] = useState(false)
    const [flashcard, setFlashcard] = useState([])
    const [todaysCards, setTodaysCards] = useState([])
    const [flashcardNumber, setFlashcardNumber] = useState(0)
    const deckId = currentDeck.deckId

    useEffect(() => {
        const fetchTodaysFlashcards = async (cardPhase, cutoff = null) => {

            const getDueDateParameter = (cutoff = null) => {
                if (cutoff) {
                    const dueDateString = `&dueDate=${cutoff}`
                    return dueDateString
                }
                else {
                    return ``
                }
            }

            const getMaxCardsParameter = (cardPhase) => {
                if (cardPhase === "New") {
                    const maxCardsString = `&maxCards=20`
                    return maxCardsString
                }
                else {
                    const maxCardsString = `&maxCards=200`
                    return maxCardsString
                }
            }
            const dueDate = getDueDateParameter(cutoff)
            const maxCards = getMaxCardsParameter(cardPhase)
            const url = `https://localhost:44386/api/Vocabulazy/verbFlashcards?deckId=${deckId}&phase=${cardPhase}` + dueDate + maxCards
            const res = await fetch(url)
            const data = await res.json()
            return data
        }

        const getTodaysCards = async () => {

            const reviewCardsFromServer = await fetchTodaysFlashcards("Graduated", getCutoff("Graduated", 4))
            const learningCardsFromServer = await fetchTodaysFlashcards("Learning", getCutoff("Learning", 20))
            const getNewCards = async (existReviewCard) => {
                if (existReviewCard) {

                    const newCardsFromServer = await fetchTodaysFlashcards("New", getCutoff("New", 20))
                    return newCardsFromServer
                }
                else {
                    const newCardsFromServer = await fetchTodaysFlashcards("New")
                    return newCardsFromServer
                }
            }

            const newCardsFromServer = await getNewCards(reviewCardsFromServer.length > 0)
            const todaysCardsFromServer = [...reviewCardsFromServer, ...learningCardsFromServer, ...newCardsFromServer]

            setTodaysCards(todaysCardsFromServer)
        }
        getTodaysCards(deckId)
    }
        , [deckId])

    useEffect(() => {
        if (todaysCards.length > 0) {

            const getFlashcard = async (verbFlashcard) => {
                const phraseFromServer = await fetchPhrase(verbFlashcard.verbId)
                const flashcard = Object.assign({}, verbFlashcard)
                if (phraseFromServer == null) {
                    flashcard.phrase = flashcard.verb
                    flashcard.phraseId = null
                }
                else {
                    flashcard.phrase = phraseFromServer.phrase
                    flashcard.phraseId = phraseFromServer.phraseId
                }

                setFlashcard(flashcard)
            }
            getFlashcard(todaysCards[flashcardNumber])

        }
    }, [todaysCards, flashcardNumber])

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


        if (flashcard.phase === "Graduated") {
            const newEase = flashcard.ease - 20
            const newDueDate = getNewDueDate(10)
            const updateData = { learningStep: 10, interval: 1 * 24 * 60, phase: "Learning", ease: newEase, dueDate: newDueDate }

            const updatedCard = await updateVerbFlashcard(flashcard.verbFlashcardId, updateData)
            todaysCards.push(updatedCard)

            await onClick()

        }
        else {

            const newDueDate = getNewDueDate(1)
            const updateData = { learningStep: 1, dueDate: newDueDate }
            if (flashcard.phase === "New") {
                updateData.phase = "Learning"
            }

            const updatedCard = await updateVerbFlashcard(flashcard.verbFlashcardId, updateData)
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

            await updateVerbFlashcard(flashcard.verbFlashcardId, updateData)
            await onClick()
        }
    }

    const onClickGood = async () => {
        if (flashcard.phase === "Graduated") {
            const newInterval = flashcard.interval * flashcard.ease
            const newDueDate = getNewDueDate(newInterval)
            const updateData = { interval: newInterval, dueDate: newDueDate }

            await updateVerbFlashcard(flashcard.verbFlashcardId, updateData)
            await onClick()
        }

        else {
            if (flashcard.learningStep === 1) {

                const newLearningStep = 10
                const newInterval = 10
                const newDueDate = getNewDueDate(10)
                const newPhase = "Learning"
                const updateData = { phase: newPhase, learningStep: newLearningStep, interval: newInterval, dueDate: newDueDate }

                const updatedCard = await updateVerbFlashcard(flashcard.verbFlashcardId, updateData)
                todaysCards.push(updatedCard)

                await onClick()
            }

            if ((flashcard.learningStep === 10)) {
                const newPhase = "Graduated"
                const newInterval = 1 * 24 * 60
                const newDueDate = getNewDueDate(newInterval)
                const updateData = { learningStep: null, interval: newInterval, phase: newPhase, dueDate: newDueDate }

                await updateVerbFlashcard(flashcard.verbFlashcardId, updateData)
                await onClick()

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

            await updateVerbFlashcard(flashcard.verbFlashcardId, updateData)
            await onClick()

        }
        else {

            const newPhase = "Graduated"
            const newInterval = 4 * 24 * 60
            const newDueDate = getNewDueDate(newInterval)

            const updateData = { learningStep: null, interval: newInterval, phase: newPhase, dueDate: newDueDate }

            await updateVerbFlashcard(flashcard.verbFlashcardId, updateData)
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
            setFlashcard([])
            setTodaysCards([])
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

    const updateVerbFlashcard = async (verbFlashcardId, updateData) => {

        const patchData = []

        for (const [key, value] of Object.entries(updateData)) {
            patchData.push({ "op": "replace", "path": "/" + key, "value": value })

        }

        const res = await fetch(`https://localhost:44386/api/Vocabulazy/verbflashcards/${verbFlashcardId}`, {
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
