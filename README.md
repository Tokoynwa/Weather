# Weather Dashboard 🌤️

A beautiful, real-time weather visualization application with daily automatic updates.

## Features

- 🌍 Real-time weather data for any city worldwide
- 📊 Beautiful visual dashboard with current conditions
- 📅 7-day weather forecast
- 🔄 Automatic daily updates at 6 AM
- 🐳 Fully containerized with Docker
- 🆓 Uses free Open-Meteo API (no API key required)

## Quick Start with Docker

### Build and run:
```bash
docker-compose up -d
```

### Or build manually:
```bash
docker build -t weather-app .
docker run -p 3000:3000 weather-app
```

### Access the app:
Open your browser and navigate to: `http://localhost:3000`

## Manual Setup (without Docker)

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open `http://localhost:3000` in your browser

## Usage

- The app shows weather for Tbilisi by default
- Use the search bar to look up weather for any city
- Data updates automatically every day at 6 AM
- The page auto-refreshes every hour

## Technology Stack

- **Backend**: Node.js + Express
- **Weather API**: Open-Meteo (free, no API key needed)
- **Scheduling**: node-cron for daily updates
- **Frontend**: Vanilla JavaScript with modern CSS
- **Container**: Docker + Docker Compose

## API Endpoints

- `GET /api/weather` - Get current weather data
- `GET /api/weather?city=CityName` - Get weather for specific city

## Configuration

You can customize the default city by modifying the `server.js` file or by setting environment variables.

## License

MIT
