import React, { useEffect, useState } from 'react';
import { MarvinImage } from "@rarebearsoft/marvin";
import {isoCountries, getCountryName} from './CountryCodes';
import GuessListUnlimited from './GuessListUnlimited';
import GuessBoxUnlimited from './GuessBoxUnlimited';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import ShareIcon from '@mui/icons-material/Share';
import useTheme from '@mui/material/styles/useTheme';

import {matchSorter} from 'match-sorter'

import Countdown from 'react-countdown';

import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import 'firebase/compat/auth'; 
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { collection, query, where, getDocs } from "firebase/firestore";
import { GetDayNumber, GetNextDay,GetDailyRandom } from './DailyRandom';

firebase.initializeApp({
    apiKey: "AIzaSyCyi2z-RD9WiqhiJcTOoqag1ajsxkFNikI",
    authDomain: "flagle-f0a80.firebaseapp.com",
    projectId: "flagle-f0a80",
    storageBucket: "flagle-f0a80.appspot.com",
    messagingSenderId: "27221976313",
    appId: "1:27221976313:web:88896eda3b7a2540826e28"
});

const firestore = firebase.firestore();

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const GameUnlimited = ({onGameEnd,solution}) => {
    const [currentSolution, setCurrentSolution] = useState(() => {
        // Check if the localStorage key exists and parse it
        const storedSolution = localStorage.getItem('flagle-state-tempSol');
        return storedSolution ? JSON.parse(storedSolution) : solution;
      });    
    const theme = useTheme();
    const size = theme.size;

    const colorThreshold = theme.colorThreshold;
    const canvasWidth = theme.canvasWidth;
    const canvasHeight = theme.canvasHeight;
    const animationsOn = theme.animationsOn;
    const animationLength = theme.animationLength;
    const hardMode = theme.stateHardMode;

    const [inputValue, setInputValue] = useState("");

    const [animate, setAnimate] = useState(false)

    const [alertOpen, setAlertOpen] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertType, setAlertType] = useState("error")

    const [countries, setCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [guesses, setGuesses] = useState([])

    const [state, setState] = useState({})

    const [flagToGuess, setFlagToGuess] = useState(null);
    const [flagToDisplay, setFlagToDisplay] = useState(null);

    const [resultColors, setResultColors] = useState([])

    const [gameOver, setGameOver] = useState(false)
    const [gameLost, setGameLost] = useState()

    const [showOriginal, setShowOriginal] = useState(false)
    const [pauseInterval, setPauseInterval] = useState(false)

    const [counter, setCounter] = useState(0)
    const [timerHover, setTimerHover] = useState(false)

    const [scaled, setScaled] = useState(false)
    const [isUnlimited,setIsUnlimited] = useState(false);
    const statsRef = firestore.collection('stats');
    

    useEffect(() => {
        let tempCountries = Object.keys(isoCountries).map((key) => {
            return { code: key.toLowerCase(), label: isoCountries[key]}
        })
        let sortedCountries = tempCountries.sort((a, b) => {
            let la = a.label
            let lb = b.label
            if (la < lb) return -1
            if (lb < la) return 1
            return 0
        })
        setCountries(sortedCountries)
        let tempFlagToGuess = new MarvinImage();
        tempFlagToGuess.load(require(`../images/flags400/${currentSolution.code}.png`), () => {
            currentSolution.imageData = tempFlagToGuess.imageData.data
            currentSolution.origImageData = tempFlagToGuess.imageData.data
            setFlagToGuess(tempFlagToGuess);
        });
        
        let tempFlagToDisplay = new MarvinImage();
        tempFlagToDisplay.load(require(`../images/flags400/_transparent.png`), () => {
            setFlagToDisplay(tempFlagToDisplay);
        });

        let storageState = JSON.parse(localStorage.getItem('flagle-state-unlimited'))
        setState(storageState)
        
    }, [currentSolution])

    useEffect(() => {
        updateShowOriginal()
    }, [showOriginal, pauseInterval])

    const updateShowOriginal = () => {
        setTimeout(() => {
            if(document.hasFocus()) {
                setShowOriginal(!showOriginal)
            } else {
                setPauseInterval(!pauseInterval)
            }
        }, 3000)
    }

    useEffect(() => {
        if(flagToGuess === null || flagToDisplay === null) {
            return;
        }
        else {
            let state = JSON.parse(localStorage.getItem('flagle-state-unlimited'))
            if(state !== null && state.dayNumber === theme.dayNumber) {
                loadGuesses(state.guesses)
            }
        }
    }, [flagToGuess, flagToDisplay])

    useEffect(() => {
        if(counter>0) {
            let currentData = new ImageData(flagToDisplay.imageData.data, 400, 267)
            
            let tempCanvas = document.createElement('canvas');
            tempCanvas.width = 400;
            tempCanvas.height = 267;
            let ctxTemp = tempCanvas.getContext('2d')
            ctxTemp.putImageData(currentData, 0, 0)
            
            
            let canvas = document.getElementById('flag-canvas');
            let ctx = canvas.getContext('2d');
            ctx.scale(canvasWidth/400, canvasWidth/400)
            
            ctx.drawImage(tempCanvas, 0, 0)
        }
        setCounter(counter + 1)
    }, [canvasWidth])

    const loadGuesses = (pastGuesses) => {
        let guessesToLoad = Array(pastGuesses.length)
        pastGuesses.forEach((guess, index) => {
            let overlapImageData = [];
            let matchingPixels = 0;
            let guessedFlag = new MarvinImage();
            guessedFlag.load(require(`../images/flags400/${guess.code}.png`), () => {
                for(let y=0; y<267; y++){
                    for(let x=0; x<400; x++){
                      
                        let r1 = flagToGuess.getIntComponent0(x,y);
                        let g1 = flagToGuess.getIntComponent1(x,y);
                        let b1 = flagToGuess.getIntComponent2(x,y);
                        
                        let r2 = guessedFlag.getIntComponent0(x,y);
                        let g2 = guessedFlag.getIntComponent1(x,y);
                        let b2 = guessedFlag.getIntComponent2(x,y);

                        const d = Math.sqrt((r2-r1)**2+(g2-g1)**2+(b2-b1)**2)
                        const p = d/Math.sqrt((255)**2+(255)**2+(255)**2)*100
                        
                        overlapImageData.push(r2)
                        overlapImageData.push(g2)
                        overlapImageData.push(b2)

                        if (p < colorThreshold && flagToGuess.getAlphaComponent(x,y) > 0.5 && guessedFlag.getAlphaComponent(x,y) > 0.5) {
                            matchingPixels++;
                            if (flagToDisplay.getAlphaComponent(x,y) === 0) {
                                flagToDisplay.setIntColor(x, y, r1, g1, b1)
                            }
                            overlapImageData.push(255)
                        }
                        else {
                            overlapImageData.push(0)
                        }
                    }
                }
                let overlap = matchingPixels/(400*267)
                let percentage = guess.code === currentSolution.code ? 100 : overlap === 1 ? 99.9 : overlap*100
                let newGuess = { ...guess, percentage: percentage.toFixed(1), imageData: new Uint8ClampedArray(overlapImageData), origImageData: guessedFlag.imageData.data}
                guessesToLoad[index] = newGuess
                if(guessesToLoad.filter(g => g !== null).length === guessesToLoad.length) {
                    currentSolution.solved = currentSolution.code === guess.code ? 100.0 : (flagToDisplay.imageData.data.filter((p, i) => i % 4 === 3 && p).length/(currentSolution.code === 'np' ? 33612 : 400*267)*100).toFixed(1)
                    displayPastGuesses(guessesToLoad)
                }
            });
        })
    }

    const displayPastGuesses = (guessesToLoad) => {
        setGuesses(guessesToLoad)

        let imageData = new ImageData(flagToDisplay.imageData.data, 400, 267)

        let tempCanvas = document.createElement('canvas');
        tempCanvas.width = 400;
        tempCanvas.height = 267;
        let ctxTemp = tempCanvas.getContext('2d')
        ctxTemp.putImageData(imageData, 0, 0)

        let canvas = document.getElementById('flag-canvas');
        let ctx = canvas.getContext('2d');
        ctx.scale(canvasWidth/400, canvasWidth/400)

        let animCanvas = document.getElementById('temp-canvas');
        let animCtx = animCanvas.getContext('2d');
        animCtx.scale(canvasWidth/400, canvasWidth/400)

        setScaled(true)
        
        animCtx.clearRect(0,0,400,267)

        if(animationsOn) {
            setAnimate(true)
            setTimeout(() => {
                ctx.drawImage(tempCanvas, 0, 0)
                if(guessesToLoad[guessesToLoad.length-1].code === currentSolution.code) {
                    setGameOver(true)
                }
                else if(guessesToLoad.length === 6) {
                    setGameOver(true)
                    setGameLost(true)
                }
                setAnimate(false)
            }, animationLength)
        }
        else {
            ctx.drawImage(tempCanvas, 0, 0)

            if(guessesToLoad[guessesToLoad.length-1].code === currentSolution.code) {
                setGameOver(true)
            }
            else if(guessesToLoad.length === 6) {
                setGameOver(true)
                setGameLost(true)
            }
        }
    }

    const handleChange = (value) => {
      if (typeof value === 'object'){
        setSelectedCountry(value)
      } else {
        setSelectedCountry(null)
      }
    }

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        let valid = false
        countries.forEach(c => {
            if (c.label.toLowerCase() === newInputValue.toLowerCase()) {
                setSelectedCountry(c)
                valid = true
            }})
            if (!valid) {
                setSelectedCountry(null)
        }
    };


    const handleGuess = () => {
        console.log(currentSolution)
        if(selectedCountry !== null && guesses.filter(g => g.code === selectedCountry.code).length === 0) {
            if (guesses.length === 0) {
                let oldState = JSON.parse(localStorage.getItem('flagle-state-unlimited'))
                if(oldState !== null && (oldState.win === false || oldState.dayNumber < theme.dayNumber-1)) {
                    let newStats = JSON.parse(localStorage.getItem('flagle-statistics-unlimited'))
                    newStats.currentStreak = 0
                    localStorage.setItem('flagle-statistics-unlimited', JSON.stringify(newStats))
                }

                let newState = {
                    dayNumber: theme.dayNumber,
                    hardMode: hardMode,
                    guesses: [selectedCountry],
                    win: false
                }
                setState(newState)
                localStorage.setItem('flagle-state-unlimited', JSON.stringify(newState))
            }
            else {
                state.guesses.push(selectedCountry)
                localStorage.setItem('flagle-state-unlimited', JSON.stringify(state))
            }
            
            let guessedFlag = new MarvinImage();
            guessedFlag.load(require(`../images/flags400/${selectedCountry.code}.png`), () => {
                imageLoaded(guessedFlag)
            });

        } else if (selectedCountry === null) {
            setAlertMessage("Not in country list")
            setAlertType("error")
            setAlertOpen(true)
        } else if ( guesses.filter(g => g.code === selectedCountry.code).length > 0) {
            setAlertMessage("Can't guess the same country twice")
            setAlertType("error")
            setAlertOpen(true)
        }
        let inputField = document.getElementById('country-select')
        if(selectedCountry !== null) {
            setInputValue("");
        }
        
        inputField.focus();
    }
    //hard mode new change
    useEffect(() => {
        const state = JSON.parse(localStorage.getItem('flagle-state-unlimited')) || {};
        state.hardMode = hardMode;
        localStorage.setItem('flagle-state-unlimited', JSON.stringify(state));
    }, [hardMode]);
    const handleResetGame = () => {
        // Clear all game-specific states
        setGuesses([]);
        setGameOver(false);
        setGameLost(false);
        setSelectedCountry(null);
        setInputValue("");
        setShowOriginal(false);
        setCounter(0);
        setResultColors([]);
        setAnimate(false);
        // Clear animation canvas
        const animCanvas = document.getElementById('temp-canvas');
        const animCtx = animCanvas.getContext('2d');
        animCtx.clearRect(0, 0, animCanvas.width, animCanvas.height);
        console.log(animCanvas , "anim" , animate);
         // Reinitialize flags //hard mode new change
        let tempCountries = Object.keys(isoCountries).map((key) => ({
            code: key.toLowerCase(),
            label: isoCountries[key],
        }));

        // Reapply sorting //hard mode new change
        let sortedCountries = tempCountries.sort((a, b) => a.label.localeCompare(b.label));

        // Reset `countries` based on the current `hardMode` //hard mode new change
        if (!hardMode) {
            // If `hardMode` is disabled, reset all visible flags
            setCountries(sortedCountries);
            console.log(sortedCountries);
        }

        // Reinitialize flag data
        let tempFlagToGuess = new MarvinImage();
        tempFlagToGuess.load(require(`../images/flags400/${currentSolution.code}.png`), () => {
            currentSolution.imageData = tempFlagToGuess.imageData.data;
            currentSolution.origImageData = tempFlagToGuess.imageData.data;
            setFlagToGuess(tempFlagToGuess);
        });
    
        let tempFlagToDisplay = new MarvinImage();
        tempFlagToDisplay.load(require(`../images/flags400/_transparent.png`), () => {
            setFlagToDisplay(tempFlagToDisplay);
        });
    
        // Preserve statistics in local storage
        const stats = JSON.parse(localStorage.getItem('flagle-statistics-unlimited')) || {};
        stats.currentStreak = stats.currentStreak || 0; // Ensure stats are valid
        localStorage.setItem('flagle-statistics-unlimited', JSON.stringify(stats));
    
        // Reset state in local storage
        const newState = {
            dayNumber: theme.dayNumber,
            hardMode: hardMode,
            guesses: [],
            win: false,
        };
        localStorage.setItem('flagle-state-unlimited', JSON.stringify(newState));
        setState(newState);
        window.location.reload();
    };
    
    const handleIsUnlimitedClick = () => {
       // Generate a new solution using GetDailyRandom
        const newSolution = GetDailyRandom(isoCountries, true); // Enable unlimited mode
        console.log(newSolution)
        localStorage.setItem('flagle-state-tempSol', JSON.stringify(newSolution));
        setCurrentSolution(newSolution); // Update the local solution
        handleResetGame(); // Call the reset function
    };
    const handleKeyDown = (e) => {
        if(e.key === 'Enter') {
            let btn = document.getElementById('guess-btn')
            btn.focus();
        }
    }

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlertOpen(false);
    };

    const handleGameWin = () => {
        if (animationsOn) {
            setTimeout(() => {
                setAlertMessage("Nice one!")
                setAlertType("success")
                setAlertOpen(true)
                setGameOver(true)
                let oldState = JSON.parse(localStorage.getItem('flagle-state-unlimited'))
                oldState.win = true
                localStorage.setItem('flagle-state-unlimited', JSON.stringify(oldState))
            }, animationLength)
        }
        else {
            setAlertMessage("Nice one!")
            setAlertType("success")
            setAlertOpen(true)
            setGameOver(true)
        }
        updateStats(true)
        uploadStats('win')
    }

    const handleGameLose = () => {
        if (animationsOn) {
            setTimeout(() => {
                setGameOver(true)
                setGameLost(true)
            }, animationLength)
        }
        else {
            setGameOver(true)
            setGameLost(true)
        }
        updateStats(false)
        uploadStats('lose')
    }

    const uploadStats = async (result) => {
        await statsRef.add({
          day: theme.dayNumber,
          code: currentSolution.code,
          guesses: result === 'win' ? (guesses.length+1).toString() : 'X',
          hard: hardMode
        })
      }

    const updateStats = (win) => {
        let stats = JSON.parse(localStorage.getItem('flagle-statistics-unlimited'))
        if (win) {
            stats.guesses[guesses.length+1] += 1;
            stats.currentStreak += 1;
            stats.maxStreak = stats.currentStreak > stats.maxStreak ? stats.currentStreak : stats.maxStreak;
        }
        else {
            stats.guesses["X"] += 1;
            stats.currentStreak = 0;
        }
        localStorage.setItem('flagle-statistics-unlimited', JSON.stringify(stats))
    }

    function imageLoaded(guessedFlag){
        let overlapImageData = [];
        let matchingPixels = 0;
        for(let y=0; y<267; y++){
            for(let x=0; x<400; x++){
              
                let r1 = flagToGuess.getIntComponent0(x,y);
                let g1 = flagToGuess.getIntComponent1(x,y);
                let b1 = flagToGuess.getIntComponent2(x,y);
                
                let r2 = guessedFlag.getIntComponent0(x,y);
                let g2 = guessedFlag.getIntComponent1(x,y);
                let b2 = guessedFlag.getIntComponent2(x,y);

                const d = Math.sqrt((r2-r1)**2+(g2-g1)**2+(b2-b1)**2)
                const p = d/Math.sqrt((255)**2+(255)**2+(255)**2)*100
                
                overlapImageData.push(r2)
                overlapImageData.push(g2)
                overlapImageData.push(b2)

                if (p < colorThreshold && flagToGuess.getAlphaComponent(x,y) > 0.5 && guessedFlag.getAlphaComponent(x,y) > 0.5) {
                    matchingPixels++;
                    if (flagToDisplay.getAlphaComponent(x,y) === 0) {
                        flagToDisplay.setIntColor(x, y, r1, g1, b1)
                    }
                    overlapImageData.push(255)
                }
                else {
                    overlapImageData.push(0)
                }
            }
        }
        let overlap = matchingPixels/(400*267)
        let percentage =selectedCountry.code === currentSolution.code ? 100 : overlap === 1 ? 99.9 : overlap*100
        let newGuess = { ...selectedCountry, percentage: percentage.toFixed(1), imageData: new Uint8ClampedArray(overlapImageData), origImageData: guessedFlag.imageData.data}
        setGuesses([...guesses, newGuess])
        currentSolution.solved =(flagToDisplay.imageData.data.filter((p, i) => i % 4 === 3 && p).length/(currentSolution.code === 'np' ? 33612 : 400*267)*100).toFixed(1)


        let bufferImageData = new ImageData(guessedFlag.imageData.data, 400, 267)

        let bufferCanvas = document.createElement('canvas');
        bufferCanvas.width = 400;
        bufferCanvas.height = 267;
        let ctxBuffer = bufferCanvas.getContext('2d')
        ctxBuffer.putImageData(bufferImageData, 0, 0)

        let currentData = new ImageData(flagToDisplay.imageData.data, 400, 267)

        let overlapCanvas = document.createElement('canvas');
        overlapCanvas.width = 400;
        overlapCanvas.height = 267;
        let ctxOverlap = overlapCanvas.getContext('2d')
        ctxOverlap.putImageData(currentData, 0, 0)

        let canvas = document.getElementById('flag-canvas');
        let ctx = canvas.getContext('2d');

        let tempCanvas = document.getElementById('temp-canvas');
        let tempCtx = tempCanvas.getContext('2d');
        
        if(!scaled) {
            ctx.scale(canvasWidth/400, canvasWidth/400)
            tempCtx.scale(canvasWidth/400, canvasWidth/400)
            setScaled(true)
        }
        tempCtx.clearRect(0,0,400,267)

        if(animationsOn) {
            tempCtx.drawImage(bufferCanvas, 0, 0)
            handleAnimation()
        }

        if(animationsOn) {
            setTimeout(() => {
                ctx.drawImage(overlapCanvas, 0, 0)
                
                if(selectedCountry.code === currentSolution.code) {
                    handleGameWin()
                }
                else if (guesses.length === 5) {
                    handleGameLose()
                }
            }, animationLength/2)
        }
        else {
            ctx.drawImage(overlapCanvas, 0, 0)
            
            if(selectedCountry.code === currentSolution.code) {
                handleGameWin()
            }
            else if (guesses.length === 5) {
                handleGameLose()
            }
        }
    }

    const handleAnimation = () => {
        setAnimate(true)
        setTimeout(() => {
            setAnimate(false)
        }, animationLength)
    }

    const handleShare = () => {
        setAlertMessage("Results copied to clipboard")
        setAlertType("info")
        setAlertOpen(true)

        let linesArray = []
        resultColors.forEach((line) => {
            linesArray.push(line.join("")
                      .replaceAll("grey", "⬛")
                      .replaceAll("yellow", "🟨")
                      .replaceAll("green", "🟩"))
        })
        let colorsString = linesArray.join("\n")

        let resultText = 
        `Flagle #${theme.dayNumber} - ${!gameLost ? guesses.length : "X"}/6${hardMode ? "*" : ""} ${gameLost ? "🏳️" : "🏁"}\n\n${colorsString}\n\nhttps://flagle-game.com/`

        navigator.clipboard.writeText(resultText)
    }
    return (
        <div id="game" style={{width: canvasWidth+2}}>
            <p className='text-center'>Unlimited</p>
            <div id='flag-container'
                style={{backgroundColor: theme.palette.background.canvas,
                        width: `${canvasWidth+2}px`,
                        height: `${canvasHeight+2}px`,
                        border: `1px solid ${theme.palette.border.default}`,
                        margin: size === 1 || size === 5 || size === 9  ? "40px 0" :
                                size === 2 || size === 6 || size === 10 ? "28px 0" : "16px 0"}}>
                <canvas id="flag-canvas"
                        width={canvasWidth}
                        height={canvasHeight}    
                ></canvas>
                <Fade in={animate} timeout={{enter: theme.transitions.duration.enteringScreen*2, exit: theme.transitions.duration.leavingScreen*2}}>
                    <canvas id="temp-canvas" width={canvasWidth} height={canvasHeight} style={{position: 'absolute', borderRadius: '0.3rem'}}></canvas>
                </Fade>
            </div>
            <GuessListUnlimited guesses={guesses} resultColors={resultColors} setResultColors={setResultColors} showOriginal={showOriginal}></GuessListUnlimited>
            {!gameOver && (
                <div id='guess-container' style={{display: size === 4 || size === 8 || size === 12 ? "inline-flex" : "block", justifyContent: "space-between"}}>
                    <Autocomplete
                        id="country-select"
                        sx={{ background: theme.palette.background.paper,
                            borderRadius: '0.3rem',
                            marginTop: size === 1 || size === 5 || size === 9  ? "35px" :
                                       size === 2 || size === 6 || size === 10 ? "23px" : "11px",
                            display: size === 4 || size === 8 || size === 12 ? "inline-flex" : "block",
                            width: size === 4 || size === 8 || size === 12 ? "75%" : "100%",
                        "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: `${theme.palette.border.default}`
                        },
                    }}
                    options={countries}
                    autoHighlight
                    getOptionLabel={(option) => option.label || ""}
                    freeSolo
                    onKeyDown={handleKeyDown}
                    inputValue={inputValue}
                    onInputChange={handleInputChange}
                    onChange={(e, value) => handleChange(value)}
                    clearOnBlur={false}
                    selectOnFocus
                    filterOptions={(options) => matchSorter(options, inputValue, {keys: ['label']})}
                    renderOption={(props, option) => (
                        <Box value={option.code} component="li" sx={{lineHeight: '1.65', '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            {!hardMode && (
                            <img
                                loading="lazy"
                                width="40"
                                src={require(`../images/flags40/${option.code.toLowerCase()}.png`)}
                                alt=""
                                />
                            )}
                            {option.label}
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Choose a country"
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'off',
                                form: {
                                autocomplete: 'off',
                                },
                            }}
                        />
                        )}
                        />
                    <div>
                        <Button
                            id="guess-btn"
                            sx={{ backgroundColor: theme.palette.background.button.default,
                                    color: theme.palette.text.button,
                                    fontWeight: size < 5 ? "500" : "400",
                                    border: `1px solid ${theme.palette.border.button}`,
                                    height: size === 4 || size === 8 || size === 12 ? "56px" :
                                            size < 5 ? "40px" : size < 9 ? "38px" : "36px",
                                    width: size < 5 ? "82px" : size < 9 ? "77px" : "72px",
                                    fontSize: size < 5 ? "15px" : size < 9 ? "14px" : "13px",
                                    "&:hover": {
                                    backgroundColor: theme.palette.background.button.hover,
                                    }  
                                }}
                            variant="contained"
                            onClick={handleGuess}
                            disabled={animate}
                        >
                            Guess
                        </Button>
                    </div>
                </div>
            )}
            {gameOver && (
                <div style={{marginTop: size === 1 || size === 5 || size === 9  ? "15px" :
                                        size === 2 || size === 6 || size === 10 ? "11px" : "7px"}}>
                    {gameLost && (
                        <div>
                            <GuessBoxUnlimited guess={currentSolution}></GuessBoxUnlimited>
                        </div>
                    )}
                    <div >
                        <span style={{display: 'inline-block',
                                      fontSize: size < 5 ? "28px" : size < 9 ? "23px" : "18px",
                                      fontWeight: '500',
                                      width: canvasWidth === 400 ? "59%" : canvasWidth === 360 ? "57%" : "55%",
                                      height: canvasWidth === 400 ? "50px" : canvasWidth === 360 ? "45px" : "40px", 
                                      textAlign: 'center', 
                                      border: `1px solid ${theme.palette.border.default}`,
                                      borderRadius: '0.3rem',
                                      backgroundColor: theme.palette.background.paper,
                                      paddingTop: !timerHover ? canvasWidth === 400 ? "3px" : canvasWidth === 360 ? "5px" : "7px" :
                                                                canvasWidth === 400 ? "2px" : canvasWidth === 360 ? "4px" : "6px"
                                      }}>
                            <span  onClick={handleIsUnlimitedClick} >Next Flagle</span>
                        </span>
                        <Button
                            id="share-btn"
                            variant="contained"
                            onClick={handleShare}
                            style={{marginTop: size < 5 ? '4px' : size < 9 ? '3px' : '2px',
                                    height: size < 5 ? "40px" : size < 9 ? "38px" : "36px",
                                    marginRight: '2px'
                                }}
                        >
                            Share <ShareIcon sx={{ marginLeft: '5px'}}/>
                        </Button>
                    </div>
                </div>
            )}
            <Snackbar
                open={alertOpen}
                autoHideDuration={3000}
                onClose={handleAlertClose}
                style={{top: '55px'}}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleAlertClose}
                    severity={alertType} 
                    sx={{ width: '100%',
                          "& .MuiAlert-action": {
                            display: "none"
                          },
                          "& .MuiAlert-message": {
                            margin: '0 auto'
                          }
                    }}
                    icon={false}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default GameUnlimited