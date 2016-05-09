

import {Response} from '@angular/http';
import {HttpHelper} from '../../common/service/http-helper';
import {Inject} from '@angular/core';

import {UserApplication} from './user-application-model';


export class UserService {

    constructor( @Inject(HttpHelper) public httpHelper: HttpHelper) {
        
    }
    
    getUserApplications() {

        return this.httpHelper.makeHttpCall('AngularAdmin/GetUserApplications', '', 'GET', false)
            .map((response: Response) => <UserApplication[]>response.json());
            



    }


}