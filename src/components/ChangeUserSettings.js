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
                  <div className="flex justify-center p-4 text-lg">
                    <p>here you can customize your user settings and deck modifiers (only change these if you know what you're doing)</p>
                  </div>
                  
                  <div className="flex justify-evenly">
                  <fieldset className="form-fieldset">
                  <legend className="bg-bookBlue py-2 px-4 rounded-full text-white text-center">User</legend>
                    <div className='flex flex-col mb-4'>
                      <label className="mb-2  text-2xl">Display name</label>
                      <input className="border py-2 px-3"
                        type='text'
                        placeholder={displayName ? displayName : ''}
                        value={displayName ? displayName : ''}
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                    </div>
                    <div className='flex flex-col mb-4'>
                        <label className="mb-2  text-2xl">Default deck</label>
                        <select className="border py-2 px-3" value={defaultDeckId} onChange={(e) => setDefaultDeckId(e.target.value)}>
                            {userProfile.decks.map((deck) => (
                                <option key={deck.deckId} value={deck.deckId}>{deck.name}</option>
                            ))}
                        </select>
                      </div>
                  </fieldset>
          <fieldset className="form-fieldset">
            <legend className="bg-bookBlue p-2 rounded-full text-white text-center">New cards</legend>
            <div>
                <div className='flex flex-col mb-4'>
                <label className="mb-2  text-2xl">Steps</label>
                <input className="border py-2 px-3"
                  type='text'
                  placeholder={steps}
                  value={steps}
                  onChange={(e) => setSteps(e.currentTarget.value)}
                />
              </div>

              <div className='flex flex-col mb-4'>
                <label className="mb-2  text-2xl">Max new cards per day</label>
                <input className="border py-2 px-3"
                  type='number'
                  placeholder={newCardsPerDay}
                  value={newCardsPerDay}
                  onChange={(e) => setNewCardsPerDay(e.currentTarget.value)}
                />
              </div>
              <div className='flex flex-col mb-4'>
                <label className="mb-2  text-2xl">Graduating interval (days)</label>
                <input className="border py-2 px-3"
                  type='number'
                  value={graduatingInterval}
                  onChange={(e) => setGraduatingInterval(e.currentTarget.value)}
                />
              </div>
              <div className='flex flex-col mb-4'>
                <label className="mb-2  text-2xl">Easy interval (days)</label>
                <input className="border py-2 px-3"
                  type='number'
                  value={easyInterval}
                  onChange={(e) => setEasyInterval(e.currentTarget.value)}
                />
              </div>

              <div className='flex flex-col mb-4'>
                <label className="mb-2  text-2xl">Starting ease (%)</label>
                <input className="border py-2 px-3"
                  type='number'
                  value={startingEase}
                  onChange={(e) => setStartingEase(e.currentTarget.value)}
                />
              </div>
            </div>
          </fieldset>
          <fieldset className="form-fieldset">
            <legend className="bg-bookBlue p-2 rounded-full text-white text-center">Review Cards</legend>
            <div>
            <div className='flex flex-col mb-4'>
                <label className="mb-2 text-2xl">Maximum reviews per day</label>
                <input className="border py-2 px-3"
                  type='number'
                  value={reviewsPerDay}
                  onChange={(e) => setReviewsPerDay(e.currentTarget.value)}
                />
              </div>

              <div className='flex flex-col mb-4'>
                <label className="mb-2 text-2xl">Easy bonus (%)</label>
                <input className="border py-2 px-3"
                  type='number'
                  value={easyBonus}
                  onChange={(e) => setEasyBonus(e.currentTarget.value)}
                />
              </div>

              <div className='flex flex-col mb-4'>
                <label className="mb-2 text-2xl">Interval modifier (%)</label>
                <input className="border py-2 px-3"
                  type='number'
                  value={intervalModifier}
                  onChange={(e) => setIntervalModifier(e.currentTarget.value)}
                />
              </div>

              <div className='flex flex-col mb-4'>
                <label className="mb-2 text-2xl">Maximum interval</label>
                <input className="border py-2 px-3"
                  type='number'
                  value={maximumInterval}
                  onChange={(e) => setMaximumInterval(e.currentTarget.value)}
                />
              </div>
              
            </div>
          </fieldset>
        </div>

                  <div className="flex justify-center mt-4">
                    <Link to="/home" className="btn" >Back</Link>
                    <input type='submit' value='Save settings' className='btn border border-terraCotta-500' />
                  </div>
                </form>
              </>
            )

}

export default ChangeUserSettings
