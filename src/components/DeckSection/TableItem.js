
const TableItem = ({ tableItem, headers }) => {

    return (
            headers.map((header, index) => (
                        <td key={index}>{tableItem[header.objectProperty]}</td>
                        ))

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
export default TableItem