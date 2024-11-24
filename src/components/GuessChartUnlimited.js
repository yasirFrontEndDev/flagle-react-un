import React, {useEffect, useState} from 'react'
import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell} from 'recharts';

import useTheme from '@mui/material/styles/useTheme';

const GuessChartUnlimited = ({solution}) => {
    const theme = useTheme();

    const [data, setData] = useState([]);
    const [last, setLast] = useState("");
    const [played, setPlayed] = useState(0);
useEffect(() => {
    // Get statistics from localStorage or initialize them
    let stats = JSON.parse(localStorage.getItem('flagle-statistics-unlimited'));

    let guesses = stats?.guesses || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "X": 0 };
    if (!stats) {
        const newStats = { "currentStreak": 0, "maxStreak": 0, "guesses": guesses };
        localStorage.setItem('flagle-statistics-unlimited', JSON.stringify(newStats));
    }

    // Handle null guesses case
    if (guesses === null) {
        guesses = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "X": 0 };
        let newStats = { "currentStreak": 0, "maxStreak": 0, "guesses": guesses };
        localStorage.setItem('flagle-statistics-unlimited', JSON.stringify(newStats));
    }

    setData(Object.keys(guesses).map((k) => {
        return { label: k, value: guesses[k] };
    }));
    setPlayed(Object.values(guesses).reduce((a, b) => a + b, 0));

    // Get game state from localStorage and check guesses
    let state = JSON.parse(localStorage.getItem('flagle-state-unlimited'));
    if (state?.guesses?.length > 0) { // Safely check for state and guesses
        if (state.guesses[state.guesses.length - 1]?.code === solution.code) {
            setLast(state.guesses.length.toString());
        } else if (state.guesses.length === 6) {
            setLast("X");
        } else {
            setLast("");
        }
    }
}, []);


    // useEffect(() => {
    //     let stats = JSON.parse(localStorage.getItem('flagle-statistics-unlimited'))

    //     let guesses = stats?.guesses || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "X": 0 };
    //     // If stats are missing, initialize local storage
    // if (!stats) {
    //     const newStats = { "currentStreak": 0, "maxStreak": 0, "guesses": guesses };
    //     localStorage.setItem('flagle-statistics-unlimited', JSON.stringify(newStats));
    // }
    //     if(guesses === null) {
    //         guesses = {"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"X":0}
    //         let newStats = {"currentStreak": 0, "maxStreak": 0, "guesses": guesses}
    //         localStorage.setItem('flagle-statistics-unlimited', JSON.stringify(newStats))
    //     }
    //     setData(Object.keys(guesses).map((k) => {
    //         return {label: k, value: guesses[k]}
    //     }))
    //     setPlayed(Object.values(guesses).reduce((a, b) => a+b, 0))

        
    //     let state = JSON.parse(localStorage.getItem('flagle-state-unlimited'))
    //     if(state !== null && state.guesses.length > 0) {
    //         if(state.guesses[state.guesses.length-1].code === solution.code) {
    //             setLast(state.guesses.length.toString())
    //         }
    //         else if (state.guesses.length === 6){
    //             setLast("X")
    //         }
    //         else {
    //             setLast("")
    //         }
    //     }
    // }, [])
    return (
        <div style={{ width: '100%', height: '215px' }}>
                {data && (
                    <ResponsiveContainer>
                        <BarChart
                            data={data}
                            layout="vertical"
                            barCategoryGap={1}
                            margin={{ top: 0, right: 50, left: 0, bottom: 50 }}
                        >
                            <XAxis
                                type="number"
                                hide
                                domain={[0, 'auto']}
                            />
                            <YAxis
                                type="category"
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                interval={0}
                                stroke={theme.palette.text.primary}
                                fontSize={'14px'}
                            />
                            <Bar
                                dataKey="value"
                                minPointSize={25}
                                isAnimationActive={!!theme.animationsOn}
                                barSize={20}
                                label={{
                                    fill: '#fff',
                                    fontSize: 14,
                                    position: 'insideRight',
                                    dx: -2,
                                    fontWeight: 500,
                                }}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={
                                            entry.value > 0
                                                ? entry.label === 'X'
                                                    ? theme.palette.chart.red
                                                    : theme.palette.chart.green
                                                : theme.palette.chart.grey
                                        }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
        </div>
    )
}

export default GuessChartUnlimited
