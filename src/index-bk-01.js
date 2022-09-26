'use strict'

const http= require( 'http')
const socketio= require( 'socket.io')


const app= require( './setup-express.js')
const server= http.createServer( app )
const io= socketio( server )

const port= process.env.PORT

let counter= 0


io.on( 'connection', ( socket ) => {
    console.log( 'New WebSocket connection')

    socket.emit( 'counterUpdated', counter )

    socket.on( 'increment', () => {
        counter++
        // socket.emit( 'counterUpdated', counter )
        io.emit( 'counterUpdated', counter )
    })
})


server.listen( port, () => {
    console.log( `Info: server starting on port ${port}` )
})
