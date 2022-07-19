import React from 'react'
import OracleText from './DetailBlock/OracleText/OracleText'
import {useState} from 'react'
import Symbol from "./DetailBlock/Symbol/Symbol"
import "./CardDetails.css"

function CardDetails({card, addToDeck, alternateArts,getDetailedCard}) {
    
    const card_faces = (card.card_faces ? card.card_faces : [card])

    const [transformIndex, setTransformIndex] = useState(0)

    const loadNewArt = (card) => {
        getDetailedCard(card.id)
        window.scrollTo({
            top: 0
        });
    }

    return (
        <div className='details-container'>
            {/* List of all the printings of the card and their respective usd prices */}
            <div className='alt-arts half-size'>
                { alternateArts.map((printing) => (
                    <div onClick={() => loadNewArt(printing)} key={printing.id} className={`alt-art-box selectable${card.id == printing.id ? " current-selected" : ""}`}>
                        <p className='inline'><b>{printing.set}</b> ({printing.collector_number})</p>
                        <p className='right-align inline-text-right'>{printing.prices.usd ? <b><a href={printing.purchase_uris.tcgplayer} target="_blank">{` $${printing.prices.usd}`}</a></b> : ""}</p>
                    </div>
                ))}
            </div>
            {/* end printing list */}

            {/* Main card holder with image and card text */}
            <div id='detailed-card-holder'>
                {/* Holding the image itself */}
                <div id='detailed-card-img-holder'>
                    {!card.image_uris ? 
                    <>
                        <img id='detailed-card-img' className='card-style' src={card_faces[transformIndex].image_uris.png} />
                        <div>
                            <button className="transform-button" onClick={() => {setTransformIndex((transformIndex+1)%2)}}>Flip</button>
                            <button className='transform-button' onClick={() => addToDeck(card.set,card.collector_number)}>Add to deck</button>
                        </div>
                    </>
                    :
                    <>
                        <img id='detailed-card-img' className='card-style' src={card.image_uris.png} />
                        <div>
                            <button className='transform-button' onClick={() => addToDeck(card.set,card.collector_number)}>Add to deck</button>
                        </div>
                    </>}
                </div>
                {/* End image box */}

                {/* Holding all of the card text */}
                <div id='card-details'>
                    {card_faces.map((card,index) => (
                        <div key={index}>
                            <div className={`detail-block${(index > 0 ? " top-border" : "")}`}><h5 className={`${card.name.length > 15 ? `${card.name.length > 27 ? "really-" : ""}long-name` : ""}`}>{(card.printed_name ? card.printed_name : card.name)}</h5></div>
                            {card.mana_cost ? <div className='detail-block'>
                                <p>{
                                    card.mana_cost.match(/[A-Z/0-9∞½]+(?=})/g).map((symbol,index) => (
                                        <Symbol shadow={true} key={index} symbol={symbol} />
                                    ))
                                }</p>
                            </div> : <></>}
                            <div className='detail-block'><p><strong>{(card.printed_type_line ? card.printed_type_line : card.type_line)}</strong></p></div>
                            {card.oracle_text ? 
                                <div className={card.power || card.flavor_text || card.loyalty ? "detail-block" : ""}>
                                <OracleText card_text={card.printed_text ? card.printed_text : card.oracle_text} />
                            </div>
                            :
                            <></>}
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
}

export default CardDetails