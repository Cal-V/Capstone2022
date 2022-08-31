import React from 'react'
import { useState, useEffect } from 'react'

function DeckText({deck,formatText,getIdentifiers,getNamedCard,notFoundArray}) {

    //the text in the text box
    const [fileText,setFileText] = useState(formatText())
    //the array of lines not found when updated cards
    const [notFound,setNotFound] = useState([])

    let keyPresses = []

    //getting the formatted text ofthe cards in the deck and updating the text box every time the deck changes
    useEffect(() => {
        setFileText(formatText())
    },[deck])

    //updating the formatting of the text bos to get the cards
    const updateCards = async (text) => {
        //lines that done follow the correct syntaxes, to be output below the text box
        let linesNotFound = []
        //for the formatted lines of text after the cards are found to send to get the card objects
        let textLines = ""
        //splitting for the indiviual line and interating through them
        let lines = text.split("\n")
        for (let i = 0; i < lines.length; i++) {
            //grabbing the specific line (for loop used to work with await)
            let line = lines[i]
            if (line.length > 0) {
                //seeing if it's a category line
                if (line.match(/\*\*[A-Za-z 0-9,./\\]+\*\*/)) {
                    textLines += line + "\n"
                } else {
                    //checking for the set code (usually three digits long of letters and numbers)
                    let set = line.match(/[A-Z0-9a-z]{3,5}(?=\))/g)?.[0]
                    //checking if the collector number is listed (usually number but sometimes weird, foils have the star) and ignoring when it matches the set
                    let hasCollectorNumber = line.substring(line.lastIndexOf(" ")).match(/[0-9a-zA-Z]{1,5}★?/) && !line.substring(line.lastIndexOf(" ")).match(/[A-Z0-9a-z]{3,5}(?=\))/g)?.[0]
                    //making sure the number of copies is listed in the right place and has a number
                    let hasNumCopies = !isNaN(line.substring(0,line.indexOf(" ")))
                    //if the set and collector nmumber (specific identifiers for a card) exist, sending off as is
                    if (set && hasCollectorNumber && hasNumCopies) {
                        textLines += line + "\n"
                    } else {
                        //grabbing the name of the card as the first words after the space after number of copies
                        //using that name to call the scryfall api to see if there's a card matching that name
                        let card = await getNamedCard(line.substring(line.indexOf(" ")+1))
                        if (card?.id) {
                            if (set) {
                                //checking if there is a set listed and getting the card from that set
                                let cardSet = await getNamedCard(line.substring(line.indexOf(" ")+1),set)
                                //setting the card to be either the first one found or the one from the specified set should that exist
                                card = (cardSet.id ? cardSet : card)
                                //formatting for the identifiers method
                                textLines += `${line.substring(0,line.indexOf(" "))} ${card.name} (${card.set}) ${card.collector_number}\n`
                            } else {
                                //adding the first card found if there wasn't a set specified
                                textLines += `${line.substring(0,line.indexOf(" "))} ${card.name} (${card.set}) ${card.collector_number}\n`
                            }
                        } else{
                            //the line didn't match any of the possible syntaxes and so gets pushed to the not found array
                            linesNotFound.push(line)
                        }
                    }
                }
            }
        }
        //updating the text box with the new text
        setFileText(textLines)
        //getting the identifiers with the formatted text
        getIdentifiers(textLines)
        //showing the not found lines
        setNotFound(linesNotFound)
    }

    //copying either the full text or just the names to the clipboard
    //should add a popup later to give feedback
    const copyToClipboard = (full) => {
        if (full) {
            //grabbing just the full text and copying to clipboard
            navigator.clipboard.writeText(fileText);
        } else {
            //variable to put the text to be copied in
            let namesText = ""
            //getting the individual lines
            fileText.split("\n").forEach(line => {
                //checking if it's a category line and skipping it
                if (!line.match(/\*\*[A-Za-z 0-9,./\\]+\*\*/)) {
                    //finding the name between the first space and right before the set
                    let newName = line.substring(line.indexOf(" "),line.indexOf(" ("))
                    //making sure it's a valid name and adding it to the variable
                    if (newName.length >= 3)
                        namesText += newName.trim() + "\n"
                }
            })
            //copying the names to the clipboard
            navigator.clipboard.writeText(namesText);
        }
    } 

    const handleKeyPress = (evt) => {
        keyPresses = [...keyPresses,evt.key]
        if (keyPresses?.[keyPresses.length-2] == "Control" && (keyPresses[keyPresses.length-1] == "s" || keyPresses[keyPresses.length-1] == "S")){
            evt.preventDefault()
            keyPresses = []
            updateCards(fileText)
        }
    }

    return (
        <div>
            <button className='transform-button deck-text-button' onClick={() => updateCards(fileText)}>Update Cards</button>
            <button className='transform-button deck-text-button' onClick={() => copyToClipboard(true)}>Copy Text</button>
            <button className='transform-button deck-text-button' onClick={() => copyToClipboard(false)}>Copy Names</button>
            <textarea onKeyDown={handleKeyPress} rows={fileText.split("\n").length} onChange={(evt) => setFileText(evt.target.value)} name="text" value={fileText}></textarea>
            <button className='transform-button deck-text-button' onClick={() => updateCards(fileText)}>Update Cards</button>
            <button className='transform-button deck-text-button' onClick={() => copyToClipboard(true)}>Copy Text</button>
            <button className='transform-button deck-text-button' onClick={() => copyToClipboard(false)}>Copy Names</button>
            <div>
                <p>Cards Not Found:</p>
                {/* filtering through both the not found array made here as well as the one found when a specific sent in id gives in error in the grandparent */}
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