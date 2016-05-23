import {ControlGroup} from '@angular/common';
import {Message, DataTable, Column} from 'primeng/primeng';

export class ComponentBase {

    showError(err: any, message: string = '') {
        if (err.status == "403") {
            message = "Unauthorized access";
            localStorage.removeItem("id_token");
        }
        alert(message);
    }
    
    errorClassToUse(form: ControlGroup, inputName: string, isGroup: boolean = false): string {

        if (isGroup) {
            return !form.valid && form.find(inputName).touched ? 'has-error' : '';
        }
        else {
            return !form.find(inputName).valid && form.find(inputName).touched ? 'has-error' : '';
        }
    }

    

    

}




