// Global Variables
const apiKey = 'bc4401555497b609d8e8f6afd8ffcf46';

// DOM Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherInfo = document.getElementById('current-weather-info');
const forecastInfo = document.getElementById('forecast-info');
const searchHistory = document.getElementById('search-history');

// Function to fetch weather data from API
function getWeatherData(cityName) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`;

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

// Event Listener for search form submission
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    if (cityName !== '') {
        getWeatherData(cityName);
        cityInput.value = '';
    }
});

// Function to store searched city in localStorage
function storeSearchHistory(cityName) {
    let searchHistoryArray = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistoryArray.includes(cityName)) {
        searchHistoryArray.unshift(cityName);
        searchHistoryArray = searchHistoryArray.slice(0, 6);  // Keep only the latest 6 searches
        localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArray));
        displaySearchHistory();
    }
}

// Function to display search history
function displaySearchHistory() {
    let searchHistoryList = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.innerHTML = '';
    searchHistoryList.forEach(cityName => {
        const searchItem = document.createElement('li');
        searchItem.textContent = cityName;
        searchItem.addEventListener('click', function() {
            getWeatherData(cityName);
        });
        searchHistory.appendChild(searchItem);
    });
}

// Function to display current weather
function displayCurrentWeather(data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const humidity = Math.round(data.main.humidity);
    const windSpeed = Math.round(data.wind.speed * 2.237); // Convert from m/s to mph
    const iconCode = data.weather[0].icon; // Get the icon code from the weather data
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`; // Construct URL for the icon image

    currentWeatherInfo.innerHTML = `
        <h3>${cityName}</h3>
        <img src="${iconUrl}" alt="Weather Icon">
        <p>Temperature: ${temperature} °F</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} mph</p>
    `;
}



// Function to display forecast
function displayForecast(data) {
    forecastInfo.innerHTML = ''; // Clear previous forecast data
    data.list.filter((item, index) => index % 8 === 0).forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const temperature = Math.round(item.main.temp);
        const humidity = Math.round(item.main.humidity);
        const windSpeed = Math.round(item.wind.speed * 2.237); // Convert from m/s to mph
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <h4>${date}</h4>
            <img src="${iconUrl}" alt="Weather Icon">
            <p>Temperature: ${temperature} °F</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} mph</p>
        `;
        forecastInfo.appendChild(forecastItem);
    });
}


// Initial display of search history
displaySearchHistory();
