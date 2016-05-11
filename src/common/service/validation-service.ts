import {ControlGroup,  AbstractControl} from '@angular/common';


export class ValidationService {
    static getValidatorErrorMessage(code: string) {
        
        let config = {
            'required': 'Required',
            'selectrequired': 'Please select option',
            'invalidEmailAddress': 'Invalid email address',
            'invalidNumber': 'Invalid entry - must be a number',
            'async': 'async based validation failed',
            'invalidAccountName': 'Invalid Account Name!',
            'AccountIDsNotMatching': 'Account ID and Confirm must match'
        };

        return config[code];
    }
    
    static RequiredSelectValidator(control:AbstractControl) {
        
        if (control.value != '') {
            return null;
        }
        else {
            return { 'selectrequired': true };
        }
    }

    static RequiredValidator(control:AbstractControl) {
        if (control.value.trim().length > 0) {
            return null;
        } else {
            return { 'required': true };
        }
    }

    static EmailValidator(control:AbstractControl) {
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    static NumberValidator(control:AbstractControl) {
        
        if (!isNaN(control.value)) {
            return null;
        } else {
            return { 'invalidNumber': true };
        }
    }

    static ConfirmAccountIDsMatch(controlGroup:ControlGroup) {

        let accountID = controlGroup.controls["accountID"];
        let confirmAccountID = controlGroup.controls["confirmAccountID"];
        
        if (accountID.value !== confirmAccountID.value) {
            
            return { 'AccountIDsNotMatching': true };
        }
        else {
            return null;
        }
    }
    
  

   

        

           



            

            
   


    
}
