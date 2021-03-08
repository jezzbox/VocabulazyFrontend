import React from 'react'
import Word from './Word'

const CurrentFlashcards = ({ flashcards, setFlashcards }) => {
    return (
        <div className="scroll">
            {flashcards.map((flashcard, index) => (
                <Word key={index} word={flashcard} flashcards={flashcards} setFlashcards={setFlashcards} isCurrent={true} />
            ))}

        </div>
    )
}

export default CurrentFlashcards