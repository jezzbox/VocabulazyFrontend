const Flashcard = ({ flashcard, showVerb }) => {

    const minutes = Math.floor(flashcard.startTime / 6000)
    const seconds = Math.floor((flashcard.startTime / 100) - minutes * 60)
    const timeString = minutes + ':' + seconds
    return (
        <div>
            <h1>{flashcard.spanishPhrase} <em><strong>({flashcard.word})</strong></em></h1>
            {showVerb && <h2>{flashcard.englishPhrase}</h2>}
            {showVerb && flashcard.wordType === 'verb' && <h2>{flashcard.word} - {flashcard.conjugationTense} {flashcard.conjugationForm} {flashcard.conjugationType}</h2>}
            {showVerb && flashcard.wordType === 'verb' && <h2>{flashcard.showTitle} - Season {flashcard.seasonNumber}, episode {flashcard.episodeNumber}, start time {timeString} Mins</h2>}
        </div>
    )
}

export default Flashcard
