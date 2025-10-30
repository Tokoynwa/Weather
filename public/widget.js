/**
 * CloudVibes Weather Widget
 * Embeddable weather widget for any website
 *
 * Usage:
 * <div id="cloudvibes-widget" data-city="Paris" data-theme="light"></div>
 * <script src="https://cloudvibes.org/widget.js"></script>
 */

(function() {
  'use strict';

  const WIDGET_VERSION = '1.0.0';
  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://cloudvibes.org';

  // Weather code to icon mapping
  const weatherIcons = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️',
    51: '🌦️', 53: '🌦️', 55: '🌦️',
    61: '🌧️', 63: '🌧️', 65: '🌧️',
    71: '🌨️', 73: '🌨️', 75: '🌨️', 77: '❄️',
    80: '🌦️', 81: '🌦️', 82: '🌦️',
    85: '🌨️', 86: '🌨️',
    95: '⛈️', 96: '⛈️', 99: '⛈️'
  };

  const weatherDescriptions = {
    0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Cloudy',
    45: 'Foggy', 48: 'Foggy',
    51: 'Light Rain', 53: 'Rain', 55: 'Heavy Rain',
    61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
    71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 77: 'Snow',
    80: 'Rain Showers', 81: 'Rain Showers', 82: 'Heavy Showers',
    85: 'Snow Showers', 86: 'Heavy Snow',
    95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Severe Storm'
  };

  // Widget themes
  const themes = {
    light: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#ffffff',
      secondaryText: 'rgba(255, 255, 255, 0.9)',
      cardBg: 'rgba(255, 255, 255, 0.15)',
      border: 'rgba(255, 255, 255, 0.3)'
    },
    dark: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      text: '#ffffff',
      secondaryText: 'rgba(255, 255, 255, 0.8)',
      cardBg: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.2)'
    },
    minimal: {
      background: '#ffffff',
      text: '#333333',
      secondaryText: '#666666',
      cardBg: '#f5f5f5',
      border: '#e0e0e0'
    }
  };

  function getWeatherIcon(code) {
    return weatherIcons[code] || '🌤️';
  }

  function getWeatherDescription(code) {
    return weatherDescriptions[code] || 'Unknown';
  }

  async function fetchWeather(city) {
    try {
      const response = await fetch(`${API_BASE}/api/weather?city=${encodeURIComponent(city)}`);
      if (!response.ok) throw new Error('Weather data not available');
      return await response.json();
    } catch (error) {
      console.error('CloudVibes Widget Error:', error);
      throw error;
    }
  }

  function createWidgetHTML(data, theme, size, showForecast) {
    const themeColors = themes[theme] || themes.light;
    const icon = getWeatherIcon(data.current.weatherCode);
    const description = getWeatherDescription(data.current.weatherCode);

    const sizeClass = size === 'small' ? 'cv-widget-small' : size === 'large' ? 'cv-widget-large' : 'cv-widget-medium';

    let forecastHTML = '';
    if (showForecast && data.daily) {
      forecastHTML = `
        <div class="cv-forecast">
          ${data.daily.dates.slice(1, 4).map((date, i) => `
            <div class="cv-forecast-day">
              <div class="cv-forecast-date">${new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div class="cv-forecast-icon">${getWeatherIcon(data.daily.weatherCodes[i + 1])}</div>
              <div class="cv-forecast-temp">${Math.round(data.daily.maxTemp[i + 1])}°</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    return `
      <style>
        .cloudvibes-widget {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: ${themeColors.background};
          color: ${themeColors.text};
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          max-width: 100%;
          box-sizing: border-box;
        }
        .cv-widget-small { max-width: 250px; }
        .cv-widget-medium { max-width: 350px; }
        .cv-widget-large { max-width: 500px; }

        .cv-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }
        .cv-location {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }
        .cv-widget-small .cv-location { font-size: 16px; }
        .cv-updated {
          font-size: 11px;
          color: ${themeColors.secondaryText};
          margin-top: 3px;
        }
        .cv-current {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid ${themeColors.border};
        }
        .cv-icon {
          font-size: 48px;
          line-height: 1;
        }
        .cv-widget-small .cv-icon { font-size: 36px; }
        .cv-widget-large .cv-icon { font-size: 64px; }

        .cv-temp-info {
          flex: 1;
        }
        .cv-temp {
          font-size: 36px;
          font-weight: 700;
          line-height: 1;
          margin: 0 0 5px 0;
        }
        .cv-widget-small .cv-temp { font-size: 28px; }
        .cv-widget-large .cv-temp { font-size: 48px; }

        .cv-description {
          font-size: 14px;
          color: ${themeColors.secondaryText};
          margin: 0;
        }
        .cv-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 15px;
        }
        .cv-widget-small .cv-details {
          grid-template-columns: 1fr;
          gap: 8px;
        }
        .cv-detail-item {
          background: ${themeColors.cardBg};
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 13px;
        }
        .cv-detail-label {
          color: ${themeColors.secondaryText};
          font-size: 11px;
          margin-bottom: 2px;
        }
        .cv-detail-value {
          font-weight: 600;
          font-size: 15px;
        }
        .cv-forecast {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid ${themeColors.border};
        }
        .cv-forecast-day {
          flex: 1;
          text-align: center;
          background: ${themeColors.cardBg};
          padding: 10px 5px;
          border-radius: 8px;
        }
        .cv-forecast-date {
          font-size: 11px;
          color: ${themeColors.secondaryText};
          margin-bottom: 5px;
        }
        .cv-forecast-icon {
          font-size: 24px;
          margin: 5px 0;
        }
        .cv-forecast-temp {
          font-weight: 600;
          font-size: 14px;
        }
        .cv-footer {
          margin-top: 15px;
          padding-top: 12px;
          border-top: 1px solid ${themeColors.border};
          text-align: center;
        }
        .cv-powered {
          font-size: 11px;
          color: ${themeColors.secondaryText};
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .cv-powered:hover {
          opacity: 0.8;
        }
        .cv-error {
          text-align: center;
          padding: 20px;
          color: ${themeColors.text};
        }
      </style>
      <div class="cloudvibes-widget ${sizeClass}">
        <div class="cv-header">
          <div>
            <div class="cv-location">${data.location}</div>
            <div class="cv-updated">Updated ${new Date(data.lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
        <div class="cv-current">
          <div class="cv-icon">${icon}</div>
          <div class="cv-temp-info">
            <div class="cv-temp">${Math.round(data.current.temperature)}°C</div>
            <div class="cv-description">${description}</div>
          </div>
        </div>
        <div class="cv-details">
          <div class="cv-detail-item">
            <div class="cv-detail-label">Feels Like</div>
            <div class="cv-detail-value">${Math.round(data.current.feelsLike)}°C</div>
          </div>
          <div class="cv-detail-item">
            <div class="cv-detail-label">Humidity</div>
            <div class="cv-detail-value">${data.current.humidity}%</div>
          </div>
          <div class="cv-detail-item">
            <div class="cv-detail-label">Wind</div>
            <div class="cv-detail-value">${Math.round(data.current.windSpeed)} km/h</div>
          </div>
          <div class="cv-detail-item">
            <div class="cv-detail-label">Precipitation</div>
            <div class="cv-detail-value">${data.current.precipitation} mm</div>
          </div>
        </div>
        ${forecastHTML}
        <div class="cv-footer">
          <a href="https://cloudvibes.org/weather/${data.location.toLowerCase().replace(/[, ]/g, '-')}" target="_blank" class="cv-powered">
            ⚡ Powered by CloudVibes
          </a>
        </div>
      </div>
    `;
  }

  function createErrorHTML(message, theme) {
    const themeColors = themes[theme] || themes.light;
    return `
      <div class="cloudvibes-widget" style="background: ${themeColors.background}; color: ${themeColors.text}; padding: 20px; border-radius: 12px; text-align: center;">
        <div class="cv-error">
          <div style="font-size: 32px; margin-bottom: 10px;">⚠️</div>
          <div style="font-size: 14px;">${message}</div>
        </div>
      </div>
    `;
  }

  async function initWidget(element) {
    const city = element.getAttribute('data-city') || 'Tbilisi';
    const theme = element.getAttribute('data-theme') || 'light';
    const size = element.getAttribute('data-size') || 'medium';
    const showForecast = element.getAttribute('data-forecast') !== 'false';

    // Show loading
    element.innerHTML = `
      <div class="cloudvibes-widget" style="padding: 20px; text-align: center; background: ${themes[theme].background}; border-radius: 12px; color: ${themes[theme].text};">
        <div style="font-size: 32px; margin-bottom: 10px;">🌤️</div>
        <div style="font-size: 14px;">Loading weather...</div>
      </div>
    `;

    try {
      const weatherData = await fetchWeather(city);
      element.innerHTML = createWidgetHTML(weatherData, theme, size, showForecast);
    } catch (error) {
      element.innerHTML = createErrorHTML(`Unable to load weather for ${city}`, theme);
    }
  }

  // Auto-initialize all widgets on page load
  function initAllWidgets() {
    const widgets = document.querySelectorAll('[id^="cloudvibes-widget"]');
    widgets.forEach(widget => {
      if (!widget.hasAttribute('data-initialized')) {
        widget.setAttribute('data-initialized', 'true');
        initWidget(widget);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllWidgets);
  } else {
    initAllWidgets();
  }

  // Expose global API
  window.CloudVibesWidget = {
    version: WIDGET_VERSION,
    init: initWidget,
    refresh: initAllWidgets
  };

  console.log(`CloudVibes Weather Widget v${WIDGET_VERSION} loaded`);
})();
