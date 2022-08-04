import React from 'react'
import CardList from './CardList/CardList.js';
import {useState, useEffect} from 'react'
import axios from "axios";
import NavBar from './NavBar.js';
import {Link, useNavigate} from 'react-router-dom';

function SearchEngineHandler({getDetailedCard,addCardToDeck,setDeck,deck,handleLogout,loginVisible,setLoginVisible,isLoggedIn}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [order, setOrder] = useState("name");
    const [direction, setDirection] = useState("auto");
    const [cards, setCards] = useState([]);

    const navigate = useNavigate()

    const getMore = (url,func,arr) => {
        fetch(url)
        .then(res => res.json())
        .then(data => {
            func(arr => [...arr,...data.data])
            if (data.has_more)
                getMore(data.next_page,func,arr)
        })
    }

    useEffect(() => {
        if (cards.length == 1) {
            navigate(`/card/${cards[0].id}`,{state:{addCardToDeck}})
            //getDetailedCard(cards[0].id)
            setCards([])
        }
    },[cards])

    useEffect(() => {
        if (searchTerm.length > 0)
        getCardData(`https://api.scryfall.com/cards/search?order=${order}&q=${searchTerm.replace('(',"%28").replace(')',"%29").replace(' ',"%20").replace(':',"%3A").replace('=',"%3D")}&dir=${direction}`)
    }, [order,direction])

    const getCardData = (url) => {
        fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.object == "card") {
            setCards([data])
            }
            else {
            setCards(data.data || []);
            if (data.data?.length == 1) {
                let artUrl = data.data[0].prints_search_uri;
                artUrl = `${artUrl.substring(0,artUrl.indexOf("&unique=prints"))} lang:${data.data[0].lang}&unique=prints`
            }
            if (data?.has_more)
                getMore(data.next_page,setCards,cards)
            }
        })
    }

    //default category and num copies bc it's added from search
    const addMultipleToDeck = async (identifiers) => {
        
        if (identifiers.length + deck.length < 75) {
            let response = await axios.post(
                "https://api.scryfall.com/cards/collection",
                {identifiers}
            )
            setDeck(response.data.data)
        } else {
            let cards = []
            for (let i = 0; i < identifiers.length; i += 75) {
                let ids = i + 75 < identifiers.length ? identifiers.slice(i,i+75) : identifiers.slice(i)
                console.log(ids)
                let response = await axios.post(
                    "https://api.scryfall.com/cards/collection",
                    {identifiers:ids}
                )
                cards = [...cards,...response.data.data]
            }
            cards = cards.map(card => (
                card = {...card,num_copies:1,category:"No Category"}
            ))
            setDeck([...deck,...cards])
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        let url = `https://api.scryfall.com/cards/search?order=${order}&q=${searchTerm.replace('(',"%28").replace(')',"%29").replace(' ',"%20").replace(':',"%3A").replace('=',"%3D")}&dir=${direction}`
        getCardData(url);
    }

    return (
        <>
            <NavBar handleLogout={handleLogout} getCardData={getCardData} searchTerm={searchTerm} setSearchTerm={setSearchTerm} order={order} direction={direction} setDirection={setDirection} setOrder={setOrder} setLoginVisible={setLoginVisible} handleSearch={handleSearch} isLoggedIn={isLoggedIn} loginVisible={loginVisible}/>
            <CardList cards={cards} addMultipleIds={addMultipleToDeck} getDetailedCard={getDetailedCard} addToDeck={addCardToDeck}/>
        </>
    )
}

export default SearchEngineHandler