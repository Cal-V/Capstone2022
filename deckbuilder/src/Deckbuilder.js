import React from 'react'
import DetailedCard from "./Components/DetailedCard/CardDetails/CardDetails.js"
import {useState, useEffect} from "react"
import Modal from './Components/Modal.js';
import SearchEngineHandler from './Components/SearchEngine/SearchEngineHandler.js';
import DeckHandler from './Components/DeckHandler/Deck/DeckHandler.js';
import axios from "axios";
import { Route, Routes, useNavigate } from 'react-router-dom';
import NavBar from './Components/SearchEngine/NavBar.js';

function Deckbuilder({userMethods,isLoggedIn,loginVisible,setLoginVisible,user,errorMessage,userDecks,setUserDecks}) {

    const navigate = useNavigate()

    const [deck,setDeck] = useState([])
    const [deckUUID, setDeckUUID] = useState(null)

    const [searchQuery,setSearchQuery] = useState("order=name&dir=auto&q=")

    const updateSearchQuery = (order, direction, query) => {
        let newQ = searchQuery
        if (order) {
            newQ = newQ.substring(0,newQ.indexOf("order=")+6) + order + newQ.substring(newQ.indexOf("&dir="))
        }
        if (direction) {
            newQ = newQ.substring(0,newQ.indexOf("$dir=")+5) + direction + newQ.substring(newQ.indexOf("&q="))
        }
        if (query) {
            newQ = newQ.substring(0, newQ.indexOf("&q=")+3) + query.replace('(',"%28").replace(')',"%29").replace(' ',"%20").replace(':',"%3A").replace('=',"%3D")
        }
        console.log(newQ)
        setSearchQuery(newQ)
        navigate(`/search/${newQ}`)
    }

    const getRandomCard = async (searchTerm) => {
        let url = "https://api.scryfall.com/cards/random" + (searchTerm ? `?q=${searchTerm.replace('(',"%28").replace(')',"%29").replace(' ',"%20").replace(':',"%3A").replace('=',"%3D")}` : "")
        console.log(url)
        const response = await axios.get(url)
        navigate(`/card/${response.data.id}`)
    }

    const getDetailedCard = async (id) => {
        const response = await axios.get(`https://api.scryfall.com/cards/${id}`)
        navigate(`/card/${response.data.id}`)
    }

    const addCardToDeck = async (id,num,cat) => {
        console.log("Added Card ID",id)
        console.log("prev deck",deck)
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
                num_copies,
                category
            }
            setDeck([...deck,newCard])
        }
    }

    //default category and num copies bc it's added from search
    const addMultipleToDeck = async (ids) => {
        for (let i = 0; i < ids.length; i++) {
            addCardToDeck(ids[i])
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
        <NavBar deckUUID={deckUUID} handleLogout={userMethods.handleLogout} getRandomCard={getRandomCard} updateSearchQuery={updateSearchQuery} setLoginVisible={setLoginVisible} isLoggedIn={isLoggedIn} loginVisible={loginVisible}/>
        <Routes>
            <Route path={`search/:query`} element={<SearchEngineHandler addMultipleToDeck={addMultipleToDeck} getDetailedCard={getDetailedCard} deck={deck} loginVisible={loginVisible} setLoginVisible={setLoginVisible} handleLogout={userMethods.handleLogout} setDetailedCard={getDetailedCard} addCardToDeck={addCardToDeck} setDeck={setDeck}/>} />
            <Route path={`card/:id`} element={<DetailedCard addToDeck={addCardToDeck} getDetailedCard={getDetailedCard} />} />
            <Route path={`deck/*`} element={<DeckHandler deckUUID={deckUUID} setDeckUUID={setDeckUUID} getDetailedCard={getDetailedCard} user={user} deck={deck} setDeck={setDeck} userDecks={userDecks} isLoggedIn={isLoggedIn} setUserDecks={setUserDecks} />} />
        </Routes>
        {loginVisible ?
        <Modal errorMessage={errorMessage} userMethods={userMethods} setLoginVisible={setLoginVisible}/>
        :
        <></>}
        </div>
    );
}

export default Deckbuilder