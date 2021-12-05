// search for a city, show weather condition, forecast, and search history

// weather conditon: city name, date, icon, temperature, humidity, wind speed, UV

// UV with color: favorable, moderate, or severe

// forecast: date, icon, temp, wind, humidity

// search history: show weather tab

// --------------------------1. save search history-------------------------------
var searchTab = $(".form-group");
var cityInput = $("#city-input");
var searchBtn = $(".btn");
var searchHistory = $(".list-group");

// convert city strings to array, also load searched cities
var cityArray = JSON.parse(localStorage.getItem("savedCity")) || [];

function savedCity() {
  event.preventDefault();

  // create array of searched cities
  cityInput = $("#city-input").val();
  cityArray.push(cityInput);

  // convert city object into strings
  localStorage.setItem("savedCity", JSON.stringify(cityArray));

  // empty repeated city array elements
  searchHistory.empty();

  displayList();
  getCurrentWeather();
}

// make searched cities into a list of cities, and append to HTML
function displayList() {
  for (var i = 0; i < cityArray.length; i++) {
    var cityList = $("<li>").addClass("list-group-item").text(cityArray[i]);
    searchHistory.append(cityList);
  }
}

displayList();
searchBtn.click(savedCity);

// ------------------2. connect to OpenWeather API---------------
// get current weather API
function getCurrentWeather() {
  var currentUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityInput +
    "&appid=a23926b23cbd7c1d7c67adf9564cfed5";

  fetch(currentUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data); 
          // displayCurrentWeather();
          getForecast(data);
        });
      } else {
        alert("Error: City Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
}

// get 5-day forecast API
var getForecast = function (data) {
  var cityLat = data.coord.lat;
  var cityLon = data.coord.lon;

  var forecastUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    cityLat +
    "&lon=" +
    cityLon +
    "&exclude=current,minutely,hourly&appid=a23926b23cbd7c1d7c67adf9564cfed5";

  fetch(forecastUrl).then(function (response) {
    response.json().then(function (data) {
      console.log(data); 
      // displayForecast();
    });
  });
};
