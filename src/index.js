import "./styles.css";

const API_KEY = process.env.API_KEY;

function displayWeather(data) {
  const display = document.getElementById("weather-display");

  display.innerHTML = `
      <h2>Weather in ${data.location}</h2>
      <p><strong>Temperature:</strong> ${data.temperature} °C</p>
      <p><strong>Condition:</strong> ${data.weatherDescription}</p>
      <p><strong>Humidity:</strong> ${data.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${data.windSpeed} km/h</p>
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
