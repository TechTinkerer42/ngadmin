﻿

import {Inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs/Observable'
import {HttpHelper} from './http-helper';

@Injectable()
export class CommonService {

    constructor( @Inject(HttpHelper) public httpHelper: HttpHelper) {
        


    }

   
    getApplications() {

        return this.httpHelper.makeHttpCall('AngularAdmin/FillAvailableApps', JSON.stringify({ includeParentApps: true, orderByCustomer: false }), 'POST')
            .map((response) => response.json());
            
        

    }



}