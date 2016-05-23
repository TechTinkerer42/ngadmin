import {Component, ReflectiveInjector} from '@angular/core'
import {AgGridNg2} from 'ag-grid-ng2/main';
import {GridOptions} from 'ag-grid/main';
import {SearchComponent} from '../../common/component/searcher';
import {CustomerAccountService} from '../service/customer-account-service';
import {CustomerAccount} from '../service/customer-account-model';
import {ComponentBase} from '../../common/component/component-base';

import {MODAL_DIRECTIVES} from 'ng2-bs3-modal/ng2-bs3-modal';
import {EditCustomerAccount} from './edit-customer-account';
import {CanActivate} from '@angular/router-deprecated';
import {AuthService} from '../../common/service/auth-service';


@CanActivate((next, previous) => {
    let injector: any = ReflectiveInjector.resolveAndCreate([AuthService]);
    let authService: AuthService = injector.get(AuthService);
    return authService.checkLogin(next, previous);
})

@Component({
    directives: [AgGridNg2, SearchComponent, MODAL_DIRECTIVES, EditCustomerAccount],
    providers: [CustomerAccountService],
    template: `
    
    <modal #modal keyboard="false" [animation]="false">
        <modal-header [show-close]="false">
            <h4 style="float:left" class="modal-title">{{action}} Account</h4>
        </modal-header>
        <modal-body>
            <edit-customer-account [IncomingModel]="CustomerAccountModel" (onCancel)="modal.close();" (onDoneAdd)="onDoneAdd(modal);"></edit-customer-account>
        </modal-body>
    </modal>


    <div class="row">
        <div class="col-md-2 col-md-offset-6">
            <button type="button" class="btn btn-primary" (click)="openModal(modal,'Add');">Add Account</button>
            <br><br>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <ag-grid-ng2 #agGrid style="height: 400px;" class="ag-blue" [gridOptions]="gridOptions"></ag-grid-ng2>
        </div>
    </div>

    <div class="row">
        <div class="col-md-2">
            <searcher (onSearchTermEntered) = "onSearchTermEntered($event)"></searcher>
        </div>
        <div class="col-md-2 col-md-offset-4">    
            Rows: {{rowsDisplayed}}
        </div>
    </div>
    `
})




export class CustomerAccountList extends ComponentBase {
    columnDefs: [{}];
    gridOptions: GridOptions = [];
    searchTerm: string = "";
    rowsDisplayed: string;
    customerAccounts: CustomerAccount[];
    action: string;

    CustomerAccountModel: CustomerAccount = new CustomerAccount();

    showConfirmOption: boolean = false;

    constructor( private customerAccountService: CustomerAccountService) {

        super();

        this.columnDefs = [
            { headerName: "Account ID", field: "Account_ID", width: 120 },
            { headerName: "Account", field: "Account_Name", width: 600 },
            { headerName: "Account App#", field: "Account_AppNumber", width: 150 }
        ];

        this.gridOptions = {
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableSorting: true,
            rowSelection: 'single',
            overlayNoRowsTemplate: "<span style='padding: 10px; border: 1px solid #444; background: lightgoldenrodyellow;'>No results</span>",
            overlayLoadingTemplate: "<span style='padding: 10px; border: 1px solid #444; background: lightgoldenrodyellow;'><i class='fa fa-spinner fa-spin'></i> Loading...</span>",
        }

        this.getCustomerAccounts(); //initial data load
    }

    openModal(modal: any, action: string) {
        this.action = action;
        if (action === 'Add') {
            this.CustomerAccountModel = new CustomerAccount();
            this.gridOptions.api.deselectAll();
        }

        modal.open();
    }

    onDoneAdd(modal: any) {

        modal.close();

        this.getCustomerAccounts();
    }







    cloneAccount(c: CustomerAccount): CustomerAccount {
        let newCA = new CustomerAccount();
        for (let prop in c) {
            newCA[prop] = c[prop];
        }
        return newCA;
    }


    showRowMessage() {
        var model = this.gridOptions.api.getModel();
        var processedRows = model.getRowCount();
        this.rowsDisplayed = `${processedRows} of ${this.customerAccounts.length}`;

        this.gridOptions.api.hideOverlay();
        if (processedRows < 1) {
            this.gridOptions.api.showNoRowsOverlay();
        }
    }

    onSearchTermEntered(filterValue: string) {
        this.gridOptions.api.deselectAll();
        this.gridOptions.api.setQuickFilter(filterValue);
        this.showRowMessage();
        this.CustomerAccountModel = new CustomerAccount();
    }

    getCustomerAccounts() {
        this.customerAccountService.getCustomerAccounts()
            .subscribe(
            ca => {

                this.customerAccounts = ca.json();

                if (this.gridOptions.api) {
                    this.gridOptions.api.setRowData(this.customerAccounts);
                    this.gridOptions.api.sizeColumnsToFit();
                    this.showRowMessage();
                }
            },
            err => {
                this.gridOptions.api.hideOverlay();
                this.showErrorAlert(err,'Error retrieving user customer accounts');
            }
            );
    }



}



