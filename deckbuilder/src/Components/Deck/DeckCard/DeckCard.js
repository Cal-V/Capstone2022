import React from 'react'
import { useState, useEffect } from 'react'
import "./DeckCard.css"
import axios from 'axios'

function DeckCard({card,changeNumCards,image,getDetailedCard,swapPrintings}) {

    useEffect(() => {
        setIsImage(image)
    },[image])

    const [transformIndex, setTransformIndex] = useState(0)
    const [isImage,setIsImage] = useState(image)
    const [printings,setPrintings] = useState([])

    useEffect(() => {
        getAllPrintings(card)
    },[])

    const getAllPrintings = async (card) => {
        let response = await axios.get(card.prints_search_uri)
        setPrintings(response.data.data)
    }

    const card_faces = (card.card_faces ? card.card_faces : [card])

    return (
        <div className=''>
            {!card.image_uris ? 
            <a className='deck-card-link' onClick={() => getDetailedCard(card.id)}>
                {isImage ?
                    <img className='card-img card-style' src={card_faces[transformIndex].image_uris.normal} />
                    :
                    <p className='centered-text'>{card_faces[transformIndex].name}</p>
                }
                <button className="transform-button" onClick={() => {setTransformIndex((transformIndex+1)%2)}}>Flip</button>
            </a>
            :
            <a className='deck-card-link' onClick={() => getDetailedCard(card.id)}>
                {isImage ?
                    <img className='card-img card-style' src={card.image_uris.normal} />
                    :
                    <p className='centered-text'>{card.name}</p>
                }
            </a>}
            <div className='deck-card-functions'>
                {image ? <></> : <button className='transform-button' onClick={() => setIsImage(!isImage)}>{isImage ? "Hide" : "Show"} Card</button>}
                <div>
                    <input type='number' className='num-copies-box' value={card.num_copies} onChange={(evt) => changeNumCards(card,evt.target.value)} />
                </div>
                <select value={card.set} onChange={(evt) => swapPrintings(card.oracle_id,evt.target.value)}>
                    {
                        printings.map((card) => (
                            <option key={card.id} value={card.id}>{card.set} {card.collector_number}</option>
                        ))
                    }
                </select>
            </div>
        </div>
    )
}

export default DeckCard