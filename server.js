const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory cache for weather data
let weatherCache = {};

// Serve static files
app.use(express.static('public'));

// Health check endpoints for Kubernetes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/ready', (req, res) => {
  // Check if weather cache is populated
  if (Object.keys(weatherCache).length > 0) {
    res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
  } else {
    res.status(503).json({ status: 'not ready', message: 'Weather data not yet loaded' });
  }
});

// Explicitly serve ads.txt for AdSense
app.get('/ads.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(__dirname, 'public', 'ads.txt'));
});

// Weather API configuration - using Open-Meteo (free, no API key needed)
async function fetchWeatherData(city = 'Tbilisi') {
  try {
    // Geocoding to get coordinates
    const geoResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      throw new Error('City not found');
    }

    const { latitude, longitude, name, country } = geoResponse.data.results[0];

    // Fetch weather data with hourly forecast
    const weatherResponse = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=3`
    );

    const data = weatherResponse.data;

    weatherCache = {
      location: `${name}, ${country}`,
      coordinates: { latitude, longitude },
      current: {
        temperature: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        cloudCover: data.current.cloud_cover,
        windSpeed: data.current.wind_speed_10m,
        precipitation: data.current.precipitation,
        weatherCode: data.current.weather_code
      },
      hourly: {
        time: data.hourly.time.slice(0, 24), // Next 24 hours
        temperature: data.hourly.temperature_2m.slice(0, 24),
        precipitationProbability: data.hourly.precipitation_probability.slice(0, 24),
        weatherCodes: data.hourly.weather_code.slice(0, 24),
        windSpeed: data.hourly.wind_speed_10m.slice(0, 24)
      },
      daily: {
        dates: data.daily.time,
        maxTemp: data.daily.temperature_2m_max,
        minTemp: data.daily.temperature_2m_min,
        precipitation: data.daily.precipitation_sum,
        windSpeed: data.daily.wind_speed_10m_max,
        weatherCodes: data.daily.weather_code
      },
      lastUpdated: new Date().toISOString()
    };

    console.log(`Weather data updated at ${weatherCache.lastUpdated}`);
    return weatherCache;
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    throw error;
  }
}

// API endpoint to get weather data
app.get('/api/weather', async (req, res) => {
  try {
    const city = req.query.city || 'Tbilisi';

    // If cache is empty or city is different, fetch new data
    if (Object.keys(weatherCache).length === 0 || req.query.city) {
      await fetchWeatherData(city);
    }

    res.json(weatherCache);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule weather data update every day at 6 AM
cron.schedule('0 6 * * *', () => {
  console.log('Running scheduled weather update...');
  fetchWeatherData();
});

// Initial fetch on startup
fetchWeatherData().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Weather app running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to fetch initial weather data:', err);
  // Start server anyway
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Weather app running on port ${PORT} (without initial data)`);
  });
});
