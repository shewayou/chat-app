'use strict'


const socket= io()



let dtnow= new Date()
let dtstring= dtnow.toDateString() + ' ' + dtnow.toTimeString() 
console.log( dtstring )

let message1= document.querySelector( "#message-1" )
message1.textContent= dtstring


const $msgForm= document.querySelector( '#msgForm' )
const $msgFormInput= $msgForm.querySelector( 'input' )
// const $msgFormButton= $msgForm.querySelector( 'button')
const $msgFormButton= document.querySelector( '#buttonToAllId' )

// const button2= document.querySelector( '#share-location')
const $shareLocationButton= document.querySelector( '#share-location' )

const $messages= document.querySelector( '#messages-div' )
const messageTemplate= document.querySelector( '#message-template' ).innerHTML
const hyperlinkTemplate= document.querySelector( '#hyperlink-template' ).innerHTML
const sidebarTemplate= document.querySelector( '#sidebar-template' ).innerHTML

// Options
const { username, room }= Qs.parse( location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // new message element
    const $newMessage= $messages.lastElementChild

    // height of the new message
    const newMessageStyles= getComputedStyle( $newMessage )
    const newMessageMargin= parseInt( newMessageStyles.marginBottom )
    const newMessageHeight= $newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight= $messages.offsetHeight

    // height of messages contains
    const containerHeight= $messages.scrollHeight

    // how far have I scrolled?
    const scrollOffset= $messages.scrollTop + visibleHeight

    if ( containerHeight - newMessageHeight <= scrollOffset ) {
        $messages.scrollTop= $messages.scrollHeight
    }
}




socket.emit( 'join', { username, room }, ( error ) => {
    if ( error ) {
        alert( error )
        location.href= '/'
    }
})




socket.on( 'msgFromUser_location', ( message ) => {
    console.log( "url %s", message.text )
    // url= '<a href="' + url + '" target="_blank">See location in map</a>'
    // console.log( url )

    const html= Mustache.render( hyperlinkTemplate, {
        hyperlink_template_text: message.text
        , createdAt: moment( message.createdAt ).format( 'YYYYMMDD HHmmss.SSS')
        , username: message.username
    } )
    $messages.insertAdjacentHTML( 'beforeend', html ) 

    autoscroll()
})

/* ***
socket.on( 'message', ( message ) => {
    console.log( message )
})
*** */
// socket.on( 'msgFromUser', ( message ) => {
socket.on( 'message', ( message ) => {
    console.log( message )
    const html= Mustache.render( messageTemplate, {
        message_template_text: message.text
        , username: message.username
        , createdAt: moment( message.createdAt ).format( 'YYYYMMDD HHmmss.SSS' )
    } )
    $messages.insertAdjacentHTML( 'beforeend', html )

    autoscroll()
})




$msgForm.addEventListener( 'submit', ( event ) => {
    event.preventDefault()

    $msgFormButton.setAttribute( 'disabled', 'disabled' )

    // let msg= document.querySelector( 'input' ).value   // works great! b/c only ONE input.
    // let msg= document.querySelector( '#inputId' ).value   // works great! Best to use id to distinguish
    let msg= event.target.elements.input_name_in_form.value   // works great!
    console.log( 'msg: %s', msg )
    
    socket.emit( 'msgToAll', msg, ( msg ) => {
        $msgFormButton.removeAttribute( 'disabled' )
        $msgFormInput.value= ''
        $msgFormInput.focus()

        // if ( msg.includes( " Profanity not allowed!") ) {
        if ( / Profanity not allowed!$/i.test( msg ) ) {
            return console.log( 'ERROR: server reply: %s', msg )
        }
        console.log( "Info: server reply: %s", msg )
    })
})

socket.on( 'roomData', ({ room, users }) => {
    // console.log( 'room %s', room )
    // console.log( 'users %o', users )
    const html= Mustache.render( sidebarTemplate, { room, users })
    document.querySelector( '#sidebar' ).innerHTML= html 
})


$shareLocationButton.addEventListener( 'click', ( event ) => {
    event.preventDefault()
    console.log( '$shareLocationButton.addEventListener click activated!')
    if ( ! navigator.geolocation ) {
        return alert( 'Geolocation is NOT supported in your browser!')
    }
    $shareLocationButton.setAttribute( 'disabled', 'disabled' )

    navigator.geolocation.getCurrentPosition(( position ) => {
        // console.log( position ) // show raw data
        let lat= position.coords.latitude
        let long= position.coords.longitude
        // console.log( `lat: ${lat}, long: ${long}` ) // works great!
        console.log( "lat: %o, long: %o", lat, long )
        socket.emit( 'shareLocation', { "lat": lat, "long": long }, ( reply ) => {
            $shareLocationButton.removeAttribute( 'disabled' )

            console.log( reply )
        })
    })
    
    }
)


