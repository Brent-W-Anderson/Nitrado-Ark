const axios = require( 'axios' )
const cheerio = require( 'cheerio' )
const fs = require( 'fs' )
const path = require( 'path' )

// which url location to begin web scrape
const url = 'https://www.ark-survival.net/en/2015/11/25/list-of-all-released-creatures-in-ark/'

// Create the "assets" directory if it doesn't exist
const assetsDir = path.join( __dirname, '../src/assets' )
if ( !fs.existsSync( assetsDir ) ) {
    fs.mkdirSync( assetsDir )
    console.log( 'Created "assets" directory' )
}

const imagesDir = path.join( __dirname, '../src/assets/images' )
if ( !fs.existsSync( imagesDir ) ) {
    fs.mkdirSync( imagesDir )
    console.log( 'Created "assets/images" directory' )
}

const cardsDir = path.join( __dirname, '../src/assets/images/cards' )
if ( !fs.existsSync( cardsDir ) ) {
    fs.mkdirSync( cardsDir )
    console.log( 'Created "assets/images/cards" directory' )
}

// searches through each dino link to grab the image.
const scrape_dino_links = async () => {
    try {
        const response = await axios.get( url )
        const html = response.data
        const $ = cheerio.load( html )

        // Find and download every image
        $( '.entry-content p a' ).each( async ( _, element ) => {
            const creaturePageUrl = new URL( $( element ).attr( 'href' ), url ).href
            const creatureName = $( element ).text().trim()

            try {
                const creaturePageResponse = await axios.get( creaturePageUrl )
                const creaturePageHtml = creaturePageResponse.data
                const $creature = cheerio.load( creaturePageHtml )

                const imageUrl = $creature( '.post-thumbnail' ).find( 'img' ).attr( 'src' )
                const fullImageUrl = new URL( imageUrl ).href
                const imageFilename = `${ creatureName }.png`
                const imagePath = path.join( cardsDir, imageFilename )

                const imageResponse = await axios.get( fullImageUrl, { responseType: 'arraybuffer' } )
                fs.writeFileSync( imagePath, imageResponse.data )
                console.log( 'Downloaded image:', imageFilename )
            } catch ( error ) {
                console.error( 'Failed to download creature image:', creaturePageUrl )
                console.error( 'Error:', error.message )
            }
        } )
    } catch ( error ) {
        console.error( 'An error occurred:', error.message )
    }
}

scrape_dino_links()