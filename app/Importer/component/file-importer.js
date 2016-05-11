"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var control_messages_component_1 = require('../../common/component/control-messages-component');
var message_panel_1 = require('../../common/component/message-panel');
var component_base_1 = require('../../common/component/component-base');
var auth_service_1 = require('../../common/service/auth-service');
var router_deprecated_1 = require('@angular/router-deprecated');
var file_importer_service_1 = require('../service/file-importer-service');
var ng2_bs3_modal_1 = require('ng2-bs3-modal/ng2-bs3-modal');
var file_import_column_model_1 = require('../service/file-import-column-model');
var FileImporter = (function (_super) {
    __extends(FileImporter, _super);
    function FileImporter(fb, fileImporterService) {
        _super.call(this);
        this.fb = fb;
        this.fileImporterService = fileImporterService;
        this.TemplateFields = [
            'Store_ApplicationNum', 'Store_CustomerNumber', 'Store_Active', 'BusinessLine',
            'Store_Name', 'Store_Number',
            'Store_Address', 'Store_City', 'Store_State', 'Store_Zip', 'Store_Country', 'Store_Region',
            'Store_Vendor', 'Store_Phone', 'Store_District', 'Store_Manager', 'Store_AcctManager',
            'Store_TimeZoneAdjustment', 'Store_LongLat',
            'Store_VendorMessagingAddresses', 'Store_DistrictMessagingAddresses', 'Store_StoreMessagingAddresses',
            'Store_StartTime_Mon', 'Store_StartTime_Tue', 'Store_StartTime_Wed', 'Store_StartTime_Thu', 'Store_StartTime_Fri',
            'Store_StartTime_Sat', 'Store_StartTime_Sun'
        ];
        this.templatePickerShowing = false;
        this.fileImportColumns = new Array();
        this.showSampleData = true;
        this.waiting = false;
        this.chosenIndex = 0;
        this.filesToUpload = [];
        this.fileWasUploaded = false;
        this.buildForm();
    }
    FileImporter.prototype.toggleSampleData = function () {
        if (this.showSampleData) {
            this.showSampleData = false;
        }
        else {
            this.showSampleData = true;
        }
    };
    FileImporter.prototype.setupFileImportColumns = function () {
        this.fileImportColumns = new Array();
        this.fileImportColumns.push(new file_import_column_model_1.FileImportColumn("Store_ApplicationNum", true));
        this.fileImportColumns.push(new file_import_column_model_1.FileImportColumn("Store_CustomerNumber", true));
        this.fileImportColumns.push(new file_import_column_model_1.FileImportColumn("BusinessLine", true));
        this.fileImportColumns.push(new file_import_column_model_1.FileImportColumn("Store_Active", true));
    };
    FileImporter.prototype.processColumns = function () {
        var _this = this;
        var confirmed = true;
        //check to make sure all values filled out
        var countMissing = this.fileImportColumns.filter(function (x) { return x.IsValueColumn && x.RenamedName.length < 1; }).length;
        if (countMissing > 0) {
            confirmed = confirm('There are required fields that are not populated. Are you sure?');
        }
        if (confirmed) {
            this.waiting = true;
            this.fileImporterService.processFileImportColumns(this.tableChooser.value, this.fileImportColumns)
                .subscribe(function (col) {
                _this.waiting = false;
                var alertMessage = 'File Imported Successfully.';
                var res = col;
                if (res._body) {
                    alertMessage += " Distinct Customer Numbers: " + res._body;
                }
                _this.alertMessage = alertMessage;
                _this.alertType = "info";
                _this.buildForm();
            }, function (err) {
                _this.waiting = false;
                _this.showErrors(err, 'System Error Occurred');
            });
        }
    };
    FileImporter.prototype.setupTemplateChooser = function (index, event) {
        this.chosenIndex = index;
        this.chosenControl = event.target;
        if (!this.fileImportColumns[this.chosenIndex].IsValueColumn) {
            this.templatePickerShowing = true;
        }
    };
    FileImporter.prototype.setTemplate = function (text) {
        this.templatePickerShowing = false;
        this.fileImportColumns[this.chosenIndex].RenamedName = text;
        this.chosenControl.value = text;
    };
    FileImporter.prototype.buildForm = function () {
        this.fileWasUploaded = false;
        this.templatePickerShowing = false;
        this.fileImportTables = null;
        this.fileImportColumns = new Array();
        this.fileImportForm = this.fb.group({
            'fileType': [''],
            'excelFile': [''],
            'tableChooser': ['']
        });
        this.fileType = this.fileImportForm.controls['fileType'];
        this.excelFile = this.fileImportForm.controls['excelFile'];
        this.tableChooser = this.fileImportForm.controls['tableChooser'];
    };
    FileImporter.prototype.fileChangeEvent = function (fileInput) {
        this.filesToUpload = fileInput.target.files;
        this.fileWasUploaded = false;
        if (this.filesToUpload.length > 0) {
            this.fileWasUploaded = true;
            this.fileImportForm.markAsDirty();
            this.submitImportForm();
        }
    };
    FileImporter.prototype.submitImportForm = function (populateTables) {
        var _this = this;
        if (populateTables === void 0) { populateTables = true; }
        var formData = this.fileImportForm.value;
        var data = { fileType: formData.fileType, filesToUpload: this.filesToUpload };
        this.waiting = true;
        this.fileImporterService.uploadFileToImport(data)
            .then(function (result) {
            _this.waiting = false;
            if (populateTables) {
                _this.fileImportTables = result; //we call the submitImportForm when we reupload and call false
            }
        }, function (err) {
            _this.waiting = false;
            _this.showErrors(err, 'System Error Occurred');
        });
    };
    FileImporter.prototype.getFileUploadColumns = function (tableChoice) {
        var _this = this;
        this.setupFileImportColumns();
        this.waiting = true;
        this.fileImporterService.getFileUploadColumns(tableChoice)
            .subscribe(function (col) {
            _this.waiting = false;
            var cols = col.json();
            cols.forEach(function (x) { return _this.fileImportColumns.push(new file_import_column_model_1.FileImportColumn(x, false)); });
            _this.getSampleData(0);
        }, function (err) {
            _this.waiting = false;
            _this.showErrors(err, 'Error retrieving table columns');
        });
    };
    FileImporter.prototype.getSampleData = function (index) {
        var _this = this;
        this.waiting = true;
        this.fileImporterService.getSampleData(index, this.tableChooser.value, this.fileImportColumns)
            .subscribe(function (data) {
            _this.waiting = false;
            _this.sampleData = data.json();
        }, function (err) {
            _this.waiting = false;
            _this.showErrors(err, 'Error retrieving sample data');
        });
    };
    FileImporter = __decorate([
        router_deprecated_1.CanActivate(function (next, previous) {
            var injector = core_1.ReflectiveInjector.resolveAndCreate([auth_service_1.AuthService]);
            var authService = injector.get(auth_service_1.AuthService);
            return authService.checkLogin(next, previous);
        }),
        core_1.Component({
            providers: [file_importer_service_1.FileImporterService],
            directives: [control_messages_component_1.ControlMessages, common_1.FORM_DIRECTIVES, message_panel_1.MessagePanel, ng2_bs3_modal_1.MODAL_DIRECTIVES],
            template: "\n\n    <modal #modal size=\"lg\" keyboard=\"true\" [animation]=\"false\">\n        <modal-body>\n        <ul>\n            <li *ngFor=\"let s of sampleData\">{{s}}</li>\n        </ul>\n        </modal-body>\n    </modal>\n\n    <form [ngFormModel]=\"fileImportForm\">    \n    <div class=\"container-fluid\">\n        <div class=\"row\">\n            <div class=\"col-md-12\">\n                <message-panel [alertMessage]=\"alertMessage\" [alertType]=\"alertType\"></message-panel>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"form-group col-md-3\">\n                <div><label for=\"fileType\" class=\"control-label\">File Type:</label></div>\n\n                <div>\n                    <select [ngFormControl]=\"fileType\" class=\"form-control\" (change)=\"alertMessage=''\" #ft>\n                        <option value=\"\"></option>\n                        <option value=\"xlsx\">xlsx</option>\n                        <option value=\"xls\">xls</option>\n                    </select>\n                </div>\n            </div>\n            \n        </div>\n        <div class=\"row\">\n            <div class=\"form-group col-md-4\" *ngIf=\"ft.value\">\n                <div><label for=\"excelFile\" class=\"control-label\">File:</label></div>\n                <input type=\"file\" [ngFormControl]=\"excelFile\" (change)=\"fileChangeEvent($event)\" placeholder=\"Upload file...\" />\n                <button type=\"button\" *ngIf=\"fileWasUploaded\" class=\"btn btn-default\" (click)=\"submitImportForm(false)\">Re-upload</button>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"form-group col-md-3\" *ngIf=\"fileImportTables\">\n                <div><label for=\"tableChooser\" class=\"control-label\">Table:</label></div>\n                <div class=\"input-group\">\n                    <select [ngFormControl]=\"tableChooser\" class=\"form-control\" #table (change)=\"getFileUploadColumns(table.value)\">\n                    <option value=\"{{t}}\" *ngFor=\"let t of fileImportTables\">{{t}}</option>\n                    </select>\n                    <span class=\"input-group-btn\">\n                    <button type=\"button\" *ngIf=\"sampleData\" class=\"btn btn-default\" (click)=\"modal.open()\">Sample</button>\n                    </span>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"form-group col-md-7\" *ngIf=\"fileImportColumns.length > 0\">\n                <div><label for=\"colChooser\" class=\"control-label\">Columns:</label></div>\n\n                <div *ngFor=\"let col of fileImportColumns;let i = index\" class=\"form-group\">\n                    <div class=\"row\">\n                        <div class=\"col-md-3\">{{col.ColumnName}}</div>\n                        <div class=\"col-md-3\"><input type=\"text\" [(ngModel)]=\"col.RenamedName\" (click)=\"templatePickerShowing=false;setupTemplateChooser(i,$event);\"  /></div>\n                    </div>\n                </div>\n            </div>\n            <div *ngIf=\"templatePickerShowing\" class=\"btn-group-vertical\">\n                <button type=\"button\" class=\"btn btn-default\" *ngFor=\"let t of TemplateFields\" (click)=\"setTemplate(t)\">{{t}}</button>\n            </div>\n            \n        </div>\n        \n        <div class=\"row\" *ngIf=\"fileImportColumns.length > 0\">\n            <button type=\"button\" class=\"btn btn-default\" (click)=\"processColumns();\">Go</button>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"col-md-5\">\n                <div [hidden]=\"!waiting\"><i class=\"fa fa-spinner fa-spin\"></i> Please wait...</div>\n            </div>\n        </div>\n    </div>\n    </form>\n  "
        }),
        __param(0, core_1.Inject(common_1.FormBuilder)),
        __param(1, core_1.Inject(file_importer_service_1.FileImporterService)), 
        __metadata('design:paramtypes', [common_1.FormBuilder, file_importer_service_1.FileImporterService])
    ], FileImporter);
    return FileImporter;
}(component_base_1.ComponentBase));
exports.FileImporter = FileImporter;
//# sourceMappingURL=file-importer.js.map