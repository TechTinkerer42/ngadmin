import {Component, ReflectiveInjector, OnInit, TemplateRef} from '@angular/core'
import {TicketService} from '../service/tickets-service';
import {Ticket} from '../service/ticket-model';
import {ApplicationChooser} from '../../common/component/app-chooser'
import {Loading} from '../../common/component/loading'



import {AuthService} from '../../common/service/auth-service';
import {DataTableComponentBase} from '../../common/component/datatable-component-base';
import {CanActivate} from '@angular/router-deprecated';
import {InputText, DataTable, Column, Header, Footer, Button, ContextMenu, Dialog, SplitButton, SplitButtonItem,Checkbox} from 'primeng/primeng';



@Component({
    directives: [ApplicationChooser, DataTable, Column, Header, Footer, Button, ContextMenu, Dialog, Loading, SplitButton, SplitButtonItem,Checkbox],
    providers: [TicketService],
    template: `
    <div class="row">
    
        <div class="col-md-1">
        <b>From:</b><br />
        <input type="text" class="form-control" id="fromDate" value="" /> 
        <input type="text" class="form-control" id="fromTime" value="12:00am" /> 
        <br />
        <b>To:</b><br />
        <input type="text" class="form-control" id="toDate" value=""/> 
        <input type="text" class="form-control" id="toTime" value="12:00am" /> 
        <br>
        <button type="button" pButton icon="fa-search" (click)="doSearch(dt);" label="Search"></button>
        </div>
    
        <div class="col-md-11">
        
            <app-chooser (onAppChosen)="onAppChosen($event,dt)">Loading...</app-chooser>
            <br>
            
            <p-contextMenu #cm [model]="ContextMenuItems"></p-contextMenu>
            <p-dataTable #dt [value]="GridDataSource" selectionMode="single" [paginator]="true" [rows]="NumberOfGridRows" filterDelay="0" [contextMenu]="cm" 
            [globalFilter]="gb" resizableColumns="true" columnResizeMode="expand" [(selection)]="SelectedTicket" (onFilter)="filterGrid(dt)" [rowsPerPageOptions]="[10,20,30]">
            <p-column [filter]="true" filterMatchMode="contains" *ngFor="let col of GridColumns" [sortable]="col.sortable" [field]="col.field" [header]="col.header" [hidden]="col.hidden" [style]="col.style">
                <template let-col let-tickets="rowData">
                    <span title="Unknown caller ID" style="color:red" *ngIf="showRedBackground(tickets,col)">
                        {{tickets[col.field]}}
                    </span>
                    <span *ngIf="!showRedBackground(tickets,col)">{{tickets[col.field]}}</span>
                </template>
            </p-column>
            </p-dataTable>
            
                
            <div class="ui-widget-header ui-helper-clearfix" style="padding:4px 10px;border-bottom: 0 none">
                <div>
                <i class="fa fa-search" style="float:left;margin:4px 4px 0 0"></i>
                <input #gb type="text" pInputText size="50" style="float:left:padding-right:20px;" placeholder="Enter Search">
                
                
                <button *ngIf="ShowExportButton && ReportList.length == 0" type="button" pButton icon="fa-file-excel-o" (click)="onExport(dt);" [label]="ExportString"></button>
                
                <p-splitButton *ngIf="ShowExportButton && ReportList.length > 0" [label]="ExportString" icon="fa-file-excel-o" (onClick)="onExport(dt)">
                    <p-splitButtonItem *ngFor="let rep of ReportList" icon="fa-file-excel-o" [label]="rep.ConfigText" (onClick)="onExport(dt,rep.ConfigValue)"></p-splitButtonItem>
                </p-splitButton>
                
                <button type="button" pButton icon="fa-eye" style="float:right" (click)="ShowColumnPicker=true" label="Column Visibility"></button>
                <button type="button" *ngIf="ClearFiltersNeeded" pButton icon="fa-refresh" style="float:right" (click)="clearFilters(dt);" label="Clear Filters"></button>
                </div>
            </div>
        </div>
    </div>
    
    <p-dialog [center]="true" [resizable]="false" [height]="800" [contentHeight]="750" [width]="800" [closeOnEscape]="false" [closable]="false" [draggable]="true" [(visible)]="ShowModal" modal="modal" [showEffect]="fade"></p-dialog>

    <p-dialog modal="true"  [center]="true" [resizable]="false" [height]="700" [contentHeight]="700" [width]="400" closeOnEscape="true" [closable]="true" [draggable]="false" [(visible)]="ShowColumnPicker" [showEffect]="fade">
    <div class="container">
        <div class="row">
            <div class="ui-grid-col-1">
            <p-checkbox #cball (onChange)="checkAll($event,SelectedApp)"></p-checkbox>
            </div>
            <div class="ui-grid-col-11"><label class="ui-widget">{{cball.checked ? 'Select None' : 'Select All'}}</label></div>  
            <div *ngFor="let col of GridColumns">
                <div class="ui-grid-col-1">
                    <p-checkbox [ngModel]="!col.hidden" (onChange)="checkBoxChanged($event,col,SelectedApp)"></p-checkbox>
                </div>
                <div class="ui-grid-col-11"><label class="ui-widget">{{col.header}}</label></div>    
            </div>
        </div>
    </div>
    </p-dialog>
    <loading LoadingMessage="Loading..." [ShowLoading]="ShowLoading"></loading>
    
    `
})



@CanActivate((next, previous) => {
    let injector: any = ReflectiveInjector.resolveAndCreate([AuthService]);
    let authService: AuthService = injector.get(AuthService);
    return authService.checkLogin(next, previous);
})










export class TicketsList extends DataTableComponentBase implements OnInit {
    fromDate;
    fromTime;
    toDate;
    toTime;
    SelectedApp: number = 0; //initial value
    SelectedTicket: Ticket;
    TicketModel: Ticket = new Ticket();
    ShowModal: boolean = false;
    ExportFileName: string = "ticket_export.csv";
    ReportList: any[] = [];

    constructor(private ticketService: TicketService) {
        super();



    }

    showRedBackground(row, col) {

        if (col.field == 'CallerID' || col.field == 'lngANI') {
            if (row['CallerIDUnknown']) {
                return row['CallerIDUnknown'] == 1 ? true : false;
            }

            return false;
        }

        if (col.field == 'lngANI') {
            if (row['ClosingCallerIDUnknown']) {
                return row['ClosingCallerIDUnknown'] == 1 ? true : false;
            }
            return false;
        }

        return false;

    }

    //absolutely need these
    doSearch(dt:DataTable)
    {
        //console.log('searching');
        dt.reset();
        this.getGridDataSource();
        this.setExportString(this.GridDataSource.length);
    }

    ngOnInit() {
        this.ShowLoading = true;
        this.ContextMenuItems = [
            { label: 'Edit Ticket', icon: 'fa-edit', command: (event) => this.editTicket() },
            { label: 'Delete Ticket', icon: 'fa-close', command: (event) => this.deleteTicket() }
        ];
        
        
        
    }

    setupDateTimeBoxes() {

        let now: Date = new Date(Date.now());
        let tomorrow: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        this.fromDate = $('#fromDate');
        this.toDate = $('#toDate');
        this.fromTime = $('#fromTime');
        this.toTime = $('#toTime');

        this.fromTime.val("12:00AM");
        this.toTime.val("12:00AM");

        this.fromDate.datepicker({
            changeMonth: true,
            changeYear: true,
            showAnim: "blind",
            gotoCurrent: true,
            autoclose: true,
            onChangeMonthYear: function (year, month, instance) {

            },
        });

        this.fromDate.datepicker("setDate", now);

        this.fromTime.timepicker({ step: 1 });

        this.toDate.datepicker({
            changeMonth: true,
            changeYear: true,
            showAnim: "blind",
            gotoCurrent: true,
            autoclose: true,
            onChangeMonthYear: function (year, month, instance) {

            },
        });

        this.toDate.datepicker("setDate", tomorrow);

        this.toTime.timepicker({ step: 1 });

        this.fromDate.bind("keydown", function (e) {
            return false;
        });

        this.toDate.bind("keydown", function () {
            return false;
        });
        this.fromTime.bind("keydown", function (e) {
            return false;
        });

        this.toTime.bind("keydown", function () {
            return false;
        });
    }

    getReports(){
        this.ticketService.getEntityByType(this.SelectedApp,"0", 0)
            .map(res => res.json())
            .subscribe(reports => {
                console.log(reports);
                this.ReportList = reports;

            },
            err => {
                this.showError(err, 'Error retrieving reports');
            }
            );
    }


    buildColumns(cols: any[]) {

        this.SavedColumns = this.getSavedColumnVisibility(this.SelectedApp);
        
        this.GridColumns = [];

        cols.forEach(x => {

            let hidden: boolean = false;
            if (x.columnVisibility == 'hidden') {
                hidden = true;
            }
            
            if(this.SavedColumns) //check to see what we have 
            {
                hidden = this.checkColumnVisibility(x); 
            }
            
            this.GridColumns.push({ field: x.columnName, header: x.columnTitle, sortable: true, hidden: hidden, style: { "width": x.columnWidth } });

        })



        this.getGridDataSource();

    }

    getGridColumns(appNumber: number, accountNumber: string) {
        this.GridColumns = [];

        this.ticketService.getGridColumnsByAppID(appNumber, accountNumber)
            .map(res => res.json())
            .subscribe(cols => {
                
                this.buildColumns(cols);
                

            },
            err => {
                this.showError(err, 'Error retrieving grid columns');
            }
            );
    }


    getGridDataSource() {

        this.ShowLoading = true;

        this.ticketService.getTickets(this.SelectedApp, "0", this.fromDate.val(), this.fromTime.val(), this.toDate.val(), this.toTime.val())
            .map(res => res.json())
            .subscribe(mp => {
                this.GridDataSource = mp;
                this.setExportString(this.GridDataSource.length); //put in an event that gets the rowcount and returns it and keep one to update button too
                this.ShowLoading = false;
                
            },
            err => {
                this.ShowLoading = false;
                this.GridDataSource = [];
                this.setExportString(this.GridDataSource.length)
                this.showError(err, 'Error retrieving tickets');

            }
            );
    }

    onExport(dt: DataTable, reportName:string = "") {

        if(reportName.length == 0)
        {
            let hiddenColumns: string[] = (<Column[]>this.GridColumns).filter(e => e.hidden == true).map(w => w.field);
            hiddenColumns.push("Store_TimeZoneAdjustment");
            hiddenColumns.push("DateOpened");
            hiddenColumns.push("RowNumber");
            hiddenColumns.push("TotalRows");
            hiddenColumns.push("ClosingCallerIDUnknown");
            hiddenColumns.push("CallerIDUnknown");
            
            this.doExport(dt, hiddenColumns, this.ExportFileName);    
        }
        else{
            this.doExportMSFT(dt,reportName,this.SelectedApp,this.fromDate.val(),this.fromTime.val(),this.toDate.val(),this.toTime.val());
        }
        
    }

    //crud operations

    addTicket() {

        this.TicketModel = new Ticket();
        //this.TicketModel.AppNum = this.SelectedApp;
        this.ShowModal = true;
    }

    onDoneAdd(addedRow: Ticket) {

        this.GridDataSource.push(addedRow);
        this.ShowModal = false;
    }

    deleteTicket() {
        /*if (this.SelectedTicket) {

            var conf = confirm('Are you sure?');

            if (conf) {
                let promptID = this.SelectedTicket.promptID;
                this.ticketService.deleteMobilePrompt(promptID)
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
        }*/
    }

    editTicket() {
        if (this.SelectedTicket) {
            this.TicketModel = null;
            this.TicketModel = this.cloneObject(this.SelectedTicket);
            this.ShowModal = true;
        }
    }

    onDoneEdit(changedRow: Ticket) {

        this.ShowModal = false;

        //var foundPrompt = this.GridDataSource.filter(x => x.promptID == changedRow.promptID);

        //if (foundPrompt[0]) {
          //  this.GridDataSource[this.GridDataSource.indexOf(foundPrompt[0])] = changedRow;
        //}
    }

    onAppChosen(appNumber: number, dt: DataTable) {
        
        if(appNumber == 0)
        {
            alert('User has no applications associated with their profile');    
        }
        else{
            dt.reset();
            this.GridDataSource = [];
            this.setExportString(this.GridDataSource.length);
            this.SelectedApp = appNumber;
            this.setupDateTimeBoxes();
            this.getReports();
            
            this.getGridColumns(appNumber, "0");
        }
        
        
        
        
        
    }
}