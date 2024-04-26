// Global Variables
const apiKey = 'bc4401555497b609d8e8f6afd8ffcf46';
let units = 'metric';

// DOM Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherInfo = document.getElementById('current-weather-info');
const forecastInfo = document.getElementById('forecast-info');
const searchHistory = document.getElementById('search-history');
const celsiusButton = document.getElementById('celsius-button');
const fahrenheitButton = document.getElementById('fahrenheit-button');
const metersButton = document.getElementById('meters-button');
const kilometersButton = document.getElementById('kilometers-button');
const milesButton = document.getElementById('miles-button');

// Event Listeners
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    if (cityName !== '') {
        getWeatherData(cityName);
        cityInput.value = '';
    }
});

celsiusButton.addEventListener('click', function() {
    units = 'metric';
    const cityName = cityInput.value.trim();
    if (cityName !== '') {
        getWeatherData(cityName);
    }
});

fahrenheitButton.addEventListener('click', function() {
    units = 'imperial';
    const cityName = cityInput.value.trim();
    if (cityName !== '') {
        getWeatherData(cityName);
    }
});

metersButton.addEventListener('click', function() {
    units = 'metric';
    const cityName = cityInput.value.trim();
    if (cityName !== '') {
        getWeatherData(cityName);
    }
});

kilometersButton.addEventListener('click', function() {
    units = 'metric';
    const cityName = cityInput.value.trim();
    if (cityName !== '') {
        getWeatherData(cityName);
    }
});

milesButton.addEventListener('click', function() {
    units = 'imperial';
    const cityName = cityInput.value.trim();
    if (cityName !== '') {
        getWeatherData(cityName);
    }
});


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
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    currentWeatherInfo.innerHTML = `
        <h3>${cityName}</h3>
        <p>Temperature: ${temperature} °${units === 'metric' ? 'C' : 'F'}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} ${units === 'metric' ? 'm/s' : 'mph'}</p>
    `;
}

// Function to display forecast
function displayForecast(data) {
    const forecastItems = data.list;

    // Clear previous forecast data
    forecastInfo.innerHTML = '';
    const displayedDates = new Set();

    forecastItems.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();

        if (!displayedDates.has(date)) {
            const temperature = item.main.temp;
            const humidity = item.main.humidity;
            const windSpeed = item.wind.speed;
            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecastItem.innerHTML = `
                <h4>${date}</h4>
                <p>Temperature: ${temperature} °${units === 'metric' ? 'C' : 'F'}</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} ${units === 'metric' ? 'm/s' : 'mph'}</p>
            `;

            forecastInfo.appendChild(forecastItem);
            displayedDates.add(date);
        }
    });
}


// Initial display of search history
displaySearchHistory();
