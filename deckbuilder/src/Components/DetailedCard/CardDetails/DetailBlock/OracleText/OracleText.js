import React from 'react'
import OracleLine from './OracleLine'

function OracleText({card_text}) {
    
    //split text into each line
    const oracleTextLines = card_text.split("\n")
    
    const iRegex = /(\([+{},/:. 'A-Za-z/0-9∞½-]+\))/g

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
                oracleTextGroups.map((line,lineIndex) => (
                    <div key={lineIndex} className="oracle-text-holder">
                        <OracleLine line={line} reminder={false} className="inline" />{oracleTextFlavors[lineIndex] ? <OracleLine className="inline" line={oracleTextFlavors[lineIndex]} reminder={true}/> : <></>}
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