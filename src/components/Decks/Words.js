import React from 'react'
import Word from './Word'

const Words = ({ words, setCurrentFlashcards, isCurrent, currentFlashcards }) => {
    return (
        <div className="scroll">
            {words.map((word) => (
                <Word key={word.index} word={word} flashcards={currentFlashcards} setFlashcards={setCurrentFlashcards} isCurrent={isCurrent} />
            ))}

        </div>
    )
}

export default Words