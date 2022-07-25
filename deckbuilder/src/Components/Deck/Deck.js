import React from 'react'
import DeckCard from './DeckCard/DeckCard.js'
import {useState, useEffect} from "react"
import DeckText from './DeckText.js'
import "./Deck.css"

function Deck({deck,deckIdFunctions,deckFunctions,userDecks,changeNum,getDetailedCard,deckInfo,setDeckInfo,getDeckCardsWithNums,getNamedCard,notFoundArray,swapPrintings}) {

    const [fileDownloadUrl,setFileDownloadUrl] = useState(null)
    const [images,setImages] = useState(true)

    useEffect(() => {
        if (fileDownloadUrl) {
            document.getElementById("download-link-btn").click();
            setFileDownloadUrl(null)
            URL.revokeObjectURL(fileDownloadUrl)
        }
    },[fileDownloadUrl])

    useEffect(() => {
        checkLegalities()
    },[deckInfo.format])

    const checkLegalities = () => {
        let isLegal = true;
        if (deckInfo.format) {
            deck.forEach(card => {
                if (card.legalities[deckInfo.format] != "legal" && card.legalities[deckInfo.format] != "restricted") {
                    isLegal = false
                }
            })
        }
        setDeckInfo({...deckInfo,isLegal:isLegal})
    }

    const deleteCurrentDeck = evt => {
        evt.preventDefault();
        deckFunctions.deleteDeck(deckIdFunctions.deckUUID)
    }

    const handleFileInput = (evt) => {
        const file = evt.target.files[0]
        let reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function() {
            getFileIdentifiers(reader.result)
        };

        reader.onerror = function() {
            console.log(reader.error);
        };
    }

    const changeNumCards = (card,value) => {
        if (value) {
            if (value == 0) {
                deckFunctions.removeCard(card)
            } else {
                changeNum(card.id,value);
            }
        } else {
            changeNum(card.id,"");
        }
    }

    const getFileIdentifiers = (fileText) => {
        let newIds = []
        fileText = fileText.split("\n")
        fileText = fileText.map(line => {
            if (line.length > 0) {
                let split = line.split(" ")
                let num_copies = split[0]
                let id = {}
                let set = line.match(/[A-Z0-9a-z]+(?=\))/g)?.[0]
                let collector_number = split[split.length-1].replace("\r","")
                id = {
                    set,
                    collector_number
                }
                if (!isNaN(num_copies) && id.set &&  id.collector_number) {
                    newIds.push({id,num_copies})
                }
            }
        })
        if (newIds.length > 0)
            getDeckCardsWithNums(newIds)
    }

    const formatForFile = () => {
        let deckData = ""
        deck.forEach(card => {
            deckData += `${card.num_copies || 1} ${card.name} (${card.set}) ${card.collector_number}\n`
        });
        return deckData
    }

    const exportDeck = () => {
        const blob = new Blob([formatForFile()])
        setFileDownloadUrl(URL.createObjectURL(blob))
    }

    return (
        <>
            <h2>{deckInfo.name}</h2>
            {deckInfo.format ? <h3>{deckInfo.format} - {deckInfo.isLegal ? "is" : "not"} legal</h3> : <></>}
            <div className='deck-data'>
                <p>Show cards as: {images ? <><a className='deck-link' onClick={() => setImages(true)}><strong>Images</strong></a><a className='deck-link' onClick={() => setImages(false)}>Names</a></> : <><a className='deck-link' onClick={() => setImages(true)}>Images</a><a className='deck-link' onClick={() => setImages(false)}><strong>Names</strong></a></>}</p>
                <div className='second-row-holder'>
                    <div className='inline-block deck-data-item' id="database-buttons">
                        <br />
                        <button className='deck-button' onClick={deckFunctions.createDeck}>Save deck</button>
                        <button className='deck-button' onClick={() => deckFunctions.updateDeck(deckIdFunctions.deckUUID)}>Update deck</button>
                        <button className='deck-button' onClick={deleteCurrentDeck}>Delete deck</button>
                    </div>
                    <div className='inline-block deck-data-item'>
                        <form onSubmit={(evt) => evt.preventDefault()}>
                            <label id="deck-name-label" htmlFor='deck-name'>Deck Name</label>
                            <label htmlFor='format'>Format</label><br />
                            <input id="deck-name" type="text" onChange={(evt) => setDeckInfo({...deckInfo,name:evt.target.value})}/>
                            <select id="format" className='deck-select' onChange={(evt) => setDeckInfo({...deckInfo,format:evt.target.value})}>
                                <option value="">None</option>
                                <option value="commander">Commander</option>
                                <option value="standard">Standard</option>
                                <option value="pauper">Pauper</option>
                                <option value="modern">Modern</option>
                                <option value="legacy">Legacy</option>
                            </select>
                        </form>
                    </div>
                    <div className='inline-block deck-data-item'>
                        <label>Load Deck</label><br />
                        <select onChange={(e) => {deckIdFunctions.setDeckUUID(e.target.value);}} value={deckFunctions.deckUUID}>
                            <option key={0} value={null}>Choose Deck</option>
                            {userDecks.map((deck) => (
                                <option key={deck._deck_id} value={deck._deck_id}>{deck.deck_info.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='inline-block deck-data-item'>
                        <label htmlFor='file-input'>Upload Deck File</label><br />
                        <input id="file-input" type="file" onChange={handleFileInput}/>
                        <button className='deck-button' onClick={() => exportDeck()}>Export Deck</button>
                    </div>
                </div>
                <a className="hidden" target="blank" id='download-link-btn' download={`${deckInfo.name}.txt`} href={fileDownloadUrl}>download it</a>
            </div>
            <div className='deck-holder'>
                <div className='deck-text-holder inline-block'>
                    <DeckText notFoundArray={notFoundArray} getNamedCard={getNamedCard} getIdentifiers={getFileIdentifiers} deck={deck} formatText={formatForFile}/>
                </div>
                <div className='deck-holder inline-block'>
                    <div className='list-holder deck-list-holder'>
                        {
                            (deck.length > 0 ?
                            deck.map(card => (
                                card ? <DeckCard swapPrintings={swapPrintings} getDetailedCard={getDetailedCard} image={images} key={card.id} card={card} changeNumCards={changeNumCards} removeCard={deckFunctions.removeCard}/> : <></>
                            ))
                            : <h3>No cards in your deck</h3>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Deck