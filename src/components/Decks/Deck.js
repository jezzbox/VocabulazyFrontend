import Button from '../Button'
import AddVerbs from './AddVerbs'
import { useState } from 'react'


const Deck = ({ setCurrentDeck, verbs, deckVerbs, deck }) => {
    const[showAddVerbs, setShowAddVerbs] = useState(false);

    const onClick = () => {
        setShowAddVerbs(!showAddVerbs)
        setCurrentDeck(deck)
    }

    return (
        <>
        {showAddVerbs && <AddVerbs verbs = {verbs} deckVerbs={deckVerbs} deckId={deck.deckId} deckName={deck.deckName} setShowAddVerbs={setShowAddVerbs} />}
        {!showAddVerbs && (
            <div className="deck-container">
                <h3 className="deck-title">{deck.deckName}</h3>
                <div>
                    <Button  color = "steelblue" text="Add/Remove Words" onClick={onClick}/>
                    <Button text="Edit settings"/>
                </div>
            
            </div>
        )}
        </>
    )
}

export default Deck