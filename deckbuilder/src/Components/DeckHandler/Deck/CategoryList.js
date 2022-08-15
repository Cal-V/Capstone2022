import React, { useEffect } from 'react'
import { ReactSortable } from "react-sortablejs";
import { useState } from 'react'
import DeckCard from './DeckCard/DeckCard.js'

function List({deck,category,updateDeck,changeNumCards,images,getDetailedCard,swapPrintings,removeCard}) {

    const [cards,setCards] = useState(deck.filter(card => card.category == category) || [])
    const [changedLocally,setChangedLocally] = useState(false)

    useEffect(() => {
        if (deck.length == 0) {
            setCards([])
        }
        if (!changedLocally) {
            if (deck.filter(d => d.category == category).length != cards.length) {
                setCards(deck.filter(d => d.category == category))
            } else {
                let newCardData = []
                let changed = false;
                cards.forEach(card => {
                    let newCard = deck.filter(d => d.id == card.id)[0]
                    if (newCard?.id) {
                        newCardData.push({...newCard,category})
                    }
                })
                if (newCardData?.[0]) {
                    newCardData.forEach((card,index) => {
                        newCardData[index] = {...card,category}
                    })
                    if (newCardData.length != cards.length)
                        changed = true;
                }
                for (let i = 0; i < newCardData.length; i++) {
                    let compareCard = cards.filter(card => newCardData[i].id == card.id)[0]
                    if (compareCard?.num_copies != newCardData[i].num_copies) {
                        changed = true;
                        break;
                    }
                }
                newCardData = newCardData.sort((a,b) => {
                    return deck.indexOf(deck.filter(card => card.id == a.id)[0]) - deck.indexOf(deck.filter(card => card.id == b.id)[0])
                })
                for (let i = 0; i < newCardData.length; i++) {
                    if (newCardData[i].id != cards?.[i]?.id) {
                        changed = true;
                        break;
                    }
                }
                if (changed) {
                    console.log("Changed",newCardData)
                    setCards(newCardData)
                }
            }
        }
        setChangedLocally(false)
    },[deck])
    
    useEffect(() => {
        setChangedLocally(true)
        updateDeck(cards,category)
    },[cards])

    return (
        cards.length > 0 ?
        <ReactSortable group="shared" className='card-holder' list={cards} setList={setCards} animation={150}>
            {cards.map(card => (
                card ? <DeckCard swapPrintings={swapPrintings} getDetailedCard={getDetailedCard} image={images} key={card.id} card={card} changeNumCards={changeNumCards} removeCard={removeCard}/> : <></>
            ))}
            <div className='card-img spacer'></div>
        </ReactSortable>
        :
        <></>
    )
}

export default List