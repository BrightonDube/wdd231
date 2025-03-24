// scripts/weather.js

const apiKey = '00de79bdcf62746e640c560c482275cb'; 
const city = 'Johannesburg';
const units = 'metric'; // Celsius units
const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;


async function fetchWeather() {
  try {
    const response = await fetch(weatherApiUrl);
    if (!response.ok) {
      throw new Error(`Weather API error! Status: ${response.status}`);
    }
    const weatherData = await response.json();
    displayCurrentWeather(weatherData);

  } catch (error) {
    console.error("Error fetching current weather data:", error);
    displayWeatherError("Failed to load current weather.");
  }
}

async function fetchForecast() {
  try {
    const response = await fetch(forecastApiUrl);
    if (!response.ok) {
      throw new Error(`Forecast API error! Status: ${response.status}`);
    }
    const forecastData = await response.json();
    displayForecast(forecastData);

  } catch (error) {
    console.error("Error fetching weather forecast data:", error);
    displayForecastError("Failed to load weather forecast.");
  }
}

function displayCurrentWeather(weather) {
  const currentWeatherElement = document.getElementById('current-weather');
  if (!currentWeatherElement) {
    console.error("Current weather section not found in HTML.");
    return;
  }

  const temperature = weather.main.temp.toFixed(0);
  const description = weather.weather[0].description;
  const iconCode = weather.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
  const highTemp = weather.main.temp_max.toFixed(0);
  const lowTemp = weather.main.temp_min.toFixed(0);
  const humidity = weather.main.humidity;
  const sunriseTime = new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunsetTime = new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


  currentWeatherElement.querySelector('.weather-icon').innerHTML = `<img src="${iconUrl}" alt="${description} icon">`;
  currentWeatherElement.querySelector('.temperature').textContent = `${temperature}°C`;
  currentWeatherElement.querySelector('.condition').textContent = description;
  currentWeatherElement.querySelector('.weather-details p:nth-child(3)').textContent = `High: ${highTemp}°C`;
  currentWeatherElement.querySelector('.weather-details p:nth-child(4)').textContent = `Low: ${lowTemp}°C`;
  currentWeatherElement.querySelector('.weather-details p:nth-child(5)').textContent = `Humidity: ${humidity}%`;
  currentWeatherElement.querySelector('.weather-details p:nth-child(6)').textContent = `Sunrise: ${sunriseTime}`;
  currentWeatherElement.querySelector('.weather-details p:nth-child(7)').textContent = `Sunset: ${sunsetTime}`;
}


function displayForecast(forecast) {
  const forecastElement = document.getElementById('weather-forecast');
  if (!forecastElement) {
    console.error("Weather forecast section not found in HTML.");
    return;
  }

  let forecastHTML = `<h2>Weather Forecast</h2>`;
  const dailyForecasts = {};

  forecast.list.forEach(item => {
    const dateTime = new Date(item.dt * 1000);
    const date = dateTime.toLocaleDateString('en-US', { weekday: 'long' });
    const temp = item.main.temp.toFixed(0);

    if (!dailyForecasts[date]) {
      dailyForecasts[date] = temp;
      forecastHTML += `
        <div class="forecast-day">
          <p>${date}:</p>
          <p>${temp}°C</p>
        </div>
      `;
    }
    if (Object.keys(dailyForecasts).length >= 3) {
      return;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}


function displayWeatherError(message) {
  const currentWeatherElement = document.getElementById('current-weather');
  if (currentWeatherElement) {
    currentWeatherElement.innerHTML = `<h2>Current Weather</h2><p class="weather-error">${message}</p>`;
  }
}

function displayForecastError(message) {
  const forecastElement = document.getElementById('weather-forecast');
  if (forecastElement) {
    forecastElement.innerHTML = `<h2>Weather Forecast</h2><p class="weather-error">${message}</p>`;
  }
}


fetchWeather();
fetchForecast();