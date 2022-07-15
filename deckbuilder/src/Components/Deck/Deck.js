import React from 'react'
import DeckCard from './DeckCard/DeckCard.js'
import {useState} from "react"
import "./Deck.css"

function Deck({cardFunctions,deckIdFunctions,deckFunctions}) {

    const loadNewDeck = (evt) => {
        evt.preventDefault();
        deckFunctions.loadDeck(deckIdFunctions.deckUUID)
    }

    const deleteCurrentDeck = evt => {
        evt.preventDefault();
        deckFunctions.deleteDeck(deckIdFunctions.deckUUID)
    }

    return (
        <>
            <div className='deck-holder'>
                <div className='list-holder'>
                    {
                        (cardFunctions.deck.length > 0 ?
                        cardFunctions.deck.map(c => (
                            <DeckCard key={c.id} card={c} removeCard={deckFunctions.removeCard}/>
                        ))
                        : <h3>No cards in your deck</h3>
                        )
                    }
                </div>
            </div>
            <div className='deck-data'>
                <button className='transform-button' onClick={deckFunctions.createDeck}>Save deck</button>
                <button className='transform-button' onClick={() => deckFunctions.updateDeck(deckIdFunctions.deckUUID)}>Update deck</button>
                <button className='transform-button' onClick={deleteCurrentDeck}>Delete deck</button>
                <p>Deck ID = <strong>{deckIdFunctions.deckUUID}</strong></p>
                <form onSubmit={loadNewDeck}>
                    <label htmlFor='deck-uuid'>Load Deck</label>
                    <input id="deck-uuid" type="text" placeholder="UUID" onChange={(e) => deckIdFunctions.setDeckUUID(e.target.value)}/>
                    <input type="submit" value="Load Deck" />
                </form>
            </div>
        </>
    )
}

export default Deck