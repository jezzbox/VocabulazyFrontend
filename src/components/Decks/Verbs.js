import React from 'react'
import Verb from './Verb'

const Verbs = ({ verbs, filterString }) => {
    const filterResult = verbs.filter(verb => verb.verb.match(filterString))
    return (
        <div>
            {filterResult.map((verb) => (
                <Verb key={verb.verbId} verb={verb} />
            ))}

        </div>
    )


}

Verbs.defaultProps = {
    filterString: ''
}


export default Verbs
