const Flashcard = ({ flashcard, showVerb }) => {
    const splitPhrase =  flashcard.spanishPhrase.split(flashcard.word,2)
    return (
        <div>
            <h1>{splitPhrase[0]}<em><strong> {flashcard.word} </strong></em>{splitPhrase[1]}</h1>
            {showVerb && <h2>{flashcard.englishPhrase}</h2>}
            {showVerb && flashcard.wordType === 'verb' && <h2>{flashcard.word} - {flashcard.conjugationTense} {flashcard.conjugationForm} {flashcard.conjugationType}</h2>}
        </div>
    )
}

export default Flashcard
