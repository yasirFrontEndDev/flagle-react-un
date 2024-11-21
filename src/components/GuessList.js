import React from 'react'
import GuessBox from './GuessBox'

const GuessList = ({guesses, resultColors, showOriginal}) => {
    const addResultColorLine = (line) => {
        resultColors.push(line)
    }

    return (
        <div>
            {[...Array(6)].map((_, i) =>
                <GuessBox key={i} guess={guesses[i]} index={i} addResultColorLine={addResultColorLine} showOriginal={showOriginal}></GuessBox>
            )}

        </div>
    )
}

export default GuessList