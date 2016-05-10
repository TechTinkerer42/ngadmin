
import {Injectable,Inject,Injector,} from'@angular/core';

import {Router} from '@angular/router-deprecated';

import {JwtHelper} from 'angular2-jwt';

import {appInjector} from './app-injector';

import {StateVariables} from './state-variables-service';


@Injectable()
export class AuthService {
    
    jwtHelper: JwtHelper = new JwtHelper();

    public checkLogin(next: any, previous: any): boolean {
        
        //console.log(next,previous);
        
        console.log('checking login!!');

        let injector: Injector = appInjector(); // get the stored reference to the injector
	    let router: Router = injector.get(Router);

        let isValid: boolean = true;
        
        //look for token
        var token = localStorage.getItem('id_token');

        if (token) {
            console.log('token found, now see if expired');

            let isExpired = this.jwtHelper.isTokenExpired(token);

            if (isExpired) {
                console.log('token is expired');
                isValid = false;
            }
            else {
                console.log('token NOT expired');
            }
        }
        else {
            //token not found
            console.log('token not found, going to login');
            isValid = false;
            
        }

        
        if (!isValid) {
            //console.log(next);
            StateVariables.referredRoute = next.routeName;
            router.navigate(['/Login']);
        }





        return isValid;
         
    }   
   
}