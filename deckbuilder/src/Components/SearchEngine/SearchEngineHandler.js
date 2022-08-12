import React from 'react'
import CardList from './CardList/CardList.js';
import {useState, useEffect} from 'react'
import axios from "axios";
import {useParams, useNavigate} from 'react-router-dom';

function SearchEngineHandler({getDetailedCard,addCardToDeck,addMultipleToDeck}) {
    const [cards, setCards] = useState([]);

    const params = useParams()
    
    useEffect(() => {
        getCardData(`https://api.scryfall.com/cards/search?${params.query}`)
    },[])

    const getMore = (url,func,arr) => {
        fetch(url)
        .then(res => res.json())
        .then(data => {
            func(arr => [...arr,...data.data])
            if (data.has_more)
                getMore(data.next_page,func,arr)
        })
    }

    // useEffect(() => {
    //     if (cards.length == 1) {
    //         navigate(`/card/${cards[0].id}`)
    //         setCards([])
    //     }
    // },[cards])

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

    return (
        <>
            <CardList cards={cards} addMultipleIds={addMultipleToDeck} getDetailedCard={getDetailedCard} addToDeck={addCardToDeck}/>
        </>
    )
}

export default SearchEngineHandler