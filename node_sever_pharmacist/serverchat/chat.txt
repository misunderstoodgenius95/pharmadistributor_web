import {WebSocketServer} from 'ws';
import * as crypto from 'crypto';
const port=8081;

interface clients{
    username:string;
    ws:WebSocket | string;
    type:'pharamcist' | 'seller';
}
const clients=Map<string, string[]>;
 type chatMap=Map<string,string[]>; // 1  Seller N Farmacist
const {publicKey,privateKey}=crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding:{type:'spki',format:'pem'},
    privateKeyEncoding:{type:'pkcs8',format:'pem'}

});
const wss: WebSocketServer=new WebSocketServer({port});
    wss.on('connection',(ws)=>{
    const serverMessage="Hello";
    const signer=crypto.createSign('SHA256');
    signer.update(serverMessage);
    const signature=signer.sign(privateKey,'base64');
    ws.send(JSON.stringify({
        type:'serverAuth',
        publicKey:publicKey,
        message:serverMessage,
        signature:signature

    }));


function  findUnMappedpharmacists(){
    const allPharmacists = Array.from(clients.())
        .filter(([, client]: [string, Client]) => client.userType === 'pharmacist')
        .map(([username]: [string, Client]) => username);

    const mappedPharmacists = new Set<string>();
    for (const pharmacistList of chatMap.values()) {
        pharmacistList.forEach(pharmacist => mappedPharmacists.add(pharmacist));
    }

    return allPharmacists.filter(pharmacist => !mappedPharmacists.has(pharmacist));

}
    ws.on('message',(data)=>{
        const data_parsed=JSON.parse(data.toString());
        console.log(data_parsed);
        if (data_parsed.messageType="Starting"){
            const userType=data_parsed.UserType;
            clients.set(data_parsed.username,{ws,userType});

            // if it is a phramcist
            //random seller
            //else //
            // if it is a seller
            //random phramacist



        }
    });

    ws.on('close',()=>{
        console.log("Disconnected");



    });


});



console.log("Listening at port 8081")

