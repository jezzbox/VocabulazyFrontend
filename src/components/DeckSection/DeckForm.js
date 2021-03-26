import { useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import initialDeckSettings from './InitialDeckSettings'
import { Link } from 'react-router-dom'

const DeckForm = ({ deck=initialDeckSettings
, processDeck, onClickBack , headerText}) => {
  const [name, setName] = useState(deck.name)
  const [useSubjunctive, setUseSubjunctive] = useState(deck.useSubjunctive)
  const [useIndicative, setUseIndicative] = useState(deck.useIndicative)
  const [useImperative, setUseImperative] = useState(deck.useImperative)
  const [useParticiple, setUseParticiple] = useState(deck.useParticiple)
  const [usePreterite, setUsePreterite] = useState(deck.usePreterite)
  const [useImperfect, setUseImperfect] = useState(deck.useImperfect)
  const [useFuture, setUseFuture] = useState(deck.useFuture)
  const [usePresent, setUsePresent] = useState(deck.usePresent)
  const [isDefault, setIsDefault] = useState(deck.IsDefault)
  const [useInfinitive, setUseInfinitive] = useState(deck.useInfinitive);
  const [useYo, setUseYo] = useState(deck.useYo);
  const [useTu, setUseTu] = useState(deck.useTu);
  const [useEl, setUseEl] = useState(deck.useEl);
  const [useVos, setUseVos] = useState(deck.useVos);
  const [useEllos, setUseEllos] = useState(deck.useEllos);
  const [useNosotros, setUseNosotros] = useState(deck.useNosotros);
  const [useVosotros, setUseVosotros] = useState(deck.useVosotros);

  const onSubmit = (e) => {
    e.preventDefault()

    const clickYes = () => {
      processDeck({
        name, useSubjunctive, useInfinitive, useIndicative, useImperative, useParticiple, usePreterite, useImperfect, useFuture, usePresent,
        useYo, useTu, useEl, useVos, useEllos, useNosotros, useVosotros
      })
    }

    const clickNo = () => {
      return
    }

    confirmAlert({
      title: 'Confirm',
      message: 'Confirm settings?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => clickYes()
        },
        {
          label: 'No',
          onClick: () => clickNo()
        }
      ]
    });

  }


  return (
    <>
    <header>
          <h4>{headerText}</h4>
    </header>
      <form className='add-form' onSubmit={onSubmit}>
        <fieldset className="fieldset-container default-deck">
          <div className='form-control'>
            <label>Deck name</label>
            <input
              type='text'
              placeholder={deck.name ? deck.name : 'My first deck'}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='form-control form-control-check default-deck'>
              <label className="center">Default deck</label>
              <input
                type='checkbox'
                checked={isDefault}
                value={isDefault}
                onChange={(e) => setIsDefault(e.currentTarget.checked)}
              />
            </div>
        </fieldset>
        <div className="center">
          <h4>Verb settings</h4>
        </div>
        <p>You can customise the type of verb conjugations you will see below. Make sure that the forms and tenses are compatible (for example if you only tick subjunctive and preterite, nothing will come up as subjunctive has no preterite form).</p>
        <div className="fieldset-container">
          <fieldset className="deck-fieldset">
            <legend>Forms:</legend>
            <div>
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
          <fieldset className="deck-fieldset">
            <legend>Tenses:</legend>
            <div>
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
          <fieldset className="deck-fieldset">
            <legend>Conjugations:</legend>
            <div>
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
        </div>
        <div className="center">
          <Link to="/home" className="back-link">Back</Link>
          <input type='submit' value='Save Deck' className='btn btn-block' />
        </div>
      </form>
    </>
  )
}

export default DeckForm
