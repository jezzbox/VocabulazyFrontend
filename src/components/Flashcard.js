const Flashcard = ({ flashcard }) => {
    return (
        <div>
            <h1>{flashcard.phrase}</h1>
            <h2>{flashcard.verb}</h2>
        </div>
    )
}

export default Flashcard
