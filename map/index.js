var location_perm_button = document.getElementById("location_perm_button")

location_perm_button.onclick = function() {
  var startPos;
  var geoSuccess = function(position) {
    // Do magic with location
    startPos = position;
    document.getElementById('latitude').innerHTML = "Latitude: " + startPos.coords.latitude;
    document.getElementById('longitude').innerHTML = "Longitude: " + startPos.coords.longitude;
    
    my_map = enable_map(startPos.coords.latitude, startPos.coords.longitude)
    get_events_nearby(my_map, startPos.coords.latitude, startPos.coords.longitude)
};

var geoError = function(error) {
    console.log(error);
};

navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

if (navigator.geolocation) {
  console.log('Geolocation is supported!');
}
else {
  console.log('Geolocation is not supported for this Browser/OS.');
}

window.onload = function() {
  var startPos;

  navigator.permissions.query({ name: 'geolocation' }).then(function(resp) {
    if (resp.state == "granted") {
        navigator.geolocation.getCurrentPosition(geoSuccess);
    }
  })
  
  var geoSuccess = function(position) {
    startPos = position;
    document.getElementById('latitude').innerHTML = "Latitude: " + startPos.coords.latitude;
    document.getElementById('longitude').innerHTML = "Longitude: " + startPos.coords.longitude;

    mymap = enable_map(startPos.coords.latitude, startPos.coords.longitude)
    get_events_nearby(mymap, startPos.coords.latitude, startPos.coords.longitude)
  };

};


function enable_map(latitude, longitude) {
    // var mymap = L.map('mapid').setView([51.505, -0.09], 13);
    var mymap = L.map('mapid').setView([latitude, longitude], 13);

    var your_marker = L.marker([latitude, longitude]).addTo(mymap);
    your_marker.bindPopup("You are here!").openPopup();

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11'
    }).addTo(mymap);

    return mymap
}

function create_circle(map, latitude, longitude, color, caption) {
  marker = L.circle([latitude, longitude], {
        color: color,
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 120
  }).addTo(map);
  marker.bindPopup(caption)
}

function get_events_nearby(map, latitude, longitude) {
  type_color_dict = {
    "meetup": "red",
    "conference": "blue",
    "donation": "green",
    "bootcamp": "yellow"
  }

  get_map_data(latitude, longitude).then(map_data => {
    show_list(map_data)
    
    map_data.forEach(function(row) {
      create_circle(
        map, 
        get_random_close_coordinates(latitude, 50), 
        get_random_close_coordinates(longitude, 20), 
        type_color_dict[row.type], 
        row.name
      )
    })
  })
}


function get_random_close_coordinates(coordinate, precision) {
  random_val = Math.random()
  if (random_val > 0.5) {
    return coordinate + (random_val / precision)
  }
  return coordinate - (random_val / precision)
}

function get_map_data(latitude, longitude) {
  return Get('http://localhost:8000/data.json')
}

async function Get(url) {
    const req = await fetch(url)
    const json_data = await req.json()

    return json_data
}


function show_list(rows) {
  eventsListDiv = document.getElementById("eventsListDiv")
  var eventsList = document.createElement('ul')
  eventsList.setAttribute("class", "list-group list-group-flush")
  rows.forEach(function(row) {
    event = document.createElement("li")
    event.setAttribute("class", "list-group-item")
    event.innerText = row.name
    eventsList.appendChild(event)
  })
  eventsListDiv.appendChild(eventsList)
}
