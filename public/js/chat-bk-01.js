'use strict'


const socket= io()

socket.on( 'counterUpdated', ( counter ) => {
    console.log( 'counter is updated %i', counter )
})

const button= document.querySelector( '#increment')

button.addEventListener( 'click', () => {
    console.log( 'Clicked')

    socket.emit( 'increment' )
})