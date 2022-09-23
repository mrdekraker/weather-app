// console.log(dayjs());
const cities = [];

const date = moment(new Date());
const weatherList = $(`#weather-list`);
const weatherContainer = $(`.currentWeather`);
const cityCurrentDate = $(`#cityCurrentDate`);
const citySubmit = $(`#city-form`);
const cityInput = $(`#city`);
const forecastContainer = $(`#future-forecast`);
const forecastTitle = $(`.forecastTitle`);
const infoContainer = $(`.infoContainer`);
const searchList = $(`.search-list`);
const recentSearchBtn = $(`button`);

// DISPLAY 5 DAY FORCAST
const display5Day = function (weather) {
  $(forecastContainer).text(``);
  $(forecastTitle).text(`5 Day Forecast:`);

  const forecast = weather.list;
  console.log(forecast);
  for (let i = 5; i < forecast.length; i += 1) {
    const dailyForecast = forecast[i];

    const forecastCard = $(`#future-forecast`);
    $(forecastCard).add(`card`);

    // APPEND DATE ELEMENT
    const forecastDate = $(`h4`);
    // $(forecastDate).text(date.add(1, `days`).format(`MMM D, YYYY`));
    forecastDate.textContent = moment.unix(dailyForecast.dt).format('MMM D, YYYY');
    forecastDate.classList = `card-header text-center`;
    $(forecastCard).append(forecastDate);

    // CREATE IMG ELEMENT
    const weatherIcon = document.createElement(`img`);
    weatherIcon.classList = `card-body text-center`;
    weatherIcon.setAttribute(`src`, `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);

    // CREATE TEMP SPAN
    const tempSpan = $(`<span></span>`);
    $(tempSpan).addClass(`card-body text-center`);
    // $(tempSpan).text(`${dailyForecast.main.temp} °F`);
    $(tempSpan).text(`OINGA BOINGA`);
    $(forecastCard).append(tempSpan);

    // CREATE HUMIDITY SPAN
    const humidSpan = $(`<span></span>`);
    $(humidSpan).addClass(`card-body text-center`);
    $(humidSpan).text(`${dailyForecast.main.humidity} °F`);
    $(forecastCard).append(humidSpan);

    // APPEND EVERYTHING TO CONTAINER
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
  $(currentDateSpan).text(` ${date.format('(dddd, MMM D, YYYY)')}`);
  $(cityCurrentDate).append(currentDateSpan);

  // Add Weather Icon
  const weatherIcon = document.createElement(`img`);
  $(weatherIcon).attr(`src`, `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
  $(cityCurrentDate).append(weatherIcon);

  // Create Li to append to weatherContainer to hold temperature data
  const tempLi = $(`<li></li>`);
  $(tempLi).text(`Temperature: ${weather.main.temp} °F`);
  $(weatherList).append(tempLi);

  // Create Li to hold humidity data
  const humidLi = $(`<li></li>`);
  $(humidLi).text(`Humidity: ${weather.main.humidity} %`);
  $(weatherList).append(humidLi);

  // Create Li to hold wind Data
  const windLi = $(`<li></li>`);
  $(windLi).text(`Wind Speed: ${weather.wind.speed} MPH`);
  $(weatherList).append(windLi);
};

// RETRIEVE THE FORECAST
const getForecast = function (city) {
  const APIKey = `44d25aa6fc100aefcb5aaa543a561628`;
  const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

  fetch(APIUrl).then((response) => {
    response.json().then((data) => {
      displayWeather(data, city);
    });
  });
};

// LIST PAST SEARCHES
const recentSearchList = function (lastSearch) {
  console.log(lastSearch);
};

// SAVE THE SEARCHES
const saveSearch = function () {
  localStorage.setItem(`cities`, JSON.stringify(cities));
};

// FORM HANDLER
const formSubmitHandler = function (e) {
  e.preventDefault();
  const city = cityInput.val().trim();
  console.log(city);

  if (city) {
    getForecast(city);
    get5Day(city);
    cityInput.val(``);
    $(infoContainer).removeClass(`hide`);
  } else {
    alert(`Please enter a city`);
  }

  saveSearch();
  recentSearchList();
};

$(citySubmit).submit(formSubmitHandler);
