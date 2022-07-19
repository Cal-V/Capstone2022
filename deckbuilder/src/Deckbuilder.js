import React from 'react'
import CardList from './Components/CardList/CardList.js';
import DetailedCard from "./Components/DetailedCard/CardDetails/CardDetails.js"
import {useState, useEffect} from "react"
import Deck from './Components/Deck/Deck.js';
import Modal from './Components/Modal.js';
import axios from "axios";

function Deckbuilder({userMethods,isLoggedIn,loginVisible,setLoginVisible,user,errorMessage,userDecks}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [order, setOrder] = useState("name");
    const [direction, setDirection] = useState("auto");
    const [cards, setCards] = useState([]);
    const [alternateArts, setAlternateArts] = useState([])

    const [identifiers, setIdentifiers] = useState([])
    const [deck,setDeck] = useState([])
    const [seeDeck, setSeeDeck] = useState(false)
    const [deckUUID, setDeckUUID] = useState(null)

    useEffect(() => {
        getData("https://api.scryfall.com/cards/random")
    }, [])

    const getData = (url) => {
        fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.object == "card") {
            setCards([data])
            if (alternateArts.length == 0 || data.oracle_id != alternateArts[0].oracle_id) {
                let artUrl = data.prints_search_uri;
                artUrl = `${artUrl.substring(0,artUrl.indexOf("&unique=prints"))} lang:${data.lang}&unique=prints`
                getArts(artUrl)
            }
            }
            else {
            setCards(data.data || []);
            if (data.data.length == 1) {
                let artUrl = data.data[0].prints_search_uri;
                artUrl = `${artUrl.substring(0,artUrl.indexOf("&unique=prints"))} lang:${data.data[0].lang}&unique=prints`
                getArts(artUrl)
            }
            if (data.has_more)
                getMore(data.next_page,setCards,cards)
            }
        })
    }

    const getMore = (url,func,arr) => {
        fetch(url)
        .then(res => res.json())
        .then(data => {
            func(arr => [...arr,...data.data])
            if (data.has_more)
                getMore(data.next_page,func,arr)
        })
    }

    const getArts = (url) => {
        fetch(url)
        .then(res => res.json())
        .then(data => {
            setAlternateArts(data.data)
            if (data.has_more)
                getMore(data.next_page,setAlternateArts,alternateArts)
        })
    } 

    const getDeck = () => {
        fetch('https://api.scryfall.com/cards/collection', {
            method: 'POST',
            body: JSON.stringify({identifiers}),
            headers: {
                "Content-type": "application/json"
            }
            }).then(res => res.json())
        .then(data => {
        setDeck(data.data)
        });
    }

    const loadDeck = async deckId => {
        setDeckUUID(deckId)
        const response = await axios.post(
            "http://localhost:4000/deck/read",
            {
                uuid: user.uuid,
                deckId
            }
        );
        console.log("Load deck")
        console.log(response.data)
        setIdentifiers(response.data)
    }

    const createDeck = async () => {
        const response = await axios.post(
            "http://localhost:4000/deck/create",
            {
                uuid: user.uuid,
                deckData: identifiers
            }
        );
        setDeckUUID(response.data)
    }

    const updateDeck = async deckId => {
        const response = await axios.post(
            "http://localhost:4000/deck/update",
            {
                uuid: user.uuid,
                deckId,
                deckData: identifiers
            }
        );
    }

    const deleteDeck = async deckId => {
        setIdentifiers([])
        setDeck([])
        setDeckUUID("")
        const response = await axios.post(
            "http://localhost:4000/deck/delete",
            {
                uuid: user.uuid,
                deckId
            }
        );
    }

    useEffect(() => {
        if (identifiers.length > 0) {
            getDeck()
        } else {
            setDeck([])
        }
        console.log("Identifiers")
        console.log(identifiers)
    }, [identifiers])

    useEffect(() => {
        if(deckUUID)
            loadDeck(deckUUID)
    },[deckUUID])

    useEffect(() => {
        if (searchTerm.length > 0)
        getData(`https://api.scryfall.com/cards/search?order=${order}&q=${searchTerm.replace('(',"%28").replace(')',"%29").replace(' ',"%20").replace(':',"%3A").replace('=',"%3D")}&dir=${direction}`)
    }, [order,direction])

    const addIdentifier = (set,collector_number) => {
        let newID = {
        set,
        collector_number
        }
        if (identifiers.length == 0)
        setIdentifiers([newID])
        else {
        let hasCopy = identifiers.some(id => id.set == newID.set && id.collector_number == newID.collector_number)
        if (!hasCopy)
            setIdentifiers(identifiers => [...identifiers,newID])
        }
    }

    const removeCard = (card) => {
        setIdentifiers(identifiers.filter(id => 
            id.set != card.set || id.collector_number != card.collector_number
        ))
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setSeeDeck(false)
        let url = `https://api.scryfall.com/cards/search?order=${order}&q=${searchTerm.replace('(',"%28").replace(')',"%29").replace(' ',"%20").replace(':',"%3A").replace('=',"%3D")}&dir=${direction}`
        getData(url);
    }

    const getDetailedCard = (id) => {
        let url = `https://api.scryfall.com/cards/${id}`
        getData(url)
    }

    return (
        <div className="App">
        <nav>
            <button className='nav-button nav-item' onClick={() => {setSeeDeck(false);getData(`https://api.scryfall.com/cards/random?q=${searchTerm.replace('(',"%28").replace(')',"%29").replace(' ',"%20").replace(':',"%3A").replace('=',"%3D")}`)}}>I'm feeling lucky</button>
            <form className='search-form' onSubmit={handleSearch}>
            <input id="search-bar" type="text" className='nav-item' value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
            <input id="search-button" className='nav-button nav-item' type="submit" value="Search" />
            </form>
            <select className='nav-item nav-select' value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="name">Name</option>
            <option value="set">Set</option>
            <option value="released">Date</option>
            <option value="color">Color</option>
            <option value="usd">Price (usd)</option>
            <option value="cmc">Mana Value</option>
            <option value="power">Power</option>
            <option value="toughness">Toughness</option>
            </select>
            <select className='nav-item nav-select' value={direction} onChange={(e) => setDirection(e.target.value)}>
            <option value="auto">Auto</option>
            <option value="asc">Ascending</option>
            <option value="desc">Desceding</option>
            </select>
            <button className='nav-button nav-item' onClick={() => setSeeDeck(!seeDeck)}>{(seeDeck ? "Go Back" : "See Deck")}</button>
            <button className='nav-button nav-item' onClick={() => {setSeeDeck(false);getData("https://api.scryfall.com/cards/random")}}>Random Card</button>
            {isLoggedIn ? 
                <button className='nav-button nav-item nav-button-right' onClick={() => userMethods.handleLogout()}>Logout</button>
                :
                <button className='nav-button nav-item nav-button-right' onClick={() => setLoginVisible(!loginVisible)}>Login/Signup</button>
            }
            
        </nav>
        <div className='nav-spacer'></div>
        {(seeDeck ?
            <Deck userDecks={userDecks} cardFunctions={{deck,setDeck}} deckIdFunctions={{deckUUID,setDeckUUID}} deckFunctions={{removeCard,createDeck,loadDeck,deleteDeck,updateDeck,}}/>
        :
            (cards.length != 1 ? 
            <section>
                <CardList cards={cards} getDetailedCard={getDetailedCard} addToDeck={addIdentifier}/>
            </section>
            :
            <section>
                <DetailedCard key={cards[0].id} card={cards[0]} addToDeck={addIdentifier} getDetailedCard={getDetailedCard} alternateArts={alternateArts}/>
            </section>
            )
        )}
        {loginVisible ?
        <Modal errorMessage={errorMessage} userMethods={userMethods} setLoginVisible={setLoginVisible}/>
        :
        <></>}
        </div>
    );
}

export default Deckbuilder