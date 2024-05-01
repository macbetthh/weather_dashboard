// Global Variables
const apiKey = 'bc4401555497b609d8e8f6afd8ffcf46';
let units = 'metric';

// DOM Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherInfo = document.getElementById('current-weather-info');
const forecastInfo = document.getElementById('forecast-info');
const searchHistory = document.getElementById('search-history');
const metricButton = document.getElementById('metric-button');
const imperialButton = document.getElementById('imperial-button');

// Function to fetch weather data from API
function getWeatherData(cityName) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${units}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${units}&appid=${apiKey}`;

    // Fetch current weather data
    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(currentData => {
            storeSearchHistory(cityName);
            displayCurrentWeather(currentData);

            fetch(forecastUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Forecast not found');
                    }
                    return response.json();
                })
                .then(forecastData => {
                    displayForecast(forecastData);
                })
                .catch(error => {
                    console.error('Error:', error.message);
                    alert('Forecast not found. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error:', error.message);
            alert('City not found. Please enter a valid city name.');
        });
}

// Event Listeners
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    if (cityName !== '') {
        getWeatherData(cityName);
        cityInput.value = '';
    }
});

// Selecting Unit Buttons
metricButton.addEventListener('click', function() {
    units = 'metric';
    updateWeatherUnits(); // Call function to update weather units
});

imperialButton.addEventListener('click', function() {
    units = 'imperial';
    updateWeatherUnits(); // Call function to update weather units
});

// Function to update weather units
function updateWeatherUnits() {
    const temperatureElements = document.querySelectorAll('.temperature');
    const windSpeedElements = document.querySelectorAll('.wind-speed');

    temperatureElements.forEach(element => {
        const temperatureValue = parseFloat(element.dataset.temperature);
        const updatedTemperature = units === 'metric' ? temperatureValue : (temperatureValue * 9/5) + 32;
        element.textContent = `${updatedTemperature.toFixed(2)} °${units === 'metric' ? 'C' : 'F'}`;
    });

    windSpeedElements.forEach(element => {
        const windSpeedValue = parseFloat(element.dataset.windSpeed);
        const updatedWindSpeed = units === 'metric' ? windSpeedValue : windSpeedValue / 0.44704; // Convert wind speed from m/s to mph
        element.textContent = `${updatedWindSpeed.toFixed(2)} ${units === 'metric' ? 'm/s' : 'mph'}`;
    });
}

// Function to store searched city in localStorage
function storeSearchHistory(cityName) {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.push(cityName);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displaySearchHistory();
}

// Function to display search history
function displaySearchHistory() {
    let searchHistoryList = JSON.parse(localStorage.getItem('searchHistory'));
    searchHistory.innerHTML = '';

    if (searchHistoryList && searchHistoryList.length > 0) {
        searchHistoryList.forEach(cityName => {
            const searchItem = document.createElement('li');
            searchItem.textContent = cityName;
            searchItem.addEventListener('click', function() {
                getWeatherData(cityName);
            });

            searchHistory.appendChild(searchItem);
        });
    } else {
        searchHistory.innerHTML = '<li>No search history available</li>';
    }
}

// Function to display current weather
function displayCurrentWeather(data) {
    const cityName = data.name;
    let temperature = data.main.temp;
    let windSpeed = data.wind.speed;

    // Convert temperature and wind speed to imperial units if selected
    if (units === 'imperial') {
        temperature = (temperature * 9/5) + 32; // Convert temperature from Celsius to Fahrenheit
        windSpeed *= 2.237; // Convert wind speed from m/s to mph
    }

    temperature = temperature.toFixed(2);
    windSpeed = windSpeed.toFixed(2);

    currentWeatherInfo.innerHTML = `
        <h3>${cityName}</h3>
        <p>Temperature: <span class="temperature" data-temperature="${temperature}">${temperature} °${units === 'metric' ? 'C' : 'F'}</span></p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: <span class="wind-speed" data-wind-speed="${windSpeed}">${windSpeed} ${units === 'metric' ? 'm/s' : 'mph'}</span></p>
    `;
}

// Function to display forecast
function displayForecast(data) {
    const forecastItems = data.list;

    forecastInfo.innerHTML = ''; // Clear previous forecast data
    const displayedDates = new Set();

    for (let i = 4; i < forecastItems.length; i += 8) {
        const item = forecastItems[i];
        const date = new Date(item.dt * 1000).toLocaleDateString(); 

        if (!displayedDates.has(date)) {
            let temperature = item.main.temp;
            let windSpeed = item.wind.speed;

            // Convert temperature and wind speed to imperial units if selected
            if (units === 'imperial') {
                temperature = (temperature * 9/5) + 32; // Convert temperature from Celsius to Fahrenheit
                windSpeed *= 2.237; // Convert wind speed from m/s to mph
            }

            temperature = temperature.toFixed(2);
            windSpeed = windSpeed.toFixed(2);

            const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecastItem.innerHTML = `
                <h4>${date}</h4>
                <img src="${icon}" alt="Weather Icon">
                <p>Temperature: <span class="temperature" data-temperature="${temperature}">${temperature} °${units === 'metric' ? 'C' : 'F'}</span></p>
                <p>Humidity: ${item.main.humidity}%</p>
                <p>Wind Speed: <span class="wind-speed" data-wind-speed="${windSpeed}">${windSpeed} ${units === 'metric' ? 'm/s' : 'mph'}</span></p>
            `;

            forecastInfo.appendChild(forecastItem);
            displayedDates.add(date); // Add the displayed date to the set to avoid duplicates
        }
    }
}

// Initial display of search history
displaySearchHistory();
