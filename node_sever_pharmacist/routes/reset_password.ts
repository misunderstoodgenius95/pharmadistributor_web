

const express= require('express');
import Stytch = require('stytch');
import path=require('path');
const stytchClient=new Stytch.Client({
    project_id:'project-test-ead7077c-e25f-4fe1-ba63-3e5972ab34ec',
    secret:'secret-test-GJ9p83rxjv8pT7WNQnoqLBaPgikz4ZV1UB8=',
});

const app = express();
let url = __dirname;

const  url_splitted=url.split("route")[0];

app.use(express.static('public'));

// Serve reset-password page
app.get("/reset-password", (req, res) => {
    let  url=__dirname;
    console.log(url.split('route'));
    res.sendFile(path.join(url_splitted,'public','reset_password.html'));
});

// Handle password reset completion
app.post("/complete-reset", async (req, res) => {
    const { token, password } = req.body;
   try {
        const completeParams = {
            token: token,
            password: password,
        };
        console.log("complete param: "+JSON.stringify(completeParams));
        const completeResponse = await stytchClient.passwords.email.reset(completeParams);
        console.log("Password reset complete:", completeResponse);
        res.json({ status: "success", message: "Password updated successfully" })
    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({ error: error.error_message || "Failed to complete password reset" });

   }
});

export  default app;