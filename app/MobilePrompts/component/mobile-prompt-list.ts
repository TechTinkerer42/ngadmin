import {Component, Inject,ReflectiveInjector} from '@angular/core'
import {AgGridNg2} from 'ag-grid-ng2/main';
import {GridOptions} from 'ag-grid/main';
import {SearchComponent} from '../../common/component/searcher';
import {MobilePromptService} from '../service/mobile-prompt-service';
import {MobilePrompt} from '../service/mobile-prompt-model';

import {ApplicationChooser} from '../../common/component/app-chooser'
import {MODAL_DIRECTIVES} from 'ng2-bs3-modal/ng2-bs3-modal';
import {EditMobilePrompt} from './edit-mobile-prompt';
import {AuthService} from '../../common/service/auth-service';
import {ComponentBase} from '../../common/component/component-base';

import {CanActivate} from '@angular/router-deprecated';



@Component({
    directives: [AgGridNg2, SearchComponent,  ApplicationChooser, MODAL_DIRECTIVES, EditMobilePrompt],
    providers: [MobilePromptService],
    template: `
    
    <modal #modal size="lg" keyboard="false" [animation]="false">
        <modal-header [show-close]="false">
            <h4 style="float:left" class="modal-title">{{action}} Prompt</h4>
            <a style="float:right" *ngIf="PromptModel.promptID != -1 && !showConfirmOption" class="btn btn-primary" (click)="showConfirmOption=true;">Delete Prompt</a>
            <div *ngIf="showConfirmOption" style="float:right">
                <a class="btn btn-success" (click)="modal.close();deleteMobilePrompt(PromptModel.promptID)">Delete It</a>
                <a class="btn btn-default" (click)="showConfirmOption=false">Keep It</a> 
            </div>

        </modal-header>
        <modal-body>
            <edit-mobile-prompt [IncomingModel]="PromptModel" (onCancel)="modal.close();" (onDoneEdit)="onDoneEdit(modal,$event);" (onDoneAdd)="onDoneAdd(modal,$event);"></edit-mobile-prompt>
        </modal-body>
    </modal>


    <div class="row">
        <div class="col-md-4">                                                                                                          
            <div class="form-group">
                <app-chooser [selectedApp]="selectedApp" (onAppChosen)="onAppChosen($event)">Loading...</app-chooser>                
            </div>
        </div>
        <div class="col-md-3 col-md-offset-4">
            <button type="button" class="btn btn-primary" (click)="openModal(modal,'Add');">Add Prompt</button>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <ag-grid-ng2 #agGrid style="height: 400px;" class="ag-blue" (rowDoubleClicked)="onRowDoubleClicked(modal)" [gridOptions]="gridOptions"></ag-grid-ng2>
        </div>
    </div>

    <div class="row">
        <div class="col-md-2">
            <searcher (onSearchTermEntered) = "onSearchTermEntered($event)"></searcher>
        </div>
        <div class="col-md-2 col-md-offset-6">    
            Rows: {{rowsDisplayed}}
        </div>
    </div>
    `
})
    
@CanActivate((next, previous) => {
    let injector: any = ReflectiveInjector.resolveAndCreate([AuthService]);
    let authService: AuthService = injector.get(AuthService);
    return authService.checkLogin(next, previous);
})  



export class MobilePromptList extends ComponentBase {
    columnDefs: [{}];
    gridOptions: GridOptions = [];
    searchTerm: string = "";
    rowsDisplayed: string;
    mobilePrompts: MobilePrompt[];
    selectedApp: number = 15; //initial value
    
    action: string;

    PromptModel: MobilePrompt = new MobilePrompt();

    showConfirmOption: boolean = false;

    constructor( @Inject(MobilePromptService) public mobilePromptService: MobilePromptService) { 
        
        this.columnDefs = [
            { headerName: "ID", field: "promptID", width: 75 },
            { headerName: "Key", field: "key"},
            { headerName: "Translation", field: "translation"},
            { headerName: "App #", field: "AppNum", width: 75},
            { headerName: "Language", field: "language", width: 95, valueGetter: this.languageValueGetter},
            { headerName: "Behavior Type", field: "promptBehaviorType", width: 120, valueGetter: this.behaviorValueGetter },
            { headerName: "Prompt Type", field: "promptType", width: 120, valueGetter: this.typeValueGetter},
            { headerName: "Child", field: "HasChild", width: 75 },
            { headerName: "Parent", field: "Parent", width: 75},
            { headerName: "Value", field: "Value", width: 75 }
        ];

        this.gridOptions = {
            columnDefs: this.columnDefs,
            enableColResize: true,
            rowHeight : 50,
            enableSorting: true,
            rowSelection: 'single',
            enableFilter: true,
            overlayNoRowsTemplate: "<span style='padding: 10px; border: 1px solid #444; background: lightgoldenrodyellow;'>No results</span>",
            overlayLoadingTemplate: "<span style='padding: 10px; border: 1px solid #444; background: lightgoldenrodyellow;'><i class='fa fa-spinner fa-spin'></i> Loading...</span>",
        }   
        
        this.getMobilePrompts(this.selectedApp);
    }

    openModal(modal:any, action:string) {
        this.action = action;
        if (action === 'Add') {
            
            this.PromptModel = new MobilePrompt();
            this.PromptModel.AppNum = this.selectedApp;

            this.gridOptions.api.deselectAll();
        }
        
        modal.open();
    }

    onDoneAdd(modal:any,addedRow:MobilePrompt) {

        modal.close();

        this.mobilePrompts.push(addedRow);

        if (this.gridOptions.api) {
            this.gridOptions.api.setRowData(this.mobilePrompts);
            this.showRowMessage();
        }
    }

    onDoneEdit(modal:any,changedRow:MobilePrompt) {
        
        modal.close();

        var foundPrompt = this.mobilePrompts.filter(x => x.promptID == changedRow.promptID);

        if (foundPrompt[0]) {

            this.mobilePrompts[this.mobilePrompts.indexOf(foundPrompt[0])] = changedRow;
        }
        

        if (this.gridOptions.api) {
            this.gridOptions.api.setRowData(this.mobilePrompts);
        }
    }

    onAppChosen(appNumber:number) {
        this.selectedApp = appNumber;
        this.getMobilePrompts(appNumber); //initial data load
    }

   

    deleteMobilePrompt(promptID:number) {
        //console.log(promptID);
        this.mobilePromptService.deleteMobilePrompt(promptID)
            .subscribe(
            mp => {

                this.mobilePrompts = this.mobilePrompts.filter(x => x.promptID != promptID);

                if (this.gridOptions.api) {
                    this.gridOptions.api.setRowData(this.mobilePrompts);
                    this.gridOptions.api.sizeColumnsToFit();
                    this.showRowMessage();
                }
            },
            err => {

                console.log(err);
                this.gridOptions.api.hideOverlay();
                alert("Error deleting mobile prompt");
            }
            );
    }

    clonePrompt(p: MobilePrompt): MobilePrompt {
        let newPrompt = new MobilePrompt();
        for (let prop in p) {
            newPrompt[prop] = p[prop];
        }
        return newPrompt;
    }
  

    onRowDoubleClicked(modal:any) {
        let selectedRowsExist = this.gridOptions.api.getSelectedRows();
        if (selectedRowsExist) {
            this.PromptModel = this.clonePrompt(selectedRowsExist[0]);
            this.openModal(modal, 'Edit');
        }
    }
    
    showRowMessage() {
        var model = this.gridOptions.api.getModel();
        var processedRows = model.getRowCount();
        this.rowsDisplayed = `${processedRows} of ${this.mobilePrompts.length}`;

        this.gridOptions.api.hideOverlay();
        if (processedRows < 1) {
            this.gridOptions.api.showNoRowsOverlay();
        }
    }

    onSearchTermEntered(filterValue:string) {
        this.gridOptions.api.deselectAll();
        this.gridOptions.api.setQuickFilter(filterValue);
        this.showRowMessage();
        this.PromptModel = new MobilePrompt();
    }
    
    getMobilePrompts(appNumber: Number) {
        if (this.gridOptions.api) {
            this.gridOptions.api.showLoadingOverlay();
        }

        this.mobilePromptService.getMobilePrompts(appNumber)
            .subscribe(
            mp => {
                this.mobilePrompts = mp.json();
                
                if (this.gridOptions.api) {
                    this.gridOptions.api.setRowData(this.mobilePrompts);
                    this.gridOptions.api.sizeColumnsToFit();
                    this.showRowMessage();
                }
            },
            err => {
                this.gridOptions.api.hideOverlay();
                this.showErrors(err);
            }
            );
    }

     //grid 

    languageValueGetter(params:any) {
        let language = '';

        switch (params.data.language) {
            case 1:
                language = 'English';
                break;
            case 2:
                language = 'Spanish';
                break;
        }
        return language;
    }

    behaviorValueGetter(params:any) {
        let behavior = '';

        switch (params.data.promptBehaviorType) {
            case 0:
                behavior = 'Regular';
                break;
            case 1:
                behavior = 'Confirmation';
                break;

        }
        return behavior;
    }

    typeValueGetter(params:any) {
        let type = '';

        switch (params.data.promptType) {
            case 1:
                type = 'Regular';
                break;
            case 2:
                type = 'Yes/No';
                break;
        }
        return type;
    }
   
}



