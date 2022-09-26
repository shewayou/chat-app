'use strict'

const users= []

function addUser( { id, username, room }) {
    username= username.trim().toLowerCase()
    room= room.trim().toLowerCase()

    if ( ! username || ! room ) {
        return { error: 'Username and room are required' }
    }

    const existingUser= users.find(( user  ) => {
        return user.room === room && user.username === username
    })

    if ( existingUser ) {
        return { error: `Username ${username} is in use in ${room} room!` }
    }

    const user= { id, username, room }
    users.push( user )
    return { user }
}


function removeUser( __id ) {
    const found= users.findIndex(( user ) => {
        return __id === user.id
    })
    if ( found === -1 ) {
        // returns nothing, meaning undefined!
    } else {
        return users.splice( found, 1 )[0]  // splice to change array!   Use [0] to access the 1st element.
    }
}


function getUser( __id ) {
    const found= users.findIndex(( user ) => {
        return __id === user.id
    })
    if ( found === -1 ) {
        // returns nothing, meaning undefined!
    } else {
        return users[ found ]
    }
}


function findUsersInRoom( room ) {
    room= room.trim().toLowerCase()
    const usersInRoom= users.filter(( user ) => {
        return  user.room === room
    })
    return usersInRoom
}


module.exports= {
    findUsersInRoom
    , getUser
    , removeUser
    , addUser
}

/* ***
let result
result= addUser( { id: 21, username: '  abc1 ', room: ' room1    '} )
if ( ! result.error ) {
    console.log( result.user )
    console.log( users )
} else {
    console.log( 'ERROR: %s', result.error )
}

result= addUser( { id: 22, username: '  abc2 ', room: ' room2    '} )
console.log( users )

result= addUser( { id: 23, username: '  abc3  ', room: ' roome    '} )
if ( ! result.error ) {
    console.log( result.user )
    console.log( users )
} else {
    console.log( 'ERROR: %s', result.error )
}

addUser( { id: 24, username: '  abc4  ', room: ' ROOM1    '} )
addUser( { id: 25, username: '  abc5  ', room: ' ROOM2    '} )
addUser( { id: 26, username: '  abc6  ', room: ' ROOM3    '} )
console.log(); console.log()

console.log( getUser( 10 ))
console.log(); console.log()
console.log( getUser( 21 ))
console.log(); console.log()


let abc= removeUser( 21 ); console.log( "Info: result remove 21 %o", abc )
abc= removeUser( 23 ); console.log( "Info: result remove 23 %o", abc )
abc= removeUser( 22 ); console.log( "Info: result remove 22 %o", abc )

console.log(); console.log()
console.log( findUsersInRoom( '    ROOM2    '))
*** */

