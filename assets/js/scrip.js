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
        cityBtn.textContent = storageCities[i].name;
        historyParent.appendChild(cityBtn)
    }
}
loadHistory();