const { WebSocketServer } = require('ws');
const crypto = require('crypto');

const port = 8081;
const clients = new Map(); // username -> {ws, userType}
const chatMap = new Map(); // seller -> [pharmacist1, pharmacist2, ...]

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

const wss = new WebSocketServer({ port });

wss.on('connection', (ws) => {
    const serverMessage = "Hello";
    const signer = crypto.createSign('SHA256');
    signer.update(serverMessage);
    const signature = signer.sign(privateKey, 'base64');

    const authMessage = {
        type: 'serverAuth',
        publicKey: publicKey,
        message: serverMessage,
        signature: signature
    };

    ws.send(JSON.stringify(authMessage));

    ws.on('message', (data) => {
        try {
            console.log("On arrive message")
            const dataParsed = JSON.parse(data.toString());
            console.log(dataParsed);

            if (dataParsed.messageType === "Starting") {
                const userType = dataParsed.userType;

                clients.set(dataParsed.userName, { ws, userType });
                console.log(dataParsed.userName+" Inserted");
                if (userType === 'pharmacist') {

                    // Find a random seller or create new mapping
                    assignPharmacistToSeller(dataParsed.userName);
                } else if (userType === 'seller') {
                    // Initialize empty pharmacist list for new seller
                    if (!chatMap.has(dataParsed.userName)) {
                        chatMap.set(dataParsed.userName, []);
                    }
                    // Optionally assign available pharmacists
                    assignAvailablePharmacists(dataParsed.userName);
                }
            }else if (dataParsed.type=="Chat"){
                const client=clients.get(dataParsed.to);
                if (client){
                    const ws=client.ws;
                    ws.send(JSON.stringify(dataParsed));
                }


            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        console.log("Disconnected");
        // Clean up: remove client from maps
        cleanupDisconnectedClient(ws);
    });
});

// Helper functions
function assignPharmacistToSeller(pharmacistUsername) {

    clients.forEach((value, key) => console.log("key"+key))

    const sellers = Array.from(clients.entries())
        .filter(([username, client]) => client.userType === 'seller')
        .map(([username, client]) => username);
    if (sellers.length === 0) {
        console.log(`No sellers available for pharmacist ${pharmacistUsername}`);
        return;
    }


    // Random seller selection
    const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];

    if (!chatMap.has(randomSeller)) {
        chatMap.set(randomSeller, []);
    }

    const pharmacistList = chatMap.get(randomSeller);
    if (!pharmacistList.includes(pharmacistUsername)) {
        pharmacistList.push(pharmacistUsername);
    }

    console.log(`Assigned pharmacist ${pharmacistUsername} to seller ${randomSeller}`);
  const pharmacist=clients.get(pharmacistUsername);
  const seller=clients.get(randomSeller);

  if(pharmacist){
      const ws_pharmacist=pharmacist.ws;
      const json_oject={
          type:'Join',
          ws_pharmacist,
          From:randomSeller,
          message:'Join Chat With '+randomSeller

      }
      ws_pharmacist.send(JSON.stringify(json_oject));
  }

  if(seller){
      const ws_seller=seller.ws;
      const json={
          type:'Join',
          ws_seller,
         from:pharmacistUsername,
          message:'Join Chat With '+pharmacistUsername
      }
      ws_seller.send(JSON.stringify(json));
      console.log("sent")

  }
}

function assignAvailablePharmacists(sellerUsername) {
    const unmappedPharmacists = findUnmappedPharmacists();

    // Optionally assign some unmapped pharmacists to this seller
    if (unmappedPharmacists.length > 0) {
        console.log("assigned")
        const pharmacistsToAssign = unmappedPharmacists.slice(0, 2); // Assign up to 2
        chatMap.set(sellerUsername, pharmacistsToAssign);
        console.log(`Assigned pharmacists ${pharmacistsToAssign.join(', ')} to seller ${sellerUsername}`);


    }
}

function findUnmappedPharmacists() {
    const allPharmacists = Array.from(clients.entries())
        .filter(([username, client]) => client.userType === 'pharmacist')
        .map(([username, client]) => username);

    const mappedPharmacists = new Set();
    for (const pharmacistList of chatMap.values()) {
        pharmacistList.forEach(pharmacist => mappedPharmacists.add(pharmacist));
    }

    return allPharmacists.filter(pharmacist => !mappedPharmacists.has(pharmacist));
}

function cleanupDisconnectedClient(disconnectedWs) {
    let disconnectedUsername;
    let disconnectedUserType;

    // Find and remove the disconnected client
    for (const [username, client] of clients.entries()) {
        if (client.ws === disconnectedWs) {
            disconnectedUsername = username;
            disconnectedUserType = client.userType;
            clients.delete(username);
            break;
        }
    }

    if (!disconnectedUsername || !disconnectedUserType) return;

    // Clean up chatMap
    if (disconnectedUserType === 'seller') {
        chatMap.delete(disconnectedUsername);
    } else {
        // Remove pharmacist from all seller lists
        for (const [seller, pharmacistList] of chatMap.entries()) {
            const index = pharmacistList.indexOf(disconnectedUsername);
            if (index > -1) {
                pharmacistList.splice(index, 1);
            }
        }
    }

    console.log(`Cleaned up data for disconnected user: ${disconnectedUsername}`);
}

// Utility function to get server status
function getServerStatus() {
    return {
        totalClients: clients.size,
        sellers: Array.from(clients.entries()).filter(([username, client]) => client.userType === 'seller').length,
        pharmacists: Array.from(clients.entries()).filter(([username, client]) => client.userType === 'pharmacist').length,
        activeChatMappings: chatMap.size,
        unmappedPharmacists: findUnmappedPharmacists().length
    };
}

// Log server status every 30 seconds
setInterval(() => {
    console.log('Server Status:', getServerStatus());
}, 30000);

console.log(`WebSocket server listening on port ${port}`);

module.exports = {
    clients,
    chatMap,
    findUnmappedPharmacists,
    getServerStatus
};
