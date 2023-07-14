import React, { useState } from 'react'

import data from '../assets/creatures.json'
import './app.scss'

const App = () => {
    const [ player_health, set_player_health ] = useState( '2' )

    const copyToClipboard = () => {
        const text = document.getElementById( "myCode" )?.innerText.trim()
        navigator.clipboard.writeText( text! )
    }

    console.warn( data )

    return <>
        <h1> Ark Server Configuration </h1>

        <div className="grid columns-2">
            <fieldset>
                <h2> GameUserSettings.ini </h2>
                <hr />
            </fieldset>

            <fieldset>
                <h2> Game.ini </h2>
                <hr />

                <div className="padding">
                    <h3> Player Stats </h3>

                    <label htmlFor="player_health"> Health: </label>
                    <input
                        id="player_health"
                        name="player_health"
                        type="number"
                        step="0.1"
                        pattern="\d+\.[0-9]"
                        defaultValue={ player_health }
                        onChange={ e => set_player_health( e.target.value ) }
                    />
                </div>
            </fieldset>
        </div>

        <div className="grid columns-2">
            <div>

            </div>

            <div>
                <div className="code-block" id="myCode">
                    <span className="title">[/script/shootergame.shootergamemode]</span>
                    <br />
                    PerLevelStatsMultiplier_Player[0]={ player_health }
                </div>

                <button
                    className="copy-btn"
                    onClick={ copyToClipboard }
                > Copy </button>
            </div>
        </div>
    </>
}

export default App