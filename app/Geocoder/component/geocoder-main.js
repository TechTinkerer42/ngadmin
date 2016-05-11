"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var geocoder_service_1 = require('../service/geocoder-service');
var Observable_1 = require('rxjs/Observable');
var google_geocoder_service_1 = require('../../common/service/google-geocoder-service');
var router_deprecated_1 = require('@angular/router-deprecated');
var auth_service_1 = require('../../common/service/auth-service');
var component_base_1 = require('../../common/component/component-base');
var Geocoder = (function (_super) {
    __extends(Geocoder, _super);
    function Geocoder(geocoderService, googleGeocoderService) {
        _super.call(this);
        this.geocoderService = geocoderService;
        this.googleGeocoderService = googleGeocoderService;
        this.locationsToGeocode = new Array();
        this.waiting = false;
        this.showGeocodeForm = true;
        this.geocodingInProgress = false;
        this.showSave = false;
        this.showStatuses = false;
        this.isComplete = false;
        this.foundCounter = 0;
        this.addressNotFoundCounter = 0;
        this.failedCounter = 0;
        this.overallGeocodeType = 0;
    }
    Geocoder.prototype.onGeocodeTypeChange = function (val) {
        this.overallGeocodeType = val;
    };
    Geocoder.prototype.submitGeocodeForm = function (appNumber, customerNumber, businessLine) {
        if (this.overallGeocodeType == 0) {
            this.getLocationsForGeocoding(0, 0, 0, 0);
        }
        if (this.overallGeocodeType == 1) {
            //validate the numbers
            if (isNaN(appNumber) || isNaN(customerNumber) || isNaN(businessLine)) {
                this.statusMessage = "Form is not valid";
            }
            else {
                this.getLocationsForGeocoding(1, appNumber, customerNumber, businessLine);
            }
        }
    };
    Geocoder.prototype.getLocationsForGeocoding = function (geocodeLocation, appNumber, customerNumber, businessLine) {
        var _this = this;
        this.waiting = true;
        this.geocoderService.getLocationsForGeocoding(geocodeLocation, appNumber, customerNumber, businessLine)
            .subscribe(function (locations) {
            _this.waiting = false;
            _this.locationsToGeocode = locations.json();
            _this.locationsToGeocode.forEach(function (x) { return x.IsGeocoded = false; });
            if (_this.overallGeocodeType == 0) {
                _this.statusMessage = _this.locationsToGeocode.length.toString() + " locations need geocoding in staging table";
            }
            if (_this.overallGeocodeType == 1) {
                _this.statusMessage = _this.locationsToGeocode.length.toString() + " locations need geocoding in production table";
            }
        }, function (err) {
            _this.waiting = false;
            _this.showErrors(err, 'Error retrieving locations');
        });
    };
    Geocoder.prototype.saveGeocodingResults = function () {
        var _this = this;
        this.waiting = true;
        this.geocoderService.saveGeocodingResults(this.overallGeocodeType, this.locationsToGeocode)
            .subscribe(function (locations) {
            _this.waiting = false;
            _this.showSave = false;
            _this.statusMessage = "Save Completed";
        }, function (err) {
            console.log(err);
            _this.showErrors(err, 'Error saving geocoding locations');
        });
    };
    Geocoder.prototype.stopGeocoding = function () {
        this.waiting = false;
        this.geocodingInProgress = false;
        this.showSave = true;
        this.obs.unsubscribe();
    };
    Geocoder.prototype.processGeocoding = function () {
        var _this = this;
        //make observable and interval it and work through the list
        this.showGeocodeForm = false;
        this.geocodingInProgress = true;
        this.showSave = false;
        this.waiting = true;
        this.showStatuses = true;
        this.failedCounter = 0;
        this.obs = Observable_1.Observable.interval(1000)
            .subscribe(function (x) {
            if (_this.locationsToGeocode.length > 0) {
                _this.notGeocodedLocations = _this.locationsToGeocode.filter(function (y) { return y.IsGeocoded === false; });
                _this.statusMessage = "There are " + _this.notGeocodedLocations.length.toString() + " locations that need Geo-coding";
                if (_this.notGeocodedLocations.length > 0) {
                    var loc = _this.notGeocodedLocations.pop();
                    _this.googleGeocoderService.geocodeLocation(loc, function (status, results, locationToGeoCode) {
                        _this.logMessages = status.toString();
                        if (status == google.maps.GeocoderStatus.OK) {
                            //console.log('status was ok');
                            _this.foundCounter++;
                            locationToGeoCode.Store_LongLat = results[0].geometry.location.toString();
                            locationToGeoCode.IsGeocoded = true;
                        }
                        else {
                            if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
                                console.log('address not found');
                                _this.addressNotFoundCounter++;
                                locationToGeoCode.IsGeocoded = true;
                            }
                            else {
                                console.log('failed for some other reason: ' + status);
                                console.log('results: ' + results);
                                _this.failedCounter++;
                                if (_this.failedCounter > 50) {
                                    _this.logMessages += ' - STOPPED';
                                    _this.waiting = false;
                                    _this.showSave = true;
                                    _this.geocodingInProgress = false;
                                    _this.obs.unsubscribe();
                                }
                            }
                        }
                    });
                }
                else {
                    _this.waiting = false;
                    _this.showSave = true;
                    _this.isComplete = true;
                    _this.geocodingInProgress = false;
                    _this.statusMessage = "Geocoding Completed";
                    _this.obs.unsubscribe();
                }
            }
            else {
                //kill interval
                _this.waiting = false;
                _this.showSave = false;
                _this.geocodingInProgress = false;
                _this.obs.unsubscribe();
            }
        });
    };
    Geocoder = __decorate([
        core_1.Component({
            providers: [geocoder_service_1.GeocoderService, google_geocoder_service_1.GoogleGeocoder],
            template: " \n    <div class=\"container-fluid\">\n        <div class=\"row\" *ngIf=\"showGeocodeForm\">\n            <label for=\"geocodeType\">Type:</label>\n            <select class=\"form-control\" #geocodeType (change)=\"onGeocodeTypeChange(geocodeType.value)\">\n            <option value=\"0\">Staging</option>\n            <option value=\"1\">Prod</option>\n            </select>\n            <br>\n        \n            <div *ngIf=\"overallGeocodeType == 0\">\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"submitGeocodeForm(0,0,0)\">Go</button>        \n            </div>\n\n            <div *ngIf=\"overallGeocodeType == 1\">\n                <div class=\"form-group\">\n                    <div><label for=\"accountName\">App Number:</label></div>\n                    <div>\n                        <input class=\"form-control\" #appNumber value=\"0\" />\n                    </div>\n                </div>\n                <div class=\"form-group\">\n                    <div><label for=\"customerNumber\">Customer Number:</label></div>\n                    <div>\n                        <input class=\"form-control\" #customerNumber value=\"0\" />\n                    </div>\n                </div>\n                <div class=\"form-group\">\n                    <div><label for=\"businessLine\">Business Line:</label></div>\n                    <div>\n                        <input class=\"form-control\" #businessLine value=\"0\" />\n                    </div>\n                </div>\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"submitGeocodeForm(appNumber.value,customerNumber.value,businessLine.value)\">Go</button>        \n            </div>\n            <br>\n        </div>\n\n        <div class=\"row\">\n            <div *ngIf=\"statusMessage\">{{statusMessage}}</div>\n            <div><br>\n                <button *ngIf=\"locationsToGeocode.length > 0 && !geocodingInProgress && !isComplete\" type=\"button\" class=\"btn btn-default\" (click)=\"processGeocoding()\">Geocode Locations</button>\n                <button *ngIf=\"geocodingInProgress\" type=\"button\" class=\"btn btn-default\" (click)=\"stopGeocoding()\">Stop</button>\n                <button *ngIf=\"showSave\" type=\"button\" class=\"btn btn-default\" (click)=\"saveGeocodingResults()\">Save</button>\n                <br><br>\n            </div> \n        </div>    \n        <div class=\"row\" *ngIf=\"showStatuses\">\n            <div *ngIf=\"waiting\" class=\"alert alert-info\"><i class=\"fa fa-spinner fa-spin\"></i> Processing...</div>\n            <div class=\"alert alert-info\">Found: {{foundCounter}}</div>\n            <div class=\"alert alert-warning\">\n            Not Found: {{addressNotFoundCounter}}\n            </div>\n            <div class=\"alert alert-danger\">\n            Failed: {{failedCounter}}\n            </div>\n            <div class=\"alert alert-info\" *ngIf=\"logMessages\">\n            Status: {{logMessages}}\n            </div>\n        </div>\n    </div>\n    "
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            var injector = core_1.ReflectiveInjector.resolveAndCreate([auth_service_1.AuthService]);
            var authService = injector.get(auth_service_1.AuthService);
            return authService.checkLogin(next, previous);
        }),
        __param(0, core_1.Inject(geocoder_service_1.GeocoderService)),
        __param(1, core_1.Inject(google_geocoder_service_1.GoogleGeocoder)), 
        __metadata('design:paramtypes', [geocoder_service_1.GeocoderService, google_geocoder_service_1.GoogleGeocoder])
    ], Geocoder);
    return Geocoder;
}(component_base_1.ComponentBase));
exports.Geocoder = Geocoder;
//# sourceMappingURL=geocoder-main.js.map