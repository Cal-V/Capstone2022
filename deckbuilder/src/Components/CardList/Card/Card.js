import React from 'react'
import { useState } from 'react'

export const Card = ({card,getDetailedCard,addToDeck}) => {
    
    //for showing the front ot back face of a card
    const [transformIndex, setTransformIndex] = useState(0)

    //putting the individual cards in an array like multiface cards are to iterate through thenm later
    const card_faces = (card.card_faces ? card.card_faces : [card])

    //adding the card to the current deck on right click
    const handleRightClick = (evt) => {
        evt.preventDefault();
        addToDeck(card.id)
    }
    
    return (
        <div className="card-list-item" id={card.id}>
            {/* either giving an ability to flip the card if needed, else just showing the front face */}
            {!card.image_uris ? 
                <>
                    <img className={`card-img card-style ${transformIndex == 0 ? "face-up" : "flipped"}`} onContextMenu={handleRightClick} onClick={() => getDetailedCard(card.id)} src={card_faces[transformIndex].image_uris.normal} />
                    <button className="small-transform-button" onClick={() => {setTransformIndex((transformIndex+1)%2)}}>Flip</button>
                </>
                :
                <>
                    <img className='card-img card-style' onContextMenu={handleRightClick} onClick={() => getDetailedCard(card.id)} src={card.image_uris.normal} />
                </>
            }
        </div>
    )
}

export default Card