import React from 'react'
import Symbol from '../Symbol/Symbol'

function OracleText({card_text}) {

    const symbolRegex = /\{[A-Z/0-9∞½]+\}/g
    const textRegex = /[A-Z/0-9∞½]+(?=})/g
    
    //split text into each line
    const oracleTextLines = card_text.split("\n")

    //splitting each line of each face on the symbols [line][words]
    const oracleTextWords = oracleTextLines.map(line => (
        line.split(symbolRegex)
    ))

    //getting each of the symbols [line][symbol]
    const oracleTextSymbols = oracleTextLines.map(line => (
        line.match(textRegex)
    ))

    return (
        <>
            {card_text.length > 0 ?
                <>{
                oracleTextWords.map((line,lineIndex) => (
                    <div key={lineIndex} className="oracle-text-holder">
                    {line.map((segment,segmentIndex) => (
                        <p key={segmentIndex} className="inline">
                        <div dangerouslySetInnerHTML={{__html: segment}} className="inline"/>{(oracleTextSymbols[lineIndex]?.[segmentIndex] != null ? <Symbol shadow={false} symbol={oracleTextSymbols[lineIndex]?.[segmentIndex]} /> : "" )}
                        </p>
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