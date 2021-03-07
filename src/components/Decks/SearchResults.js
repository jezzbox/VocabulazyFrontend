import React from 'react'
import SearchResult from './SearchResult'

const SearchResults = ({ searchResults }) => {
    return (
        <div>
            {searchResults.map((searchResult) => (
                <SearchResult key={searchResult.index} word={searchResult.word} wordType={searchResult.wordType} />
            ))}

        </div>
    )
}

export default SearchResults