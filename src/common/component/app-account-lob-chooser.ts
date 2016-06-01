
import {Component, EventEmitter} from '@angular/core';

import {CommonService} from '../service/common-service';
import {AppAccountLOB} from '../../common/service/app-account-lob-model'
import {ComponentBase} from '../component/component-base';

import {Button} from 'primeng/primeng';

@Component({
    selector: 'app-account-lob-chooser',
    directives:[Button],
    outputs: ['onValueChosen','onClose'],
    inputs: ['selectedApp'],
    template: `
    
    <div *ngIf="alertMessage"><div class="alert alert-info" role="alert">{{alertMessage}}</div></div>
    <select *ngIf="ShowAppsDropDown" class="form-control" #appchoser (change)="fillAccounts(appchoser.value)">
        <option *ngIf="!applications">Loading...</option>
        <option [selected]="app.intUniqueApplicationNum == selectedApp" value="{{app.intUniqueApplicationNum}}" *ngFor="let app of applications">{{app.strApplicationName}} ({{app.intUniqueApplicationNum}})</option>
    </select>
    <br>
    <div *ngIf="accounts.length > 0" style="padding-bottom:25px">
        <select  class="form-control" #acctChooser (change)="fillLineOfBusiness(acctChooser.value)">
            <option value="0">Choose account</option>
            <option value="{{acc.accountNumber}}" *ngFor="let acc of accounts">{{acc.accountName}}</option>
        </select>
    </div>
    
    <div *ngIf="lobs.length > 0" style="padding-bottom:25px">
        <select *ngIf="lobs.length > 0" class="form-control" #lobchooser (change)="setLOB(lobchooser.value)">
            <option value="0">Choose line of business</option>
            <option value="{{lob.number}}|{{lob.customerNumber}}" *ngFor="let lob of lobs">{{lob.name}}</option>
        </select>
    </div>
    
    <button type="button" pButton *ngIf="ShowSelectButton" (click)="doSearch();" label="Select"></button>
    `
})

export class AppAccountLOBChooser extends ComponentBase {

    onValueChosen: EventEmitter<AppAccountLOB> = new EventEmitter<AppAccountLOB>();
    onClose: EventEmitter<any> = new EventEmitter<any>();
    
    selectedApp: number;
    selectedAccount: string;
    applications: Array<any>;
    accounts: Array<any> = [];
    lobs: Array<any> = [];
    appAccountLOB: AppAccountLOB = new AppAccountLOB();
    ShowSelectButton:boolean = false;
    ShowAppsDropDown:boolean = true;
    
    alertMessage:string;

    constructor(public commonService: CommonService) {
        super();

        this.commonService.getApplications()
            .subscribe(res => {
                this.applications = res;
                if (this.applications.length == 0) {
                    this.ShowAppsDropDown = false;
                    this.alertMessage = "No applications associated with this user";
                    
                }
                else {
                    let firstApp = this.applications[0].intUniqueApplicationNum;
                    this.selectedApp = firstApp;
                    this.fillAccounts(this.selectedApp);
                }
            },
            err => {
                this.alertMessage = "Error retrieving applications";
            }
            );
    }

    getAppName(appNumber:number)
    {
        let app = this.applications.filter(x=>x.intUniqueApplicationNum == appNumber)[0];
        return app.strApplicationName;
    }
    
    getAccountName(accountNumber:string)
    {
        let acct = this.accounts.filter(x=>x.accountNumber == accountNumber)[0];
        return acct.accountName;
    }

    fillAccounts(appNumber: number) {
        
        this.alertMessage = '';
        this.ShowSelectButton = false;
        this.selectedApp = appNumber;
        
        if (appNumber == 6 || appNumber == 74) {
            this.commonService.getAccounts(appNumber)
                .subscribe(res => {
                    
                    if (this.applications.length == 0) {
                        this.alertMessage = "No accounts associated with this user";
                    }
                    else{
                        this.accounts = res;
                    }
                    
                    
                },
                err => {
                    this.alertMessage = "Error retrieving accounts";
                }

                );
        }
        else {
            this.accounts = [];
            this.lobs = [];
            this.appAccountLOB.AppID = appNumber;
            this.appAccountLOB.AccountNumber = "0";
            this.appAccountLOB.AccountName = "";
            this.appAccountLOB.CustomerNumber = 0;
            this.appAccountLOB.LineOfBusiness = 1;
            this.appAccountLOB.SelectedAppName = this.getAppName(appNumber);
            this.ShowSelectButton = true;
            
        }


    }

    fillLineOfBusiness(accountNumber: string) {
        this.lobs = [];
        
        this.selectedAccount = accountNumber; 
        
        let acct = this.accounts.find(x => x.accountNumber == accountNumber);

        if (acct) {
            if (acct.interiorCustomerNumber != 'NA') {
                this.lobs.push({ name: 'Interior', number: 3, customerNumber: acct.interiorCustomerNumber});
            }
            if (acct.landCustomerNumber != 'NA') {
                this.lobs.push({ name: 'Land', number: 4, customerNumber: acct.landCustomerNumber});
            }
            if (acct.lotCustomerNumber != 'NA') {
                this.lobs.push({ name: 'Lot', number: 4, customerNumber: acct.lotCustomerNumber});
            }
            if (acct.snowCustomerNumber != 'NA') {
                this.lobs.push({ name: 'Snow', number: 2, customerNumber: acct.snowCustomerNumber});
            }
        }


    }

    setLOB(lobchooser:string) {
        
        let lobCustomerNumber:string[] = lobchooser.split('|');
        
        let lob:string = lobCustomerNumber[0];
        let customerNumber:string = lobCustomerNumber[1];
        
        this.appAccountLOB.AppID = this.selectedApp;
        this.appAccountLOB.AccountNumber = this.selectedAccount;
        this.appAccountLOB.AccountName = this.getAccountName(this.selectedAccount);
        this.appAccountLOB.CustomerNumber = parseInt(customerNumber);
        this.appAccountLOB.LineOfBusiness = parseInt(lob);
        this.appAccountLOB.SelectedAppName = this.getAppName(this.selectedApp);
        this.ShowSelectButton = true;
        
       
        
    }
    
    doSearch()
    {
        this.onValueChosen.emit(this.appAccountLOB)
    }

}


