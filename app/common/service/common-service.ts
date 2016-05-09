

import {Inject, Injectable} from '@angular/core'
import {ServiceBase} from './service-base';
import {Observable} from 'rxjs/Observable'
import {HttpHelper} from './http-helper';

@Injectable()
export class CommonService extends ServiceBase {

    constructor( @Inject(HttpHelper) public httpHelper: HttpHelper) {
        super();


    }

   
    getApplications() {

        return this.httpHelper.makeHttpCall('AngularAdmin/FillAvailableApps', JSON.stringify({ includeParentApps: true, orderByCustomer: false }), 'POST', false)
            .map((response) => response.json());
            
        

    }



}