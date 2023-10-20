// Author: Mark DeKraker
const cities = [];

const city = document.querySelector(`#cityName`);
const citySubmit = document.querySelector(`#citySubmit`);

const APIKEY = `44d25aa6fc100aefcb5aaa543a561628`;

// listen for form submit event
citySubmit.addEventListener("click", (e) => {
  e.preventDefault(); // prevent form from submitting
  const citySearch = city.value.trim();
  console.log(citySearch);
    getGeocode(citySearch).then((data) => {
      const lat = data[0].lat;
      const lon = data[0].lon;
      console.log(`Latitude: ${lat}, Longitude: ${lon}`);

      // fetch weather data
      getWeather(lat, lon).then((data) => {
        console.log(`City Data: ${JSON.stringify(data)}`);
        displayWeather(data, citySearch);
      });

      // DISPLAY WEATHER
      displayWeather(data, citySearch);
    });
  
  // clear input fields
  city.value = "";
  
  
});

// FETCH GEOCODE API
const getGeocode = function (city) {
  const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIKEY}`;
  return fetch(geocodeURL).then((response) => {
    return response.json();
  });
}

// FETCH WEATHER API
const getWeather = function (lat, lon) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=imperial`;
  http: return fetch(weatherURL).then((response) => {
    return response.json();
  });
}

// DISPLAY WEATHER
function displayWeather(data, citySearch) {
  const cityName = document.querySelector(`.city-name`);
  const temp = document.querySelector(`.temp`);
  const humidity = document.querySelector(`.humidity`);

  cityName.textContent = citySearch + ` - ${currentDate()}`;
  
  // APPEND TO SEARCH LIST
  searchAppend(data, citySearch);
}

// CURRENT DATE
const currentDate = () => {
  const date = new Date();
  const options = {
    weekday: `short`,
    month: `short`,
    day: `numeric`,
    year: `numeric`,
  };
  return date.toLocaleDateString(`en-US`, options);
};

const searchAppend = function (data, citySearch) {
  const searchList = document.querySelector(`.search-list`);
  const searchItems = searchList.querySelectorAll(`li`);
  let buttonExists = false;

  // Check if a button with the same name already exists
  searchItems.forEach((item) => {
    const button = item.querySelector(`button`);
    if (button && button.textContent === citySearch) {
      buttonExists = true;
    }
  });

  // Add a new button if it doesn't already exist
  if (!buttonExists) {
    const searchItem = document.createElement(`li`);
    const searchButton = document.createElement(`button`);
    searchItem.classList = `list-group-item`;
    searchButton.classList = `btn btn-link`;
    searchButton.textContent = citySearch;
    searchItem.appendChild(searchButton);
    searchList.appendChild(searchItem);
  }
}

// SEARCH LIST EVENT LISTENER
const searchList = document.querySelector(`.search-list`);

searchList.addEventListener(`click`, function (event) {
  if (event.target.matches(`button`)) {
    const citySearch = event.target.textContent;
    getGeocode(citySearch).then((data) => {
      const lat = data[0].lat;
      const lon = data[0].lon;

      // fetch weather data
      getWeather(lat, lon).then((data) => {
        console.log(`City Data: ${JSON.stringify(data)}`);
        displayWeather(data, citySearch);
      });

      // DISPLAY WEATHER
      displayWeather(data, citySearch);
    });
  }
});