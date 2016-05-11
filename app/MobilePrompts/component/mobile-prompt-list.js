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
var main_1 = require('ag-grid-ng2/main');
var searcher_1 = require('../../common/component/searcher');
var mobile_prompt_service_1 = require('../service/mobile-prompt-service');
var mobile_prompt_model_1 = require('../service/mobile-prompt-model');
var app_chooser_1 = require('../../common/component/app-chooser');
var ng2_bs3_modal_1 = require('ng2-bs3-modal/ng2-bs3-modal');
var edit_mobile_prompt_1 = require('./edit-mobile-prompt');
var auth_service_1 = require('../../common/service/auth-service');
var component_base_1 = require('../../common/component/component-base');
var router_deprecated_1 = require('@angular/router-deprecated');
var MobilePromptList = (function (_super) {
    __extends(MobilePromptList, _super);
    function MobilePromptList(mobilePromptService) {
        _super.call(this);
        this.mobilePromptService = mobilePromptService;
        this.gridOptions = [];
        this.searchTerm = "";
        this.selectedApp = 15; //initial value
        this.PromptModel = new mobile_prompt_model_1.MobilePrompt();
        this.showConfirmOption = false;
        this.columnDefs = [
            { headerName: "ID", field: "promptID", width: 75 },
            { headerName: "Key", field: "key" },
            { headerName: "Translation", field: "translation" },
            { headerName: "App #", field: "AppNum", width: 75 },
            { headerName: "Language", field: "language", width: 95, valueGetter: this.languageValueGetter },
            { headerName: "Behavior Type", field: "promptBehaviorType", width: 120, valueGetter: this.behaviorValueGetter },
            { headerName: "Prompt Type", field: "promptType", width: 120, valueGetter: this.typeValueGetter },
            { headerName: "Child", field: "HasChild", width: 75 },
            { headerName: "Parent", field: "Parent", width: 75 },
            { headerName: "Value", field: "Value", width: 75 }
        ];
        this.gridOptions = {
            columnDefs: this.columnDefs,
            enableColResize: true,
            rowHeight: 50,
            enableSorting: true,
            rowSelection: 'single',
            enableFilter: true,
            overlayNoRowsTemplate: "<span style='padding: 10px; border: 1px solid #444; background: lightgoldenrodyellow;'>No results</span>",
            overlayLoadingTemplate: "<span style='padding: 10px; border: 1px solid #444; background: lightgoldenrodyellow;'><i class='fa fa-spinner fa-spin'></i> Loading...</span>",
        };
        this.getMobilePrompts(this.selectedApp);
    }
    MobilePromptList.prototype.openModal = function (modal, action) {
        this.action = action;
        if (action === 'Add') {
            this.PromptModel = new mobile_prompt_model_1.MobilePrompt();
            this.PromptModel.AppNum = this.selectedApp;
            this.gridOptions.api.deselectAll();
        }
        modal.open();
    };
    MobilePromptList.prototype.onDoneAdd = function (modal, addedRow) {
        modal.close();
        this.mobilePrompts.push(addedRow);
        if (this.gridOptions.api) {
            this.gridOptions.api.setRowData(this.mobilePrompts);
            this.showRowMessage();
        }
    };
    MobilePromptList.prototype.onDoneEdit = function (modal, changedRow) {
        modal.close();
        var foundPrompt = this.mobilePrompts.filter(function (x) { return x.promptID == changedRow.promptID; });
        if (foundPrompt[0]) {
            this.mobilePrompts[this.mobilePrompts.indexOf(foundPrompt[0])] = changedRow;
        }
        if (this.gridOptions.api) {
            this.gridOptions.api.setRowData(this.mobilePrompts);
        }
    };
    MobilePromptList.prototype.onAppChosen = function (appNumber) {
        this.selectedApp = appNumber;
        this.getMobilePrompts(appNumber); //initial data load
    };
    MobilePromptList.prototype.deleteMobilePrompt = function (promptID) {
        var _this = this;
        //console.log(promptID);
        this.mobilePromptService.deleteMobilePrompt(promptID)
            .subscribe(function (mp) {
            _this.mobilePrompts = _this.mobilePrompts.filter(function (x) { return x.promptID != promptID; });
            if (_this.gridOptions.api) {
                _this.gridOptions.api.setRowData(_this.mobilePrompts);
                _this.gridOptions.api.sizeColumnsToFit();
                _this.showRowMessage();
            }
        }, function (err) {
            console.log(err);
            _this.gridOptions.api.hideOverlay();
            alert("Error deleting mobile prompt");
        });
    };
    MobilePromptList.prototype.clonePrompt = function (p) {
        var newPrompt = new mobile_prompt_model_1.MobilePrompt();
        for (var prop in p) {
            newPrompt[prop] = p[prop];
        }
        return newPrompt;
    };
    MobilePromptList.prototype.onRowDoubleClicked = function (modal) {
        var selectedRowsExist = this.gridOptions.api.getSelectedRows();
        if (selectedRowsExist) {
            this.PromptModel = this.clonePrompt(selectedRowsExist[0]);
            this.openModal(modal, 'Edit');
        }
    };
    MobilePromptList.prototype.showRowMessage = function () {
        var model = this.gridOptions.api.getModel();
        var processedRows = model.getRowCount();
        this.rowsDisplayed = processedRows + " of " + this.mobilePrompts.length;
        this.gridOptions.api.hideOverlay();
        if (processedRows < 1) {
            this.gridOptions.api.showNoRowsOverlay();
        }
    };
    MobilePromptList.prototype.onSearchTermEntered = function (filterValue) {
        this.gridOptions.api.deselectAll();
        this.gridOptions.api.setQuickFilter(filterValue);
        this.showRowMessage();
        this.PromptModel = new mobile_prompt_model_1.MobilePrompt();
    };
    MobilePromptList.prototype.getMobilePrompts = function (appNumber) {
        var _this = this;
        if (this.gridOptions.api) {
            this.gridOptions.api.showLoadingOverlay();
        }
        this.mobilePromptService.getMobilePrompts(appNumber)
            .subscribe(function (mp) {
            _this.mobilePrompts = mp.json();
            if (_this.gridOptions.api) {
                _this.gridOptions.api.setRowData(_this.mobilePrompts);
                _this.gridOptions.api.sizeColumnsToFit();
                _this.showRowMessage();
            }
        }, function (err) {
            _this.gridOptions.api.hideOverlay();
            _this.showErrors(err, 'Error retrieving mobile prompts');
        });
    };
    //grid 
    MobilePromptList.prototype.languageValueGetter = function (params) {
        var language = '';
        switch (params.data.language) {
            case 1:
                language = 'English';
                break;
            case 2:
                language = 'Spanish';
                break;
        }
        return language;
    };
    MobilePromptList.prototype.behaviorValueGetter = function (params) {
        var behavior = '';
        switch (params.data.promptBehaviorType) {
            case 0:
                behavior = 'Regular';
                break;
            case 1:
                behavior = 'Confirmation';
                break;
        }
        return behavior;
    };
    MobilePromptList.prototype.typeValueGetter = function (params) {
        var type = '';
        switch (params.data.promptType) {
            case 1:
                type = 'Regular';
                break;
            case 2:
                type = 'Yes/No';
                break;
        }
        return type;
    };
    MobilePromptList = __decorate([
        core_1.Component({
            directives: [main_1.AgGridNg2, searcher_1.SearchComponent, app_chooser_1.ApplicationChooser, ng2_bs3_modal_1.MODAL_DIRECTIVES, edit_mobile_prompt_1.EditMobilePrompt],
            providers: [mobile_prompt_service_1.MobilePromptService],
            template: "\n    \n    <modal #modal size=\"lg\" keyboard=\"false\" [animation]=\"false\">\n        <modal-header [show-close]=\"false\">\n            <h4 style=\"float:left\" class=\"modal-title\">{{action}} Prompt</h4>\n            <a style=\"float:right\" *ngIf=\"PromptModel.promptID != -1 && !showConfirmOption\" class=\"btn btn-primary\" (click)=\"showConfirmOption=true;\">Delete Prompt</a>\n            <div *ngIf=\"showConfirmOption\" style=\"float:right\">\n                <a class=\"btn btn-success\" (click)=\"modal.close();deleteMobilePrompt(PromptModel.promptID)\">Delete It</a>\n                <a class=\"btn btn-default\" (click)=\"showConfirmOption=false\">Keep It</a> \n            </div>\n\n        </modal-header>\n        <modal-body>\n            <edit-mobile-prompt [IncomingModel]=\"PromptModel\" (onCancel)=\"modal.close();\" (onDoneEdit)=\"onDoneEdit(modal,$event);\" (onDoneAdd)=\"onDoneAdd(modal,$event);\"></edit-mobile-prompt>\n        </modal-body>\n    </modal>\n\n\n    <div class=\"row\">\n        <div class=\"col-md-4\">                                                                                                          \n            <div class=\"form-group\">\n                <app-chooser [selectedApp]=\"selectedApp\" (onAppChosen)=\"onAppChosen($event)\">Loading...</app-chooser>                \n            </div>\n        </div>\n        <div class=\"col-md-3 col-md-offset-4\">\n            <button type=\"button\" class=\"btn btn-primary\" (click)=\"openModal(modal,'Add');\">Add Prompt</button>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"col-md-12\">\n            <ag-grid-ng2 #agGrid style=\"height: 400px;\" class=\"ag-blue\" (rowDoubleClicked)=\"onRowDoubleClicked(modal)\" [gridOptions]=\"gridOptions\"></ag-grid-ng2>\n        </div>\n    </div>\n\n    <div class=\"row\">\n        <div class=\"col-md-2\">\n            <searcher (onSearchTermEntered) = \"onSearchTermEntered($event)\"></searcher>\n        </div>\n        <div class=\"col-md-2 col-md-offset-6\">    \n            Rows: {{rowsDisplayed}}\n        </div>\n    </div>\n    "
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            var injector = core_1.ReflectiveInjector.resolveAndCreate([auth_service_1.AuthService]);
            var authService = injector.get(auth_service_1.AuthService);
            return authService.checkLogin(next, previous);
        }),
        __param(0, core_1.Inject(mobile_prompt_service_1.MobilePromptService)), 
        __metadata('design:paramtypes', [mobile_prompt_service_1.MobilePromptService])
    ], MobilePromptList);
    return MobilePromptList;
}(component_base_1.ComponentBase));
exports.MobilePromptList = MobilePromptList;
//# sourceMappingURL=mobile-prompt-list.js.map