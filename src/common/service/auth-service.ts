
import {Injectable,Inject,Injector,} from'@angular/core';

import {Router} from '@angular/router-deprecated';

import {JwtHelper} from 'angular2-jwt';

import {appInjector} from './app-injector';


@Injectable()
export class AuthService {
    
    jwtHelper: JwtHelper = new JwtHelper();

    public isTokenValid(){
         console.log('checking token!!'); 

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
        
        return isValid;
    }

    public navigateTo(location:string)
    {
            let injector: Injector = appInjector(); // get the stored reference to the injector
	        let router: Router = injector.get(Router);
            router.navigate([location]);
    }


    public checkLogin(next: any, previous: any): boolean {
        
        let isValid: boolean = this.isTokenValid();
        
        if (!isValid) {
            this.navigateTo('/Login');
            
            
            //let injector: Injector = appInjector(); // get the stored reference to the injector
	        //let router: Router = injector.get(Router);
            //router.navigate(['/Login']);
        }

        return isValid;
         
    }   
   
}