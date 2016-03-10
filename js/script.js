console.log($)
console.log(Backbone)

// Backbone Router extension:
// 2a. Extending of the backbone route framework by adding out routes. Input is an object with a routes attribute 
// and 5 methods. The routes attribute is a builtin feature and defines the 'string literal' hashpattern that 
//backbone will match on left) with the functions pointing to the methods to be performed (on right). 
//The methods take in as input 
var WeatherRouter = Backbone.Router.extend({
    routes: {
        'now/:lat/:lng': 'handle_Now_page',
        'hour/:lat/:lng': 'handle_Hours_page',
        'days/:lat/:lng': 'handle_Days_page',
        '*default': 'handle_Loading_Page'
    },

    handle_Now_page: function(lat, lng) {
        var wm = new weatherModel()
        wm._generateURL(lat, lng)
        var cv = new NowView(wm)
        wm.fetch()
    },

    handle_Hours_page: function(lat, lng) {
        var wm = new weatherModel()
        wm._generateURL(lat, lng)
        var cv = new HoursView(wm)
        wm.fetch()
    },

    handle_Days_page: function(lat, lng) {
        var wm = new weatherModel()
        wm._generateURL(lat, lng)
        var cv = new DaysView(wm)
        wm.fetch()
    },

    handle_Loading_Page: function() {
        function success_CallBack(positionObject) {
            var lat = positionObject.coords.latitude
            var lng = positionObject.coords.longitude
            window.location.hash = "now" + '/' + lat + '/' + lng
        }

        function failed_CallBack(positionObject) {
        }

        window.navigator.geolocation.getCurrentPosition(success_CallBack, failed_CallBack)
    },

    initialize: function() {
        Backbone.history.start()
    }
})

// Backbone Model Extension:
var weatherModel = Backbone.Model.extend({
    _generateURL: function(lat, lng) {
        this.url = "https://api.forecast.io/forecast/d7c581e2b766cf40745ce91f6d928b84/" + lat + "," + lng + "?callback=?"
    }
})

var NowView = Backbone.View.extend({

    el: '.weather',
    initialize: function(someModel) {
        this.model = someModel
        var boundRender = this._render.bind(this)
        this.model.on('sync', boundRender)
    },

    _render: function() {
        var nowData = this.model.attributes.currently

        var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        var monthName = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


        var now_Info = nowData

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
        HTML_Str_To_DOM += '<p class="otto dateNow">' + fullDate + '</p>'
        HTML_Str_To_DOM += '<p class="otto summaryNow">' + summary + '</p></div>'
        HTML_Str_To_DOM += '</div>'
        HTML_Str_To_DOM += '<div class="rPane alignChildren">'
        HTML_Str_To_DOM += '<div class="thermometer"><div class="tempLevel"><p class="temp">' + temp + '&deg F</p></div></div>'
        HTML_Str_To_DOM += '<div class="rainNow"><div class="rainLevel"><p class="rain">' + rain + '% Humidity</p></div>'
        HTML_Str_To_DOM += '</div>'

        this.el.innerHTML = HTML_Str_To_DOM


        ////////// Setting the temp bar height
        //defining arbitary max values for the temp and the rain gauages for the 100% reference. (myTemp/maxTemp * myHeight/maxHeight) - thankyou for making me finally learn this relationship!
        var maxTemp = 150
        var maxRain = 150
        var thermometer = 300
        var rainHeight = 300
        var redHeight = ((parseInt(temp)) / maxTemp) * thermometer // write a comment here to explain: // the relationship between the temp variables is (cross multiplied) to the reltaionship between the heights of the thermom div and its background 
        document.querySelector('.tempLevel').style.height = redHeight + "px"


        var greenHeight = (parseInt(rain) * rainHeight) * maxRain // write a comment here to explain
        document.querySelector('.rainLevel').style.height = parseInt(rain * 100) + '%'
    }
})


var HoursView = Backbone.View.extend({
    el: '.weather',
    initialize: function(someModel) {
        this.model = someModel
        var boundRender = this._render.bind(this)
        this.model.on('sync', boundRender)
    },
    
    _render: function() {
    	var hoursData = this.model.attributes
        var hourArrayTemp = null
        var hourArrayRain = null


        var hour_summery = hoursData.hourly.summary

        var hour_by_Hour_Array = hoursData.hourly.data

        function View_Constructor(dom_node_element, templateBuilder_fn) {
            this._node_element = dom_node_element
            this._template = templateBuilder_fn

            this.renderHTML = function(input_data) {

                var targetDOM_element = document.querySelector(this._node_element)

                targetDOM_element.innerHTML = this._template(input_data)

            }
        }

        var someHTMLTemplate = null

        function hour_by_Hour_Template(hour_Array) {
            var array_HTML_str = ''


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

            return '<div class="hours"><h3>forcast for today: ' + hour_summery + '</h3><div class="hourBox">' + array_HTML_str + '</div></div>'
        }

        var hourViewInstance = new View_Constructor('.weather', hour_by_Hour_Template)

        hourViewInstance.renderHTML(hour_by_Hour_Array)

        // ////////// Setting the temp bar height
        // //defining arbitary max values for the temp and the rain gauages for the 100% reference. (myTemp/maxTemp * myHeight/maxHeight) - thankyou for making me finally learn this relationship!
        var maxTemp = 150
        var maxRain = 150
        var thermometer = 100
        var rainHeight = 100
        var redHeight = ((parseInt(hourArrayTemp)) / maxTemp) * thermometer  // write a comment here to explain: // the relationship between the temp variables is (cross multiplied) to the reltaionship between the heights of the thermom div and its background 
        document.querySelector('.tempHours').style.height = redHeight + "%"

        // console.log(hourArrayRain)
        var greenHeight = (parseInt(hourArrayRain) * rainHeight) * maxRain // write a comment here to explain
        document.querySelector('.rainHours').style.height = parseInt(hourArrayRain * 100) + '%'
        // console.log(hourArrayTemp)
    }
})

var DaysView = Backbone.View.extend({
    el: '.weather',

    initialize: function(someModel) {
        this.model = someModel
        var boundRender = this._render.bind(this)

        this.model.on('sync', boundRender)
    },


    _render: function() {
        var daysData = this.model.attributes
        var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        var monthName = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        var day_Info = daysData.daily.summary
        var daysArray = daysData.daily.data


        var HTML_Str_To_DOM = ''

        for (var i = 0; i < daysArray.length; i++) {
            var date = new Date(daysArray[i].time * 1000)
            var day = weekday[date.getDay()];
            var month = monthName[date.getMonth()]
            var dayOfMonth = date.getDate()
            var fullYear = date.getFullYear()
            var fullDate = day + ' ' + month + ' ' + dayOfMonth + ' ' + fullYear

            HTML_Str_To_DOM += '<div class="dayObject">'
            HTML_Str_To_DOM += '<div class="dayDate"><h5 class="date">' + fullDate + '</h5></div>'
            HTML_Str_To_DOM += '<div class="dayData">'
            HTML_Str_To_DOM += '<div class="tempMaxHeight"><div class="max">Tmax' + daysArray[i].temperatureMax.toPrecision(2) + '</div></div>'
            HTML_Str_To_DOM += '<div class="tempMinHeight"><div class="min">Tmin' + daysArray[i].temperatureMin.toPrecision(2) + '</div></div>'
            HTML_Str_To_DOM += '<div class="rainHeight"><div class="rainDays">Humidity' + daysArray[i].humidity.toPrecision(2) + '</div></div>'
            HTML_Str_To_DOM += '</div>'
            HTML_Str_To_DOM += '</div>'
        }
        // console.log(HTML_Str_To_DOM)
        this.el.innerHTML = '<div class="week">' + HTML_Str_To_DOM + '</div>'
    }

})

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
    var promise_To_Google = $.getJSON(fullURL)
    promise_To_Google.then(parse_Google_Lat_Long)
}

// from Google geolocator to URL
function parse_Google_Lat_Long(google_Data) {
    var results = google_Data.results
    var google_lat_Long = results[0].geometry.location
    var lat = google_lat_Long.lat
    var long = google_lat_Long.lng
    var route = window.location.hash.substr(1)
    var routeParts = route.split('/')
    window.location.hash = routeParts[0] + '/' + lat + '/' + long
}

// Parameters for Google Geocoder
function _formattedURLParams(paramsObj) {
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

// View Change Function
function viewChanger(clickEvent) {
    var route = window.location.hash.substr(1),
        routeParts = route.split('/'),
        lat = routeParts[1],
        lng = routeParts[2]

    var button_El = clickEvent.target,
        newView = button_El.value
    window.location.hash = newView + '/' + lat + '/' + lng
}

// Render Pages:



// var container = document.querySelector('.weather')
var buttonsContainer = document.querySelector('.buttons')
var searchBar = document.querySelector('input[type=textarea]')
searchBar.addEventListener('keydown', newSearch)
buttonsContainer.addEventListener('click', viewChanger)

var rtr = new WeatherRouter() // (1.a)defining a new instance of the weather construct.(every time the page is refreshed)
// window.location.hash = '' //(1.b)the hash is cleared to remove previouse location