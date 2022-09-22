console.log(dayjs());

const cities = [];

const date = dayjs(new Date());
const weatherList = $(`#weather-list`);
const weatherContainer = $(`.currentWeather`);
const cityCurrentDate = $(`#cityCurrentDate`);
const citySubmit = $(`#city-form`);
const cityInput = $(`#city`);

console.log(date.format('dddd, MMM D, YYYY')); // '25/01/2019'););
// List Past Searches
const recentSearch = function (recentSearch) {
  console.log(recentSearch);

  const ulEl = $(`card`).append(`ul`);
  const liEl = $(`ulEl`).append(`li`);
  const liBtn = $(`liEl`).append(`button`);

  const recentSearchEl = $(`ulEl`).append(`li`);
  $(recentSearchEl).text(recentSearch);
  $(recentSearchEl).addClass(`.`);
};

// Display the weather on the page
const displayWeather = function (weather, citySearch) {
  // clear old content
  $(weatherContainer).text(``);
  $(cityCurrentDate).text(citySearch);

  // Add Date Element
  const currentDateSpan = $(`<span>`);
  $(currentDateSpan).text(` ${date.format('(dddd, MMM D, YYYY)')}`);
  $(cityCurrentDate).append(currentDateSpan);

  // Add Weather Icon
  const weatherIcon = $(`img`);
  $(weatherIcon).attr(`src`, `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
  $(weatherContainer).append(weatherIcon);

  // Create Li to append to weatherContainer to hold temperature data
  const tempLi = $(`li`);
  $(tempLi).text(`Temperature: ${weather.main.temp} °F`);
  $(weatherList).append(tempLi);

  // Create Li to hold humidity data
  const humidLi = $(`li`);
  $(humidLi).text(`Humidity: ${weather.main.humidity} %`);
  $(weatherList).append(humidLi);

  // Create Li to hold wind Data
  const windLi = $(`li`);
  $(windLi).text(`Wind Speed: ${weather.wind.speed} MPH`);
  $(weatherList).append(windLi);

  const { lat } = weather.coord;
  const { lon } = weather.coord;

  getUVIndex(lat, lon);
};

// Retrieve the forcast
const getForcast = function (city) {
  const APIKey = `44d25aa6fc100aefcb5aaa543a561628`;
  const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q={${city}}&appid={${APIKey}}`;

  fetch(APIUrl).then((response) => {
    response.JSON().then((data) => {
      displayWeather(data, city);
    });
  });
};

// Save the searches
const saveSearch = function () {
  localStorage.setItem(`cities`, JSON.stringify(cities));
};

// Form handler
const formSubmitHandler = function (event) {
  event.preventDefault();
  const city = $(cityInput).val().trim();

  if (city) {
    getForcast(city);
    getForcast(city);
    $(cities).unshift({ city });
    $(cityInput).val(``);
  } else {
    alert(`Please enter a city`);
  }

  saveSearch();
  recentSearch();
};

$(citySubmit).submit(formSubmitHandler);

// https://github.com/mlportu/weather-dashboard/blob/master/assets/js/script.js
