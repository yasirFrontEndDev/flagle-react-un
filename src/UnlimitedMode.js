import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import GameUnlimited from './components/GameUnlimited'
import {GetDailyRandom, GetDayNumber} from './components/DailyRandom'
import Settings from './components/Settings'
import StatisticsUnlimited from './components/StatisticsUnlimited'
import Info from './components/Info'
import { isoCountries } from './components/CountryCodes'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css';
import './index.css';

function UnlimitedMode() {
  const [solution, setSolution] = useState()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  const [hardMode, setHardMode] = useState()
  const [stateHardMode, setStateHardMode] = useState()
  const [animationsOn, setAnimationsOn] = useState()
  const [colorTheme, setColorTheme] = useState()
  const [dayNumber, setDayNumber] = useState()

  const [screenWidth, setScreenWidth] = useState()
  const [screenHeight, setScreenHeight] = useState()

  
  useEffect(() => {
    let settings = JSON.parse(localStorage.getItem('flagle-settings-unlimited'))
    if(settings === null) {
      let newSettings = {'hardMode': false, 'animations': true, 'darkTheme': true}
      settings = newSettings;
     
      localStorage.setItem('flagle-settings-unlimited', JSON.stringify(newSettings))
      
      let newStats = {"currentStreak": 0, "maxStreak": 0, "guesses": {'1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, 'X': 0}}
      localStorage.setItem('flagle-statistics-unlimited', JSON.stringify(newStats))
    }
    setHardMode(settings.hardMode)
    setColorTheme(settings.darkTheme ? "dark" : "light")
    setAnimationsOn(settings.animations)

    let currentDay = GetDayNumber()
    setDayNumber(currentDay)

    let state = JSON.parse(localStorage.getItem('flagle-state-unlimited'));
    if(state !== null && state.dayNumber === currentDay) {
      setStateHardMode(state.hardMode);
    } else {
      setStateHardMode(settings.hardMode)
    }
    
    if(!settings.animations) {
      document.body.style.transition = 'none'
    }
    else {
      document.body.style.transition = 'all 0.2s linear'
    }

    window.addEventListener('resize', changeWindowSize);
    setScreenHeight(window.innerHeight)
    setScreenWidth(window.innerWidth)
    

    setSolution(GetDailyRandom(isoCountries, true))
  }, [])

  const changeWindowSize = () => {
    setScreenHeight(window.innerHeight)
    setScreenWidth(window.innerWidth)
  }
const resetGame = () => {
    setSolution(GetDailyRandom(isoCountries));    
  };
  const theme = createTheme({
    palette: {
      mode: colorTheme,
      ...(colorTheme === "dark"
        ? {
          background: {
            default: "rgb(20 24 30)",
            paper: "#121212",
            canvas: "rgb(30 30 30)",
            button: {
              default: "#121212",
              hover: "#0c0c0c"
            }
          },
          border: {
            default: "rgba(255, 255, 255, 0.23)",
            button: "rgba(255, 255, 255, 0.23)",
          },
          text: {
            button: "rgba(255, 255, 255, 1)",
            green: "rgb(91 205 29)"
          },
          chart: {
            grey: "#333",
            green: "#78b159",
            red: "#dd2e44"
          }
        }
        : {
          background: {
            default: "#b9c4ff",
            paper: "#fff",
            canvas: "rgb(204 212 255)",
            button: {
              default: "#41a1ff",
              hover: "#007fff"
            }
          },
          border: {
            default: "rgba(0, 0, 0, 0.75)",
            button: "rgba(0, 0, 0, 0.25)"
          },
          divider: "rgba(0, 0, 0, 0.4)",
          text: {
            button: "rgba(0, 0, 0, 0.87)"
          },
          chart: {
            grey: "#aaa",
            green: "#b0dd98",
            red: "#ef6072"
          }
        })
    },
    colorThreshold: 18,
    animationsOn: animationsOn,
    animationLength: 2000,
    hardMode: hardMode,
    stateHardMode: stateHardMode,
    dayNumber: dayNumber,
    toggleTheme: () => {
      let newColorTheme = colorTheme === "light" ? "dark" : "light"
      let newSettings = {'hardMode': hardMode, 'animations': animationsOn, 'darkTheme': newColorTheme === "dark" ? true : false}
      localStorage.setItem('flagle-settings-unlimited', JSON.stringify(newSettings))
      
      setColorTheme(newColorTheme)
    },
    toggleAnimations: () => {
      if(animationsOn) {
        document.body.style.transition = 'none'
      }
      else {
        document.body.style.transition = 'all 0.2s linear'
      }
      let newSettings = {'hardMode': hardMode, 'animations': !animationsOn, 'darkTheme': colorTheme === "dark" ? true : false}
      localStorage.setItem('flagle-settings-unlimited', JSON.stringify(newSettings))
      
      setAnimationsOn(!animationsOn)
    },
    toggleMode: () => {
      let newSettings = {'hardMode': !hardMode, 'animations': animationsOn, 'darkTheme': colorTheme === "dark" ? true : false}
      localStorage.setItem('flagle-settings-unlimited', JSON.stringify(newSettings))
      
      setHardMode(!hardMode)
      
      let state = JSON.parse(localStorage.getItem('flagle-state-unlimited'))
      if(state === null || state.dayNumber !== dayNumber) {
        setStateHardMode(!hardMode)
      }
    },

    screenWidth: screenWidth,
    screenHeight: screenHeight,
    
    canvasWidth: screenWidth >= 420 ? 400 : screenWidth >= 380 ? 360 : 320,
    canvasHeight: screenWidth >= 420 ? 267 : screenWidth >= 380 ? 240 : 214,

    size: screenWidth >= 420 && screenHeight >= 900 ? 1 :
          screenWidth >= 420 && screenHeight >= 860 ? 2 :
          screenWidth >= 420 && screenHeight >= 820 ? 3 :
          screenWidth >= 420 ? 4 :
          screenWidth >= 380 && screenHeight >= 850 ? 5 :
   screenWidth >= 380 && screenHeight >= 810 ? 6 :
          screenWidth >= 380 && screenHeight >= 770 ? 7 :
          screenWidth >= 380 ? 8 :
          screenHeight >= 780 ? 9 :
          screenHeight > 740 ? 10 :
          screenHeight > 700 ? 11 : 12,

    margin: {
        
    }
  });
  return (
    <ThemeProvider theme={theme}>
      {solution && (
        <>
          <CssBaseline enableColorScheme/>
            <Header setSettingsOpen={setSettingsOpen} setStatsOpen={setStatsOpen} setInfoOpen={setInfoOpen} disabled={false}/>
            <GameUnlimited onGameEnd={resetGame} solution={solution} animationsOn={animationsOn} UnlimitedHardMode={hardMode}/>
            <Info open={infoOpen} setOpen={setInfoOpen}/>
            <Settings open={settingsOpen} setOpen={setSettingsOpen}/>
            <StatisticsUnlimited solution={solution} open={statsOpen} setOpen={setStatsOpen}/>
        </>
      )}
    </ThemeProvider>
  );
}

export default UnlimitedMode;
