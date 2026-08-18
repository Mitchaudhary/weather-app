# Weather App 🌤️

A simple, responsive weather web application built with **HTML, CSS, and Vanilla JavaScript**. It uses the **OpenWeatherMap API** to fetch real-time weather information for cities around the world.

## Features

- 🔎 Search weather by city name
- 🌡️ Current temperature
- 🌤️ Weather condition and icon
- 💧 Humidity
- 💨 Wind speed
- 🤗 Feels-like temperature
- 🌍 City and country information
- 🔄 Celsius / Fahrenheit temperature toggle
- ⏳ Loading state
- ⚠️ Error handling for invalid cities/API errors
- 📱 Responsive design for desktop and mobile

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API
- OpenWeatherMap API

## Project Structure

```text
weather-app/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Mitchaudhary/weather-app.git
```

### 2. Open the project

Open the project folder in VS Code, Antigravity, or any code editor.

### 3. Configure the API Key

Open `script.js` and add your OpenWeatherMap API key.

Example:

```javascript
const API_KEY = "YOUR_API_KEY";
```

Get an API key from the official OpenWeatherMap website:

https://openweathermap.org/api

### 4. Run the application

You can open `index.html` directly in your browser.

For the best development experience, use a local server such as VS Code Live Server.

## How to Use

1. Enter a city name in the search box.
2. Click the Search button.
3. The application fetches the latest weather information.
4. Use the °C / °F button to change the temperature unit.

## API

This project uses the OpenWeatherMap API:

- Current Weather API
- Weather icon data

Make sure your API key is valid and active.

## Important Security Note

Do not commit a real API key to a public GitHub repository.

For a production application, the API request should be handled through a backend/serverless function so the API key is not exposed in client-side JavaScript.

## Future Improvements

Possible future features:

- 📍 Current location weather
- 📅 5-day forecast
- 🕐 Hourly forecast
- ⭐ Favorite cities
- 🕘 Recent searches
- 🌙 Dark mode
- 🌧️ Weather-based backgrounds
- 📊 Temperature charts
- 🌫️ Air quality information

## Author

**Mitchaudhary**

GitHub: https://github.com/Mitchaudhary

## License

This project is open source and available for learning and educational purposes.
