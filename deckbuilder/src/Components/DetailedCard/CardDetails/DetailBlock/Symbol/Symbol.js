import React from 'react'
import "./Symbol.css"

function Symbol({symbol,shadow}) {
    let url,urlSymbol
    if (symbol) {
        //updating the symbol text to work in the url
        urlSymbol = symbol.replace("½","HALF").replace("∞", "INFINITY").replace("/","")
        url = `https://c2.scryfall.com/file/scryfall-symbols/card-symbols/${urlSymbol}.svg`
    }

    //showing an image grabbed from the scryfall api with the symbol data passed in
    //including a shadow passed in
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