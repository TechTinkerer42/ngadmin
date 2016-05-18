

//import {Http, Response, RequestOptions, Request, Headers} from '@angular/http';
import {HttpHelper} from '../../common/service/http-helper';
import {Injectable} from '@angular/core'
import {StateVariables} from '../../common/service/state-variables';

@Injectable()
export class FileImporterService {
    
    constructor( private httpHelper: HttpHelper) {
    }
    
    getFileUploadColumns(tableChoice: string) {
        return this.httpHelper.makeHttpCall('AngularAdmin/GetFileUploadColumns', JSON.stringify({ tableChoice: tableChoice }), 'POST',false);
    }

    getSampleData(index:number, tableChoice:string,fileImportColumns:any) {
        return this.httpHelper.makeHttpCall('AngularAdmin/GetSampleData', JSON.stringify({ index: index,tableChoice: tableChoice,fileImportColumns: fileImportColumns }), 'POST',false);
    }
    
    processFileImportColumns(tableChoice:string,fileImportColumns:any) {
        return this.httpHelper.makeHttpCall('AngularAdmin/ProcessFileImportColumns', JSON.stringify({ tableChoice: tableChoice,fileImportColumns: fileImportColumns }), 'POST')
    }
    
    uploadFileToImport(data: any) {
        return new Promise((resolve, reject) => {

            var fd = new FormData();

            fd.append("fileType", data.fileType);
            fd.append("fileData", data.filesToUpload[0]);

            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                        
                    } else {

                        reject(xhr.statusText);
                    }
                }
            }

            



            var url = `${StateVariables.API_ENDPOINT}AngularAdmin/UploadFileToImport`;

            xhr.open("POST", url, true);
            xhr.send(fd);
        });
    }





    


}