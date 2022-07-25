import React from 'react'
import CardList from './Components/CardList/CardList.js';
import DetailedCard from "./Components/DetailedCard/CardDetails/CardDetails.js"
import {useState, useEffect} from "react"
import Deck from './Components/Deck/Deck.js';
import Modal from './Components/Modal.js';
import axios from "axios";

function Deckbuilder({userMethods,isLoggedIn,loginVisible,setLoginVisible,user,errorMessage,userDecks,setUserDecks}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [order, setOrder] = useState("name");
    const [direction, setDirection] = useState("auto");
    const [cards, setCards] = useState([]);
    const [alternateArts, setAlternateArts] = useState([])

    const [deck,setDeck] = useState([])
    const [seeDeck, setSeeDeck] = useState(false)
    const [deckUUID, setDeckUUID] = useState(null)
    const [deckInfo, setDeckInfo] = useState({name: "Unnamed Deck"}) //name, format legality
    const [notFoundArray,setNotFoundArray] = useState([])

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
            if (data.data?.length == 1) {
                let artUrl = data.data[0].prints_search_uri;
                artUrl = `${artUrl.substring(0,artUrl.indexOf("&unique=prints"))} lang:${data.data[0].lang}&unique=prints`
                getArts(artUrl)
            }
            if (data?.has_more)
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

    const swapPrintings = async (oracle_id,newId) => {
        let cards = [...deck]
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i]
            if (card.oracle_id == oracle_id) {
                const res = await axios.get(`https://api.scryfall.com/cards/${newId}`)
                cards[i] = res.data
            }
        }
        setDeck(cards)
    }

    const getDeckCards = async (identifiers) => {
        if (identifiers.length < 75) {
            let response = await axios.post(
                "https://api.scryfall.com/cards/collection",
                {identifiers}
            )
            setDeck(response.data.data)
            console.log("Cards not Found",response.data.not_found)
            setNotFoundArray(response.data.not_found)
        } else {
            let cards = []
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
            setDeck(cards)
            setNotFoundArray(notFound)
        }
    }

    const getDeckCardsWithNums = async (cardInfo) => {
        let identifiers = []
        let numCopies = []
        cardInfo.forEach(card => {
            identifiers.push(card.id)
            numCopies.push(card.num_copies)
        })
        let cards = []
        console.log("Identifiers",identifiers)
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
        cardInfo.forEach(info => {
            let card = cards.filter(card => card?.set == info.id.set && card?.collector_number == info.id.collector_number)?.[0]
            if (card) {
                card["num_copies"] = info.num_copies
                updatedCards.push(card)
            }
        })
        setDeck(updatedCards)
        //console.log("Cards not Found",response.data.not_found)
    }

    const getNamedCard = async (name) => {
        const res = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${name}`).catch(err => {
            //console.log("Error",err)
            return null;
        });
        return res?.data
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
        setDeckInfo(response.data.deck_info || {name:"Unnamed Deck"})
        getDeckCards(response.data.cards)
    }

    const createDeck = async () => {
        let deckData = []
        deck.forEach(card => {
            deckData.push({
                id: card.id,
                num_copies: card.num_copies
            })
        })
        console.log(deckData)
        const response = await axios.post(
            "http://localhost:4000/deck/create",
            {
                uuid: user.uuid,
                deckData:deckData,
                deckInfo
            }
        );
        setDeckUUID(response.data)
        setUserDecks()
    }

    const updateDeck = async deckId => {
        let deckData = []
        deck.forEach(card => {
            deckData.push({
                id: card.id,
                num_copies: card.num_copies
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
        setUserDecks()
    }

    const deleteDeck = async deckId => {
        setDeck([])
        setDeckUUID(null)
        const response = await axios.post(
            "http://localhost:4000/deck/delete",
            {
                uuid: user.uuid,
                deckId
            }
        );
        setUserDecks()
    }

    const checkNumCards = () => {
        let deckCards = deck.map((card) => (
            card?.num_copies ? card = card : card = {...card,num_copies:1}
        ))
        setDeck(deckCards)
    }

    useEffect(() => {
        if (deck.length > 0 && deck.some((card) => !card?.num_copies))
            checkNumCards()
    },[deck])

    useEffect(() => {
        if(deckUUID)
            loadDeck(deckUUID)
    },[deckUUID])

    useEffect(() => {
        if (searchTerm.length > 0)
        getData(`https://api.scryfall.com/cards/search?order=${order}&q=${searchTerm.replace('(',"%28").replace(')',"%29").replace(' ',"%20").replace(':',"%3A").replace('=',"%3D")}&dir=${direction}`)
    }, [order,direction])

    const addCardToDeck = async (id,num) => {
        let num_copies = num || 1
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

    const changeNumCopies = (id,num_copies) => {
        let deckCards = []
        deck.forEach(card => {
            card.id == id ? deckCards.push({...card,num_copies}) : deckCards.push(card)
        })
        console.log("Copies changed",deckCards)
        setDeck(deckCards)
    }

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
                card = {...card,num_copies:1}
            ))
            setDeck([...deck,...cards])
        }
    }

    const removeCard = (card) => {
        setDeck(deck.filter(deckCard => 
            deckCard.id != card.id
        ))
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setSeeDeck(false)
        let url = `https://api.scryfall.com/cards/search?order=${order}&q=${searchTerm.replace('(',"%28").replace(')',"%29").replace(' ',"%20").replace(':',"%3A").replace('=',"%3D")}&dir=${direction}`
        getData(url);
    }

    const getDetailedCard = (id) => {
        setSeeDeck(false)
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
            <Deck swapPrintings={swapPrintings} notFoundArray={notFoundArray} getNamedCard={getNamedCard} getDeckCardsWithNums={getDeckCardsWithNums} deckInfo={deckInfo} setDeckInfo={setDeckInfo} getDetailedCard={getDetailedCard} changeNum={changeNumCopies} userDecks={userDecks} deck={deck} setDeck={setDeck} deckIdFunctions={{deckUUID,setDeckUUID}} deckFunctions={{removeCard,createDeck,loadDeck,deleteDeck,updateDeck,}}/>
        :
            (cards.length != 1 ? 
            <section>
                <CardList cards={cards} addMultipleIds={addMultipleToDeck} getDetailedCard={getDetailedCard} addToDeck={addCardToDeck}/>
            </section>
            :
            <section>
                <DetailedCard key={cards[0].id} card={cards[0]} addToDeck={addCardToDeck} getDetailedCard={getDetailedCard} alternateArts={alternateArts}/>
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