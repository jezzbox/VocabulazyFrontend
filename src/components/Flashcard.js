const Flashcard = ({ flashcard, showVerb }) => {
    return (
        <div>
            <h1>{flashcard.phrase}</h1>
            {showVerb && <h2>{flashcard.word}</h2>}
        </div>
    )
}

export default Flashcard
