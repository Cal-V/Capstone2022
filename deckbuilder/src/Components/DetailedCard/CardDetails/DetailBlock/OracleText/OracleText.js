import React from 'react'
import OracleLine from './OracleLine'
import {useEffect, useState} from "react"
import flavorWords from "./flavorWords.js"

function OracleText({card_text}) {

    const [iRegex, setIRegex] = useState(/\([+{}",/:. 'A-Za-z/0-9∞½-]+\)/g)

    useEffect(() => {
        makeRegex();
    }, [])

    const makeRegex = () => {
        let flavors = flavorWords.replace("\n","|")
        let re = new RegExp(`\\([+{}",/:. 'A-Za-z/0-9∞½-]+\\)|${flavors}`, 'g')
        setIRegex(re)
    }
    
    //split text into each line
    const oracleTextLines = card_text.split("\n")
    
    //const iRegex = /\([+{}",/:. 'A-Za-z/0-9∞½-]+\)|(Adamant|Addendum|Alliance|Battalion|Bloodrush|Channel|Chroma|Cohort|Constellation|Converge|Council's dilemma|Coven|Delirium|Domain|Eminence|Enrage|Fateful hour|Ferocious|Formidable|Grandeur|Hellbent|Heroic|Imprint|Inspired|Join forces|Kinship|Landfall|Lieutenant|Magecraft|Metalcraft|Morbid|Pack tactics|Parley|Radiance|Raid|Rally|Revolt|Spell mastery|Strive|Sweep|Tempting offer|Underdog|Undergrowth|Will of the council)(?= — )/g

    const oracleTextGroups = oracleTextLines.map((line) => (
        line.split(iRegex)
    ))

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