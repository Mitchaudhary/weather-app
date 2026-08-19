/**
 * SkyPulse Weather App
 * Handles OpenWeatherMap API integration, DOM updates, unit switching, and UI states.
 */

// =========================================================
// Configuration & Constants
// =========================================================
const API_KEY = APIKEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// =========================================================
// DOM Elements
// =========================================================
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const quickCities = document.getElementById("quickCities");

// Unit Toggle Elements
const celsiusBtn = document.getElementById("celsiusBtn");
const fahrenheitBtn = document.getElementById("fahrenheitBtn");

// UI State Containers
const loadingContainer = document.getElementById("loadingContainer");
const errorContainer = document.getElementById("errorContainer");
const errorTitle = document.getElementById("errorTitle");
const errorMessage = document.getElementById("errorMessage");
const welcomeContainer = document.getElementById("welcomeContainer");
const weatherCard = document.getElementById("weatherCard");

// Weather Display Elements
const cityNameEl = document.getElementById("cityName");
const countryCodeEl = document.getElementById("countryCode");
const dateTimeEl = document.getElementById("dateTime");
const conditionBadge = document.getElementById("conditionBadge");
const conditionCategoryEl = document.getElementById("conditionCategory");
const currentTempEl = document.getElementById("currentTemp");
const displayUnitEl = document.getElementById("displayUnit");
const weatherDescEl = document.getElementById("weatherDesc");
const weatherIconEl = document.getElementById("weatherIcon");
const feelsLikeEl = document.getElementById("feelsLike");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("windSpeed");
const pressureEl = document.getElementById("pressure");

// =========================================================
// App State
// =========================================================
let currentUnit = "C"; // "C" for Celsius, "F" for Fahrenheit
let weatherData = null; // Stores raw fetched data (Celsius base)

// =========================================================
// Core Weather Fetch Function (Async / Await & Fetch API)
// =========================================================
/**
 * Fetches current weather data for a given city
 * @param {string} city - Name of the city to search
 */
async function fetchWeather(city) {
  const trimmedCity = city.trim();
  if (!trimmedCity) return;

  // Show Loading State
  showLoading();

  // Check if user still has the default API key placeholder
  if (API_KEY === "YOUR_API_KEY" || !API_KEY) {
    showError(
      "API Key Required",
      "Please insert your OpenWeatherMap API key in <code>script.js</code> (line 8) to fetch live data."
    );
    return;
  }

  try {
    const url = `${BASE_URL}?q=${encodeURIComponent(trimmedCity)}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`We couldn't find "${trimmedCity}". Please verify the city name and try again.`);
      } else if (response.status === 401) {
        throw new Error("Invalid API key provided. Please verify your OpenWeatherMap API key.");
      } else {
        throw new Error(`Server returned error code ${response.status}. Please try again later.`);
      }
    }

    const data = await response.json();
    weatherData = data;
    renderWeather(data);
    showWeatherCard();
  } catch (err) {
    console.error("Weather fetch error:", err);
    showError("Oops! Something went wrong", err.message || "Unable to fetch weather data. Please try again.");
  }
}

// =========================================================
// UI Render Functions
// =========================================================
/**
 * Renders the fetched weather data onto the DOM
 * @param {Object} data - OpenWeatherMap API response
 */
function renderWeather(data) {
  if (!data) return;

  // Location
  cityNameEl.textContent = data.name;
  countryCodeEl.textContent = data.sys?.country || "";

  // Date & Local Time Calculation
  dateTimeEl.textContent = formatLocalTime(data.timezone);

  // Weather Condition & Description
  const weather = data.weather && data.weather[0];
  if (weather) {
    conditionCategoryEl.textContent = weather.main;
    weatherDescEl.textContent = weather.description;
    // Set 2x/4x high resolution weather icon
    weatherIconEl.src = `https://openweathermap.org/img/wn/${weather.icon}@4x.png`;
    weatherIconEl.alt = weather.description;
  }

  // Temperatures
  updateTemperatures();

  // Atmospheric details
  humidityEl.textContent = `${data.main.humidity}%`;
  pressureEl.textContent = `${data.main.pressure} hPa`;

  // Wind Speed
  updateWindSpeed();
}

/**
 * Updates temperature values according to selected unit (Celsius vs Fahrenheit)
 */
function updateTemperatures() {
  if (!weatherData) return;

  const tempC = weatherData.main.temp;
  const feelsLikeC = weatherData.main.feels_like;

  if (currentUnit === "C") {
    currentTempEl.textContent = Math.round(tempC);
    displayUnitEl.textContent = "°C";
    feelsLikeEl.textContent = `${Math.round(feelsLikeC)}°C`;
  } else {
    const tempF = (tempC * 9) / 5 + 32;
    const feelsLikeF = (feelsLikeC * 9) / 5 + 32;
    currentTempEl.textContent = Math.round(tempF);
    displayUnitEl.textContent = "°F";
    feelsLikeEl.textContent = `${Math.round(feelsLikeF)}°F`;
  }
}

/**
 * Updates wind speed according to selected unit (km/h vs mph)
 */
function updateWindSpeed() {
  if (!weatherData) return;

  const speedMeterSec = weatherData.wind.speed; // default from metric is m/s

  if (currentUnit === "C") {
    const kmh = Math.round(speedMeterSec * 3.6);
    windSpeedEl.textContent = `${kmh} km/h`;
  } else {
    const mph = Math.round(speedMeterSec * 2.237);
    windSpeedEl.textContent = `${mph} mph`;
  }
}

/**
 * Formats the local date and time of the target city based on timezone offset
 * @param {number} timezoneOffsetSec - Timezone offset in seconds from UTC
 * @returns {string} Formatted string e.g. "Monday, Oct 24 • 14:30"
 */
function formatLocalTime(timezoneOffsetSec = 0) {
  const nowUtc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
  const cityDate = new Date(nowUtc + timezoneOffsetSec * 1000);

  const options = {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  };

  const formatted = cityDate.toLocaleDateString("en-US", options);
  return formatted.replace(",", " •");
}

// =========================================================
// UI State Visibility Management
// =========================================================
function showLoading() {
  welcomeContainer.style.display = "none";
  errorContainer.style.display = "none";
  weatherCard.style.display = "none";
  loadingContainer.style.display = "block";
}

function showError(title, message) {
  welcomeContainer.style.display = "none";
  loadingContainer.style.display = "none";
  weatherCard.style.display = "none";

  errorTitle.textContent = title;
  errorMessage.innerHTML = message;
  errorContainer.style.display = "block";
}

function showWeatherCard() {
  welcomeContainer.style.display = "none";
  loadingContainer.style.display = "none";
  errorContainer.style.display = "none";
  weatherCard.style.display = "flex";
}

// =========================================================
// Event Listeners
// =========================================================

// Search form submit
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = cityInput.value.trim();
  if (query) {
    fetchWeather(query);
  }
});

// Clear input button
cityInput.addEventListener("input", () => {
  clearBtn.style.display = cityInput.value.length > 0 ? "block" : "none";
});

clearBtn.addEventListener("click", () => {
  cityInput.value = "";
  clearBtn.style.display = "none";
  cityInput.focus();
});

// Quick city chips
quickCities.addEventListener("click", (e) => {
  const chip = e.target.closest(".city-chip");
  if (!chip) return;
  const cityName = chip.dataset.city;
  if (cityName) {
    cityInput.value = cityName;
    clearBtn.style.display = "block";
    fetchWeather(cityName);
  }
});

// Unit Toggle Button Click Handlers
celsiusBtn.addEventListener("click", () => {
  if (currentUnit === "C") return;
  currentUnit = "C";
  celsiusBtn.classList.add("active");
  fahrenheitBtn.classList.remove("active");
  updateTemperatures();
  updateWindSpeed();
});

fahrenheitBtn.addEventListener("click", () => {
  if (currentUnit === "F") return;
  currentUnit = "F";
  fahrenheitBtn.classList.add("active");
  celsiusBtn.classList.remove("active");
  updateTemperatures();
  updateWindSpeed();
});
