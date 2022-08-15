import React from 'react'
import {useState, useEffect} from "react"
import DeckText from './DeckText.js'
import "./Deck.css"
import { useNavigate, useParams } from 'react-router-dom'
import CategoryList from "./CategoryList"
import axios from 'axios'

function Deck({addCardToDeck,setDeck,deck,deckIdFunctions,deckFunctions,userDecks,changeNum,getDetailedCard,deckInfo,setDeckInfo,getDeckCardsWithNums,getNamedCard,notFoundArray,swapPrintings}) {

    const params = useParams()

    useEffect(() => {
        if (params.id != deckIdFunctions.deckU) {
            deckFunctions.loadDeck(params.id)
        }
    },[params.id])

    const [fileDownloadUrl,setFileDownloadUrl] = useState(null)
    //bool for if the cards are shown as images or just as names
    const [images,setImages] = useState(true)
    //bool for marking if this version of the deck has been saved to the database
    const [isSaved,setIsSaved] = useState(true)
    //the deck card list, organised by categories
    const [groupedCards,setGroupedCards] = useState([])
    const [categoryList,setCategoryList] = useState("")
    //the format of the file for export
    const [fileFormat,setFileFormat] = useState("full")

    const [nameSearchOutput,setNameSearchOutput] = useState([])

    const navigate = useNavigate()

    //initiating the file download when the url updates
    useEffect(() => {
        if (fileDownloadUrl) {
            document.getElementById("download-link-btn").click();
            setFileDownloadUrl(null)
            URL.revokeObjectURL(fileDownloadUrl)
        }
    },[fileDownloadUrl])

    //clearing the category list when the deck changes
    useEffect(() => {
        setCategoryList("")
    },[deckIdFunctions.deckUUID])

    //organising the cards into their categories when the deck is updated
    useEffect(() => {
        setIsSaved(false)
        let newList = `${categoryList}\n`
        let categories = categoryList.split("\n")
        deck.forEach(card => {
            if (!categories.includes(card.category)) {
                categories.push(card.category)
                newList += `${card.category}\n`
            }
        })
        setCategoryList(newList.trim())
        let cards = deck.sort((a,b) => {
            return categories.findIndex(category => category == a.category) - categories.findIndex(category => category == b.category)
        })
        setGroupedCards(cards)
    },[deck])

    //checking if the deck is legal when the format or the deck changes
    useEffect(() => {
        checkLegalities()
    },[deckInfo.format,deck])

    //iterates through the cards to see if they're legal in the current listed format and updates the deck info to show that
    //will become more complex later for more specific legality checking
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

    //deletes deck from the database
    const deleteCurrentDeck = evt => {
        evt.preventDefault();
        deckFunctions.deleteDeck(deckIdFunctions.deckUUID)
        setDeck([])
        setCategoryList("")
        navigate("/deck")
    }

    //reads in the input file and updates the deck
    const handleFileInput = (evt) => {
        const file = evt.target.files[0]
        let reader = new FileReader();
        reader.readAsText(file);

        //getting the text and sending it to the update method
        reader.onload = function() {
            getFileIdentifiers(reader.result)
        };

        //logging the error if there is one
        reader.onerror = function() {
            console.log(reader.error);
        };
    }

    //updating the copies of the cards in the deck
    const changeNumCards = (card,value) => {
        if (value) {
            //removing the card if the value reaches 0
            if (value == 0) {
                deckFunctions.removeCard(card)
            } else {
                //sending to the parent to update the deck data with the new value
                changeNum(card.id,value);
            }
        } else {
            //handling when the field is blank and defaulting back to 1 so the card doesn't get deleted
            changeNum(card.id,"");
        }
    }

    //getting the cards based on input text - assumes mostly correct formatting
    const getFileIdentifiers = (fileText) => {
        //for holding the ids
        let newIds = []
        //splitting into individual lines to iterate through
        fileText = fileText.split("\n")
        //having a variable to hold the current category
        let category = "No category"
        //iterating through the lines
        fileText = fileText.forEach(line => {
            //updating the category if it matches the format
            if (line.match(/\*\*[A-Za-z 0-9,./\\]+\*\*/)) {
                category = line.substring(2,line.length-2)
            } else if (line.length > 0) {
                //nostly used to get the number of copies (the first index) and the collector number (the last index)
                let split = line.split(" ")
                let num_copies = split[0]
                //for putting the id data in
                let id = {}
                //grabbing the set as a code in parentheses
                let set = line.match(/[A-Z0-9a-z]+(?=\))/g)?.[0]
                //grabbing the collector number at the end of the line
                let collector_number = split[split.length-1].trim()
                //updating the id
                id = {
                    set,
                    collector_number
                }
                //making sure all the data is there and if it is adding it to the identifier list
                if (!isNaN(num_copies) && id.set &&  id.collector_number) {
                    newIds.push({id,num_copies,category})
                }
            }
        })
        //if the ids exist, sending them to the parent to update the deck, else setting the deck to an empty array
        if (newIds.length > 0)
            getDeckCardsWithNums(newIds)
        else {
            setDeck([])
        }
    }

    //getting a text output of the deck
    const formatForFile = (useFormat) => {
        //for either partial or full text, defaults to full
        let outputType = useFormat ? fileFormat : "full"
        let deckData = ""
        //grabbing the first category
        let category = groupedCards[0]?.category
        //if it's full text, adding the category
        deckData += outputType == 'full' ? (category ? `**${category}**\n` : "") : ""
        //iterating through the grouped cards
        groupedCards.forEach(card => {
            //adding the category to the text and changing it to the next one if it's a format that includes those
            if (outputType == "full" && card.category != category) {
                category = card.category
                deckData += `**${category}**\n`
            }
            //updating the text based on the output format
            switch (outputType) {
                case "full" :
                case "nocat" : deckData += `${card.num_copies || 1} ${card.name} (${card.set}) ${card.collector_number}\n`; break;
                case "names" : deckData += `${card.name}\n`; break;
                case "copies": deckData += `${card.num_copies || 1} ${card.name}\n`; break;
            }
        });
        //adding the extra categories to the end if they're listed
        if (outputType == "full") {
            categoryList.split("\n").forEach(category => {
                if (category && !deckData.includes(`**${category}**`)) {
                    deckData += `**${category}**\n`
                }
            })
        }
        return deckData
    }

    //exporting deck with the specific file format
    const exportDeck = () => {
        const blob = new Blob([formatForFile(true)])
        setFileDownloadUrl(URL.createObjectURL(blob))
    }

    const saveDeck = async () => {
        const id = await deckFunctions.createDeck();
        setIsSaved(true)
        navigate(`/deck/${id}`)
    }

    const changeDeck = (evt) => {
        let id = evt.target.value
        if (id != params.id) {
            if (id?.length > 12) {
                deckFunctions.loadDeck(id);
            } else {
                setDeck([])
                setCategoryList("")
            }
        }
        navigate(`/deck/${id}`)
    }

    const updateDeckCategories = (cards,category) => {
        cards = cards.map(card => (
            {...card,category}
        ))
        if (cards.length == 0) {
            setDeck(deck.filter(card => card.category != category))
        } else {
            let changed = false;
            let keptCards = []
            let newCards = []
            deck.forEach(dCard => {
                if (!cards.some(card => card.id == dCard.id))
                    keptCards.push(dCard)
            })
            cards.forEach(card => {
                let newCard = deck.filter(dCard => dCard.id == card.id)[0]
                if (newCard?.id)
                    newCards.push({...newCard,category})
            })
            let newDeck = [...newCards,...keptCards]
            let newDeckSorted = newDeck.sort((a,b) => a.id - b.id)
            let deckSorted = deck.sort((a,b) => a.id - b.id)
            for (let i = 0; i < deck.length; i++) {
                if (deckSorted[i] != newDeckSorted[i]) {
                    changed = true;
                    break;
                }
            }
            if (changed) {
                setDeck(newDeck)
            }
        }
    }

    const handleNameSearch = async (evt) => {
        const query = evt.target.value;
        if (query.length >= 4) {
            const response = await axios.get(`https://api.scryfall.com/cards/autocomplete?q=${query}`)
            if (response?.data?.data) {
                setNameSearchOutput(response.data.data)
            }
        } else {
            setNameSearchOutput([])
        }
    }

    const addNamedToDeck = async (name) => {
        const card = await getNamedCard(name)
        if (card?.id)
            await addCardToDeck(card.id)
    }

    return (
        <>
            <h2>{deckInfo.name}</h2>
            {/* bar across the top containing functions for updating higher order things about the deck */}
            <div className='deck-data'>
                {deckInfo.format ? <h4>{deckInfo.format} - {deckInfo.isLegal ? " legal" : "not legal"}</h4> : <></>}
                <p>Show cards as: {images ? <><a className='deck-link' onClick={() => setImages(true)}><strong>Images</strong></a><a className='deck-link' onClick={() => setImages(false)}>Names</a></> : <><a className='deck-link' onClick={() => setImages(true)}>Images</a><a className='deck-link' onClick={() => setImages(false)}><strong>Names</strong></a></>}</p>
                <div className='second-row-holder'>
                    <div className='inline-block deck-data-item' id="database-buttons">
                        <label>{isSaved ? `${deckInfo.name} saved` : ""}</label><br />
                        <button className='deck-button' onClick={() => {saveDeck()}}>Save deck</button>
                        <button className='deck-button' onClick={() => {deckFunctions.updateDeck(deckIdFunctions.deckUUID);setIsSaved(true)}}>Update deck</button>
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
                        <div className='inline-block deck-loading-settings'>
                            <label>Load Deck</label><br />
                            <select onChange={changeDeck} value={deckFunctions.deckUUID}>
                                <option key={0} value="new%20deck">Choose Deck</option>
                                {userDecks.map((deck) => (
                                    <option key={deck._deck_id} value={deck._deck_id}>{deck.deck_info.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='inline-block deck-loading-settings'>
                            <label htmlFor='file-input'>Upload Deck File</label><br />
                            <input id="file-input" type="file" onChange={handleFileInput}/>
                        </div>
                    </div>
                    <div className='inline-block deck-data-item'>
                        <button className='deck-button' onClick={() => exportDeck()}>Export Deck</button>
                        <label className='format-label' htmlFor='file-format'>As</label>
                        <select value={fileFormat} onChange={(evt) => setFileFormat(evt.target.value)} id="file-format">
                            <option value="full">Full Output</option>
                            <option value="nocat">Without Categories</option>
                            <option value="names">Names only</option>
                            <option value="copies">Names and Copies</option>
                        </select>
                    </div>
                </div>
                <a className="hidden" target="blank" id='download-link-btn' download={`${deckInfo.name}.txt`} href={fileDownloadUrl}>download it</a>
            </div>
            <div className='deck-holder'>
                {/* the text file and its functions */}
                <div className='deck-text-holder inline-block'>
                    <input type="text" placeholer="Quick name search" onChange={handleNameSearch} />
                    <br />
                    <strong>Found Cards</strong>
                    <ul>{
                        nameSearchOutput.map(name => (
                            <li key={name}><a onClick={() => addNamedToDeck(name)}>{name}</a></li>
                        ))
                    }</ul>
                    <br />
                    <p>Categories</p>
                    <textarea value={categoryList} onChange={(evt) => setCategoryList(evt.target.value)} rows={categoryList.split("\n").length+1}></textarea>
                    <br />
                    <br />
                    <DeckText categoryList={categoryList} notFoundArray={notFoundArray} getNamedCard={getNamedCard} getIdentifiers={getFileIdentifiers} deck={groupedCards} formatText={formatForFile}/>
                </div>
                {/* the deck itself */}
                <div className='deck-holder inline-block'>
                    <div className='deck-list-holder'>
                        {
                            (groupedCards.length > 0 ?
                            <>{
                                categoryList.split("\n").map((category) => (
                                    <div key={category}>
                                        <h3>{category}</h3>
                                        <CategoryList deck={deck} category={category} updateDeck={updateDeckCategories} swapPrintings={swapPrintings} getDetailedCard={getDetailedCard} images={images} changeNumCards={changeNumCards} removeCard={deckFunctions.removeCard}/>
                                    </div>
                                ))
                            }</>
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