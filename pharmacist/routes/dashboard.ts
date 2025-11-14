const express= require('express');
import Stytch = require('stytch');
const app=express();
const stytchClient=new Stytch.Client({
    project_id:'project-test-ead7077c-e25f-4fe1-ba63-3e5972ab34ec',
    secret:'secret-test-GJ9p83rxjv8pT7WNQnoqLBaPgikz4ZV1UB8=',
});
app.use(express.json());
app.get('/dashboard',(req,res)=> {
    console.log(req)
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(400).json({'error': "Bad Request!"});
    }

    if (!authHeader.startsWith('Bearer')) {
        return res.status(401).json({'error': 'No jwt'});
    }
    const jwt = authHeader.split('')[1];
    stytchClient.sessions.authenticateJwt(jwt).then(resp => {
        return res.status(200).json({"Success": 201})
    }).catch(err => {
        return res.status(401).json({"error": "Unauthorized!"})
    });

});
export default app;