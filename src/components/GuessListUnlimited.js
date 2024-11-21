import React from 'react'
import GuessBoxUnlimited from './GuessBoxUnlimited'

const GuessListUnlimited = ({guesses, resultColors, showOriginal}) => {
    const addResultColorLine = (line) => {
        resultColors.push(line)
        
    }

    return (
        <div>
            {[...Array(6)].map((_, i) =>
                <GuessBoxUnlimited key={i} guess={guesses[i]} index={i} addResultColorLine={addResultColorLine} showOriginal={showOriginal}></GuessBoxUnlimited>
            )}

        </div>
    )
}

export default GuessListUnlimited