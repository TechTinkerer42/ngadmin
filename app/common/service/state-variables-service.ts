import {Inject, Injectable} from '@angular/core'

@Injectable()
export class StateVariables {
    
   
    constructor() {
        console.log('test1');
        
    }
    
    static referredRoute:string = "";
    
}