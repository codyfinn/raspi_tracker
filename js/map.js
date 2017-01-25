var Map = function(){
    this.mapView = L.map('map').fitWorld()

    this.userRadius = L.circle([51.9977, 0.7407], {
        color: 'blue',
        fillColor: '#03f',
        fillOpacity: 0.5,
        radius: 2.5
    }).addTo(this.mapView)
    

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1IjoiY29keWZpbm4iLCJhIjoiY2l4Z3Z3eTI4MDA0cjJ5bXplZmxhamZqbSJ9._XwJe9qFc-PVMhHX_nj5JA'
    }).addTo(this.mapView);
    
    //this.mapView.setView([51.9977, 0.7407], 13)

    this.updateUserGPS = function(tpv){	
        this.userRadius.setLatLng([tpv.lat, tpv.lon])
    }

    this.updateBalloonGPS = function(tpv){
        
    }
}
map = new Map()
