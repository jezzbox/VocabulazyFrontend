import Phrase from './Phrase'

const Phrases = ({ phrases }) => {
    return (
        <>
            {phrases.map((phrase) => (
                <Phrase key={phrase.phraseID} phrase={phrase}/>
            ))}
        </>
    )
}

export default Phrases