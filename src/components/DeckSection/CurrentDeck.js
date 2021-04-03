const CurrentDeck = ({ currentDeck }) => {

    return (
            currentDeck.flashcards &&
            <div className="m-5 w-1/3 rounded-lg shadow-lg bg-white border-2 ">
                    <header className="flex justify-center p-4">
                        <h2 className="text-5xl ">{currentDeck.name}</h2>
                    </header>

                <div className="flex justify-evenly p-4">
                <div>
                    <h4 className="text-3xl">Cards</h4>
                    <h4 className="text-xl text-terraCotta-500 text-center">{currentDeck.flashcards.length}</h4>
                </div>
                <div>
                    <h4 className="text-3xl">Due</h4>
                    <h4 className="text-xl text-terraCotta-500 text-center">{currentDeck.flashcards.filter((flashcard) => flashcard.dueDate <= new Date().toJSON()).length}</h4>
                </div>
                </div>
            </div>
    )
}

export default CurrentDeck
