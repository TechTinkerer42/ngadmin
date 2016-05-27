import {Injectable} from '@angular/core'

@Injectable()
export class StateVariables {
  
  public static get API_ENDPOINT(): string { 
        
        let result = 'http://www.servicepartnerplatform.com/spptest/';
        switch(window.location.hostname)
        {
            case "localhost":
                result = 'http://localhost:8011/sppdev/';    
            break;
        }
        //console.log(result);
        return result; 
    }
}