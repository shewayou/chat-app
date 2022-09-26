'use strict'

const http= require( 'http' ) 
const socketio= require( 'socket.io' )

const app= require( './setup-express.js' )
const server= http.createServer( app )
const io= socketio( server )

const port= process.env.PORT

const Filter= require( 'bad-words' )
const { generateMessage }= require( './utils/messages.js' )
const { findUsersInRoom
    , getUser
    , removeUser
    , addUser }= require( './utils/users.js')



let userCount= {}
let userTotal= 0
let allClients= []
let allusernameroom=[]


io.on( 'connection', ( socket ) => {
    console.log( 'New WebSocket connection, socket.id %s', socket.id )

    // socket.on( 'join', ({ username, room }) => {
    socket.on( 'join', (  options, callback ) => {
        // const { error, user }= addUser( { id: socket.id, username: username, room: room })
        const { error, user: cleanUser }= addUser( { id: socket.id, ...options })
        if ( error ) {
            console.log( '%s\n', error )
            return callback( error )
        }

        socket.join( cleanUser.room ) // Key!
        console.log( "id %s user %s room %s\n", cleanUser.id, cleanUser.username, cleanUser.room )
        socket.emit( 'message', generateMessage( 'Admin', 'Welcome!' )) // A-1
        socket.broadcast.to(cleanUser.room).emit( 'message', generateMessage( 'Admin'
            , `A new user, ${cleanUser.username}, has joined!\n` )) // A-2
        io.to( cleanUser.room ).emit( 'roomData', { room: cleanUser.room, users: findUsersInRoom( cleanUser.room )})




        userTotal++
        allClients.push( socket.id )
        allusernameroom.push( { username: cleanUser.username, room: cleanUser.room })
        if ( userCount.hasOwnProperty( cleanUser.room )) {
            userCount[ cleanUser.room ]++
        } else {
            userCount[ cleanUser.room ]= 1
        }

        callback()  // successfully joined!
    })

    socket.on( 'msgToAll', ( message, callback_2_that_client ) => {
        // console.log( 'msgToAll: %s', socket.id )
        const user= getUser( socket.id )
        // console.log( 'msgToAll: %o', user )
        // console.log( 'msgToAll: room=%s', user.room )
        if ( user ) {
            const dtnow= new Date()
            const dtstring= dtnow.toDateString() + ' ' + dtnow.toTimeString()
    
            if ( message === undefined || /^[\s]*$/.test( message )) {
                callback_2_that_client( dtstring + ' NULL msg ignored' )    
            } else {
                const filter= new Filter()
                if ( filter.isProfane( message )) {
                    return callback_2_that_client( dtstring + ' Profanity not allowed!')
                }
                console.log( 'msgToAll: %s', message )
                // socket.emit( 'counterUpdated', counter )
                // io.emit( 'msgFromUser', message )
                io.to(user.room).emit( 'message', generateMessage( user.username, message )) // A-3
                callback_2_that_client( dtstring + ' delivered' )    
            }

        }
    })


    socket.on( 'shareLocation', ( position, callback_2_that_client ) => {
        // console.log( 'shareLocation: %s', socket.id )
        const user= getUser( socket.id )
        // console.log( 'shareLocation: %o', user )
        if ( user ) {
            console.log( "shareLocation: id %s user %s room %s lat: %o, long: %o", user.id, user.username, user.room
                , position.lat, position.long )
            // socket.emit( 'counterUpdated', counter )
            // io.emit( 'msgFromUser', `Location: ${position.lat}, ${position.long}` )
            io.to(user.room).emit( 'msgFromUser_location'
                , generateMessage( user.username
                    , `https://google.com/maps?q=${position.lat},${position.long}` ))
    
            const dtnow= new Date()
            const dtstring= dtnow.toDateString() + ' ' + dtnow.toTimeString()
            callback_2_that_client( dtstring + ' Location shared' )
        }    
    })

    /* ***
    socket.on( 'xxx', ({ username, room }) => {
        console.log( 'username=%s exited room=%s', username, room )
    })
    *** */

    socket.on( 'disconnect', ( ) => {
        var i = allClients.indexOf( socket.id );
        // console.log( "disconnect: socket %i disconnect", i )
        // if ( i === -1 ) {}
        const user= removeUser( socket.id )
        if ( user ) {
            console.log( "disconnect: username=%s, room=%s", allusernameroom[i].username, allusernameroom[i].room )
            userCount[ allusernameroom[i].room ]--
            userTotal--
    
            if ( userCount[ allusernameroom[i].room ] === 0 ) {
                console.log( `disconnect: User ${allusernameroom[i].username} left ${allusernameroom[i].room} room empty now!\n` )
            } else {
                io.to( allusernameroom[i].room ).emit( 'message', generateMessage( 
                    'Admin'
                    , `User ${allusernameroom[i].username} left ` +
                    `remaining ${userCount[ allusernameroom[i].room ]} users` )) // A-4    
                console.log( `disconnect: User ${allusernameroom[i].username} left ` +
                `${allusernameroom[i].room} room remaining ${userCount[ allusernameroom[i].room ]} users.\n` )
                io.to( user.room ).emit( 'roomData', { room: user.room, users: findUsersInRoom( user.room )})
            }
    
            allClients.splice( i, 1 );
            allusernameroom.splice( i, 1 )
            if ( userTotal === 0 ) {
                console.log( 'disconnect: all rooms empty!\n' )
            }    
        }

    })

})


server.listen( port, () => {
    console.log( `Info: server starting on port ${port}` )

    const current= new Date()
    console.log( "Info: %s %s\n", current.toDateString(), current.toTimeString())
    
})
