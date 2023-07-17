// AS A traveler
// I WANT to see the weather outlook for multiple cities
// SO THAT I can plan a trip accordingly

// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

var apiKey= '78a9d52ef2c9fc05aca064bff26c1e28'
var searchHistory= JSON.parse(localStorage.getItem('searchHistory')) || []
var searchButton = document.getElementById('search-button')


displaySearchHistory()

function searchCity(){
    var cityInput=document.getElementById('user-text-box').value.trim()
    if (cityInput==''){
        alert('Please enter a city name')
    }
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q='+cityInput+'&units=imperial&appid='+apiKey
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        displayWeather(data)
        weatherData= data
        addSearchHistory(cityInput)
        displaySearchHistory()
        displayWeatherScreen()
        fiveDayForecast()
      })
      .catch(error => {
        console.error('Error:', error)
      })
} //pulls current weather data for the user entered city

function displayWeatherScreen(){
    document.getElementById('selected-city-main').classList.remove('hidden')
}

function addSearchHistory(cityName){
//  var previousHistory= getLocalStorage('searchHistory')
 searchHistory.push(cityName) //adds search to searchHistory array
 localStorage.setItem('searchHistory', JSON.stringify(searchHistory)) //sets searchHistory to localStorage
}

function displaySearchHistory (){
    var searchHistoryList = document.getElementById('search-history-list')
    searchHistoryList.innerHTML = ''
    var searchHistory= getLocalStorage('searchHistory')
    

    if (searchHistory) {
        searchHistory.reverse()
        for (var i = 0; i < searchHistory.length; i++) {
          var city = searchHistory[i]
          var li = document.createElement('li')
          li.textContent = city
          li.addEventListener('click', function () {
          document.getElementById('user-text-box').value= this.textContent //this enters the correct city back into the previous search box instead of whatever was in there when the previous option was clicked
          searchCity(this.textContent)
          })
          searchHistoryList.appendChild(li)
    }
  }
}

function getLocalStorage(searchHistory) {
    var data= localStorage.getItem(searchHistory)
    return JSON.parse(data)
}

function displayWeather(data) {
    var cityName= data.city.name
    var cityTemp= data.list[0].main.temp
    var cityHumidity =data.list[0].main.humidity
    var cityWind= data.list[0].wind.speed

 document.getElementById('current-name').innerText='City: '+cityName
 document.getElementById('current-temp').innerText= 'Temperature: '+cityTemp+" F"
 document.getElementById('current-humidity').innerText='Humidity: '+cityHumidity+ '%'
 document.getElementById('current-wind').innerText='Wind: '+cityWind+' mph'
}

function fiveDayForecast() {
    for (var i = 0; i < 5; i++) {
      var fiveDayForecastCurrent = document.getElementById('five-day-' + i)
      var fiveDayForecast = weatherData.list.slice(1, 6)//exclude current day, day 1-5 TODO modify so it pulls different days, is currently pulling next in the array which is the same day in 3 hour intervals
      var date= new Date(fiveDayForecast[i].dt * 1000) //I found this online, it uses the .dt and later .toDateString to compilte a date from the new date object created here
      var icon = fiveDayForecast[i].weather[0].icon
      var temp = fiveDayForecast[i].main.temp
      var wind = fiveDayForecast[i].wind.speed
      var humidity = fiveDayForecast[i].main.humidity

      
      fiveDayForecastCurrent.querySelector('p.date').innerText= date.toDateString()
      fiveDayForecastCurrent.querySelector('img').setAttribute("src", 'https://openweathermap.org/img/wn/'+icon+'@2x.png')
      fiveDayForecastCurrent.querySelector('p.temp').innerText = 'Temp: ' + temp + ' F'
      fiveDayForecastCurrent.querySelector('p.wind').innerText = 'Wind: ' + wind + ' mph'
      fiveDayForecastCurrent.querySelector('p.humidity').innerText = 'Humidity: ' + humidity + '%'
    }
  }


searchButton.addEventListener('click', searchCity)
