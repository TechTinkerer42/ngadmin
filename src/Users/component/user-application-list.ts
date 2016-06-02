
import {Component, ReflectiveInjector, OnInit, TemplateRef} from '@angular/core'
import {UserService} from '../service/user-service';
import {UserApplication} from '../service/user-application-model';
import {Loading} from '../../common/component/loading'

import {AuthService} from '../../common/service/auth-service';
import {DataTableComponentBase} from '../../common/component/datatable-component-base';
import {CanActivate} from '@angular/router-deprecated';
import {DataTable, Column, Header, Button,Checkbox,Dialog} from 'primeng/primeng';

@Component({
    directives: [DataTable, Column, Header, Button, Loading,Checkbox,Dialog],
    providers: [UserService],
    template: `
    <div class="col-md-12">
    <loading LoadingMessage="Loading..." [ShowLoading]="ShowLoading"></loading>

    <p-contextMenu #cm [model]="ContextMenuItems"></p-contextMenu>

    <p-dataTable #dt [value]="GridDataSource" selectionMode="single" [paginator]="true" [rows]="NumberOfGridRows" filterDelay="0"  
    [globalFilter]="gb" resizableColumns="true"  (onFilter)="filterGrid(dt)">
    <p-column [filter]="true" filterMatchMode="contains" *ngFor="let col of GridColumns" [style]="col.style" [sortable]="col.sortable" [field]="col.field" [header]="col.header" [hidden]="col.hidden">
    </p-column>
    </p-dataTable>
        
    <div class="ui-widget-header ui-helper-clearfix" style="padding:4px 10px;border-bottom: 0 none">
        <div>
        <i class="fa fa-search" style="float:left;margin:4px 4px 0 0"></i>
        <input #gb type="text" pInputText size="50" style="float:left:padding-right:20px;" placeholder="Enter Search">
        <button *ngIf="ShowExportButton" type="button" pButton icon="fa-file-excel-o" (click)="onExport(dt);" [label]="ExportString"></button>
        <button type="button" pButton icon="fa-eye" style="float:right" (click)="ShowColumnPicker=true" label="Column Visibility"></button>
        <button type="button" *ngIf="ClearFiltersNeeded" pButton icon="fa-refresh" style="float:right" (click)="clearFilters(dt);" label="Clear Filters"></button>
        </div>
    </div>
    </div>
    
    <p-dialog modal="true"  [center]="true" [resizable]="false" [height]="600" [contentHeight]="600" [width]="400" closeOnEscape="true" [closable]="true" [draggable]="false" [(visible)]="ShowColumnPicker" [showEffect]="fade">
    <div class="ui-grid-col-1">
    <p-checkbox #cball (onChange)="checkAll($event)"></p-checkbox>
    </div>
    <div class="ui-grid-col-11"><label class="ui-widget">{{cball.checked ? 'Select None' : 'Select All'}}</label></div>  
    <div *ngFor="let col of GridColumns">
        <div class="ui-grid-col-1">
            <p-checkbox [ngModel]="!col.hidden" (onChange)="checkBoxChanged($event,col)"></p-checkbox>
        </div>
        <div class="ui-grid-col-11"><label class="ui-widget">{{col.header}}</label></div>    
    </div>
    </p-dialog>
    
  
    `
})



@CanActivate((next, previous) => {
    let injector: any = ReflectiveInjector.resolveAndCreate([AuthService]);
    let authService: AuthService = injector.get(AuthService);
    return authService.checkLogin(next, previous);
})



export class UserApplicationList extends DataTableComponentBase implements OnInit {
    
    whatever:boolean = false;
    
    ExportFileName: string = "user_applications.csv";
    
    constructor(private userService: UserService) {
        super();
    }

    //absolutely need these

    ngOnInit() {

        this.buildColumns();

        this.getGridDataSource();
    }

    buildColumns() {
        
        this.GridColumns = [
            { field: 'UserName', header: 'User Name', sortable: true, hidden: false, style: { "width": 'auto' } },
            { field: 'strApplicationName', header: 'App Name', sortable: true, hidden: false, style: { "width": 'auto' } },
            { field: 'AppNumber', header: 'App #', sortable: true, hidden: false, style: { "width": '100px' } }
        ];
    }

    getGridDataSource() {

        this.ShowLoading = true;

        this.userService.getUserApplications()
            .subscribe(ua => {
                this.GridDataSource = ua;
                this.setExportString(this.GridDataSource.length); //put in an event that gets the rowcount and returns it and keep one to update button too
                this.ShowLoading = false;
            },
            err => {
                this.ShowLoading = false;
                this.showError(err, 'Error retrieving users');
            }
            );
            
    }

    onExport(dt: DataTable) {

        let hiddenColumns: string[] = (<Column[]>this.GridColumns).filter(e => e.hidden == true).map(w => w.field);
        this.doExport(hiddenColumns, this.ExportFileName);
    }

  

   
   

    

   

   
    
    
}



        





