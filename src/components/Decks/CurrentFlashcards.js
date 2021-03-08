import React from 'react'
import Word from './Word'

const CurrentFlashcards = ({ flashcards, setCurrentFlashcards }) => {
    return (
        <div className="scroll">
            {flashcards.map((flashcard, index) => (
                <Word key={index} word={flashcard} flashcards={flashcards} setFlashcards={setCurrentFlashcards} isCurrent={true} />
            ))}

        </div>
    )
}

export default CurrentFlashcards