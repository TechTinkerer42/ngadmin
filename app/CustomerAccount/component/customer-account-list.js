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
var customer_account_service_1 = require('../service/customer-account-service');
var customer_account_model_1 = require('../service/customer-account-model');
var component_base_1 = require('../../common/component/component-base');
var ng2_bs3_modal_1 = require('ng2-bs3-modal/ng2-bs3-modal');
var edit_customer_account_1 = require('./edit-customer-account');
var router_deprecated_1 = require('@angular/router-deprecated');
var auth_service_1 = require('../../common/service/auth-service');
var CustomerAccountList = (function (_super) {
    __extends(CustomerAccountList, _super);
    function CustomerAccountList(customerAccountService) {
        _super.call(this);
        this.customerAccountService = customerAccountService;
        this.gridOptions = [];
        this.searchTerm = "";
        this.CustomerAccountModel = new customer_account_model_1.CustomerAccount();
        this.showConfirmOption = false;
        this.columnDefs = [
            { headerName: "Account ID", field: "Account_ID", width: 120 },
            { headerName: "Account", field: "Account_Name", width: 600 },
            { headerName: "Account App#", field: "Account_AppNumber", width: 150 }
        ];
        this.gridOptions = {
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableSorting: true,
            rowSelection: 'single',
            overlayNoRowsTemplate: "<span style='padding: 10px; border: 1px solid #444; background: lightgoldenrodyellow;'>No results</span>",
            overlayLoadingTemplate: "<span style='padding: 10px; border: 1px solid #444; background: lightgoldenrodyellow;'><i class='fa fa-spinner fa-spin'></i> Loading...</span>",
        };
        this.getCustomerAccounts(); //initial data load
    }
    CustomerAccountList.prototype.openModal = function (modal, action) {
        this.action = action;
        if (action === 'Add') {
            this.CustomerAccountModel = new customer_account_model_1.CustomerAccount();
            this.gridOptions.api.deselectAll();
        }
        modal.open();
    };
    CustomerAccountList.prototype.onDoneAdd = function (modal) {
        modal.close();
        this.getCustomerAccounts();
    };
    CustomerAccountList.prototype.cloneAccount = function (c) {
        var newCA = new customer_account_model_1.CustomerAccount();
        for (var prop in c) {
            newCA[prop] = c[prop];
        }
        return newCA;
    };
    CustomerAccountList.prototype.showRowMessage = function () {
        var model = this.gridOptions.api.getModel();
        var processedRows = model.getRowCount();
        this.rowsDisplayed = processedRows + " of " + this.customerAccounts.length;
        this.gridOptions.api.hideOverlay();
        if (processedRows < 1) {
            this.gridOptions.api.showNoRowsOverlay();
        }
    };
    CustomerAccountList.prototype.onSearchTermEntered = function (filterValue) {
        this.gridOptions.api.deselectAll();
        this.gridOptions.api.setQuickFilter(filterValue);
        this.showRowMessage();
        this.CustomerAccountModel = new customer_account_model_1.CustomerAccount();
    };
    CustomerAccountList.prototype.getCustomerAccounts = function () {
        var _this = this;
        this.customerAccountService.getCustomerAccounts()
            .subscribe(function (ca) {
            _this.customerAccounts = ca.json();
            if (_this.gridOptions.api) {
                _this.gridOptions.api.setRowData(_this.customerAccounts);
                _this.gridOptions.api.sizeColumnsToFit();
                _this.showRowMessage();
            }
        }, function (err) {
            _this.gridOptions.api.hideOverlay();
            _this.showErrors(err, 'Error retrieving user customer accounts');
        });
    };
    CustomerAccountList = __decorate([
        router_deprecated_1.CanActivate(function (next, previous) {
            var injector = core_1.ReflectiveInjector.resolveAndCreate([auth_service_1.AuthService]);
            var authService = injector.get(auth_service_1.AuthService);
            return authService.checkLogin(next, previous);
        }),
        core_1.Component({
            directives: [main_1.AgGridNg2, searcher_1.SearchComponent, ng2_bs3_modal_1.MODAL_DIRECTIVES, edit_customer_account_1.EditCustomerAccount],
            providers: [customer_account_service_1.CustomerAccountService],
            template: "\n    \n    <modal #modal keyboard=\"false\" [animation]=\"false\">\n        <modal-header [show-close]=\"false\">\n            <h4 style=\"float:left\" class=\"modal-title\">{{action}} Account</h4>\n        </modal-header>\n        <modal-body>\n            <edit-customer-account [IncomingModel]=\"CustomerAccountModel\" (onCancel)=\"modal.close();\" (onDoneAdd)=\"onDoneAdd(modal);\"></edit-customer-account>\n        </modal-body>\n    </modal>\n\n\n    <div class=\"row\">\n        <div class=\"col-md-2 col-md-offset-6\">\n            <button type=\"button\" class=\"btn btn-primary\" (click)=\"openModal(modal,'Add');\">Add Account</button>\n            <br><br>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"col-md-12\">\n            <ag-grid-ng2 #agGrid style=\"height: 400px;\" class=\"ag-blue\" [gridOptions]=\"gridOptions\"></ag-grid-ng2>\n        </div>\n    </div>\n\n    <div class=\"row\">\n        <div class=\"col-md-2\">\n            <searcher (onSearchTermEntered) = \"onSearchTermEntered($event)\"></searcher>\n        </div>\n        <div class=\"col-md-2 col-md-offset-4\">    \n            Rows: {{rowsDisplayed}}\n        </div>\n    </div>\n    "
        }),
        __param(0, core_1.Inject(customer_account_service_1.CustomerAccountService)), 
        __metadata('design:paramtypes', [customer_account_service_1.CustomerAccountService])
    ], CustomerAccountList);
    return CustomerAccountList;
}(component_base_1.ComponentBase));
exports.CustomerAccountList = CustomerAccountList;
//# sourceMappingURL=customer-account-list.js.map