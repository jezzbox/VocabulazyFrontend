import React from 'react'
import Verb from './Verb'

const CurrentVerbs = ({ setDeckVerbs, deckVerbs }) => {
const isCurrent = true
    return (
        <div>
            {deckVerbs.map((verb) => (
                <Verb key={verb.verbId} verb={verb} deckVerbs={deckVerbs} setDeckVerbs={setDeckVerbs} isCurrent={isCurrent} />
            ))}

        </div>
    )


}

export default CurrentVerbs
