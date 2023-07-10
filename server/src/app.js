const express = require( 'express' )
const cors = require( 'cors' )
// const minifyIni = require( './scripts/ini_minify.js' )

const app = express()

app.use( cors() )
app.use( express.json() )

app.post( '/run_minify_script', ( req, res ) => {
    const data = req.body.data

    // minifyIni( 'src/pretty/Game.ini', 'src/minified/Game.ini' )
    // minifyIni( 'src/pretty/GameUserSettings.ini', 'src/minified/GameUserSettings.ini' )

    res.json( { message: data } )
} )

app.listen( 5000, () => console.log( 'Server running on http://localhost:5000' ) )
