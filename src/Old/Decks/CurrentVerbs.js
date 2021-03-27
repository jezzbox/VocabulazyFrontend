import React from 'react'
import Verb from './Verb'

const CurrentVerbs = ({ setVerbFlashcards, verbFlashcards }) => {
const isCurrent = true
    return (
        <div>
            {verbFlashcards.map((verb) => (
                <Verb key={verb.verbId} verb={verb}verbFlashcards={verbFlashcards} setVerbFlashcards={setVerbFlashcards} isCurrent={isCurrent} />
            ))}

        </div>
    )


}

export default CurrentVerbs
