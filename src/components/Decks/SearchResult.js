//import Button from '../Button'
const SearchResult = ({ word, wordType }) => {
    return (
        <div className="verb-container">
            <h2>{word}</h2>
            <h3>{wordType}</h3>
        </div>
    )
}

export default SearchResult