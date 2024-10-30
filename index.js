const express = require('express')
const axios = require('axios')
require('dotenv').config();
//dotenv is module to load env variables from .env file into process.env 

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Weather API Wrapper Service is running');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // these `` make a difference
})