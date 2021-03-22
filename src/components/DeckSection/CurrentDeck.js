import Button from '../Button'
import { useState } from 'react'
const CurrentDeck = ({currentDeck, onClickAddFlashcards, showAddFlashcards}) => {

    return (
            <div className="current-deck">
                <h2>{currentDeck.name}</h2>
                <div>
                    <h4>Words</h4>
                    <h4>23</h4>
                </div>
                <div>
                    <h4>Due</h4>
                    <h4>15</h4>
                </div>
            </div>
    )
}

export default CurrentDeck
