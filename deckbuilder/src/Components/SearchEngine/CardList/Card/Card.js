import React from 'react'
import { useState, useEffect } from 'react'
import "./Card.css"

export const Card = ({card,getDetailedCard,addToDeck,updateSelected,canSelect}) => {
    
    //for showing the front ot back face of a card
    const [transformIndex, setTransformIndex] = useState(0)

    //putting the individual cards in an array like multiface cards are to iterate through thenm later
    const card_faces = (card.card_faces ? card.card_faces : [card])

    const [selected,setSelected] = useState(false)

    //adding the card to the current deck on right click
    const handleRightClick = (evt) => {
        evt.preventDefault();
        addToDeck(card.id)
    }

    useEffect(() => {
        setSelected(false)
    },[canSelect])

    const handleClick = () => {
        console.log(canSelect)
        if (canSelect) {
            updateSelected(card.id,!selected)
            setSelected(!selected)
        } else {
            getDetailedCard(card.id)
        }
    }
    
    return (
        <div className={`card-list-item`} id={card.id}>
            {/* either giving an ability to flip the card if needed, else just showing the front face */}
            {!card.image_uris ? 
                <>
                    <img className={`card-img card-style ${transformIndex == 0 ? "face-up" : "flipped"}${selected ? " selected" : ""}`} onContextMenu={handleRightClick} onClick={handleClick} src={card_faces[transformIndex].image_uris.normal} />
                    <button className="small-transform-button" onClick={() => {setTransformIndex((transformIndex+1)%2)}}>Flip</button>
                </>
                :
                <>
                    <img className={`card-img card-style${selected ? " selected" : ""}`} onContextMenu={handleRightClick} onClick={handleClick} src={card.image_uris.normal} />
                </>
            }
        </div>
    )
}

export default Card