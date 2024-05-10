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
    searchHistoryArray = searchHistoryArray.filter(item => item.toLowerCase() !== cityName.toLowerCase());
    searchHistoryArray.unshift(cityName);
    searchHistoryArray = searchHistoryArray.slice(0, 6);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArray));
    displaySearchHistory();
}

// Function to display search history
function displaySearchHistory() {
    let searchHistoryList = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.innerHTML = '';
    const addedCities = new Set();

    searchHistoryList.forEach(cityName => {
        if (!addedCities.has(cityName.toLowerCase())) { 
            const searchItem = document.createElement('li');
            searchItem.className = "bg-blue-200 hover:bg-blue-300 text-blue-800 text-center py-1 px-3 rounded-full text-sm cursor-pointer w-full md:w-auto";
            searchItem.textContent = cityName;
            searchItem.addEventListener('click', function() {
                getWeatherData(cityName);
            });
            searchHistory.appendChild(searchItem);
            addedCities.add(cityName.toLowerCase());
        }
    });
}

// Function to display current weather
function displayCurrentWeather(data) {
    console.log(data);
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const humidity = Math.round(data.main.humidity);
    const windSpeed = Math.round(data.wind.speed * 2.237); // Convert from m/s to mph
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    // Get today's date in a readable format
    const today = new Date();
    const dateString = today.toLocaleDateString(undefined, {  year: 'numeric', month: 'long', day: 'numeric'});
    const timeString = today.toLocaleTimeString(undefined, {  hour: '2-digit', minute: '2-digit'});

    // card layout for current weather styled using tailwind/flowbite
    currentWeatherInfo.innerHTML = `
    <div class="flex flex-col items-center text-justify-center text-MarianBlue bg-gradient-to-br from-test1 to-test2 bg-opacity-85 p-4 rounded-lg shadow">
        <div class="w-full bg-white/50 backdrop-blur-lg rounded p-2 shadow-md">
            <h2 class="text-2xl font-bold text-center" style="text-shadow: 1px 1px 2px #E6F4F4";>Current Weather</h2> 
        </div>
        
        <div class="flex items-center space-x-10 mt-4">
            <div class="p-2">
                <img src="${iconUrl}" alt="Weather Icon" class="w-24 h-24 drop-shadow-lg">
            </div>
            <div class="flex flex-col">
                <h3 class="text-2xl font-bold"; style="text-shadow: 1px 1px 2px #E6F4F4";>${cityName}</h3>
                <p class="text-lg" font-bold; style="text-shadow: 1px 1px 2px #E6F4F4";>${dateString}</p>
                <p class="text-lg" font-bold; style="text-shadow: 1px 1px 2px #E6F4F4";>${timeString}</p>
            </div>
        </div>
        
        <div class="flex flex-col md:flex-row mt-4 md:w-full drop-shadow-md">
            <div class="text-center p-4 bg-white rounded-lg shadow mx-2 mb-2 md:mb-0 w-full">
                <p class="font-bold text-lg">Temperature</p>
                <p class="text-xl">${temperature} °F</p>
            </div>
            <div class="text-center p-4 bg-white rounded-lg shadow mx-2 mb-2 md:mb-0 w-full">
                <p class="font-bold text-lg">Humidity</p>
                <p class="text-xl">${humidity}%</p>
            </div>
            <div class="text-center p-4 bg-white rounded-lg shadow mx-2 mb-2 md:mb-0 w-full">
                <p class="font-bold text-lg">Wind Speed</p>
                <p class="text-xl">${windSpeed} mph</p>
            </div>
        </div>
        
        </div>
    `;
}




// Function to display forecast
function displayForecast(data) {
    forecastInfo.innerHTML = ''; // Clear previous forecast data

    // Create a container for all forecast items with a responsive grid layout
    const forecastContainer = document.createElement('div');
    forecastContainer.className = 'flex flex-col items-center justify-center bg-gradient-to-br from-test1 to-test2 bg-opacity-85 p-4 rounded-lg shadow text-MarianBlue';

    // Add a title to the forecast container that matches the Current Weather title styling
    const forecastTitle = document.createElement('h2');
    forecastTitle.className = 'text-2xl font-bold mb-4 w-full bg-white/50 backdrop-blur-lg rounded p-2 shadow-md text-center';
    forecastTitle.textContent = '5-Day Forecast';
    forecastContainer.appendChild(forecastTitle);

    // Grid container for the forecasts
    const gridContainer = document.createElement('div');
    gridContainer.className = 'w-full grid grid-cols-1 md:grid-cols-5 gap-4'; // One column on mobile, five columns on small screens and above

    // Process each forecast entry
    data.list.filter((item, index) => index % 8 === 0).forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const temperature = Math.round(item.main.temp);
        const humidity = Math.round(item.main.humidity);
        const windSpeed = Math.round(item.wind.speed * 2.237); // Convert from m/s to mph
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('bg-white', 'shadow-md', 'rounded-lg', 'p-4', 'flex', 'flex-col', 'items-center', 'text-center');
        forecastItem.innerHTML = `
            <h4 class="font-bold">${date}</h4>
            <div class="p-2 bg-gradient-to-br from-test1 to-test2 rounded-full shadow">
                <img src="${iconUrl}" alt="Weather Icon" class="mx-auto w-16 h-16">
            </div>
            <p>Temperature: ${temperature} °F</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} mph</p>
        `;

        // Append each forecast item to the grid container
        gridContainer.appendChild(forecastItem);
    });

    // Append the grid container to the forecast container
    forecastContainer.appendChild(gridContainer);

    // Append the entire forecast container to the main forecastInfo div
    forecastInfo.appendChild(forecastContainer);
}




// Initial display of search history
displaySearchHistory();
