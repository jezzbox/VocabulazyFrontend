import { useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import initialDeckSettings from '../../Constants/DEFAULT_DECK_SETTINGS'

const DeckForm = ({ deck=initialDeckSettings
, processDeck, isDefault}) => {
  const [name, setName] = useState(deck.name)
  const [useSubjunctive, setUseSubjunctive] = useState(deck.useSubjunctive)
  const [useIndicative, setUseIndicative] = useState(deck.useIndicative)
  const [useImperative, setUseImperative] = useState(deck.useImperative)
  const [useParticiple, setUseParticiple] = useState(deck.useParticiple)
  const [usePreterite, setUsePreterite] = useState(deck.usePreterite)
  const [useImperfect, setUseImperfect] = useState(deck.useImperfect)
  const [useFuture, setUseFuture] = useState(deck.useFuture)
  const [usePresent, setUsePresent] = useState(deck.usePresent)
  const [isDefaultDeck, setIsDefaultDeck] = useState(isDefault)
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
      },isDefaultDeck)
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
      <form className='bg-gray-100' onSubmit={onSubmit}>
        <fieldset className="flex justify-evenly bg-white border-b border-bookBlue p-4 ">
          <div className='flex flex-col mb-4'>
            <label className="mb-2 font-semibold text-2xl">Deck name</label>
            <input className="border py-2 px-3"
              type='text'
              placeholder={deck.name ? deck.name : 'My first deck'}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='flex flex-col mb-4'>
              <label className="mb-4 font-semibold text-2xl">Default deck</label>
              <input className="form-check-input"
                type='checkbox'
                checked={isDefaultDeck}
                value={isDefaultDeck}
                onChange={(e) => setIsDefaultDeck(e.currentTarget.checked)}
              />
            </div>
        </fieldset>
        <div className="flex justify-center">
          <h4 className="text-3xl p-2">Verb settings</h4>
        </div>
        <p className="text-xl p-4">You can customise the type of verb conjugations you will see below. Make sure that the forms and tenses are compatible (for example if you only tick subjunctive and preterite, nothing will come up as subjunctive has no preterite form).</p>
        <div className="flex justify-around py-4">
          <fieldset className="form-fieldset w-1/4 shadow-md">
            <h1 className="font-bold text-2xl  pb-2 text-center">Forms</h1>
            <div>
              <div className='form-check'>
                <label className="form-check-label">Infinitive</label>
                <input className="form-check-input"
                  type='checkbox'
                  checked={useInfinitive}
                  value={useInfinitive}
                  onChange={(e) => setUseInfinitive(e.currentTarget.checked)}
                />
              </div>
              <div className='form-check'>
                <label className="form-check-label">Subjunctive</label>
                <input className="form-check-input"
                  type='checkbox'
                  checked={useSubjunctive}
                  value={useSubjunctive}
                  onChange={(e) => setUseSubjunctive(e.currentTarget.checked)}
                />
              </div>
              <div className='form-check'>
                <label className="form-check-label">Indicative</label>
                <input className="form-check-input"
                  type='checkbox'
                  checked={useIndicative}
                  value={useIndicative}
                  onChange={(e) => setUseIndicative(e.currentTarget.checked)}
                />
              </div>
              <div className='form-check'>
                <label className="form-check-label">Imperative</label>
                <input className="form-check-input"
                  type='checkbox'
                  checked={useImperative}
                  value={useImperative}
                  onChange={(e) => setUseImperative(e.currentTarget.checked)}
                />
              </div>
              <div className='form-check'>
                <label className="form-check-label">Participle</label>
                <input className="form-check-input"
                  type='checkbox'
                  checked={useParticiple}
                  value={useParticiple}
                  onChange={(e) => setUseParticiple(e.currentTarget.checked)}
                />
              </div>
            </div>
          </fieldset>
          <fieldset className="form-fieldset w-1/4">
            <h1 className="font-bold text-2xl pb-2 text-center">Tenses</h1>
            <div>
              <div className='form-check'>
                <label className="form-check-label">Preterite</label>
                <input className="form-check-input"
                  type='checkbox'
                  checked={usePreterite}
                  value={usePreterite}
                  onChange={(e) => setUsePreterite(e.currentTarget.checked)}
                />
              </div>
              <div className='form-check'>
                <label className="form-check-label">Imperfect</label>
                <input className="form-check-input"
                  type='checkbox'
                  checked={useImperfect}
                  value={useImperfect}
                  onChange={(e) => setUseImperfect(e.currentTarget.checked)}
                />
              </div>
              <div className='form-check'>
                <label className="form-check-label">Future</label>
                <input className="form-check-input"
                  type='checkbox'
                  checked={useFuture}
                  value={useFuture}
                  onChange={(e) => setUseFuture(e.currentTarget.checked)}
                />
              </div>
              <div className='form-check'>
                <label className="form-check-label">Present</label>
                <input className="form-check-input"
                  type='checkbox'
                  checked={usePresent}
                  value={usePresent}
                  onChange={(e) => setUsePresent(e.currentTarget.checked)}
                />
              </div>
            </div>
          </fieldset>
          <fieldset className="form-fieldset w-1/4">
            <h1 className="font-bold text-2xl pb-2 text-center">Conjugations</h1>
            <div>
              <div className='form-check'>
                <label className="form-check-label">Yo</label>
                <input className="form-check-input"
                  type='checkbox'
                  checked={useYo}
                  value={useYo}
                  onChange={(e) => setUseYo(e.currentTarget.checked)}
                />
              </div>
              <div className='form-check'>
                <label className="form-check-label">Tú</label>
                <input className="form-check-input"
                  type='checkbox'
                  checked={useTu}
                  value={useTu}
                  onChange={(e) => setUseTu(e.currentTarget.checked)}
                />
              </div>
              <div className='form-check'>
                <label className="form-check-label">Vos</label>
                <input className="form-check-input"
                  type='checkbox'
                  checked={useVos}
                  value={useVos}
                  onChange={(e) => setUseVos(e.currentTarget.checked)}
                />
              </div>
              <div className='form-check'>
                <label className="form-check-label">Él/Ella/Usted</label>
                <input className="form-check-input"
                  type='checkbox'
                  checked={useEl}
                  value={useEl}
                  onChange={(e) => setUseEl(e.currentTarget.checked)}
                />
              </div>
              <div className='form-check'>
                <label className="form-check-label">Ellos/Ellas/Ustedes</label>
                <input className="form-check-input"
                  type='checkbox'
                  checked={useEllos}
                  value={useEllos}
                  onChange={(e) => setUseEllos(e.currentTarget.checked)}
                />
              </div>
              <div className='form-check'>
                <label className="form-check-label">Nosotros/Nosotras</label>
                <input className="form-check-input"
                  type='checkbox'
                  checked={useNosotros}
                  value={useNosotros}
                  onChange={(e) => setUseNosotros(e.currentTarget.checked)}
                />
              </div>
              <div className='form-check'>
                <label className="form-check-label">Vosotros/Vosotras</label>
                <input className="form-check-input"
                  type='checkbox'
                  checked={useVosotros}
                  value={useVosotros}
                  onChange={(e) => setUseVosotros(e.currentTarget.checked)}
                />
              </div>

            </div>
          </fieldset>
        </div>
        <div className="mt-4 flex justify-center p-2 bg-white border-t border-bookBlue">
          <input type='submit' value='Save changes' className='btn border-2 border-terraCotta-500' />
        </div>
      </form>
    </>
  )
}

export default DeckForm
