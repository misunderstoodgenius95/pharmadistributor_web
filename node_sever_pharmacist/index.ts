import express from 'express';
const cors = require('cors');
import product from './routes/product';
import order from './routes/order'
const app = express();

const port = process.env.PORT || 3000;
app.use(cors({
    origin: 'http://localhost:63342', // Allow requests from this origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    // Allowed headers
 }));

app.use(express.json());
app.use('/',product);
app.use('/',order);
console.log(`Attempting to run server on port ${port}`);


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
export default  app;