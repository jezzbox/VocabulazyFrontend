import React from 'react'
import SearchResults from './SearchResults'
import { useState, useEffect } from 'react'

const AddFlashcards = () => {
    const [filterString, setFilterString] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchResult.length > 0) {
            setIsLoading(false)
            setShowResult(true)
        }
    }, [searchResult])

    const getSearchResult = async (word) => {
        const url = `https://localhost:44386/api/Vocabulazy/words?word=${word}`
        const res = await fetch(url)
        const data = await res.json()
        return data
    }
    const onSubmit = async (e) => {
        e.preventDefault()

        setIsLoading(true)
        if (filterString === null | filterString.length === 0) {
            alert("please add a search value")
            return
        }
        const searchResultFromServer = await getSearchResult(filterString)
        setSearchResult(searchResultFromServer)
        console.log(searchResult)
    }


    return (
        <>
            <form className='add-form' onSubmit={onSubmit}>
                <div className='form-control'>
                    <input
                        type='text'
                        placeholder='Search words'
                        value={filterString}
                        onChange={(e) => setFilterString(e.target.value)}
                    />
                </div>
                <input type='submit' value='Search' className='btn btn-block' />
            </form>
            {isLoading && <h1>Loading....</h1>}
            {showResult && <SearchResults searchResults={searchResult} />}
        </>
    )
}

export default AddFlashcards
