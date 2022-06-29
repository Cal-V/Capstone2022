import React from 'react'
import DeckCard from './DeckCard/DeckCard.js'
import {useState} from "react"
import "./Deck.css"

function Deck({cards,createDeck,deckUUID,loadDeck,deleteDeck,updateDeck,removeCard}) {
    const [updatedUUID,setUpdatedUUID] = useState(deckUUID)

    const loadNewDeck = (evt) => {
        evt.preventDefault();
        loadDeck(updatedUUID)
    }

    const deleteCurrentDeck = evt => {
        evt.preventDefault();
        deleteDeck(deckUUID)
    }

    return (
        <>
            <div className='deck-holder'>
                <div className='list-holder'>
                    {
                        (cards.length > 0 ?
                        cards.map(c => (
                            <DeckCard key={c.id} card={c} removeCard={removeCard}/>
                        ))
                        : <h3>No cards in your deck</h3>
                        )
                    }
                </div>
            </div>
            <div className='deck-data'>
                <button className='transform-button' onClick={createDeck}>Save deck</button>
                <button className='transform-button' onClick={updateDeck}>Update deck</button>
                <button className='transform-button' onClick={deleteCurrentDeck}>Delete deck</button>
                <p>Deck ID = <strong>{deckUUID}</strong></p>
                <form onSubmit={loadNewDeck}>
                    <label htmlFor='deck-uuid'>Load Deck</label>
                    <input id="deck-uuid" type="text" placeholder="UUID" onChange={(e) => setUpdatedUUID(e.target.value)}/>
                    <input type="submit" value="Load Deck" />
                </form>
            </div>
        </>
    )
}

export default Deck