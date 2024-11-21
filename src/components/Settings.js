import React from 'react'
import SettingsSwitch from './SettingsSwitch'

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';

import useTheme from '@mui/material/styles/useTheme';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const Settings = ({open, setOpen}) => {
    const theme = useTheme();

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
                }
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
        >
        <Toolbar sx={{borderBottom: `1px solid ${theme.palette.border.default}`, width: '100%'}}>
            <DialogTitle sx={{textAlign: 'center', fontSize: '28px', width: '100%'}}>SETTINGS</DialogTitle>
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
        <div className="modal-body">
            <div className="settings-line">
                <SettingsSwitch checked={theme.hardMode} onChange={theme.toggleMode}/>
                <span className="settings-label">Hard mode</span>
                <div className='settings-desc' style={{color: theme.palette.text.secondary}}>Hide flag icons from country selection<br/>Starting from your next game</div>

            </div>
            <div className="settings-line">
                <SettingsSwitch checked={theme.animationsOn} onChange={theme.toggleAnimations}/>
                <span className="settings-label">Animations</span>    
            </div>
            {/* <div className="settings-line">
                <SettingsSwitch checked={theme.palette.mode === 'dark'} onChange={theme.toggleTheme}/>
                <span className="settings-label">Dark theme</span>
            </div> */}
        </div>
        </Dialog>
    )
}

export default Settings 