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
        setLearnAheadTime(learnAheadTime)
    }, [])

    //get learning steps
    useEffect(() => {
        const learningStepsString = userProfile.steps.split(" ")
        var i;
        const learningSteps = []
        for (i = 0; i < learningStepsString.length; i++) {
            const learningStep = { stepNumber: i + 1, stepInterval: parseInt(learningStepsString[i]) }
            learningSteps.push(learningStep)
        }
        setLearningSteps(learningSteps)
    }, [userProfile.steps])

    // get  todays flashcards
    useEffect(() => {
        if (flashcards) {
            const currentTime = new Date()

            const getCutoff = (phase, customTime) => {
                var dateTo = new Date(currentTime.setMinutes(currentTime.getMinutes() + customTime))

                if (phase === "Graduated") {
                    dateTo = new Date(currentTime.setHours(customTime))
                    if (currentTime.getHours() >= customTime) {
                        dateTo = new Date(dateTo.setDate(dateTo.getDate() + 1))
                    }
                    dateTo = new Date(dateTo.setMinutes(0))
                }
                return dateTo.toJSON()
            }

            const filterCards = (cards, cardType, customTime, cardLimit = -1) => {
                const dateTo = customTime ? getCutoff(cardType, customTime) : null
                const filteredCards = cards.filter((card) =>
                    card.phase === cardType
                    && (card.dueDate <= dateTo || dateTo === null)
                    && card.isSuspended === false)
                    .slice(0, cardLimit)
                return filteredCards

            }
            const reviewCards = filterCards(flashcards, "Graduated", 4, userProfile.reviewsPerDay)
            const learningCards = filterCards(flashcards, "Learning", 20)
            const newCards = filterCards(flashcards, "New", reviewCards.length > 0 ? 20 : null, userProfile.newCardsPerDay)

            const todaysCardsFromServer = [...reviewCards, ...learningCards, ...newCards]

            setTodaysCards(todaysCardsFromServer)
        }
    }, [userProfile.newCardsPerDay, userProfile.reviewsPerDay, currentDeck.deckId, flashcards, isFinished])

    //get next flashcard
    useEffect(() => {
        if (!isFinished && todaysCards.length > 0) {

            const getFlashcard = async (currentFlashcard) => {
                const flashcard = Object.assign({}, currentFlashcard)
                flashcard.flashcardId = flashcard[WORD_TYPES[flashcard.wordType]["id"]]

                const parameters = generateParameterUrl(currentDeck)

                const url = `${flashcard.wordType}s/${flashcard.flashcardId}/phrases` + parameters
                const { dataFromServer, error } = await fetchData(url)
                if (error) {
                    console.log(error)
                }
                else {
                    const phraseFromServer = dataFromServer[Math.floor(Math.random() * dataFromServer.length)];
                    if (phraseFromServer == null) {
                        flashcard.phrase = "no phrase for this word yet"
                        flashcard.phraseNumber = null
                    }
                    else {
                        flashcard.spanishPhrase = phraseFromServer.spanishPhrase
                        flashcard.englishPhrase = phraseFromServer.englishPhrase
                        flashcard.phraseNumber = phraseFromServer.phraseNumber
                        flashcard.wordFromPhrase = phraseFromServer.word
                        flashcard.startTime = phraseFromServer.startTime
                        flashcard.endTime = phraseFromServer.endTime
                        flashcard.subtitleId = phraseFromServer.subtitleId
                        flashcard.conjugationForm = phraseFromServer.conjugationForm
                        flashcard.conjugationTense = phraseFromServer.conjugationTense
                        flashcard.conjugationType = phraseFromServer.conjugationType
                        flashcard.showTitle = phraseFromServer.showTitle
                        flashcard.seasonNumber = phraseFromServer.seasonNumber
                        flashcard.episodeNumber = phraseFromServer.episodeNumber
                    }
                    setFlashcard(flashcard)
                }
            }
            getFlashcard(todaysCards[flashcardNumber])

        }
    }, [currentDeck, todaysCards, flashcardNumber, isFinished])

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

        const { newEase, newPhase, newInterval, newLearningStep, newDueDate, newLapseCount, newIsSuspended } = processCard(buttonClicked, flashcard, options)

        const updateData = { learningStep: newLearningStep, interval: newInterval, phase: newPhase, ease: newEase, dueDate: newDueDate, lapseCount: newLapseCount, isSuspended: newIsSuspended }
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
        <section className="border-2 border-bookBlue rounded-md bg-white mx-60 flex flex-col items-center">
            {!isFinished && todaysCards.length === 0 && <>
                <h1 className="text-2xl">No cards left for today, come back tomorrow</h1>
            </>}

            {!isFinished && flashcard && todaysCards.length > 0 && flashcard.spanishPhrase &&
                <div>
                    {<Flashcard flashcard={flashcard} showVerb={showVerb} setShowVerb={setShowVerb} />}
                    {showVerb &&
                        <div className="m-16 border-2 border-terraCotta-500 bg-white rounded-full flex justify-center p-2 shadow-md">
                            <Button text="Again" onClick={() => onClickButton("Again")} />
                            {flashcard.phase === "Graduated" && <Button text="Hard" className="btn ml-8" onClick={() => onClickButton("Hard")} />}
                            <Button text="Good" className="btn ml-8" onClick={() => onClickButton("Good")} />
                            <Button text="Easy" className="btn ml-8" onClick={() => onClickButton("Easy")} />
                        </div>}
                </div>}
            {isFinished &&
                <div>
                    <h1 className="text-4xl">Deck finished!</h1>
                    <h2 className="text-2xl">Come back tomorrow for more flashcards</h2>
                </div>}
                <div>
                    <Link to="/home" className="btn">Back</Link>
                </div>
            
        </section>
    )
}

export default Flashcards
