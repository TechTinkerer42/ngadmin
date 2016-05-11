"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
//import {Http, Response, RequestOptions, Request, Headers} from '@angular/http';
var http_helper_1 = require('../../common/service/http-helper');
var core_1 = require('@angular/core');
var state_variables_1 = require('../../common/service/state-variables');
var FileImporterService = (function () {
    function FileImporterService(httpHelper) {
        this.httpHelper = httpHelper;
    }
    FileImporterService.prototype.getFileUploadColumns = function (tableChoice) {
        return this.httpHelper.makeHttpCall('AngularAdmin/GetFileUploadColumns', JSON.stringify({ tableChoice: tableChoice }), 'POST', false);
    };
    FileImporterService.prototype.getSampleData = function (index, tableChoice, fileImportColumns) {
        return this.httpHelper.makeHttpCall('AngularAdmin/GetSampleData', JSON.stringify({ index: index, tableChoice: tableChoice, fileImportColumns: fileImportColumns }), 'POST', false);
    };
    FileImporterService.prototype.processFileImportColumns = function (tableChoice, fileImportColumns) {
        return this.httpHelper.makeHttpCall('AngularAdmin/ProcessFileImportColumns', JSON.stringify({ tableChoice: tableChoice, fileImportColumns: fileImportColumns }), 'POST');
    };
    FileImporterService.prototype.uploadFileToImport = function (data) {
        return new Promise(function (resolve, reject) {
            var fd = new FormData();
            fd.append("fileType", data.fileType);
            fd.append("fileData", data.filesToUpload[0]);
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    }
                    else {
                        reject(xhr.statusText);
                    }
                }
            };
            var url = state_variables_1.StateVariables.API_ENDPOINT + "AngularAdmin/UploadFileToImport";
            xhr.open("POST", url, true);
            xhr.send(fd);
        });
    };
    FileImporterService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(http_helper_1.HttpHelper)), 
        __metadata('design:paramtypes', [http_helper_1.HttpHelper])
    ], FileImporterService);
    return FileImporterService;
}());
exports.FileImporterService = FileImporterService;
//# sourceMappingURL=file-importer-service.js.map