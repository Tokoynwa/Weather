// Weather code to icon/description mapping
const weatherCodes = {
    0: { icon: '☀️', description: 'Clear sky' },
    1: { icon: '🌤️', description: 'Mainly clear' },
    2: { icon: '⛅', description: 'Partly cloudy' },
    3: { icon: '☁️', description: 'Overcast' },
    45: { icon: '🌫️', description: 'Foggy' },
    48: { icon: '🌫️', description: 'Depositing rime fog' },
    51: { icon: '🌦️', description: 'Light drizzle' },
    53: { icon: '🌦️', description: 'Moderate drizzle' },
    55: { icon: '🌦️', description: 'Dense drizzle' },
    61: { icon: '🌧️', description: 'Slight rain' },
    63: { icon: '🌧️', description: 'Moderate rain' },
    65: { icon: '🌧️', description: 'Heavy rain' },
    71: { icon: '🌨️', description: 'Slight snow' },
    73: { icon: '🌨️', description: 'Moderate snow' },
    75: { icon: '🌨️', description: 'Heavy snow' },
    77: { icon: '❄️', description: 'Snow grains' },
    80: { icon: '🌦️', description: 'Slight rain showers' },
    81: { icon: '🌦️', description: 'Moderate rain showers' },
    82: { icon: '🌦️', description: 'Violent rain showers' },
    85: { icon: '🌨️', description: 'Slight snow showers' },
    86: { icon: '🌨️', description: 'Heavy snow showers' },
    95: { icon: '⛈️', description: 'Thunderstorm' },
    96: { icon: '⛈️', description: 'Thunderstorm with hail' },
    99: { icon: '⛈️', description: 'Thunderstorm with heavy hail' }
};

function getWeatherInfo(code) {
    return weatherCodes[code] || { icon: '🌤️', description: 'Unknown' };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
}

async function loadWeather(city = null) {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const content = document.getElementById('weatherContent');

    loading.style.display = 'block';
    error.style.display = 'none';
    content.style.display = 'none';

    try {
        const url = city ? `/api/weather?city=${encodeURIComponent(city)}` : '/api/weather';
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        displayWeather(data);

        loading.style.display = 'none';
        content.style.display = 'block';
    } catch (err) {
        loading.style.display = 'none';
        error.style.display = 'block';
        error.textContent = `Error: ${err.message}`;
    }
}

function displayWeather(data) {
    // Current weather
    document.getElementById('location').textContent = data.location;
    document.getElementById('lastUpdated').textContent =
        `Last updated: ${new Date(data.lastUpdated).toLocaleString()}`;

    const weatherInfo = getWeatherInfo(data.current.weatherCode);
    document.getElementById('weatherIcon').textContent = weatherInfo.icon;
    document.getElementById('temperature').textContent = `${Math.round(data.current.temperature)}°C`;
    document.getElementById('feelsLike').textContent = `${Math.round(data.current.feelsLike)}°C`;
    document.getElementById('humidity').textContent = `${data.current.humidity}%`;
    document.getElementById('cloudCover').textContent = `${data.current.cloudCover}%`;
    document.getElementById('windSpeed').textContent = `${Math.round(data.current.windSpeed)} km/h`;
    document.getElementById('precipitation').textContent = `${data.current.precipitation} mm`;

    // Hourly forecast
    displayHourlyForecast(data.hourly);

    // Temperature chart
    drawTemperatureChart(data.daily);

    // 7-day forecast
    const forecastContainer = document.getElementById('forecastCards');
    forecastContainer.innerHTML = '';

    for (let i = 0; i < 7; i++) {
        const weatherInfo = getWeatherInfo(data.daily.weatherCodes[i]);
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="date">${formatDate(data.daily.dates[i])}</div>
            <div class="icon">${weatherInfo.icon}</div>
            <div class="temp">${Math.round(data.daily.maxTemp[i])}°C</div>
            <div class="temp-range">${Math.round(data.daily.minTemp[i])}°C</div>
        `;
        forecastContainer.appendChild(card);
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyContainer = document.getElementById('hourlyCards');
    hourlyContainer.innerHTML = '';

    // Display every 3rd hour to avoid clutter (8 cards for 24 hours)
    for (let i = 0; i < 24; i += 3) {
        const time = new Date(hourlyData.time[i]);
        const hours = time.getHours();
        const timeString = hours === 0 ? '12 AM' : hours < 12 ? `${hours} AM` : hours === 12 ? '12 PM' : `${hours - 12} PM`;

        const weatherInfo = getWeatherInfo(hourlyData.weatherCodes[i]);
        const temp = Math.round(hourlyData.temperature[i]);
        const precipitation = hourlyData.precipitationProbability[i] || 0;
        const wind = Math.round(hourlyData.windSpeed[i]);

        const card = document.createElement('div');
        card.className = 'hourly-card';
        card.innerHTML = `
            <div class="hourly-time">${timeString}</div>
            <div class="hourly-icon">${weatherInfo.icon}</div>
            <div class="hourly-temp">${temp}°C</div>
            <div class="hourly-details">
                <span title="Precipitation">💧 ${precipitation}%</span>
                <span title="Wind">💨 ${wind} km/h</span>
            </div>
        `;
        hourlyContainer.appendChild(card);
    }
}

function drawTemperatureChart(dailyData) {
    const canvas = document.getElementById('temperatureChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Wait for the canvas to have proper dimensions
    setTimeout(() => {
        // Set canvas size with proper scaling
        const rect = canvas.getBoundingClientRect();
        const width = rect.width || canvas.parentElement.offsetWidth || 800;
        const height = 300;

        canvas.width = width;
        canvas.height = height;

        const padding = 50;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

    // Prepare data
    const maxTemps = dailyData.maxTemp.slice(0, 7);
    const minTemps = dailyData.minTemp.slice(0, 7);
    const dates = dailyData.dates.slice(0, 7);

    const allTemps = [...maxTemps, ...minTemps];
    const minTemp = Math.floor(Math.min(...allTemps)) - 2;
    const maxTemp = Math.ceil(Math.max(...allTemps)) + 2;
    const tempRange = maxTemp - minTemp;

    // Helper functions
    const getX = (index) => padding + (index * (width - 2 * padding)) / 6;
    const getY = (temp) => height - padding - ((temp - minTemp) / tempRange) * (height - 2 * padding);

    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (i * (height - 2 * padding)) / 5;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();

        // Temperature labels
        const temp = maxTemp - (i * tempRange) / 5;
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.round(temp)}°C`, padding - 10, y + 4);
    }

    // Draw max temperature line
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < 7; i++) {
        const x = getX(i);
        const y = getY(maxTemps[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw min temperature line
    ctx.strokeStyle = '#4dabf7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < 7; i++) {
        const x = getX(i);
        const y = getY(minTemps[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw points and labels
    for (let i = 0; i < 7; i++) {
        const x = getX(i);

        // Max temp point
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(x, getY(maxTemps[i]), 5, 0, 2 * Math.PI);
        ctx.fill();

        // Min temp point
        ctx.fillStyle = '#4dabf7';
        ctx.beginPath();
        ctx.arc(x, getY(minTemps[i]), 5, 0, 2 * Math.PI);
        ctx.fill();

        // Date labels
        const date = new Date(dates[i]);
        const label = date.toLocaleDateString('en-US', { weekday: 'short' });
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, height - padding + 20);
    }

    // Legend
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';

    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(width - 150, 20, 20, 3);
    ctx.fillStyle = '#333';
    ctx.fillText('Max Temp', width - 125, 25);

    ctx.fillStyle = '#4dabf7';
    ctx.fillRect(width - 150, 40, 20, 3);
    ctx.fillStyle = '#333';
    ctx.fillText('Min Temp', width - 125, 45);
    }, 100); // Delay to ensure canvas has proper dimensions
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return false;
}

function searchCity() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();

    if (city) {
        loadWeather(city);
    }
}

// Allow Enter key to search
document.getElementById('cityInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCity();
    }
});

// Check for city in URL parameters
function getCityFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('city');
}

// Load weather on page load
const initialCity = getCityFromURL();
if (initialCity) {
    document.getElementById('cityInput').value = initialCity;
    loadWeather(initialCity);
} else {
    loadWeather();
}

// Auto-refresh every hour
setInterval(() => {
    const currentCity = getCityFromURL();
    loadWeather(currentCity);
}, 3600000);
