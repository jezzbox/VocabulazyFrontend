import Button from '../components/Button'
const Flashcard = ({ flashcard, showVerb,setShowVerb }) => {

    const minutes = Math.floor(flashcard.startTime / 6000)
    const seconds = Math.floor((flashcard.startTime / 100) - minutes * 60)
    const timeString = minutes + ':' + seconds
    return (
        <>
            <div className = "card">
                <h1 className="text-4xl">{flashcard.spanishPhrase}</h1>
                <h1 className="text-2xl"><em><strong>({flashcard.wordFromPhrase})</strong></em></h1>
            </div>

            <div className = {!showVerb ? "card text-xl bg-gray-300" : "card text-2xl bg-white"}>
            {showVerb ?
             <>
                <h2 className="text-2xl">... {flashcard.englishPhrase} ...</h2>
                    <h2 className="text-lg">{flashcard.word}</h2>
                    {flashcard.wordType === 'verb' && <> 
                        <h2 className="text-lg">{flashcard.conjugationTense} {flashcard.conjugationForm} {flashcard.conjugationType}</h2>
                    </>}
                <h2 className="text-lg italic">{flashcard.showTitle} - Season {flashcard.seasonNumber}, episode {flashcard.episodeNumber}, {timeString} (mm:ss)</h2>
            </>
            : <Button text="Show" onClick={() => setShowVerb(!showVerb)} />}
            </div>
        </>
    )
}

export default Flashcard
