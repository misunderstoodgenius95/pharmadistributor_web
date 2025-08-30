import express from 'express';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

console.log(`Attempting to run server on port ${port}`);


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
export default  app;