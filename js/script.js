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
		handle_Hours_Data(lat, lng)
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
	var forcast_URL = baseURL + '/' + apiKey + '/' + lat + ',' + lng  + '?callback=?'
 	var promise = $.getJSON(forcast_URL)
 	return promise
}

// Render Pages
function render_Now_Weather(nowData) {
	
	var weekday = new Array(7);
	    weekday[0] = "Sunday";
	    weekday[1] = "Monday";
	    weekday[2] = "Tuesday";
	    weekday[3] = "Wednesday";
	    weekday[4] = "Thursday";
	    weekday[5] = "Friday";
	    weekday[6] = "Saturday";
	    
	var monthName = new Array(7);
	    monthName[0] = "January";
	    monthName[1] = "Febuary";
	    monthName[2] = "March";
	    monthName[3] = "April";
	    monthName[4] = "May";
	    monthName[5] = "June";
	    monthName[6] = "July";
	    monthName[7] = "August";
	    monthName[8] = "September";
	    monthName[9] = "October";
	    monthName[10] = "November";
	    monthName[11] = "December";

	var now_Info = nowData.currently
	var temp = now_Info.temperature
	var date_Info = now_Info.time
	var date = new Date(date_Info)
	var day = weekday[date.getDay()];
	var month = monthName[date.getMonth()]
	var	dayOfMonth = date.getDate()
	var fullYear = date.getFullYear()
	var fullDate = day + ' ' + month + ' ' + dayOfMonth + ' ' + fullYear
	var rain = now_Info.precipProbability
	var summary = now_Info.summary
	var HTML_Str_To_DOM = '<div class="now alignChildren"><div class="data"><div class="tempLevel"></div><p class="date">'
		HTML_Str_To_DOM += fullDate + '</p>'
		HTML_Str_To_DOM += '<p class="temp">'+ temp + '</p>'
		HTML_Str_To_DOM  += '<div class="rainLevel">' + rain + '</div>'
		HTML_Str_To_DOM += '<div class="summery">' + summary + '</div></div></div>'

	console.log(day)

    ////////// Setting the temp bar height
    // var container = document.querySelector('.weatherOutput').style.height = '500px'
    // var tempLevel = document.querySelector('.tempLevel').style.height = parseInt( temp ) / 100 *  parseInt( container )  + 'px'
    // var rainLevel = document.querySelector('.rainLevel').style.height = parseInt(rain)

	console.log(HTML_Str_To_DOM)

    return container.innerHTML = HTML_Str_To_DOM
}

function render_Hours_Weather(hoursData) {

    console.log(hoursData.hourly)

    var hour_summery = hoursData.hourly.summary
    	console.log(hour_summery)

    var hour_by_Hour_Array = hoursData.hourly.data

    function View_Constructor(dom_node_element, templateBuilder_fn) {
        this._node_element = dom_node_element
        this._template = templateBuilder_fn

        this.renderHTML = function(input_data) {

            var targetDOM_element = document.querySelector(this._node_element)

            targetDOM_element.innerHTML = this._template(input_data)

            console.log(targetDOM_element)
        }
    }

    var someHTMLTemplate = null

    function hour_by_Hour_Template(hour_Array) {
        var array_HTML_str = ''
        console.log(hour_Array)
        var hour = 0
        // for (var i = 0; i < hour_Array.length; i++) {

            for (var i = 1; i < hour_Array.length; i++) {
            var fullDate = new Date(hour_Array[i].time)
		   
                hour = hour_Array[i].time

        console.log(hour)
           
            var hour_Box = '<p>Date: ' + hour + '</p>'
                hour_Box += '<p>T: ' + hour_Array[i].temperature + 'F</p>'
                hour_Box += '<p> R: ' + hour_Array[i].precipProbability + '</p>'
                array_HTML_str += '<div class="hourContainer">' + hour_Box + '</div>'
            
                // ////////// Setting the temp bar height
                var tempLevel = document.querySelector('.tempLevel').style.height = parseInt(hour_Array[i].temperature)+"px";
                var rainLevel = document.querySelector('.rainLevel').style.height = parseInt(hour_Array[i].precipProbability) * 100 + 'px';

            }

        // }
        return '<div class="hour"><h3>Today will be: ' +  hour_summery +'</h3>'+ array_HTML_str+'</div>'
    }

    var hourViewInstance = new View_Constructor('.weatherOutput', hour_by_Hour_Template)
    
    hourViewInstance.renderHTML(hour_by_Hour_Array)
}

function render_Days_Weather(daysData) {
		
	var weekday = new Array(7);
	    weekday[0] = "Sunday";
	    weekday[1] = "Monday";
	    weekday[2] = "Tuesday";
	    weekday[3] = "Wednesday";
	    weekday[4] = "Thursday";
	    weekday[5] = "Friday";
	    weekday[6] = "Saturday";
	    
	var monthName = new Array(7);
	    monthName[0] = "January";
	    monthName[1] = "Febuary";
	    monthName[2] = "March";
	    monthName[3] = "April";
	    monthName[4] = "May";
	    monthName[5] = "June";
	    monthName[6] = "July";
	    monthName[7] = "August";
	    monthName[8] = "September";
	    monthName[9] = "October";
	    monthName[10] = "November";
	    monthName[11] = "December";

	var day_Info = daysData.daily.summary
	var daysArray = daysData.daily.data


	var HTML_Str_To_DOM = ''

	for (var i = 0; i < daysArray.length; i++) {
		var date = new Date(daysArray[i].time)
			console.log(date)
		var day = weekday[date.getDay()];
		var month = monthName[date.getMonth()]
		var	dayOfMonth = date.getDate()
		var fullYear = date.getFullYear()
		var fullDate = day + ' ' + month + ' ' + dayOfMonth + ' ' + fullYear

		HTML_Str_To_DOM += '<div class="days">'
		HTML_Str_To_DOM += 	'<h6 class="date">' + fullDate + '</h6>'
		HTML_Str_To_DOM += 	'<div class="max">'+ daysArray[i].temperatureMax + '</div>'
		HTML_Str_To_DOM += 	'<div class="min">' + daysArray[i].temperatureMin + '</div>'
		HTML_Str_To_DOM += 	'<div class="rain">' + daysArray[i].precipProbability + '</div></div>'
	}

	console.log(HTML_Str_To_DOM)
	return container.innerHTML = HTML_Str_To_DOM
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

function convertMS(ms) {
var d, h, m, s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;
return { d: d, h: h, m: m, s: s };
};

searchBar.addEventListener('keydown', newSearch)
window.addEventListener('hashchange', router)
buttonsContainer.addEventListener('click', viewChanger)
router()