const cities = [];

const cityInput = $(`#city`);
const citySubmit = $(`#city-form`);
const infoContainer = $(`.infoContainer`);
const lastSearchEl = $(`#lastSearchBtns`);

const weatherList = $(`#weather-list`);
const weatherContainer = $(`.currentWeather`);
const cityCurrentDate = $(`#cityCurrentDate`);
const date = moment(new Date());

const forecastContainer = $(`#future-forecast`);
const forecastTitle = $(`.forecastTitle`);

// DISPLAY 5 DAY FORCAST
const display5Day = function (weather) {
  $(forecastContainer).text(``);
  $(forecastTitle).text(`5-Day Forecast:`);

  const forecast = weather.list;
  for (let i = 5; i < forecast.length; i += 8) {
    const dailyForecast = forecast[i];
    const forecastCard = document.createElement(`div`);
    $(forecastCard).addClass(`card mx-2`);

    console.log(dailyForecast);

    // CREATE DATE ELEMENT
    const futureDate = moment.unix(dailyForecast.dt).format(`MMM D, YYYY`);
    const forecastDate = document.createElement(`h4`);
    $(forecastDate).text(futureDate);
    forecastDate.classList = `card-header text-center`;
    $(forecastCard).append(forecastDate);

    // CREATE WEATHER ICON
    const weatherIcon = document.createElement(`img`);
    weatherIcon.classList = `card-body text-center`;
    weatherIcon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
    );
    $(forecastCard).append(weatherIcon);

    // CREATE TEMP ELEMENT
    const forecastTemp = document.createElement(`span`);
    forecastTemp.classList = `card-body text-center`;
    forecastTemp.textContent = `Temp: ${dailyForecast.main.temp} °F`;
    $(forecastCard).append(forecastTemp);

    // CREATE HUMIDITY ELEMENT
    const forecastHumidity = document.createElement(`span`);
    forecastHumidity.classList = `card-body text-center`;
    forecastHumidity.textContent = `Humidity: ${dailyForecast.main.humidity}%`;
    $(forecastCard).append(forecastHumidity);

    // APPEND CARD TO CONTAINER
    $(forecastContainer).append(forecastCard);
  }
};

// RETRIEVE 5DAY
const get5Day = function (city) {
  const APIKey = `44d25aa6fc100aefcb5aaa543a561628`;
  const APIurl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIKey}`;

  fetch(APIurl).then((response) => {
    response.json().then((data) => {
      display5Day(data);
    });
  });
};

// DISPLAY WEATHER ON THE PAGE
const displayWeather = function (weather, citySearch) {
  // clear old content
  $(weatherContainer).text(``);
  $(cityCurrentDate).text(citySearch);

  // Add Date Element
  const currentDateSpan = $(`<span></span>`);
  $(currentDateSpan).text(` ${date.format("(dddd, MMM D, YYYY)")}`);
  $(cityCurrentDate).append(currentDateSpan);

  // Add Weather Icon
  const weatherIcon = document.createElement(`img`);
  $(weatherIcon).attr(
    `src`,
    `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  );
  $(cityCurrentDate).append(weatherIcon);

  // Create Li to append to weatherContainer to hold temperature data
  const tempLi = $(`<li></li>`);
  $(tempLi).text(`Temperature: ${weather.main.temp} °F`);
  $(weatherList).append(tempLi);

  // Create Li to hold humidity data
  const humidLi = $(`<li></li>`);
  $(humidLi).text(`Humidity: ${weather.main.humidity}%`);
  $(weatherList).append(humidLi);

  // Create Li to hold wind Data
  const windLi = $(`<li></li>`);
  $(windLi).text(`Wind Speed: ${weather.wind.speed} MPH`);
  $(weatherList).append(windLi);
};

// RETRIEVE THE FORECAST
const getForecast = function (city) {
  const APIKey = `44d25aa6fc100aefcb5aaa543a561628`;
  const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`;

  fetch(APIUrl).then((response) => {
    response.json().then((data) => {
      displayWeather(data, city);
    });
  });
};

// LAST SEARCH HANDLER
const lastSearchHandler = function (event) {
  const city = event.target.getAttribute(`data-city`);
  if (city) {
    getForecast(city);
    get5Day(city);
  }
};

// LIST PAST SEARCHES
const recentSearchList = function (lastSearch) {
  const liEl = document.createElement(`li`);
  const lastSearchEl = document.createElement(`button`);
  $(lastSearchEl).text(lastSearch);
  lastSearchEl.setAttribute(`data-city`, lastSearch);
  lastSearchEl.setAttribute(`type`, `submit`);

  cities.push(lastSearch);

  liEl.appendChild(lastSearchEl);
  $(`.search-list`).append(liEl);
};

// SAVE THE SEARCHES
const saveSearch = function () {
  localStorage.setItem(`cities`, JSON.stringify(cities));
};

// FORM SUBMIT HANDLER
const formSubmitHandler = (event) => {
  event.preventDefault();
  const city = cityInput.val().trim();
  $(`.infoContainer`).removeClass(`hide`);
  $(`.search-list`).removeClass(`hide`);

  if (city) {
    getForecast(city);
    get5Day(city);
    // cities.unshift({ city });
    cityInput.val(``);
    $(infoContainer).removeClass(`hide`);
  } else {
    alert(`Please enter a city`);
  }

  saveSearch();
  recentSearchList(city);
};

$(citySubmit).submit(formSubmitHandler);
$(lastSearchEl).click(lastSearchHandler);
