import React from 'react'
import Word from './Word'

const Words = ({ words, setCurrentFlashcards, currentFlashcards }) => {
    return (
        <div className="scroll">
            {words.map((word, index) => (
                <Word key={index} word={word} flashcards={currentFlashcards} setFlashcards={setCurrentFlashcards} isCurrent={false} />
            ))}

        </div>
    )
}

export default Words