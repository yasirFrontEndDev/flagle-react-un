var seedrandom = require('seedrandom')

export function GetDailyRandom(list, unlimitedMode = false) {
    if (unlimitedMode) {
        // Unlimited mode: pick a truly random item
        let keys = Object.keys(list);
        const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % keys.length; // Use cryptographic randomness
        let solutionCode = keys[randomIndex]; // Get the random country code
        return { code: solutionCode.toLowerCase(), label: list[solutionCode] };
    } else {
        // Daily mode: use seeded randomness for daily selection
        let firstDayDate = new Date('March 17, 2022');
        firstDayDate.setMinutes(firstDayDate.getMinutes() - firstDayDate.getTimezoneOffset());
        let firstDayUnix = parseInt((firstDayDate.getTime() / 1000).toFixed(0));
        let firstDay = Math.floor(firstDayUnix / 60 / 60 / 24);

        let date = new Date();
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        let unix = parseInt((date.getTime() / 1000).toFixed(0));
        let day = Math.floor(unix / 60 / 60 / 24);

        let prevDays = [];
        for (let i = day - 100 > firstDay ? day - 100 : firstDay; i <= day; i++) {
            let rng = seedrandom(i);
            let keys = Object.keys(list);
            let index = Math.floor(keys.length * rng());
            let code = keys[index];

            // Avoid duplicates
            while (prevDays.includes(code)) {
                index = Math.floor(keys.length * rng());
                code = keys[index];
            }
            prevDays.push(code);
        }
        let solutionCode = prevDays[prevDays.length - 1];
        return { code: solutionCode.toLowerCase(), label: list[solutionCode] };
    }
}


export function GetDayNumber() {
    let firstDayDate = new Date('March 16, 2022')
    firstDayDate.setMinutes(firstDayDate.getMinutes()-firstDayDate.getTimezoneOffset())
    let firstDayUnix = parseInt((firstDayDate.getTime() / 1000).toFixed(0))
    let firstDay = Math.floor(firstDayUnix/60/60/24)

    
    let currentDayDate = new Date()
    currentDayDate.setMinutes(currentDayDate.getMinutes()-currentDayDate.getTimezoneOffset())
    let currentDayUnix = parseInt((currentDayDate.getTime() / 1000).toFixed(0))
    let currentDay = Math.floor(currentDayUnix/60/60/24)


    return currentDay - firstDay + 1
}

export function GetNextDay() {
    let tomorrow = new Date()
    tomorrow.setHours(24,0,0,0)
    return tomorrow.getTime();
}