import { useState } from 'react'

const AddDeck = ({ decks, setDecks, setCurrentDeck, setCurrentFlashcards, setShowAddDeck, showAddFlashcards, setShowAddFlashcards, userProfile }) => {
  const [name, setName] = useState('')
  const [useSubjunctive, setUseSubjunctive] = useState(true)
  const [useIndicative, setUseIndicative] = useState(true)
  const [useImperative, setUseImperative] = useState(true)
  const [useParticiple, setUseParticiple] = useState(true)
  const [usePreterite, setUsePreterite] = useState(true)
  const [useImperfect, setUseImperfect] = useState(true)
  const [useFuture, setUseFuture] = useState(true)
  const [usePresent, setUsePresent] = useState(true)
  const [isDefault, setIsDefault] = useState(false)
  const [useInfinitive, setUseInfinitive] = useState(true);
  const [useYo, setUseYo] = useState(true);
  const [useTu, setUseTu] = useState(true);
  const [useEl, setUseEl] = useState(true);
  const [useVos, setUseVos] = useState(true);
  const [useEllos, setUseEllos] = useState(true);
  const [useNosotros, setUseNosotros] = useState(true);
  const [useVosotros, setUseVosotros] = useState(true);

  //add deck
  const addDeck = async (deck) => {
    const res = await fetch('https://localhost:44386/api/decks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(deck)
    })

    const data = await res.json()
    setDecks([...decks, data])
    setCurrentDeck(data)
    setCurrentFlashcards([])
    alert(`Deck ${data.name} created! now add some verbs.`)
    setShowAddFlashcards(true)
    setShowAddDeck(false)

  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (!name) {
      alert('Please add a deck name')
      return
    }
    const userId = userProfile.userId
    addDeck({
      name, userId, useSubjunctive, useInfinitive, useIndicative, useImperative, useParticiple, usePreterite, useImperfect, useFuture, usePresent,
      useYo, useTu, useEl, useVos, useEllos, useNosotros, useVosotros, isDefault
    })
    setName('')


  }

  return (<>
    {!showAddFlashcards &&
      <>
      <h1>Create new deck</h1>
        <form className='add-form' onSubmit={onSubmit}>
          <fieldset>
          <div className='form-control'>
            <label>Deck name</label>
            <input
              type='text'
              placeholder='My first deck'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="center">
          <div className='form-control form-control-check'>
            <label>set as default deck</label>
            <input
              type='checkbox'
              checked={isDefault}
              value={isDefault}
              onChange={(e) => setIsDefault(e.currentTarget.checked)}
            />
          </div>
          </div>
          </fieldset>
          <p>You can customise the type of verb conjugations you will see below. Make sure that the forms and tenses are compatible (for example if you only tick subjunctive and preterite, nothing will come up as subjunctive has no preterite form).</p>
          <fieldset>
            <legend>Verb forms:</legend>
            <div className="center">
              <div className='form-control form-control-check'>
                <label>Infinitive</label>
                <input
                  type='checkbox'
                  checked={useInfinitive}
                  value={useInfinitive}
                  onChange={(e) => setUseInfinitive(e.currentTarget.checked)}
                />
              </div>
              <div className='form-control form-control-check'>
                <label>Subjunctive</label>
                <input
                  type='checkbox'
                  checked={useSubjunctive}
                  value={useSubjunctive}
                  onChange={(e) => setUseSubjunctive(e.currentTarget.checked)}
                />
              </div>
              <div className='form-control form-control-check'>
                <label>Indicative</label>
                <input
                  type='checkbox'
                  checked={useIndicative}
                  value={useIndicative}
                  onChange={(e) => setUseIndicative(e.currentTarget.checked)}
                />
              </div>
              <div className='form-control form-control-check'>
                <label>Imperative</label>
                <input
                  type='checkbox'
                  checked={useImperative}
                  value={useImperative}
                  onChange={(e) => setUseImperative(e.currentTarget.checked)}
                />
              </div>
              <div className='form-control form-control-check'>
                <label>Participle</label>
                <input
                  type='checkbox'
                  checked={useParticiple}
                  value={useParticiple}
                  onChange={(e) => setUseParticiple(e.currentTarget.checked)}
                />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Verb tenses:</legend>
            <div className="center">
              <div className='form-control form-control-check'>
                <label>Preterite</label>
                <input
                  type='checkbox'
                  checked={usePreterite}
                  value={usePreterite}
                  onChange={(e) => setUsePreterite(e.currentTarget.checked)}
                />
              </div>
              <div className='form-control form-control-check'>
                <label>Imperfect</label>
                <input
                  type='checkbox'
                  checked={useImperfect}
                  value={useImperfect}
                  onChange={(e) => setUseImperfect(e.currentTarget.checked)}
                />
              </div>
              <div className='form-control form-control-check'>
                <label>Future</label>
                <input
                  type='checkbox'
                  checked={useFuture}
                  value={useFuture}
                  onChange={(e) => setUseFuture(e.currentTarget.checked)}
                />
              </div>
              <div className='form-control form-control-check'>
                <label>Present</label>
                <input
                  type='checkbox'
                  checked={usePresent}
                  value={usePresent}
                  onChange={(e) => setUsePresent(e.currentTarget.checked)}
                />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Verb verbs:</legend>
            <div className="center">
              <div className='form-control form-control-check'>
                <label>Yo</label>
                <input
                  type='checkbox'
                  checked={useYo}
                  value={useYo}
                  onChange={(e) => setUseYo(e.currentTarget.checked)}
                />
              </div>
              <div className='form-control form-control-check'>
                <label>Tú</label>
                <input
                  type='checkbox'
                  checked={useTu}
                  value={useTu}
                  onChange={(e) => setUseTu(e.currentTarget.checked)}
                />
              </div>
              <div className='form-control form-control-check'>
                <label>Vos</label>
                <input
                  type='checkbox'
                  checked={useVos}
                  value={useVos}
                  onChange={(e) => setUseVos(e.currentTarget.checked)}
                />
              </div>
              <div className='form-control form-control-check'>
                <label>Él/Ella/Usted</label>
                <input
                  type='checkbox'
                  checked={useEl}
                  value={useEl}
                  onChange={(e) => setUseEl(e.currentTarget.checked)}
                />
              </div>
              <div className='form-control form-control-check'>
                <label>Ellos/Ellas/Ustedes</label>
                <input
                  type='checkbox'
                  checked={useEllos}
                  value={useEllos}
                  onChange={(e) => setUseEllos(e.currentTarget.checked)}
                />
              </div>
              <div className='form-control form-control-check'>
                <label>Nosotros/Nosotras</label>
                <input
                  type='checkbox'
                  checked={useNosotros}
                  value={useNosotros}
                  onChange={(e) => setUseNosotros(e.currentTarget.checked)}
                />
              </div>
              <div className='form-control form-control-check'>
                <label>Vosotros/Vosotras</label>
                <input
                  type='checkbox'
                  checked={useVosotros}
                  value={useVosotros}
                  onChange={(e) => setUseVosotros(e.currentTarget.checked)}
                />
              </div>

            </div>
          </fieldset>
          <input type='submit' value='Save Deck' className='btn btn-block' />
        </form>
      </>}
  </>
  )
}

export default AddDeck