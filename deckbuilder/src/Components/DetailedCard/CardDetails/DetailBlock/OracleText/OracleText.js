import React from 'react'
import OracleLine from './OracleLine'
import {useEffect, useState} from "react"
import flavorWords from "./flavorWords.js"

function OracleText({card_text}) {

    //regex including all the sections of oracle text that are in itallics
    const [iRegex, setIRegex] = useState()

    //creating the regex dynamically on load
    useEffect(() => {
        makeRegex();
    }, [])

    //loading in the data for and creating the regex from a separate file so it can be updated as needed when new cards come out
    const makeRegex = () => {
        let flavors = flavorWords.replace("\n","|")
        let re = new RegExp(`\\([+{}",/:. 'A-Za-z;/0-9∞½-]+\\)|${flavors}`, 'g')
        setIRegex(re)
    }
    
    //split text into each line
    const oracleTextLines = card_text.split("\n")
    
    //splitting the lines into what isn't in itallics
    const oracleTextGroups = oracleTextLines.map((line) => (
        line.split(iRegex)
    ))

    //matching the lines for what is in itallics
    const oracleTextFlavors = oracleTextLines.map(line => (
        line.match(iRegex)
    ))

    return (
        <>
            {card_text.length > 0 ?
                <>{
                oracleTextGroups.map((group,groupIndex) => (
                    <div key={groupIndex} className="oracle-text-holder">
                        {group.map((line,lineIndex) => (
                            <div key={lineIndex} className="inline">
                                {/* loading the normal and then italiics of each line to be formatted further in OracleLine.js */}
                                <OracleLine line={line} reminder={false} className="inline" />{oracleTextFlavors?.[groupIndex]?.[lineIndex] ? <OracleLine className="inline" line={oracleTextFlavors[groupIndex][lineIndex]} reminder={true}/> : <></>}
                            </div>
                        ))}
                    </div>
                ))
            }</>
            :
            <></>
            }
        </>
    )
}

export default OracleText