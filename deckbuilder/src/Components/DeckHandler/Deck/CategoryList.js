import React, { useEffect } from 'react'
import { ReactSortable } from "react-sortablejs";
import { useState } from 'react'
import DeckCard from './DeckCard/DeckCard.js'

function List({deck,category,updateDeck,changeNumCards,images,getDetailedCard,swapPrintings,removeCard}) {

    const [cards,setCards] = useState(deck.filter(card => card.category == category) || [])

    useEffect(() => {
        // let categoryCards = deck.filter(card => card.category == category)
        // let changingCards = []
        // cards.forEach(card => {
        //     if (categoryCards.some(cCard => cCard.id == card.id))
        //         changingCards.push(card)
        // })
        // let newCards = changingCards.map(card => (
        //     {...card,category}
        // ))
        // if (newCards.length != cards.length)
        //     setCards(newCards)
        // console.log("Update Deck")
        updateDeck(cards,category)
    },[cards])

    useEffect(() => {
        if (cards.length != 5)
            console.log("Deck Update",cards.length,category)
        let newCardData = []
        let changed = false;
        let categoryCards = deck.filter(card => card.category == category) || []
        if (cards.length != 5)
            console.log("Category Cards",categoryCards.length,category)
        if (categoryCards?.[0]) {
            newCardData = [...categoryCards]
            newCardData.forEach((card,index) => {
                newCardData[index] = {...card,category}
            })
            if (newCardData.length != cards.length)
                changed = true;
        } else {
            setCards([])
        }
        for (let i = 0; i < newCardData.length; i++) {
            let compareCard = cards.filter(card => newCardData[i].id == card.id)[0]
            if (compareCard?.num_copies != newCardData[i].num_copies) {
                changed = true;
                break;
            }
        }
        if (changed) {
            console.log("New cards",newCardData.length,category)
            console.log("Deck changed")
            setCards(newCardData)
        }
    },[deck])

    return (
        <ReactSortable group="shared" className='card-holder' list={cards} setList={setCards} animation={150}>
            {cards.map(card => (
                card ? <DeckCard swapPrintings={swapPrintings} getDetailedCard={getDetailedCard} image={images} key={card.id} card={card} changeNumCards={changeNumCards} removeCard={removeCard}/> : <></>
            ))}
            {/* <div className='card-img spacer'></div>
            <div className='card-img spacer'></div>
            <div className='card-img spacer'></div>
            <div className='card-img spacer'></div>
            <div className='card-img spacer'></div> */}
        </ReactSortable>
    )
}

export default List