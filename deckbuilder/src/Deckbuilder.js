import React from 'react'
import DetailedCard from "./Components/DetailedCard/CardDetails/CardDetails.js"
import {useState, useEffect} from "react"
import Modal from './Components/Modal.js';
import SearchEngineHandler from './Components/SearchEngine/SearchEngineHandler.js';
import DeckHandler from './Components/DeckHandler/Deck/DeckHandler.js';
import axios from "axios";
import { Route, Routes, Redirect } from 'react-router-dom';

function Deckbuilder({userMethods,isLoggedIn,loginVisible,setLoginVisible,user,errorMessage,userDecks,setUserDecks}) {

    const [deck,setDeck] = useState([])
    const [detailedCard,setDetailedCard] = useState({})

    useEffect(() => {
        getRandomCard()
    },[])

    const getRandomCard = async () => {
        const response = await axios.get("https://api.scryfall.com/cards/random")
        setDetailedCard(response.data)
    }

    const getDetailedCard = async (id) => {
        const response = await axios.get(`https://api.scryfall.com/cards/${id}`)
        setDetailedCard(response.data)
    }

    const addCardToDeck = async (id,num,cat) => {
        let num_copies = num || 1
        let category = cat || "No Category"
        if (!deck.some(card => card.id == id && card.num_copies)) {
            let response = await axios.post(
                "https://api.scryfall.com/cards/collection",
                {identifiers: [
                    {id}
                ]}
            )
            let newCard = {
                ...response.data.data[0],
                num_copies
            }
            setDeck([...deck,newCard])
        }
    }

    return (
        <div className="App">
        <div className='nav-spacer'></div>
        {/* 
        <Route path="/" component={Home}/>
        <Route path="/messages" component={Messages}/>
        <Route path="/about" component={About}/>

        "/" and /card/* redirect to /card/:id of a random card
        /card/:id random detailed card
        /card/search q={searchquery}
        /deck/{userId (can be null if not logged in)}/{deckId (can be null if unsaved deck)}
        */}
        <Routes>
            <Route path='/card/random' component={DetailedCard} />
            <Route path={`card/:id`} component={DetailedCard} />
        </Routes>
        <DetailedCard card={detailedCard} addToDeck={addCardToDeck} getDetailedCard={getDetailedCard} />
        <SearchEngineHandler getDetailedCard={getDetailedCard} deck={deck} loginVisible={loginVisible} setLoginVisible={setLoginVisible} handleLogout={userMethods.handleLogout} setDetailedCard={getDetailedCard} addCardToDeck={addCardToDeck} setDeck={setDeck}/>
        <DeckHandler getDetailedCard={getDetailedCard} user={user} deck={deck} setDeck={setDeck} userDecks={userDecks} isLoggedIn={isLoggedIn} setUserDecks={setUserDecks} />
        {loginVisible ?
        <Modal errorMessage={errorMessage} userMethods={userMethods} setLoginVisible={setLoginVisible}/>
        :
        <></>}
        </div>
    );
}

export default Deckbuilder