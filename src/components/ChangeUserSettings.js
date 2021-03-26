import { useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Link } from 'react-router-dom'

const ChangeUserSettings = ({userProfile, setUpdatedUserProfile}) => {
            const [displayName, setDisplayName] = useState(userProfile.displayName)
            const [defaultDeckId, setDefaultDeckId] = useState(userProfile.defaultDeckId ? userProfile.defaultDeckId : undefined)
            const [newCardsPerDay, setNewCardsPerDay] = useState(userProfile.newCardsPerDay)
            const [graduatingInterval, setGraduatingInterval] = useState(userProfile.graduatingInterval)
            const [easyInterval, setEasyInterval] = useState(userProfile.easyInterval)
            const [startingEase, setStartingEase] = useState(userProfile.startingEase)
            const [steps, setSteps] = useState(userProfile.steps)
            const [reviewsPerDay, setReviewsPerDay] = useState(userProfile.reviewsPerDay)
            const [easyBonus, setEasyBonus] = useState(userProfile.easyBonus)
            const [intervalModifier, setIntervalModifier] = useState(userProfile.intervalModifier);
            const [maximumInterval, setMaximumInterval] = useState(userProfile.maximumInterval);

            const onSubmit = (e) => {
              e.preventDefault()
          
              const clickYes = () => {
                const userId = userProfile.userId
                  const updatedUser = { userId,
                    displayName, defaultDeckId, newCardsPerDay, graduatingInterval, easyInterval, startingEase, steps, reviewsPerDay, easyBonus, intervalModifier,
                    maximumInterval
                }
                console.log(updatedUser)
                setUpdatedUserProfile(updatedUser)
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
                    <h4>Edit user settings:</h4>
              </header>
                <form className='add-form' onSubmit={onSubmit}>
                  <fieldset className="fieldset-container default-deck">
                    <div className='form-control'>
                      <label>Display name</label>
                      <input
                        type='text'
                        placeholder={displayName ? displayName : ''}
                        value={displayName ? displayName : ''}
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                    </div>
                    <div className='form-control form-control-check default-deck'>
                        <label className="center">Default deck</label>
                        <select value={defaultDeckId} onChange={(e) => setDefaultDeckId(e.target.value)}>
                            {userProfile.decks.map((deck) => (
                                <option key={deck.deckId} value={deck.deckId}>{deck.name}</option>
                            ))}
                        </select>
                      </div>
                  </fieldset>
                  <div className="center">
          <h4>Flashcard options</h4>
        </div>
        <p>Here you can customize how your flashcards work. ONLY CHANGE THESE IF YOU KNOW WHAT YOU ARE DOING. </p>
                  <div className="fieldset-container">
          <fieldset className="deck-fieldset">
            <legend>New cards:</legend>
            <div>
                <div className='form-control form-control'>
                <label>Steps</label>
                <input
                  type='text'
                  placeholder={steps}
                  value={steps}
                  onChange={(e) => setSteps(e.currentTarget.value)}
                />
              </div>

              <div className='form-control form-control'>
                <label>Max new cards per day</label>
                <input
                  type='number'
                  placeholder={newCardsPerDay}
                  value={newCardsPerDay}
                  onChange={(e) => setNewCardsPerDay(e.currentTarget.value)}
                />
              </div>
              <div className='form-control form-control'>
                <label>Graduating interval (days)</label>
                <input
                  type='number'
                  value={graduatingInterval}
                  onChange={(e) => setGraduatingInterval(e.currentTarget.value)}
                />
              </div>
              <div className='form-control form-control'>
                <label>Easy interval (days)</label>
                <input
                  type='number'
                  value={easyInterval}
                  onChange={(e) => setEasyInterval(e.currentTarget.value)}
                />
              </div>

              <div className='form-control form-control'>
                <label>Starting ease (%)</label>
                <input
                  type='number'
                  value={startingEase}
                  onChange={(e) => setStartingEase(e.currentTarget.value)}
                />
              </div>
            </div>
          </fieldset>
          <fieldset className="deck-fieldset">
            <legend>Review Cards:</legend>
            <div>
            <div className='form-control form-control'>
                <label>Maximum reviews per day</label>
                <input
                  type='number'
                  value={reviewsPerDay}
                  onChange={(e) => setReviewsPerDay(e.currentTarget.value)}
                />
              </div>

              <div className='form-control form-control'>
                <label>Easy bonus (%)</label>
                <input
                  type='number'
                  value={easyBonus}
                  onChange={(e) => setEasyBonus(e.currentTarget.value)}
                />
              </div>

              <div className='form-control form-control'>
                <label>Interval modifier (%)</label>
                <input
                  type='number'
                  value={intervalModifier}
                  onChange={(e) => setIntervalModifier(e.currentTarget.value)}
                />
              </div>

              <div className='form-control form-control'>
                <label>Maximum interval</label>
                <input
                  type='number'
                  value={maximumInterval}
                  onChange={(e) => setMaximumInterval(e.currentTarget.value)}
                />
              </div>
              
            </div>
          </fieldset>
        </div>

                  <div className="center">
                    <Link to="/home" className="back-link">Back</Link>
                    <input type='submit' value='Save settings' className='btn btn-block' />
                  </div>
                </form>
              </>
            )

}

export default ChangeUserSettings
