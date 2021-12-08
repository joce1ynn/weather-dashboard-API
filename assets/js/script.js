// --------------------------1. save search history-------------------------------
var cityInput = $("#city-input");
var searchBtn = $(".btn");
var searchHistory = $(".list-group");

// convert city strings to array, also load searched cities
var cityArray = JSON.parse(localStorage.getItem("savedCity")) || [];

function savedCity() {
  // prevent page from refreshing
  event.preventDefault();

  // create array of searched cities
  cityInput = $("#city-input").val();
  cityArray.push(cityInput);

  // convert city object into strings
  localStorage.setItem("savedCity", JSON.stringify(cityArray));

  // empty repeated city array elements and city weather history
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

// --------------2. connect to OpenWeather API---------------
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
          displayCurrentWeather(data);
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

  var forecastUrl ="https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat +"&lon=" + cityLon +"&exclude=minutely,hourly&appid=a23926b23cbd7c1d7c67adf9564cfed5";

  fetch(forecastUrl).then(function (response) {
    response.json().then(function (data) {
      displayForecast(data);
    });
  });
};

// -----------------3. display current weather---------------------------
var city = $("#city");
var today = $("#today");
var currentWeatherEl = $("#current-weather");

var displayCurrentWeather = function (data) {
  currentWeatherEl.empty();
  city.text(data.name);
  today.text(" (" + moment().format("MM/DD/YYYY") + ") ");
  var currentIcon = $("<img src=http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png>").addClass("icon");
  var currentTemp = $("<p>").text("Temp: " + ((data.main.temp - 273.15) * 1.8 + 32).toFixed() + "°F");
  var currentWind = $("<p>").text("Wind: " + data.wind.speed + " MPH");
  var currentHumidity = $("<p>").text("Humidity: " + data.main.humidity + "%");
  $("#current-tab").addClass("current-card");

  city.append(today, currentIcon);
  currentWeatherEl.append(city, currentTemp, currentWind, currentHumidity);
};

// -----------------4. display 5-day forecast---------------------------
var forecast = $("#forecast");

var displayForecast = function (data) {
  var forecastTitle = $("#future-dates");
  forecastTitle.text("5-Day Forecast:");

  // 4.1 get uvi
  function uviColor() {

    var uviEl = data.current.uvi;
    var uvIndex = $("<span>").text(uviEl);
    var uvi = $("<p>").text("UV Index: ");

    if (uviEl >= 0 && uviEl <= 2) {uvIndex.addClass("green uvi");
    } else if (uviEl > 2 && uviEl <= 5) {uvIndex.addClass("yellow uvi");
    } else if (uviEl > 5 && uviEl <= 7) {uvIndex.addClass("orange uvi");
    } else if (uviEl > 7 && uviEl <= 10) {uvIndex.addClass("red uvi");
    } else {uviEl.addClass("purple uvi");}

    uvIndex.appendTo(uvi);
    currentWeatherEl.append(uvi);
  }
  uviColor();

 // 4.2 loop forecast card for 5 days
  forecast.empty();
  for (var i = 1; i < 6; i++) {
    var date = $("<p>").text(moment(data.daily[i].dt * 1000).format("MM/DD/YYYY"));
    var forecastIcon = $("<img src=http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png>").addClass("icon");
    var forecastTemp = $("<p>").text("Temp: " + ((data.daily[i].temp.day - 273.15) * 1.8 + 32).toFixed() + "°F");
    var forecastWind = $("<p>").text("Wind: " + data.daily[i].wind_speed + " MPH");
    var forecastHumidity = $("<p>").text("Humidity: " + data.daily[i].humidity + "%");
    var forecastCard = $("<div>").addClass("card col-md-auto");

    forecastCard.append(
      date,
      forecastIcon,
      forecastTemp,
      forecastWind,
      forecastHumidity
    );

    forecast.append(forecastCard);
  }
};


//---------------5.display city weather when clicking searched city-------------
$('.list-group').on('click', 'li', function() {
  cityInput = $(this).text();
  getCurrentWeather();
});

