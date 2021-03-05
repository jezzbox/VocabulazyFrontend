import React from 'react'
import Flashcard from './Flashcard'
import Button from './Button'
import { useState, useEffect } from 'react'

const Flashcards = ({ verbFlashcards, hideFlashcards, currentDeck }) => {
    const [deckFinished, setDeckFinished] = useState(false)
    const [showVerb, setShowVerb] = useState(false)
    const [flashcard, setFlashcard] = useState(null)
    const [flashcardNumber, setFlashcardNumber] = useState(0)
    const [todaysCards, setTodaysCards] = useState(verbFlashcards)
    const deckId = currentDeck.deckId

    useEffect(() => {
        const getTodaysCards = async () => {
            const reviewCutoff = getReviewCutoff(4)
            const learningCutoff = getLearningCutoff(20)

            const reviewCardsFromServer = await fetchTodaysFlashcards("Graduated", reviewCutoff)
            const learningCardsFromServer = await fetchTodaysFlashcards("Learning", learningCutoff)

            const getNewCards = async () => {
                if(reviewCardsFromServer.length > 0) {
                    newCardsFromServer = await fetchTodaysFlashcards("New", learningCutoff)
                    return newCardsFromServer
                }
                else {
                    newCardsFromServer = await fetchTodaysFlashcards("New")
                    return newCardsFromServer
                }
            }

            const newCardsFromServer = await getNewCards()

            const todaysCardsFromServer = [...reviewCardsFromServer,...learningCardsFromServer,...newCardsFromServer]
            setTodaysCards(todaysCardsFromServer)
        }
        getTodaysCards(deckId)
        }
        ,[deckId])

    const fetchTodaysFlashcards = async (cardPhase, cutoff=null) => {

        const getDueDateParameter = async (cutoff=null) => {
            if(cutoff) {
                dueDateString = `&dueDate=${cutoff}`
                return dueDateString
                }
            else {
                return ``
                }
            }
    
        const getMaxCardsParameter = async (cardPhase) => {
            if(cardPhase === "New") {
                maxCardsString = `&maxCards=20`
                return maxCardsString
                }
            else {
                maxCardsString = `&maxCards=200`
                return maxCardsString
                }
            }
            const dueDate = getDueDateParameter(cutoff) 
            const maxCards = getMaxCardsParameter(cardPhase)
            const url = `https://localhost:44386/api/Vocabulazy/verbFlashcards?deckId=${deckId}&phase=${cardPhase}`+dueDate+maxCards
            const res = await fetch(url)
            const data = await res.json()
            return data
          }

    

    useEffect(() => {
        const getFlashcard = async (verbFlashcard) => {
            const phraseFromServer = await fetchPhrase(verbFlashcard.verbId)
            const flashcard = verbFlashcard

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
        getFlashcard(todaysCards[0])
        },[verbFlashcards, todaysCards])

    const sortByDueDate = (cards) => {
        return cards.sort((a, b) => b.dueDate - a.dueDate)
    }

    

    const getReviewCutoff = (phase, resetTime) => {
        const currentTime = new Date()
        if(phase === "New") {
            
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
                const updateTodaysCards = async () => {
                    setTodaysCards([...todaysCards, updatedCard])
                } 
                await updateTodaysCards(updatedCard)

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
            console.log(updatedCard)

            console.log("card will be added to end of deck")
                const updateTodaysCards = async () => {
                    setTodaysCards([...todaysCards, updatedCard, {test:"hello"}])
                } 
                await updateTodaysCards(updatedCard)

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
            setTodaysCards(todaysCards => [...todaysCards, updatedCard])
            console.log(updatedCard)
            console.log(todaysCards)
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
                
                const updateVerbFlashcards = async (updatedCard) => {
                    const index = verbFlashcards.findIndex(x => x.verbFlashcardId === flashcard.verbflashcardId)
                    verbFlashcards[index] = updatedCard
                }
                updateVerbFlashcards(updatedCard)
                setTodaysCards(todaysCards => [...todaysCards, updatedCard])
                console.log(todaysCards)
                console.log(verbFlashcards)
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
        if (flashcardNumber + 1 >= todaysCards.length) {
            console.log("no cards left")
            console.log("finishing")
            setShowVerb(false)
            setDeckFinished(true)
            setFlashcardNumber(0)
            setFlashcard([])
        }
        else {
            console.log("still some cards left")
            console.log(todaysCards.length)
            console.log(flashcardNumber)

            setShowVerb(false)
            const nextFlashcardnumber = flashcardNumber + 1
            setFlashcardNumber(nextFlashcardnumber)
        }
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
            {!deckFinished &&
                <div>
                    {flashcard && <Flashcard key={flashcard.verbId} flashcard={flashcard} showVerb={showVerb} />}
                    {flashcard && !showVerb && <Button text="Show" onClick={() => setShowVerb(true)} />}
                    {flashcard && showVerb &&
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
