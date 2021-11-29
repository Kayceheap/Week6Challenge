// this is my api key 563792f09223bd0da18c8df2a8d545fc
// this is my fech url https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
var showCityDetails = function (city) {
    var cityDetailsParent = document.querySelector("#city-details")
    while (cityDetailsParent.hasChildNodes()) {
        cityDetailsParent.removeChild(cityDetailsParent.firstChild)
    }
    var cityNameEl = document.createElement("h2")
    cityNameEl.textContent = city.name
    cityDetailsParent.appendChild(cityNameEl)
    var fetchurl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + city.lat + "&lon=" + city.long + "&units=imperial&appid=563792f09223bd0da18c8df2a8d545fc";
    fetch(fetchurl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var tempEl = document.createElement("p");
            tempEl.textContent = "Temp: " + data.current.temp + "F";
            cityDetailsParent.appendChild(tempEl);
            var windEl = document.createElement("p");
            windEl.textContent = "Wind: " + data.current.wind_speed + "mph";
            cityDetailsParent.appendChild(windEl);
            var humidityEl = document.createElement("p");
            humidityEl.textContent = "Humidity: " + data.current.humidity + "%";
            cityDetailsParent.appendChild(humidityEl);
            var uvindexEl = document.createElement("p");
            uvindexEl.textContent = "UV Index: " + data.current.uvi;
            cityDetailsParent.appendChild(uvindexEl);
            // now add the 5-day forecast
            var forecastParent = document.querySelector("#forecastParent");
            while (forecastParent.hasChildNodes()) {
                forecastParent.removeChild(forecastParent.firstChild)
            }
            for (i = 0; i < 5; i++) {


                var day1 = document.createElement("div");
                var day1Date = moment.unix(data.daily[i+1].dt).format("MM/DD/YYYY")
                forecastParent.appendChild(day1);
                var day1DateEl = document.createElement("p");
                day1DateEl.textContent = day1Date;
                day1.appendChild(day1DateEl);
                var weatherEl = document.createElement('p');
                weatherEl.textContent = data.daily[i+1].clouds;
                day1.appendChild(weatherEl);
                tempEl = document.createElement("p");
                tempEl.textContent = "Temp: " + data.daily[i+1].temp.max + " F";
                day1.appendChild(tempEl);
                windEl = document.createElement("p");
                windEl.textContent = "Wind: " + data.daily[i+1].wind_speed + " MPH";
                day1.appendChild(windEl);
                humidityEl = document.createElement("p");
                humidityEl.textContent = "Humidity: " + data.daily[i+1].humidity + " %";
                day1.appendChild(humidityEl);
            }

        })
}
var searchCity = document.querySelector("#searchBtn");
var loadCities = function () {
    var cities = localStorage.getItem("cityHistory")
    if (cities === null) {
        cities = [];

    }
    else {
        cities = JSON.parse(cities)
    }
    return cities;
}
var saveCity = function (city) {
    var cities = loadCities();
    cities.unshift(city);
    if (cities.length > 10) {
        cities.splice(10)
    }
    localStorage.setItem("cityHistory", JSON.stringify(cities))
}

searchCity.addEventListener("click", function (event) {
    event.preventDefault();
    var inputCity = document.querySelector("#city-input").value;

    var fetchString = "https://dev.virtualearth.net/REST/v1/Locations/US/" + inputCity + "/?key=AovCYtswu4CycKE80Kb5y7hirY12vuOXsl8AJu3sC9jUZtLOuoZQtIoWh7q2ujoi"
    fetch(fetchString)
        .then(function (response) {
            return response.json();

        })
        .then(function (data) {
            console.log(data.resourceSets[0].resources[0].geocodePoints[0].coordinates);
            var city = {
                "name": inputCity,
                "lat": data.resourceSets[0].resources[0].geocodePoints[0].coordinates[0],
                "long": data.resourceSets[0].resources[0].geocodePoints[0].coordinates[1]
            };
            saveCity(city);
            showCityDetails(city)
            loadHistory();
        })

})

var loadHistory = function () {


    var historyParent = document.querySelector("#search-history")
    while (historyParent.hasChildNodes()) {
        historyParent.removeChild(historyParent.firstChild)
    }
    var storageCities = loadCities()
    for (var i = 0; i < storageCities.length; i++) {

        var cityBtn = document.createElement("button")
        $(cityBtn).addClass("historyBtn");
        cityBtn.textContent = storageCities[i].name;
        cityBtn.city = storageCities[i];
        historyParent.appendChild(cityBtn)
        cityBtn.addEventListener("click", function (event) {
            showCityDetails(event.target.city)
        })

    }
}
loadHistory();