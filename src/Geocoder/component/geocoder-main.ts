import {Component, ReflectiveInjector} from '@angular/core'
import {GeocoderService} from '../service/geocoder-service'; 
import {StoreLocation} from '../service/geocoder-model';
import {Observable} from 'rxjs/Observable'; 
import {GoogleGeocoder} from '../../common/service/google-geocoder-service'; 
import {CanActivate} from '@angular/router-deprecated';
import {AuthService} from '../../common/service/auth-service';
import {ComponentBase} from '../../common/component/component-base';


@Component({
    providers: [GeocoderService, GoogleGeocoder],
    template: ` 
    
    <div class="container-fluid">
        <div class="row" *ngIf="showGeocodeForm">
            <label for="geocodeType">Type:</label>
            <select class="form-control" #geocodeType (change)="onGeocodeTypeChange(geocodeType.value)">
            <option value="0">Staging</option>
            <option value="1">Prod</option>
            </select>
            <br>
        
            <div *ngIf="overallGeocodeType == 0">
                <button type="button" class="btn btn-default" (click)="submitGeocodeForm(0,0,0)">Go</button>        
            </div>

            <div *ngIf="overallGeocodeType == 1">
                <div class="form-group">
                    <div><label for="accountName">App Number:</label></div>
                    <div>
                        <input class="form-control" #appNumber value="0" />
                    </div>
                </div>
                <div class="form-group">
                    <div><label for="customerNumber">Customer Number:</label></div>
                    <div>
                        <input class="form-control" #customerNumber value="0" />
                    </div>
                </div>
                <div class="form-group">
                    <div><label for="businessLine">Business Line:</label></div>
                    <div>
                        <input class="form-control" #businessLine value="0" />
                    </div>
                </div>
                <button type="button" class="btn btn-default" (click)="submitGeocodeForm(appNumber.value,customerNumber.value,businessLine.value)">Go</button>        
            </div>
            <br>
        </div>

        <div class="row">
            <div *ngIf="statusMessage">{{statusMessage}}</div>
            <div><br>
                <button *ngIf="locationsToGeocode.length > 0 && !geocodingInProgress && !isComplete" type="button" class="btn btn-default" (click)="processGeocoding()">Geocode Locations</button>
                <button *ngIf="geocodingInProgress" type="button" class="btn btn-default" (click)="stopGeocoding()">Stop</button>
                <button *ngIf="showSave" type="button" class="btn btn-default" (click)="saveGeocodingResults()">Save</button>
                <br><br>
            </div> 
        </div>    
        <div class="row" *ngIf="showStatuses">
            <div *ngIf="waiting" class="alert alert-info"><i class="fa fa-spinner fa-spin"></i> Processing...</div>
            <div class="alert alert-info">Found: {{foundCounter}}</div>
            <div class="alert alert-warning">
            Not Found: {{addressNotFoundCounter}}
            </div>
            <div class="alert alert-danger">
            Failed: {{failedCounter}}
            </div>
            <div class="alert alert-info" *ngIf="logMessages">
            Status: {{logMessages}}
            </div>
        </div>
    </div>
    `
})



@CanActivate((next, previous) => {
    let injector: any = ReflectiveInjector.resolveAndCreate([AuthService]);
    let authService: AuthService = injector.get(AuthService);
    return authService.checkLogin(next, previous);
})  


export class Geocoder extends ComponentBase {

    constructor(
        private geocoderService: GeocoderService,
        private googleGeocoderService: GoogleGeocoder) {

        super();
    }

    locationsToGeocode = new Array<StoreLocation>();
    notGeocodedLocations: Array<StoreLocation>;

    waiting: boolean = false;
    statusMessage: string;
    logMessages: string;

    showGeocodeForm: boolean = true;

    geocodingInProgress: boolean = false;
    showSave: boolean = false;
    showStatuses: boolean = false;
    isComplete: boolean = false;
    obs: any;
    foundCounter: number = 0;
    addressNotFoundCounter: number = 0;
    failedCounter: number = 0;

    overallGeocodeType: number = 0;


    onGeocodeTypeChange(val: number) {
        
        this.overallGeocodeType = val;

        

    }

    

    submitGeocodeForm(appNumber: number, customerNumber: number, businessLine: number) {
       

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
        
    }

    getLocationsForGeocoding(geocodeLocation: number, appNumber: number, customerNumber: number, businessLine: number) {
        this.waiting = true;
        this.geocoderService.getLocationsForGeocoding(geocodeLocation, appNumber, customerNumber, businessLine)
            .subscribe(
            locations => {
                
                this.waiting = false;
                this.locationsToGeocode = locations.json();
                this.locationsToGeocode.forEach(x => x.IsGeocoded = false);

                if (this.overallGeocodeType == 0) {
                    this.statusMessage = this.locationsToGeocode.length.toString() + " locations need geocoding in staging table";
                }
                if (this.overallGeocodeType == 1) {
                    this.statusMessage = this.locationsToGeocode.length.toString() + " locations need geocoding in production table";
                }
                
                
            },
            err => {
                this.waiting = false;
                this.showError(err,'Error retrieving locations')
                
            }
            );
    }
    
    saveGeocodingResults() {
        this.waiting = true;
        this.geocoderService.saveGeocodingResults(this.overallGeocodeType,this.locationsToGeocode)
            .subscribe(
            locations => {
                this.waiting = false;
                this.showSave = false;
                this.statusMessage = "Save Completed";
            },
            err => {
                console.log(err);
                this.showError(err,'Error saving geocoding locations')
            });
    }

    stopGeocoding() {
        this.waiting = false;
        this.geocodingInProgress = false;
        this.showSave = true;
        this.obs.unsubscribe();
    }
    
    processGeocoding() {
        //make observable and interval it and work through the list
        this.showGeocodeForm = false;
        this.geocodingInProgress = true;
        this.showSave = false;
        this.waiting = true;
        this.showStatuses = true;
        this.failedCounter = 0;

        this.obs = Observable.interval(1000)  
            .subscribe(x => {

                if (this.locationsToGeocode.length > 0) {

                    this.notGeocodedLocations = this.locationsToGeocode.filter(y => y.IsGeocoded === false);

                    this.statusMessage = "There are " + this.notGeocodedLocations.length.toString() + " locations that need Geo-coding";

                    if (this.notGeocodedLocations.length > 0) {
                        let loc = this.notGeocodedLocations.pop();
                        this.googleGeocoderService.geocodeLocation(loc, (status:google.maps.GeocoderStatus, results:any, locationToGeoCode:any) => {

                            this.logMessages = status.toString();

                            if (status == google.maps.GeocoderStatus.OK) {
                                //console.log('status was ok');
                                this.foundCounter++;
                                locationToGeoCode.Store_LongLat = results[0].geometry.location.toString();
                                locationToGeoCode.IsGeocoded = true;
                            }
                            else {
                                if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
                                    console.log('address not found');

                                    this.addressNotFoundCounter++;
                                    locationToGeoCode.IsGeocoded = true;
                                }
                                else {
                                    console.log('failed for some other reason: ' + status);
                                    console.log('results: ' + results);
                                    this.failedCounter++;

                                    if (this.failedCounter > 50) {
                                        this.logMessages += ' - STOPPED'
                                        this.waiting = false;
                                        this.showSave = true;
                                        this.geocodingInProgress = false;
                                        this.obs.unsubscribe();
                                    }
                                }
                            }
                        });
                    }
                    else {
                        this.waiting = false;
                        this.showSave = true;
                        this.isComplete = true;
                        this.geocodingInProgress = false;
                        this.statusMessage = "Geocoding Completed";
                        this.obs.unsubscribe();
                    }
                }
                else {
                    //kill interval
                    this.waiting = false;
                    this.showSave = false;
                    this.geocodingInProgress = false;
                    this.obs.unsubscribe();
                }
            });
    }
}
