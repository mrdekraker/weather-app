const cities = [];

const citySubmit = $(`#city-form`);
const cityInput = $(`#city`);

// List Past Searches
const recentSearch = function (recentSearch) {
  console.log(recentSearch);

  const ulEl = $(`card`).append(`ul`);
  const liEl = $(`ulEl`).append(`li`);
  const liBtn = $(`liEl`).append(`button`);

  const recentSearchEl = $(`ulEl`).append(`li`);
  $(recentSearchEl).text(recentSearch);
};

// Display the weather on the page
const displayWeather = function (weather, citySearch) {
  // clear old content
  weatherContainerEl.textContent = ``;
};

// Retrieve the forcast
const getForcast = function (city) {
  const apiKey = `44d25aa6fc100aefcb5aaa543a561628`;
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`;

  fetch(apiUrl).then((response) => {
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
    getCityWeather(city);
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
