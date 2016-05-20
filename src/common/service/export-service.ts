

import {DataTable, Column} from 'primeng/primeng';
import {MobilePrompt} from '../../MobilePrompts/service/mobile-prompt-model';


export class ExportService {
    
    
    static getFirstRowReplacement(csv: string, cols: Column[]) {
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

    doExport(dt: DataTable, ) {

        let dataToExport: MobilePrompt[] = (<any>dt).filteredValue;

        if (dataToExport == null) {
            dataToExport = this.mobilePrompts;
        }


        let showingColumns: string[] = dt.visibleColumns().map(a => { return a.header });
        let showingFields: string[] = dt.visibleColumns().map(a => { return a.field });

        let hiddenColumns: string[] = (<Column[]>this.cols).filter(e => e.hidden == true).map(w => w.field);

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

        csv = this.getFirstRowReplacement(csv, this.cols);

        var csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        var csvURL = window.URL.createObjectURL(csvData);
        var tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', 'excel_export.csv');
        tempLink.click();
    }
    
    static RequiredSelectValidator(control:AbstractControl) {
        
        if (control.value != '') {
            return null;
        }
        else {
            return { 'selectrequired': true };
        }
    }

    
    
  

   

        

           



            

            
   


    
}
