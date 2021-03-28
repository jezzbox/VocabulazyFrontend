import React from 'react'
import Flashcard from './Flashcard'
import Button from './Button'
import { useState, useEffect } from 'react'
import WORD_TYPES from '../Constants/WORD_TYPES'
import { Link } from 'react-router-dom'
import fetchData from '../Actions/FetchData'
import processFlashcards from '../Actions/ProcessFlashcards'
import generateParameterUrl from '../Actions/GenerateParameterUrl'
import processCard from '../Actions/ProcessCard'

const Flashcards = ({ currentDeck, setCurrentDeck, userProfile }) => {
    const [isFinished, setIsFinished] = useState(false)
    const [flashcards, setFlashcards] = useState(null)
    const [showVerb, setShowVerb] = useState(false)
    const [flashcard, setFlashcard] = useState([])
    const [todaysCards, setTodaysCards] = useState([])
    const [flashcardNumber, setFlashcardNumber] = useState(0)
    const [learningSteps, setLearningSteps] = useState([])
    const [learnAheadTime, setLearnAheadTime] = useState(null)

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
                const reviewCards = flashcards.filter((flashcard) => flashcard.phase === "Graduated" && flashcard.dueDate <= getCutoff("Graduated", 4) && flashcard.isSuspended === false).slice(0, userProfile.reviewsPerDay)
                const learningCards = flashcards.filter((flashcard) => flashcard.phase === "Learning" && flashcard.dueDate <= getCutoff("Learning", 20) && flashcard.isSuspended === false)
                console.log("review cards")
                console.log(reviewCards)
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

                flashcard.flashcardId = flashcard[WORD_TYPES[flashcard.wordType]["id"]]

                const parameters = generateParameterUrl(currentDeck)

                const url = `Vocabulazy/${flashcard.wordType}s/${flashcard.flashcardId}/phrases` + parameters
                console.log(url)
                const { dataFromServer, error } = await fetchData(url)
                if (error) {
                    console.log(error)
                }
                else {
                    const phraseFromServer = dataFromServer[Math.floor(Math.random() * dataFromServer.length)];
                    console.log(phraseFromServer)
                    if (phraseFromServer == null) {
                        flashcard.phrase = "no phrase for this word yet"
                        flashcard.phraseNumber = null
                    }
                    else {
                        flashcard.spanishPhrase = phraseFromServer.spanishPhrase
                        flashcard.englishPhrase = phraseFromServer.englishPhrase
                        flashcard.phraseNumber = phraseFromServer.phraseNumber
                        flashcard.word = phraseFromServer.word
                        flashcard.startTime = phraseFromServer.startTime
                        flashcard.endTime = phraseFromServer.endTime
                        flashcard.subtitleId = phraseFromServer.subtitleId
                        flashcard.conjugationForm = phraseFromServer.conjugationForm
                        flashcard.conjugationTense = phraseFromServer.conjugationTense
                        flashcard.conjugationType = phraseFromServer.conjugationType
                    }
                    console.log(flashcard)
                    setFlashcard(flashcard)
                }
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
            console.log("we are here!")
            var cutoffDate = new Date(currentTime.setHours(customTime))
            if(currentTime.getHours() >= customTime) {
                cutoffDate = new Date(cutoffDate.setDate(cutoffDate.getDate() + 1))
            }
            cutoffDate = new Date(cutoffDate.setMinutes(0))
            return cutoffDate.toJSON()
        }
    }

    const getPatchData = (updateData) => {
        const patchData = []
        for (let [key, value] of Object.entries(updateData)) {
            if (value) {
                patchData.push({ "op": "replace", "path": `/${key}`, "value": value })
            }
        }
        return patchData;

    }

    const onClickButton = async (buttonClicked) => {

        const options = {
            learningSteps: learningSteps
            , intervalModifier: userProfile.intervalModifier
            , graduatingInterval: userProfile.graduatingInterval
            , easyInterval: userProfile.easyInterval
            , easyBonus: userProfile.easyBonus
        }
        console.log(options)

        const { newEase, newPhase, newInterval, newLearningStep, newDueDate, newLapseCount, newIsSuspended } = processCard(buttonClicked, flashcard, options)
        const updateData = { learningStep: newLearningStep, interval: newInterval, phase: newPhase, ease: newEase, dueDate: newDueDate, lapseCount: newLapseCount, isSuspended:newIsSuspended }
        const patchData = getPatchData(updateData)

        const url = `flashcards/${flashcard.wordType}s?id=${flashcard.flashcardId}&deckId=${currentDeck.deckId}`
        const { dataFromServer: updatedCard, error } = await fetchData(url, 'PATCH', patchData)
        if (error) {
            console.log(error)
        }
        else {
            const currentPhase = newPhase ? newPhase : flashcard.phase

            if (currentPhase === "Learning" && newDueDate < learnAheadTime) {
                todaysCards.push(updatedCard)
            }
            await onClick()
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

    return (
        <div>
            {!isFinished && todaysCards.length === 0 && <>
                <h1>No cards left for today, come back tomorrow</h1>
            </>}

            {!isFinished && flashcard && todaysCards.length > 0 && flashcard.spanishPhrase &&
                <>
                    {<Flashcard key={flashcard.phraseNumber} flashcard={flashcard} showVerb={showVerb} />}
                    {!showVerb && <Button text="Show" onClick={() => setShowVerb(true)} />}
                    {showVerb &&
                        <div>
                            <Button text="Again" onClick={() => onClickButton("Again")} />
                            {flashcard.phase === "Graduated" && <Button text="Hard" onClick={() => onClickButton("Hard")} />}
                            <Button text="Good" onClick={() => onClickButton("Good")} />
                            <Button text="Easy" onClick={() => onClickButton("Easy")} />
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
