const express = require('express');
const bodyParser = require('body-parser');
require('dotenv/config');

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
   
    next();
});
const carRoutes = require('./routes/cars');

app.use('/cars', carRoutes);





app.get('/', (req, res) => {
    res.send('We are in home');
});




app.listen(3000, () => {
    console.log("server started on port 3000")
});