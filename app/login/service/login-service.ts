

import {Response} from '@angular/http';
import {HttpHelper} from '../../common/service/http-helper';
import {Inject} from '@angular/core';




export class LoginService { 

    constructor( @Inject(HttpHelper) public httpHelper: HttpHelper) {
        
    }
     
    loginUser(data:any) {

        return this.httpHelper.makeHttpCall('Account/LoginToken', JSON.stringify(data), 'POST', false)
            .map((response: Response) => <any>response.json());
            



    }


}