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
var http_helper_1 = require('../../common/service/http-helper');
var core_1 = require('@angular/core');
var UserService = (function () {
    function UserService(httpHelper) {
        this.httpHelper = httpHelper;
    }
    UserService.prototype.getUserApplications = function () {
        return this.httpHelper.makeHttpCall('AngularAdmin/GetUserApplications', '', 'GET')
            .map(function (response) { return response.json(); });
    };
    UserService = __decorate([
        __param(0, core_1.Inject(http_helper_1.HttpHelper)), 
        __metadata('design:paramtypes', [http_helper_1.HttpHelper])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user-service.js.map