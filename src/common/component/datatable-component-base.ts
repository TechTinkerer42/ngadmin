import {ControlGroup} from '@angular/common';
import {Message, DataTable, Column,MenuItem} from 'primeng/primeng';

import {ComponentBase} from './component-base';



export class DataTableComponentBase extends ComponentBase {

    ExportString:string = "";
    ShowExportButton: boolean = false;
    ContextMenuItems: MenuItem[];
    ClearFiltersNeeded:boolean = false;
    GridColumns: any[];
    GridDataSource:any[];
    NumberOfGridRows: number = 20;
    ShowLoading:boolean = false;
    
    filterGrid(dt: DataTable) {
        this.setExportString(this.getExportRowCount(dt));
        this.ClearFiltersNeeded = true;
        
        
        
    }
    
    getExportRowCount(dt: DataTable): number {
        
        let rowCount:number = 0;
        
        let filteredData = (<any>dt).filteredValue;
        if (filteredData != null) {
            rowCount = filteredData.length;
        }
        else {
            rowCount = (<any>dt).value.length;
        }
        
        return rowCount;
    }
    
    clearFilters(dt: DataTable){
        dt.reset();
        dt.updatePaginator();
        this.setExportString(this.getExportRowCount(dt));
        this.ClearFiltersNeeded = false;
    }
    
    buildContextColumns() {
        for (let c in this.GridColumns) {
            let col: Column = this.GridColumns[c];
            let icon:string = col.hidden == true ? 'fa-plus' : 'fa-minus';
            this.ContextMenuItems.push({ label: col.header, icon: icon, command: (event) => this.toggleColumn(col.header, icon) });
        }
    }
    
    cloneObject(p: any): any {
        let clonedObject: any = new Object();
        for (let prop in p) {
            clonedObject[prop] = p[prop];
        }
        return clonedObject;
    }
    
    toggleColumn(columnName: string, iconName: string) {
        
        
        var contextColumn = this.ContextMenuItems.filter(x => x.label == columnName)[0];
        if (contextColumn) {
            let gridCol = this.GridColumns.filter(x => x.header == columnName)[0];
            if (contextColumn.icon == 'fa-plus') {
                iconName = "fa-minus";
                gridCol.hidden = false;
            }
            else {
                iconName = "fa-plus";
                gridCol.hidden = true;
            }
            contextColumn.icon = iconName;

            contextColumn.command = () => this.toggleColumn(columnName, iconName);

        }
    }
    
    setExportString(rowCount:number)
    {
        this.ShowExportButton = false;
        if(rowCount > 0)
        {
            this.ShowExportButton = true;
            this.ExportString = "Export " + rowCount.toString() + " rows";
        }
    }

    doExport(dt: DataTable, hiddenColumns,filename: string) {

        let dataToExport = (<any>dt).filteredValue;

        if (dataToExport == null) {
            dataToExport = dt.value;
        }

        let strippedRows: Column[] = _.map(dataToExport, function (row) {
            return _.omit(row, hiddenColumns);
        });

        let config = {
            quotes: true,
            delimiter: ",",
            newline: "\r\n"

        };

        let csv = Papa.unparse(
            strippedRows, config
        );

        csv = this.getFirstRowReplacement(csv, this.GridColumns);

        var csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var csvURL = window.URL.createObjectURL(csvData);
        
        var tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', filename);
        
        setTimeout(() => tempLink.click(),200); //settimeout prevents double linking
        
        
        
    }

    private getFirstRowReplacement(csv: string, cols: Column[]) {
        try {

            //loop over columns shown in grid, and replace any field names in firstrow with headers

            for (let x = 0; x < cols.length; x++) {
                let colHeader = cols[x].header;
                let colField = cols[x].field;

                let termToReplace = `"${colField}"`;
                let termReplacing = `"${colHeader}"`;

                csv = csv.replace(termToReplace, termReplacing);

            }
            return csv;

        }
        catch (err) {
            //do nothing
            return csv;
        }
    }

}




