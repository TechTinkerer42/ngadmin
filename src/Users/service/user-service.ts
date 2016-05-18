
import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {HttpHelper} from '../../common/service/http-helper';
import {UserApplication} from './user-application-model';

@Injectable()
export class UserService {

    constructor( private httpHelper: HttpHelper) {
        
    }
    
    getUserApplications() {

        return this.httpHelper.makeHttpCall('AngularAdmin/GetUserApplications', '', 'GET')
            .map((response: Response) => <UserApplication[]>response.json());
            



    }


}