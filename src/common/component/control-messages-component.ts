import {Component, Host} from '@angular/core'
import {NgFormModel} from '@angular/common';
import {ValidationService} from '../service/validation-service';

@Component({
    selector: 'control-messages',
    inputs: ['controlName: control', 'groupName: groupName'],
    template: `<div *ngIf="errorMessage !== null">{{errorMessage}}</div>`
})
export class ControlMessages {
    controlName: string;
    groupName: string;
    constructor( @Host() private _formDir: NgFormModel) { }

    get errorMessage() {
        let c:any;
        let g:any;

        if (this.groupName != null) {
            g = this._formDir.form.find(this.groupName);
            c = this._formDir.form.find(this.groupName).find(this.controlName);

            for (let propertyName in g.errors) {
                if (g.errors.hasOwnProperty(propertyName) && c.touched) {
                    return ValidationService.getValidatorErrorMessage(propertyName);
                }
            }
            
        }
        else {
            c = this._formDir.form.find(this.controlName);
        }
        
        for (let propertyName in c.errors) {
            if (c.errors.hasOwnProperty(propertyName) && c.touched) {
                return ValidationService.getValidatorErrorMessage(propertyName);
            }
        }
       

        return null;
    }
}