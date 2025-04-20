import "./styles.css";
import humidityIcon from "./images/humidity.svg";
import windIcon from "./images/wind.svg";
import clear from "./images/clear.svg";
import cloudy from "./images/cloudy.svg";
import fog from "./images/fog.svg";
import mist from "./images/mist.svg";
import hail from "./images/hail.svg";

const API_KEY = process.env.API_KEY;

function displayWeather(data) {
  const display = document.getElementById("weather-display");
  console.log(data.weatherDescription);
  const iconMap = {
    Clear: clear,
    Sunny: clear,
    Cloudy: cloudy,
    "Partially cloudy": cloudy,
    Overcast: cloudy,
    Fog: fog,
    Mist: mist,
    Hail: hail,
  };
  const mainIcon = iconMap[data.weatherDescription] || clear;

  display.innerHTML = `
        <div class="weather-header">
    <h2 class="location">${data.location}</h2>
    <p class="condition">${data.weatherDescription}</p>
  </div>

  <div class="weather-main">
    <img src="${mainIcon}" alt="${data.weatherDescription}" class="weather-icon" />
    <h1 class="temperature">${data.temperature}°C</h1>
  </div>

  <div class="weather-metrics">
    <div class="metric">
      <img src="${humidityIcon}" alt="Humidity" />
      <p>${data.humidity}%</p>
    </div>
    <div class="metric">
      <img src="${windIcon}" alt="Wind Speed" />
      <p>${data.windSpeed} km/h</p>
    </div>
  </div>
    `;
}

function processWeatherData(data) {
  const current = data.currentConditions;

  return {
    location: data.resolvedAddress,
    temperature: current.temp,
    humidity: current.humidity,
    windSpeed: current.windspeed,
    weatherDescription: current.conditions,
    icon: current.icon,
  };
}

async function fetchWeatherData(location) {
  try {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${API_KEY}&contentType=json`;

    const response = await fetch(url);
    const data = await response.json();
    const finalData = processWeatherData(data);

    return finalData;
  } catch (error) {
    console.error(error);
  }
}

const form = document.querySelector("#location-form");
const input = document.querySelector("#location-input");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const location = input.value.trim();
  if (!location) return;

  const loading = document.getElementById("loading");
  const display = document.getElementById("weather-display");

  display.style.display = "none";
  loading.style.display = "block";
  form.querySelector("button").disabled = true;
  input.disabled = true;

  try {
    const weather = await fetchWeatherData(location);
    if (weather) {
      displayWeather(weather);
    } else {
      throw new Error("No weather data");
    }
  } catch (err) {
    console.error(err);
  } finally {
    display.style.display = "block";
    loading.style.display = "none";
    form.querySelector("button").disabled = false;
    input.disabled = false;
  }
});
