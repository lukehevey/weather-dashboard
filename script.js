// Variables
var searchInput = document.getElementById("search-input")
var searchBtn = document.getElementById("search-btn")
var cityNameEl = document.getElementById("city-name")
var temperatureEl = document.getElementById("temp")
var humidityEl = document.getElementById("humid")
var windSpeedEl = document.getElementById("wind")
var fiveDayEl = document.getElementById("five-forecast")
var weatherDayEl = document.getElementById("current-weather")
var searchHistoryEl = document.getElementById("search-history")
var fiveCardsEl = document.getElementById("five-cards")
var IconEl = document.querySelector('.icon')


// Display history function is called on page load
displayHistory()

searchBtn.addEventListener('click', formSubmit)
// The formSubmit function is called on click of search button
function formSubmit(evt) {
    if (!searchInput.value) {
        return
    }
    evt.preventDefault()
    var city = searchInput.value.trim()
    cityFetch(city)
    searchInput.value = ""
}

// The recently searched city is saved to local storage
function saveCity(city) {
    var pastSearches = JSON.parse(localStorage.getItem('city')) || []
    if (!pastSearches.includes(city)){
        pastSearches.push(city)
        localStorage.setItem('city', JSON.stringify(pastSearches))
    }

    
}

// The city is fetched from the open weather API 
function cityFetch(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=edb70a0e0ba7f9d39d09f54d702e76c0&units=imperial";
    fetch(queryURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            saveCity(data.name)
            displayWeather(data)
            forecastFetch(data.coord.lat, data.coord.lon)
            displayHistory()
        })

}

// The history is displayed as buttons and made sure that there aren't any duplicates
function displayHistory() {
    var pastSearches = JSON.parse(localStorage.getItem('city')) || []
    searchHistoryEl.innerHTML = ""
    for (let i = 0; i < pastSearches.length; i++) {
        var historyBtn = document.createElement('button')
        historyBtn.textContent = pastSearches[i]
        historyBtn.addEventListener('click', function(event){
            event.preventDefault()
            console.log(pastSearches[i])
            cityFetch(pastSearches[i])
        })
        searchHistoryEl.append(historyBtn)
        historyBtn.classList.add('btn')
        historyBtn.classList.add('btn-md')
        historyBtn.classList.add('btn-secondary')
        historyBtn.classList.add('mb-1')
    }
 }

// The weather for current day is displayed on the page
function displayWeather(data) {
    console.log(data)
    cityNameEl.textContent = data.name + " " + new Date(data.dt * 1000).toLocaleDateString()
    temperatureEl.textContent = "Temperature: " + data.main.temp + "°F";
    windSpeedEl.textContent = "Wind: " + data.wind.speed + " MPH";
    humidityEl.textContent = "Humidity: " + data.main.humidity + " %"

}
// Function for setting the forecast image
function getImage(icon) {
    IconEl.setAttribute('src', icon)
    }

const iconURL = "https://openweathermap.org/img/wn/"
var icon;

// Function that uses the API with lat and lon in order to get the five day forecast
function forecastFetch(lat, lon) {
    var URL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=edb70a0e0ba7f9d39d09f54d702e76c0&units=imperial"
    fetch(URL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data)
            fiveCardsEl.innerHTML = ""
            for (var i = 0; i < data.list.length; i++) {
                if (data.list[i].dt_txt.includes("00:00:00")) {

                    var card = document.createElement("div")
                    var date = data.list[i].dt_txt
                    var dateFormat = moment(date).format('MM/DD/YYYY') 
                    icon = iconURL + data.list[i].weather[0].icon + '.png'
                    var iconForm = document.createElement("img")
                    var temp = document.createElement("p")
                    var wind = document.createElement("p")
                    var humid = document.createElement("p")


                    dateFormat.textContent = data.list[i].dt_txt
                    card.append(dateFormat)

                    console.log(icon)
                    iconForm.setAttribute('src', icon)
                    card.append(iconForm)
                    
                   
                    temp.textContent = "Temp: " + data.list[i].main.temp + "°F"
                    card.append(temp)

                    wind.textContent = "Wind: " + data.list[i].wind.speed + " MPH"
                    card.append(wind)

                    humid.textContent = "Humidity: " + data.list[i].main.humidity + "%"
                    card.append(humid)

                    fiveCardsEl.append(card)
                    card.classList.add("icon")
                    card.classList.add("card")
                    card.classList.add("row")
                    card.classList.add("col-md-2")
                    card.classList.add("text-white")
                    card.classList.add("bg-secondary")
                    card.classList.add("m-3")
                }
                
            } 
        })
        .then(() => {
            getImage(icon)
        })
}


