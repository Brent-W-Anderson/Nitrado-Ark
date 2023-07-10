const fs = require( 'fs' )
const path = require( 'path' )

function minifyIni ( inputPath, outputPath ) {
    const data = fs.readFileSync( inputPath, 'utf-8' ).split( '\n' )
    let condensedData = [], openParenthesesCount = 0, condensedLine = ''

    for ( let line of data ) {
        let strippedLine = line.trim()
        if (
            strippedLine === '' ||
            strippedLine.startsWith( ';' ) ||
            strippedLine.startsWith( '#' )
        ) {
            if ( strippedLine === '' ) condensedData.push( line )
            continue
        }

        strippedLine = strippedLine.replace( /\s*;.*$/, '' )
        if ( strippedLine.includes( '(' ) || strippedLine.includes( ')' ) ) {
            strippedLine = strippedLine.replace( '\n', '' )
            openParenthesesCount +=
                ( strippedLine.match( /\(/g ) || [] ).length -
                ( strippedLine.match( /\)/g ) || [] ).length
        }

        condensedLine += strippedLine
        if ( openParenthesesCount === 0 ) {
            condensedData.push( condensedLine )
            condensedLine = ''
        }
    }

    fs.mkdirSync( path.dirname( outputPath ), { recursive: true } )
    fs.writeFileSync( outputPath, condensedData.join( '\n' ) )
}

module.exports = minifyIni
