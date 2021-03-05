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
            console.log(url)
            const res = await fetch(url)
            const data = await res.json()
            return data
        }

        const getTodaysCards = async () => {
            const reviewCutoff = getReviewCutoff(4)
            const learningCutoff = getLearningCutoff(20)

            const reviewCardsFromServer = await fetchTodaysFlashcards("Graduated", reviewCutoff)
            const learningCardsFromServer = await fetchTodaysFlashcards("Learning", learningCutoff)

            const getNewCards = async () => {
                if (reviewCardsFromServer.length > 0) {
                    const newCardsFromServer = await fetchTodaysFlashcards("New", learningCutoff)
                    return newCardsFromServer
                }
                else {
                    const newCardsFromServer = await fetchTodaysFlashcards("New")
                    return newCardsFromServer
                }
            }

            const newCardsFromServer = await getNewCards()

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

    useEffect(() => {
        console.log("current Flashcard: ")
        console.log(flashcard)
    }, [flashcard])

    useEffect(() => {
        console.log("todays cards: ")
        console.log(todaysCards)
    }, [todaysCards])

    const getReviewCutoff = (phase, resetTime) => {
        const currentTime = new Date()
        if (phase === "New") {

        }
        const setHours = new Date(currentTime.setHours(resetTime))
        const setMinutes = new Date(setHours.setMinutes(0))
        return (new Date(setMinutes)).toJSON()
    }

    const getLearningCutoff = (learnAheadTime) => {
        const currentTime = new Date()
        const learningCutoff = (new Date(currentTime.setMinutes(currentTime.getMinutes() + learnAheadTime))).toJSON()
        return learningCutoff
    }

    const fetchPhrase = async (verbId) => {
        const url = `https://localhost:44386/api/Vocabulazy/phrases?verbId=${verbId}`
        const res = await fetch(url)
        const data = await res.json()
        const phrase = data[Math.floor(Math.random() * data.length)];

        return phrase
    }

    const onClickAgain = async () => {
        console.log(flashcard)
        console.log("clicked again")

        if (flashcard.phase === "Graduated") {
            console.log("card was graduated, turning to learning and due for 10 mins")
            const newEase = flashcard.ease - 20
            const newDueDate = getNewDueDate(10)
            const updateData = { learningStep: 10, interval: 1 * 24 * 60, phase: "Learning", ease: newEase, dueDate: newDueDate }

            const updatedCard = await updateVerbFlashcard(flashcard.verbFlashcardId, updateData)

            console.log("card will be added to end of deck")
            todaysCards.push(updatedCard)
            console.log(todaysCards)
            await onClick()

        }
        else {
            console.log("learning card, so reset step to 1 and show in 1 minute")
            const newDueDate = getNewDueDate(1)
            const updateData = { learningStep: 1, dueDate: newDueDate }
            if (flashcard.phase === "New") {
                updateData.phase = "Learning"
            }

            const updatedCard = await updateVerbFlashcard(flashcard.verbFlashcardId, updateData)
            todaysCards.push(updatedCard)
            console.log(todaysCards)
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
        console.log("clicked good")
        if (flashcard.phase === "Graduated") {
            console.log("as card was already gradeuated, will not add to todays cards")
            const newInterval = flashcard.interval * flashcard.ease
            const newDueDate = getNewDueDate(newInterval)
            const updateData = { interval: newInterval, dueDate: newDueDate }

            const updatedCard = await updateVerbFlashcard(flashcard.verbFlashcardId, updateData)
            console.log(updatedCard)
            await onClick()
        }

        else {
            console.log(flashcard)
            if (flashcard.learningStep === 1) {
                console.log("was at learning step 1")
                const newLearningStep = 10
                const newInterval = 10
                const newDueDate = getNewDueDate(10)
                const newPhase = "Learning"
                const updateData = { phase: newPhase, learningStep: newLearningStep, interval: newInterval, dueDate: newDueDate }

                const updatedCard = await updateVerbFlashcard(flashcard.verbFlashcardId, updateData)
                console.log(updatedCard)
                console.log("card will be added to end of deck")
                todaysCards.push(updatedCard)
                console.log(todaysCards)
                console.log(todaysCards.length)

                await onClick()
            }

            if ((flashcard.learningStep === 10)) {
                console.log("was at learning step 10, so card will now be graduated")
                const newPhase = "Graduated"
                const newInterval = 1 * 24 * 60
                const newDueDate = getNewDueDate(newInterval)
                const updateData = { learningStep: null, interval: newInterval, phase: newPhase, dueDate: newDueDate }

                const updatedCard = await updateVerbFlashcard(flashcard.verbFlashcardId, updateData)
                console.log(updatedCard)
                await onClick()

            }
        }
        onClick()
    }

    const onClickEasy = async () => {
        console.log(flashcard)
        console.log("easy was clicked")
        if (flashcard.phase === "Graduated") {
            const newEase = flashcard.ease + 15
            const newInterval = flashcard.interval * flashcard.ease * 1.3
            const newDueDate = getNewDueDate(newInterval)
            const updateData = { interval: newInterval, ease: newEase, dueDate: newDueDate }

            const updatedCard = await updateVerbFlashcard(flashcard.verbFlashcardId, updateData)
            console.log(updatedCard)
            await onClick()

        }
        else {
            console.log("graduating card")
            const newPhase = "Graduated"
            const newInterval = 4 * 24 * 60
            const newDueDate = getNewDueDate(newInterval)

            const updateData = { learningStep: null, interval: newInterval, phase: newPhase, dueDate: newDueDate }

            const updatedCard = await updateVerbFlashcard(flashcard.verbFlashcardId, updateData)
            console.log(updatedCard)
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

            console.log("finished")
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
            {!flashcard && <div>
                <h1>No cards left for today, come back tomorrow</h1>
                <Button text="Close" onClick={hideFlashcards} />
            </div>}

            {!isFinished && flashcard && <div>
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
