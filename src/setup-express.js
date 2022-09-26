'use strict'


console.log( 'Info: __dirname %s', __dirname)
console.log( 'Info: __filename %s', __filename)

const path= require( 'path')
const express= require( 'express')
const app= express()




// Setup location for static contents
const publicDirectory= path.join( __dirname, '../public')
app.use( express.static( publicDirectory ))
console.log( 'Info: publicDirectory %s', publicDirectory )

// const imagesDirectory= path.join( __dirname, '../avatar')
// app.use( express.static( imagesDirectory ))
// console.log( 'Info: imagesDirectory %s', imagesDirectory )

// app.use( ( req, res, next ) => {
//     console.log( req.method, req.path )
//     res.status( 503 ).send( "Info: Service temporarily NOT available. Please visit us again soon. Thanks!")

// })



app.use( express.json())


module.exports= app



