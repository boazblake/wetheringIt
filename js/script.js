console.log($)
console.log(Backbone)

//  View Changer Module
function viewChanger(clickEvent) {
    var route = window.location.hash.substr(1),
        routeParts = route.split('/'),
        lat = routeParts[1],
        lng = routeParts[2]

    var button_El = clickEvent.target,
        newView = button_El.value
    console.log(newView)
    window.location.hash = newView + '/' + lat + '/' + lng
}

// Promise Function
function make_Weather_Promise(lat, lng) {
    var forcast_URL = baseURL + '/' + apiKey + '/' + lat + ',' + lng + '?callback=?'
    var promise = $.getJSON(forcast_URL)
    return promise
}

// Render Pages
function render_Now_Weather(nowData) {
	console.log(nowData)

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
    var temp = now_Info.temperature.toPrecision(2)
    var date_Info = now_Info.time
    var date = new Date(date_Info * 1000)
    var day = weekday[date.getDay()];
    var month = monthName[date.getMonth()]
    var dayOfMonth = date.getDate()
    var fullYear = date.getFullYear()
    var fullDate = day + ' ' + month + ' ' + dayOfMonth + ' ' + fullYear
    var rain = now_Info.humidity.toPrecision(2)
    var summary = now_Info.summary
    var HTML_Str_To_DOM = '<div class="lPane">'
        HTML_Str_To_DOM +=      '<p class="dateNow">' + fullDate + '</p>'
        HTML_Str_To_DOM +=       '<p class="summaryNow">' + summary + '</p></div>'
        HTML_Str_To_DOM += '</div>'
        HTML_Str_To_DOM += '<div class="rPane alignChildren">'
        HTML_Str_To_DOM +=    '<div class="thermometer"><div class="tempLevel"><p class="temp">' + temp + '&deg F</p></div></div>'
        HTML_Str_To_DOM +=    '<div class="rainNow"><div class="rainLevel"><p class="rain">' + rain + '% Humidity</p></div>'
        HTML_Str_To_DOM +=  '</div>'

    container.innerHTML = HTML_Str_To_DOM

    console.log(day)

    ////////// Setting the temp bar height
    //defining arbitary max values for the temp and the rain gauages for the 100% reference. (myTemp/maxTemp * myHeight/maxHeight) - thankyou for making me finally learn this relationship!
    var maxTemp = 150
    var maxRain = 150
    var thermometer = 300
    var rainHeight = 300
    var redHeight = ((parseInt(temp)) / maxTemp) * thermometer  // write a comment here to explain: // the relationship between the temp variables is (cross multiplied) to the reltaionship between the heights of the thermom div and its background 
    document.querySelector('.tempLevel').style.height = redHeight + "px"
    console.log(rain)
    console.log(parseInt(temp))
    console.log(temp)
    console.log(maxTemp)
    console.log(redHeight)
    
    console.log(rain)
    var greenHeight = (parseInt(rain) * rainHeight) * maxRain // write a comment here to explain
    document.querySelector('.rainLevel').style.height = parseInt(rain * 100) + '%'
    console.log(temp)
}

function render_Hours_Weather(hoursData) {
    var hourArrayTemp = null
    var hourArrayRain = null
    console.log(hoursData)

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


        for (var i = 1; i < 25; i++) {
            var fullDate = new Date(hour_Array[i].time * 1000)
            hour = fullDate.getHours()
            var hourArrayTemp = hour_Array[i].temperature.toPrecision(2)
            var hourArrayRain = hour_Array[i].humidity.toPrecision(2)
            var hour_Box = '<p class="hed">' + hour + ':00' + '</p>'
            hour_Box += '<div class="data"><div class="tempWrapper"><p class="tempHours"> ' + hourArrayTemp + '&deg</p></div>'
            hour_Box += '<div class="rainWrapper"><p class="rainHours">' + hourArrayRain + '%</p></div></div>'
            array_HTML_str += '<div class="hourContainer">' + hour_Box + '</div>'
        }

        return '<div class="hours"><h3>Today will be: ' + hour_summery + '</h3>' + array_HTML_str + '</div>'
    }

    var hourViewInstance = new View_Constructor('.weather', hour_by_Hour_Template)

    hourViewInstance.renderHTML(hour_by_Hour_Array)

    // ////////// Setting the temp bar height
    // //defining arbitary max values for the temp and the rain gauages for the 100% reference. (myTemp/maxTemp * myHeight/maxHeight) - thankyou for making me finally learn this relationship!
    // var maxTemp = 150
    // var maxRain = 150
    // var thermometer = 100
    // var rainHeight = 100
    // var redHeight = ((parseInt(hourArrayTemp)) / maxTemp) * thermometer  // write a comment here to explain: // the relationship between the temp variables is (cross multiplied) to the reltaionship between the heights of the thermom div and its background 
    // document.querySelector('.tempHours').style.height = '2%' //redHeight + "%"
    
    // console.log(hourArrayRain)
    // var greenHeight = (parseInt(hourArrayRain) * rainHeight) * maxRain // write a comment here to explain
    // document.querySelector('.rainHours').style.height = '1.4%'//parseInt(hourArrayRain * 100) + '%'
    // console.log(hourArrayTemp)
   }

function render_Days_Weather(daysData) {
    console.log(daysData)

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
        var date = new Date(daysArray[i].time * 1000)
        console.log(date)
        var day = weekday[date.getDay()];
        var month = monthName[date.getMonth()]
        var dayOfMonth = date.getDate()
        var fullYear = date.getFullYear()
        var fullDate = day + ' ' + month + ' ' + dayOfMonth + ' ' + fullYear
        
        HTML_Str_To_DOM += 	'<div class="dayObject">'
        HTML_Str_To_DOM +=    '<div class="dayDate"><h5 class="date">' + fullDate + '</h5></div>'
        HTML_Str_To_DOM +=    '<div class="dayData">'
        HTML_Str_To_DOM +=        '<div class="tempMaxHeight"><div class="max">Tmax' + daysArray[i].temperatureMax.toPrecision(2) + '</div></div>'
        HTML_Str_To_DOM +=        '<div class="tempMinHeight"><div class="min">Tmin' + daysArray[i].temperatureMin.toPrecision(2) + '</div></div>'
        HTML_Str_To_DOM +=        '<div class="rainHeight"><div class="rainDays">Humidity' + daysArray[i].humidity.toPrecision(2) + '</div></div>'
        HTML_Str_To_DOM +=    '</div>'
        HTML_Str_To_DOM += 	  '</div>'
    }
    // console.log(HTML_Str_To_DOM)
    container.innerHTML = '<div class="week">' + HTML_Str_To_DOM + '</div>'
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
    var route = window.location.hash.substr(1)
    var routeParts = route.split('/')
    console.log(routeParts[0])
    window.location.hash = routeParts[0] + '/' + lat + '/' + long
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

//  backbone extension to router
var WeatherRouter = Backbone.Router.extend({
    routes: {
        'now/:lat/:lng': 'handle_Now_Data',
        'hour/:lat/:lng': 'handle_Hours_Data',
        'days/:lat/:lng': 'handle_Days_Data',
        '*default': 'handle_Loading_Page'
    },


    handle_Now_Data: function(lat, lng) {
        var promise = make_Weather_Promise(lat, lng)
        promise.then(render_Now_Weather)
    },

    handle_Hours_Data: function(lat, lng) {
        var promise = make_Weather_Promise(lat, lng)
        promise.then(render_Hours_Weather)
    },

    handle_Days_Data: function(lat, lng) {
        var promise = make_Weather_Promise(lat, lng)
        promise.then(render_Days_Weather)
    },

    handle_Loading_Page: function() {
        function success_CallBack(positionObject) {
            console.log(positionObject)
            var lat = positionObject.coords.latitude
            var lng = positionObject.coords.longitude
            window.location.hash = "now" + '/' + lat + '/' + lng
        }

        function failed_CallBack(positionObject) {
            console.log(positionObject)
        }

        window.navigator.geolocation.getCurrentPosition(success_CallBack, failed_CallBack)
    }
})

var apiKey = 'd7c581e2b766cf40745ce91f6d928b84'
var baseURL = 'https://api.forecast.io/forecast'
var container = document.querySelector('.weather')
var buttonsContainer = document.querySelector('.buttons')
var searchBar = document.querySelector('input[type=search]')


searchBar.addEventListener('keydown', newSearch)
    // window.addEventListener('hashchange', router)
buttonsContainer.addEventListener('click', viewChanger)
var rtr = new WeatherRouter()
Backbone.history.start()
