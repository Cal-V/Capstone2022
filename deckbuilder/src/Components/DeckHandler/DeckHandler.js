import React from 'react'
import {useEffect,useState} from 'react'
import Deck from "./Deck/Deck"
import axios from "axios";

function DeckHandler({deckInfo,setDeckInfo,user,deck,setDeck,userDecks,setUserDecks,getDetailedCard,deckUUID,setDeckUUID,addCardToDeck}) {

    const [notFoundArray,setNotFoundArray] = useState([])

    const swapPrintings = async (oracle_id,newId) => {
        let cards = [...deck]
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i]
            if (card.oracle_id == oracle_id) {
                let num_copies = card.numCopies || 1
                let category = card.category || "No category"
                const res = await axios.get(`https://api.scryfall.com/cards/${newId}`)
                cards[i] = {...res.data,num_copies,category}
            }
        }
        console.log(cards.length)
        setDeck(cards)
    }

    const getDeckCards = async (cardInput) => {
        console.log("Get Deck Cards")
        let identifiers = [];
        cardInput = cardInput || []
        cardInput.forEach(id => {
            identifiers.push({id:id.id})
        })
        let cards = []
        if (identifiers?.length > 0) {
            if (identifiers.length < 75) {
                let response = await axios.post(
                    "https://api.scryfall.com/cards/collection",
                    {identifiers}
                )
                cards = response.data.data
                console.log("Cards not Found",response.data.not_found)
                setNotFoundArray(response.data.not_found)
            } else {
                let notFound = []
                for (let i = 0; i < identifiers.length; i += 75) {
                    let ids = i + 75 < identifiers.length ? identifiers.slice(i,i+75) : identifiers.slice(i)
                    let response = await axios.post(
                        "https://api.scryfall.com/cards/collection",
                        {identifiers:ids}
                    )
                    cards = [...cards,...response.data.data]
                    notFound = [...notFound,...response.data.not_found]
                    console.log("Cards not Found",response.data.not_found)
                }
                setNotFoundArray(notFound)
            }
            let updatedCards = []
            cardInput.forEach(info => {
                let card = cards.filter(card => card?.id == info.id)?.[0]
                if (card.id) {
                    card.num_copies = info.num_copies || 1
                    card.category = info.category || "No Category"
                    updatedCards.push(card)
                }
            })
            setDeck(updatedCards)
        } else {
            setDeck([])
            setDeckInfo({name: "Unnamed Deck"})
            setNotFoundArray([])
        }
    }

    const getDeckCardsWithNums = async (cardInfo) => {
        console.log("Get deck cards with data")
        let identifiers = []
        cardInfo.forEach(card => {
            identifiers.push(card.id)
        })
        let cards = []
        if (identifiers.length < 75) {
            let response = await axios.post(
                "https://api.scryfall.com/cards/collection",
                {identifiers}
            )
            cards = response.data.data
            setNotFoundArray(response.data.not_found)
        } else {
            let notFound = []
            for (let i = 0; i < identifiers.length; i += 75) {
                let ids = i + 75 < identifiers.length ? identifiers.slice(i,i+75) : identifiers.slice(i)
                let response = await axios.post(
                    "https://api.scryfall.com/cards/collection",
                    {identifiers:ids}
                )
                cards = [...cards,...response.data.data]
                notFound = [...notFound,...response.data.not_found]
            }
            setNotFoundArray(notFound)
        }
        let updatedCards = []
        cardInfo.forEach(info => {
            let card = cards.filter(card => card?.set == info.id.set && card?.collector_number == info.id.collector_number)?.[0]
            if (card.id) {
                card.num_copies = info.num_copies || 1
                card.category = info.category || "No Category"
                updatedCards.push(card)
            }
        })
        console.log(updatedCards)
        setDeck(updatedCards)
        //console.log("Cards not Found",response.data.not_found)
    }

    const getNamedCard = async (name,set) => {
        const res = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${name}${set ? `&set=${set}` : ""}`).catch(err => {
            //console.log("Error",err)
            return null;
        });
        return res?.data
    }

    const loadDeck = async deckId => {
        setDeckUUID(deckId)
        const loggedInUser = localStorage.getItem("user");
        let foundUser = {}
        //checking if the cookie exists and then updating the user to match
        if (loggedInUser) {
            foundUser = JSON.parse(loggedInUser);
        }
        const response = await axios.post(
            "http://localhost:4000/deck/read",
            {
                uuid: foundUser.uuid,
                deckId
            }
        );
        setDeckInfo(response.data.deck_info || {name:"Unnamed Deck"})
        getDeckCards(response.data.cards)
    }

    const createDeck = async () => {
        let deckData = []
        deck.forEach(card => {
            deckData.push({
                id: card.id,
                num_copies: card.num_copies,
                category: card.category
            })
        })
        const response = await axios.post(
            "http://localhost:4000/deck/create",
            {
                uuid: user.uuid,
                deckData:deckData,
                deckInfo
            }
        );
        setDeckUUID(response.data)
        console.log("UUID changed")
        setUserDecks()
        return response.data
    }

    const updateDeck = async deckId => {
        let deckData = []
        deck.forEach(card => {
            deckData.push({
                id: card.id,
                num_copies: card.num_copies,
                category: card.category
            })
        })
        const response = await axios.post(
            "http://localhost:4000/deck/update",
            {
                uuid: user.uuid,
                deckId,
                deckData,
                deckInfo
            }
        );
        setDeckUUID(response.data)
        console.log("UUID changed")
        setUserDecks()
    }

    const deleteDeck = async deckId => {
        setDeck([])
        setDeckUUID(null)
        console.log("UUID changed")
        const response = await axios.post(
            "http://localhost:4000/deck/delete",
            {
                uuid: user.uuid,
                deckId
            }
        );
        setUserDecks()
    }

    const changeNumCopies = (id,num_copies) => {
        let deckCards = []
        deck.forEach(card => {
            card.id == id ? deckCards.push({...card,num_copies}) : deckCards.push(card)
        })
        setDeck(deckCards)
    }

    const removeCard = (card) => {
        setDeck(deck.filter(deckCard => 
            deckCard.id != card.id
        ))
    }

    return (
        <Deck addCardToDeck={addCardToDeck} swapPrintings={swapPrintings} notFoundArray={notFoundArray} getNamedCard={getNamedCard} getDeckCardsWithNums={getDeckCardsWithNums} deckInfo={deckInfo} setDeckInfo={setDeckInfo} getDetailedCard={getDetailedCard} changeNum={changeNumCopies} userDecks={userDecks} deck={deck} setDeck={setDeck} deckIdFunctions={{deckUUID,setDeckUUID}} deckFunctions={{removeCard,createDeck,loadDeck,deleteDeck,updateDeck,}}/>
    )
}

export default DeckHandler