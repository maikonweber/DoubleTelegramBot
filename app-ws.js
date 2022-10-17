const WebSocket = require('ws')

function OnError(ws, data) {
    console.log(`OnError: ${err.message}`)
}

function OnMessage(ws, data ) {
    console.log(`OnMessage : ${data}`)
}


function OnConnection(ws, req) {
    ws.on('message', data => OnMessage(ws, data));
    ws.on('error', error => OnError(ws, error))
    console.log(`OnConnection`)
}

function broadcast(jsonObject) {
    if (!this.clients) return;
    this.clients.forEach(client  => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(jsonObject))
        }
    }); 
}

// function verifyClient(info, callback) {
//     const chave = info.req
//     if(chave) {
//         return callback(true)
//     }
//         return callback(false)
// }

module.exports = (server) => {
    const wss = new WebSocket.Server({
       server     
     //  verifyClient
    })
    
    wss.on('connection', OnConnection)
    wss.broadcast = broadcast;

    console.log(`App Web Socket Server is Running`)
    return wss;
}




