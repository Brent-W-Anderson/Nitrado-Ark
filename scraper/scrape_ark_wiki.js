const axios = require( 'axios' )
const cheerio = require( 'cheerio' )
const fs = require( 'fs' )
const path = require( 'path' )

// which url location to begin web scrape
const url = 'https://ark.wiki.gg/wiki/Creatures'

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

const iconsDir = path.join( __dirname, '../src/assets/images/icons' )
if ( !fs.existsSync( iconsDir ) ) {
    fs.mkdirSync( iconsDir )
    console.log( 'Created "assets/images/icons" directory' )
}

const altDir = path.join( __dirname, '../src/assets/images/alts' )
if ( !fs.existsSync( altDir ) ) {
    fs.mkdirSync( altDir )
    console.log( 'Created "assets/images/alts" directory' )
}

// build creatures.json here..
const build_creature_json = async $ => {
    const creatures = []

    $( 'table.wikitable tr' ).each( async ( _, row ) => {
        const creatureName = $( row ).find( 'td:nth-child(1) a' ).attr( 'title' )
        const creatureUrl = $( row ).find( 'td:nth-child(1) a' ).attr( 'href' )
        const releasedValues = {
            'steam': '-Steam',
            'xbox': '-Xbox',
            'playstation': '-PS',
            'mobile': 'Mobile',
            'nintendo-switch': '-Nintendo',
            'epic-games': '-Epic'
        }

        const platforms = $( row ).find( 'td:nth-child(2) img' ).map( ( _, img ) => $( img ).attr( 'src' ) ).get()
        const creatureReleased = {}

        for ( let key in releasedValues ) {
            creatureReleased[ key ] = platforms.some( src => src.includes( releasedValues[ key ] ) )
        }

        const creatureDiet = $( row ).find( 'td:nth-child(3)' ).text().trim()
        const creatureTemperment = $( row ).find( 'td:nth-child(4)' ).text().trim()
        const creatureTameable = $( row ).find( 'td:nth-child(5)' ).text().trim().includes( 'Yes' )
        const creatureRideable = $( row ).find( 'td:nth-child(6)' ).text().trim().includes( 'Yes' )
        const creatureBreedable = $( row ).find( 'td:nth-child(7)' ).text().trim().includes( 'Yes' )
        const creatureSaddleLevel = $( row ).find( 'td:nth-child(8)' ).text().trim()
        const creatureClassString = $( row ).find( 'td:nth-child(9)' ).text().trim()

        if ( creatureName && creatureName.trim() !== '' ) {
            creatures.push( {
                name: creatureName,
                class_string: creatureClassString,
                wiki_url: url + creatureUrl,
                diet: creatureDiet,
                temperment: creatureTemperment,
                tameable: creatureTameable,
                rideable: creatureRideable,
                breedable: creatureBreedable,
                saddle_level: creatureSaddleLevel,
                icon_img: `./images/icons/${ creatureName }.png`,
                card_img: `./images/cards/${ creatureName }.png`,
                alt_img: `./images/alts/${ creatureName }.png`,
                released: creatureReleased
            } )
        }
    } )

    fs.writeFileSync( '../src/assets/creatures.json', JSON.stringify( creatures, null, 2 ) )
}

// searches through the table and grabs the small icon image with each dino name.
const scrape_dino_icons = async $ => {
    $( 'ul.creature-roster li' ).each( async ( _, element ) => {
        const imageUrl = $( element ).find( 'a img' ).attr( 'src' )
        const fullImageUrl = new URL( imageUrl, url ).href

        const creatureName = $( element ).find( 'a img' ).attr( 'alt' )
        const imageFilename = `${ creatureName }.png`
        const imagePath = path.join( iconsDir, imageFilename )

        try {
            const imageResponse = await axios.get( fullImageUrl, { responseType: 'arraybuffer' } )
            fs.writeFileSync( imagePath, imageResponse.data )
            console.log( 'Downloaded image:', imageFilename )
        } catch ( error ) {
            console.error( 'Failed to download image:', imageUrl )
            console.error( 'Error:', error.message )
        }
    } )
}

// searches through each dino link to grab the image from the corresponding page.
const scrape_dino_links = async $ => {
    $( 'table.wikitable tr' ).each( async ( index, element ) => {
        const firstColumnLink = $( element ).find( 'td:first-child a' )
        const creaturePageUrl = new URL( firstColumnLink.attr( 'href' ), url ).href
        const creatureName = firstColumnLink.text().trim()

        // Find and download every image at each link
        try {
            const creaturePageResponse = await axios.get( creaturePageUrl )
            const creaturePageHtml = creaturePageResponse.data
            const $creature = cheerio.load( creaturePageHtml )

            const imageUrl = $creature( '.info-X1-100' ).find( 'a' ).find( 'img' ).attr( 'src' )
            const fullImageUrl = new URL( imageUrl, creaturePageUrl ).href
            const imageFilename = `${ creatureName }.png`
            const imagePath = path.join( altDir, imageFilename )

            const imageResponse = await axios.get( fullImageUrl, { responseType: 'arraybuffer' } )
            fs.writeFileSync( imagePath, imageResponse.data )
            console.log( 'Downloaded image:', imageFilename )
        } catch ( error ) {
            console.error( 'Failed to download creature image:', creaturePageUrl )
            console.error( 'Error:', error.message )
        }
    } )
}

const scrape = async () => {
    try {
        const response = await axios.get( url )
        const html = response.data
        const $ = cheerio.load( html )

        scrape_dino_icons( $ )
        scrape_dino_links( $ )
        build_creature_json( $ )
    } catch ( error ) {
        console.error( 'An error occurred:', error.message )
    }
}

scrape()