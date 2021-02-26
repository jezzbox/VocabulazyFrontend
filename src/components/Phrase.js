const Phrase = ({ phrase }) => {
    return (
        <div>
            <h3>{phrase.phraseId}</h3>
            <p>{phrase.phrase}</p>
        </div>
    )
}

export default Phrase