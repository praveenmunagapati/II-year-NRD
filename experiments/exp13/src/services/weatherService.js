/* ==================== File Path: src/services/weatherService.js ==================== */

// Embedded active OpenWeatherMap API key
const API_KEY = "53d57106482f8bfebba5a1d4d4754896";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

/**
 * Fetch current weather data for a given city
 * @param {string} city - Target city name (e.g., 'Hyderabad')
 * @returns {Promise<Object>} - Decoded JSON response from API
 */
export const fetchWeather = async (city) => {
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }

    return await response.json();
};