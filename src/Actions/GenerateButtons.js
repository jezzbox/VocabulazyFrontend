import Button from '../components/Button'

const generateButtons = (data, currentFlashcards=null,onClickButon ) => {
    var i;
    const processedData = [];

    for(i=0;i<data.length;i++) {
        const dataItem = data[i]
        const flashcardInDeck = !currentFlashcards ? null : currentFlashcards.some(x => x.word === dataItem.word && x.wordType === dataItem.wordType) ? true : false
        dataItem.button = 
            <Button 
            text={!currentFlashcards ? "Remove" : flashcardInDeck ? "Added" : "Add"}
            color={currentFlashcards && !flashcardInDeck ? "Green" : "#85144b"}
            onClick={() => onClickButon(dataItem,currentFlashcards ? currentFlashcards: data,currentFlashcards ? "Add" : "Remove")}/>
            processedData.push(dataItem)
                }
            return processedData

}

  export default generateButtons
