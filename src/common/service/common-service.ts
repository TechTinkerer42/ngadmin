

import {Injectable} from '@angular/core'
import {Observable} from 'rxjs/Observable'
import {HttpHelper} from './http-helper';

@Injectable()
export class CommonService {

    constructor( private httpHelper: HttpHelper) {
        


    }

   
    getApplications() {

        return this.httpHelper.makeHttpCall('AngularAdmin/FillAvailableApps', JSON.stringify({ includeParentApps: true, orderByCustomer: false }), 'POST')
            .map((response) => response.json());
    }
    
    getAccounts(chosenApp:number) {

        return this.httpHelper.makeHttpCall('AngularAdmin/GetAccounts', JSON.stringify({ chosenApp: chosenApp}), 'POST')
            .map((response) => response.json());
    }
    
    GetLinesOfBusinessForCustomer(chosenApp:number,chosenCustomerNumber:number) {

        return this.httpHelper.makeHttpCall('AngularAdmin/GetLinesOfBusinessForCustomer', JSON.stringify({ chosenApp: chosenApp, chosenCustomerNumber:chosenCustomerNumber}), 'POST')
            .map((response) => response.json());
    }
    
    getAdminMenuItems() { 

        return this.httpHelper.makeHttpCall('AngularAdmin/GetAdminMenuItems','', 'POST')
            .map((response) => response.json());
    }

    



}