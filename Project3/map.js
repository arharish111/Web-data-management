// Put your zillow.com API key here
var zwsid = "";

var request = new XMLHttpRequest();
var home = new Object;
var map;
var geocoder;
var infowindow;
var marker;

function initialize () 
{
    home["addressElement"] = document.getElementById("address");
    home["mapElement"] = document.getElementById("map");
    infowindow = new google.maps.InfoWindow;
    displayMap();
}

function displayResult () {
    if (request.readyState == 4) {
        var xml = request.responseXML.documentElement;
        //home["zesResponse"] = xml;
        if(xml.getElementsByTagName("code")[0].textContent == "0")
        {
            var value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;
            var output = home.address + ": $" + value + "\n";
            home["value"] = value;
            displayOutput();    
            document.getElementsByName("text")[0].innerHTML += output;
        }
        else{
            window.alert("Request cannot be processed by Zillow for given address");
        }
    }
}

function sendRequest () {
    request.onreadystatechange = displayResult;
    var addressEntered = home.addressElement.value;
    home["address"] = addressEntered;
    var addressSplit = addressEntered.split(", ");
    var stateAndPincode = addressSplit[2].split(" ");
    request.open("GET","proxy.php?zws-id="+zwsid+"&address="+addressSplit[0]+"&citystatezip="+addressSplit[1]+"+"+stateAndPincode[0]+"+"+stateAndPincode[1],true);
    request.withCredentials = "true";
    request.send(null);
}

function clearTextInput()
{
    home.addressElement.value = "";
}

function displayMap()
{
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(32.75, -97.13);
    var mapOptions = {
      zoom: 17,
      center: latlng
    }
    map = new google.maps.Map(home.mapElement, mapOptions);
    map.addListener('click', function(e) {
        getAddress(e.latLng);
      });
}

function getAddress(latLng)
{
    geocoder.geocode({'location': latLng}, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            var address = results[0].formatted_address.split(", ");
            home.addressElement.value = address[0] + ", " + address[1] + ", " + address[2];
            sendRequest();
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
}

function displayOutput()
{
    if(marker)
        marker.setMap(null);
    geocoder.geocode( { 'address': home.address}, function(results, status) {
        if (status == 'OK') {
          map.setCenter(results[0].geometry.location);
          marker = new google.maps.Marker({
            position: results[0].geometry.location,
            title: home.address + ": $" + home.value
          });
          marker.setMap(map);
          infowindow.setContent(home.address + ": $" + home.value);
          infowindow.open(map,marker);
        } 
      });
}