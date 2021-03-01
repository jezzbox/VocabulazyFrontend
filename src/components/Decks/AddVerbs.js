import React from 'react'
import Verbs from './Verbs'
import { useState } from 'react'
import Button from '../Button'

const AddVerbs = ({ deckVerbs, verbs, deckId, deckName, setShowAddVerbs }) => {
const[filterString, setFilterString] = useState('');


    return (
        <div className="container">
            <h1>{`Editing deck: ${deckName} `}</h1>
            <Button text="Back" onClick={() => setShowAddVerbs(false)}/>
            <h1>Add/Remove Verbs</h1>
            <h1>{ deckId }</h1>
            <h3 className="verb"> <input className="search-box" type="text" id="myInput" onChange={(e) => setFilterString(e.target.value.toLowerCase())} value={filterString} placeholder="Search for verbs.."></input></h3>
            <div className="verbs-container">
                    <div className="add-verbs-container">
                        <Verbs verbs={verbs} filterString = {filterString}/>
                    </div>
                    <h3>Deck: </h3>
                    <div className="current-verbs-container">
                        <Verbs verbs={deckVerbs}/>
                    </div>
            </div>
        </div>
    )
}

export default AddVerbs
