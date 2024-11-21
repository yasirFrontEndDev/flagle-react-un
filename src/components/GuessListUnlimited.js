import React from 'react'
import GuessBoxUnlimited from './GuessBoxUnlimited'

const GuessListUnlimited = React.forwardRef(({ guesses, resultColors, showOriginal }, ref) => {
    const addResultColorLine = (line) => {
        resultColors.push(line);
    };

    // Provide a method to clear all canvases
    React.useImperativeHandle(ref, () => ({
        clearAllCanvases: () => {
            guesses.forEach((_, i) => {
                const miniCanvas = document.getElementById(`mini-canvas-${i}`);
                const miniCtx = miniCanvas?.getContext('2d');
                miniCtx?.clearRect(0, 0, miniCanvas.width, miniCanvas.height);

                const fullCanvas = document.getElementById(`full-canvas-${i}`);
                const fullCtx = fullCanvas?.getContext('2d');
                fullCtx?.clearRect(0, 0, fullCanvas.width, fullCanvas.height);
                console.log(miniCanvas , fullCanvas , "GLU");
                console.log(miniCtx , fullCtx , "GLU");
            });
        },
    }));

    return (
        <div>
            {[...Array(6)].map((_, i) => (
                <GuessBoxUnlimited
                    key={i}
                    guess={guesses[i]}
                    index={i}
                    addResultColorLine={addResultColorLine}
                    showOriginal={showOriginal}
                />
            ))}
        </div>
    );
});


export default GuessListUnlimited