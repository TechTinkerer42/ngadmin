import {Component, EventEmitter, Input,ReflectiveInjector} from '@angular/core'
import {ControlGroup, FormBuilder, Validators, AbstractControl, FORM_DIRECTIVES} from '@angular/common';

import {ControlMessages} from '../../common/component/control-messages-component';
import {MessagePanel} from '../../common/component/message-panel';
import {ValidationService} from '../../common/service/validation-service';
import {ComponentBase} from '../../common/component/component-base';
import {AuthService} from '../../common/service/auth-service';
import {CanActivate} from '@angular/router-deprecated';

import {FileImporterService} from '../service/file-importer-service'; 
import {MODAL_DIRECTIVES} from 'ng2-bs3-modal/ng2-bs3-modal';
import {FileImportColumn} from '../service/file-import-column-model'
import {Response} from '@angular/http';

@CanActivate((next, previous) => {
    let injector: any = ReflectiveInjector.resolveAndCreate([AuthService]);
    let authService: AuthService = injector.get(AuthService);
    return authService.checkLogin(next, previous);
})  



@Component({
    providers: [FileImporterService],
    directives: [ControlMessages, FORM_DIRECTIVES, MessagePanel, MODAL_DIRECTIVES],
    template: `

    <modal #modal size="lg" keyboard="true" [animation]="false">
        <modal-body>
        <ul>
            <li *ngFor="let s of sampleData">{{s}}</li>
        </ul>
        </modal-body>
    </modal>

    <form [ngFormModel]="fileImportForm">    
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <message-panel [alertMessage]="alertMessage" [alertType]="alertType"></message-panel>
            </div>
        </div>
        <div class="row">
            <div class="form-group col-md-3">
                <div><label for="fileType" class="control-label">File Type:</label></div>

                <div>
                    <select [ngFormControl]="fileType" class="form-control" (change)="alertMessage=''" #ft>
                        <option value=""></option>
                        <option value="xlsx">xlsx</option>
                        <option value="xls">xls</option>
                    </select>
                </div>
            </div>
            
        </div>
        <div class="row">
            <div class="form-group col-md-4" *ngIf="ft.value">
                <div><label for="excelFile" class="control-label">File:</label></div>
                <input type="file" [ngFormControl]="excelFile" (change)="fileChangeEvent($event)" placeholder="Upload file..." />
                <button type="button" *ngIf="fileWasUploaded" class="btn btn-default" (click)="submitImportForm(false)">Re-upload</button>
            </div>
        </div>
        <div class="row">
            <div class="form-group col-md-3" *ngIf="fileImportTables">
                <div><label for="tableChooser" class="control-label">Table:</label></div>
                <div class="input-group">
                    <select [ngFormControl]="tableChooser" class="form-control" #table (change)="getFileUploadColumns(table.value)">
                    <option value="{{t}}" *ngFor="let t of fileImportTables">{{t}}</option>
                    </select>
                    <span class="input-group-btn">
                    <button type="button" *ngIf="sampleData" class="btn btn-default" (click)="modal.open()">Sample</button>
                    </span>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="form-group col-md-7" *ngIf="fileImportColumns.length > 0">
                <div><label for="colChooser" class="control-label">Columns:</label></div>

                <div *ngFor="let col of fileImportColumns;let i = index" class="form-group">
                    <div class="row">
                        <div class="col-md-3">{{col.ColumnName}}</div>
                        <div class="col-md-3"><input type="text" [(ngModel)]="col.RenamedName" (click)="templatePickerShowing=false;setupTemplateChooser(i,$event);"  /></div>
                    </div>
                </div>
            </div>
            <div *ngIf="templatePickerShowing" class="btn-group-vertical">
                <button type="button" class="btn btn-default" *ngFor="let t of TemplateFields" (click)="setTemplate(t)">{{t}}</button>
            </div>
            
        </div>
        
        <div class="row" *ngIf="fileImportColumns.length > 0">
            <button type="button" class="btn btn-default" (click)="processColumns();">Go</button>
        </div>

        <div class="row">
            <div class="col-md-5">
                <div [hidden]="!waiting"><i class="fa fa-spinner fa-spin"></i> Please wait...</div>
            </div>
        </div>
    </div>
    </form>
  `
})


export class FileImporter extends ComponentBase {
    constructor(
        private fb: FormBuilder,
        private fileImporterService: FileImporterService) {
        super();

        this.buildForm();
    }

    TemplateFields: Array<string> = [
        'Store_ApplicationNum', 'Store_CustomerNumber', 'Store_Active', 'BusinessLine',
        'Store_Name', 'Store_Number',
        'Store_Address', 'Store_City', 'Store_State', 'Store_Zip', 'Store_Country', 'Store_Region',
        'Store_Vendor','Store_Phone', 'Store_District', 'Store_Manager', 'Store_AcctManager',
        'Store_TimeZoneAdjustment', 'Store_LongLat',
        'Store_VendorMessagingAddresses','Store_DistrictMessagingAddresses', 'Store_StoreMessagingAddresses',
        'Store_StartTime_Mon', 'Store_StartTime_Tue', 'Store_StartTime_Wed', 'Store_StartTime_Thu', 'Store_StartTime_Fri',
        'Store_StartTime_Sat', 'Store_StartTime_Sun'
    ];

    
    templatePickerShowing: boolean = false;

    fileImportTables: Array<string>;

    fileImportColumns = new Array<FileImportColumn>();

    showSampleData: boolean = true;

    waiting: boolean = false;
    alertMessage: string;
    alertType: string;
    chosenIndex: number = 0;
    chosenControl: any;
    sampleData: string;

    filesToUpload: Array<File> = [];
    fileWasUploaded: boolean = false;

    fileImportForm: ControlGroup;
    fileType: AbstractControl;
    excelFile: AbstractControl;
    tableChooser: AbstractControl;

    toggleSampleData() {
        if (this.showSampleData) {
            this.showSampleData = false;
        }
        else {
            this.showSampleData = true;
        }
    }

    
    setupFileImportColumns() {
        this.fileImportColumns = new Array<FileImportColumn>();

        this.fileImportColumns.push(new FileImportColumn("Store_ApplicationNum",true));
        this.fileImportColumns.push(new FileImportColumn("Store_CustomerNumber", true));
        this.fileImportColumns.push(new FileImportColumn("BusinessLine", true));
        this.fileImportColumns.push(new FileImportColumn("Store_Active", true));
    }

    processColumns() {

        var confirmed: boolean = true;

        //check to make sure all values filled out
        var countMissing = this.fileImportColumns.filter(x => x.IsValueColumn && x.RenamedName.length < 1).length;
        
        if (countMissing > 0) {
            confirmed = confirm('There are required fields that are not populated. Are you sure?');
        }


        if (confirmed) {
            this.waiting = true;

            this.fileImporterService.processFileImportColumns(this.tableChooser.value, this.fileImportColumns)
                .subscribe(
                col => {
                    this.waiting = false;
                    
                    let alertMessage = 'File Imported Successfully.';

                    let res: any = col;

                    if (res._body) {
                        alertMessage += " Distinct Customer Numbers: " + res._body;
                    }
                    
                    this.alertMessage = alertMessage
                    this.alertType = "info";

                    this.buildForm();

                },
                err => {
                    this.waiting = false;
                    
                    this.showError(err,'System Error Occurred');
                    
                }
                );
        }

        
        
    }

    
    
    
    setupTemplateChooser(index:number, event:any) {
        this.chosenIndex = index;
        this.chosenControl = event.target;

        if (!this.fileImportColumns[this.chosenIndex].IsValueColumn) {
            this.templatePickerShowing = true;
        }

        

    }

    setTemplate(text:string) {

        this.templatePickerShowing = false;
        this.fileImportColumns[this.chosenIndex].RenamedName = text;
        this.chosenControl.value = text;
        
    }

    

    buildForm() {

        this.fileWasUploaded = false;
        this.templatePickerShowing = false;
        this.fileImportTables = null;
        this.fileImportColumns = new Array<FileImportColumn>();
        
        this.fileImportForm = this.fb.group({
            'fileType': [''],
            'excelFile': [''],
            'tableChooser': ['']
        });

        this.fileType = this.fileImportForm.controls['fileType'];
        this.excelFile = this.fileImportForm.controls['excelFile'];
        this.tableChooser = this.fileImportForm.controls['tableChooser'];
        
        


    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;

        this.fileWasUploaded = false;
        if (this.filesToUpload.length > 0) {
            this.fileWasUploaded = true;
            this.fileImportForm.markAsDirty();
            
            this.submitImportForm();
        }
    }

  
    submitImportForm(populateTables: boolean = true) {

        var formData = this.fileImportForm.value;

        var data = { fileType: formData.fileType, filesToUpload: this.filesToUpload }

        this.waiting = true;

        this.fileImporterService.uploadFileToImport(data)
            .then((result) => {
                this.waiting = false;

                if (populateTables) {
                    this.fileImportTables = <Array<string>>result; //we call the submitImportForm when we reupload and call false
                }
            }, 
            err => {
                this.waiting = false;
                this.showError(err,'System Error Occurred');
            });
    }

    

    getFileUploadColumns(tableChoice: string) {
        
        this.setupFileImportColumns();

        this.waiting = true;
        this.fileImporterService.getFileUploadColumns(tableChoice)
            .subscribe(
            col => {
                this.waiting = false;

                let cols: Array<string> = col.json();

                cols.forEach(x => this.fileImportColumns.push(new FileImportColumn(x, false)));
                
                this.getSampleData(0);
                
            },
            err => {
                this.waiting = false;
                this.showError(err,'Error retrieving table columns');
                
            }
            );
    }

    getSampleData(index:number) {
        this.waiting = true;
        this.fileImporterService.getSampleData(index, this.tableChooser.value,this.fileImportColumns)
            .subscribe(
            data => {
                this.waiting = false;
                
                this.sampleData = data.json();
            },
            err => {
                this.waiting = false;
                this.showError(err,'Error retrieving sample data');
                
            }
            );
    }


}

