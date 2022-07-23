import React from 'react'
import { useState, useEffect } from 'react'
import "./DeckCard.css"

function DeckCard({card,removeCard,changeNumCards,image,getDetailedCard}) {

    useEffect(() => {
        setIsImage(image)
    },[image])

    const [transformIndex, setTransformIndex] = useState(0)
    const [isImage,setIsImage] = useState(image)

    const card_faces = (card.card_faces ? card.card_faces : [card])

    return (
        <div className='card-list-item'>
            <div id={card.id}>
                {!card.image_uris ? 
                    <a onClick={() => getDetailedCard(card.id)}>
                        {isImage ?
                            <img className='card-img card-style' src={card_faces[transformIndex].image_uris.normal} />
                            :
                            <p className='centered-text'>{card_faces[transformIndex].name}</p>
                        }
                        <button className="transform-button" onClick={() => {setTransformIndex((transformIndex+1)%2)}}>Flip</button>
                    </a>
                    :
                    <a onClick={() => getDetailedCard(card.id)}>
                        {isImage ?
                            <img className='card-img card-style' src={card.image_uris.normal} />
                            :
                            <p className='centered-text'>{card.name}</p>
                        }
                    </a>}
                    <div className='deck-card-functions'>
                        {image ? <></> : <button className='transform-button' onClick={() => setIsImage(!isImage)}>{isImage ? "Hide" : "Show"} Card</button>}
                        <button className={`transform-button${image ? "" : " inline"}`} onClick={() => removeCard(card)}>Remove Card</button>
                        <div>
                            <button className='transform-button inline arrows' onClick={() => changeNumCards(card,false)}>&#65293;</button>
                            <p className='inline num-copies'>{card.num_copies}</p>
                            <button className='transform-button inline arrows' onClick={() => changeNumCards(card,true)}>&#65291;</button>
                        </div>
                    </div>
            </div>
            <div>
            </div>
        </div>
    )
}

export default DeckCard