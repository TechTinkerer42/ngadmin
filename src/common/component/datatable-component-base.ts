import {ControlGroup} from '@angular/common';
import {Message, DataTable, Column,MenuItem} from 'primeng/primeng';

import {ComponentBase} from './component-base';

export class DataTableComponentBase extends ComponentBase {

    exportString:string = "";
    cols: any[];
    contextMenuItems: MenuItem[];
    
    buildContextColumns() {
        for (let c in this.cols) {
            let col: Column = this.cols[c];
            this.contextMenuItems.push({ label: col.header, icon: 'fa-minus', command: (event) => this.toggleColumn(col.header, 'fa-minus') });
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

        var contextColumn = this.contextMenuItems.filter(x => x.label == columnName)[0];
        if (contextColumn) {
            let gridCol = this.cols.filter(x => x.header == columnName)[0];
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
    
    setExportString(rowNumber:number)
    {
        this.exportString = "Export " + rowNumber.toString() + " rows";
    }

    doExport(dt: DataTable, mainDataSource, mainDataColumns, hiddenColumns,filename: string) {

        let dataToExport = (<any>dt).filteredValue;

        if (dataToExport == null) {
            dataToExport = mainDataSource;
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

        csv = this.getFirstRowReplacement(csv, mainDataColumns);

        var csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var csvURL = window.URL.createObjectURL(csvData);
        var tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', filename);
        tempLink.click();
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




