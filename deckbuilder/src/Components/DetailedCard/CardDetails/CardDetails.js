import React from 'react'
import OracleText from './DetailBlock/OracleText/OracleText'
import {useState,useEffect} from 'react'
import Symbol from "./DetailBlock/Symbol/Symbol"
import "./CardDetails.css"
import axios from "axios";

function CardDetails({card,addToDeck,getDetailedCard}) {

    useEffect(() => {
        if (!card.id) {
            setRandomCard()
        }
    },[])

    const setRandomCard = async () => {
        card = await axios.get("https://api.scryfall.com/cards/random")
    }
    
    //card_faces and transformIndex same as Card and DeckCard
    const card_faces = (card.card_faces ? card.card_faces : [card])
    const [transformIndex, setTransformIndex] = useState(0)

    const [rotateDegrees,setRotateDegrees] = useState(360)

    //list of all the separate printings of the card
    const [printings,setPrintings] = useState([])

    //gets all the printings of the card when it loads in
    useEffect(() => {
        if (card.id)
            getAllPrintings(card)
    },[card])

    //grabbing all the separate printings from the scryfall api (in a separate method for making the async/await to work)
    const getAllPrintings = async (card) => {
        //grabbing the uri for the separate printings of the card as provided by scryfall
        let response = await axios.get(card.prints_search_uri)
        setPrintings(response.data.data)
    }

    // //laoding an alternate printing and reset the scroll to the top
    // const loadNewArt = (card) => {
    //     getDetailedCard(card.id)
    //     window.scrollTo({
    //         top: 0
    //     });
    // }

    if (card.id) {
        return (
            <div className='details-container'>
                {/* List of all the printings of the card and their respective usd prices */}
                <div className='alt-arts half-size'>
                    {/* {printings.map((printing) => (
                        <div onClick={() => loadNewArt(printing)} key={printing.id} className={`alt-art-box selectable${card.id == printing.id ? " current-selected" : ""}`}>
                            <p className='inline'><b>{printing.set}</b> ({printing.collector_number})</p>
                            <p className='right-align inline-text-right'>{printing.prices.usd ? <b><a href={printing.purchase_uris.tcgplayer} target="_blank">{` $${printing.prices.usd}`}</a></b> : ""}</p>
                        </div>
                    ))} */}
                </div>
                {/* end printing list */}
    
                {/* Main card holder with image and card text */}
                <div id='detailed-card-holder'>
                    {/* Holding the image itself */}
                    <div className='card-img-box'>
                        <div id='detailed-card-img-holder' className={`rotate-${rotateDegrees} ${transformIndex == 0 ? "face-up" : "flipped"}`}>
                            {!card.image_uris ? 
                            <>
                                <img id='detailed-card-img' className={`card-border card-shadow-${rotateDegrees}`} src={card_faces[transformIndex].image_uris.png} />
                            </>
                            :
                            <>
                                <img id='detailed-card-img' className={`card-border card-shadow-${rotateDegrees}`} src={card.image_uris.png} />
                            </>}
                        </div>
                        <div className='card-buttons'>
                            {!card.image_uris ? <button className="transform-button" onClick={() => {setTransformIndex((transformIndex+1)%2)}}>Flip</button> : <></>}
                            {/* <button className='transform-button' onClick={() => addToDeck(card.id)}>Add to deck</button> */}
                            <button className='transform-button' onClick={() => setRotateDegrees((rotateDegrees+90)%360)}>Rotate</button>
                        </div>
                    </div>
                    {/* End image box */}
    
                    {/* Holding all of the card text */}
                    <div id='card-details'>
                        {card_faces.map((card,index) => (
                            <div key={index}>
                                <div className={`detail-block${(index > 0 ? " top-border" : "")}`}><h5 className={`${card.name.length > 15 ? `${card.name.length > 27 ? "really-" : ""}long-name` : ""}`}>{(card.printed_name ? card.printed_name : card.name)}</h5></div>
                                {/* iterating through the manacost symbols with that regex and then loading the Symbols that match it */}
                                {card.mana_cost ? <div className='detail-block'>
                                    <p>{
                                        card.mana_cost.match(/[A-Z/0-9∞½]+(?=})/g).map((symbol,index) => (
                                            <Symbol shadow={true} key={index} symbol={symbol} />
                                        ))
                                    }</p>
                                </div> : <></>}
                                {/* showing by default the text of the language on the card, else the english version */}
                                <div className='detail-block'><p><strong>{(card.printed_type_line ? card.printed_type_line : card.type_line)}</strong></p></div>
                                {/* loading the OracleText component to format all of the text (also defaulting to printed text if present) */}
                                {card.oracle_text ? 
                                    <div className={card.power || card.flavor_text || card.loyalty ? "detail-block" : ""}>
                                    <OracleText card_text={card.printed_text ? card.printed_text : card.oracle_text} />
                                </div>
                                :
                                <></>}
                                {/* changing formatting depending on language to match the card */}
                                {card.flavor_text ? <div className={card.power || card.loyalty ? "detail-block" : ""}><p>{card.lang == "ja" || card.lang == "zhs" || card.lang == "zht" ? card.flavor_text : <i>{card.flavor_text}</i>}</p></div> : <></>}
                                {card.power ? <div className='right-align'><p><strong>{card.power}/{card.toughness}</strong></p></div> : <></>}
                                {card.loyalty ? <div className='right-align'><p><strong>Loyalty: {card.loyalty}</strong></p></div> : <></>}
                            </div>
                        ))}
                    </div>
                    {/* End card text */}
                </div>
    
                {/* Legalities (checking for if it's a token because tokens don't have legalities) */}
                {(card.type_line.includes("Token") ? 
                <div className='half-size'></div>
                :
                <div className='alt-arts half-size'>
                    {
                        Object.entries(card.legalities).map((legality) => (
                            <div key={legality[0]} className={`alt-art-box ${legality[1]}`}>
                                <p>{legality[0]}: <b>{legality[1].replace("_"," ")}</b></p>
                            </div>
                        ))
                    }
                </div>
                )}
                {/* End Legalities */}
            </div>
        )
    } else {
        return(<></>)
    }
}

export default CardDetails