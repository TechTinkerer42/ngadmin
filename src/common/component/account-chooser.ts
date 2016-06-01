
import {Component, EventEmitter, Input} from '@angular/core';

import {CommonService} from '../service/common-service';

import {ComponentBase} from '../component/component-base';

@Component({
    selector: 'account-chooser',
    outputs: ['onAccountChosen'],
    template: `
    <select *ngIf="accounts.length > 0" class="form-control appchooser" #accountchoser (change)="onAccountChosen.emit(accountchoser.value)">
        <option value="0">Choose account</option>
        <option value="{{acc.accountNumber}}" *ngFor="let acc of accounts">{{acc.accountName}})</option>
    </select>
    
    `
})
export class AccountChooser extends ComponentBase {

    onAccountChosen: EventEmitter<any> = new EventEmitter<any>();
    accounts: Array<any> = [];

    @Input() set IncomingSelectedApp(app: number) {
        //console.log('app selected: ' + app);
        
        if(app == 6 || app == 74)
        {
            this.getAccounts(app);    
        }
        else{
            this.accounts = [];
            onAccountChosen
        }
        
        
    }

    constructor(public commonService: CommonService) {
        super();
    }

    getAccounts(selectedApp: number) {
        this.commonService.getAccounts(selectedApp)
            .subscribe(res => {
                console.log('here');
                this.accounts = res;
            },
            err => {
                this.showError(err, 'Error retrieving accounts');
            }

            );
    }



}


