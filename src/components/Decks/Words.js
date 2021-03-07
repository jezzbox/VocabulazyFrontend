import React from 'react'
import Word from './Word'

const Words = ({ words, flashcards, setFlashcards, isCurrent }) => {
    return (
        <div className="scroll">
            {words.map((word) => (
                <Word key={word.index} word={word} flashcards={flashcards} setFlashcards={setFlashcards} isCurrent={isCurrent} />
            ))}

        </div>
    )
}

export default Words