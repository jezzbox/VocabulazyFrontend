import DEFAULT_DECK_SETTINGS from '../Constants/DEFAULT_DECK_SETTINGS'
const generateParameterUrl = (currentDeck=DEFAULT_DECK_SETTINGS) => {
    var parameterUrl = '?'
    for (let [key, value] of Object.entries(DEFAULT_DECK_SETTINGS)) {
        if(currentDeck[key] === false) {
            parameterUrl += `${key}=${value}&`
        }
    }
    parameterUrl = parameterUrl.slice(0,-1)
    return parameterUrl
}

export default generateParameterUrl
