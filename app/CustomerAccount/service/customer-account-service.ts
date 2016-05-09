


import {Inject, Injectable} from '@angular/core'
import {HttpHelper} from '../../common/service/http-helper';
import {CustomerAccount} from './customer-account-model';
import {Observable} from 'rxjs/Observable'



@Injectable()
export class CustomerAccountService {
    
    constructor( @Inject(HttpHelper) public httpHelper: HttpHelper) {
        

       
    }

    makeFileRequest(data: any) {
        return new Promise((resolve, reject) => {
            
            var fd = new FormData();

            fd.append("account", data.account);
            fd.append("accountID", data.accountID);
            fd.append("accountName", data.accountName);
            fd.append("fileData", data.filesToUpload[0]);

            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(xhr.response);
                    } else {

                        reject(xhr.statusText);
                    }
                }
            }

            var appPath = location.pathname.split('/')[1];

            var url = `/${appPath}/AngularAdmin/AddCustomerAccountAudio`;

            xhr.open("POST", url, true);
            xhr.send(fd);
        });
    }

    getCustomerAccounts() {
        return this.httpHelper.makeHttpCall('AngularAdmin/GetCustomerAccounts', '', 'GET', true);
    }

    AccountNumberValid(val:string) {
        return this.httpHelper.makeHttpCall('AngularAdmin/AccountNumberValid', JSON.stringify({ val: val }), 'POST', false)
    }

    

    


}