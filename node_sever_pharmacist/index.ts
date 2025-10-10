import express from 'express';
const cors = require('cors');
import product from './routes/product';
import order from './routes/order'
import dashboard from './routes/dashboard';
import  offer from './routes/offer';
import aside from './routes/aside';
import reset from './routes/reset_password'
import  *  as wsServer from './serverchat/chatServer';
const app = express();

const port = process.env.PORT || 3000;
app.use(cors({
    origin: ['http://localhost:63343','http://localhost:3000'], // Allow requests from this origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    // Allowed headers
 }));

app.use(express.json());
app.use('/',product);
app.use('/',order);
app.use('/',dashboard);
app.use('/',offer);
app.use('/',aside);
app.use('/',reset);
console.log(`Attempting to run server on port ${port}`);


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
export default  app;