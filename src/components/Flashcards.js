import React from 'react'
import Flashcard from './Flashcard'
import Button from './Button'
import { useState, useEffect } from 'react'
import WORD_TYPES from '../Constants/WORD_TYPES'
import { Link } from 'react-router-dom'
import fetchData from '../Actions/FetchData'
import processFlashcards from '../Actions/ProcessFlashcards'

const Flashcards = ({ currentDeck, setCurrentDeck, userProfile }) => {
    const [isFinished, setIsFinished] = useState(false)
    const [flashcards, setFlashcards] = useState(null)
    const [showVerb, setShowVerb] = useState(false)
    const [flashcard, setFlashcard] = useState([])
    const [todaysCards, setTodaysCards] = useState([])
    const [flashcardNumber, setFlashcardNumber] = useState(0)
    const [learningSteps, setLearningSteps] = useState([])
    const [learnAheadTime, setLearnAheadTime] = useState(null)


    useEffect(() => {
        console.log("user profile")
        console.log(userProfile)
    }, [userProfile])
    //set flashcards from current deck
    useEffect(() => {
        setFlashcards(currentDeck.flashcards)
    }, [currentDeck.flashcards])

    //get learn ahead time
    useEffect(() => {
        const currentTime = new Date()
        const learnAheadTime = (new Date(currentTime.setMinutes(currentTime.getMinutes() + 20))).toJSON()
        console.log(learnAheadTime)
        setLearnAheadTime(learnAheadTime)
    }, [])

    //get learning steps
    useEffect(() => {
        const learningStepsString = userProfile.steps.split(" ")
        console.log("stringed")
        console.log(learningStepsString)
        var i;
        const learningSteps = []
        for (i = 0; i < learningStepsString.length; i++) {
            const learningStep = { stepNumber: i + 1, stepInterval: parseInt(learningStepsString[i]) }
            learningSteps.push(learningStep)
        }
        console.log(learningSteps)
        setLearningSteps(learningSteps)
    }, [userProfile.steps])

    useEffect(() => {
        if (flashcards) {
            console.log("effect is being trigged to get todays cards")
            const getTodaysCards = async () => {

                const reviewCards = flashcards.filter((flashcard) => flashcard.phase === "Graduated" && flashcard.dueDate <= getCutoff("Graduated", 4)).slice(0, userProfile.reviewsPerDay)
                const learningCards = flashcards.filter((flashcard) => flashcard.phase === "Learning" && flashcard.dueDate <= getCutoff("Learning", 20))

                const getNewCards = async (existsReviewCard) => {
                    if (existsReviewCard) {

                        const newCards = flashcards.filter((flashcard) => flashcard.phase === "New" && flashcard.dueDate <= getCutoff("New", 20))
                        const slicedCards = newCards.slice(0, userProfile.newCardsPerDay)

                        return slicedCards
                    }
                    else {
                        const newCards = flashcards.filter((flashcard) => flashcard.phase === "New")
                        const slicedCards = newCards.slice(0, userProfile.newCardsPerDay)
                        return slicedCards
                    }
                }

                const newCards = await getNewCards(reviewCards.length > 0)
                const todaysCardsFromServer = [...reviewCards, ...learningCards, ...newCards]

                setTodaysCards(todaysCardsFromServer)
                console.log("todayscards are: ")
                console.log(todaysCardsFromServer)
            }
            getTodaysCards(currentDeck.deckId)
        }
    }, [userProfile.newCardsPerDay, userProfile.reviewsPerDay, currentDeck.deckId, flashcards, isFinished])

    useEffect(() => {
        if (!isFinished && todaysCards.length > 0) {
            console.log("effect was triggered to get flashcard")
            console.log(todaysCards)

            const getFlashcard = async (currentFlashcard) => {
                console.log("getting phrases")
                const flashcard = Object.assign({}, currentFlashcard)
                const verbTypeString = `&useSubjunctive=${currentDeck.useSubjunctive}
                    &useIndicative=${currentDeck.useIndicative}
                    &useImperative=${currentDeck.useImperative}
                    &useInfinitive=${currentDeck.useInfinitive}
                    &useParticiple=${currentDeck.useParticiple}
                    &usePreterite=${currentDeck.usePreterite}
                    &useImperfect=${currentDeck.useImperfect}
                    &usePresent=${currentDeck.usePresent}
                    &useFuture=${currentDeck.usePresent}`

                console.log(verbTypeString)

                flashcard.flashcardId = flashcard[WORD_TYPES[flashcard.wordType]["id"]]
                const phraseFromServer = await fetchPhrase(flashcard.flashcardId, flashcard.wordType, verbTypeString)
                if (phraseFromServer == null) {
                    flashcard.phrase = "no phrase for this word yet"
                    flashcard.phraseId = null
                }
                else {
                    flashcard.phrase = phraseFromServer.phrase
                    flashcard.phraseId = phraseFromServer.phraseId
                }
                console.log(flashcard)
                setFlashcard(flashcard)
            }
            getFlashcard(todaysCards[flashcardNumber])

        }
    }, [currentDeck, todaysCards, flashcardNumber, isFinished])

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

    const fetchPhrase = async (flashcardId, wordType, verbTypeString) => {

        const url = `https://localhost:44386/api/Vocabulazy/phrases?${wordType}Id=${flashcardId}` + verbTypeString
        const res = await fetch(url)
        const data = await res.json()
        const phrase = data[Math.floor(Math.random() * data.length)];

        return phrase
    }

    const onClickAgain = async () => {
        console.log("again was clicked")
        if (flashcard.phase === "Graduated") {
            const newLearningStep = learningSteps.find((step) => step.stepNumber === 2).stepInterval
            const newEase = flashcard.ease - 20
            const newDueDate = getNewDueDate(newLearningStep)
            const updateData = { learningStep: newLearningStep, interval: 1 * 24 * 60, phase: "Learning", ease: newEase, dueDate: newDueDate }

            const url = `flashcards/${flashcard.wordType}s?id=${flashcard.flashcardId}&deckId=${currentDeck.deckId}`
            const { dataFromServer: updatedCard, error } = await fetchData(url, 'PATCH', updateData)
            if (error) {
                console.log(error)

            }
            else {
                if (newDueDate < learnAheadTime) {
                    todaysCards.push(updatedCard)
                }
                await onClick()
            }

        }
        else {
            const newLearningStep = learningSteps.find((step) => step.stepNumber === 1).stepInterval
            const newDueDate = getNewDueDate(newLearningStep)
            const updateData = { learningStep: newLearningStep, dueDate: newDueDate }
            if (flashcard.phase === "New") {
                updateData.phase = "Learning"
            }

            const url = `flashcards/${flashcard.wordType}s?id=${flashcard.flashcardId}&deckId=${currentDeck.deckId}`
            const { dataFromServer: updatedCard, error } = await fetchData(url, 'PATCH', updateData)
            if (error) {
                console.log(error)

            }
            else {
                if (newDueDate < learnAheadTime) {
                    todaysCards.push(updatedCard)
                }
                await onClick()
            }
        }
    }
    const onClickHard = async () => {
        if (flashcard.phase === "Graduated") {
            const newInterval = (userProfile.intervalModifier / 100) * flashcard.interval * 1.2
            const newEase = flashcard.ease - 15
            const newDueDate = getNewDueDate(newInterval)
            const updateData = { interval: newInterval, ease: newEase, dueDate: newDueDate }

            const url = `flashcards/${flashcard.wordType}s?id=${flashcard.flashcardId}&deckId=${currentDeck.deckId}`
                const { error } = await fetchData(url, 'PATCH', updateData)
                if (error) {
                    console.log(error)
                }
                else {
                    await onClick()
                }
        }
    }

    const onClickGood = async () => {
        console.log("clicked good")
        console.log(flashcard)
        if (flashcard.phase === "Graduated") {
            const newInterval = (userProfile.intervalModifier / 100) * flashcard.interval * flashcard.ease
            const newDueDate = getNewDueDate(newInterval)
            const updateData = { interval: newInterval, dueDate: newDueDate }

            const url = `flashcards/${flashcard.wordType}s?id=${flashcard.flashcardId}&deckId=${currentDeck.deckId}`
                const { error } = await fetchData(url, 'PATCH', updateData)
                if (error) {
                    console.log(error)
                }
                else {
                    await onClick()
                }
        }

        else {
            const currentStepNumber = learningSteps.find((step) => step.stepInterval === flashcard.learningStep).stepNumber
            if (learningSteps.length > currentStepNumber) {
                console.log("learning step: 1")
                const newLearningStep = learningSteps.find((step) => step.stepNumber === currentStepNumber + 1).stepInterval
                const newInterval = newLearningStep
                const newDueDate = getNewDueDate(newLearningStep)
                const newPhase = "Learning"
                const updateData = { phase: newPhase, learningStep: newLearningStep, interval: newInterval, dueDate: newDueDate }

                const url = `flashcards/${flashcard.wordType}s?id=${flashcard.flashcardId}&deckId=${currentDeck.deckId}`
                const { dataFromServer: updatedCard, error } = await fetchData(url, 'PATCH', updateData)
                if (error) {
                    console.log(error)

                }
                else {
                    if (newDueDate < learnAheadTime) {
                        todaysCards.push(updatedCard)
                    }
                    await onClick()
                }
            }

            else {
                const newPhase = "Graduated"
                const newInterval = userProfile.graduatingInterval * 24 * 60
                const newDueDate = getNewDueDate(newInterval)
                const updateData = { learningStep: null, interval: newInterval, phase: newPhase, dueDate: newDueDate }

                const url = `flashcards/${flashcard.wordType}s?id=${flashcard.flashcardId}&deckId=${currentDeck.deckId}`
                const { error } = await fetchData(url, 'PATCH', updateData)
                if (error) {
                    console.log(error)
                }
                else {
                    await onClick()
                }

            }
        }
        onClick()
    }

    const onClickEasy = async () => {
        console.log("easy was clicked")
        if (flashcard.phase === "Graduated") {
            const newEase = flashcard.ease + 15
            const newInterval = (userProfile.intervalModifier / 100) * flashcard.interval * (flashcard.ease / 100) * (userProfile.easyBonus / 100)
            const newDueDate = getNewDueDate(newInterval)
            const updateData = { interval: newInterval, ease: newEase, dueDate: newDueDate }

            const url = `flashcards/${flashcard.wordType}s?id=${flashcard.flashcardId}&deckId=${currentDeck.deckId}`
            const { error } = await fetchData(url, 'PATCH', updateData)
            if (error) {
                console.log(error)
            }
            else {
                await onClick()
            }

        }
        else {
            const currentStepNumber = learningSteps.find((step) => step.stepInterval === flashcard.learningStep).stepNumber

            if (learningSteps.length > currentStepNumber + 1) {
                console.log("learning step: 1")
                const newLearningStep = learningSteps.find((step) => step.stepNumber === currentStepNumber + 2).stepInterval
                const newPhase = "Learning"
                const newInterval = newLearningStep
                const newDueDate = getNewDueDate(newLearningStep)
                const updateData = { learningStep: newLearningStep, interval: newInterval, phase: newPhase, dueDate: newDueDate }

                const url = `flashcards/${flashcard.wordType}s?id=${flashcard.flashcardId}&deckId=${currentDeck.deckId}`
                const { dataFromServer: updatedCard, error } = await fetchData(url, 'PATCH', updateData)
                if (error) {
                    console.log(error)

                }
                else {
                    if (newDueDate < learnAheadTime) {
                        todaysCards.push(updatedCard)
                    }
                    await onClick()
                }

            }
            else {
                const newPhase = "Graduated"
                const newInterval = (userProfile.intervalModifier / 100) * (userProfile.easyInterval * 24 * 60)
                const newDueDate = getNewDueDate(newInterval)
                const updateData = { learningStep: null, interval: newInterval, phase: newPhase, dueDate: newDueDate }

                const url = `flashcards/${flashcard.wordType}s?id=${flashcard.flashcardId}&deckId=${currentDeck.deckId}`
                const { error } = await fetchData(url, 'PATCH', updateData)
                if (error) {
                    console.log(error)
                }
                else {
                    await onClick()
                }

            }
        }
    }

    const onClick = async () => {
        if (todaysCards.length > 0 && flashcardNumber + 1 !== todaysCards.length) {
            setShowVerb(false)
            setFlashcardNumber(flashcardNumber + 1)
        }
        else {
            const { dataFromServer: updatedDeck, error } = await fetchData(`decks/${currentDeck.deckId}`)
            if (error) {
                console.log(error)
            }
            else {
                updatedDeck.flashcards = processFlashcards(updatedDeck)
                setCurrentDeck(updatedDeck)
                setShowVerb(false)
                setIsFinished(true)
                setTodaysCards([])
                setFlashcard([])
            }
        }
    }

    const getNewDueDate = (interval) => {
        const currentTime = new Date()
        const dueDate = (new Date(currentTime.setMinutes(currentTime.getMinutes() + interval))).toJSON()
        return dueDate;
    }

    return (
        <div>
            {!isFinished && todaysCards.length === 0 && <>
                <h1>No cards left for today, come back tomorrow</h1>
            </>}

            {!isFinished && flashcard && todaysCards.length > 0 &&
                <>
                    {<Flashcard key={flashcard.verbId} flashcard={flashcard} showVerb={showVerb} />}
                    {!showVerb && <Button text="Show" onClick={() => setShowVerb(true)} />}
                    {showVerb &&
                        <div>
                            <Button text="Again" onClick={() => onClickAgain()} />
                            {flashcard.phase === "Graduated" && <Button text="Hard" onClick={() => onClickHard()} />}
                            <Button text="Good" onClick={() => onClickGood()} />
                            <Button text="Easy" onClick={() => onClickEasy()} />
                        </div>}
                </>}
            {isFinished &&
                <>
                    <h1>Deck finished!</h1>
                    <h2>Come back tomorrow for more flashcards</h2>
                </>}
            <Link to="/home" className="back-link">Back</Link>
        </div>
    )
}

export default Flashcards
