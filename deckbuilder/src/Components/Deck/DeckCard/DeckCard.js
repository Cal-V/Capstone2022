import React from 'react'
import { useState } from 'react'

function DeckCard({card,removeCard,changeNumCards,numCards,setNumCards}) {

    //const [numCopies,setNumCopies] = useState(1)

    const [transformIndex, setTransformIndex] = useState(0)
    const card_faces = (card.card_faces ? card.card_faces : [card])

    

    return (
        <div className='card-list-item'>
            <div id={card.id}>
                {!card.image_uris ? 
                    <>
                        <img className='card-img card-style' src={card_faces[transformIndex].image_uris.normal} />
                        <button className="transform-button" onClick={() => {setTransformIndex((transformIndex+1)%2)}}>Flip</button>
                    </>
                    :
                    <>
                        <img className='card-img card-style' src={card.image_uris.normal} />
                    </>}
                    <div className='deck-card-functions'>
                        <button className='transform-button' onClick={() => removeCard(card)}>Remove Card</button>
                        <div>
                            <button className='transform-button inline' onClick={() => changeNumCards(card,false)}>↓</button>
                            <p className='inline'>{numCards}</p>
                            <button className='transform-button inline' onClick={() => changeNumCards(card,true)}>↑</button>
                        </div>
                    </div>
            </div>
            <div>
            </div>
        </div>
    )
}

export default DeckCard