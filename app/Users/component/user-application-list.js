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
var user_service_1 = require('../service/user-service');
var auth_service_1 = require('../../common/service/auth-service');
var router_deprecated_1 = require('@angular/router-deprecated');
var component_base_1 = require('../../common/component/component-base');
var UserApplicationList = (function (_super) {
    __extends(UserApplicationList, _super);
    function UserApplicationList(userService) {
        _super.call(this);
        this.userService = userService;
        this.gridOptions = [];
        this.searchTerm = "";
        this.columnDefs = [
            { headerName: "UserName", field: "UserName" },
            { headerName: "AppName", field: "strApplicationName", width: 300 },
            { headerName: "App#", field: "AppNumber" }
        ];
        this.gridOptions = {
            columnDefs: this.columnDefs,
            enableColResize: true,
            enableSorting: true,
            enableFilter: false,
            overlayNoRowsTemplate: "<span style='padding: 10px; border: 1px solid #444; background: lightgoldenrodyellow;'>No results</span>",
            overlayLoadingTemplate: "<span style='padding: 10px; border: 1px solid #444; background: lightgoldenrodyellow;'><i class='fa fa-spinner fa-spin'></i> Loading...</span>",
        };
        this.getUserApplications();
    }
    UserApplicationList.prototype.showRowMessage = function () {
        var model = this.gridOptions.api.getModel();
        var processedRows = model.getRowCount();
        this.rowsDisplayed = processedRows + " of " + this.userApplications.length;
        this.gridOptions.api.hideOverlay();
        if (processedRows < 1) {
            //show overlay of no rows
            this.gridOptions.api.showNoRowsOverlay();
        }
    };
    UserApplicationList.prototype.onSearchTermEntered = function (filterValue) {
        console.log(filterValue);
        this.gridOptions.api.setQuickFilter(filterValue);
        this.showRowMessage();
    };
    UserApplicationList.prototype.getUserApplications = function () {
        var _this = this;
        this.userService.getUserApplications()
            .subscribe(function (ua) {
            _this.userApplications = ua;
            if (_this.gridOptions.api) {
                _this.gridOptions.api.setRowData(_this.userApplications);
                _this.gridOptions.api.sizeColumnsToFit();
                _this.showRowMessage();
            }
        }, function (err) {
            _this.gridOptions.api.hideOverlay();
            _this.showErrors(err, 'Error retrieving user list');
        });
    };
    UserApplicationList = __decorate([
        core_1.Component({
            directives: [main_1.AgGridNg2, searcher_1.SearchComponent],
            providers: [user_service_1.UserService],
            template: "\n        \n\n\n    <div class=\"row\">\n        <div class=\"col-md-5\">\n            <ag-grid-ng2 #agGrid style=\"height: 350px;width: 700px;\" class=\"ag-blue\" [gridOptions]=\"gridOptions\"></ag-grid-ng2>\n        </div>\n    </div>\n\n    <div class=\"row\">\n        <div class=\"col-md-2\">\n            <searcher (onSearchTermEntered) = \"onSearchTermEntered($event)\"></searcher>\n        </div>\n        <div class=\"col-md-2 text-right\">    \n            {{rowsDisplayed}}\n        </div>\n    </div>\n    "
        }),
        router_deprecated_1.CanActivate(function (next, previous) {
            var injector = core_1.ReflectiveInjector.resolveAndCreate([auth_service_1.AuthService]);
            var authService = injector.get(auth_service_1.AuthService);
            return authService.checkLogin(next, previous);
        }),
        __param(0, core_1.Inject(user_service_1.UserService)), 
        __metadata('design:paramtypes', [user_service_1.UserService])
    ], UserApplicationList);
    return UserApplicationList;
}(component_base_1.ComponentBase));
exports.UserApplicationList = UserApplicationList;
//# sourceMappingURL=user-application-list.js.map