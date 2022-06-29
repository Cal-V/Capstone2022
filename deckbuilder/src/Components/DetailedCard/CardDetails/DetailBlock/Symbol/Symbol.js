import React from 'react'
import "./Symbol.css"

function Symbol({symbol,shadow}) {
    let url,urlSymbol
    if (symbol) {
        urlSymbol = symbol.replace("½","HALF").replace("∞", "INFINITY").replace("/","")
        url = `https://c2.scryfall.com/file/scryfall-symbols/card-symbols/${urlSymbol}.svg`
    }

    return (
        (symbol ? <img className={`symbol${(shadow ? " shadow" : "")}`} src={url}></img> : <></>)
    )
}

export default Symbol

/*
{½} > HALF
{∞} > INFINITY
{W/U} > WU (remove /)
*/