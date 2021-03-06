import Button from '../components/Button'
const Word = ({ word, flashcards, setFlashcards, isCurrent }) => {

    const wordInDeck = flashcards ? flashcards.length === 0 ? false : flashcards.some(x => x.word === word.word && x.wordType === word.wordType) ? true : false : false

    const onClick = async () => {
        if(isCurrent) {
            console.log(flashcards)
            setFlashcards(flashcards.filter(x => !(x.word === word.word && x.wordType === word.wordType)))
        }
        else if (wordInDeck) {
            console.log("do nothing")
        }
        else {
            console.log("hello")
            console.log(flashcards)
            console.log(word)
            await setFlashcards([...flashcards,word])
            console.log(flashcards)
        }
        }

    return (
            <tr>
                <th>{word.word}</th>
                <th>{word.wordType}</th>
                <th><Button className="btn btn-word" color={wordInDeck ? "green" : "blueviolet"} text={isCurrent? "Remove" : wordInDeck ? "Added" : "Add"} onClick={() => onClick()} /></th>
            </tr>
        // <div className="word" style={{
        //     borderColor: word.wordType === "Verb" ? "rgb(187, 53, 75)" :
        //     word.wordType === "Adjective" ? "steelblue" :
        //     word.wordType === "Noun" ? "orange" :
        //     word.wordType === "Pronoun" ? "rgb(179, 163, 75)" :
        //     word.wordType === "Preposition" ? "rgb(34, 161, 123)" :
        //     word.wordType === "Conjunction" ? "green" :
        //     word.wordType === "Article" ? "pink" :
        //     word.wordType === "Adverb" ? "blueviolet" : "white"
        // }}>
        //     <div className="word-container">
        //         <h5>{word.word}</h5>
        //         <h6>{word.wordType}</h6>
        //     </div>
        //     <div className="word-container right">
        //         <Button className="btn btn-word" color={wordInDeck ? "green" : "blueviolet"} text={isCurrent? "Remove" : wordInDeck ? "Added" : "Add"} onClick={() => onClick()} />
        //     </div>

        // </div>
    )
}
export default Word