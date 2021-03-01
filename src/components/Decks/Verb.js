import Button from '../Button'
const Verb = ({ verb }) => {
    return (
        <div className="verb-container">
            <h3>{verb.verb}</h3>
            <Button text="Add" /> 
        </div>
    )
}

export default Verb