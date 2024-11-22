import React, {useEffect, useState} from 'react'
import GuessBox from './GuessBox';

import { MarvinImage } from "@rarebearsoft/marvin";

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import useTheme from '@mui/material/styles/useTheme';
import Fade from '@mui/material/Fade';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Slide from '@mui/material/Slide';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { SettingsPowerOutlined } from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const Info = ({open, setOpen}) => {
    const theme = useTheme();

    const canvasWidth = theme.canvasWidth;
    const canvasHeight = theme.canvasHeight;
    const animationLength = theme.animationLength;
    const colorThreshold = theme.colorThreshold;
    const animationsOn = theme.animationsOn;

    const [animate, setAnimate] = useState(false)

    const [page, setPage] = useState(null);

    const solution = {code: 'sn', label: 'Senegal'}
    const [guesses, setGuesses] = useState([{code: 'hu', label: 'Hungary'}, {code: 'it', label: 'Italy'}, {code: 'ml', label: 'Mali'}, {code: 'sn', label: 'Senegal'}])
    const [guess, setGuess] = useState(null)

    const [showOriginal, setShowOriginal] = useState(false)
    const [pauseInterval, setPauseInterval] = useState(false)

    const [rulesExpanded, setRulesExpanded] = useState(true)
    const [exampleExpanded, setExampleExpanded] = useState(false)

    const [scaled, setScaled] = useState(false)
    
    const [counter, setCounter] = useState(0)
    const [toggleOpen, setToggleOpen] = useState(false)

    let flagToGuess = new MarvinImage();
    flagToGuess.load(require(`../images/flags400/${solution.code}.png`), () => {
        solution.imageData = flagToGuess.imageData.data
    });

    

    useEffect(() => {
        for(let i=0; i<4; i++) {
            let guessedFlag = new MarvinImage();
            guessedFlag.load(require(`../images/flags400/${guesses[i].code}.png`), () => {
                setUpFlagsTemp(guessedFlag, i)
            });
            
        }
        
    }, [])

    const setUpFlagsTemp = (guessedFlag, i) => {
        let flagToDisplay = new MarvinImage();
        flagToDisplay.load(require('../images/flags400/_transparent.png'), () => {
            setUpFlags(flagToDisplay, guessedFlag, i)
        });

    }

    const setUpFlags = (flagToDisplay, guessedFlag, i) => {
        let currentGuess = guesses[i]
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
                const p = d/Math.sqrt((255)^2+(255)^2+(255)^2)
                
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
        let percentage = overlap === 1 ? currentGuess.code === solution.code ? 100 : 99.9 : overlap*100
        guesses[i].percentage = percentage.toFixed(1)
        guesses[i].imageData = new Uint8ClampedArray(overlapImageData)
        guesses[i].origImageData = guessedFlag.imageData.data

    }

    useEffect(() => {
        if (open) {
            setScaled(false)
            
            if(theme.screenHeight >= 840) {
                setExampleExpanded(true)
                setToggleOpen(!toggleOpen)
            }

        }
    }, [open])

    useEffect(() => {
        if(exampleExpanded) {
            setTimeout(() => {
                handlePageChange(0)
            }, 100)
        } else {
            let canvas = document.getElementById('flag-canvas-info');
            if (canvas !== null) {
                let ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, 400, 400)
            }

        }
    }, [exampleExpanded, toggleOpen])

    useEffect(() => {
        updateShowOriginal()
    }, [showOriginal, pauseInterval])

    useEffect(() => {
        if(open) {

            if(counter>0) {
                let currentData = new ImageData(guesses[page].imageData, 400, 267)
                
                let tempCanvas = document.createElement('canvas');
                tempCanvas.width = 400;
                tempCanvas.height = 267;
                let ctxTemp = tempCanvas.getContext('2d')
                ctxTemp.putImageData(currentData, 0, 0)
                
                
                let canvas = document.getElementById('flag-canvas-info');
                let ctx = canvas.getContext('2d');
                ctx.scale(canvasWidth/400, canvasWidth/400)
                
                ctx.drawImage(tempCanvas, 0, 0)
            }
            setCounter(counter + 1)
        }
    }, [canvasWidth])

    const updateShowOriginal = () => {
        setTimeout(() => {
            if(document.hasFocus()) {
                setShowOriginal(!showOriginal)
            } else {
                setPauseInterval(!pauseInterval)
            }
        }, 3000)
    }

    const handlePageChange = (i) => {
        setPage(i)
        imageLoaded(i)
        
    }

    function imageLoaded(i){
        let currentGuess = guesses[i]
        setGuess(currentGuess)

        let bufferImageData = new ImageData(currentGuess.origImageData, 400, 267)

        let bufferCanvas = document.createElement('canvas');
        bufferCanvas.width = 400;
        bufferCanvas.height = 267;
        let ctxBuffer = bufferCanvas.getContext('2d')
        ctxBuffer.putImageData(bufferImageData, 0, 0)

        let currentData = new ImageData(currentGuess.imageData, 400, 267)

        let overlapCanvas = document.createElement('canvas');
        overlapCanvas.width = 400;
        overlapCanvas.height = 267;
        let ctxOverlap = overlapCanvas.getContext('2d')
        ctxOverlap.putImageData(currentData, 0, 0)


        let canvas = document.getElementById('flag-canvas-info');
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 400, 400)
        
        let tempCanvas = document.getElementById('temp-canvas-info');
        let tempCtx = tempCanvas.getContext('2d');
        if(!scaled) {
            ctx.scale(canvasWidth/400, canvasWidth/400)
            tempCtx.scale(canvasWidth/400, canvasWidth/400)
            setScaled(true)
        }

        if(animationsOn) {
            tempCtx.drawImage(bufferCanvas, 0, 0)
          handleAnimation()
        }
  
        if(animationsOn) {
          setTimeout(() => {
            ctx.drawImage(overlapCanvas, 0, 0)

          }, animationLength/2)
        }
        else {
            setTimeout(() => {
                ctx.drawImage(overlapCanvas, 0, 0)
            }, 100)
        }
    }

    
    const handleAnimation = () => {
        setAnimate(true)
        setTimeout(() => {
            setAnimate(false)
        }, animationLength)
    }

    let xDown = null;                                                        
    let yDown = null;

    function getTouches(evt) {
        return evt.touches ||             // browser API
               evt.originalEvent.touches; // jQuery
      }                                                     
                                                                               
      function handleTouchStart(evt) {
          const firstTouch = getTouches(evt)[0];                                      
          xDown = firstTouch.clientX;                                      
          yDown = firstTouch.clientY;                                      
      };     

      function handleTouchMove(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }
        
        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;
    
        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;


                                                                             
        if ( Math.abs( yDiff ) > Math.abs( xDiff ) ) {/*most significant*/
            if ( yDiff < 0 ) {
                setOpen(false)
            }                                                               
        }
        xDown = null;
        yDown = null;                                             
    };

    return (
            <div
            open={open}
            onClose={() => setOpen(false)}
            className='customInfoDiv'
            maxWidth="xs"
            fullWidth
            fullScreen={theme.screenWidth <= 500}
            transitionDuration={{enter: theme.animationsOn ? theme.transitions.duration.enteringScreen : 0,
                                exit: theme.animationsOn ? theme.transitions.duration.leavingScreen : 0}}
            TransitionComponent={theme.screenWidth <= 500 ? Transition : Fade}

            PaperProps={{
                style: {
                    position: 'relative',
                    top: theme.screenWidth <= 500 ? 0 : '20px',
                    border: theme.screenWidth <= 500 ? 'none' : `1px solid ${theme.palette.border.default}`,
                    borderRadius: theme.screenWidth <= 500 ? 'none' : '0.3rem',
                    backgroundImage: 'none',
                    overflowY: 'hidden'
                }
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            >
                <Toolbar sx={{borderBottom: `1px solid ${theme.palette.border.default}`, width: '100%'}}>
            <DialogTitle sx={{textAlign: 'center', fontSize: '28px', width: '100%'}}>HOW TO PLAY</DialogTitle>
            {theme.screenWidth <= 500 && (

                <IconButton
                edge="end"
                color="inherit"
                onClick={() => setOpen(false)}
                aria-label="close"
                sx={{right: '30px'}}
                size="small"
                >
                    <CloseIcon />
                </IconButton>
            )}
        </Toolbar>
        {theme.screenHeight >= 840 && (
<>
            <div style={{borderBottom: `1px solid ${theme.palette.border.default}`}}>
            <div className="info-body">
                <p>Guess the hidden flag in six tries.</p>
                <p>After each guess, pixels of the solution that overlap with the guessed flag will be revealed.</p>
                <p>The flags have been scaled to the same aspect ratio.</p>
            </div>
        </div>
        <div style={{marginTop: '10px', width: canvasWidth+2, margin: '0 auto'}}>
            <h3 style={{textAlign: 'center', fontWeight: '500'}}>Example</h3>
            <div style={{textAlign: 'center', fontSize: '15px'}}>
                <button className='pagination-btn' onClick={() => handlePageChange(page-1)} disabled={page === 0 || animate}><FontAwesomeIcon className='pagination-icon' icon={faAngleLeft} /></button>
                Guess #{page+1}
                <button className='pagination-btn' onClick={() => handlePageChange(page+1)} disabled={page === guesses.length-1 || animate}><FontAwesomeIcon className='pagination-icon' icon={faAngleRight} /></button>
                <div style={{fontWeight: '500', fontSize: '16px', paddingTop: '6px'}}>{page !== null ? guesses[page].label : ""}</div>
            </div>
            <div style={{margin: '0 auto', maxWidth: '400px', marginBottom: '40px'}}>
                <div id='flag-container-info' style={{backgroundColor: theme.palette.background.canvas, width: `${canvasWidth+2}px`, height: `${canvasHeight+2}px`, border: `1px solid ${theme.palette.border.default}`}}>
                    
                    <canvas id="flag-canvas-info" width={canvasWidth} height={canvasHeight}></canvas>
                    <Fade in={animate} timeout={{enter: theme.transitions.duration.enteringScreen*2, exit: theme.transitions.duration.leavingScreen*2}}>
                        <canvas id="temp-canvas-info" width={canvasWidth} height={canvasHeight} style={{position: 'absolute', borderRadius: '0.3rem'}}></canvas>
                    </Fade>
                </div>
                <div>
                    <GuessBox guess={guess} index={10 + page} info={true} showOriginal={showOriginal}></GuessBox>
                </div>
                <div style={{paddingTop: '20px'}}>
                    {page === 0 ? (
                        <>The flag of Hungary has a 22.0% overlap with the hidden flag.</>
                        ) : page === 1 ? (
                            <>Closer! The flag of Italy has a similarity of 66.5% with the solution.</>
                            ) : page === 2 ? (
                                <>Getting there! The flag of Mali only has a slight difference from the hidden flag.</>
                                ) : (
                            <>Congratulations! The solution is Senegal.</>
                    )}
                </div>
            </div>
        </div>
        </>
)}
    {theme.screenHeight < 840 && (
        <>
        <Accordion
            id="info-acc"
            sx={{background: 'none',
                borderBottom: `1px solid ${theme.palette.border.default}`,
                borderTop: 'none', boxShadow: 'none',
        }}
            defaultExpanded
            expanded={rulesExpanded}
            onChange={(e, expanded) => {
                if(expanded) {
                    setRulesExpanded(true)
                    handlePageChange(page)
                    setExampleExpanded(false)
                }
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{    position: 'absolute',
                    right: 0, top: '-12px'}}/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{margin: '0 auto', display: rulesExpanded ? 'none' : ''}}
                >
               <h3 style={{textAlign: 'center', fontWeight: '500', margin: '10px auto'}}>Rules</h3>
            </AccordionSummary>
            <AccordionDetails>
                    <div className="info-body">
                        <p>Guess the hidden flag in six tries.</p>
                        <p>After each guess, pixels of the solution that overlap with the guessed flag will be revealed.</p>
                        <p>The flags have been scaled to the same aspect ratio.</p>
                    </div>
            </AccordionDetails>
        </Accordion>
        <Accordion
            sx={{background: 'none',
                borderBottom: 'none',
                borderTop: 'none', boxShadow: 'none'
        }}
            expanded={exampleExpanded}
            onChange={(e, expanded) => {
                if(expanded) {
                    setExampleExpanded(true)
                    setRulesExpanded(false)
                }
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{    position: 'absolute',
                right: 0, top: '-12px'}} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{margin: '0 auto', display: exampleExpanded ? 'none' : '', borderBottom: `1px solid ${theme.palette.border.default}`}}
                >
               <h3 style={{textAlign: 'center', fontWeight: '500', margin: '10px auto', padding: 0}}>Example</h3>
            </AccordionSummary>
            <AccordionDetails sx={{marginTop: '10px', width: canvasWidth+2, margin: '0 auto', padding: 0}}>
                <div style={{textAlign: 'center', fontSize: '15px'}}>
                    <button className='pagination-btn' onClick={() => handlePageChange(page-1)} disabled={page === 0}><FontAwesomeIcon className='pagination-icon' icon={faAngleLeft} /></button>
                    Guess #{page+1}
                    <button className='pagination-btn' onClick={() => handlePageChange(page+1)} disabled={page === guesses.length-1}><FontAwesomeIcon className='pagination-icon' icon={faAngleRight} /></button>
                    <div style={{fontWeight: '500', fontSize: '16px', paddingTop: '6px'}}>{page !== null ? guesses[page].label : ""}</div>
                </div>
                <div style={{margin: '0 auto', maxWidth: '400px', marginBottom: '40px'}}>
                    <div id='flag-container-info' style={{backgroundColor: theme.palette.background.canvas, width: `${canvasWidth+2}px`, height: `${canvasHeight+2}px`, border: `1px solid ${theme.palette.border.default}`}}>
                        
                        <canvas id="flag-canvas-info" width={canvasWidth} height={canvasHeight}></canvas>
                        <Fade in={animate} timeout={{enter: theme.transitions.duration.enteringScreen*2, exit: theme.transitions.duration.leavingScreen*2}}>
                            <canvas id="temp-canvas-info" width={canvasWidth} height={canvasHeight} style={{position: 'absolute', borderRadius: '0.3rem'}}></canvas>
                        </Fade>
                    </div>
                    <div>
                        <GuessBox guess={guess} index={10} info={true} showOriginal={showOriginal}></GuessBox>
                    </div>
                    <div style={{paddingTop: '20px'}}>
                        {page === 0 ? (
                            <>The flag of Hungary has a 22.0% overlap with the hidden flag.</>
                            ) : page === 1 ? (
                                <>Closer! The flag of Italy has a similarity of 66.5% with the solution.</>
                                ) : page === 2 ? (
                                    <>Getting there! The flag of Mali only has a slight difference from the hidden flag.</>
                                    ) : (
                                <>Congratulations! The solution is Senegal.</>
                        )}
                    </div>
                </div>
            </AccordionDetails>
        </Accordion>
        {/* <div style={{marginTop: '10px', width: canvasWidth+2, margin: '0 auto'}}> */}
            {/* <div style={{textAlign: 'center', fontSize: '15px'}}>
                <button className='pagination-btn' onClick={() => handlePageChange(page-1)} disabled={page === 0}><FontAwesomeIcon className='pagination-icon' icon={faAngleLeft} /></button>
                Guess #{page+1}
                <button className='pagination-btn' onClick={() => handlePageChange(page+1)} disabled={page === guesses.length-1}><FontAwesomeIcon className='pagination-icon' icon={faAngleRight} /></button>
                <div style={{fontWeight: '500', fontSize: '16px', paddingTop: '6px'}}>{page !== null ? guesses[page].label : ""}</div>
            </div>
            <div style={{margin: '0 auto', maxWidth: '400px', marginBottom: '40px'}}>
                <div id='flag-container-info' style={{backgroundColor: theme.palette.background.canvas, width: `${canvasWidth+2}px`, height: `${canvasHeight+2}px`, border: `1px solid ${theme.palette.border.default}`}}>
                    
                    <canvas id="flag-canvas-info" width={canvasWidth} height={canvasHeight}></canvas>
                    <Fade in={animate} timeout={{enter: theme.transitions.duration.enteringScreen*2, exit: theme.transitions.duration.leavingScreen*2}}>
                        <canvas id="temp-canvas-info" width={canvasWidth} height={canvasHeight} style={{position: 'absolute', borderRadius: '0.3rem'}}></canvas>
                    </Fade>
                </div>
                <div>
                    <GuessBox guess={guess} index={10} info={true} showOriginal={showOriginal}></GuessBox>
                </div>
                <div style={{paddingTop: '20px'}}>
                    {page === 0 ? (
                        <>The flag of Hungary has a 22.0% overlap with the hidden flag.</>
                        ) : page === 1 ? (
                            <>Closer! The flag of Italy has a similarity of 66.5% with the solution.</>
                            ) : page === 2 ? (
                                <>Getting there! The flag of Mali only has a slight difference from the hidden flag.</>
                                ) : (
                            <>Congratulations! The solution is Senegal.</>
                    )}
                </div>
            </div>
        </div> */}
    </>
    )}

</div>
    )
}

export default Info 