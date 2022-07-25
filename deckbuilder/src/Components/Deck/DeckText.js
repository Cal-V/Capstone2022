import React from 'react'
import { useState, useEffect } from 'react'

function DeckText({deck,formatText,getIdentifiers,getNamedCard,notFoundArray}) {

    const [fileText,setFileText] = useState(formatText())
    const [notFound,setNotFound] = useState([])

    useEffect(() => {
        setFileText(formatText())
    },[deck])

    const handleTextChange = async (evt) => {
        let text = evt.target.value
        setFileText(text)
    }

    const updateCards = async (text) => {
        let linesNotFound = []
        let textLines = ""
        let lines = text.split("\n")
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i]
            if (line.length > 0) {
                let set = line.match(/[A-Z0-9a-z]+(?=\))/g)?.[0]
                let hasCollectorNumber = line.substring(line.lastIndexOf(" ")).match(/[0-9]{1,4}★?/)
                let hasNumCopies = !isNaN(line.substring(0,line.indexOf(" ")))
                if (set && hasCollectorNumber && hasNumCopies) {
                    textLines += line + "\n"
                } else {
                    let card = await getNamedCard(line.substring(line.indexOf(" ")+1))
                    if (card?.id) {
                        textLines += `${line.substring(0,line.indexOf(" "))} ${card.name} (${card.set}) ${card.collector_number}\n`
                    } else {
                        linesNotFound.push(line)
                    }
                }
            }
        }
        setFileText(textLines)
        getIdentifiers(textLines)
        setNotFound(linesNotFound)
    }

    return (
        <div>
            <button className='transform-button' onClick={() => updateCards(fileText)}>Update Cards</button>
            <textarea rows={deck.length+1} onChange={handleTextChange} name="text" value={fileText}></textarea>
            <button className='transform-button' onClick={() => updateCards(fileText)}>Update Cards</button>
            <div>
                <p>Cards Not Found:</p>
                <ul>{
                        <>{
                            notFound.map((item,index) => (
                                <li key={index}>"{item}"</li>
                            ))
                        }
                        {
                            notFoundArray.map((item,index) => (
                                <li key={index}>{`set: "${item.set}", collector number: "${item.collector_number}"`}</li>
                            ))
                        }</>
                }</ul>
            </div>
        </div>
    )
}

export default DeckText