const express = require('express')
const axios = require('axios')

const dotenv = require("dotenv")
dotenv.config();
//require('dotenv').config();
//dotenv is module to load env variables from .env file into process.env 

const app = express();
const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.get('/', (req, res) => {
    res.send('Weather API Wrapper Service is running');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // these `` make a difference
})

app.get('/weather/current', async(req, res) => {
    const city = req.query.city;
    if (!city) {
        return
        res.status(400).json({ error: 'City is required' });
    }

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: { q: city, appid: process.env.WEATHER_API_KEY, units: 'metric' }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
    res.send('Fetching weather data...');
});