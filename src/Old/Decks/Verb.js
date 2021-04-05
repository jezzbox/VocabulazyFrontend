import Button from '../Button'
const Verb = ({ verb, verbFlashcards, setVerbFlashcards, isCurrent }) => {

    const verbCheck = verbFlashcards.length === 0 ? false : verbFlashcards.some(x => x.verbId === verb.verbId) ? true : false

    const onClick = (isCurrent) => {
        isCurrent ? setVerbFlashcards(verbFlashcards.filter(x => x.verbId !== verb.verbId)) : setVerbFlashcards([...verbFlashcards,verb])
    }

    return (
        <div className="verb-container">
            <h3>{verb.verb}</h3>
            <Button text={verbCheck && !isCurrent ? "Added" : !isCurrent ? "Add" : "Remove"}
                    color={verbCheck ? "green" : !isCurrent ? "steelblue" : "grey"}
                    onClick={verbCheck && !isCurrent ? null : () => onClick(isCurrent) } />
            
        </div>
    )
}

export default Verb