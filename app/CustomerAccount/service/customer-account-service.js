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
var core_1 = require('@angular/core');
var http_helper_1 = require('../../common/service/http-helper');
var CustomerAccountService = (function () {
    function CustomerAccountService(httpHelper) {
        this.httpHelper = httpHelper;
    }
    CustomerAccountService.prototype.makeFileRequest = function (data) {
        return new Promise(function (resolve, reject) {
            var fd = new FormData();
            fd.append("account", data.account);
            fd.append("accountID", data.accountID);
            fd.append("accountName", data.accountName);
            fd.append("fileData", data.filesToUpload[0]);
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(xhr.response);
                    }
                    else {
                        reject(xhr.statusText);
                    }
                }
            };
            var appPath = location.pathname.split('/')[1];
            var url = "/" + appPath + "/AngularAdmin/AddCustomerAccountAudio";
            xhr.open("POST", url, true);
            xhr.send(fd);
        });
    };
    CustomerAccountService.prototype.getCustomerAccounts = function () {
        return this.httpHelper.makeHttpCall('AngularAdmin/GetCustomerAccounts', '', 'GET');
    };
    CustomerAccountService.prototype.AccountNumberValid = function (val) {
        return this.httpHelper.makeHttpCall('AngularAdmin/AccountNumberValid', JSON.stringify({ val: val }), 'POST');
    };
    CustomerAccountService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(http_helper_1.HttpHelper)), 
        __metadata('design:paramtypes', [http_helper_1.HttpHelper])
    ], CustomerAccountService);
    return CustomerAccountService;
}());
exports.CustomerAccountService = CustomerAccountService;
//# sourceMappingURL=customer-account-service.js.map