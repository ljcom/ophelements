var map, infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 16
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var gps = pos.lat + ',' + pos.lng;
            $('#'+$(document.getElementById('map')).data("field")).val(gps);

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

//loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAuS1y9JVaVu0D_4gFw4U4V88e0HgqI_3A&callback=initMap', true, true);
//loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAuS1y9JVaVu0D_4gFw4U4V88e0HgqI_3A', true, true);

//initMap();