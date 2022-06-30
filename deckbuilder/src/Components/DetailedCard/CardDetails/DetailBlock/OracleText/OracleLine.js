import React from 'react'
import Symbol from '../Symbol/Symbol'

function OracleLine({line,reminder}) {

    const symbolRegex = /\{[A-Z/0-9∞½]+\}/g
    const textRegex = /[A-Z/0-9∞½]+(?=})/g

    const oracleTextSymbols = line.match(textRegex) || []
    const oracleTextWords = line.split(symbolRegex) || []

    return (
        <div className="inline">
            {oracleTextWords.map((segment,segmentIndex) => (
                <div key={segmentIndex} className="inline">
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