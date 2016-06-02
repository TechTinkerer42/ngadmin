import {ControlGroup} from '@angular/common';
import {Message, DataTable, Column} from 'primeng/primeng';

export class ComponentBase {

    ShowLoading:boolean = false;
    

    showError(err: any, message: string = '') {
        if (err.status == "403") {
            message = "Session has timed out or you don't have credentials for this area. Please login again.";
            localStorage.removeItem("id_token");
        }
        
        if(err._body)
        {
            //message += "\r\n" + err._body;
        }
        let errorspot = $('#errorspot');
        let errorMessage = $('#errorMessage');
        let errorCloseButton = $('#errorCloseButton');
        errorMessage.text(message);
        errorspot.show();
        
        errorCloseButton.on("click", ()=>{
            errorspot.hide();
            window.location.replace("/");
        });
        
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




