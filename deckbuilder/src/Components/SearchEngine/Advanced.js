import React from 'react'
import "./Advanced.css"
import {useNavigate} from "react-router-dom"
import {useState} from "react"
import Select from 'react-select'
import Symbol from "../DetailedCard/CardDetails/DetailBlock/Symbol/Symbol"

function Advanced({updateSearchQuery}) {

    const [seachCriteria,setSearchCriteria] = useState({})

    const options = {
        color_settings: [
            {value: "<",label: "Less than these colors"},
            {value: "<=",label: "Up to and including these colors"},
            {value: ">=",label: "Including these colors"},
        ],
        number_settings: [
            {value: "=",label: "Equal to"},
            {value: "<=",label: "Less Than or Equal to"},
            {value: ">=",label: "Greater Than or Equal to"},
            {value: "<",label: "Less Than"},
            {value: ">",label: "Greater Than"},
            {value: "!=",label: "Not Equal to"}
        ],
        legal_settings: [
            {value: "legal",label: "Legal"},
            {value: "restricted",label: "Restricted"},
            {value: "banned",label: "Banned"},
        ],
        is: [
            {value: "transform",label: "Transform"}
        ],
        types: [
            {value: "creature",label: "Creature"},
            {value: "artifact",label: "Artifact"},
            {value: "instant",label: "Instant"},
            {value: "sorcery",label: "Sorcery"}
        ],
        formats: [
            {value: "commander",label: "Commander"}
        ],
        sets: [
            {value: "aer",label: "Aether Revolt (AER)"}
        ],
        blocks: [
            {value: "kld",label: "Kaladesh"}
        ]
    }

    const updateCritera = (key,value,settings) => {
        if (settings) {
            setSearchCriteria({...seachCriteria,[key]:{...seachCriteria[key],settings:value}})
        } else {
            setSearchCriteria({...seachCriteria,[key]:{...seachCriteria[key],value}})
        }
        handleSearch()
    }

    const handleSearch = () => {
        let searchTerm = ""
        for (const key in seachCriteria) {
            console.log(key,seachCriteria[key])
        }
    }

    const updateColor = (key,evt) => {
        const checked = evt.target.checked;
        const symbol = evt.target.value
        let newString = seachCriteria + ""
        if (checked) {
            newString += symbol
        } else {
            newString = newString.replace(symbol,"")
        }
        updateCritera(key,newString,false)
    }

    return (
        <div className='advanced-holder'>
            {/* Name */}
            <div className='criteria-holder'>
                <h4>Name</h4>
                <div className='input-holder'>
                    <label className='inline-block' htmlFor='name'><p>Label</p></label>
                    <input className='advanced-input' onChange={(evt) => updateCritera("name",evt.target.value)} type="text" placeholder="Name" id="name" />
                </div>
            </div>
            {/* Type */}
            <div className='criteria-holder'>
                <h4>Card Type</h4>
                <div className='input-holder'>
                    <label className='inline-block' htmlFor='type'><p>Type</p></label>
                    <Select isMulti={true} id="type" className='advanced-input' onChange={(evt) => updateCritera("type",evt)} options={options.types} />
                </div>
            </div>
            {/* Color */}
            <div className='criteria-holder'>
                <h4>Color</h4>
                <p><i>Colors within the mana cost</i></p>
                <div className='input-holder'>
                    <label className='inline-block' htmlFor='color-select'><p>Color</p></label>
                    <div className='advanced-input check-boxes-holder' id="color-select">
                        <div className='inline-block color-symbol-check'>
                            <label htmlFor='w-checkbox'>White <Symbol symbol="W" shadow={true} /></label>
                            <br />
                            <input id="w-checkbox" type="checkbox" value="W" onChange={(evt) => updateColor("color",evt)}/>
                        </div>
                        <div className='inline-block color-symbol-check'>
                            <label htmlFor='u-checkbox'>Blue <Symbol symbol="U" shadow={true} /></label>
                            <br />
                            <input id="u-checkbox" type="checkbox" value="U" onChange={(evt) => updateColor("color",evt)}/>
                        </div>
                        <div className='inline-block color-symbol-check'>
                            <label htmlFor='b-checkbox'>Black <Symbol symbol="B" shadow={true} /></label>
                            <br />
                            <input id="b-checkbox" type="checkbox" value="B" onChange={(evt) => updateColor("color",evt)}/>
                        </div>
                        <div className='inline-block color-symbol-check'>
                            <label htmlFor='r-checkbox'>Red <Symbol symbol="R" shadow={true} /></label>
                            <br />
                            <input id="r-checkbox" type="checkbox" value="R" onChange={(evt) => updateColor("color",evt)}/>
                        </div>
                        <div className='inline-block color-symbol-check'>
                            <label htmlFor='g-checkbox'>Green <Symbol symbol="G" shadow={true} /></label>
                            <br />
                            <input id="g-checkbox" type="checkbox" value="G" onChange={(evt) => updateColor("color",evt)}/>
                        </div>
                        <div className='inline-block color-symbol-check'>
                            <label htmlFor='c-checkbox'>Colorless <Symbol symbol="C" shadow={true} /></label>
                            <br />
                            <input id="c-checkbox" type="checkbox" value="C" onChange={(evt) => updateColor("color",evt)}/>
                        </div>
                    </div>
                </div>
                <div className='options-select'>
                    <Select options={options.color_settings} onChange={(evt) => updateCritera("color",evt,true)}/>
                </div>
            </div>
            {/* Commander */}
            <div className='criteria-holder'>
                <h4>Commander</h4>
                <p><i>Cards legal within your commander's color identity</i></p>
                <div className='input-holder'>
                    <label className='inline-block' htmlFor='color-select'><p>Color</p></label>
                    <div className='advanced-input check-boxes-holder' id="color-select">
                        <div className='inline-block color-symbol-check'>
                            <label htmlFor='c-w-checkbox'>White <Symbol symbol="W" shadow={true} /></label>
                            <br />
                            <input id="c-w-checkbox" type="checkbox" value="W" onChange={(evt) => updateColor("commander",evt)}/>
                        </div>
                        <div className='inline-block color-symbol-check'>
                            <label htmlFor='c-u-checkbox'>Blue <Symbol symbol="U" shadow={true} /></label>
                            <br />
                            <input id="c-u-checkbox" type="checkbox" value="U" onChange={(evt) => updateColor("commander",evt)}/>
                        </div>
                        <div className='inline-block color-symbol-check'>
                            <label htmlFor='c-b-checkbox'>Black <Symbol symbol="B" shadow={true} /></label>
                            <br />
                            <input id="c-b-checkbox" type="checkbox" value="B" onChange={(evt) => updateColor("commander",evt)}/>
                        </div>
                        <div className='inline-block color-symbol-check'>
                            <label htmlFor='c-r-checkbox'>Red <Symbol symbol="R" shadow={true} /></label>
                            <br />
                            <input id="c-r-checkbox" type="checkbox" value="R" onChange={(evt) => updateColor("commander",evt)}/>
                        </div>
                        <div className='inline-block color-symbol-check'>
                            <label htmlFor='c-g-checkbox'>Green <Symbol symbol="G" shadow={true} /></label>
                            <br />
                            <input id="c-g-checkbox" type="checkbox" value="G" onChange={(evt) => updateColor("commander",evt)}/>
                        </div>
                        <div className='inline-block color-symbol-check'>
                            <label htmlFor='c-c-checkbox'>Colorless <Symbol symbol="C" shadow={true} /></label>
                            <br />
                            <input id="c-c-checkbox" type="checkbox" value="C" onChange={(evt) => updateColor("commander",evt)}/>
                        </div>
                    </div>
                </div>
                <div className='options-select'>
                    <Select options={options.color_settings} onChange={(evt) => updateCritera("commander",evt,true)}/>
                </div>
            </div>
            {/* Mana Cost */}
            <div className='criteria-holder'>
                <h4>Mana Cost</h4>
                <p><i>Find cards with this exact mana cost</i></p>
                <div className='input-holder'>
                    <label className='inline-block' htmlFor='mana-cost'><p>Label</p></label>
                    <input className='advanced-input' onChange={(evt) => updateCritera("name",evt.target.value)} type="text" placeholder='Cost like "{1}{G}{B}"' id="mana-cost" />
                </div>
            </div>
            {/* Stats */}
            <div className='criteria-holder'>
                <h4>Stats</h4>
                <p><i>Limit cards on statistics, cards without stats will not be shown</i></p>
                <div className='input-holder'>
                    <label className='inline-block' htmlFor='power'><p>Power</p></label>
                    <Select className='advanced-input half-size' options={options.number_settings} onChange={(evt) => updateCritera("power",evt,true)}/>
                    <input className='advanced-input half-size' onChange={(evt) => updateCritera("power",evt.target.value)} type="number" placeholder='Any number' id="power" />
                </div>
                <div className='input-holder'>
                    <label className='inline-block' htmlFor='toughness'><p>Toughness</p></label>
                    <Select className='advanced-input half-size' options={options.number_settings} onChange={(evt) => updateCritera("toughness",evt,true)}/>
                    <input className='advanced-input half-size' onChange={(evt) => updateCritera("toughness",evt.target.value)} type="number" placeholder='Any number' id="toughness" />
                </div>
                <div className='input-holder'>
                    <label className='inline-block' htmlFor='mana-value'><p>CMC</p></label>
                    <Select className='advanced-input half-size' options={options.number_settings} onChange={(evt) => updateCritera("mv",evt,true)}/>
                    <input className='advanced-input half-size' onChange={(evt) => updateCritera("mv",evt.target.value)} type="number" placeholder='Any number' id="mana-value" />
                </div>
                <div className='input-holder'>
                    <label className='inline-block' htmlFor='loyalty'><p>Loyalty</p></label>
                    <Select className='advanced-input half-size' options={options.number_settings} onChange={(evt) => updateCritera("loyalty",evt,true)}/>
                    <input className='advanced-input half-size' onChange={(evt) => updateCritera("loyalty",evt.target.value)} type="number" placeholder='Any number' id="loyalty" />
                </div>
            </div>
            {/* Formats */}
            <div className='criteria-holder'>
                <h4>Format</h4>
                <div className='input-holder'>
                    <label className='inline-block' htmlFor='power'><p>Power</p></label>
                    <Select className='advanced-input half-size' options={options.legal_settings} onChange={(evt) => updateCritera("format",evt,true)}/>
                    <Select className='advanced-input half-size' options={options.formats} onChange={(evt) => updateCritera("format",evt,false)}/>
                </div>
            </div>
            {/* Set/block */}
            <div className='criteria-holder'>
                <h4>Card Type</h4>
                <div className='input-holder'>
                    <label className='inline-block' htmlFor='set'><p>Set</p></label>
                    <Select isMulti={true} id="set" className='advanced-input' onChange={(evt) => updateCritera("set",evt)} options={options.sets} />
                </div>
                <div className='input-holder'>
                    <label className='inline-block' htmlFor='block'><p>Block</p></label>
                    <Select isMulti={true} id="block" className='advanced-input' onChange={(evt) => updateCritera("block",evt)} options={options.blocks} />
                </div>
            </div>
            {/* criteria */}
            <div className='criteria-holder'>
                <h4>Criteria</h4>
                <div className='input-holder'>
                    <label className='inline-block' htmlFor='criteria'><p>Is</p></label>
                    <Select isMulti={true} id="criteria" className='advanced-input' onChange={(evt) => updateCritera("criteria",evt)} options={options.is} />
                </div>
                <div className='input-holder'>
                    <label className='inline-block' htmlFor='criteria'><p>Not</p></label>
                    <Select isMulti={true} id="criteria" className='advanced-input' onChange={(evt) => updateCritera("criteria",evt,true)} options={options.is} />
                </div>
            </div>
            <div className='criteria-holder'>
                <h4>Flavor Text</h4>
                <p><i>Quotes from the flavor text of cards</i></p>
                <div className='input-holder'>
                    <label className='inline-block' htmlFor='flavor-text'><p>Label</p></label>
                    <input className='advanced-input' onChange={(evt) => updateCritera("flavor",evt.target.value)} type="text" placeholder="Flavor text quote" id="flavor-text" />
                </div>
            </div>
            {/* Lore */}
            <div className='criteria-holder'>
                <h4>Lore</h4>
                <p><i>Finding in lore of the cards</i></p>
                <div className='input-holder'>
                    <label className='inline-block' htmlFor='lore'><p>Label</p></label>
                    <input className='advanced-input' onChange={(evt) => updateCritera("lore",evt.target.value)} type="text" placeholder="Any lore word, usually a name" id="lore" />
                </div>
            </div>
        </div>
    )
}

export default Advanced