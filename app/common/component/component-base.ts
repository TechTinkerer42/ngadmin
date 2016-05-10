import {ControlGroup} from '@angular/common';

export class ComponentBase {
    errorClassToUse(form: ControlGroup, inputName:string, isGroup: boolean = false): string {

        if (isGroup) {
            return !form.valid && form.find(inputName).touched ? 'has-error' : '';
        }
        else {
            return !form.find(inputName).valid && form.find(inputName).touched ? 'has-error' : '';
        }
    }
    
    showErrors(err: any){
        console.log(err);
        let message = "";
        if (err.status == "403") {
            message = "Unauthorized access";
            localStorage.removeItem("id_token");
            alert(message);
            window.location.reload();
        }
        else {
            message = "Error retrieving user customer accounts";
            alert(message);
        }
        
    }
}




