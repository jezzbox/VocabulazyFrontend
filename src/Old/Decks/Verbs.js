import React from 'react'
import Verb from './Verb'

const Verbs = ({ verbs, filterString, setVerbFlashcards, verbFlashcards }) => {
    const filterResult = verbs.filter(verb => verb.verb.match(filterString))
    const isCurrent = false
    return (
        <div>
            {filterResult.map((verb) => (
                <Verb key={verb.verbId} verb={verb} verbFlashcards={verbFlashcards} setVerbFlashcards={setVerbFlashcards} isCurrent={isCurrent} />
            ))}

        </div>
    )


}

Verbs.defaultProps = {
    filterString: ''
}


export default Verbs
