import React from 'react'
import Flashcard from './Flashcard'
import Button from './Button'

const Flashcards = ({hideFlashcards, deckVerbs, flashcard , setFlashcardNumber, setFlashcard, flashcardNumber,  }) => {

    const isLastCard = deckVerbs.length === flashcardNumber+1 ? true : false
    const onClickNext = () => {
        const nextFlashcardnumber = flashcardNumber + 1
        setFlashcardNumber(nextFlashcardnumber)
    }

    const onClickFinish = () => {
        alert('Finished!')
        hideFlashcards()
        setFlashcardNumber(0)
        setFlashcard([])
    }


    return (
        <div>
            <h1>test</h1>
            <Flashcard key={flashcard.verbId} flashcard={flashcard} />
            <Button text={!isLastCard ? "next" : "Finish"} onClick={!isLastCard ? onClickNext : onClickFinish} />

        </div>
    )
}

export default Flashcards
