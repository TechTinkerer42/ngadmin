import {Component, ReflectiveInjector, OnInit, TemplateRef} from '@angular/core'
import {ApplicationChooser} from '../../common/component/app-chooser'
import {Loading} from '../../common/component/loading'
import {AuthService} from '../../common/service/auth-service';
import {DataTableComponentBase} from '../../common/component/datatable-component-base';
import {CanActivate} from '@angular/router-deprecated';
import {InputText, DataTable, Column, Header, Footer, Button, ContextMenu, Dialog} from 'primeng/primeng';
import {CustomerAccountService} from '../service/customer-account-service';
import {CustomerAccount} from '../service/customer-account-model';
import {EditCustomerAccount} from './edit-customer-account';




@CanActivate((next, previous) => {
    let injector: any = ReflectiveInjector.resolveAndCreate([AuthService]);
    let authService: AuthService = injector.get(AuthService);
    return authService.checkLogin(next, previous);
})

@Component({
    directives: [EditCustomerAccount, DataTable, Column, Header, Footer, Button, ContextMenu, Dialog, Loading],
    providers: [CustomerAccountService],
    template: `
    <div class="col-md-12">
    <loading LoadingMessage="Loading..." [ShowLoading]="ShowLoading"></loading>
    
    <p-contextMenu #cm [model]="ContextMenuItems"></p-contextMenu>

    <p-dataTable #dt [value]="GridDataSource" selectionMode="single" [paginator]="true" [rows]="NumberOfGridRows" filterDelay="0"  
    [globalFilter]="gb" resizableColumns="true" columnResizeMode="expand" (onFilter)="filterGrid(dt)">
    <p-column [filter]="true" filterMatchMode="contains" *ngFor="let col of GridColumns" [sortable]="col.sortable" [field]="col.field" [header]="col.header" [hidden]="col.hidden" [style]="col.style">
    </p-column>
    </p-dataTable>
        
    <div class="ui-widget-header ui-helper-clearfix" style="padding:4px 10px;border-bottom: 0 none">
        <div>
        <i class="fa fa-search" style="float:left;margin:4px 4px 0 0"></i>
        <input #gb type="text" pInputText size="50" style="float:left:padding-right:20px;" placeholder="Enter Search">
        <button *ngIf="ShowExportButton" type="button" pButton icon="fa-file-excel-o" (click)="onExport(dt);" [label]="ExportString"></button>
        
        <button type="button" pButton icon="fa-plus" style="float:right" (click)="addCustomerAccount();" label="Add Account"></button>
        <button type="button" *ngIf="ClearFiltersNeeded" pButton icon="fa-refresh" style="float:right" (click)="clearFilters(dt);" label="Clear Filters"></button>
        </div>
    </div>
    
    <p-dialog [center]="true" [resizable]="false" [height]="600" [contentHeight]="600" [width]="600" [closeOnEscape]="false" [closable]="false" [draggable]="true" [(visible)]="ShowModal" modal="modal" [showEffect]="fade">
    <edit-customer-account [IncomingModel]="PromptModel" (onCancel)="ShowModal=false;" (onDoneEdit)="onDoneEdit($event);" (onDoneAdd)="onDoneAdd($event);"></edit-customer-account>
    </p-dialog>
    </div>
    `
})






export class CustomerAccountList extends DataTableComponentBase implements OnInit {

    CustomerAccountModel: CustomerAccount = new CustomerAccount();
    ShowModal: boolean = false;
    ExportFileName: string = "customer_accounts_export.csv";
    
    constructor(private customerAccountService: CustomerAccountService) {
        super();
    }

    //absolutely need these

    ngOnInit() {

        this.buildColumns();

        this.getGridDataSource();
    }


    buildColumns() {
        this.GridColumns = [
            { field: 'Account_ID', header: 'Account ID', sortable: true, hidden: false, style: { "width": '100px' } },
            { field: 'Account_Name', header: 'Account', sortable: true, hidden: false, style: { "width": 'auto' } },
            { field: 'Account_AppNumber', header: 'Account App #', sortable: true, hidden: false, style: { "width": '150px' } }
        ];
    }

    getGridDataSource() {

        this.ShowLoading = true;

        this.customerAccountService.getCustomerAccounts()
            .map(res => <CustomerAccount[]>res.json())
            .subscribe(ca => {
                this.GridDataSource = ca;
                this.setExportString(this.GridDataSource.length); //put in an event that gets the rowcount and returns it and keep one to update button too
                this.ShowLoading = false;
            },
            err => {
                this.ShowLoading = false;
                this.showError(err, 'Error retrieving customer accounts');
            }
            );
    }

    onExport(dt: DataTable) {

        let hiddenColumns: string[] = (<Column[]>this.GridColumns).filter(e => e.hidden == true).map(w => w.field);
        
        this.doExport(dt, hiddenColumns, this.ExportFileName);
    }

    //crud operations

    addCustomerAccount() {

        this.CustomerAccountModel = new CustomerAccount();
        this.ShowModal = true;
    }

    onDoneAdd(addedRow: CustomerAccount) {

        this.GridDataSource.push(addedRow);
        this.ShowModal = false;
    }

   

   

  
    
    
}







