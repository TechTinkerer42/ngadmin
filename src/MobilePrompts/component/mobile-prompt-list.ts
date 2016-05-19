import {Component, ReflectiveInjector, OnInit} from '@angular/core'
import {MobilePromptService} from '../service/mobile-prompt-service';
import {MobilePrompt} from '../service/mobile-prompt-model';
import {ApplicationChooser} from '../../common/component/app-chooser'
import {EditMobilePrompt} from './edit-mobile-prompt';
import {AuthService} from '../../common/service/auth-service';
import {ComponentBase} from '../../common/component/component-base';

import {CanActivate} from '@angular/router-deprecated';
import {InputText, DataTable, Column, Header, Footer, Button, MenuItem, ContextMenu, Dialog, Growl, Message} from 'primeng/primeng';

@Component({
    directives: [ApplicationChooser, EditMobilePrompt, DataTable, Column, Header, Footer, Button, ContextMenu, Dialog, Growl],
    providers: [MobilePromptService],
    template: `
    <p-growl [value]="messages"></p-growl>
    
    <div *ngIf="showLoading"><i class='fa fa-spinner fa-spin'></i> Loading ...</div>
   
    <app-chooser [selectedApp]="selectedApp" (onAppChosen)="onAppChosen($event)">Loading...</app-chooser>   
    <br>
    <p-contextMenu #cm [model]="contextMenuItems"></p-contextMenu>
    
    <p-dataTable #dt [value]="mobilePrompts" selectionMode="single" [paginator]="true" [rows]="20" filterDelay="500" [contextMenu]="cm" 
    [responsive]="true" [globalFilter]="gb" resizableColumns="true" columnResizeMode="expand" [(selection)]="selectedPrompt">
    
    <header><span style="float:left">Header</span><span style="float:right">{{dt.totalRecords}} records</span></header>
    
    <p-column field="promptID" [sortable]="true" header="Id"></p-column>
    <p-column field="key" [sortable]="true" header="Key"></p-column>
    <p-column field="translation" [sortable]="true" header="Translation"></p-column>
    <p-column field="AppNum" [sortable]="true" header="App #"></p-column>
    <p-column field="language" [sortable]="true" header="Language">
        <template let-col let-prompt="rowData">{{translateLanguage(prompt[col.field])}}</template>
    </p-column>
    <p-column field="promptBehaviorType" [sortable]="true" header="Behavior Type">
        <template let-col let-prompt="rowData">{{translateBehavior(prompt[col.field])}}</template>
    </p-column>
    <p-column field="promptType" [sortable]="true" header="Prompt Type">
        <template let-col let-prompt="rowData">{{translateType(prompt[col.field])}}</template>
    </p-column>
    <p-column field="HasChild" [sortable]="true" header="Has Child"></p-column>
    <p-column field="Parent" [sortable]="true" header="Parent"></p-column>
    <p-column field="Value" [sortable]="true" header="Value"></p-column>
    </p-dataTable>
    
    <div class="ui-widget-header ui-helper-clearfix" style="padding:4px 10px;border-bottom: 0 none">
        <i class="fa fa-search" style="float:left;margin:4px 4px 0 0"></i>
        <input #gb type="text" pInputText size="50" style="float:left" placeholder="Enter Search">
        <button type="button" pButton icon="fa-plus" style="float:right" (click)="addPrompt();" label="Add Prompt"></button>
    </div>
    
    <p-dialog [resizable]="false" [height]="800" [contentHeight]="750" [width]="800" [closeOnEscape]="false" [closable]="false" [draggable]="true" [(visible)]="showModal" modal="modal" [showEffect]="fade">
    <edit-mobile-prompt [IncomingModel]="PromptModel" (onCancel)="showModal=false;" (onDoneEdit)="onDoneEdit($event);" (onDoneAdd)="onDoneAdd($event);"></edit-mobile-prompt>
    </p-dialog>
    `
})

@CanActivate((next, previous) => {
    let injector: any = ReflectiveInjector.resolveAndCreate([AuthService]);
    let authService: AuthService = injector.get(AuthService);
    return authService.checkLogin(next, previous);
})



export class MobilePromptList extends ComponentBase implements OnInit {

    mobilePrompts: MobilePrompt[];
    selectedApp: number = 15; //initial value
    selectedPrompt: MobilePrompt;
    totalTableRows: number = 0;
    showLoading: boolean = false;
    PromptModel: MobilePrompt = new MobilePrompt();
    showConfirmOption: boolean = false;
    contextMenuItems: MenuItem[];
    showModal: boolean = false;


    ngOnInit() {

        this.contextMenuItems = [
            { label: 'Edit', icon: 'fa-search', command: (event) => this.editPrompt() },
            { label: 'Delete', icon: 'fa-close', command: (event) => this.deleteMobilePrompt() }
        ];

        this.getMobilePrompts(this.selectedApp);
    }

    constructor(private mobilePromptService: MobilePromptService) {
        super();
    }



    onAppChosen(appNumber: number) {
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

    clonePrompt(p: MobilePrompt): MobilePrompt {
        let newPrompt: MobilePrompt = new MobilePrompt();
        for (let prop in p) {
            newPrompt[prop] = p[prop];
        }
        return newPrompt;
    }



    editPrompt() {
        if (this.selectedPrompt) {
            this.PromptModel = null;
            this.PromptModel = this.clonePrompt(this.selectedPrompt);
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
                this.totalTableRows = this.mobilePrompts.length;
                this.showLoading = false;

            },
            err => {
                this.showLoading = false;
                this.showErrors(err, 'Error retrieving mobile prompts');
            }
            );
    }

    translateLanguage(language: number): string {
        let temp = language;

        switch (temp) {
            case 1:
                return 'English';

            case 2:
                return 'Spanish';

            default:
                return language.toString();
        }

    }

    translateBehavior(behavior: number): string {
        let temp = behavior;

        switch (temp) {
            case 0:
                return 'Regular';

            case 1:
                return 'Confirmation';

            default:
                return behavior.toString();
        }

    }

    translateType(type: number): string {
        let temp = type;

        switch (temp) {
            case 1:
                return 'Regular';

            case 2:
                return 'Yes/No';

            default:
                return type.toString();
        }

    }







}



