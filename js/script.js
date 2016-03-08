console.log($)

// CONTROLLER
function router(){
	var route = window.location.hash.substr(1),
		routeParts = route.split('/'),
		viewType = routeParts[0],
		lat = routeParts[1],
		lng = routeParts[2]

	console.log(route)
	console.log(viewType)
	console.log(lat)
	console.log(lng)

	if ( viewType === '' ) {
		handle_Loading_Page(lat, lng)
	}

	if ( viewType === 'now') {
		handle_Now_Data(lat, lng)
	}

	if ( viewType === 'hour' ) {
		handle_Hour_Data(lat, lng)
	}

	if ( viewType === 'days' ) {
		handle_Days_Data(lat, lng)
	}
}

//  backbone extension to router
var WeatherRouter = Backbone.Router.extend({

	routes: {
		'now/:lat/:lng': handle_Now_Data,
		'hours/:lat/:lng': handle_Hours_Data,
		'days/:lat/:lng': handle_Days_Data,
			}
})

//  View Changer Module
function viewChanger(clickEvent) {
	var route = window.location.hash.substr(1),
		routeParts = route.split( '/' ),
		lat = routeParts[1],
		lng = routeParts[2]

		var button_El = clickEvent.target,
			newView = button_El.value
		window.location.hash = newView + '/' + lat + '/' + lng
}

// Requesting Data
function handle_Now_Data(lat, lng) {
	console.log(lat)
	var promise = make_Weather_Promise(lat, lng)
	promise.then(render_Now_Weather)
}

function handle_Hours_Data(lat, lng) {
	var promise = make_Weather_Promise(lat, lng)
	promise.then(render_Hours_Weather)
}

function handle_Days_Data(lat, lng) {
	var promise = make_Weather_Promise(lat, lng)
	promise.then(render_Days_Weather)
}

//Default Landing Page
function handle_Loading_Page() {
	function success_CallBack(positionObject) {
		console.log(positionObject)
		var lat = positionObject.coords.latitude
		var lng = positionObject.coords.longitude
		window.location.hash = "now" + '/' + lat + '/' + lng
	}

	function failed_CallBack(positionObject){
		console.log(positionObject)
	}

	window.navigator.geolocation.getCurrentPosition(success_CallBack, failed_CallBack)
}

// Promise Function
function make_Weather_Promise(lat, lng) {
	var forcast_URL = baseURL + '/' + apiKey + '/' + lat + '/' + lng  + '?callback=?'
 	var promise = $.getJSON(forcast_URL)
 	return promise
}

// Render Pages
function render_Now_Weather(nowData) {
	console.log(nowData)
}

function render_Hours_Weather(hourData) {
	console.log(hourData)
}

function render_Days_Weather(daysData) {
	console.log(daysData)
}

// Search Function
function newSearch(keyEvent) {
	if (keyEvent.keyCode === 13) {
		search = searchBar.value
		geocoderRequest(search)
	}
}

// Google Geocoder Request
function geocoderRequest(location) {
	var params = {
		address: location
		}
	var baseURL = 'https://maps.googleapis.com/maps/api/geocode/json'
	var fullURL = baseURL + _formattedURLParams(params)
	console.log(fullURL)
	var promise_To_Google = $.getJSON(fullURL)
	promise_To_Google.then(parse_Google_Lat_Long)
}

// from Google geolocator to URL
function parse_Google_Lat_Long(google_Data) {
    var results = google_Data.results
    var google_lat_Long = results[0].geometry.location
    console.log(google_lat_Long)
    var lat = google_lat_Long.lat
    var long = google_lat_Long.lng
    window.location.hash = '/' + lat + '/' + long
}

// Parameters for Google Geocoder
function _formattedURLParams(paramsObj) {
    console.log(paramsObj)
    var paramString = ''
    for (var paramKey in paramsObj) {
        paramsObjValue = paramsObj[paramKey]
        paramString = '&' + paramKey + '=' + paramsObjValue
    }
    var splitString = paramString.split(' ')
    var joinString = splitString.join('+')
    var returnString = joinString.substr(1)
    return '?' + returnString
}

var apiKey = 'd7c581e2b766cf40745ce91f6d928b84'
var baseURL = 'https://api.forecast.io/forecast'
var container = document.querySelector('.weather')
var buttonsContainer = document.querySelector('.buttons')
var searchBar = document.querySelector('input[type=search]')

searchBar.addEventListener('keydown', newSearch)
window.addEventListener('hashchange', router)
buttonsContainer.addEventListener('click', viewChanger)
router()