import {ControlGroup} from '@angular/common';

export class FormBase {
    errorClassToUse(form: ControlGroup, inputName:string, isGroup: boolean = false): string {

        if (isGroup) {
            return !form.valid && form.find(inputName).touched ? 'has-error' : '';
        }
        else {
            return !form.find(inputName).valid && form.find(inputName).touched ? 'has-error' : '';
        }
    }
}