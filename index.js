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
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
            params: { q: city, appid: process.env.WEATHER_API_KEY, units: 'metric' }
        });
        const data = response.data;
        /*const formatted_data = {
            location: `${data.name}, ${data.sys.country}`,
            temperature: { current: data.main.temp, feels_like: data.main.feels_like },
            humidity: data.main.humidity,
            weather: data.weather[0].description,
            wind_speed: data.wind.speed
        };*/
        const groupByDay = (list) => {
            return list.reduce((acc, item) => {
                const date = item.dt_txt.split(' ')[0];
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(item);
                return acc;
            }, {});
        };
        const formatDaily = (groupedData) => {
            return Object.keys(groupedData).map((date) => {
                const dayDate = groupedData[date];
                const avgTemp = dayDate.reduce((sum, item) => sum + item.main.temp, 0) / dayDate.length;
                const weatherDescp = dayDate[0].weather[0].description;
                return {
                    date,
                    temperature: avgTemp.toFixed(1),
                    weather: weatherDescp
                };
            });
        };

        const groupedData = groupByDay(response.data.list)
        const formatted_data = formatDaily(groupedData)
        return res.json(formatted_data);
        //res.json(response.data);

    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
    //res.send('Fetching weather data...');
});