import React, {useState, useEffect} from 'react'
import GuessChartUnlimited from './GuessChartUnlimited';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';

import useTheme from '@mui/material/styles/useTheme';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const StatisticsUnlimited = ({open, setOpen, solution}) => {
    const theme = useTheme();

    const [stats, setStats] = useState()
    const [played, setPlayed] = useState()
    const [won, setWon] = useState()
    //old

    // useEffect(() => {
    //     let statStorage = JSON.parse(localStorage.getItem('flagle-statistics-unlimited')) || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "X": 0 };
    //     setStats(statStorage)
    //     setPlayed(statStorage ? Object.values(statStorage.guesses).reduce((a, b) => a+b) : 0)
    //     setWon(statStorage ? Object.values(statStorage.guesses).reduce((a, b) => a+b) - statStorage.guesses["X"] : 0)
    // }, [open])
    //after removing X but curnt and max streak default gone
    // useEffect(() => {
    //     const defaultStats = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "X": 0 };
    //     let statStorage = JSON.parse(localStorage.getItem('flagle-statistics-unlimited')) || { guesses: defaultStats };
    //     setStats(statStorage);
    //     const totalPlayed = Object.values(statStorage.guesses || defaultStats).reduce((a, b) => a + b, 0);
    //     setPlayed(totalPlayed);
    //     setWon(totalPlayed - (statStorage.guesses["X"] || 0));
    // }, [open]);
    // latest
    useEffect(() => {
        const defaultStats = { 
            "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "X": 0 
        };
        const savedStats = JSON.parse(localStorage.getItem('flagle-statistics-unlimited')) || {};
        
        const guesses = { ...defaultStats, ...(savedStats.guesses || {}) };
        const currentStreak = savedStats.currentStreak || 0;
        const maxStreak = savedStats.maxStreak || 0;
    
        setStats({ guesses, currentStreak, maxStreak });
        
        const totalPlayed = Object.values(guesses).reduce((a, b) => a + b, 0);
        setPlayed(totalPlayed);
        setWon(totalPlayed - guesses["X"]);
    }, [open]);
    



    
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
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            maxWidth="xs"
            fullWidth
            fullScreen={theme.screenWidth <= 500}
            transitionDuration={{enter: theme.animationsOn ? theme.transitions.duration.enteringScreen : 0,
                                exit: theme.animationsOn ? theme.transitions.duration.leavingScreen : 0}}
            TransitionComponent={theme.screenWidth <= 500 ? Transition : Fade}

            PaperProps={{
                style: {
                    position: 'absolute',
                    top: theme.screenWidth <= 500 ? 0 : '60px',
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
            <DialogTitle sx={{textAlign: 'center', fontSize: '28px', width: '100%'}}>STATISTICS</DialogTitle>
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
        <div style={{borderBottom: `1px solid ${theme.palette.border.default}`}}>
            <div className="modal-body">
                <Stack sx={{justifyContent: 'center'}} direction="row" spacing={1}>
                    <div className="stats-column">
                        <div className="stats-num">{played}</div>
                        <div className="stats-label">Played</div>
                    </div>
                    <div className="stats-column">
                        <div className="stats-num">{stats ? played === 0 ? 0 : (won / played * 100).toFixed(0) : 0}</div>
                        <div className="stats-label">Win %</div>
                    </div>
                    <div className="stats-column">
                        <div className="stats-num">{stats ? stats.currentStreak : 0}</div>
                        <div className="stats-label">Current streak</div>
                    </div>
                    <div className="stats-column">
                        <div className="stats-num">{stats ? stats.maxStreak : 0}</div>
                        <div className="stats-label">Max streak</div>
                    </div>
                </Stack>
            </div>
        </div>
        <div style={{marginTop: '10px'}}>
            <h3 style={{textAlign: 'center', fontWeight: '500'}}>Guess distribution</h3>
            <GuessChartUnlimited solution={solution}/>
        </div>
        </Dialog>
    )
}

export default StatisticsUnlimited