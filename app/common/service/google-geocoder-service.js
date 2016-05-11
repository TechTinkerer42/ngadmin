"use strict";
var GoogleGeocoder = (function () {
    function GoogleGeocoder() {
    }
    GoogleGeocoder.prototype.geocodeLocation = function (locationToGeoCode, callback) {
        var address = locationToGeoCode.GeocodeAddress;
        this.geocoder = new google.maps.Geocoder();
        this.geocoder.geocode({ 'address': address }, function (results, status) {
            return callback(status, results, locationToGeoCode);
        });
    };
    return GoogleGeocoder;
}());
exports.GoogleGeocoder = GoogleGeocoder;
//# sourceMappingURL=google-geocoder-service.js.map