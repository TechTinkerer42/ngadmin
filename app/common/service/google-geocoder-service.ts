
export class GoogleGeocoder {

    geocoder: google.maps.Geocoder;

    geocodeLocation(locationToGeoCode:any,callback:any) {
        
        var address = locationToGeoCode.GeocodeAddress;

        this.geocoder = new google.maps.Geocoder();
        
        this.geocoder.geocode({ 'address': address }, 
            function (results, status) {
                return callback(status, results, locationToGeoCode);
        });
    }
}
