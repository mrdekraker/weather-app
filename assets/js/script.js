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


const getTemps = function (data) {
  const dailyTemps = [];

  for (let i = 0; i < 5; i++) {
    const dailyForecasts = data.list.slice(i * 8, (i + 1) * 8);

    // Initialize variables to keep track of min and max temperatures
    let minTemp = dailyForecasts[0].main.temp;
    let maxTemp = dailyForecasts[0].main.temp;

    // Iterate over the 3-hour forecasts to find min and max temperatures
    for (let j = 0; j < dailyForecasts.length; j++) {
      const temp = dailyForecasts[j].main.temp;

      if (temp < minTemp) {
        minTemp = temp;
      }

      if (temp > maxTemp) {
        maxTemp = temp;
      }
    }

    dailyTemps.push({
      current: dailyForecasts[0].main.temp,
      max: maxTemp,
      min: minTemp,
    });
  }

  return dailyTemps;
};

// ADD BUTTONS TO SEARCH HISTORY
const ulSearchList = document.querySelector(".search-list");
const searchHistory = new Set();

// Function to add a new button to the search list
function addCityButton(cityName) {
  if (!searchHistory.has(cityName)) {
    const button = document.createElement("button");
    button.classList.add("btn");
    button.textContent = cityName;

    // Add an event listener to each button to trigger a search
    button.addEventListener("click", () => {
      cityInput.value = cityName;
      citySubmit.click();
    });

    const li = document.createElement("li");
    li.appendChild(button);
    ulSearchList.appendChild(li);

    // Show the search list
    ulSearchList.classList.remove("hide");

    // Add the city to the search history
    searchHistory.add(cityName);
  }

  // Clear the input field after adding the button
  cityInput.value = "";
}

// Event listener for the search button
citySubmit.addEventListener("click", (e) => {
  e.preventDefault();
  const citySearch = cityInput.value.trim();

  // Check if the city name is not empty
  if (citySearch) {
    // Call the function to add the city button
    addCityButton(citySearch);
  }
});



// Display Weather Cards
const displayWeather = function (data, citySearch) {
  const date = new Date();
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const today = date.toLocaleDateString("en-US", options);

  // Remove the 'hide' class to show the weather information
  main.classList.remove("hide");

  const cityName = document.querySelector(".cityName");
  const forecast = data.list;

  // Display the city name and date
  cityName.textContent = `${citySearch} - ${today}`;

  // Get the daily temperatures using the getTemps function
  const dailyTemperatures = getTemps(data);

  // Display 5 weather cards
  const cardContainer = document.querySelector(".cards");
  cardContainer.innerHTML = "";

  for (let i = 0; i < 5; i += 1) {
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

    // Get the weather data for the current day
    const dayData = forecast[i];
    const iconCode = dayData.weather[0].icon;
    const maxTemp = dailyTemperatures[i].max;
    const minTemp = dailyTemperatures[i].min;
    const humidity = dayData.main.humidity;

    // Create the HTML for the card using the cardTemplate
    const cardTemplate = `
      <div class="card">
        <p class="cardDate">${cardDateFormatted}</p>
        <img class="cardIcon" src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
        <p class="cardTempMax">High: ${maxTemp}°F</p>
        <p class="cardTempMin">Low: ${minTemp}°F</p>
        <p class="cardHumidity">Humidity: ${humidity}%</p>
      </div>
    `;

    // Append the HTML for the card to the card container
    cardContainer.insertAdjacentHTML("beforeend", cardTemplate);
  }

  // Update the city-specific information
  const cityTemp = document.querySelector(".cityTemp");
  const cityHumidity = document.querySelector(".cityHumidity");
  const cityWindSpeed = document.querySelector(".cityWindSpeed");

  // Update the content of the elements with city-specific information
  cityTemp.textContent = `Temperature: ${data.list[0].main.temp}°F`;
  cityHumidity.textContent = `Humidity: ${data.list[0].main.humidity}%`;
  cityWindSpeed.textContent = `Wind Speed: ${data.list[0].wind.speed} mph`;
};


