import React from 'react'
import { useState } from 'react'

export const Card = ({card,getDetailedCard,addToDeck}) => {
    //console.log(card.card_faces != undefined ? card.card_faces[0].oracle_text : card.oracle_text)
    const [transformIndex, setTransformIndex] = useState(0)
    const card_faces = (card.card_faces ? card.card_faces : [card])

    const handleRightClick = (evt) => {
        evt.preventDefault();
        addToDeck(card.set,card.collector_number)
    }
    
    return (
        <div className="card-list-item" id={card.id}>
            {!card.image_uris ? 
                <>
                    <img className='card-img card-style' onContextMenu={handleRightClick} onClick={() => getDetailedCard(card.id)} src={card_faces[transformIndex].image_uris.normal} />
                    <button className="small-transform-button" onClick={() => {setTransformIndex((transformIndex+1)%2)}}>Flip</button>
                </>
                :
                <>
                    <img className='card-img card-style' onContextMenu={handleRightClick} onClick={() => getDetailedCard(card.id)} src={card.image_uris.normal} />
                </>}
        </div>
    )
}

export default Card