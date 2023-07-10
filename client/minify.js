
const minify = () => {
    const player_health = document.getElementById( 'player_health' ).value

    const data = {
        player_stats: [
            `PerLevelStatsMultiplier_Player[0]=${ player_health }`
        ]
    }

    fetch( 'http://localhost:5000/run_minify_script', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( { data } )
    } )
        .then( response => response.json() )
        .then( data => console.warn( data.message ) )
        .catch( ( error ) => {
            console.error( 'Error:', error )
        } )
}

const copyToClipboard = () => {
    const text = document.getElementById("myCode").innerText.trim();
    navigator.clipboard.writeText( text );
}
