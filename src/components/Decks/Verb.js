import Button from '../Button'
const Verb = ({ verb, deckVerbs, setDeckVerbs, isCurrent }) => {

    const verbCheck = deckVerbs.length === 0 ? false : deckVerbs.some(x => x.verbId === verb.verbId) ? true : false

    const onClick = (isCurrent) => {
        isCurrent ? setDeckVerbs(deckVerbs.filter(x => x.verbId !== verb.verbId)) : setDeckVerbs([...deckVerbs,verb])
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