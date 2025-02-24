const delay = require("delay");

async function sendRequestFull(uri, method, body, headers, onMessage) {
    let message = body.messages[0].content.parts[0]
    let parentMessageId = body.parent_message_id
    let messageId = body.messages[0].id
    let conversationId = body.conversation_id
    let model = body.model || 'text-davinci-002-render-sha'
    let token = headers['authorization'].split(" ")[1]
    try {
        return await global.cgp.sendMessage(message, token, {
            parentMessageId, messageId, conversationId, model,
            onConversationResponse: onMessage
        })
    } catch (err) {
        console.log(err.message)
        if (err.message.indexOf('Execution context was destroyed') > -1) {
            await delay(1500)
            return await sendRequestFull(uri, method, body, headers, onMessage)
        }
    }

}

async function sendRequestNormal(uri, method, body, headers) {
    return await global.cgp.sendRequest(uri, method, body, headers)

}

module.exports = {sendRequestFull, sendRequestNormal}