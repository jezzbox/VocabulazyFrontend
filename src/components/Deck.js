import Button from './Button'

const Deck = ({ deck }) => {
    return (
        <div className="deck-container">
            <h3 className="deck-title">{deck.deckName}</h3>
            <div>
                <Button  color = "steelblue" text="Add Words"/>
                <Button text="Edit settings"/>
            </div>
        </div>
    )
}

export default Deck