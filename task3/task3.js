const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const weatherUrl = document.getElementById('weatherUrl');
const jokeForm = document.getElementById('jokeForm');
const jokeResult = document.getElementById('jokeResult');
const jokeUrl = document.getElementById('jokeUrl');
const jokeCategory = document.getElementById('jokeCategory');

const weatherApi = {
  geocode: 'https://geocoding-api.open-meteo.com/v1/search',
  forecast: 'https://api.open-meteo.com/v1/forecast',
  timezone: 'auto',
};

function buildGeocodeUrl(city) {
  return `${weatherApi.geocode}?name=${encodeURIComponent(city)}&count=1`;
}

function buildWeatherUrl(lat, lon) {
  return `${weatherApi.forecast}?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=${weatherApi.timezone}`;
}

async function fetchCoordinates(city) {
  const url = buildGeocodeUrl(city);
  weatherUrl.textContent = url;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Unable to reach the geocoding API.');
  }
  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error('City not found. Try another location.');
  }
  return data.results[0];
}

async function fetchWeather(lat, lon) {
  const url = buildWeatherUrl(lat, lon);
  weatherUrl.textContent = url;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Unable to reach the weather API.');
  }
  const data = await response.json();
  return data.current_weather;
}

function renderWeather(locationName, weather) {
  weatherResult.innerHTML = `
    <div class="title">${locationName}</div>
    <p>Temperature: <strong>${weather.temperature}°C</strong></p>
    <p>Wind speed: <strong>${weather.windspeed} km/h</strong></p>
    <p>Weather code: <strong>${weather.weathercode}</strong></p>
  `;
}

function renderJoke(jokeText, category) {
  jokeResult.innerHTML = `
    <div class="title">${category} Joke</div>
    <p>${jokeText}</p>
  `;
}

function renderError(target, message) {
  target.innerHTML = `
    <div class="title">Error</div>
    <p class="error">${message}</p>
  `;
}

async function handleWeatherSubmit(event) {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    renderError(weatherResult, 'Please enter a city name first.');
    weatherUrl.textContent = 'No request made yet.';
    return;
  }

  weatherResult.innerHTML = '<p class="hint">Loading weather…</p>';
  weatherUrl.textContent = 'Requesting…';

  try {
    const location = await fetchCoordinates(city);
    const weather = await fetchWeather(location.latitude, location.longitude);
    renderWeather(location.name, weather);
  } catch (error) {
    renderError(weatherResult, error.message);
  }
}

function buildJokeUrl(category) {
  return `https://v2.jokeapi.dev/joke/${encodeURIComponent(category)}?type=single`;
}

async function handleJokeSubmit(event) {
  event.preventDefault();
  const category = jokeCategory.value || 'Programming';
  const url = buildJokeUrl(category);

  jokeUrl.textContent = url;
  jokeResult.innerHTML = '<p class="hint">Loading joke…</p>';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Unable to reach the Joke API.');
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.message || 'Joke API returned an error.');
    }
    renderJoke(data.joke, data.category);
  } catch (error) {
    renderError(jokeResult, error.message);
  }
}

weatherForm.addEventListener('submit', handleWeatherSubmit);
jokeForm.addEventListener('submit', handleJokeSubmit);
