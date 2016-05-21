import {Component, ReflectiveInjector, OnInit, TemplateRef} from '@angular/core'
import {MobilePromptService} from '../service/mobile-prompt-service';
import {MobilePrompt} from '../service/mobile-prompt-model';
import {ApplicationChooser} from '../../common/component/app-chooser'
import {Loading} from '../../common/component/loading'
import {EditMobilePrompt} from './edit-mobile-prompt';
import {AuthService} from '../../common/service/auth-service';
import {DataTableComponentBase} from '../../common/component/datatable-component-base';
import {CanActivate} from '@angular/router-deprecated';
import {InputText, DataTable, Column, Header, Footer, Button, ContextMenu, Dialog, Growl, Message} from 'primeng/primeng';

@Component({
    directives: [ApplicationChooser, EditMobilePrompt, DataTable, Column, Header, Footer, Button, ContextMenu, Dialog, Growl,Loading],
    providers: [MobilePromptService],
    template: `
    <p-growl [value]="messages"></p-growl>
    
    <loading message="Loading..." [showLoading]="showLoading"></loading>
    
    <app-chooser [selectedApp]="selectedApp" (onAppChosen)="onAppChosen($event,dt)">Loading...</app-chooser>
    <br>

    <p-contextMenu #cm [model]="contextMenuItems"></p-contextMenu>

    <p-dataTable #dt [value]="mobilePrompts" selectionMode="single" [paginator]="true" [rows]="20" filterDelay="250" [contextMenu]="cm" 
    [responsive]="true" [globalFilter]="gb" resizableColumns="true" columnResizeMode="expand" [(selection)]="selectedPrompt" (onFilter)="onFilter(dt)">
    <p-column *ngFor="let col of cols" [sortable]="col.sortable" [field]="col.field" [header]="col.header" [hidden]="col.hidden">
    </p-column>
    </p-dataTable>
        
    <div class="ui-widget-header ui-helper-clearfix" style="padding:4px 10px;border-bottom: 0 none">
        <div>
        <i class="fa fa-search" style="float:left;margin:4px 4px 0 0"></i>
        <input #gb type="text" pInputText size="50" style="float:left:padding-right:20px;" placeholder="Enter Search">
        <button *ngIf="dt.totalRecords > 0" type="button" pButton icon="fa-file-excel-o" (click)="onExport(dt);" [label]="exportString"></button>
        <button type="button" pButton icon="fa-plus" style="float:right" (click)="addPrompt();" label="Add Prompt"></button>
        </div>
    </div>
    
    <p-dialog [center]="true" [resizable]="false" [height]="800" [contentHeight]="750" [width]="800" [closeOnEscape]="false" [closable]="false" [draggable]="true" [(visible)]="showModal" modal="modal" [showEffect]="fade">
    <edit-mobile-prompt [IncomingModel]="PromptModel" (onCancel)="showModal=false;" (onDoneEdit)="onDoneEdit($event);" (onDoneAdd)="onDoneAdd($event);"></edit-mobile-prompt>
    </p-dialog>
    `
})



@CanActivate((next, previous) => {
    let injector: any = ReflectiveInjector.resolveAndCreate([AuthService]);
    let authService: AuthService = injector.get(AuthService);
    return authService.checkLogin(next, previous);
})



export class MobilePromptList extends DataTableComponentBase implements OnInit {

    mobilePrompts: MobilePrompt[];
    selectedApp: number = 15; //initial value
    selectedPrompt: MobilePrompt;
    showLoading: boolean = false;
    PromptModel: MobilePrompt = new MobilePrompt();
    showModal: boolean = false;
    exportFileName: string = "mobile_prompt_export.csv";

    constructor(private mobilePromptService: MobilePromptService) {
        super();
    }

    ngOnInit() {

        this.contextMenuItems = [
            { label: 'Edit', icon: 'fa-edit', command: (event) => this.editPrompt() },
            { label: 'Delete', icon: 'fa-close', command: (event) => this.deleteMobilePrompt() }
        ];

        this.buildColumns();

        this.buildContextColumns();

        this.getMobilePrompts(this.selectedApp);
    }

    buildColumns() {
        this.cols = [
            { field: 'promptID', header: 'Id', sortable: true, hidden: false },
            { field: 'key', header: 'Key', sortable: true, hidden: false },
            { field: 'translation', header: 'Translation', sortable: true, hidden: false },
            { field: 'AppNum', header: 'App #', sortable: true, hidden: false },
            { field: 'languageFriendly', header: 'Language', sortable: true, hidden: false },
            { field: 'promptBehaviorTypeFriendly', header: 'Behavior Type', sortable: true, hidden: false },
            { field: 'promptTypeFriendly', header: 'Type', sortable: true, hidden: false },
            { field: 'HasChild', header: 'Has Child', sortable: true, hidden: false },
            { field: 'Parent', header: 'Parent', sortable: true, hidden: false },
            { field: 'Value', header: 'Value', sortable: true, hidden: false }
        ];
    }

    onFilter(dt: DataTable) {
        let filteredData: MobilePrompt[] = (<any>dt).filteredValue;
        if (filteredData != null) {
            this.setExportString(filteredData.length);
        }
        else {
            this.setExportString(this.mobilePrompts.length);
        }
    }

    onExport(dt: DataTable) {
        
        let hiddenColumns: string[] = (<Column[]>this.cols).filter(e => e.hidden == true).map(w => w.field);
        hiddenColumns.push("language");
        hiddenColumns.push("promptType");
        hiddenColumns.push("promptBehaviorType"); //hide the non friendly columns
        
        this.doExport(dt, this.mobilePrompts, this.cols, hiddenColumns,this.exportFileName);
    }

    onAppChosen(appNumber: number, dt: DataTable) {
        dt.reset();
        this.selectedApp = appNumber;
        this.getMobilePrompts(appNumber); //initial data load
    }

    addPrompt() {

        this.PromptModel = new MobilePrompt();
        this.PromptModel.AppNum = this.selectedApp;
        this.showModal = true;
    }

    onDoneAdd(addedRow: MobilePrompt) {

        this.mobilePrompts.push(addedRow);
        this.showModal = false;
    }

    deleteMobilePrompt() {
        if (this.selectedPrompt) {

            var conf = confirm('Are you sure?');

            if (conf) {
                let promptID = this.selectedPrompt.promptID;
                this.mobilePromptService.deleteMobilePrompt(promptID)
                    .subscribe(
                    mp => {
                        this.mobilePrompts = this.mobilePrompts.filter(x => x.promptID != promptID);
                        this.showGrowl('Prompt deleted', 'info', '');
                    },
                    err => {
                        console.log(err);
                        alert("Error deleting mobile prompt");
                    }
                    );
            }
        }
    }

    editPrompt() {
        if (this.selectedPrompt) {
            this.PromptModel = null;
            this.PromptModel = this.cloneObject(this.selectedPrompt);
            this.showModal = true;
        }
    }

    onDoneEdit(changedRow: MobilePrompt) {

        this.showModal = false;

        var foundPrompt = this.mobilePrompts.filter(x => x.promptID == changedRow.promptID);

        if (foundPrompt[0]) {
            this.mobilePrompts[this.mobilePrompts.indexOf(foundPrompt[0])] = changedRow;
        }
    }

    getMobilePrompts(appNumber: Number) {

        this.showLoading = true;

        this.mobilePromptService.getMobilePrompts(appNumber)
            .map(res => <MobilePrompt[]>res.json())
            .subscribe(mp => {
                this.mobilePrompts = mp;
                this.setExportString(this.mobilePrompts.length);
                this.showLoading = false;
            },
            err => {
                this.showLoading = false;
                this.showErrors(err, 'Error retrieving mobile prompts');
            }
            );
    }










}



