function generateMessage( username, message ) {
    return {
        text: message
        , createdAt: new Date().getTime()
        , username: username
    }
}


module.exports= { generateMessage: generateMessage

}

