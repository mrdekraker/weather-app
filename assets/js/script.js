// Author: Mark DeKraker

const cityInput = document.querySelector(`.cityInput`);
const citySubmit = document.querySelector(`#citySubmit`);
const main = document.querySelector(`.main`);

const APIKEY = `44d25aa6fc100aefcb5aaa543a561628`;

citySubmit.addEventListener(`click`, (e) => {
  e.preventDefault();

  // GRAB CITY NAME
  const citySearch = cityInput.value.trim();
  
  // GET GEOCODE
  getGeocode(citySearch).then((data) => {
    const lat = data[0].lat;
    const lon = data[0].lon;
    console.log(`Latitude: ${lat}, Longitude: ${lon}`);
  
    // GET WEATHER
    getWeather(lat, lon).then((data) => {
      // DISPLAY WEATHER
      displayWeather(data, citySearch);
    });
  })
})
  

// FETCH GEOCODE API
const getGeocode = function (city) {
  const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=6&appid=${APIKEY}`;
  return fetch(geocodeURL).then((response) => {
    return response.json();
  });
};

// FETCH WEATHER API
const getWeather = function (lat, lon) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=imperial`;
  return fetch(weatherURL).then((response) => {
    return response.json();
  });
};
// const getWeather = function (lat, lon) {
//   const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=imperial`;
//   return fetch(weatherURL).then((response) => {
//     return response.json();
//   }).then((data) => {
//     console.log(data.list[0].weather[0].icon);
//     return data;
//   });
// };

// FETCH ICONS
const getIcon = function (iconCode) {
  const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

const getTemps = function (data) {
  const dailyTemps = [];

  for (let i = 5; i < data.list.length; i += 8) {
    const dailyForecast = data.list[i];
    const maxTemp = dailyForecast.main.temp_max;
    const minTemp = dailyForecast.main.temp_min;

    dailyTemps.push({
      current: dailyForecast.main.temp,
      max: maxTemp,
      min: minTemp,
    });
  }

  return dailyTemps;
};


// Display Weather Cards
const displayWeather = function (data, citySearch) {
  const date = new Date();
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  const today = date.toLocaleDateString('en-US', options);

  // Remove the 'hide' class to show the weather information
  main.classList.remove('hide');

  const cityName = document.querySelector('.cityName');
  const forecast = data.list;

  // Display the city name and date
  cityName.textContent = `${citySearch} - ${today}`;

  // Get the daily temperatures using the getTemps function
  const dailyTemperatures = getTemps(data);

  // Display 5 weather cards
  const cardContainer = document.querySelector('.cards');
  cardContainer.innerHTML = '';

  for (let i = 0; i < 5; i += 1) {
    const card = document.createElement("div");
    card.classList.add("card");

    // Increment the date for each card
    const cardDate = new Date(date);
    cardDate.setDate(date.getDate() + i); // Increment date by i days
    const cardOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const cardDateFormatted = cardDate.toLocaleDateString("en-US", cardOptions);

    // Fetch and display icons, temperatures, and humidity for each card
    const iconCode = forecast[i].weather[0].icon;
    console.log(iconCode)
    getIcon(iconCode)
  }
};


