import React from 'react'
import Verb from './Verb'

const Verbs = ({ verbs, filterString, setDeckVerbs, deckVerbs }) => {
    const filterResult = verbs.filter(verb => verb.verb.match(filterString))
    const isCurrent = false
    return (
        <div>
            {filterResult.map((verb) => (
                <Verb key={verb.verbId} verb={verb} deckVerbs={deckVerbs} setDeckVerbs={setDeckVerbs} isCurrent={isCurrent} />
            ))}

        </div>
    )


}

Verbs.defaultProps = {
    filterString: ''
}


export default Verbs
