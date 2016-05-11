import {Component, Inject,ReflectiveInjector } from '@angular/core'
import {AgGridNg2} from 'ag-grid-ng2/main';
import {GridOptions} from 'ag-grid/main';

import {SearchComponent} from '../../common/component/searcher';

import {UserService} from '../service/user-service';

import {UserApplication} from '../service/user-application-model';


import {AuthService} from '../../common/service/auth-service';

import {CanActivate} from '@angular/router-deprecated';

import {ComponentBase} from '../../common/component/component-base';


@Component({
    directives: [AgGridNg2, SearchComponent],
    providers: [UserService],
    template: `
        


    <div class="row">
        <div class="col-md-5">
            <ag-grid-ng2 #agGrid style="height: 350px;width: 700px;" class="ag-blue" [gridOptions]="gridOptions"></ag-grid-ng2>
        </div>
    </div>

    <div class="row">
        <div class="col-md-2">
            <searcher (onSearchTermEntered) = "onSearchTermEntered($event)"></searcher>
        </div>
        <div class="col-md-2 text-right">    
            {{rowsDisplayed}}
        </div>
    </div>
    `
})

@CanActivate((next, previous) => {
    let injector: any = ReflectiveInjector.resolveAndCreate([AuthService]);
    let authService: AuthService = injector.get(AuthService);
    return authService.checkLogin(next, previous);
})  

export class UserApplicationList extends ComponentBase  {
    columnDefs: [{}];
    gridOptions: GridOptions = [];
    searchTerm: string = "";
    rowsDisplayed: string;
    userApplications: UserApplication[];
    

    constructor( @Inject(UserService) public userService: UserService) {
        
        super();
        
        this.columnDefs = [
            { headerName: "UserName", field: "UserName" },
            { headerName: "AppName", field: "strApplicationName", width: 300},
            { headerName: "App#", field: "AppNumber"}
        ];
        
        this.gridOptions = {
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableSorting: true,
            enableFilter: false,
            overlayNoRowsTemplate: "<span style='padding: 10px; border: 1px solid #444; background: lightgoldenrodyellow;'>No results</span>",
            overlayLoadingTemplate: "<span style='padding: 10px; border: 1px solid #444; background: lightgoldenrodyellow;'><i class='fa fa-spinner fa-spin'></i> Loading...</span>",

        }
        this.getUserApplications();

       

        
       

    }

    showRowMessage() {
        var model = this.gridOptions.api.getModel();
        var processedRows = model.getRowCount();
        this.rowsDisplayed = `${processedRows} of ${this.userApplications.length}`;

        this.gridOptions.api.hideOverlay();
        if (processedRows < 1) {
            //show overlay of no rows
            this.gridOptions.api.showNoRowsOverlay();

        }


    }

    onSearchTermEntered(filterValue:string) {
        console.log(filterValue);

        this.gridOptions.api.setQuickFilter(filterValue);
        this.showRowMessage();
    }
    
    getUserApplications() {


        this.userService.getUserApplications()
            .subscribe(
            ua => {

                this.userApplications = ua;

                if (this.gridOptions.api) {
                    this.gridOptions.api.setRowData(this.userApplications);
                    this.gridOptions.api.sizeColumnsToFit();
                    this.showRowMessage();
                }
            },
            err => {
                this.gridOptions.api.hideOverlay();
                 this.showErrors(err,'Error retrieving user list');
            }
            );


       
            
    }

    
}





