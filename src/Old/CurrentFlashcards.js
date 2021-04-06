import React from 'react'
import Word from './Word'

const CurrentFlashcards = ({ flashcards, setFlashcards }) => {
    return (
        <div className="scroll table-container">
            <table>
                <tbody>
            {flashcards.map((flashcard, index) => (
                <Word key={index} word={flashcard} flashcards={flashcards} setFlashcards={setFlashcards} isCurrent={true} />
            ))}
            </tbody>
            </table>
        </div>
    )
}

export default CurrentFlashcards