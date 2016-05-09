﻿
import {HttpHelper} from '../../common/service/http-helper';
import {Inject, Injectable} from '@angular/core'


@Injectable()
export class GeocoderService {
    
    constructor( @Inject(HttpHelper) public httpHelper: HttpHelper) {
    }

    getLocationsForGeocoding(geocodeType: number, appNumber: number, customerNumber: number, businessLine: number) {
        return this.httpHelper.makeHttpCall('AngularAdmin/GetLocationsForGeocoding', JSON.stringify({ geocodeType: geocodeType, appNumber: appNumber, customerNumber: customerNumber, businessLine: businessLine }), 'POST', false);
    }

    saveGeocodingResults(geocodeType:number,locationsToGeocode:any) {
        return this.httpHelper.makeHttpCall('AngularAdmin/SaveGeocodingResults', JSON.stringify({ geocodeType: geocodeType, locationsToGeocode: locationsToGeocode }), 'POST', false);
    }
   




    


}