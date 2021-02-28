import { useState } from 'react'

const AddDeck = ({ addDeck, userUrl }) => {
  const [deckName, setDeckName] = useState('')
  const [useSubjunctive, setUseSubjunctive] = useState(true)
  const [useIndicative, setUseIndicative] = useState(true)
  const [useImperative, setUseImperative] = useState(true)
  const [useParticiple, setUseParticiple] = useState(true)
  const [usePreterite, setUsePreterite] = useState(true)
  const [useImperfect, setUseImperfect] = useState(true)
  const [useFuture, setUseFuture] = useState(true)
  const [usePresent, setUsePresent] = useState(true)


  const onSubmit = (e) => {
    e.preventDefault()

    if (!deckName) {
      alert('Please add a task')
      return
    }
    const userId = userUrl
    addDeck({ deckName, userId, useSubjunctive, useIndicative, useImperative, useParticiple, usePreterite, useImperfect, useFuture, usePresent })

    setDeckName('')
    

  }

  return (
    <form className='add-form' onSubmit={onSubmit}>
      <div className='form-control'>
        <label>Deck name</label>
        <input
          type='text'
          placeholder='My first deck'
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
        />
      </div>
      <div className='form-control form-control-check'>
        <label>Subjunctive:</label>
        <input
          type='checkbox'
          checked={useSubjunctive}
          value={useSubjunctive}
          onChange={(e) => setUseSubjunctive(e.currentTarget.checked)}
        />
      </div>
      <div className='form-control form-control-check'>
        <label>Indicative:</label>
        <input
          type='checkbox'
          checked={useIndicative}
          value={useIndicative}
          onChange={(e) => setUseIndicative(e.currentTarget.checked)}
        />
      </div>
      <div className='form-control form-control-check'>
        <label>Imperative:</label>
        <input
          type='checkbox'
          checked={useImperative}
          value={useImperative}
          onChange={(e) => setUseImperative(e.currentTarget.checked)}
        />
      </div>
      <div className='form-control form-control-check'>
        <label>Participle:</label>
        <input
          type='checkbox'
          checked={useParticiple}
          value={useParticiple}
          onChange={(e) => setUseParticiple(e.currentTarget.checked)}
        />
      </div>
      <div className='form-control form-control-check'>
        <label>Preterite:</label>
        <input
          type='checkbox'
          checked={usePreterite}
          value={usePreterite}
          onChange={(e) => setUsePreterite(e.currentTarget.checked)}
        />
      </div>
      <div className='form-control form-control-check'>
        <label>Imperfect:</label>
        <input
          type='checkbox'
          checked={useImperfect}
          value={useImperfect}
          onChange={(e) => setUseImperfect(e.currentTarget.checked)}
        />
      </div>
      <div className='form-control form-control-check'>
        <label>Future:</label>
        <input
          type='checkbox'
          checked={useFuture}
          value={useFuture}
          onChange={(e) => setUseFuture(e.currentTarget.checked)}
        />
      </div>
      <div className='form-control form-control-check'>
        <label>Present:</label>
        <input
          type='checkbox'
          checked={usePresent}
          value={usePresent}
          onChange={(e) => setUsePresent(e.currentTarget.checked)}
        />
      </div>
      

      <input type='submit' value='Save Deck' className='btn btn-block' />
    </form>
  )
}

export default AddDeck