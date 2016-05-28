import {Component, ReflectiveInjector, OnInit, TemplateRef} from '@angular/core'
import {MobilePromptService} from '../service/mobile-prompt-service';
import {MobilePrompt} from '../service/mobile-prompt-model';
import {ApplicationChooser} from '../../common/component/app-chooser'
import {Loading} from '../../common/component/loading'

import {EditMobilePrompt} from './edit-mobile-prompt';
import {AuthService} from '../../common/service/auth-service';
import {DataTableComponentBase} from '../../common/component/datatable-component-base';
import {CanActivate} from '@angular/router-deprecated';
import {InputText, DataTable, Column, Header, Footer, Button, ContextMenu, Dialog,Checkbox} from 'primeng/primeng';

@Component({
    directives: [ApplicationChooser, EditMobilePrompt, DataTable, Column, Header, Footer, Button, ContextMenu, Dialog, Loading,Checkbox],
    providers: [MobilePromptService],
    template: `
    <div class="col-md-12">
    <loading LoadingMessage="Loading..." [ShowLoading]="ShowLoading"></loading>
    <app-chooser [selectedApp]="SelectedApp" (onAppChosen)="onAppChosen($event,dt)">Loading...</app-chooser>
    <br>

    <p-contextMenu #cm [model]="ContextMenuItems"></p-contextMenu>

    <p-dataTable #dt [value]="GridDataSource" selectionMode="single" [paginator]="true" [rows]="NumberOfGridRows" filterDelay="0" [contextMenu]="cm" 
    [globalFilter]="gb" resizableColumns="true" columnResizeMode="expand" [(selection)]="SelectedPrompt" (onFilter)="filterGrid(dt)">
    <p-column [filter]="true" filterMatchMode="contains" *ngFor="let col of GridColumns" [sortable]="col.sortable" [field]="col.field" [header]="col.header" [hidden]="col.hidden" [style]="col.style">
    </p-column>
    </p-dataTable>
        
    <div class="ui-widget-header ui-helper-clearfix" style="padding:4px 10px;border-bottom: 0 none">
        <div>
        <i class="fa fa-search" style="float:left;margin:4px 4px 0 0"></i>
        <input #gb type="text" pInputText size="50" style="float:left:padding-right:20px;" placeholder="Enter Search">
        <button *ngIf="ShowExportButton" type="button" pButton icon="fa-file-excel-o" (click)="onExport(dt);" [label]="ExportString"></button>
        
        <button type="button" pButton icon="fa-plus" style="float:right" (click)="addPrompt();" label="Add Prompt"></button>
        <button type="button" pButton icon="fa-eye" style="float:right" (click)="ShowColumnPicker=true" label="Column Visibility"></button>
        <button type="button" *ngIf="ClearFiltersNeeded" pButton icon="fa-refresh" style="float:right" (click)="clearFilters(dt);" label="Clear Filters"></button>
        </div>
    </div>
    
    <p-dialog  [center]="true" [resizable]="false" [height]="800" [contentHeight]="750" [width]="800" [closeOnEscape]="false" [closable]="false" [draggable]="true" [(visible)]="ShowModal" modal="modal" [showEffect]="fade">
    <edit-mobile-prompt [IncomingModel]="PromptModel" (onCancel)="ShowModal=false;" (onDoneEdit)="onDoneEdit($event);" (onDoneAdd)="onDoneAdd($event);"></edit-mobile-prompt>
    </p-dialog>
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










export class MobilePromptList extends DataTableComponentBase implements OnInit {

    
    SelectedApp: number = 15; //initial value
    SelectedPrompt: MobilePrompt;
    PromptModel: MobilePrompt = new MobilePrompt();
    ShowModal: boolean = false;
    ExportFileName: string = "mobile_prompt_export.csv";
    
    constructor(private mobilePromptService: MobilePromptService) {
        super();
    }

    //absolutely need these

    ngOnInit() {
                
        this.ContextMenuItems = [
            { label: 'Edit Prompt', icon: 'fa-edit', command: (event) => this.editPrompt() },
            { label: 'Delete Prompt', icon: 'fa-close', command: (event) => this.deleteMobilePrompt() }

        ];

        this.buildColumns();

        this.buildContextColumns();

        this.getGridDataSource(this.SelectedApp);
    }

    buildColumns() {
        this.GridColumns = [
            { field: 'promptID', header: 'Id', sortable: true, hidden: false, style: { "width": '60px' } },
            { field: 'key', header: 'Key', sortable: true, hidden: false, style: { "width": '200px' } },
            { field: 'translation', header: 'Translation', sortable: true, hidden: false, style: { "width": 'auto' } },
            { field: 'AppNum', header: 'App #', sortable: true, hidden: false, style: { "width": '75px' } },
            { field: 'languageFriendly', header: 'Language', sortable: true, hidden: false, style: { "width": '100px' } },
            { field: 'promptBehaviorTypeFriendly', header: 'Behavior Type', sortable: true, hidden: false, style: { "width": '100px' } },
            { field: 'promptTypeFriendly', header: 'Type', sortable: true, hidden: false, style: { "width": '100px' } },
            { field: 'HasChild', header: 'Has Child', sortable: true, hidden: false, style: { "width": '75px' } },
            { field: 'Parent', header: 'Parent', sortable: true, hidden: false, style: { "width": '75px' } },
            { field: 'Value', header: 'Value', sortable: true, hidden: false, style: { "width": '75px' } }
        ];
    }

    getGridDataSource(appNumber: Number) {

        this.mobilePromptService.getMobilePrompts(appNumber)
            .map(res => <MobilePrompt[]>res.json())
            .subscribe(mp => {
                this.GridDataSource = mp;
                this.setExportString(this.GridDataSource.length); //put in an event that gets the rowcount and returns it and keep one to update button too
                this.ShowLoading = false;
            },
            err => {
                this.ShowLoading = false;
                this.showError(err, 'Error retrieving mobile prompts');
            }
            );
    }

    onExport(dt: DataTable) {

        let hiddenColumns: string[] = (<Column[]>this.GridColumns).filter(e => e.hidden == true).map(w => w.field);
        hiddenColumns.push("language");
        hiddenColumns.push("promptType");
        hiddenColumns.push("promptBehaviorType"); //hide the non friendly columns

        this.doExport(dt, hiddenColumns, this.ExportFileName);
    }

    //crud operations

    addPrompt() {

        this.PromptModel = new MobilePrompt();
        this.PromptModel.AppNum = this.SelectedApp;
        this.ShowModal = true;
    }

    onDoneAdd(addedRow: MobilePrompt) {

        this.GridDataSource.push(addedRow);
        this.ShowModal = false;
    }

    deleteMobilePrompt() {
        if (this.SelectedPrompt) {

            var conf = confirm('Are you sure?');

            if (conf) {
                let promptID = this.SelectedPrompt.promptID;
                this.mobilePromptService.deleteMobilePrompt(promptID)
                    .subscribe(
                    mp => {
                        this.GridDataSource = this.GridDataSource.filter(x => x.promptID != promptID);
                    },
                    err => {
                        console.log(err);
                        this.showError(err, 'Error deleting mobile prompt');
                    }
                    );
            }
        }
    }

    editPrompt() {
        if (this.SelectedPrompt) {
            this.PromptModel = null;
            this.PromptModel = this.cloneObject(this.SelectedPrompt);
            this.ShowModal = true;
        }
    }

    onDoneEdit(changedRow: MobilePrompt) {

        this.ShowModal = false;

        var foundPrompt = this.GridDataSource.filter(x => x.promptID == changedRow.promptID);

        if (foundPrompt[0]) {
            this.GridDataSource[this.GridDataSource.indexOf(foundPrompt[0])] = changedRow;
        }
    }
    
    onAppChosen(appNumber: number, dt: DataTable) {
        this.ShowLoading = true;
        dt.reset();
        this.SelectedApp = appNumber;
        this.getGridDataSource(appNumber); //initial data load
    }
}