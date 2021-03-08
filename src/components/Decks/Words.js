import React from 'react'
import Word from './Word'

const Words = ({ words, setFlashcards, flashcards }) => {
    return (
        <div className="scroll">
            {words.map((word, index) => (
                <Word key={index} word={word} flashcards={flashcards} setFlashcards={setFlashcards} isCurrent={false} />
            ))}

        </div>
    )
}

export default Words