const API_KEY = "4010be8ef5c1bc8a347272cdb09068dc";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.querySelector(".inputlocation");
const locationEl = document.querySelector(".location");
const temperatureEl = document.querySelector(".temperature");
const feelsLikeEl = document.querySelector(".feelslike");
const descriptionEl = document.querySelector(".description");
const dayNightEl = document.querySelector(".daynight");
const windEl = document.querySelector(".wind");
const humidityEl = document.querySelector(".humidity");
const pressureEl = document.querySelector(".pressure");
const latitudeEl = document.querySelector(".latitude");
const longitudeEl = document.querySelector(".longitude");
const btn = document.querySelector(".searchbtn");
const bgVideo = document.querySelector("#bgvideo");

const formatTemp = (value) => `${Math.round(value)}°C`;
const formatCoord = (value) => `${value.toFixed(2)}°`;
const toMph = (metersPerSec) => metersPerSec * 2.23694;

const setLoadingState = (isLoading) => {
  btn.disabled = isLoading;
  btn.textContent = isLoading ? "Searching..." : "Search";
};

const updateUI = (data) => {
  locationEl.innerText = `${data.name}, ${data.sys.country}`;
  temperatureEl.innerText = formatTemp(data.main.temp);
  feelsLikeEl.innerText = `Feels like: ${formatTemp(data.main.feels_like)}`;
  descriptionEl.innerText = data.weather[0].main;
  windEl.innerText = `Wind: ${toMph(data.wind.speed).toFixed(1)} mph`;
  humidityEl.innerText = `Humidity: ${data.main.humidity}%`;
  pressureEl.innerText = `Pressure: ${data.main.pressure} hPa`;
  latitudeEl.innerText = `Lat: ${formatCoord(data.coord.lat)}`;
  longitudeEl.innerText = `Lon: ${formatCoord(data.coord.lon)}`;

  // Determine day/night based on sunrise and sunset times
  const currentTime = Date.now() / 1000; // Current time in seconds
  const sunrise = data.sys.sunrise;
  const sunset = data.sys.sunset;
  const isNight = currentTime < sunrise || currentTime > sunset;

  if (isNight) {
    dayNightEl.innerText = "Night";
    bgVideo.querySelector("source").src = "bgvideos/moonvideo.mp4";
  } else {
    dayNightEl.innerText = "Day";
    bgVideo.querySelector("source").src = "bgvideos/skyvideo.mp4";
  }

  bgVideo.load();
};

const fetchWeatherByCity = async (cityName) => {
  const url = `${API_URL}?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || "Unable to fetch weather data.";
    throw new Error(message);
  }

  return response.json();
};

const handleSearch = async () => {
  const cityName = cityInput.value.trim();

  if (!cityName) {
    locationEl.innerText = "Please enter a city name";
    return;
  }

  try {
    setLoadingState(true);
    const data = await fetchWeatherByCity(cityName);
    updateUI(data);
  } catch (error) {
    locationEl.innerText = `City not found: ${cityName}`;
    temperatureEl.innerText = "--";
    feelsLikeEl.innerText = "Feels like: --";
    descriptionEl.innerText = "--";
    windEl.innerText = "Wind: --";
    humidityEl.innerText = "Humidity: --";
    pressureEl.innerText = "Pressure: --";
    latitudeEl.innerText = "Lat: --";
    longitudeEl.innerText = "Lon: --";
    dayNightEl.innerText = "--";
  } finally {
    setLoadingState(false);
  }
};

btn.addEventListener("click", handleSearch);
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});

// Load default weather based on geolocation
const loadDefaultWeather = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const geoUrl = `${API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
        try {
          setLoadingState(true);
          const response = await fetch(geoUrl);
          const data = await response.json();
          updateUI(data);
          cityInput.value = data.name;
        } catch (error) {
          console.error("Error fetching geolocation weather:", error);
          locationEl.innerText = "Unable to fetch location weather";
        } finally {
          setLoadingState(false);
        }
      },
      (error) => {
        console.warn("Geolocation denied, skipping default load:", error);
      }
    );
  }
};

// Load default weather on page load
window.addEventListener("load", loadDefaultWeather);