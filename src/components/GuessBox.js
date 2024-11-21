import React, { useEffect, useState } from 'react'
import PercentageCountUp from './PercentageCountUp';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Zoom from '@mui/material/Zoom';
import useTheme from '@mui/material/styles/useTheme';
import { display } from '@mui/system';


const GuessBox = ({guess, index, info, addResultColorLine, showOriginal}) => {
    const green = '#78b159'
    const red = '#dd2e44'

    const theme = useTheme();
    const canvasWidth = theme.canvasWidth;
    const canvasHeight = theme.canvasHeight;
    const animationLength = theme.animationLength;
    let animationsOn = theme.animationsOn;


    const [correct, setCorrect] = useState(false)
    const [gameLost, setGameLost] = useState(false)

    const [animate, setAnimate] = useState(false)
    const [animationOver, setAnimationOver] = useState(false)

    const [squareColors, setSquareColors] = useState([])

    const [loaded, setLoaded] = useState(false)

    const [firstOrig, setFirstOrig] = useState(false)
    const [firstOverlap, setFirstOverlap] = useState(false)

    const [fullOrigData, setFullOrigData] = useState(null)
    const [fullOverlapData, setFullOverlapData] = useState(null)

    const [miniOrigData, setMiniOrigData] = useState(null)
    const [miniOverlapData, setMiniOverlapData] = useState(null)

    const [counter, setCounter] = useState(0)
    const [toggleResize, setToggleResize] = useState(false)
    const [resize, setResize] = useState(false)

    const [first, setFirst] = useState(true)
    const [displayFirst, setDisplayFirst] = useState(false)
    const [ready, setReady] = useState(false)

    const [infoGuess, setInfoGuess] = useState(null)

    
    useEffect(() => {
        if (guess) {
            let p = guess.percentage
            setCorrect(parseInt(p) === 100)
            if(typeof p === 'undefined') {
                setGameLost(true);
                animationsOn = false;
            }

            let colors = [
                p < 2.5 ? "grey" : p < 5 ? "yellow" : "green",
                p < 10 ? "grey" : p < 15 ? "yellow" : "green",
                p < 20 ? "grey" : p < 30 ? "yellow" : "green",
                p < 40 ? "grey" : p < 60 ? "yellow" : "green",
                p < 80 ? "grey" : p < 100 ? "yellow" : "green",
            ]
            setSquareColors(colors)

            if (typeof addResultColorLine !== 'undefined' && first) {
                addResultColorLine(colors)
            }

            if(animationsOn && !resize) {
                setAnimate(true)
            }
            else {
                setAnimationOver(true)
            }

            let miniCanvas = document.getElementById(`mini-canvas-${index}`)

            if (animationsOn && !resize) {
                miniCanvas.style.display = 'none';
                setTimeout(() => {
                    setReady(true)
                    setDisplayFirst(!displayFirst)
                }, animationLength-50)
            }
            else {                    
                setReady(true)
                setDisplayFirst(!displayFirst)
            }
            setResize(false)
            setFirst(false)
        }
    }, [guess, index, toggleResize])

    useEffect(() => {
        if(ready) {
            if(info) {
                setInfoGuess(guess.code)
            }
            let origData400 = new ImageData(guess.origImageData, 400, 267);
            let overlapData400 = new ImageData(guess.imageData, 400, 267);

            let canvasOrig400 = document.createElement('canvas')
            canvasOrig400.width = 400
            canvasOrig400.height= 400
            let ctxOrig400 = canvasOrig400.getContext('2d')
            ctxOrig400.putImageData(origData400, 0, 0)

            let canvasOverlap400 = document.createElement('canvas')
            canvasOverlap400.width = 400
            canvasOverlap400.height= 400
            let ctxOverlap400 = canvasOverlap400.getContext('2d')
            ctxOverlap400.putImageData(overlapData400, 0, 0)

            
            let fullCanvasOrig = document.createElement('canvas')
            fullCanvasOrig.width = canvasWidth
            fullCanvasOrig.height= canvasHeight
            let fullCtxOrig = fullCanvasOrig.getContext('2d')
            fullCtxOrig.scale(canvasWidth / 400, canvasWidth / 400)
            fullCtxOrig.drawImage(canvasOrig400, 0, 0)
            
            let tempFullOrigData = fullCtxOrig.getImageData(0, 0, canvasWidth, canvasHeight)
            setFullOrigData(tempFullOrigData.data)

            let fullCanvasOverlap = document.createElement('canvas')
            fullCanvasOverlap.width = canvasWidth
            fullCanvasOverlap.height= canvasHeight
            let fullCtxOverlap = fullCanvasOverlap.getContext('2d')
            fullCtxOverlap.scale(canvasWidth / 400, canvasWidth / 400)
            fullCtxOverlap.drawImage(canvasOverlap400, 0, 0)

            let tempFullOverlapData = fullCtxOverlap.getImageData(0, 0, canvasWidth, canvasHeight)
            tempFullOverlapData.data.forEach((n, i) => {
                if(i % 4 !== 3) {
                    tempFullOverlapData.data[i] = tempFullOrigData.data[i]
                } 
            })
            setFullOverlapData(tempFullOverlapData.data)

            let miniCanvasOrig = document.createElement('canvas')
            miniCanvasOrig.width = Math.floor(canvasWidth/8)
            miniCanvasOrig.height= Math.floor(canvasHeight/8)
            let miniCtxOrig = miniCanvasOrig.getContext('2d')
            miniCtxOrig.scale(0.125, 0.125)
            miniCtxOrig.drawImage(fullCanvasOrig, 0, 0)
            
            let tempMiniOrigData = miniCtxOrig.getImageData(0, 0, Math.floor(canvasWidth/8), Math.floor(canvasHeight/8))
            setMiniOrigData(tempMiniOrigData.data)


            let miniCanvasOverlap = document.createElement('canvas')
            miniCanvasOverlap.width = Math.floor(canvasWidth/8)
            miniCanvasOverlap.height= Math.floor(canvasHeight/8)
            let miniCtxOverlap = miniCanvasOverlap.getContext('2d')
            miniCtxOverlap.scale(0.125, 0.125)
            miniCtxOverlap.drawImage(fullCanvasOverlap, 0, 0)
            
            let tempMiniOverlapData = miniCtxOverlap.getImageData(0, 0, Math.floor(canvasWidth/8), Math.floor(canvasHeight/8))
            tempMiniOverlapData.data.forEach((n, i) => {
                if(i % 4 !== 3) {
                    tempMiniOverlapData.data[i] = tempMiniOrigData.data[i]
                } 
            })
            setMiniOverlapData(tempMiniOverlapData.data)


            let miniCanvas = document.getElementById(`mini-canvas-${index}`)
            let miniCtx = miniCanvas.getContext('2d');
        

            let fullCanvas = document.getElementById(`full-canvas-${index}`)
            let fullCtx = fullCanvas.getContext('2d')

            let fullImageData = showOriginal ? tempFullOrigData : tempFullOverlapData
            let miniImageData = showOriginal ? tempMiniOrigData : tempMiniOverlapData
            setFirstOrig(showOriginal)
            setFirstOverlap(!showOriginal)
            fullCtx.putImageData(fullImageData, 0, 0)
            miniCtx.putImageData(miniImageData, 0, 0)
            setAnimate(false)
            setAnimationOver(true)
            miniCanvas.style.display = '';
            setLoaded(true)
            
        }
    }, [displayFirst])

    useEffect(() => {
        if(counter > 0) {
            setToggleResize(!toggleResize)
            setResize(true)
        }
        setCounter(counter+1)
    }, [canvasWidth])

    useEffect(() => {
        if(guess && loaded) {
            if(info && (guess.code !== infoGuess) || (guess.percentage === '100.0' && guess.code === 'np')) {
                return;
            }
            let miniCanvas = document.getElementById(`mini-canvas-${index}`)
            let miniCtx = miniCanvas.getContext('2d');
            miniCtx.scale(0.125, 0.125)

            let fullCanvas = document.getElementById(`full-canvas-${index}`)
            let fullCtx = fullCanvas.getContext('2d')
            if (showOriginal) {
                if(firstOrig) {
                    setFirstOrig(false)
                    return;
                }
                setFirstOverlap(false)
                let imageDataToDisplay = fullOverlapData.slice();
                let smallImageDataToDisplay = miniOverlapData.slice();
                if(animationsOn) {
                    let alpha = 0
                    let interval = setInterval(() => {
                        alpha += 5
                        for(let x=3; x<imageDataToDisplay.length; x+=4){
                            if(imageDataToDisplay[x] !== 255) {
                                imageDataToDisplay[x] = alpha;
                            }
                        }
                        for(let x=3; x<smallImageDataToDisplay.length; x+=4) {
                            if(smallImageDataToDisplay[x] !== 255) {
                                smallImageDataToDisplay[x] = alpha
                            }
                        }
                        let fullData = new ImageData(imageDataToDisplay, canvasWidth, canvasHeight);
                        let smallData = new ImageData(smallImageDataToDisplay, Math.floor(canvasWidth/8), Math.floor(canvasHeight/8));
                        
                        fullCtx.putImageData(fullData, 0, 0)
                        miniCtx.putImageData(smallData, 0, 0)
                        
                        if(alpha === 255) {
                            clearInterval(interval)
                        }
                    }, 10)
                }
                else {
                    let fullData = new ImageData(fullOrigData, canvasWidth, canvasHeight);
                    let smallData = new ImageData(miniOrigData, Math.floor(canvasWidth/8), Math.floor(canvasHeight/8));
                        
                    fullCtx.putImageData(fullData, 0, 0)
                    miniCtx.putImageData(smallData, 0, 0)
                }
            }
            else {
                if(firstOverlap) {
                    setFirstOverlap(false)
                    return;
                }
                setFirstOrig(false)
                let imageDataToDisplay = fullOrigData.slice();
                let smallImageDataToDisplay = miniOrigData.slice();

                if(animationsOn) {

                    let alpha = 255
                    let interval = setInterval(() => {
                        alpha -= 5
                        for(let x=3; x<imageDataToDisplay.length; x+=4){
                            if(imageDataToDisplay[x] !== 0 && fullOverlapData[x] === 0) {
                                imageDataToDisplay[x] = alpha;
                            }
                        }
                        for(let x=3; x<smallImageDataToDisplay.length; x+=4) {
                            if(smallImageDataToDisplay[x] !== 0 && miniOverlapData[x] === 0) {
                                smallImageDataToDisplay[x] = alpha
                            }
                        }
                        let fullData = new ImageData(imageDataToDisplay, canvasWidth, canvasHeight);
                        let smallData = new ImageData(smallImageDataToDisplay, Math.floor(canvasWidth/8), Math.floor(canvasHeight/8));
                        
                        fullCtx.putImageData(fullData, 0, 0)
                        miniCtx.putImageData(smallData, 0, 0)
                        
                        if(alpha === 0) {
                            clearInterval(interval)
                        }
                    }, 10)
                }
                else {
                    let fullData = new ImageData(fullOverlapData, canvasWidth, canvasHeight);
                    let smallData = new ImageData(miniOverlapData, Math.floor(canvasWidth/8), Math.floor(canvasHeight/8));
                    
                    fullCtx.putImageData(fullData, 0, 0)
                    miniCtx.putImageData(smallData, 0, 0)
                }
            }
        }
    }, [showOriginal])

    const handleHover = (e) => {
        if (guess && !info) {
            let windowWidth = window.innerWidth
            let windowHeight = window.innerHeight
            let fullCanvas = document.getElementById(`full-canvas-${index}`);
            let limit =  29 
            fullCanvas.style.display = "block"

            if(canvasWidth < 400) {
                fullCanvas.style.margin = '0 auto'
            }
            else {

                if (e.pageX + canvasWidth + limit < windowWidth) {
                    fullCanvas.style.left = `${e.pageX}px`
                } else {
                    fullCanvas.style.left = `${windowWidth-canvasWidth-(limit+1)}px`
                }
            }
                if (e.pageY + canvasHeight + limit < windowHeight) {
                    fullCanvas.style.top = `${e.pageY}px`
                } else {
                    fullCanvas.style.top = `${windowHeight-canvasHeight-(limit+1)}px`
                }
            
        }
    }

  
    const handleHoverLeave = () => {
        if(guess && !info) {
            let fullCanvas = document.getElementById(`full-canvas-${index}`);
            fullCanvas.style.display = "none"
        }
    }


    return (
        <div>
            <Box
                sx={{
                display: 'flex',
                alignItems: 'center',
                width: `${canvasWidth+2}px`,
                height: canvasWidth === 400 ? "50px" : canvasWidth === 360 ? "45px" : "40px",
                border: `1px solid ${theme.palette.border.default}`,
                borderRadius: 1,
                bgcolor: theme.palette.background.paper,
                color: 'text.primary',
                marginBottom: '5px',
                '& div': {
                    m: 1.5,
                },
                '& hr': {
                    mx: 0.5,
                },
                }}
            >
                
                <div style={{width: canvasWidth === 400 ? "65%" : canvasWidth === 360 ? "64%" : "63%",
                            fontSize: canvasWidth === 400 ? "18px" : canvasWidth === 360 ? "16px" : "14px",
                            textAlign: 'center',
                            margin: canvasWidth === 400 ? "12px" : canvasWidth === 360 ? "8px" : "4px"}}>
                    {animate && (
                            <div style={{paddingTop: canvasWidth === 400 ? info ? '8px' :  '7px' : canvasWidth === 360 || info ? "6px" : "5px",
                                        margin: '0 0 0 4px'}}>
                                <Zoom in={animate} {...(animate ? { timeout: animationLength/5 } : {})}>
                                    <span className={`progress-card-${canvasWidth} square-${squareColors[0]}`}></span>
                                </Zoom>
                                <Zoom in={animate} style={{ transitionDelay: animate ? `${animationLength/10}ms` : '0ms' }} {...(animate ? { timeout: animationLength/5 } : {})}>
                                    <span className={`progress-card-${canvasWidth} square-${squareColors[1]}`}></span>
                                </Zoom>
                                <Zoom in={animate} style={{ transitionDelay: animate ? `${(animationLength/10)*2}ms` : '0ms' }} {...(animate ? { timeout: animationLength/5 } : {})}>
                                    <span className={`progress-card-${canvasWidth} square-${squareColors[2]}`}></span>
                                </Zoom>
                                <Zoom in={animate} style={{ transitionDelay: animate ? `${(animationLength/10)*3}ms` : '0ms' }} {...(animate ? { timeout: animationLength/5 } : {})}>
                                    <span className={`progress-card-${canvasWidth} square-${squareColors[3]}`}></span>
                                </Zoom>
                                <Zoom in={animate} style={{ transitionDelay: animate ? `${(animationLength/10)*4}ms` : '0ms' }} {...(animate ? { timeout: animationLength/5 } : {})}>
                                    <span className={`progress-card-${canvasWidth} square-${squareColors[4]}`}></span>
                                </Zoom>
                            </div>
                    )}
                    {!animate && animationOver && (
                        <div style={{color: correct ? green : gameLost ? red : '', lineHeight: '1.2', fontWeight: '500', paddingTop: '1px'}}>{guess.label}</div>
                    )}
                </div>
                <Divider orientation="vertical" variant="middle" flexItem />
                <div style={{width: canvasWidth === 400 ? "17%" : canvasWidth === 360 ? "18%" : "19%",
                            textAlign: 'center',
                            paddingTop: info ? '2px' : '1px',
                            fontWeight: '500',
                            margin: canvasWidth === 400 ? '12px 8px' : canvasWidth === 360 ? "10px 6px" : "8px 4px",
                            fontSize: canvasWidth === 400 ? "16px" : canvasWidth === 360 ? "15px" : "14px"
                            }}>
                    {guess && animationsOn && animate &&(<PercentageCountUp index={index} end={parseFloat(guess.percentage)} length={animationLength} />)}
                    {guess && !animate && animationOver && !gameLost && (
                        <span style={correct ? {color: green} : {}}>{guess.percentage}%</span>
                    )}
                    {gameLost && (
                        <span style={{color: red}}>{guess.solved}%</span>
                    )}
                </div>
                <Divider orientation="vertical" variant="middle" flexItem />
                <div style={{width: "18%"}}>
                    <canvas
                        id={`mini-canvas-${index}`}
                        className="mini-canvas"
                        height={Math.floor(canvasHeight/8)}
                        width={Math.floor(canvasWidth/8)}
                        style={{border: `1px solid ${theme.palette.border.default}`, backgroundColor: theme.palette.background.canvas, marginTop: info ? '7px' :'6px'}}
                        onMouseMove={handleHover}
                        onMouseLeave={handleHoverLeave}
                        hidden={!animationOver}
                    />
                </div>

            </Box>
            {guess && (
                <>
                    <canvas
                        id={`full-canvas-${index}`}
                        className="full-canvas"
                        style={{backgroundColor: theme.palette.background.canvas, border: `1px solid ${theme.palette.border.default}`}}
                        height={canvasHeight}
                        width={canvasWidth}
                    />
                </>
            )}
        </div>
    )
}

export default GuessBox