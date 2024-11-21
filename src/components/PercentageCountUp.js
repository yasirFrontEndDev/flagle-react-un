import React, {useEffect, useState} from 'react'

const PercentageCountUp = ({end, length, index}) => {

    const [counter, setCounter] = useState(0)

    let browser;
    if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) !== -1 ) 
    {
        browser = "Opera";
    }
    else if(navigator.userAgent.indexOf("Edg") !== -1 )
    {
        browser = 'Edge';
    }
    else if(navigator.userAgent.indexOf("Chrome") !== -1 )
    {
        browser = 'Chrome';
    }
    else if(navigator.userAgent.indexOf("Safari") !== -1)
    {
        browser = 'Safari';
    }
    else if(navigator.userAgent.indexOf("Firefox") !== -1 ) 
    {
        browser = 'Firefox';
    }
    else if((navigator.userAgent.indexOf("MSIE") !== -1 ) || (!!document.documentMode === true )) //IF IE > 10
    {
        browser = 'IE'; 
    }  
    else 
    {
       browser = 'unknown';
    }

    useEffect(() => {
        let x = 0
        let tempCounter = end
        let browser;
        if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) !== -1 ) 
        {
            browser = "Opera";
        }
        else if(navigator.userAgent.indexOf("Edg") !== -1 )
        {
            browser = 'Edge';
        }
        else if(navigator.userAgent.indexOf("Chrome") !== -1 )
        {
            browser = 'Chrome';
        }
        else if(navigator.userAgent.indexOf("Safari") !== -1)
        {
            browser = 'Safari';
        }
        else if(navigator.userAgent.indexOf("Firefox") !== -1 ) 
        {
            browser = 'Firefox';
        }
        else if((navigator.userAgent.indexOf("MSIE") !== -1 ) || (!!document.documentMode === true )) //IF IE > 10
        {
            browser = 'IE'; 
        }  
        else 
        {
        browser = 'unknown';
        }

        let delay = browser === 'Firefox' ? 400 : 10
        let interval = setInterval(() => {
            tempCounter = end * (-Math.pow(2, -10 * x) + 1) * 1024 / 1023
            if(Math.round(tempCounter*10)/10 === end) {
                clearInterval(interval)
            }
            setCounter(tempCounter)
            x+=1/100;
        }, (length-delay) / 100)
    }, [])

    return <span id={`counter-${index}`}>{counter.toFixed(1)}%</span>
};

export default PercentageCountUp;