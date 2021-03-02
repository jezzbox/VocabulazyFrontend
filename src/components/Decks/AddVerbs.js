import React from 'react'
import Verbs from './Verbs'
import CurrentVerbs from './CurrentVerbs'
import { useState } from 'react'
import Button from '../Button'

const AddVerbs = ({ updateDeckVerbs, setDeckVerbs, deckVerbs, verbs, deckId, deckName, setShowAddVerbs }) => {
const[filterString, setFilterString] = useState('');

const onClick = () => {
    if(window.confirm('Are you sure? progress for removed verbs will be lost')) {
        updateDeckVerbs(deckId)
    }
    
}

    return (
        <div className="container">
            <h1>{`Editing deck: ${deckName} `}</h1>
            <Button text="Back" onClick={() => setShowAddVerbs(false)}/>
            <h1>Add/Remove Verbs</h1>
            <h1>{ deckId }</h1>
            <h3 className="verb"> <input className="search-box" type="text" id="myInput" onChange={(e) => setFilterString(e.target.value.toLowerCase())} value={filterString} placeholder="Search for verbs.."></input></h3>
            <div className="verbs-container">
                    <div className="add-verbs-container">
                        <Verbs verbs={verbs} filterString = {filterString} deckVerbs={deckVerbs} setDeckVerbs={setDeckVerbs}/>
                    </div>
                    <h3>Deck: </h3>
                    <div className="current-verbs-container">
                        <CurrentVerbs deckVerbs={deckVerbs} setDeckVerbs={setDeckVerbs}/>
                    </div>
            </div>
            <Button text="Submit" onClick={onClick} />
        </div>
    )
}

export default AddVerbs
