
const processCard = (buttonClicked, flashcard, { intervalModifier = null, learningSteps = null, graduatingInterval = null, easyInterval = null, easyBonus = null }) => {

    const getNewDueDate = (interval) => {
        const currentTime = new Date()
        const dueDate = (new Date(currentTime.setMinutes(currentTime.getMinutes() + interval))).toJSON()
        return dueDate;
    }

    const processLearningCard = (buttonClicked, flashcard, learningSteps, graduatingInterval, easyInterval) => {

        const increment = buttonClicked === "Easy" ? 1 : 0

        //checks if step will graduate card
        if (flashcard.learningStep + increment < learningSteps.length) {

            const nextDue = learningSteps.find((step) => step.stepNumber === flashcard.learningStep + increment + 1).stepInterval
            const newLearningStep = flashcard.learningStep + increment + 1
            const newDueDate = getNewDueDate(nextDue)
            return { newEase: null, newPhase: "Learning", newInterval: null, newLearningStep, newDueDate, newLapseCount: null, newIsSuspended: null }

        }
        else {
            var newInterval = graduatingInterval * 24 * 60;
            if (flashcard.interval > 0) {
                newInterval = flashcard.interval;
            }
            else if (buttonClicked === "Easy" && flashcard.learningStep + 1 === learningSteps.length) {
                newInterval = easyInterval * 24 * 60;
            }

            const newLearningStep = learningSteps.length
            const newDueDate = getNewDueDate(newInterval)
            return { newEase: null, newPhase: "Graduated", newInterval, newLearningStep, newDueDate, newLapseCount: null, newIsSuspended: null }
        }
    }

    const processGraduatedCard = (buttonClicked, flashcard, intervalModifier, easyBonus) => {
      
        const easeToAdd = buttonClicked === "Easy" ? 15 : buttonClicked === "Hard" ? -15 : 0
        const newEase = flashcard.ease + easeToAdd

        const easyBonusModifier = easyBonus ? (easyBonus / 100) : 1
        const easeModifier = buttonClicked === "Hard" ? 120 : flashcard.ease
        const newInterval = (intervalModifier * flashcard.interval * easeModifier * easyBonusModifier) / 10000
        const newDueDate = getNewDueDate(newInterval)


        return { newEase, newPhase: null, newInterval, newLearningStep: null, newDueDate, newLapseCount: null, newIsSuspended: null }

    }

    const processAgainCard = (flashcard, learningSteps) => {
        var newLearningStep = 1;
        var newEase = null;
        var newInterval = null;
        var newLapseCount = null;
        var newIsSuspended = null;

        if (flashcard.phase === "Graduated") {
            newLearningStep = 2
            newEase = flashcard.ease - 20
            newInterval = 1 * 24 * 60
            newLapseCount = flashcard.lapseCount + 1
        }
        if (newLapseCount === 8 || (newLapseCount > 8 && Number.isInteger((newLapseCount - 8) / 4))) {
            newIsSuspended = true;
        }

        const nextDue = learningSteps.find((step) => step.stepNumber === newLearningStep).stepInterval
        const newDueDate = getNewDueDate(nextDue)
        return { newEase, newPhase: "Learning", newInterval, newLearningStep, newDueDate, newLapseCount, newIsSuspended }

    }

    //logic
    if (buttonClicked === "Again") {
        return processAgainCard(flashcard, learningSteps)
    }

    else if (flashcard.phase === "Graduated") {
        return processGraduatedCard(buttonClicked, flashcard, intervalModifier, easyBonus)
    }

    else {
        return processLearningCard(buttonClicked, flashcard, learningSteps, graduatingInterval, easyInterval)
    }
}

export default processCard