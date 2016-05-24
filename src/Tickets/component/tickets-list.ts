import {Component, ReflectiveInjector, OnInit, TemplateRef} from '@angular/core'
import {TicketService} from '../service/tickets-service';
import {Ticket} from '../service/ticket-model';
import {ApplicationChooser} from '../../common/component/app-chooser'
import {Loading} from '../../common/component/loading'
import {AuthService} from '../../common/service/auth-service';
import {DataTableComponentBase} from '../../common/component/datatable-component-base';
import {CanActivate} from '@angular/router-deprecated';
import {InputText, DataTable, Column, Header, Footer, Button, ContextMenu, Dialog} from 'primeng/primeng';

@Component({
    directives: [ApplicationChooser,  DataTable, Column, Header, Footer, Button, ContextMenu, Dialog, Loading],
    providers: [TicketService],
    template: `
    <div class="col-md-12">
    <loading LoadingMessage="Loading..." [ShowLoading]="ShowLoading"></loading>
    <app-chooser [selectedApp]="SelectedApp" (onAppChosen)="onAppChosen($event,dt)">Loading...</app-chooser>
    <br>

    <p-contextMenu #cm [model]="ContextMenuItems"></p-contextMenu>

    <p-dataTable #dt [value]="GridDataSource" selectionMode="single" [paginator]="true" [rows]="NumberOfGridRows" filterDelay="0" [contextMenu]="cm" 
    [globalFilter]="gb" resizableColumns="true" columnResizeMode="expand" [(selection)]="SelectedTicket" (onFilter)="filterGrid(dt)">
    <p-column [filter]="true" filterMatchMode="contains" *ngFor="let col of GridColumns" [sortable]="col.sortable" [field]="col.field" [header]="col.header" [hidden]="col.hidden" [style]="col.style">
        <template let-col let-tickets="rowData">
            <span style="color:red" *ngIf="showRedBackground(tickets,col)">
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
        <button *ngIf="ShowExportButton" type="button" pButton icon="fa-file-excel-o" (click)="onExport(dt);" [label]="ExportString"></button>
        
        <button type="button" pButton icon="fa-plus" style="float:right" (click)="addTicket();" label="Add Prompt"></button>
        <button type="button" *ngIf="ClearFiltersNeeded" pButton icon="fa-refresh" style="float:right" (click)="clearFilters(dt);" label="Clear Filters"></button>
        </div>
    </div>
    
    <p-dialog [center]="true" [resizable]="false" [height]="800" [contentHeight]="750" [width]="800" [closeOnEscape]="false" [closable]="false" [draggable]="true" [(visible)]="ShowModal" modal="modal" [showEffect]="fade">
    
    </p-dialog>
    </div>
    `
})



@CanActivate((next, previous) => {
    let injector: any = ReflectiveInjector.resolveAndCreate([AuthService]);
    let authService: AuthService = injector.get(AuthService);
    return authService.checkLogin(next, previous);
})










export class TicketsList extends DataTableComponentBase implements OnInit {

    SelectedApp: number = 16; //initial value
    SelectedTicket: Ticket;
    TicketModel: Ticket = new Ticket();
    ShowModal: boolean = false;
    ExportFileName: string = "ticket_export.csv";
    
    constructor(private ticketService: TicketService) {
        super();
    }

    
    showRedBackground(row,col){
        
        if(col.field == 'CallerID' || col.field == 'lngANI')
        {
            if(row['CallerIDUnknown'])
            {
                return row['CallerIDUnknown'] == 1 ? true : false;   
            }
            
            return false;
        }
        
        if(col.field == 'lngANI')
        {
            if(row['ClosingCallerIDUnknown'])
            {
                return row['ClosingCallerIDUnknown'] == 1 ? true : false;  
            }
            return false;    
        }
        
        return false;
        
    }

    //absolutely need these

    
    ngOnInit() {

        this.ContextMenuItems = [
            { label: 'Edit Ticket', icon: 'fa-edit', command: (event) => this.editTicket() },
            { label: 'Delete Ticket', icon: 'fa-close', command: (event) => this.deleteTicket() }

        ];

        this.getGridColumns(this.SelectedApp,"0");
    }

    buildColumns(cols:any[]) {
        
        this.GridColumns = [];
        
         cols.forEach(x=> {
            
            let hidden:boolean = false;
            if(x.columnVisibility == 'hidden')
            {
                hidden = true;
            }
            
            this.GridColumns.push({ field: x.columnName, header: x.columnTitle, sortable: true, hidden: hidden, style: { "width": x.columnWidth } });
            
        })
        
        this.getGridDataSource(this.SelectedApp)
        
    }

    getGridColumns(appNumber: number, accountNumber:string) {
        this.GridColumns = [];
        
        this.ticketService.getGridColumnsByAppID(appNumber, accountNumber)
            .map(res => res.json())
            .subscribe(cols => {
                console.log(cols);
                this.buildColumns(cols);
                this.buildContextColumns();
                
            },
            err => {
                this.showError(err, 'Error retrieving grid columns');
            }
            );
    }


    getGridDataSource(appNumber: Number) {

        
        this.ShowLoading = true;

        this.ticketService.getTickets(appNumber,"0","05/23/2016","12:00AM","05/23/2016","11:59PM")
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

    onExport(dt: DataTable) {

        let hiddenColumns: string[] = (<Column[]>this.GridColumns).filter(e => e.hidden == true).map(w => w.field);
        hiddenColumns.push("Store_TimeZoneAdjustment");
        hiddenColumns.push("DateOpened");
        

        this.doExport(dt, hiddenColumns, this.ExportFileName);
    }

    //crud operations

    addTicket() {

        this.TicketModel = new Ticket();
        this.TicketModel.AppNum = this.SelectedApp;
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

        var foundPrompt = this.GridDataSource.filter(x => x.promptID == changedRow.promptID);

        if (foundPrompt[0]) {
            this.GridDataSource[this.GridDataSource.indexOf(foundPrompt[0])] = changedRow;
        }
    }
    
    onAppChosen(appNumber: number, dt: DataTable) {
        dt.reset();
        this.SelectedApp = appNumber;
        this.getGridDataSource(appNumber); //initial data load
    }
}