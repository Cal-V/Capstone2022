import React from 'react'
import { useState, useEffect } from 'react'
import "./DeckCard.css"
import axios from 'axios'

function DeckCard({card,changeNumCards,image,getDetailedCard,swapPrintings}) {

    //for showing the front ot back face of a card
    const [transformIndex, setTransformIndex] = useState(0)
    //showing as an image or as the name
    const [isImage,setIsImage] = useState(image)
    //list of all the separate printings of the card
    const [printings,setPrintings] = useState([])

    //gets all the printings of the card when it loads in
    useEffect(() => {
        getAllPrintings(card)
    },[])

    //grabbing all the separate printings from the scryfall api (in a separate method for making the async/await to work)
    const getAllPrintings = async (card) => {
        //grabbing the uri for the separate printings of the card as provided by scryfall
        let response = await axios.get(card.prints_search_uri)
        setPrintings(response.data.data)
    }

    //putting the individual cards in an array like multiface cards are to iterate through thenm later
    const card_faces = (card.card_faces ? card.card_faces : [card])

    return (
        <div className=''>
            {/* checking if the card has a defined back side */}
            {!card.image_uris ? 
            <a className='deck-card-link' onClick={() => getDetailedCard(card.id)}>
                {/* showing either the image or the name as a link to get the detailed card for each face */}
                {isImage ?
                    <img className='card-img card-style' src={card_faces[transformIndex].image_uris.normal} />
                    :
                    <p className='centered-text'>{card_faces[transformIndex].name}</p>
                }
                <button className="transform-button" onClick={() => {setTransformIndex((transformIndex+1)%2)}}>Flip</button>
            </a>
            :
            <a className='deck-card-link' onClick={() => getDetailedCard(card.id)}>
                {/* showing either the image or the name as a link to get the detailed card but only the singular face */}
                {isImage ?
                    <img className='card-img card-style' src={card.image_uris.normal} />
                    :
                    <p className='centered-text'>{card.name}</p>
                }
            </a>}
            {/* the individual card options (set,copies,possibly more later) */}
            <div className='deck-card-functions'>
                {image ? <></> : <button className='transform-button' onClick={() => setIsImage(!isImage)}>{isImage ? "Hide" : "Show"} Card</button>}
                <div>
                    <input type='number' className='num-copies-box' value={card.num_copies} onChange={(evt) => changeNumCards(card,evt.target.value)} />
                </div>
                {/* iterating through the printing in a drop down so the user can change the printing within the deck */}
                <select value={card.id} onChange={(evt) => swapPrintings(card.oracle_id,evt.target.value)}>
                    {
                        printings.map((printing) => (
                            <option key={printing.id} value={printing.id}>{printing.set} {printing.collector_number}</option>
                        ))
                    }
                </select>
            </div>
        </div>
    )
}

export default DeckCard