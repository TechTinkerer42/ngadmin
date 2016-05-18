
import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {HttpHelper} from '../../common/service/http-helper';
import "rxjs/add/operator/map";


@Injectable()
export class LoginService { 

    constructor( private httpHelper: HttpHelper) {
        
    }
     
    loginUser(data:any) {

        

        return this.httpHelper.makeHttpCall('Account/LoginToken', JSON.stringify(data), 'POST')
            .map((response: Response) => response.json());
            



    }


}