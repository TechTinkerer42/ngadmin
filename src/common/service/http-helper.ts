import {Injectable} from '@angular/core';
import {Http, RequestOptions, RequestMethod, Request, Headers} from '@angular/http';
import {StateVariables} from './state-variables';

@Injectable()
export class HttpHelper {

    constructor( private http: Http) {
        
    }


    makeHttpCall(url:string, body:string, method: string, useAuth: boolean = true) { 

        //let appPath = location.pathname.split('/')[1];

        let header = new Headers({
            'Content-Type': 'application/json'
            
        });

        //if we are using auth, we replace the header
        if (useAuth) {

            var userToken = localStorage.getItem("id_token")
            //console.log(userToken);

            header = new Headers({
                'Authorization': userToken,
                'Content-Type': 'application/json'
            });
        }
       
        let options = new RequestOptions({
            method: method,
            url: `${StateVariables.API_ENDPOINT}${url}`,
            headers: header,
            body: body

        });

        let req = new Request(options);
        
        return this.http.request(req);
    }
}