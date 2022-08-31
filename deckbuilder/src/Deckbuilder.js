import React from 'react'
import DetailedCard from "./Components/DetailedCard/CardDetails/CardDetails.js"
import {useState, useEffect} from "react"
import Modal from './Components/Modal.js';
import SearchEngineHandler from './Components/SearchEngine/SearchEngineHandler.js';
import DeckHandler from './Components/DeckHandler/DeckHandler.js';
import axios from "axios";
import { Route, Routes, useNavigate } from 'react-router-dom';
import NavBar from './Components/SearchEngine/NavBar.js';
import Advanced from './Components/SearchEngine/Advanced.js';

function Deckbuilder({userMethods,isLoggedIn,loginVisible,setLoginVisible,user,errorMessage,userDecks,setUserDecks}) {

    const navigate = useNavigate()

    const [deckInfo, setDeckInfo] = useState({name: "Unnamed Deck"}) //name, format legality
    const [deck,setDeck] = useState([])
    const [deckUUID, setDeckUUID] = useState(null)

    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery,setSearchQuery] = useState("order=name&dir=auto&q=")

    useEffect(() => {
        console.log("Test")
    },[])
    
    useEffect(() => {
        console.log("Deck updated", deck.length)
    },[deck])

    const updateSearchQuery = (order, direction, query) => {
        order = order || "name"
        direction = direction || "auto"
        let newQ = `order=${order}&dir=${direction}&q=${query}`
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
        const response = await axios.post(
            "https://api.scryfall.com/cards/collection",
            {identifiers: ids}
        )
        setDeck([...deck,...response.data.data.map(card => (
            {...card,num_copies:1,category:"No Category"}
        ))])
    }

    return (
        <div className="App">
        {/* 
        <Route path="/" component={Home}/>
        <Route path="/messages" component={Messages}/>
        <Route path="/about" component={About}/>

        "/" and /card/* redirect to /card/:id of a random card
        /card/:id random detailed card
        /card/search q={searchquery}
        /deck/{userId (can be null if not logged in)}/{deckId (can be null if unsaved deck)}
        */}
        <NavBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} deck={deck} deckInfo={deckInfo} deckUUID={deckUUID} handleLogout={userMethods.handleLogout} getRandomCard={getRandomCard} updateSearchQuery={updateSearchQuery} setLoginVisible={setLoginVisible} isLoggedIn={isLoggedIn} loginVisible={loginVisible}/>
        <Routes>
            <Route path={`search/:query`} element={<SearchEngineHandler addMultipleToDeck={addMultipleToDeck} getDetailedCard={getDetailedCard} deck={deck} loginVisible={loginVisible} setLoginVisible={setLoginVisible} handleLogout={userMethods.handleLogout} setDetailedCard={getDetailedCard} addCardToDeck={addCardToDeck} setDeck={setDeck}/>} />
            <Route path={`card/:id`} element={<DetailedCard addToDeck={addCardToDeck} getDetailedCard={getDetailedCard} />} />
            <Route path={`card/random`} element={<DetailedCard getRandomCard={getRandomCard} addToDeck={addCardToDeck} getDetailedCard={getDetailedCard} />} />
            <Route path={`/`} element={<DetailedCard getRandomCard={getRandomCard} addToDeck={addCardToDeck} getDetailedCard={getDetailedCard} />} />
            <Route path={`deck`} element={<DeckHandler addCardToDeck={addCardToDeck} deckInfo={deckInfo} setDeckInfo={setDeckInfo} deckUUID={deckUUID} setDeckUUID={setDeckUUID} getDetailedCard={getDetailedCard} user={user} deck={deck} setDeck={setDeck} userDecks={userDecks} isLoggedIn={isLoggedIn} setUserDecks={setUserDecks} />} />
            <Route path={`deck/:id`} element={<DeckHandler addCardToDeck={addCardToDeck} deckInfo={deckInfo} setDeckInfo={setDeckInfo} deckUUID={deckUUID} setDeckUUID={setDeckUUID} getDetailedCard={getDetailedCard} user={user} deck={deck} setDeck={setDeck} userDecks={userDecks} isLoggedIn={isLoggedIn} setUserDecks={setUserDecks} />} />
            <Route path={`/advanced`} element={<Advanced setSearchTerm={setSearchTerm} updateSearchQuery={updateSearchQuery} />} />
        </Routes>
        {loginVisible ?
        <Modal errorMessage={errorMessage} userMethods={userMethods} setLoginVisible={setLoginVisible}/>
        :
        <></>}
        </div>
    );
}

export default Deckbuilder