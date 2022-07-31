import React from 'react'
import Symbol from '../Symbol/Symbol'

function OracleLine({line,reminder}) {

    //for matching the text of the symbol
    const symbolRegex = /\{[A-Z/0-9∞½]+\}/g
    //for matching the text within the braces for the symbols
    const textRegex = /[A-Z/0-9∞½]+(?=})/g

    //all of the symbol texts in an array (empty if there isn't one)
    const oracleTextSymbols = line.match(textRegex) || []
    //all of the text not including the symbols
    const oracleTextWords = line.split(symbolRegex) || []

    return (
        <div className="inline">
            {oracleTextWords.map((segment,segmentIndex) => (
                <div key={segmentIndex} className="inline">
                    {/* interlacing the text and then the symbol to show up in line (checking if it's supposed to be itallics or not and updating therepf) */}
                    {reminder ? 
                        <div className='inline'><i className='inline'>{segment}</i>{(oracleTextSymbols[segmentIndex] != null ? <Symbol shadow={false} symbol={oracleTextSymbols[segmentIndex]} /> : "" )}</div>
                    :
                        <div className='inline'><p className='inline'>{segment}</p>{(oracleTextSymbols[segmentIndex] != null ? <Symbol shadow={false} symbol={oracleTextSymbols[segmentIndex]} /> : "" )}</div>
                    }
                    
                </div>
            ))}
        </div>
    )
}

export default OracleLine