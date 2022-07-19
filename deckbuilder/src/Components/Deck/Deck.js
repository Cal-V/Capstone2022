import React from 'react'
import DeckCard from './DeckCard/DeckCard.js'
import {useState, useEffect} from "react"
import "./Deck.css"

function Deck({deck,deckIdFunctions,deckFunctions,userDecks,identifiers,cardNumbers,setCardNumbers}) {

    const [fileDownloadUrl,setFileDownloadUrl] = useState(null)

    useEffect(() => {
        if (fileDownloadUrl) {
            document.getElementById("download-link-btn").click();
            setFileDownloadUrl(null)
            URL.revokeObjectURL(fileDownloadUrl)
        }
    },[fileDownloadUrl])

    const loadNewDeck = (evt) => {
        evt.preventDefault();
        console.log(identifiers)
        deckFunctions.loadDeck(deckIdFunctions.deckUUID)
    }

    const deleteCurrentDeck = evt => {
        evt.preventDefault();
        deckFunctions.deleteDeck(deckIdFunctions.deckUUID)
    }

    const handleFileInput = (evt) => {
        const file = evt.target.files[0]
        console.log(file)
        let reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function() {
            console.log(reader.result);
            getFileIdentifiers(reader.result)
        };

        reader.onerror = function() {
            console.log(reader.error);
        };
    }

    const changeNumCards = (card,up) => {
        let numsCopy = {}
        for (let key in cardNumbers) {
            numsCopy[key] = cardNumbers[key]
        }
        if (up) {
            numsCopy[card.id]++;
        } else {
            if (cardNumbers[card.id] == 1)
                deckFunctions.removeCard(card)
            else
                numsCopy[card.id]--
        }
        setCardNumbers(numsCopy)
    }

    const getFileIdentifiers = (fileText) => {
        let newIds = []
        fileText = fileText.split("\n")
        fileText = fileText.map(line => {
            if (line.length > 0) {
                let set = line.match(/[A-Z0-9a-z]+(?=\))/g)[0]
                let split = line.split(" ")
                let collector_number = split[split.length-1]
                let id = {
                    set,
                    collector_number
                }
                newIds = newIds.concat(id)
            }
        })
        console.log(newIds)
        identifiers.setIdentifiers(newIds)
        
    }

    const exportDeck = () => {
        let deckData = ""
        deck.forEach(card => {
            deckData += `${cardNumbers[card.id]} ${card.name} (${card.set}) ${card.collector_number}\n`
        });

        console.log(deckData)

        const blob = new Blob([deckData])
        setFileDownloadUrl(URL.createObjectURL(blob))
    }

    return (
        <>
            <h2>Unnamed Deck</h2>
            <div className='deck-holder'>
                <div className='list-holder'>
                    {
                        (deck.length > 0 ?
                        deck.map(c => (
                            <DeckCard numCards={cardNumbers[c.id]} key={c.id} card={c} changeNumCards={changeNumCards} removeCard={deckFunctions.removeCard}/>
                        ))
                        : <h3>No cards in your deck</h3>
                        )
                    }
                </div>
            </div>
            <div className='deck-data'>
                <button className='transform-button' onClick={deckFunctions.createDeck}>Save deck</button>
                <button className='transform-button' onClick={() => deckFunctions.updateDeck(deckIdFunctions.deckUUID)}>Update deck</button>
                <button className='transform-button' onClick={deleteCurrentDeck}>Delete deck</button>
                <p>Deck ID = <strong>{deckIdFunctions.deckUUID}</strong></p>
                <form onSubmit={loadNewDeck}>
                    <label htmlFor='deck-uuid'>Load Deck</label>
                    <select className='deck-select' onChange={(e) => deckIdFunctions.setDeckUUID(e.target.value)} value={deckFunctions.deckUUID}>
                        {userDecks.map((deck) => (
                            <option key={deck._deck_id}>{deck._deck_id}</option>
                        ))}
                    </select>
                    <input type="submit" className='transform-button' value="Load Deck" />
                </form>
                <label form='file-input'>Upload Deck File</label><br />
                <input id="file-input" type="file" onChange={handleFileInput}/>
                <button className='transform-button' onClick={() => exportDeck("test text uwu")}>Export Deck</button>
                <a className="hidden" target="blank" id='download-link-btn' download={`${deckIdFunctions.deckUUID}.txt`} href={fileDownloadUrl}>download it</a>
            </div>
        </>
    )
}

export default Deck